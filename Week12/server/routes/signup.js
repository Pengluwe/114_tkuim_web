// 檔案名稱: server/routes/signup.js
import express from 'express';
import mongoose from 'mongoose';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const participantSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    interests: [String],
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const Participant = mongoose.models.Participant || mongoose.model('Participant', participantSchema);

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { ownerId: req.user.id };
        const list = await Participant.find(filter).sort({ createdAt: -1 });
        res.json({ total: list.length, list });
    } catch (err) {
        res.status(500).json({ error: '無法讀取資料' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newEntry = new Participant({
            ...req.body,
            ownerId: req.user.id
        });
        await newEntry.save();
        res.status(201).json({ message: '報名成功', data: newEntry });
    } catch (err) {
        res.status(400).json({ error: '建立失敗', details: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const item = await Participant.findById(req.params.id);
        if (!item) return res.status(404).json({ message: '找不到資料' });

        if (item.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: '權限不足' });
        }

        await Participant.findByIdAndDelete(req.params.id);
        res.json({ message: '刪除成功' });
    } catch (err) {
        res.status(500).json({ error: '刪除失敗' });
    }
});

export default router;