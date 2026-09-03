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
    
    const { 
      action, channel, token, uid, agentId, resourceId, sid,
      recWidth = 1280, recHeight = 720, recBitrate = 2260, recFps = 30, recLayout = 1, idleTime = 120,
      region = 'ap', expiresAfter = 3600, templateId = '', targetUid
    } = body;

    if (action === 'generate-token') {
      if (!APP_ID || !APP_CERTIFICATE) throw new Error('伺服器遺失憑證設定');
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const privilegeExpiredTs = currentTimestamp + 3600;
      const generatedToken = RtcTokenBuilder.buildTokenWithUid(
        APP_ID, APP_CERTIFICATE, channel, 0, RtcRole.PUBLISHER, privilegeExpiredTs, privilegeExpiredTs
      );
      return NextResponse.json({ success: true, token: generatedToken, appId: APP_ID, s3BaseUrl: process.env.AWS_S3_BASE_URL });
    }

    let targetUrl = '';
    let payload: any = null; 
    let method = 'POST';     

    switch (action) {
      case 'query-template':
        targetUrl = `https://api.agora.io/${region}/v1/projects/${APP_ID}/rtls/ingress/stream-templates/${templateId}`;
        method = 'GET';
        payload = null;
        break;

      // ✨ 新增：查詢全部 Template
      case 'query-all-templates':
        targetUrl = `https://api.agora.io/${region}/v1/projects/${APP_ID}/rtls/ingress/stream-templates`;
        method = 'GET';
        payload = null;
        break;

      case 'generate-stream-key':
        targetUrl = `https://api.agora.io/${region}/v1/projects/${APP_ID}/rtls/ingress/streamkeys`;
        method = 'POST';
        payload = { settings: { channel: channel, uid: uid, expiresAfter: Number(expiresAfter), templateId: templateId } };
        break;

      case 'start-stt':
        targetUrl = `https://api.agora.io/api/speech-to-text/v1/projects/${APP_ID}/join`;
        method = 'POST';
        payload = {
          languages: ["zh-TW"], name: "agora-rtt-test", maxIdleTime: 60,
          rtcConfig: {
            channelName: channel,
            subBotUid: String(Math.floor(Math.random() * 899999) + 100000),
            pubBotUid: String(Math.floor(Math.random() * 899999) + 100000),
            subBotToken: token || undefined, pubBotToken: token || undefined
          },
          recognizeConfig: { enableJsonProtocol: true }
        };
        break;

      case 'stop-stt':
        targetUrl = `https://api.agora.io/api/speech-to-text/v1/projects/${APP_ID}/agents/${agentId}/leave`;
        method = 'POST';
        payload = null;
        break;

      case 'acquire-recording':
        targetUrl = `https://api.agora.io/v1/apps/${APP_ID}/cloud_recording/acquire`;
        method = 'POST';
        payload = { cname: channel, uid: uid, clientRequest: { resourceExpiredHour: 24, scene: 0 } };
        break;

      case 'start-recording':
        targetUrl = `https://api.agora.io/v1/apps/${APP_ID}/cloud_recording/resourceid/${resourceId}/mode/mix/start`;
        method = 'POST';
        const recordingConfig: any = {
          maxIdleTime: Number(idleTime), streamTypes: 2, channelType: 0,
          transcodingConfig: { 
            height: Number(recHeight), width: Number(recWidth), bitrate: Number(recBitrate), fps: Number(recFps), mixedVideoLayout: Number(recLayout) 
          }
        };

        if (targetUid) {
          recordingConfig.subscribeVideoUids = [`${targetUid}`];
          recordingConfig.subscribeAudioUids = [`${targetUid}`];
        }

        payload = {
          uid: uid, cname: channel,
          clientRequest: {
            token: token || undefined,
            recordingConfig: recordingConfig,
            recordingFileConfig: { avFileType: ["hls", "mp4"] },
            storageConfig: {
              vendor: Number(process.env.CLOUD_RECORDING_VENDOR) || 1, 
              region: Number(process.env.AWS_REGION_CODE) || 9, 
              bucket: process.env.AWS_S3_BUCKET_NAME,
              accessKey: process.env.AWS_ACCESS_KEY_ID, 
              secretKey: process.env.AWS_SECRET_ACCESS_KEY,
              fileNamePrefix: [process.env.AWS_S3_PREFIX || "cloudRecording"]
            }
          }
        };
        break;

      case 'stop-recording':
        targetUrl = `https://api.agora.io/v1/apps/${APP_ID}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/mix/stop`;
        method = 'POST';
        payload = { cname: channel, uid: uid, clientRequest: {} };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const fetchOptions: any = { method, headers: getAuthHeaders() };
    if (payload !== null) fetchOptions.body = JSON.stringify(payload);

    const response = await fetch(targetUrl, fetchOptions);

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