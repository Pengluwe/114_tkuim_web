// 檔案名稱: server/routes/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const router = express.Router();

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

router.post('/signup', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(409).json({ message: '此 Email 已被註冊' });

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({ email, passwordHash, role: role || 'student' });
        await newUser.save();
        
        res.status(201).json({ message: '註冊成功' });
    } catch (err) {
        res.status(500).json({ message: '註冊失敗', error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({ message: '帳號或密碼錯誤' });
        }

        const token = jwt.sign(
            { sub: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '2h' }
        );

        res.json({
            message: '登入成功',
            token,
            user: { email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: '登入失敗' });
    }
});

export default router;