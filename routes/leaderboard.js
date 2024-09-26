const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const Leaderboard = require('../model/leaderboard');

router.get('/completed-rounds', asyncHandler(async (req, res, next) => {
    const userStatus = await Leaderboard.findOne({user: req.user.id}).exec();
    res.json({
      completedRounds: userStatus.roundsCompleted,
    });
}));

module.exports = router;
