const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const Credential = require('../model/credential');
const Round = require('../model/round');

router.get('/round', asyncHandler(async (req, res, next) => {
  const user = await Credential.findById(req.user.id).exec();

  if (!user) {
    res.status(404).json({message: 'user not found'});
    return;
  }

  const round = await Round.findOne({stageNumber: user.stage}).exec();
  res.json(round);
}));

router.put('/round', asyncHandler(async (req, res, next) => {
  const user = await Credential.findById(req.user.id).exec();

  if (!user) {
    res.status(404).json({message: 'user not found'});
    return;
  }

  if (user.round.stageNumber === 6) {
    res.status(400).json({message: 'The user is at the end already!'});
  } else {

    await Credential.findByIdAndUpdate(user._id, {
      stage: user.stage + 1,
    });
  }
}));

module.exports = router;
