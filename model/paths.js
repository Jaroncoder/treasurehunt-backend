const mongoose = require('mongoose');

const pathSchema = new mongoose.Schema({
  question: {type: String, required: false},
  solution: {type: String, required: false},
  round: {type: String, required: true},
  venue: {type: String, required: false},
  image_url: {type: String, required: false},
  hint: {type: String, required: false},
  startTime: {type: Date, required: false},
});

const returnModelforPath = path_number => {
    return mongoose.model(`p${path_number}`, pathSchema);
}

module.exports = returnModelforPath;
