const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
    username: {type: String, required: true, },
    password: {type: String, required: true, },
    stage: {type: Number, default: 0},
});

module.exports = mongoose.model('credentials', credentialSchema);
