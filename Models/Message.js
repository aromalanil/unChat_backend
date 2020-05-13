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
            required: true,
        },
        date: {
            type: Date,
            default: Date.now
        },
        didUserRead: {
            type: Boolean,
            default: false
        }

    }]
});

messageSchema.plugin(uniqueValidator);

module.exports = mongoose.model('message', messageSchema);