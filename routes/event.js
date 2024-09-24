const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const Credential = require('../model/credential');
const Round = require('../model/round');

router.get('/round', asyncHandler(async (req, res, next) => {
  const user = await Credential.findById(req.user.id).populate({path: 'round'}).exec();

  if (!user) {
    res.status(404).json({message: 'user not found'});
    return;
  }

  res.json(user.round);
}));

router.put('/round', asyncHandler(async (req, res, next) => {
  const user = await Credential.findById(req.user.id).populate({path: 'round'}).exec();

  if (!user) {
    res.status(404).json({message: 'user not found'});
    return;
  }

  if (user.round.stageNumber === 6) {
    res.status(400).json({message: 'The user is at the end already!'});
  } else {
    const newRound = await Round.findOne({
      stageNumber: user.round.stageNumber + 1
    });

    await Credential.findByIdAndUpdate(user._id, {
      round: newRound._id,
    });
  }
}));

module.exports = router;
