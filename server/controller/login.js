const UserModel = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const login = async(req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Create and sign the JWT token
        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECREAT_KEY, { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.error('JWT Error:', err);
                    return res.status(500).json({ success: false, message: 'Server error' });
                }

                res.json({ success: true, token, user: { id: user.id, email: user.email } });
            }
        );
    } catch (err) {
        console.error('Server Error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
module.exports = login;