const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
    name: {type: String, required: true},
});

module.exports = mongoose.model('Round', roundSchema);
