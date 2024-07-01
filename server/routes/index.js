const express = require('express');
const router = express.Router();
const cors = require('cors');
const registerUserVerify = require('../controller/registerUserVerify');
const authController = require("../controller/forgotPassword")
const login = require('../controller/login');
const { profileDetails, updateProfileDetails, allUsers } = require('../controller/userDetails');
const middleware = require('../middleware/authmiddleware');
router.post('/register', registerUserVerify.registerUser);
router.post('/verify-otp', registerUserVerify.registerVerifyOtp);
router.post('/forgot-password', authController.verifyEmail);
router.post('/verify-reset-otp', authController.verifyOtp);
router.post('/reset-password', authController.resetPassword);
router.post('/login', login);
router.get('/profile-details', middleware, profileDetails);
router.put('/profile-edit', middleware, updateProfileDetails);
router.get('/all-user', middleware, allUsers);

module.exports = router;