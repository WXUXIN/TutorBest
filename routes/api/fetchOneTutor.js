const express = require('express');
const router = express.Router();
const Tutor = require('../../models/TutorInfo');
const auth = require('../../middleware/auth');


router.get('/', auth, async (req, res) => {    
    try {

      const { tutorId } = req.query;

    // Populate the user field with the entire user object
    // creates access to tutor's user model 
      const tutorData = await Tutor.findOne({ user: tutorId })
      .populate('user')
      res.json(tutorData);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  module.exports = router;