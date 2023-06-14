const express = require('express');
const router = express.Router();
const Tutor = require('../../models/TutorInfo');


router.get('/:tutorId', auth, async (req, res) => {    
    try {

    // Populate the user field with the entire user object
      const tutorData = await Tutor.findOne({ _id: req.params.tutorId })
        .populate('user'); 
  
      res.json(tutorData);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  module.exports = router;