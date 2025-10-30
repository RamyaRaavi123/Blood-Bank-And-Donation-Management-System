const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    amount: Number
});

module.exports = mongoose.model('Donor', donorSchema);
