require('dotenv').config();
const { name } = require('ejs');
var express = require("express");
var router = express.Router();
const User = require('../models/appoint'); 

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

router.get('/', (req, res) => {
  res.render('admin'); // Assuming your EJS file is named 'admin.ejs'
});

router.get('/appointView', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.render('appointView', { users: users });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching data");
    }
});

module.exports = router;