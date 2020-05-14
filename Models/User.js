const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokenVersion: {
        type: Number,
        default: 1
    },
    date: {
        type: Date,
        default: Date.now
    }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);