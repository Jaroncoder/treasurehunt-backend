const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Credential = require('../model/credential');
const eventRouter = require('./event');
const validateJWT = require('../middleware/validate_jwt');

router.get('/', (req, res, next) => {
    res.json({
        message: 'hello',
    });
});

router.post('/login', asyncHandler(async (req, res, next) => {
    const user = await Credential.findOne({ username: req.body.username }).exec();

    if (!user) {
        return res.status(401).json({message: 'user not found'});
    }
    
    // add bcrypt
    const verifyPassword = await bcrypt.compare(req.body.password, user.password);
    
    if (!verifyPassword) {
        return res.status(401).json({message: 'Incorrect password'});
    }

    const payload = {id: user.id, username: user.username};
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '6h'});

    res.json({message: 'Authentication successful', token: `Bearer ${token}`});
}));

router.use('/event', validateJWT, eventRouter);

module.exports = router;