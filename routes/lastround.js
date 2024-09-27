const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const User = require('../model/users');
const getPath = require('../model/paths');
const Leaderboard = require('../model/leaderboard');
const caseInsensitiveEqual = require('../utils/equals');

router.get('/last-round', asyncHandler(async (req, res, next) => {
    const { token } = req.query;
    
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.status(403).json({message: 'invalid or expired token'});
        }

        const user = await User.findById(req.user.id).exec();        
        const Path = getPath(user.path_number);        
        const roundQuery = {round: `8${payload.roundid}`};        
        const round = await Path.findOne(roundQuery).exec();        
        return res.json(round);
    });
}));

router.get('/available-rounds', asyncHandler (async (req, res, next) => {
    const user = await User.findById(req.user.id).exec();
    const availableRounds = ['A', 'B', 'C'].filter(round => !user.last_round.includes(round));
    res.json({availableRounds});
}));

router.post('/validate', asyncHandler(async (req, res, next) => {
    const { token } = req.query;

    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
            return res.status(403).json({message: 'invalid or expired token'});
        }

        const user = await User.findById(req.user.id).exec();        
        const Path = getPath(user.path_number);        
        const roundQuery = {round: `8${payload.roundid}`};        
        const round = await Path.findOne(roundQuery).exec();

        const isCorrect = caseInsensitiveEqual(req.body.solution, round.solution);
        if (!isCorrect) {
            return res.json({isCorrect: false});
        }

        const userStatus = await Leaderboard.findOne({user: user._id}).exec();

        const allRoundsDone = userStatus.roundsCompleted === 10;
        const scoreAdded = allRoundsDone ? 100 : 0;
        await Leaderboard.findOneAndUpdate({user: user._id}, {
            $inc: {score: scoreAdded, roundsCompleted: 1},
            finishedAt: allRoundsDone ? new Date() : null
        }).exec();
        return res.json({isCorrect: true, roundsCompleted: userStatus.roundsCompleted + 1});
    });
}));

router.post('/:roundid', asyncHandler(async (req, res, next) => {
    const { roundid } = req.params;

    if (roundid !== 'A' && roundid !== 'B' && roundid !== 'C') {
        res.status(400).json({message: 'The round does not exist'});
        return;
    }

    const payload = {userid: req.user.id, roundid };

    const user = await User.findById(req.user.id).exec();
    if (user.last_round.includes(roundid)) {
        res.status(403).json({message: 'You have already chosen this round in another device'});
    }

    await User.findByIdAndUpdate(user._id, {round: '8', last_round: [...user.last_round, roundid]}).exec();

    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '3h'});

    res.json({roundToken: token});
}));

module.exports = router;
