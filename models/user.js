const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        index: true,
        unique: true
    },
    password: String
}, {versionKey: false});

module.exports = mongoose.model('User', UserSchema);