const express = require('express');
const router = express.Router();
const Tutor = require('../../models/TutorInfo');
const Tutee = require('../../models/TuteeInfo');
const mongoose = require('mongoose');

// this route not actually needed 

router.post('/', async (req, res) => {
    try {
      const { tutorId, tuteeId } = req.body;
  
      // Find the tutor by ID and push tuteeId to tutee's tutor array

      console.log(tutorId);
      console.log(tuteeId);
      
      // updating of tutee
      const tutee = await Tutee.findOne({ user: tuteeId });

      console.log(tutee.tutors);

      if (!tutee) {
        return res.status(404).json({ message: 'Tutee not found' });
      }

      if (tutee.tutors.includes(tutorId)) {
        return res.status(400).json({ message: 'Tutor already exists for this tutee' });
      }
  
      tutee.tutors.push(new mongoose.Types.ObjectId(tutorId));
      console.log(tutee.tutors);
      console.log('tutee updated', tutee);
      await tutee.save();
      
      //send back tutee info in json format
      res.json(tutee);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  });

  module.exports = router;