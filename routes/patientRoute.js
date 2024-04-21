const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
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
router.post("/addPatient", Upload, async (req, res) => {

    const patient = new Patient({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,
    });

    try {
        await patient.save();
        req.session.message = {
            type: "success",
            message: "Patient Added Successfully!",
        };
        res.redirect("/Userlogin");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});


//Get all users route
router.get("/patientView", async (req, res) => {
    try {
        const Patients = await Patient.find().exec();
        res.render('patientView', {
            title: 'Patient Page',
            Patient: Patients,
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});

router.get("/addPatient",(req, res) =>{
    res.render("add_patient", {title: "Add Patients" });
});

//Edit esisting user
router.get("/editPatient/:id", async (req, res) =>{
    let id = req.params.id;
    try {
        const patient = await Patient.findById(id).exec();
        if (patient == null) {
            res.redirect("/patientView");
        } else {
            res.render("edit_patients",{
                title: "Edit Patient", 
                patient: patient,
            });
        }
    } catch (err) {
        res.redirect("/patientView");
    }
});

//Update User route
router.post("/updatePatient/:id", Upload, async (req, res) => {
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
        await Patient.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image, 
        }).exec();
        req.session.message = {
            type:"success",
            message: "Patient Updated Successfuly",
        };
        res.redirect("/patientView");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

//Delete User route
router.get('/deletePatient/:id', async (req, res) =>{
    let id = req.params.id;
    try {
        const result = await Patient.findByIdAndDelete(id);
        if(result.image != ''){
            try{
                fs.unlinkSync('./uploads/'+ result.image);
            }catch(err){
                console.log(err);
            }
        }

        req.session.message = {
            type: "info",
            message: "Patient Deleted Successfully",
        };
        res.redirect("/patientView");
    } catch (err) {
        res.json({ message: err.message });
    }
});

module.exports = router;