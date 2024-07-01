const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const authMiddleware = async(req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECREAT_KEY);
        req.user = decoded.user;

        // Optionally fetch the user from the database
        const user = await UserModel.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ message: 'Authorization denied' });
        }

        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;