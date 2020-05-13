const express = require('express');
const router = express.Router();
const userModel = require('../Models/User');
const messageModel = require('../Models/Message');

router.post('/:username', async (req, res) => {
    const username = req.params.username;
    const message = req.body.message;

    if (!message) {
        res.status(400).json({ error: "Message field cannot be empty" });
    }

    const user = await userModel.findOne({ username: username });
    if(!user){
        res.status(400).json({ error: `User '${username}' does not exist` })
    }

    let userMessages = await messageModel.findOne({ username: username });
    if (!userMessages) {
        userMessages = new messageModel({
            username: username,
            messages: [{
                data: message
            }]
        })
        userMessages.save();
        res.sendStatus(200);
    }
    else {
        userMessages.messages.push({ data: message });
        userMessages.save();
        res.sendStatus(200);
    }
})



module.exports = router;