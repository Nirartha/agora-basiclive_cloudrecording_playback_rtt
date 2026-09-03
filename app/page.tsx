'use client';

import { useState, useRef, useEffect } from 'react';
import Hls from 'hls.js';

// ==========================================
// 雙語字典 (Dictionary)
// ==========================================
const locales = {
  zh: {
    title: "Agora 直播與雲端錄製展示",
    lobbyTitle: "展示大廳 (Lobby)",
    lobbyDesc: "確認並設定您的 RTC 頻道參數後，即可進入展示儀表板。",
    videoQuality: "雲端錄影畫質 (Video Profile)",
    q720p: "720p 高畫質 (推薦預設)",
    q1080p: "1080p 全高清",
    q480p: "480p 順暢省流量",
    recLayout: "雲端錄影排版 (Mixed Layout)",
    layoutGrid: "自適應網格 (Grid)",
    layoutFloat: "懸浮子母畫面 (Floating)",
    idleTime: "閒置超時自動停止 (Max Idle Time)",
    idleUnit: "秒",
    enterDemoBtn: "進入展示儀表板 🚀",
    backToLobby: "返回設定",
    coreSettings: "核心操作面板",
    channelName: "房間名稱 (Channel)",
    localUidLabel: "本機 UID (Local UID)",
    latencyUltra: "極速直播 (~400ms)",
    latencyStandard: "標準直播 (~1.5s)",
    hostUidBadge: "主播 UID",
    
    mgTitle: "Media Gateway (RTMP 推流設定)",
    mgDesc: "產生一組專屬的 Stream Key，讓外部導播軟體 (如 OBS) 可以透過 RTMP 協定推流至您的 Agora RTC 頻道中。",
    mgRegion: "伺服器區域 (Region)",
    mgUid: "虛擬主播 UID (推流者)",
    mgExpires: "過期時間 (秒)",
    mgTemplate: "模板 ID (Template ID)",
    mgReqPreview: "Request Payload (預期送出內容預覽)",
    mgResPreview: "Response Data (伺服器回傳結果預覽)",
    mgGenerateBtn: "取得 Stream Key",
    mgGenerating: "產生中...",
    mgQueryBtn: "查詢當前模板",
    mgQuerying: "查詢中...",
    mgQueryAllBtn: "查詢全部模板",
    mgQueryingAll: "查詢中...",
    mgStreamKeyResult: "🚀 您的 Stream Key",
    mgCopy: "複製",
    mgCopied: "已複製!",
    
    tplInfoTitle: "Template 解析資訊",
    tplBaseVideo: "基礎視訊 (Base Video)",
    tplCodec: "編碼格式 (Codec)",
    tplAudio: "音訊轉碼 (Audio)",
    tplSimulcast: "大小流設定 (Simulcast Layers)",
    tplRawJson: "查看完整 Raw JSON",
    applyBtn: "套用",

    configDetails: "詳細環境配置 (Configuration Details)",
    waitingToken: "尚未加入頻道，無 Token",
    waitingS3: "尚未開始錄製...",
    waitingRtmp: "正在等待導播軟體 (RTMP) 推流...",
    videoQualityLabel: "錄影解析度",
    layoutLabel: "排版模式",
    idleTimeLabel: "閒置超時設定",

    tokenReadonly: "後端自動簽發 Token (唯讀)",
    tokenTitle: "由 Next.js 後端安全產生",
    s3UrlReadonly: "S3 雲端儲存路徑 (唯讀)",
    s3UrlTitle: "HLS 影片存檔位置",
    
    joinAsHostBtn: "以主播身份加入",
    joinAsAudienceBtn: "以觀眾身份加入",
    leaveBtn: "離開頻道",
    startSttBtn: "開啟字幕",
    stopSttBtn: "停止字幕",
    startRecBtn: "開始錄製",
    stopRecBtn: "停止錄製",
    loadHlsBtn: "載入 HLS 回放",
    mediaMonitor: "影音即時監控與回放中心",
    localPreview: "本地端直播預覽 (RTC Live)",
    cloudPlayback: "雲端 HLS 回放模式",
    backToLive: "🔴 返回直播",
    systemLogs: "系統狀態日誌 (System Logs)",
    notJoined: "尚未加入頻道",
    cameraOff: "關閉鏡頭",
    cameraOn: "開啟鏡頭",
    mute: "靜音",
    unmute: "解除靜音",
    cameraMask: "鏡頭已關閉",
    clickLeftToLoad: "請點擊左側「載入 HLS 回放」按鈕",
    hlsNotLoaded: "未載入",
    hlsLoading: "連線中...",
    hlsPlaying: "LIVE (回放中)",
    hlsSafari: "LIVE (Safari原生)",
    hlsError: "載入失敗",
    hlsGenerating: "字幕快照生成中...",
    alertChannel: "請輸入房間名稱",
    alertStopFirst: "請先停止錄製與字幕任務後再離開頻道！",
    alertNoSid: "目前沒有錄製紀錄 (缺乏 SID)！請先開始錄製。",
    log: {
      reqToken: "向伺服器請求安全 Token 與系統參數...",
      initAgora: "初始化 Agora 連線...",
      joinSuccess: "✅ 已加入頻道！",
      leaveCheck: "準備離開頻道，正在檢查執行中的任務...",
      autoStopRec: "正在自動停止錄製任務...",
      autoStopRecSuccess: "✅ 自動停止錄製成功。",
      autoStopStt: "正在自動停止即時字幕...",
      autoStopSttSuccess: "✅ 自動停止字幕成功。",
      closeRtc: "正在關閉影音軌道與 RTC 連線...",
      leaveSuccess: "✅ 已完全離開頻道。",
      startStt: "啟動即時字幕...",
      startSttSuccess: "✅ 即時字幕已啟動！",
      stopStt: "正在停止即時字幕...",
      stopSttSuccess: "✅ 即時字幕已停止。",
      startRec: "啟動雲端錄製...",
      startRecSuccess: "✅ 雲端錄製已啟動！",
      stopRec: "正在停止錄製任務...",
      stopRecSuccess: "✅ 錄製已安全結束。",
      packVtt: "正在打包 VTT 字幕...",
      uploadVttSuccess: "✅ VTT 字幕檔成功上傳至 S3！",
      snapVtt: "正在產生即時字幕快照...",
      loadVtt: "錄製已結束，載入最終版 VTT 字幕...",
      errPrefix: "❌ 失敗:"
    }
  },
  en: {
    title: "Agora Live & Cloud Recording Demo",
    lobbyTitle: "Lobby - Setup",
    lobbyDesc: "Confirm and configure your RTC channel parameters before entering the dashboard.",
    videoQuality: "Cloud Recording Quality",
    q720p: "720p HD (Default)",
    q1080p: "1080p Full HD",
    q480p: "480p SD (Data Saver)",
    recLayout: "Mixed Video Layout",
    layoutGrid: "Adaptive Grid",
    layoutFloat: "Floating PiP",
    idleTime: "Max Idle Time (Auto Stop)",
    idleUnit: "sec",
    enterDemoBtn: "Enter Dashboard 🚀",
    backToLobby: "Back to Settings",
    coreSettings: "Core Operations",
    channelName: "Channel Name",
    localUidLabel: "Local UID",
    latencyUltra: "Ultra Low (~400ms)",
    latencyStandard: "Standard (~1.5s)",
    hostUidBadge: "Host UID",
    
    mgTitle: "Media Gateway (RTMP to RTC)",
    mgDesc: "Generate a Stream Key to allow external broadcasting software (like OBS) to push RTMP streams into your Agora RTC channel.",
    mgRegion: "Server Region",
    mgUid: "Virtual Host UID",
    mgExpires: "Expires After (sec)",
    mgTemplate: "Template ID",
    mgReqPreview: "Request Payload (Preview)",
    mgResPreview: "Response Data (Preview)",
    mgGenerateBtn: "Generate Stream Key",
    mgGenerating: "Generating...",
    mgQueryBtn: "Query Current Template",
    mgQuerying: "Querying...",
    mgQueryAllBtn: "Query All Templates",
    mgQueryingAll: "Querying...",
    mgStreamKeyResult: "🚀 Your Stream Key",
    mgCopy: "Copy",
    mgCopied: "Copied!",
    
    tplInfoTitle: "Template Parsed Info",
    tplBaseVideo: "Base Video",
    tplCodec: "Codec",
    tplAudio: "Audio",
    tplSimulcast: "Simulcast Layers",
    tplRawJson: "View Raw JSON",
    applyBtn: "Apply",

    configDetails: "Configuration Details",
    waitingToken: "Not joined, no Token yet",
    waitingS3: "Recording not started...",
    waitingRtmp: "Waiting for RTMP stream...",
    videoQualityLabel: "Video Profile",
    layoutLabel: "Layout Mode",
    idleTimeLabel: "Max Idle Time",

    tokenReadonly: "Auto-Generated Token (Read-only)",
    tokenTitle: "Securely generated by Next.js Backend",
    s3UrlReadonly: "S3 Cloud Storage URL (Read-only)",
    s3UrlTitle: "HLS Video Storage Location",
    
    joinAsHostBtn: "Join as Host",
    joinAsAudienceBtn: "Join as Audience",
    leaveBtn: "Leave Channel",
    startSttBtn: "Start STT",
    stopSttBtn: "Stop STT",
    startRecBtn: "Start Recording",
    stopRecBtn: "Stop Recording",
    loadHlsBtn: "Load HLS Playback",
    mediaMonitor: "Media Monitor & Playback Center",
    localPreview: "Local Stream Preview (RTC Live)",
    cloudPlayback: "Cloud HLS Playback Mode",
    backToLive: "🔴 Back to Live",
    systemLogs: "System Logs",
    notJoined: "Not joined channel yet",
    cameraOff: "Turn Off Camera",
    cameraOn: "Turn On Camera",
    mute: "Mute",
    unmute: "Unmute",
    cameraMask: "Camera is off",
    clickLeftToLoad: "Please click 'Load Playback' on the left",
    hlsNotLoaded: "Not Loaded",
    hlsLoading: "Connecting...",
    hlsPlaying: "LIVE (Playback)",
    hlsSafari: "LIVE (Safari Native)",
    hlsError: "Load Failed",
    hlsGenerating: "Generating VTT Snapshot...",
    alertChannel: "Please enter a channel name",
    alertStopFirst: "Please stop recording and STT before leaving the channel!",
    alertNoSid: "No recording record (Missing SID)! Please start recording first.",
    log: {
      reqToken: "Requesting secure Token and config from server...",
      initAgora: "Initializing Agora connection...",
      joinSuccess: "✅ Joined channel successfully!",
      leaveCheck: "Leaving channel, checking running tasks...",
      autoStopRec: "Auto-stopping recording task...",
      autoStopRecSuccess: "✅ Auto-stopped recording successfully.",
      autoStopStt: "Auto-stopping STT...",
      autoStopSttSuccess: "✅ Auto-stopped STT successfully.",
      closeRtc: "Closing media tracks and RTC connection...",
      leaveSuccess: "✅ Left channel completely.",
      startStt: "Starting Real-time STT...",
      startSttSuccess: "✅ Real-time STT started!",
      stopStt: "Stopping Real-time STT...",
      stopSttSuccess: "✅ Real-time STT stopped.",
      startRec: "Starting Cloud Recording...",
      startRecSuccess: "✅ Cloud Recording started!",
      stopRec: "Stopping recording task...",
      stopRecSuccess: "✅ Recording stopped safely.",
      packVtt: "Packaging VTT subtitles...",
      uploadVttSuccess: "✅ VTT file successfully uploaded to S3!",
      snapVtt: "Generating real-time VTT snapshot...",
      loadVtt: "Recording ended, loading final VTT subtitles...",
      errPrefix: "❌ Failed:"
    }
  }
};

export default function LiveDemoPage() {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const t = locales[lang];
  const tLog = t.log;

  const [step, setStep] = useState<'lobby' | 'dashboard'>('lobby');

  const [localUid] = useState(() => Math.floor(Math.random() * 899999) + 100000);

  const [channel, setChannel] = useState('');
  const [profile, setProfile] = useState<'720p' | '1080p' | '480p'>('720p');
  const [layout, setLayout] = useState('1'); 
  const [idle, setIdle] = useState(120);

  const [mgRegion, setMgRegion] = useState('ap');
  const [mgUid, setMgUid] = useState('777');
  const [mgExpires, setMgExpires] = useState(3600);
  const [mgTemplate, setMgTemplate] = useState('dennisTest01');
  const [streamKey, setStreamKey] = useState('');
  const [isGeneratingMg, setIsGeneratingMg] = useState(false);
  const [mgReqExpanded, setMgReqExpanded] = useState(false);
  const [mgResExpanded, setMgResExpanded] = useState(false);
  const [mgResponseData, setMgResponseData] = useState<any>(null);
  const [isKeyCopied, setIsKeyCopied] = useState(false);

  const [isQueryingTpl, setIsQueryingTpl] = useState(false);
  const [isQueryingAll, setIsQueryingAll] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [expandedTpls, setExpandedTpls] = useState<Record<string, boolean>>({});
  const [tplRawExpandedList, setTplRawExpandedList] = useState<Record<string, boolean>>({});

  const [tplData, setTplData] = useState<any>(null);
  const [tplRawExpanded, setTplRawExpanded] = useState(false);
  const [tplInfoExpanded, setTplInfoExpanded] = useState(true); 

  const [isConfigExpanded, setIsConfigExpanded] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  const logsEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const [isJoined, setIsJoined] = useState(false);
  const [currentRole, setCurrentRole] = useState<'host' | 'audience' | null>(null); 
  const [showAudienceMenu, setShowAudienceMenu] = useState(false);
  
  const [isSttRunning, setIsSttRunning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hlsStatus, setHlsStatus] = useState(t.hlsNotLoaded);
  const [viewMode, setViewMode] = useState<'live' | 'playback'>('live');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [displayToken, setDisplayToken] = useState('');
  const [displayS3Url, setDisplayS3Url] = useState('');

  const [hasRemoteVideo, setHasRemoteVideo] = useState(false);
  // ✨ 紀錄遠端主播的 UID
  const [remoteHostUid, setRemoteHostUid] = useState<string | number | null>(null);

  const rtcRef = useRef<any>({ client: null, localAudioTrack: null, localVideoTrack: null });
  const tokenRef = useRef(''); 
  const sysConfigRef = useRef({ appId: '', s3BaseUrl: '' });
  const rttAgentIdRef = useRef(''); 
  const recRef = useRef({ resourceId: '', sid: '', uid: '' }); 
  const vttRef = useRef({ startTime: 0 as number | null, subtitles: [] as any[] });
  const hlsInstanceRef = useRef<any>(null);
  
  useEffect(() => {
    setChannel(`demo_${Math.random().toString(36).substring(2, 8)}`);
  }, []);

  useEffect(() => {
    if (!rtcRef.current.client) return;
    const targetVolume = viewMode === 'playback' ? 0 : 100;
    rtcRef.current.client.remoteUsers.forEach((user: any) => {
      if (user.audioTrack) {
        user.audioTrack.setVolume(targetVolume);
      }
    });
  }, [viewMode]);

  const printLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const fetchBackend = async (url: string, body: any, isText = false) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: isText ? { 'X-File-Name': body.fileName } : { 'Content-Type': 'application/json' },
      body: isText ? body.text : JSON.stringify(body)
    });
    
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'API Error');
      return data;
    } else {
      throw new Error(`Connection Error (${res.status})`);
    }
  };

  const handleGenerateStreamKey = async () => {
    if (!channel) return alert(t.alertChannel);
    setIsGeneratingMg(true);
    setMgResExpanded(false); 
    setIsKeyCopied(false);
    
    // ✨ 產生 Stream Key 時，強制將單一與所有列表 Template 全部收合
    setTplInfoExpanded(false);
    setExpandedTpls(prev => {
      const collapsed: Record<string, boolean> = {};
      Object.keys(prev).forEach(k => collapsed[k] = false);
      return collapsed;
    });

    try {
      const res = await fetchBackend('/api/agora', {
        action: 'generate-stream-key', region: mgRegion, channel: channel, uid: mgUid, expiresAfter: mgExpires, templateId: mgTemplate
      });
      setMgResponseData(res);
      if (res.data && res.data.streamKey) {
        setStreamKey(res.data.streamKey);
      }
    } catch (err: any) { alert(`${tLog.errPrefix} ${err.message}`); } 
    finally { setIsGeneratingMg(false); }
  };

  const handleCopyStreamKey = () => {
    if (streamKey) {
      navigator.clipboard.writeText(streamKey);
      setIsKeyCopied(true);
      setTimeout(() => setIsKeyCopied(false), 2500);
    }
  };

  const handleQueryTemplate = async () => {
    if (!mgTemplate) return alert("請先輸入 Template ID");
    setIsQueryingTpl(true);
    setTplRawExpanded(false);
    setTplInfoExpanded(true); 

    // 清空「查詢全部」的狀態，避免畫面重疊
    setTemplates([]); 

    try {
      const res = await fetchBackend('/api/agora', {
        action: 'query-template', region: mgRegion, templateId: mgTemplate
      });
      if (res.data) {
        setTplData(res.data);
      }
    } catch (err: any) { alert(`${tLog.errPrefix} ${err.message}`); } 
    finally { setIsQueryingTpl(false); }
  };

  const handleQueryAllTemplates = async () => {
    setIsQueryingAll(true);

    // 清空「查詢當前」的狀態，避免畫面重疊
    setTplData(null); 

    try {
      const res = await fetchBackend('/api/agora', {
        action: 'query-all-templates', region: mgRegion
      });
      if (res.data && Array.isArray(res.data)) {
        setTemplates(res.data);
        const initialExpand: Record<string, boolean> = {};
        const initialRaw: Record<string, boolean> = {};
        res.data.forEach((tpl: any) => {
           initialExpand[tpl.id] = true; 
           initialRaw[tpl.id] = false;
        });
        setExpandedTpls(initialExpand);
        setTplRawExpandedList(initialRaw);
      }
    } catch (err: any) { alert(`${tLog.errPrefix} ${err.message}`); } 
    finally { setIsQueryingAll(false); }
  };

  const toggleTpl = (id: string) => {
    setExpandedTpls(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleTplRaw = (id: string) => {
    setTplRawExpandedList(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getAgoraRTC = async () => {
    const module = await import('agora-rtc-sdk-ng');
    return module.default || module;
  };

  const formatVttTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const msStr = Math.floor(ms % 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(msStr).padStart(3, '0')}`;
  };

  const uploadVttSnapshot = async (sid: string) => {
    if (vttRef.current.subtitles.length === 0) return;
    printLog(tLog.packVtt);
    let vttString = "WEBVTT\n\n";
    vttRef.current.subtitles.forEach((sub, index) => {
        vttString += `${index + 1}\n${sub.start} --> ${sub.end}\n${sub.text}\n\n`;
    });
    try {
      const fileName = `cloudRecording/${sid}_${channel}.vtt`;
      await fetchBackend('/api/s3', { fileName, text: vttString }, true);
      printLog(tLog.uploadVttSuccess);
    } catch (e: any) { printLog(`${tLog.errPrefix} ${e.message}`); }
  };

  const handleStreamMessage = (uid: number, payload: Uint8Array) => {
    try {
      const textStr = new TextDecoder().decode(payload);
      const structMatch = textStr.match(/\n.([\u4e00-\u9fa5a-zA-Z0-9，。！？,.!?\s]+)\x10/);
      let cleanText = structMatch && structMatch[1] ? structMatch[1].trim() : "";
      cleanText = cleanText.replace(/transcribez?/gi, '').replace(/zh-?TW/gi, '').replace(/^[!！]+/, '').trim();
      if (cleanText.length > 1) {
        const subtitleEl = document.getElementById('global-subtitle-text');
        if (subtitleEl) {
          subtitleEl.innerText = cleanText;
          setTimeout(() => { subtitleEl.innerText = ""; }, 3000);
        }
        if (vttRef.current.startTime) {
            const currentMs = Date.now() - vttRef.current.startTime;
            const endMs = currentMs + 3000;
            const subs = vttRef.current.subtitles;
            const lastSub = subs[subs.length - 1];
            const isSameSentence = lastSub && (currentMs - lastSub.rawStartMs) < 1500 && !/[。！？.!?]$/.test(lastSub.text.trim());

            if (isSameSentence) {
                lastSub.text = cleanText;
                lastSub.end = formatVttTime(endMs);
                lastSub.rawEndMs = endMs; 
            } else {
                if (lastSub && lastSub.rawEndMs >= currentMs) {
                    lastSub.end = formatVttTime(currentMs - 1);
                    lastSub.rawEndMs = currentMs - 1;
                }
                subs.push({
                    rawStartMs: currentMs, rawEndMs: endMs,
                    start: formatVttTime(currentMs), end: formatVttTime(endMs), text: cleanText
                });
            }
        }
      }
    } catch (e) { console.warn(e); }
  };

  const toggleVideo = async () => {
    if (rtcRef.current.localVideoTrack) {
      await rtcRef.current.localVideoTrack.setEnabled(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = async () => {
    if (rtcRef.current.localAudioTrack) {
      await rtcRef.current.localAudioTrack.setMuted(!isAudioMuted);
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const handleJoin = async (role: 'host' | 'audience', latency: 1 | 2 = 1) => {
    if (!channel) return alert(t.alertChannel);
    try {
      printLog(tLog.reqToken);
      const tokenRes = await fetchBackend('/api/agora', { action: 'generate-token', channel });
      tokenRef.current = tokenRes.token;
      sysConfigRef.current.appId = tokenRes.appId;
      sysConfigRef.current.s3BaseUrl = tokenRes.s3BaseUrl;
      setDisplayToken(tokenRes.token);

      printLog(tLog.initAgora);
      const AgoraRTC = await getAgoraRTC();
      rtcRef.current.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
      
      rtcRef.current.client.on("user-published", async (user: any, mediaType: "audio" | "video") => {
        await rtcRef.current.client.subscribe(user, mediaType);
        if (mediaType === "video") {
          setHasRemoteVideo(true);
          setRemoteHostUid(user.uid); // ✨ 記錄遠端畫面推流者的 UID
          user.videoTrack.play("local-player");
        }
        if (mediaType === "audio") {
          user.audioTrack.play();
          if (viewMode === 'playback') user.audioTrack.setVolume(0);
        }
      });

      rtcRef.current.client.on("user-unpublished", (user: any, mediaType: "audio" | "video") => {
        if (mediaType === "video") {
            setHasRemoteVideo(false);
            setRemoteHostUid(null); // ✨ 清除遠端 UID
        }
      });

      rtcRef.current.client.on("stream-message", handleStreamMessage);

      setCurrentRole(role); 

      if (role === 'audience') {
        await rtcRef.current.client.setClientRole("audience", { audienceLatencyLevel: latency });
        await rtcRef.current.client.join(sysConfigRef.current.appId, channel, tokenRef.current, localUid);
        printLog("進入觀眾模式，準備接收畫面...");
      } else {
        await rtcRef.current.client.setClientRole("host");
        await rtcRef.current.client.join(sysConfigRef.current.appId, channel, tokenRef.current, localUid);
        const [audio, video] = await AgoraRTC.createMicrophoneAndCameraTracks();
        rtcRef.current.localAudioTrack = audio;
        rtcRef.current.localVideoTrack = video;
        video.play("local-player");
        await rtcRef.current.client.publish([audio, video]);
      }
      
      setIsJoined(true);
      printLog(tLog.joinSuccess);
    } catch (err: any) {
      printLog(`${tLog.errPrefix} ${err.message}`);
    }
  };

  const handleLeave = async () => {
    printLog(tLog.leaveCheck);
    // 加上 recRef.current.sid 的防呆檢查
    if (isRecording && recRef.current.sid) {
      printLog(tLog.autoStopRec);
      try {
        await fetchBackend('/api/agora', { action: 'stop-recording', channel, ...recRef.current });
        await uploadVttSnapshot(recRef.current.sid);
        setIsRecording(false);
        vttRef.current.startTime = null;
        printLog(tLog.autoStopRecSuccess);
      } catch (err: any) { printLog(`${tLog.errPrefix} ${err.message}`); }
    }
    
    // 加上 rttAgentIdRef.current 的防呆檢查
    if (isSttRunning && rttAgentIdRef.current) {
      printLog(tLog.autoStopStt);
      try {
        await fetchBackend('/api/agora', { action: 'stop-stt', agentId: rttAgentIdRef.current });
        setIsSttRunning(false);
        rttAgentIdRef.current = '';
        printLog(tLog.autoStopSttSuccess);
      } catch (err: any) { printLog(`${tLog.errPrefix} ${err.message}`); }
    }

    printLog(tLog.closeRtc);
    if (rtcRef.current.localAudioTrack) {
      rtcRef.current.localAudioTrack.stop();
      rtcRef.current.localAudioTrack.close();
      rtcRef.current.localAudioTrack = null;
    }
    if (rtcRef.current.localVideoTrack) {
      rtcRef.current.localVideoTrack.stop();
      rtcRef.current.localVideoTrack.close();
      rtcRef.current.localVideoTrack = null;
    }
    if (rtcRef.current.client) {
      await rtcRef.current.client.leave();
    }
    
    const player = document.getElementById("local-player");
    if (player) player.innerHTML = ""; 
    setHasRemoteVideo(false);
    setRemoteHostUid(null); // ✨ 清除遠端 UID

    const hlsVideo = document.getElementById("hls-video-player") as HTMLVideoElement;
    if (hlsVideo && !hlsVideo.paused) {
      hlsVideo.pause();
      hlsVideo.removeAttribute('src'); 
    }
    if (hlsInstanceRef.current) {
      hlsInstanceRef.current.destroy();
      hlsInstanceRef.current = null;
    }
    
    setIsJoined(false);
    setCurrentRole(null);
    tokenRef.current = ''; 
    setIsVideoEnabled(true);
    setIsAudioMuted(false);
    setDisplayToken('');
    setDisplayS3Url('');
    setHlsStatus(t.hlsNotLoaded);
    setViewMode('live'); 
    printLog(tLog.leaveSuccess);
  };

  const toggleStt = async () => {
    if (isSttRunning) {
      printLog(tLog.stopStt);
      try {
        await fetchBackend('/api/agora', { action: 'stop-stt', agentId: rttAgentIdRef.current });
        setIsSttRunning(false);
        rttAgentIdRef.current = '';
        printLog(tLog.stopSttSuccess);
      } catch (err: any) { printLog(`${tLog.errPrefix} ${err.message}`); }
    } else {
      printLog(tLog.startStt);
      try {
        const sttRes = await fetchBackend('/api/agora', { action: 'start-stt', channel, token: tokenRef.current });
        // 加強相容性解析，把可能的回傳結構都包進去
        rttAgentIdRef.current = sttRes.agent_id || sttRes.agentId || sttRes.data?.agentId || '';
        // 如果依然沒抓到，可以直接在主控台印出來看 Agora 實際回傳了什麼
        console.log("STT Start Response:", sttRes);
        
        setIsSttRunning(true);
        printLog(tLog.startSttSuccess);
      } catch (err: any) { printLog(`${tLog.errPrefix} ${err.message}`); }
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      printLog(tLog.stopRec);
      try {
        await fetchBackend('/api/agora', { action: 'stop-recording', channel, ...recRef.current });
        await uploadVttSnapshot(recRef.current.sid);
        setIsRecording(false);
        vttRef.current.startTime = null;
        printLog(tLog.stopRecSuccess);
      } catch (err: any) { printLog(`${tLog.errPrefix} ${err.message}`); }
    } else {
      printLog(tLog.startRec);
      try {
        vttRef.current.subtitles = []; 
        const recUid = String(Math.floor(Math.random() * 899999) + 100000);
        const acqRes = await fetchBackend('/api/agora', { action: 'acquire-recording', channel, uid: recUid });
        
        let recWidth = 1280, recHeight = 720, recFps = 30, recBitrate = 2260;
        if (profile === '1080p') { recWidth = 1920; recHeight = 1080; recBitrate = 3150; }
        if (profile === '480p') { recWidth = 848; recHeight = 480; recBitrate = 1200; }

        const targetUid = (currentRole === 'audience' && streamKey) ? mgUid : undefined;

        const recRes = await fetchBackend('/api/agora', { 
            action: 'start-recording', channel, token: tokenRef.current, uid: recUid, resourceId: acqRes.resourceId,
            recWidth, recHeight, recFps, recBitrate, recLayout: Number(layout), idleTime: idle, targetUid
        });

        // 加強相容性解析
        const finalSid = recRes.sid || recRes.data?.sid || '';
        console.log("Recording Start Response:", recRes); // 找不到 sid 時可以看這裡
        
        recRef.current = { resourceId: acqRes.resourceId, sid: recRes.sid, uid: recUid };
        vttRef.current.startTime = Date.now(); 
        const rawBaseUrl = sysConfigRef.current.s3BaseUrl || '';
        const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl : rawBaseUrl + '/';
        setDisplayS3Url(`${baseUrl}cloudRecording/${recRes.sid}_${channel}.m3u8`);
        setIsRecording(true);
        printLog(tLog.startRecSuccess);
      } catch (err: any) { printLog(`${tLog.errPrefix} ${err.message}`); }
    }
  };

  const loadPlayback = async () => {
    const sid = recRef.current.sid;
    if (!sid) return alert(t.alertNoSid);
    const rawBaseUrl = sysConfigRef.current.s3BaseUrl || '';
    const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl : rawBaseUrl + '/';
    const m3u8Url = `${baseUrl}cloudRecording/${sid}_${channel}.m3u8`;
    const vttUrl = `${baseUrl}cloudRecording/${sid}_${channel}.vtt?t=${Date.now()}`;

    const videoElement = document.getElementById("hls-video-player") as HTMLVideoElement;
    if (!videoElement) return;

    if (isRecording) {
      printLog(tLog.snapVtt);
      setHlsStatus(t.hlsGenerating);
      await uploadVttSnapshot(sid);
    } else { printLog(tLog.loadVtt); }

    const oldTracks = videoElement.querySelectorAll("track");
    oldTracks.forEach(tr => tr.remove());

    const track = document.createElement("track");
    track.kind = "subtitles";
    track.label = lang === 'zh' ? "繁體中文" : "English";
    track.srclang = lang === 'zh' ? "zh-TW" : "en";
    track.src = vttUrl; 
    track.default = true;
    videoElement.appendChild(track);
    
    track.addEventListener("load", () => {
        if (videoElement.textTracks && videoElement.textTracks.length > 0) {
            videoElement.textTracks[0].mode = 'showing';
        }
    });

    if (hlsInstanceRef.current) hlsInstanceRef.current.destroy();
    setHlsStatus(t.hlsLoading);
    setViewMode('playback'); 

    if (Hls.isSupported()) {
      const hls = new Hls({ liveSyncDurationCount: 3 });
      hlsInstanceRef.current = hls;
      hls.loadSource(m3u8Url);
      hls.attachMedia(videoElement);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setHlsStatus(t.hlsPlaying);
        videoElement.play().catch(e => console.warn("Auto-play prevented", e));
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR: hls.startLoad(); break;
            default: hls.destroy(); setHlsStatus(t.hlsError); break;
          }
        }
      });
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = m3u8Url;
      videoElement.addEventListener('loadedmetadata', () => {
        videoElement.play();
        setHlsStatus(t.hlsSafari);
      });
    }
  };

  const handleBackToLobby = async () => {
    if (isJoined) await handleLeave();
    setStep('lobby');
  };

  return (
    <div className="p-4 lg:p-8 max-w-[96%] mx-auto bg-gray-50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold text-blue-600">{t.title}</h1>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          {step === 'dashboard' && (
            <button onClick={handleBackToLobby} className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-100 transition shadow-sm flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              {t.backToLobby}
            </button>
          )}
          <button onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-100 transition shadow-sm flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
            {lang === 'zh' ? 'English' : '中文'}
          </button>
        </div>
      </div>
      
      {step === 'lobby' && (
        <div className="max-w-6xl mx-auto space-y-8 mt-6">
          <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-200">
             <div className="border-b border-gray-100 pb-4 mb-5">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-6 bg-purple-500 rounded-full"></span> {t.mgTitle}
                </h2>
                <p className="text-gray-500 text-sm mt-1 ml-4">{t.mgDesc}</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-6">
                <div className="lg:col-span-1">
                   <label className="block text-xs font-bold text-gray-700 mb-2">{t.mgRegion}</label>
                   <select value={mgRegion} onChange={e => setMgRegion(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-lg text-gray-900 bg-white font-medium shadow-sm focus:ring-2 focus:ring-purple-500">
                      <option value="ap">Asia Pacific (ap)</option>
                      <option value="na">North America (na)</option>
                      <option value="eu">Europe (eu)</option>
                      <option value="cn">China (cn)</option>
                   </select>
                </div>
                <div className="lg:col-span-1">
                   <label className="block text-xs font-bold text-gray-700 mb-2">{t.channelName}</label>
                   <input type="text" value={channel} onChange={e => setChannel(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-lg text-gray-900 bg-white font-mono shadow-sm focus:ring-2 focus:ring-purple-500" />
                </div>
                <div className="lg:col-span-1">
                   <label className="block text-xs font-bold text-gray-700 mb-2">{t.mgUid}</label>
                   <input type="text" value={mgUid} onChange={e => setMgUid(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-lg text-gray-900 bg-white font-mono shadow-sm focus:ring-2 focus:ring-purple-500" />
                </div>
                <div className="lg:col-span-1">
                   <label className="block text-xs font-bold text-gray-700 mb-2">{t.mgExpires}</label>
                   <input type="number" value={mgExpires} onChange={e => setMgExpires(Number(e.target.value))} className="w-full border border-gray-300 p-2.5 rounded-lg text-gray-900 bg-white font-mono shadow-sm focus:ring-2 focus:ring-purple-500" />
                </div>
                <div className="md:col-span-2 lg:col-span-2">
                   <label className="block text-xs font-bold text-gray-700 mb-2">{t.mgTemplate}</label>
                   <input type="text" value={mgTemplate} onChange={e => setMgTemplate(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-lg text-gray-900 bg-white font-mono shadow-sm focus:ring-2 focus:ring-purple-500" />
                </div>
             </div>

             <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setMgReqExpanded(!mgReqExpanded)} className="w-full px-5 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-bold text-gray-700">{t.mgReqPreview}</span>
                  <svg className={`w-4 h-4 text-gray-400 transform transition-transform ${mgReqExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {mgReqExpanded && (
                   <div className="p-5 bg-slate-900">
                      <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
                        {JSON.stringify({ settings: { channel, uid: mgUid, expiresAfter: mgExpires, templateId: mgTemplate } }, null, 2)}
                      </pre>
                   </div>
                )}
             </div>

             <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <button onClick={handleGenerateStreamKey} disabled={isGeneratingMg} className="w-full md:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                   {isGeneratingMg ? t.mgGenerating : t.mgGenerateBtn}
                </button>
                
                <div className="flex gap-3 w-full md:w-auto ml-auto">
                   <button onClick={handleQueryTemplate} disabled={isQueryingTpl} className="flex-1 md:flex-none px-6 py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:bg-gray-100 font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      {isQueryingTpl ? t.mgQuerying : t.mgQueryBtn}
                   </button>
                   <button onClick={handleQueryAllTemplates} disabled={isQueryingAll} className="flex-1 md:flex-none px-6 py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:bg-gray-100 font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                      {isQueryingAll ? t.mgQueryingAll : t.mgQueryAllBtn}
                   </button>
                </div>
             </div>

             {/* ✨ 單一查詢的 Template 結果區塊 */}
             {tplData && (
                <div className="mt-6 border border-blue-200 rounded-xl overflow-hidden shadow-sm">
                   <button 
                     onClick={() => setTplInfoExpanded(!tplInfoExpanded)} 
                     className="w-full px-6 py-4 bg-blue-50 hover:bg-blue-100 transition-colors flex justify-between items-center"
                   >
                      <div className="flex items-center gap-3">
                         <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                         <p className="text-sm font-bold text-blue-800">
                            {t.tplInfoTitle} : <span className="font-mono">{tplData.id}</span>
                         </p>
                      </div>
                      <svg className={`w-5 h-5 text-blue-500 transform transition-transform ${tplInfoExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                   </button>
                   
                   {tplInfoExpanded && (
                     <div className="p-6 bg-white border-t border-blue-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-5">
                           <div className="bg-gray-50 p-3 rounded shadow-sm border border-gray-100">
                              <span className="text-gray-500 text-xs block mb-1">{t.tplBaseVideo}</span>
                              <span className="font-bold font-mono">
                                {tplData.transcoding?.video?.enabled ? `${tplData.transcoding.video.width} x ${tplData.transcoding.video.height} @ ${tplData.transcoding.video.fps}fps (${tplData.transcoding.video.bitrate}kbps)` : 'Disabled'}
                              </span>
                           </div>
                           <div className="bg-gray-50 p-3 rounded shadow-sm border border-gray-100">
                              <span className="text-gray-500 text-xs block mb-1">{t.tplCodec} & {t.tplAudio}</span>
                              <span className="font-bold font-mono">
                                {tplData.transcoding?.video?.codec || 'N/A'} | Audio: {tplData.transcoding?.audio?.enabled ? 'ON' : 'OFF'}
                              </span>
                           </div>
                           
                           {tplData.transcoding?.video?.simulcastStreamLayers && tplData.transcoding.video.simulcastStreamLayers.length > 0 && (
                             <div className="md:col-span-2 bg-gray-50 p-3 rounded shadow-sm border border-gray-100">
                                <span className="text-gray-500 text-xs block mb-2">{t.tplSimulcast}</span>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                  {tplData.transcoding.video.simulcastStreamLayers.map((layer: any, idx: number) => (
                                    <div key={idx} className="bg-white border border-gray-200 p-2 rounded text-center text-xs font-mono">
                                      L{layer.id}: {layer.width}x{layer.height}
                                      <br/><span className="text-gray-500">{layer.bitrate}kbps</span>
                                    </div>
                                  ))}
                                </div>
                             </div>
                           )}
                        </div>

                        <div className="border border-blue-200 rounded-lg overflow-hidden">
                           <button onClick={() => setTplRawExpanded(!tplRawExpanded)} className="w-full px-4 py-2 flex justify-between items-center bg-blue-50 hover:bg-blue-100 transition-colors">
                             <span className="text-xs font-bold text-blue-700">{t.tplRawJson}</span>
                             <svg className={`w-4 h-4 text-blue-500 transform transition-transform ${tplRawExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                           </button>
                           {tplRawExpanded && (
                              <div className="p-4 bg-slate-900">
                                 <pre className="text-sky-300 text-xs font-mono whitespace-pre-wrap">
                                   {JSON.stringify(tplData, null, 2)}
                                 </pre>
                              </div>
                           )}
                        </div>
                     </div>
                   )}
                </div>
             )}

             {/* ✨ 全部查詢的 Templates 陣列 */}
             {templates.length > 0 && (
                <div className="mt-6 space-y-5">
                   {templates.map((tpl: any) => {
                      const isExpanded = !!expandedTpls[tpl.id]; 
                      return (
                        <div key={tpl.id} className="border border-blue-200 rounded-xl overflow-hidden shadow-sm">
                           <div className="w-full px-5 py-4 bg-blue-50 flex flex-col md:flex-row justify-between items-center gap-4">
                              <div className="flex items-center gap-3 w-full md:w-auto">
                                 <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                 <p className="text-sm font-bold text-blue-800 break-all">
                                    {t.tplInfoTitle} : <span className="font-mono">{tpl.id}</span>
                                 </p>
                              </div>
                              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                 <button onClick={() => setMgTemplate(tpl.id)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors">
                                    {t.applyBtn}
                                 </button>
                                 <button onClick={() => toggleTpl(tpl.id)} className="p-1 hover:bg-blue-200 rounded transition-colors text-blue-500">
                                    <svg className={`w-6 h-6 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                 </button>
                              </div>
                           </div>
                           
                           {isExpanded && (
                             <div className="p-6 bg-white border-t border-blue-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-5">
                                   <div className="bg-gray-50 p-3 rounded shadow-sm border border-gray-100">
                                      <span className="text-gray-500 text-xs block mb-1">{t.tplBaseVideo}</span>
                                      <span className="font-bold font-mono">
                                        {tpl.transcoding?.video?.enabled ? `${tpl.transcoding.video.width} x ${tpl.transcoding.video.height} @ ${tpl.transcoding.video.fps}fps (${tpl.transcoding.video.bitrate}kbps)` : 'Disabled'}
                                      </span>
                                   </div>
                                   <div className="bg-gray-50 p-3 rounded shadow-sm border border-gray-100">
                                      <span className="text-gray-500 text-xs block mb-1">{t.tplCodec} & {t.tplAudio}</span>
                                      <span className="font-bold font-mono">
                                        {tpl.transcoding?.video?.codec || 'N/A'} | Audio: {tpl.transcoding?.audio?.enabled ? 'ON' : 'OFF'}
                                      </span>
                                   </div>
                                   
                                   {tpl.transcoding?.video?.simulcastStreamLayers && tpl.transcoding.video.simulcastStreamLayers.length > 0 && (
                                     <div className="md:col-span-2 bg-gray-50 p-3 rounded shadow-sm border border-gray-100">
                                        <span className="text-gray-500 text-xs block mb-2">{t.tplSimulcast}</span>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                          {tpl.transcoding.video.simulcastStreamLayers.map((layer: any, idx: number) => (
                                            <div key={idx} className="bg-white border border-gray-200 p-2 rounded text-center text-xs font-mono">
                                              L{layer.id}: {layer.width}x{layer.height}
                                              <br/><span className="text-gray-500">{layer.bitrate}kbps</span>
                                            </div>
                                          ))}
                                        </div>
                                     </div>
                                   )}
                                </div>

                                <div className="border border-blue-200 rounded-lg overflow-hidden">
                                   <button onClick={() => toggleTplRaw(tpl.id)} className="w-full px-4 py-2 flex justify-between items-center bg-blue-50 hover:bg-blue-100 transition-colors">
                                     <span className="text-xs font-bold text-blue-700">{t.tplRawJson}</span>
                                     <svg className={`w-4 h-4 text-blue-500 transform transition-transform ${tplRawExpandedList[tpl.id] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                   </button>
                                   {tplRawExpandedList[tpl.id] && (
                                      <div className="p-4 bg-slate-900">
                                         <pre className="text-sky-300 text-xs font-mono whitespace-pre-wrap">
                                           {JSON.stringify(tpl, null, 2)}
                                         </pre>
                                      </div>
                                   )}
                                </div>
                             </div>
                           )}
                        </div>
                      )
                   })}
                </div>
             )}

             {streamKey && (
                <div className="mt-6 p-6 bg-purple-50 border border-purple-200 rounded-xl">
                   <p className="text-sm font-bold text-purple-800 mb-3">{t.mgStreamKeyResult}</p>
                   <div className="flex flex-col sm:flex-row gap-3">
                      <input type="text" value={streamKey} readOnly className="w-full p-3.5 rounded-xl bg-white border border-purple-300 text-gray-900 font-mono font-bold select-all shadow-sm" />
                      <button 
                        onClick={handleCopyStreamKey} 
                        className={`px-6 py-3.5 text-white font-bold rounded-xl shadow-sm whitespace-nowrap transition-colors flex items-center justify-center gap-2 ${isKeyCopied ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-purple-600 hover:bg-purple-700'}`}
                      >
                        {isKeyCopied ? (
                          <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> {t.mgCopied}</>
                        ) : (
                          <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg> {t.mgCopy}</>
                        )}
                      </button>
                   </div>
                   
                   <div className="mt-5 border border-purple-200 rounded-xl overflow-hidden">
                      <button onClick={() => setMgResExpanded(!mgResExpanded)} className="w-full px-5 py-3 flex justify-between items-center bg-purple-100 hover:bg-purple-200 transition-colors">
                        <span className="text-sm font-bold text-purple-700">{t.mgResPreview}</span>
                        <svg className={`w-4 h-4 text-purple-500 transform transition-transform ${mgResExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </button>
                      {mgResExpanded && mgResponseData && (
                         <div className="p-5 bg-slate-900">
                            <pre className="text-yellow-300 text-xs font-mono whitespace-pre-wrap">
                              {JSON.stringify(mgResponseData, null, 2)}
                            </pre>
                         </div>
                      )}
                   </div>
                </div>
             )}
          </div>

          <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-200">
             <div className="border-b border-gray-100 pb-4 mb-5">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-6 bg-blue-500 rounded-full"></span> {t.lobbyTitle}
                </h2>
                <p className="text-gray-500 text-sm mt-1 ml-4">{t.lobbyDesc}</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t.videoQuality}</label>
                    <select value={profile} onChange={(e: any) => setProfile(e.target.value)} className="w-full border border-gray-300 p-3 rounded-xl text-gray-900 bg-white font-medium shadow-sm focus:ring-2 focus:ring-blue-500 cursor-pointer">
                        <option value="720p">{t.q720p}</option>
                        <option value="1080p">{t.q1080p}</option>
                        <option value="480p">{t.q480p}</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t.recLayout}</label>
                    <select value={layout} onChange={(e) => setLayout(e.target.value)} className="w-full border border-gray-300 p-3 rounded-xl text-gray-900 bg-white font-medium shadow-sm focus:ring-2 focus:ring-blue-500 cursor-pointer">
                        <option value="1">{t.layoutGrid}</option>
                        <option value="0">{t.layoutFloat}</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between">
                        <span>{t.idleTime}</span>
                        <span className="text-blue-600">{idle} {t.idleUnit}</span>
                    </label>
                    <div className="pt-2">
                      <input type="range" min="30" max="300" step="10" value={idle} onChange={(e) => setIdle(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"/>
                    </div>
                </div>
             </div>

             <button onClick={() => setStep('dashboard')} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-md transition-all flex justify-center items-center gap-2">
                 {t.enterDemoBtn}
             </button>
          </div>
        </div>
      )}

      {step === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-8">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span> {t.coreSettings}
              </h2>
              
              {/* ✨ 修改為垂直排列的房間名稱與 UID 區塊 */}
              <div className="mb-6">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex flex-col text-center gap-4">
                    <div className="px-2">
                        <span className="block text-xs text-blue-400 font-bold mb-1">{t.channelName}</span>
                        <span className="text-xl text-blue-700 font-bold font-mono truncate block" title={channel}>{channel}</span>
                    </div>
                    <div className="border-t border-blue-200 pt-4 px-2">
                        <span className="block text-xs text-blue-400 font-bold mb-1">{t.localUidLabel}</span>
                        <span className="text-xl text-blue-700 font-bold font-mono truncate block" title={String(localUid)}>{localUid}</span>
                    </div>
                </div>
              </div>

              <div className="space-y-3">
                {!isJoined ? (
                   <div className="space-y-3 mb-4">
                     <button onClick={() => handleJoin('host')} className="w-full py-3 rounded-lg text-white font-bold transition-colors shadow-sm bg-blue-600 hover:bg-blue-700">
                        {t.joinAsHostBtn}
                     </button>

                     {/* 觀眾下拉式選單按鈕 */}
                     <div className="relative">
                       <button 
                         onClick={() => setShowAudienceMenu(!showAudienceMenu)} 
                         className="w-full py-3 rounded-lg text-white font-bold transition-colors shadow-sm bg-purple-600 hover:bg-purple-700 flex justify-center items-center gap-2"
                       >
                          {t.joinAsAudienceBtn}
                          <svg className={`w-4 h-4 transform transition-transform ${showAudienceMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                       </button>
                       {showAudienceMenu && (
                         <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                           <button onClick={() => { setShowAudienceMenu(false); handleJoin('audience', 1); }} className="w-full text-left px-5 py-3 hover:bg-purple-50 text-purple-700 font-bold border-b border-gray-100 transition-colors flex items-center justify-between">
                             {t.latencyUltra}
                           </button>
                           <button onClick={() => { setShowAudienceMenu(false); handleJoin('audience', 2); }} className="w-full text-left px-5 py-3 hover:bg-purple-50 text-purple-700 font-bold transition-colors flex items-center justify-between">
                             {t.latencyStandard}
                           </button>
                         </div>
                       )}
                     </div>
                   </div>
                ) : (
                   <div className="space-y-3 mb-4">
                     <button onClick={handleLeave} className="w-full py-3 rounded-lg text-white font-bold transition-colors shadow-sm bg-orange-500 hover:bg-orange-600">
                        {t.leaveBtn}
                     </button>
                   </div>
                )}
                
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <button onClick={toggleStt} disabled={!isJoined} className={`w-full py-3 rounded-lg text-white font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${isSttRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
                    {isSttRunning ? t.stopSttBtn : t.startSttBtn}
                  </button>

                  <button onClick={toggleRecording} disabled={!isJoined} className={`w-full py-3 rounded-lg text-white font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-rose-500 hover:bg-rose-600'}`}>
                    {isRecording ? t.stopRecBtn : t.startRecBtn}
                  </button>

                  <button onClick={loadPlayback} disabled={!recRef.current.sid} className="w-full py-3 rounded-lg text-white font-bold transition-colors shadow-sm bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    {t.loadHlsBtn}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-9 space-y-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-bold text-gray-800 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${viewMode === 'live' ? 'bg-blue-500' : 'bg-indigo-500 animate-pulse'}`}></span> 
                  {t.mediaMonitor}: <span className="text-blue-600">{viewMode === 'live' ? t.localPreview : t.cloudPlayback}</span>
                </h3>
                
                <div className="flex items-center gap-3">
                  {isJoined && viewMode === 'live' && currentRole === 'host' && (
                    <div className="flex gap-2">
                      <button onClick={toggleAudio} className={`text-xs px-3 py-1.5 rounded border font-medium transition-colors ${isAudioMuted ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}>
                        {isAudioMuted ? t.unmute : t.mute}
                      </button>
                      <button onClick={toggleVideo} className={`text-xs px-3 py-1.5 rounded border font-medium transition-colors ${!isVideoEnabled ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}>
                        {!isVideoEnabled ? t.cameraOn : t.cameraOff}
                      </button>
                    </div>
                  )}
                  {isRecording && (
                    <div className="bg-red-600 text-white text-xs font-bold px-2 py-1.5 rounded flex items-center gap-1 animate-pulse">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div> REC
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-black w-full aspect-video rounded-lg relative overflow-hidden flex items-center justify-center border border-gray-800 shadow-inner">
                 {!isJoined && viewMode === 'live' && (
                   <div className="absolute inset-0 flex items-center justify-center text-gray-500 z-10 bg-black">
                     {t.notJoined}
                   </div>
                 )}
                 <div id="local-player" className={`w-full h-full absolute inset-0 ${viewMode === 'live' ? 'block' : 'hidden'}`}></div>
                 
                 {isJoined && !isVideoEnabled && viewMode === 'live' && currentRole === 'host' && (
                   <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-gray-400 z-10">
                     {t.cameraMask}
                   </div>
                 )}

                 {/* ✨ 新增：浮動顯示當前頻道的主播 UID */}
                 {isJoined && viewMode === 'live' && (currentRole === 'host' || hasRemoteVideo) && (
                     <div className="absolute top-4 left-4 z-30 bg-black/60 backdrop-blur-sm border border-white/10 text-white px-3 py-1.5 rounded-lg text-sm font-bold font-mono shadow-lg flex items-center gap-2 pointer-events-none">
                         <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                         {t.hostUidBadge}: {currentRole === 'host' ? localUid : remoteHostUid}
                     </div>
                 )}

                 {isJoined && viewMode === 'live' && currentRole === 'audience' && !hasRemoteVideo && (
                   <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-gray-400 z-10">
                      <div className="flex flex-col items-center gap-3">
                         <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                         <span>{t.waitingRtmp}</span>
                      </div>
                   </div>
                 )}

                 <video id="hls-video-player" className={`w-full h-full object-cover absolute inset-0 ${viewMode === 'playback' ? 'block' : 'hidden'}`} crossOrigin="anonymous" controls playsInline></video>
                 {hlsStatus === t.hlsNotLoaded && viewMode === 'playback' && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 z-20 pointer-events-none">
                      {t.clickLeftToLoad}
                    </div>
                 )}
                 {viewMode === 'live' && (
                   <div className="absolute bottom-6 z-30 text-center w-full pointer-events-none">
                      <span id="global-subtitle-text" className="bg-black/70 text-green-400 px-3 py-1.5 rounded-lg text-md font-bold shadow-lg empty:hidden"></span>
                   </div>
                 )}
                 {viewMode === 'playback' && (
                   <button 
                     onClick={() => {
                       setViewMode('live');
                       const hlsVideo = document.getElementById("hls-video-player") as HTMLVideoElement;
                       if (hlsVideo && !hlsVideo.paused) { hlsVideo.pause(); }
                     }}
                     className="absolute top-4 right-4 z-40 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-bold shadow-xl transition-all flex items-center gap-2 animate-bounce cursor-pointer"
                   >
                     {t.backToLive}
                   </button>
                 )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button 
                onClick={() => setIsConfigExpanded(!isConfigExpanded)}
                className="w-full px-5 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span className="font-bold text-gray-700 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {t.configDetails}
                </span>
                <svg className={`w-5 h-5 text-gray-500 transform transition-transform ${isConfigExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              {isConfigExpanded && (
                <div className="p-5 border-t border-gray-200 bg-white grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3">
                     <div className="flex justify-between border-b pb-2">
                       <span className="text-gray-500">{t.videoQualityLabel}</span>
                       <span className="font-mono font-bold text-gray-700">{profile}</span>
                     </div>
                     <div className="flex justify-between border-b pb-2">
                       <span className="text-gray-500">{t.layoutLabel}</span>
                       <span className="font-mono font-bold text-gray-700">{layout === '1' ? t.layoutGrid : t.layoutFloat}</span>
                     </div>
                     <div className="flex justify-between border-b pb-2">
                       <span className="text-gray-500">{t.idleTimeLabel}</span>
                       <span className="font-mono font-bold text-gray-700">{idle} {t.idleUnit}</span>
                     </div>
                  </div>
                  <div className="space-y-3">
                     <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">{t.tokenReadonly}</label>
                        <input type="text" className="w-full border border-gray-200 p-2 rounded text-gray-900 text-xs bg-white font-mono cursor-not-allowed" 
                          value={displayToken || t.waitingToken} readOnly />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">{t.s3UrlReadonly}</label>
                        <textarea className="w-full border border-gray-200 p-2 rounded text-gray-900 text-xs bg-white font-mono cursor-not-allowed resize-none" 
                          rows={2} value={displayS3Url || t.waitingS3} readOnly />
                     </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono h-48 overflow-y-auto shadow-inner text-slate-800 relative">
              <div className="font-bold text-slate-500 px-4 py-3 border-b border-slate-200 sticky top-0 bg-slate-50 z-10">
                {t.systemLogs}
              </div>
              <div className="px-4 pb-4 space-y-1">
                 {logs.map((log, i) => <div key={i}>{log}</div>)}
                 <div ref={logsEndRef} className="h-1" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}