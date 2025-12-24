import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../db.js';
import signupRouter from './signup.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

const rootPath = "C:/Users/eric0/OneDrive/桌面/114_tkuim_web/Week09/client";

const allowedOrigins = [
    'http://127.0.0.1:5500', 
    'http://localhost:5500', 
    'http://localhost:3002',
    'http://127.0.0.1:3002'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log("CORS 拒絕來源:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.static(rootPath));
app.use('/api/signup', signupRouter);
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        path: rootPath,
        file: 'signup_form.html',
        msg: "後端運作正常" 
    });
});

app.use((req, res) => {
    console.warn(`404 報錯路徑: ${req.originalUrl}`);
    res.status(404).json({ 
        error: '找不到資源',
        tip: '請確認是否正確輸入了 signup_form.html'
    });
});

app.use((err, req, res, next) => {
    if (err.message === 'Not allowed by CORS') {
        res.status(403).json({ error: 'CORS 跨域存取被拒絕' });
    } else {
        res.status(500).json({ error: '伺服器內部錯誤' });
    }
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('------------------------------------');
        console.log(`伺服器啟動成功！`);
        console.log(`靜態資源目錄: ${rootPath}`);
        console.log(`網頁存取位址: http://localhost:${PORT}/signup_form.html`); // 💡 已修正檔名
        console.log('------------------------------------');
    });
});