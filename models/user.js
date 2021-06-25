const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    surname: String,
    email: {
        type: String,
        index: true, 
        unique: true 
    },
    password: String,
    role: String,
    adress: String,
    cp: String,
    city: String,
    phone: String,
    avatarFileName: String,
    createdAt: Date
}, {versionKey: false, timestamps: {createdAt: 'createdAt'}});

module.exports = mongoose.model('User', UserSchema); // El modelo lo asocia con el nombre de colección users