const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const userModel = require('../Models/User');

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
        if(!user){
            res.status(404);
            res.json({error: "User Not Found"})
        }

        if(await bcrypt.compare(password,user.password)){
            res.send("Success")
        }
        else{
            res.json({error : "Invalid Password"})
        }
    }
    else {
        res.json({
            error: "All fields are required"
        })
    }
})


module.exports = router;