const express = require('express');
const router = express.Router();
const Tutor = require('../../models/TutorInfo');

router.get('/tutorData/:tutorId', async (req, res) => {
    try {
      const tutorId = req.params.tutorId;
      // Use the tutorId to find the tutor in the database
      const tutor = await Tutor.findById(tutorId);
      res.status(200).json(tutor);
    } catch (error) {
      console.error('Error retrieving tutor:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  });