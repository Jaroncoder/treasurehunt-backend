const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const User = require('../model/users');
const path = require('path');
const fs = require('fs');
router.get('/image/:username', asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).exec();
    
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    const imagePath = path.join(__dirname, '../public/images', `${user.username}.jpg`);

    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.status(404).json({ message: 'Image not found' });
            return;
        }

        res.sendFile(imagePath);
    });
}));

router.post('/image/:username/verify', asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).exec();
    
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    const { key } = req.body;

    if (key === user.imageKey) {
        res.json({ message: 'Key verified, proceed to the next round' });
    } else {
        res.status(401).json({ message: 'Incorrect key, please try again', retry: true });
    }
}));

module.exports = router;