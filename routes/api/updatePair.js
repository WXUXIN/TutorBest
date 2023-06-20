const express = require('express');
const router = express.Router();
const Tutor = require('../../models/TutorInfo');
const Tutee = require('../../models/TuteeInfo');
const mongoose = require('mongoose');


router.post('/', async (req, res) => {
    try {
      const { tutorId, tuteeId } = req.body;
  
      // Find the tutor by ID and push tuteeId to tutees array
      // const tutor = await Tutor.findById({ user: tutorId })
      // if (!tutor) {
      //   return res.status(404).json({ message: 'Tutor not found' });
      // }

      // tutor.tutees.push(tuteeId);

      //updating of tutor
      console.log(tutorId);
      console.log(tuteeId);

      // const tutor = await Tutor.findOne({ user: tutorId });

      // console.log(tutor.tutees);

      // if (!tutor) {
      //   return res.status(404).json({ message: 'Tutor not found' });
      // }

      // if (tutor.tutees.includes(tuteeId)) {
      //   return res.status(400).json({ message: 'Tutee already exists for this tutor' });
      // }

      // tutor.tutees.push(new mongoose.Types.ObjectId(tuteeId));

      // console.log(tutor.tutees);

      // console.log('tutor updated', tutor);

      // await tutor.save();
      
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
      // const tutee = await Tutee.findByIdAndUpdate(
      //   ObjectId(tuteeId),
      //   { $push: { tutors: ObjectId(tutorId) } },
      //   { new: true }
      // );

      // console.log('tutee updated');

      // const tutorObjectId = mongoose.Types.ObjectId(tutorId);
      // const tuteeObjectId = mongoose.Types.ObjectId(tuteeId);

      // const tutor = await Tutor.findByIdAndUpdate(
      //   tutorId,
      //   { $push: { tutees: tuteeObjectId } },
      //   { new: true }
      // );

      
      // console.log('tutor updated');
  
      // // Find the tutee by ID and push tutorId to tutors array
      // const tutee = await Tutee.findByIdAndUpdate(
      //   tuteeId,
      //   { $push: { tutors: tutorObjectId } },
      //   { new: true }
      // );

      // console.log('tutee updated');

  
      // res.json({ tutor, tutee });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  });

  module.exports = router;