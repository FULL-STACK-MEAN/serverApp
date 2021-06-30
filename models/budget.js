const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    customer: Object,
    code: String,
    date: Date,
    validUntil: Date,
    items: Object,
    createdAt: Date,
    salesUser: Object
}, {
    versionKey: false,
    timestamps: { createdAt: 'createdAt'}
})

module.exports = mongoose.model('Budget', BudgetSchema);