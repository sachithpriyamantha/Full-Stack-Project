
const Patient = require('../models/patient');
const express = require('express');
const router = express.Router();
const session = require('express-session');

router.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
  }));
  /*
  router.get('/Userlogin', (req, res) => {
      // Ensure this route is correctly defined
      res.status(200).send('User Login');
    })
  */
router.post('/Userlogin', async (req, res) => {
    const { name, email } = req.body;

    try {
        const patient = await Patient.findOne({ name });

        if (patient && patient.email === email) {
            req.session.name = patient.name;
            req.session.message = `Welcome, ${name}!`;
            return res.redirect('/index');
        } else {
            req.session.message = 'Invalid credentials';
            return res.redirect('/Userlogin');
        }
    } catch (error) {
        console.error(error);
        req.session.message = 'Error during login';
        res.redirect('/Userlogin');
    }
});

router.get('/index', (req, res) => {
    const name = req.session.name;

    if (name) {
        res.render('index', { name });
    } else {
        // Redirect to login if the user is not authenticated
        res.redirect('/Userlogin');
    }
});

module.exports = router;
