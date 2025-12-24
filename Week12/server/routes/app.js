// 檔案名稱: server/routes/app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../db.js'; 
import authRouter from './auth.js';
import signupRouter from './signup.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// 靜態檔案路徑：指向 client 資料夾
const clientPath = path.resolve(__dirname, '../../client');
app.use(express.static(clientPath));

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/api/signup', signupRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Week 12 系統啟動：http://localhost:${PORT}/index.html`);
    });
});