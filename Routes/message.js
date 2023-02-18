/* Message Router */

const express = require('express');
const router = express.Router();
const userModel = require('../Models/User');
const messageModel = require('../Models/Message');
const { encryptString } = require('../Helpers/Crypto');

if (process.env.ENVIRONMENT != 'Production')  //Only Required for Development Environment
{
    require('dotenv').config();
}

//Send message to user using his username
router.post('/:username', async (req, res) => {
    const username = req.params.username;
    const message = req.body.message;

    if (!message) {
        res.status(400).json({ error: "Message field cannot be empty" });
        return;
    }

    const user = await userModel.findOne({ username: username });
    if (!user) {
        res.status(400).json({ error: `User '${username}' does not exist` });
        return;
    }

    let encryptedMessage;
    try {
        encryptedMessage = await encryptString(message);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to encrypt message" });
        return;
    }

    let userMessages = await messageModel.findOne({ username: username });
    if (!userMessages) {
        userMessages = new messageModel({
            username: username,
            messages: [{
                data: encryptedMessage
            }]
        })
        userMessages.save();
        res.sendStatus(200);
    }
    else {
        userMessages.messages.push({ data: encryptedMessage });
        userMessages.save();
        res.sendStatus(200);
    }
})


module.exports = router;