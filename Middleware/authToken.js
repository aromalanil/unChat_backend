/*Middleware to check if the user is authorized using jwt*/

const jwt = require('jsonwebtoken');
const userModel = require('../Models/User');

const authToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];

    if (!accessToken) {
        res.status(401).json({ error: "Unauthorized" })
    }
    else {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                res.status(403).json({ error: "Invalid accessToken" });
            }
            else {
                userModel.findOne({ username: user.username }).then(userData => {
                    if (userData.tokenVersion > user.tokenVersion) {
                        res.status(403).json({ error: "Token no longer valid" })
                    }
                    else {
                        req.user = user;
                        next();
                    }
                })
            }
        });
    }
};

module.exports = authToken