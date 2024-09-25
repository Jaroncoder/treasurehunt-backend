const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const User = require('../model/users');
const getPath = require('../model/paths');
const incrementRound = require('../utils/round');

function caseInsensitiveEqual(a, b) {
  return a.toLowerCase() === b.toLowerCase();
}

router.post('/validate', asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).exec();
  const path = getPath(user.path_number);

  const currentRound = await path.findOne({round: user.current_round}).exec();

  if (!currentRound) {
    res.status(404).json({message: 'path not found'});
    return;
  }

  if (caseInsensitiveEqual(req.body.solution, currentRound.solution)) {
    res.json({isCorrect: true});
  } else {
    res.json({isCorrect: false});
  }
}));

router.get('/round', asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).exec();
  const path = getPath(user.path_number);

  const currentRound = await path.findOne({round: user.current_round}).exec();

  if (!currentRound) {
    res.status(404).json({message: 'path not found'});
    return;
  }

  res.json(currentRound);
}));

router.put('/round', asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).exec();

  const newRound = incrementRound(user.current_round);
  
  await User.findByIdAndUpdate(req.user.id, {current_round: newRound}).exec();
  res.json({newRound});
}));

module.exports = router;
