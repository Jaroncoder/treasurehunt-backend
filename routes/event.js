const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const User = require('../model/users');
const getPath = require('../model/paths');
const incrementRound = require('../utils/round');

router.get('/round', asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).exec();

  if (!user) {
    res.status(404).json({message: 'user not found'});
    return;
  }

  res.json(user.round);
}));

router.post('/validate', asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).exec();
  const path = getPath(user.path_number);

  const currentRound = await path.findOne({round: user.current_round}).exec();

  if (!currentRound) {
    res.status(404).json({message: 'path not found'});
    return;
  }

  if (req.body.solution === currentRound.solution) {
    
    res.json({isCorrect: true});
  } else {
    res.json({isCorrect: false});
  }
}));

module.exports = router;
