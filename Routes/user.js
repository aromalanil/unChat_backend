/* User Router */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authToken = require('../Middleware/authToken');

const userModel = require('../Models/User');
const messageModel = require('../Models/Message');


//To register a new user
router.post('/register', async (req, res) => {
    const name = req.body.name;
    const password = req.body.password;
    const username = req.body.username;

    if (name && password && username) //Checking if any field is empty
    {
        try {
            const hashedPassword = await bcrypt.hash(password, 8);
        }
        catch (err) {
            res.status(500).json({ error: "Error in hashing user password" });
            return;
        }
        const user = new userModel({
            name: name,
            password: hashedPassword,
            username: username
        })

        user.save((err, result) => {
            if (err) {
                if (err.name === "ValidationError") {
                    res.status(409).json({ error: "Username exist" });
                }
                else {
                    res.json({ error: err.message });
                }
            }
            else {
                res.status(201).json({ message: "User created" });
            }
        });
    }
    else {
        res.status(400).json({
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
            res.status(404).json({ error: "User Not Found" });
            return;
        }
        if (await bcrypt.compare(password, user.password)) {
            const data = { username: user.username, name: user.name, tokenVersion: user.tokenVersion };
            const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
            res.json({ accessToken });
        }
        else {
            res.status(401).json({ error: "Invalid Password" })
        }
    }
    else {
        res.status(400).json({ error: "All fields are required" })
    }
});


//Logout the user
router.delete('/logout', authToken, async (req, res) => {
    const username = req.user.username;
    const user = await userModel.findOne({ username: username });

    user.tokenVersion++;
    user.save((err, result) => {
        if (err) {
            res.json({ error: err.message });
        }
        else {
            res.status(201).json({ message: "Successfully Logged out" });
        }
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

    if (password && username && newPassword) //Checking if any field is empty
    {
        const user = await userModel.findOne({ username: username });
        if (!user) {
            res.status(404).json({ error: "User not found" })
            return;
        }

        if (await bcrypt.compare(password, user.password)) {

            const hashedPassword = await bcrypt.hash(newPassword, 8);
            user.password = hashedPassword;
            user.save((err, result) => {
                if (err) {
                    res.status(500).json({ error: "Unable to Save" })
                }
                else {
                    res.status(200).json({ message: "Password Changed" });
                }
            })
        }
        else {
            res.status(401).json({ error: "Invalid Password" });
        }
    }
    else {
        res.status(400).json({error: "All fields are required"});
    }
});


//Get details of a particular user
router.get('/:username', async (req, res) => {
    const username = req.params.username;
    const user = await userModel.findOne({ username: username });

    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    res.json({ username: user.username, name: user.name });

});


module.exports = router;