import mongoose from 'mongoose';
import 'dotenv/config';

// 如果 .env 沒讀到，使用預設值
const uri = process.env.MONGODB_URI || "mongodb://week12-admin:week12-pass@localhost:27017/week12?authSource=week12";

export const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log(' MongoDB 連線成功');
  } catch (error) {
    console.error('MongoDB 連線失敗:', error.message);
    process.exit(1);
  }
};