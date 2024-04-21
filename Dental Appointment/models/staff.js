const mongoose = require('mongoose');
const staffSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type: String,
        required:true,
    },
    usertype: { 
        type: String, enum: ['staff', 'admin'], 
        required: true 
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

module.exports = mongoose.model("staff", staffSchema);
