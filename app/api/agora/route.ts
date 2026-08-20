import { NextResponse } from 'next/server';
import { RtcTokenBuilder, RtcRole } from 'agora-token';

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;
const CUSTOMER_ID = process.env.AGORA_CUSTOMER_ID;
const CUSTOMER_SECRET = process.env.AGORA_CUSTOMER_SECRET;

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Basic ${Buffer.from(`${CUSTOMER_ID}:${CUSTOMER_SECRET}`).toString('base64')}`
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, channel, token, uid, agentId, resourceId, sid } = body;

    // ==========================================
    // 獨立處理：Token 自動簽發邏輯 (007 版本)
    // ==========================================
    if (action === 'generate-token') {
      if (!APP_ID || !APP_CERTIFICATE) throw new Error('伺服器遺失憑證設定');
      
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const privilegeExpiredTs = currentTimestamp + 3600;

      const generatedToken = RtcTokenBuilder.buildTokenWithUid(
        APP_ID, APP_CERTIFICATE, channel, 0, RtcRole.PUBLISHER, privilegeExpiredTs, privilegeExpiredTs
      );
      
      // ✨ 關鍵修改：將前端需要的參數一併從後端安全派發！
      return NextResponse.json({ 
        success: true, 
        token: generatedToken,
        appId: APP_ID,
        s3BaseUrl: process.env.AWS_S3_BASE_URL
      });
    }

    // ==========================================
    // 原有邏輯：處理 REST API (STT & 錄影)
    // ==========================================
    let targetUrl = '';
    let payload = {};

    switch (action) {
      case 'start-stt':
        targetUrl = `https://api.agora.io/api/speech-to-text/v1/projects/${APP_ID}/join`;
        payload = {
          languages: ["zh-TW"], name: "agora-rtt-test", maxIdleTime: 60,
          rtcConfig: {
            channelName: channel,
            subBotUid: String(Math.floor(Math.random() * 899999) + 100000),
            pubBotUid: String(Math.floor(Math.random() * 899999) + 100000),
            subBotToken: token || undefined,
            pubBotToken: token || undefined
          },
          recognizeConfig: { enableJsonProtocol: true }
        };
        break;

      case 'stop-stt':
        targetUrl = `https://api.agora.io/api/speech-to-text/v1/projects/${APP_ID}/agents/${agentId}/leave`;
        break;

      case 'acquire-recording':
        targetUrl = `https://api.agora.io/v1/apps/${APP_ID}/cloud_recording/acquire`;
        payload = { cname: channel, uid: uid, clientRequest: { resourceExpiredHour: 24, scene: 0 } };
        break;

      case 'start-recording':
        targetUrl = `https://api.agora.io/v1/apps/${APP_ID}/cloud_recording/resourceid/${resourceId}/mode/mix/start`;
        payload = {
          uid: uid, cname: channel,
          clientRequest: {
            token: token || undefined,
            recordingConfig: {
              maxIdleTime: 120, streamTypes: 2, channelType: 0,
              transcodingConfig: { height: 720, width: 1280, bitrate: 2260, fps: 30, mixedVideoLayout: 1 }
            },
            recordingFileConfig: { avFileType: ["hls", "mp4"] },
            storageConfig: {
              vendor: 1, region: 9, bucket: process.env.AWS_S3_BUCKET_NAME,
              accessKey: process.env.AWS_ACCESS_KEY_ID, secretKey: process.env.AWS_SECRET_ACCESS_KEY,
              fileNamePrefix: ["cloudRecording"]
            }
          }
        };
        break;

      case 'stop-recording':
        targetUrl = `https://api.agora.io/v1/apps/${APP_ID}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/mix/stop`;
        payload = { cname: channel, uid: uid, clientRequest: {} };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: Object.keys(payload).length > 0 ? JSON.stringify(payload) : undefined
    });

    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return NextResponse.json({ success: true });
    }
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Agora API Error');
    
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}