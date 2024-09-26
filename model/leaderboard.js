const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true,
    },
    position: { type: Number, required: true, },
    createdAt: {
        type: Date,
        default: new Date(),
    }
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);