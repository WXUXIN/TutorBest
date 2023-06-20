const express = require('express');
const router = express.Router();
const Tutor = require('../../models/TutorInfo');
const Tutee = require('../../models/TuteeInfo')


router.post('/', async (req, res) => {
    try {
      const { tutorId, tuteeId } = req.body;
  
      // Find the tutor by ID and push tuteeId to tutees array
      const tutor = await Tutor.findByIdAndUpdate(
        tutorId,
        { $push: { tutees: tuteeId } },
        { new: true }
      );
  
      // Find the tutee by ID and push tutorId to tutors array
      const tutee = await Tutee.findByIdAndUpdate(
        tuteeId,
        { $push: { tutors: tutorId } },
        { new: true }
      );
  
      res.json({ tutor, tutee });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  });