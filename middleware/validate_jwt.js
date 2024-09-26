const jwt = require('jsonwebtoken');

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
    if (req.user?.username !== 'admin') {
        return res.status(403).json({ error: 'You are not authorized to access this resource' });
    }
    next();
}

module.exports = {
    validateJWT,
    isAdmin,
};
