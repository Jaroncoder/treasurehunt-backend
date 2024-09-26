const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
    username: {type: String, required: true, },
    password: {type: String, required: true, },
    path_number: {type: String, required: true},
    round: {type: String, default: '1'},
    current_round: {type: String, default: '1A'},
    last_round: [{
        type: String,
        required: false,
    }]
});

module.exports = mongoose.model('users', credentialSchema);
