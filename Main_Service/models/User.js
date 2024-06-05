const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    password_hash: String
});

module.exports = mongoose.model('User', userSchema);
