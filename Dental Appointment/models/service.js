const mongoose = require('mongoose');
const serviceSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    desc:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required: true,
    },
    created:{
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model("service", serviceSchema);
