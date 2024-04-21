const express = require('express');
const router = express.Router();
const Staff = require('../models/staff');
const multer = require('multer');
const fs = require('fs');

//Upload a image
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./uploads");
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

var Upload = multer({
    storage: storage,
}).single("image");

//Insert the staff into the database
router.post("/addStaff", Upload, async (req, res) => {
    const staff = new Staff({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        usertype: req.body.usertype,     //////////////////////
        image: req.file.filename,
    });

    try {
        await staff.save();
        req.session.message = {
            type: "success",
            message: "Staff Member Added Successfully!",
        };
        res.redirect("/staffView");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});


//Get all staff route
router.get("/staffView", async (req, res) => {
    try {
        const Staffs = await Staff.find().exec();
        res.render('staffView', {
            title: 'Home Page',
            Staff: Staffs,
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});

router.get("/addStaff",(req, res) =>{
    res.render("add_staff", {title: "Add Staff" });
});

//Edit exsisting user
router.get("/editStaff/:id", async (req, res) =>{
    let id = req.params.id;
    try {
        const staff = await Staff.findById(id).exec();
        if (staff == null) {
            res.redirect("/staffView");
        } else {
            res.render("edit_staff",{
                title: "Edit Staff", 
                staff: staff,
            });
        }
    } catch (err) {
        res.redirect("/staffView");
    }
});

//Update User route
router.post("/updateStaff/:id", Upload, async (req, res) => {
    let id = req.params.id;
    let new_image = '';

    if(req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync("./uploads/" + req.body.old_image);
        }catch(err){
            console.log(err);
        }
    } else{
        new_image = req.body.old_image;
    }
    try {
        await Staff.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            usertype: req.body.usertype,     ////////////////////
            image: new_image, 
        }).exec();
        req.session.message = {
            type:"success",
            message: "Staff Member Updated Successfuly",
        };
        res.redirect("/staffView");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

//Delete User route
router.get('/deleteStaff/:id', async (req, res) =>{
    let id = req.params.id;
    try {
        const result = await Staff.findByIdAndDelete(id);
        if(result.image != ''){
            try{
                fs.unlinkSync('./uploads/'+ result.image);
            }catch(err){
                console.log(err);
            }
        }

        req.session.message = {
            type: "info",
            message: "Staff Member Deleted Successfully",
        };
        res.redirect("/staffView");
    } catch (err) {
        res.json({ message: err.message });
    }
});

module.exports = router;