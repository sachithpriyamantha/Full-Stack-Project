const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
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

//Insert the Blog into the database
router.post("/addBlog", Upload, async (req, res) => {
    const blog = new Blog({
        name: req.body.name,
        desc: req.body.desc,
        image: req.file.filename,
        
    });

    try {
        await blog.save();
        req.session.message = {
            type: "success",
            message: "Blog Added Successfully!",
        };
        res.redirect("/blogView");//redirect to the add service page again
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});


//Get all Blog route
router.get("/blogView", async (req, res) => {
    try {
        const blog = await Blog.find().exec();
        res.render('blogView', {
            title: 'Blog Page',
            blog : blog,
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});

//Get all Blog route
router.get("/userBlog", async (req, res) => {
    try {
        const blog = await Blog.find().exec();
        res.render('userBlog', {
            title: 'Blog Page',
            blog : blog,
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});

router.get("/addBlog",(req, res) =>{
    res.render("add_blog", {title: "Add Blog" });
});

//Edit exsisting Blog
router.get("/editBlog/:id", async (req, res) =>{
    let id = req.params.id;
    try {
        const blog = await Blog.findById(id).exec();
        if (blog == null) {
            res.redirect("/blogView");
        } else {
            res.render("edit_blog",{
                title: "Edit Blog", 
                blog: blog,
            });
        }
    } catch (err) {
        res.redirect("/blogView");
    }
});

//Update Blog route
router.post("/updateBlog/:id", Upload, async (req, res) => {
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
        await Blog.findByIdAndUpdate(id, {
            name: req.body.name,
            desc: req.body.desc,
            image: new_image, 
           
            
        }).exec();
        req.session.message = {
            type:"success",
            message: "Blog Updated Successfuly",
        };
        res.redirect("/blogView");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

//Delete Blog route
router.get('/deleteBlog/:id', async (req, res) =>{
    let id = req.params.id;
    try {
        const result = await Blog.findByIdAndDelete(id);
        if(result.image != ''){
            try{
                fs.unlinkSync('./uploads/'+ result.image);
            }catch(err){
                console.log(err);
            }
        }

        req.session.message = {
            type: "info",
            message: "Blog Deleted Successfully",
        };
        res.redirect("/blogView");
    } catch (err) {
        res.json({ message: err.message });
    }
});

module.exports = router;