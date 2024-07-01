const UserModel = require('../models/UserModel');

const profileDetails = async(req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const updateProfileDetails = async(req, res) => {
    const { email, name, dob, role, status, profile_pic } = req.body;

    try {
        const user = await UserModel.findOneAndUpdate({ email }, { name, dob, role, status, profile_pic }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}


const allUsers = async(req, res) => {
    try {
        const users = await UserModel.find({ email: { $ne: req.user.email } });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}


module.exports = { profileDetails, updateProfileDetails, allUsers };