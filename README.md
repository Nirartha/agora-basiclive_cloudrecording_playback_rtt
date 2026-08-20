# Agora Live & Cloud Recording Dashboard 🚀
*[English Version Below](#english-version)*

這是一個建構於 Next.js (App Router) 的專業級直播展示面板。本專案展示了如何無縫整合 Agora RTC 直播、即時語音轉文字 (STT)、雲端錄製 (Cloud Recording)，以及 AWS S3 的 HLS 串流回放。

透過精心設計的「後端動態派發配置 (Dynamic Configuration Delivery)」架構，前端無需直接暴露任何金鑰即可完成所有複雜的連線與驗證，為客戶提供「一鍵隨插即用」的極致展示體驗。

## ✨ 核心特色
- **無痛一鍵體驗:** 網頁載入自動生成頻道，後端自動簽發 007 Token，隱藏複雜技術細節。
- **雙語無縫切換:** 支援一鍵中英介面切換 (i18n)，適合跨國團隊與國際客戶展示。
- **雙窗格監控面板:** 專為寬螢幕優化的左側控制、右側雙畫面 (直播與回放並排) 佈局，附帶麥克風與鏡頭獨立開關。
- **即時字幕與 VTT 快照:** 精準過濾雜訊，動態收集字幕並自動將 `.vtt` 檔案備份至 AWS S3。
- **優雅退場機制 (Graceful Shutdown):** 點擊離開頻道時，系統會自動在背景清理錄影任務、停止字幕服務並覆蓋最終版字幕檔。
- **極致安全防護:** 所有的 App Certificate 與 AWS Secret 皆封裝於 Node.js 後端，完全杜絕前端外洩風險。

## 📦 套件安裝與啟動

本專案依賴以下核心套件進行 Agora 服務串接與 HLS 回放，請在專案根目錄下依序執行以下指令進行安裝與啟動：

### 1. 安裝核心相依套件
```bash
npm install agora-rtc-sdk-ng agora-token hls.js
```

### 2. 環境變數設定
在專案根目錄建立一個 `.env.local` 檔案。本專案採用後端派發機制，**所有變數皆不需要 `NEXT_PUBLIC_` 前綴**。

```env
# 1. Agora 變數
AGORA_APP_ID="<您的 Agora App ID>"
AGORA_APP_CERTIFICATE="<您的 Agora App Certificate>"
AGORA_CUSTOMER_ID="<您的 Agora REST API Customer ID>"
AGORA_CUSTOMER_SECRET="<您的 Agora REST API Customer Secret>"

# 2. AWS S3 變數
AWS_REGION="<例如: ap-southeast-2>"
AWS_ACCESS_KEY_ID="<您的 AWS Access Key>"
AWS_SECRET_ACCESS_KEY="<您的 AWS Secret Key>"
AWS_S3_BASE_URL="https://<Bucket名稱>.s3.<Region>.amazonaws.com/"
AWS_S3_BUCKET_NAME="<Bucket名稱>"
```

### 3. 啟動開發伺服器
```bash
npm run dev
```
啟動後，開啟瀏覽器並前往 `http://localhost:3000` 即可開始體驗。

---

<a name="english-version"></a>
# English Version

This is a professional-grade live streaming dashboard built on Next.js (App Router). This project demonstrates the seamless integration of Agora RTC streaming, Real-time Speech-to-Text (STT), Cloud Recording, and AWS S3 HLS playback.

By utilizing a meticulously designed "Dynamic Configuration Delivery" architecture, the frontend executes complex connections and verifications without exposing any sensitive keys, offering clients a true "plug-and-play" demo experience.

## ✨ Core Features
- **Zero-Friction UX:** Auto-generates channels on load and auto-signs 007 Tokens via the backend, hiding complex technical details.
- **Bilingual Interface:** Supports seamless 1-click English/Chinese switching (i18n), perfect for international client demos.
- **Dashboard UI:** Wide-screen optimized layout with left-side controls and right-side dual displays (Live & Playback), featuring independent mic/camera toggles.
- **Real-Time STT & VTT Snapshots:** Accurately filters noise, dynamically collects subtitles, and automatically backs up `.vtt` files to AWS S3.
- **Graceful Shutdown:** Clicking 'Leave Channel' automatically cleans up recording tasks, stops STT services, and overwrites the final subtitle file in the background.
- **Ultimate Security:** All App Certificates and AWS Secrets are securely encapsulated within the Node.js backend, completely eliminating frontend leakage risks.

## 📦 Installation & Setup

This project relies on the following core packages for Agora services and HLS playback. Run the following commands in your project root:

### 1. Install Core Dependencies
```bash
npm install agora-rtc-sdk-ng agora-token hls.js
```

### 2. Environment Variables (`.env.local`)
Create an `.env.local` file. Since this project uses backend delivery, **no variables require the `NEXT_PUBLIC_` prefix**.

```env
# 1. Agora Variables
AGORA_APP_ID="<Your Agora App ID>"
AGORA_APP_CERTIFICATE="<Your Agora App Certificate>"
AGORA_CUSTOMER_ID="<Your API Agora Customer ID REST>"
AGORA_CUSTOMER_SECRET="<Your API Agora Customer REST Secret>"

# 2. AWS S3 Variables
AWS_REGION="<e.g., ap-southeast-2>"
AWS_ACCESS_KEY_ID="<Your AWS Access Key>"
AWS_SECRET_ACCESS_KEY="<Your AWS Key Secret>"
AWS_S3_BASE_URL="https://<Bucket-Name>.s3.<Region>.amazonaws.com/"
AWS_S3_BUCKET_NAME="<Bucket-Name>"
```

### 3. Start Development Server
```bash
npm run dev
```
Once started, open your browser and navigate to `http://localhost:3000` to experience the demo.