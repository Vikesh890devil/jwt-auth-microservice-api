const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Candidate', candidateSchema);
