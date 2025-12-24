### 報名管理系統 (Week 11)
這是一個基於 Express.js 與 MongoDB 建立的報名管理系統。本專案實作了完整的 CRUD API，並透過 Express 靜態託管（Static Hosting）技術解決了開發中常見的 CORS 跨域問題。功能特點完整 CRUD API：支援報名資料的建立、讀取、更新與刪除。靜態檔案託管：後端同時負責 API 與前端網頁的傳送，解決跨域與 Live Server 刷新問題。資料庫整合：連線至 MongoDB 儲存報名資訊。動態 CORS 處理：修復了瀏覽器不支援多重 Origin 標頭的問題。環境需求Node.js: v16.0.0+MongoDB: 使用 Docker 容器VS Code: 安裝 REST Client 或使用 Postman 進行測試專案結構 (Project Structure)Week11/
"""
├── .vscode/
│   └── settings.json        # Live Server 屏蔽與延遲設定
├── client/                  # 前端專案資料夾
│   ├── signup_form.html     # 主網頁檔案
│   ├── signup_form.js       # 前端 API 請求邏輯
│   └── styles.css           # 網頁樣式
├── server/                  # 後端專案資料夾
│   ├── routes/
│   │   ├── app.js           # 後端主入口 (Static Hosting & CORS)
│   │   └── signup.js        # 報名系統 CRUD 路由邏輯
│   ├── .env                 # 環境變數 (PORT, MONGODB_URI, ALLOWED_ORIGIN)
│   ├── nodemon.json         # Nodemon 監控與忽略規則
│   └── package.json         # Node.js 專案定義與腳本
├── db.js                    # MongoDB 連線模組 (由 app.js 引用)
├── docker-compose.yml       # Docker 容器配置
└── README.md                # 專案說明文件 (本檔案)
"""

安裝與啟動啟動資料庫容器：在專案根目錄下執行以下指令，啟動 MongoDB 服務：docker compose up -d


設定環境變數 (.env)：請在 server/ 目錄下建立 .env 檔案（此檔案包含敏感資訊，已加入 .gitignore）。請參考以下配置：# 伺服器設定
PORT=3002

# MongoDB 連線設定 (包含帳號與密碼管理)
MONGODB_USER=week11_user
MONGODB_PASS=week11_password
MONGODB_URI=mongodb://${MONGODB_USER}:${MONGODB_PASS}@localhost:27017/week11?authSource=admin

# CORS 安全設定
ALLOWED_ORIGIN=http://localhost:3002,[http://127.0.0.1:5500](http://127.0.0.1:5500)


啟動後端服務：npm run dev


訪問網頁： http://localhost:3002/signup_form.html環境變數欄位說明為了確保系統安全與靈活性，所有關鍵參數皆透過環境變數管理，各欄位用途如下：|| 欄位名稱 | 用途說明 | 範例值 / 備註 || PORT | 指定 Express 伺服器監聽的連接埠。 | 3002 || MONGODB_USER | MongoDB 資料庫的存取帳號。 | week11_user (需與 Docker 設定一致) || MONGODB_PASS | MongoDB 資料庫的存取密碼。 | 請設定強密碼以確保安全。 || MONGODB_URI | 資料庫完整連線字串，包含通訊協定、帳密、主機、埠號與目標資料庫名稱。 | mongodb://user:pass@host:port/db || ALLOWED_ORIGIN | 定義允許跨來源資源共用 (CORS) 的前端網址。多個網址請以逗號分隔。 | http://localhost:3002 (靜態託管時使用) |API 測試清單| 動作 | 方法 | 網址 | 說明 || 建立報名 | POST | /api/signup | 需傳送 JSON 資料 || 取得清單 | GET | /api/signup | 回傳 total 與 list || 局部更新 | PATCH | /api/signup/:id | 更新 phone 或 status || 刪除資料 | DELETE | /api/signup/:id | 刪除指定 ID 資料 |常見問題 (FAQ)404 Not Found: 預設不導向 index.html，請輸入完整網址 .../signup_form.html。CORS 錯誤: 若使用 Live Server，請確保 .env 的 ALLOWED_ORIGIN 包含 5500 端口。路徑問題: app.js 引用 db.js 時使用 ../../db.js 是因為它位於 server/routes/ 目錄下。
