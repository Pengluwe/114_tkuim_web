import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from '../../db.js'; 
import signupRouter from './signup.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;


const rootPath = path.resolve(__dirname, '../../');
app.use(express.static(rootPath)); 


const allowedOrigins = process.env.ALLOWED_ORIGIN 
    ? process.env.ALLOWED_ORIGIN.split(',') 
    : ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:3002'];

app.use(cors({
    origin: function (origin, callback) {
        // 允許沒有 origin 的請求 (例如：本機指令、Postman 或「同源」請求)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            // 💡 關鍵：只回傳「單一個」匹配的來源網址，解決瀏覽器報錯
            callback(null, true);
        } else {
            console.error(` CORS 拒絕來源: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());


app.use('/api/signup', signupRouter);


app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        mode: 'Static Hosting',
        serving_from: rootPath,
        origin_detected: req.headers.origin || 'Same-Origin'
    });
});

app.use((req, res) => {
    res.status(404).json({ error: '找不到請求的資源' });
});

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log('------------------------------------');
            console.log(` 伺服器啟動成功！`);
            console.log(` 靜態網頁位址: http://localhost:${PORT}/index.html`);
            console.log(` API 根位址: http://localhost:${PORT}/api/signup`);
            console.log('------------------------------------');
        });
    })
    .catch((error) => {
        console.error('伺服器啟動失敗:', error);
    });