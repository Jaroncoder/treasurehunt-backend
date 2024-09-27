const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const {differenceInMinutes, addMinutes, isAfter} = require('date-fns');

const User = require('../model/users');
const getPath = require('../model/paths');
const Leaderboard = require('../model/leaderboard');
const incrementRound = require('../utils/round');
const caseInsensitiveEqual = require('../utils/equals');
const globals = require('../utils/globals');

const lastRoundRouter = require('./lastround')

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

  if (typeof currentRound.startTime === 'undefined') {
    await path.findByIdAndUpdate(currentRound._id, {
      startTime: new Date(),
    });  
  }
  
  res.json(currentRound);
}));

router.get('/current-round', asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).exec();
  res.json({currentRound: user.current_round});
}))

router.put('/round', asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).exec();
  const path = getPath(user.path_number);

  const currentRound = await path.findOne({round: user.current_round}).exec();

  if (!currentRound) {
    res.status(404).json({message: 'path not found'});
    return;
  }

  const currentTime = new Date();
  const timeAlloted = user.current_round === '4' ? 20 : 10;

  const timeLimit = addMinutes(currentRound.startTime, timeAlloted);

  const timeLimitExceeded = isAfter(currentTime, timeLimit);

  const scoreAdded = timeLimitExceeded ? 5 : 10;

  const newRound = incrementRound(user.current_round);
  
  await Promise.all([
    User.findByIdAndUpdate(req.user.id, {current_round: newRound}).exec(),
    Leaderboard.updateOne({ user: user._id }, {$inc: {score: scoreAdded, roundsCompleted: 1}}).exec(),
  ]);
  
  res.json({newRound});
}));

router.get('/timer', asyncHandler(async (req, res, next) => {
  const mode = req.params.mode ?? 'start';

  const time = globals.isRunning() ? globals.getStartTime() : globals.getEndTime();
  const currentTime = new Date();

  const timeDifference = differenceInMinutes(time, currentTime);
  
  const hours = Math.floor(timeDifference / 60);
  const minutes = timeDifference % 60;
  const seconds = 60 - currentTime.getSeconds();

  const timeString = `${hours}:${minutes}:${seconds}`;
  res.json({time: timeString});
}));

router.use('/last', lastRoundRouter);

module.exports = router;
