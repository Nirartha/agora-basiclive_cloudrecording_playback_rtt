# Agora Live Streaming with Real-Time STT & Cloud Recording
# Agora 網頁直播與即時語音辨識雲端錄製系統

This project demonstrates a robust serverless architecture for live audio/video broadcasting, featuring Real-Time Speech-to-Text (STT) for live subtitles, and seamless Cloud Recording with dynamic WebVTT subtitle synchronization.
本專案展示了一個強健的無伺服器 (Serverless) 直播架構，整合了即時語音轉文字 (STT) 生成動態字幕，以及帶有 WebVTT 字幕同步掛載的雲端錄製回放功能。

## ✨ Features | 核心功能

* **🎙️ Live Broadcasting:** Low-latency WebRTC streaming powered by Agora.
* **💬 Real-Time STT:** Live speech-to-text transcription overlaid on the video stream.
* **☁️ Cloud Recording (VOD):** Automated recording of streams to AWS S3 (HLS/MP4).
* **📝 Dynamic VTT Generation:** Extracts STT payload, cleanses protobuf artifacts, and generates VTT files.
* **⚡ Serverless Upload:** Utilizes Cloudflare Workers (`aws4fetch`) to securely upload VTT files to S3 without exposing AWS credentials on the frontend.
* **⏪ VOD Playback:** HLS playback with dynamic subtitle track (`<track>`) mounting and cache-busting mechanisms.

## 🏗️ Architecture | 系統架構

1. **Frontend (Client):** Joins Agora RTC channel, extracts real-time STT data streams, and displays local subtitles.
2. **Cloudflare Worker (S3 Uploader):** Acts as a secure proxy to sign AWS V4 requests and upload VTT snapshots to AWS S3.
3. **Agora RESTful APIs:** Manages STT tasks and Cloud Recording states.
4. **AWS S3:** Serves as the storage backend for `.m3u8`, `.ts`, `.mp4`, and `.vtt` files.

## 🚀 Getting Started | 快速開始

### Prerequisites | 前置需求
* An [Agora](https://console.agora.io/) account (App ID, App Certificate, Customer ID, Customer Secret).
* An [AWS](https://aws.amazon.com/) account (S3 Bucket, Access Key, Secret Key).
* A [Cloudflare](https://dash.cloudflare.com/) account for deploying the Worker.

### 1. Deploy the Cloudflare Worker | 部署 S3 上傳微服務
```bash
cd worker-s3-uploader
npm install
# Configure your wrangler.toml or set environment variables in Cloudflare dashboard
npx wrangler deploy
