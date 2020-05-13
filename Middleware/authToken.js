const jwt = require('jsonwebtoken');

const authToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];

    if (!accessToken) {
        res.status(401);
        res.json({error : "Unauthorized"})
    }
    else {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                res.status(403);
                res.send("Invalid accessToken");
            }
            else {
                req.user = user;
                next();
            }
        })
    }
};

module.exports = authToken