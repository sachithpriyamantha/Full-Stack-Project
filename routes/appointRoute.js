const express = require('express');
const router = express.Router();
const User = require('../models/appoint');

// Insert the appointment into the database
// Render the appointment user page
router.get("/addAppoint", (req, res) => {
    res.render("add_appoint", { title: "Add Appoints" });
});
router.post("/add", async (req, res) => {
    const user = new User({
        name: req.body.name,
        age: req.body.age,
        phone: req.body.phone,
        time:req.body.time,
        service:req.body.service,
        doctor:req.body.doctor,
    });

    try {
        await user.save();
        req.session.message = {
            type: "success",
            message: "Appointment Added Successfully!",
        };
        res.redirect("/");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

// Get all appointment route with doctor filter

router.get("/", async (req, res) => {
    try {
        // Get the doctor's name from query parameters
        const doctorName = req.query.doctor;

        // Define a filter object based on the doctor's name
        const filter = doctorName ? { doctor: doctorName } : {};

        // Use the filter in the find query
        const users = await User.find(filter).exec();

        res.render('index', {
            title: 'Home Page',
            users: users,
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});

// Edit existing appointment
router.get("/editAppoint/:id", async (req, res) => {
    let id = req.params.id;
    try {
        const user = await User.findById(id).exec();
        if (user == null) {
            res.redirect("/");
        } else {
            res.render("edit_appoint", {
                title: "Edit Appoint",
                user: user,
            });
        }
    } catch (err) {
        res.redirect("/appointView");
    }
});

// Update appointment route
router.post("/updateAppoint/:id", async (req, res) => {
    let id = req.params.id;

    try {
        await User.findByIdAndUpdate(id, {
            name: req.body.name,
            age: req.body.age,
            phone: req.body.phone,
            time:req.body.time,
            service:req.body.service,
            doctor:req.body.doctor,
        }).exec();
        req.session.message = {
            type: "success",
            message: "Appointment Updated Successfully",
        };
        res.redirect("/appointView");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

// Delete appointment route
router.get('/deleteAppoint/:id', async (req, res) => {
    let id = req.params.id;
    try {
        await User.findByIdAndDelete(id);

        req.session.message = {
            type: "info",
            message: "Appointment Deleted Successfully",
        };
        res.redirect("/appointView");
    } catch (err) {
        res.json({ message: err.message });
    }
});

module.exports = router;
