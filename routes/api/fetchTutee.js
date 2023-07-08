const express = require('express');
const router = express.Router();
const Tutee = require('../../models/TuteeInfo');
const auth = require('../../middleware/auth');


router.get('/', auth, async (req, res) => {    
    try {

      const { tuteeId } = req.query;

    // Populate the user field with the entire user object
    // creates access to tutee's user model 
    // returns all the data of tutee and the user field of tutee will include {name, email, etc}
      const tuteeData = await Tutee.findOne({ user: tuteeId })
      .populate('user')
      console.log(tuteeData)
      res.json(tuteeData);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  module.exports = router;