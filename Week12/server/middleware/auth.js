// server/middleware/auth.js
import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            error: 'AuthenticationError', 
            message: '請先登入 (缺少授權資訊)' 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.user = {
            id: payload.sub,
            email: payload.email,
            role: payload.role
        };
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'TokenExpiredError', message: '連線已過期，請重新登入' });
        }
        return res.status(401).json({ error: 'JsonWebTokenError', message: '無效的憑證' });
    }
}

export function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'AuthorizationError', message: '權限不足' });
        }
        next();
    };
}