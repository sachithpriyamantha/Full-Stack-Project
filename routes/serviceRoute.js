const express = require('express');
const router = express.Router();
const Service = require('../models/service');
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

//Insert a service into the database
router.post("/addService", Upload, async (req, res) => {
    const service = new Service({
        name: req.body.name,
        desc: req.body.desc,
        image: req.file.filename,
    });

    try {
        await service.save();
        req.session.message = {
            type: "success",
            message: "Service Added Successfully!",
        };
        res.redirect("/serviceView");//redirect to the add service page again
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});


//Get all service route
router.get("/serviceView", async (req, res) => {
    try {
        const services = await Service.find().exec();
        res.render('serviceView', {
            title: 'Service Page',
            service: services,
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});

router.get("/addService",(req, res) =>{
    res.render("add_services", {title: "Add Services" });
});

//Get all service route
router.get("/userService", async (req, res) => {
    try {
        const services = await Service.find().exec();
        res.render('userService', {
            title: 'Service Page',
            service: services,
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});

router.get("/addService",(req, res) =>{
    res.render("add_services", {title: "Add Services" });
});

//Edit exsisting service
router.get("/editService/:id", async (req, res) =>{
    let id = req.params.id;
    try {
        const service = await Service.findById(id).exec();
        if (service == null) {
            res.redirect("/serviceView");
        } else {
            res.render("edit_services",{
                title: "Edit Services", 
                service: service,
            });
        }
    } catch (err) {
        res.redirect("/serviceView");
    }
});

//Update User service
router.post("/updateService/:id", Upload, async (req, res) => {
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
        await Service.findByIdAndUpdate(id, {
            name: req.body.name,
            desc: req.body.desc,
            image: new_image, 
        }).exec();
        req.session.message = {
            type:"success",
            message: "Service Updated Successfuly",
        };
        res.redirect("/serviceView");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

//Delete service route
router.get('/deleteService/:id', async (req, res) =>{
    let id = req.params.id;
    try {
        const result = await Service.findByIdAndDelete(id);
        if(result.image != ''){
            try{
                fs.unlinkSync('./uploads/'+ result.image);
            }catch(err){
                console.log(err);
            }
        }

        req.session.message = {
            type: "info",
            message: "Service Deleted Successfully",
        };
        res.redirect("/serviceView");
    } catch (err) {
        res.json({ message: err.message });
    }
});

module.exports = router;