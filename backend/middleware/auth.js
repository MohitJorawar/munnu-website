import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const adminPin = req.header('x-admin-pin');

    // Special case: Master Admin PIN bypass
    if (adminPin === '0000') {
        req.user = { id: 0, name: 'Master Admin', email: 'admin@getcrafted.com', role: 'admin' };
        return next();
    }

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export default authMiddleware;
