const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
    stageNumber: {
        type: Number,
        required: true,
        min: 0,
        max: 6,
    },
    name: {type: String, required: true},
});

module.exports = mongoose.model('Round', roundSchema);
