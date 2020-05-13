const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const messageSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    messages: [{
        data: {
            type: String,
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
});

messageSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', messageSchema);