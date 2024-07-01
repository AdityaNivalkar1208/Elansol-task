const mongoose = require('mongoose')
const { required } = require('nodemon/lib/config')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date_created: { type: Date, default: Date.now },
    profile_pic: {
        type: String,
        default: ""
    },
    role: { type: String, default: 'Reviewer' }, // Default role is 'reviewer'
    status: { type: String, default: 'Active' },
}, {
    timestamps: true
})

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel