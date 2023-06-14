const express = require('express');
const router = express.Router();
const Tutor = require('../../models/TutorInfo');

router.get('/', async (req, res) => {

    try {
        const { tuteeID } = req.query;
    
        // Find tutors based on the tuteeId
        const tutors = await Tutor.find({ tutees: tuteeID });
        res.status(200).json({ tutors });

      } catch (error) {
        console.error('Error retrieving tutors:', error);
        res.status(500).json({ message: 'Server Error' });
      }
    });
    
    module.exports = router;
