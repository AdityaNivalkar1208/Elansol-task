const otpGenerator = require('otp-generator');
const UserModel = require('../models/UserModel');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const OTP_EXPIRY_TIME = 60 * 1000; // 1 minute in milliseconds

const registerUser = async(req, res) => {
    try {
        const { name, email, password, profile_pic, dob, role } = req.body;

        // Check if the email already exists
        const checkEmail = await UserModel.findOne({ email });
        if (checkEmail) {
            return res.status(400).json({
                message: 'User already exists',
                error: true,
            });
        }

        // Generate OTP and store it with an expiry time
        const OTP = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });
        req.app.locals.OTP = OTP;
        req.app.locals.OTPExpiry = Date.now() + OTP_EXPIRY_TIME; // Set OTP expiry time

        // Store user details temporarily
        req.app.locals.userDetails = {
            name,
            email,
            password,
            profile_pic,
            dob,
            role
        };

        // Set up nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        // Define mail options
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Verify Your Email',
            html: `<h4>Welcome to Elansol</h4><br><h5>Verify Your Email</h5><p>Your One Time Password (OTP) is </p><h3>${OTP}</h3><br><strong>valid upto 1min</strong><br><p>Thank You....👍</p>`,
            text: 'Thank You.... !'
        };

        // Send email with OTP
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: 'OTP sent to email.',
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true
        });
    }
};

const registerVerifyOtp = async(req, res) => {
    const { code } = req.body;
    const currentTime = Date.now();

    // Check if the OTP has expired
    if (currentTime > req.app.locals.OTPExpiry) {
        req.app.locals.OTP = null;
        req.app.locals.OTPExpiry = null;
        return res.status(400).json({ error: 'OTP has expired' });
    }

    // Check if the OTP matches
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null;
        req.app.locals.OTPExpiry = null;

        const { name, email, password, profile_pic, dob, role } = req.app.locals.userDetails;

        const salt = await bcryptjs.genSalt(10);
        const hashpassword = await bcryptjs.hash(password, salt);

        const payload = {
            name,
            email,
            dob,
            password: hashpassword,
            profile_pic,
            role
        };

        const user = new UserModel(payload);
        await user.save();

        req.app.locals.userDetails = null;

        return res.status(201).json({
            message: 'User verified successfully!',
            success: true
        });
    }

    res.status(400).json({ error: 'Invalid OTP' });
};


module.exports = {
    registerUser,
    registerVerifyOtp
};