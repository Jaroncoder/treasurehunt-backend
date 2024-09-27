const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../model/users');
const Leaderboard = require('../model/leaderboard');
const middleware = require('../middleware/validate_jwt');

const eventRouter = require('./event');
const leaderboardRouter = require('./leaderboard');
const adminRouter = require('./admin');

const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get('/', (req, res, next) => {
    res.json({
        message: 'hello',
    });
});

router.post('/login', asyncHandler(async (req, res, next) => {
    const username = escapeRegex(req.body.username ?? '');

    const user = await User.findOne({
        username: {$regex: new RegExp(`^${username}$`, 'i')},
    }).exec();

    if (!user) {
        return res.status(401).json({message: 'user not found'});
    }
    
    // add bcrypt
    // const verifyPassword = await bcrypt.compare(req.body.password, user.password);
    const verifyPassword = req.body.password === user.password;
    
    if (!verifyPassword) {
        return res.status(401).json({message: 'Incorrect password'});
    }

    const payload = {id: user.id, username: user.username};
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '6h'});

    const userInLeaderboard = await Leaderboard.findOne({user: user.id}).exec();
    if (!userInLeaderboard) {
        const newUser = new Leaderboard({
            user: user._id,
            score: 0,
        });
        await newUser.save();
    }

    res.json({message: 'Authentication successful', token: `Bearer ${token}`});
}));

router.post('/admin-login', asyncHandler (async (req, res, next) => {
    const { adminPassword } = req.body;
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
        const err = new Error('Page not found');
        err.status = 404;
        return next(err);
    }
    const payload = { id: 'admin' };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' }, (err, token) => {
        if (err) {
            return next(err);
        }
        res.json({ message: 'Authentication successful', token: `Bearer ${token}` });
    });
}));

router.use('/event', middleware.checkIfEventIsInProgress, middleware.validateJWT, eventRouter);
router.use('/leaderboard', middleware.checkIfEventIsInProgress ,middleware.validateJWT, leaderboardRouter);
router.use('/admin', middleware.isAdmin, adminRouter);

module.exports = router;
