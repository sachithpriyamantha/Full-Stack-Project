const Staff = require('../models/staff');
const express = require('express');
const router = express.Router();

router.post('/Stafflogin', async (req, res) => {
  const { name, email } = req.body;

  try {
    const staff = await Staff.findOne({ name, email, });

    if (staff && staff.usertype === 'admin') {
      req.session.staff = staff;
      return res.redirect('/dashboard');
    }  else if (staff && staff.usertype === 'staff') {
      req.session.staff = staff;
      return res.redirect('/staffdashboard');
    } else {
      // Handle other cases if needed
      return res.redirect('/index');
    }
  } catch (error) {
    console.error(error);
    req.session.message = 'Error during login';
    res.redirect('/Stafflogin');
  }
});

module.exports = router;
