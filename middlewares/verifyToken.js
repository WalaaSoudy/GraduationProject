const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, authData) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            req.authData = authData;
        });

        req.token = token;
        
        next();
    } else {
        return res.status(403).json({ message: 'Forbidden' });
    }
}
module.exports = verifyToken;