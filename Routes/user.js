const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authToken = require('../Middleware/authToken');
const userModel = require('../Models/User');
const messageModel = require('../Models/Message');

router.post('/register', async (req, res) => {
    let name = req.body.name;
    let password = req.body.password;
    let username = req.body.username;

    if (name && password && username) {
        let hashedPassword = await bcrypt.hash(password, 8);

        let user = new userModel({
            name: name,
            password: hashedPassword,
            username: username
        })
        user.save((err, result) => {
            if (err) {
                res.json(err);
            }
            res.json(result);
        });
    }
    else {
        res.json({
            error: "All fields are required"
        })
    }
});

router.get('/login', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {
        let user = await userModel.findOne({ username: username });
        if (!user) {
            res.status(404);
            res.json({ error: "User Not Found" })
        }

        if (await bcrypt.compare(password, user.password)) {

            const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET);
            res.json({ accessToken: accessToken })
        }
        else {
            res.status(401);
            res.json({ error: "Invalid Password" })
        }
    }
    else {
        res.status(400);
        res.json({ error: "All fields are required" })
    }
});

router.get('/dashboard', authToken, async (req, res) => {
    const username = req.user.username;
    const user = await userModel.findOne({ username: username });
    const messages = await messageModel.findOne({ username: username });
    const data ={
        username :user.username,
        name : user.name,
        messages: messages && messages.messages
    }
    res.json(data)
})


module.exports = router;