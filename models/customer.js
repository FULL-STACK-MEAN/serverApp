const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    name: String,
    cif: {
        type: String,
        index: true,
        unique: true
    },
    adress: String,
    cp: String,
    city: String,
    contact: {
        name: String,
        surname: String,
        phone: String,
        email: String
    },
    createdAt: Date
}, {
    versionKey: false,
    timestamps: { createdAt: 'createdAt'}
})

module.exports = mongoose.model('Customer', CustomerSchema);