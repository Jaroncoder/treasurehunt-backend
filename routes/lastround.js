const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const User = require('../model/users');
const getPath = require('../model/paths');

router.post('/:roundid', asyncHandler(async (req, res, next) => {
    const { roundid } = req.params;

    if (roundid !== 'a' && roundid !== 'b' && roundid !== 'c') {
        res.status(400).json({message: 'The round does not exist'})
    }

    const payload = {userid: req.user.id, roundid };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '3h'});

    res.json({roundToken: token});
}));

router.get('/:roundid', asyncHandler(async (req, res, next) => {
    const { roundid } = req.params;
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
            return res.status(403).json({message: 'invalid or expired token'});
        }

        const user = await User.findById(req.user.id).exec();
        const Path = getPath(user.path_number);

        const round = await Path.findOne({round: `8${roundid}`}).exec();
        res.json(round);
    });
}));
