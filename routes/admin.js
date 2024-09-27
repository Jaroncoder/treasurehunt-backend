const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const globals = require('../utils/globals');

router.get('/start', asyncHandler(async (req, res, next) => {
    globals.start();
    res.json({message: 'Event started'});
}));

router.get('/stop', asyncHandler(async (req, res, next) => {
    globals.stop();
    res.json({message: 'Event stopped'});
}));

router.get('/extend', asyncHandler(async (req, res, next) => {
    const { minutes } = req.query;
    const newEndTime = globals.extendEndTime(minutes);
    res.json({message: 'Event extended', newEndTime});
}));

module.exports = router;
