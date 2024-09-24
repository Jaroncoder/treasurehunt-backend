const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
    username: {type: String, required: true, },
    password: {type: String, required: true, },
    round: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Round',
        default: 0,
    }
});

module.exports = mongoose.model('credentials', credentialSchema);
