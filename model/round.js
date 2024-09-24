const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
    stageNumber: {type: Number, required: true},
});
