const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
   age: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
    service: {
        type: String,
        required: true,
    },
    doctor: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model("appoint", userSchema);
