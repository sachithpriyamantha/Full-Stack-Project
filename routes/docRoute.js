const express = require('express');
const router = express.Router();
const Doctor = require('../models/doctor');
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

//Insert the User into the database
router.post("/addDoctors", Upload, async (req, res) => {

    const doctor = new Doctor({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,
    });

    try {
        await doctor.save();
        req.session.message = {
            type: "success",
            message: "Doctor Added Successfully!",
        };
        res.redirect("/doctorsView");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});


//Get all users route
router.get("/doctorsView", async (req, res) => {
    try {
        const Doctors = await Doctor.find().exec();
        res.render('doctorsView', {
            title: 'Doctor Page',
            Doctor: Doctors,
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});

router.get("/addDoctors",(req, res) =>{
    res.render("add_doctors", {title: "Add Users" });
});

//Get all users route
router.get("/userDoctor", async (req, res) => {
    try {
        const Doctors = await Doctor.find().exec();
        res.render('userDoctor', {
            title: 'Doctor Page',
            Doctor: Doctors,
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});

router.get("/addDoctors",(req, res) =>{
    res.render("add_doctors", {title: "Add Users" });
});

//Edit esisting user
router.get("/editDoctor/:id", async (req, res) =>{
    let id = req.params.id;
    try {
        const doctor = await Doctor.findById(id).exec();
        if (doctor == null) {
            res.redirect("/doctorsView");
        } else {
            res.render("edit_doctors",{
                title: "Edit Doctor", 
                doctor: doctor,
            });
        }
    } catch (err) {
        res.redirect("/doctorsView");
    }
});

//Update User route
router.post("/updateDoctor/:id", Upload, async (req, res) => {
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
        await Doctor.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image, 
        }).exec();
        req.session.message = {
            type:"success",
            message: "Doctor Updated Successfuly",
        };
        res.redirect("/doctorsView");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

//Delete User route
router.get('/deleteDoctor/:id', async (req, res) =>{
    let id = req.params.id;
    try {
        const result = await Doctor.findByIdAndDelete(id);
        if(result.image != ''){
            try{
                fs.unlinkSync('./uploads/'+ result.image);
            }catch(err){
                console.log(err);
            }
        }

        req.session.message = {
            type: "info",
            message: "Doctor Deleted Successfully",
        };
        res.redirect("/doctorsView");
    } catch (err) {
        res.json({ message: err.message });
    }
});

module.exports = router;