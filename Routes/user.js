/* User Router */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authToken = require('../Middleware/authToken');

const userModel = require('../Models/User');
const messageModel = require('../Models/Message');
const tokenModel = require('../Models/Token');


//To register a new user
router.post('/register', async (req, res) => {
    const name = req.body.name;
    const password = req.body.password;
    const username = req.body.username;

    if (name && password && username) //Checking if any field is empty
    {
        const hashedPassword = await bcrypt.hash(password, 8);

        const user = new userModel({
            name: name,
            password: hashedPassword,
            username: username
        })
        user.save((err, result) => {
            if (err) {
                res.json(err);
            }
            res.send(201).json({ error: "User created" });
        });
    }
    else {
        res.json({
            error: "All fields are required"
        })
    }
});


//To make an existing user login
router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        const user = await userModel.findOne({ username: username });
        if (!user) {
            res.status(404);
            res.json({ error: "User Not Found" })
        }

        if (await bcrypt.compare(password, user.password)) {

            const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' });
            const refreshToken = jwt.sign({ username: user.username }, process.env.REFRESH_TOKEN_SECRET);
            const token = new tokenModel({
                data: refreshToken
            })
            token.save();
            res.json({ accessToken, refreshToken });
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


//Generate new accessToken from refreshToken
router.get('/token', async (req, res) => {
    const token = await tokenModel.findOne({ data: req.body.token })

    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
    }
    else {
        jwt.verify(token.data, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                res.status(403);
                res.send("Invalid Token" + err);
            }
            else {
                const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' });
                res.json({ accessToken })
            }
        })
    }

});


//Logout the user
router.delete('/logout', authToken, (req, res) => {
    const token = req.body.token;

    tokenModel.findOneAndDelete({ data: token }, (err, data) => {
        res.sendStatus(204)
    });
})


//Returns the details of a user
router.get('/dashboard', authToken, async (req, res) => {
    const username = req.user.username;
    const user = await userModel.findOne({ username: username });
    const messages = await messageModel.findOne({ username: username });
    const data = {
        username: user.username,
        name: user.name,
        messages: messages && messages.messages
    }
    res.json(data);
});


//Change Password of User
router.post('/password', async (req, res) => {
    const password = req.body.password;
    const username = req.body.username;
    const newPassword = req.body.newPassword;

    if (password && username) //Checking if any field is empty
    {
        const user = await userModel.findOne({ username: username });
        if (user) {
            
            if (await bcrypt.compare(password, user.password)) {
                
                const hashedPassword = await bcrypt.hash(newPassword, 8);
                user.password = hashedPassword;
                user.save((err, result) => {
                    if (err) {
                        res.status(500).json({ error: "Unable to Save" })
                    }
                    else {
                        res.json({ message: "Password Changed" })
                    }
                })
            }
            else{
                res.status(401).json({ error: "Invalid Password" })
            }
        }
        else {
            res.status(404).json({error:"User not found"})
        }

    }
    else {
        res.status(400).json({
            error: "All fields are required"
        })
    }
});


//Get details of a particular user
router.get('/:username', async (req, res) => {
    const username = req.params.username;
    const user = await userModel.findOne({ username: username });

    if (user) {
        res.json({ username: user.username, name: user.name });
    }
    else {
        res.status(404).json({ error: "User not found" })
    }
});


module.exports = router;