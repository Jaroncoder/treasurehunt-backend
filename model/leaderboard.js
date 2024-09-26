const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true,
    },
    score: {
        type: Number,
        default: 0,
    },
    roundsCompleted: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);