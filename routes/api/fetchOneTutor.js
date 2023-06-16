const express = require('express');
const router = express.Router();
const Tutor = require('../../models/TutorInfo');
const auth = require('../../middleware/auth');


router.get('/', auth, async (req, res) => {    
    try {

      const { tutorId } = req.query;

    // Populate the user field with the entire user object
    // creates access to tutor's user model 
    // returns all the data of tutor and the user field of tutor will include {name, email, etc}
      const tutorData = await Tutor.findOne({ user: tutorId })
      .populate('user')
      res.json(tutorData);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  module.exports = router;