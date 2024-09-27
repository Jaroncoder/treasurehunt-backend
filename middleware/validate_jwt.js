const jwt = require('jsonwebtoken');
const { isRunning } = require('../utils/globals');

function validateJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token not found' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        req.user = payload;
        next();
    });
}

function isAdmin(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token not found' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        if (payload.id !== 'admin') {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
         next();
    });
}

function checkIfEventIsInProgress(req, res, next) {
    if (!isRunning()) {
        return res.status(403).json({ message: 'The event is not in progress' });
    }
    next();
}

module.exports = {
    validateJWT,
    isAdmin,
    checkIfEventIsInProgress,
};
