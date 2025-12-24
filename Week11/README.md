# 報名管理系統（Week 11）

本專案是一個基於 **Express.js** 與 **MongoDB** 建立的報名管理系統，實作了完整的 **CRUD API**，並透過 **Express 靜態檔案託管（Static Hosting）** 解決開發中常見的 **CORS 跨域問題**。

---

##  功能特點

- **完整 CRUD API**
  - 支援報名資料的建立（Create）、讀取（Read）、更新（Update）與刪除（Delete）。
- **靜態檔案託管**
  - 後端同時負責 API 與前端網頁傳送，避免 CORS 與 Live Server 刷新問題。
- **資料庫整合**
  - 連線至 MongoDB，儲存與管理報名資訊。
- **動態 CORS 處理**
  - 修復瀏覽器不支援多重 `Origin` 標頭所導致的錯誤。

---

##  環境需求

- **Node.js**：v16.0.0 以上  
- **MongoDB**：透過 Docker 容器運行  
- **VS Code**
  - 建議安裝 **REST Client** 或使用 **Postman**

---

##  專案結構

```text
Week11/
├── .vscode/
│   └── settings.json
├── client/
│   ├── signup_form.html
│   ├── signup_form.js
│   └── styles.css
├── server/
│   ├── routes/
│   │   ├── app.js
│   │   └── signup.js
│   ├── .env
│   ├── nodemon.json
│   └── package.json
├── db.js
├── docker-compose.yml
└── README.md
```

---

## 🚀 安裝與啟動

### 啟動資料庫
```bash
docker compose up -d
```

### 設定 `.env`
```env
PORT=3002
MONGODB_USER=week11_user
MONGODB_PASS=week11_password
MONGODB_URI=mongodb://${MONGODB_USER}:${MONGODB_PASS}@localhost:27017/week11?authSource=admin
ALLOWED_ORIGIN=http://localhost:3002,http://127.0.0.1:5500
```

### 啟動後端
```bash
npm run dev
```

### 瀏覽網頁
```
http://localhost:3002/signup_form.html
```

---

##  API 測試

| 動作 | 方法 | 路徑 |
|----|----|----|
| 建立 | POST | /api/signup |
| 取得 | GET | /api/signup |
| 更新 | PATCH | /api/signup/:id |
| 刪除 | DELETE | /api/signup/:id |

---

##  常見問題

- 請直接訪問 `signup_form.html`
- 使用 Live Server 時請設定 CORS
- `db.js` 路徑需注意資料夾層級
