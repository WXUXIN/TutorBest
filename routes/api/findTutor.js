const express = require('express');
const router = express.Router();
const Tutor = require('../../models/TutorInfo');
const Tutee = require('../../models/TuteeInfo');
const User = require('../../models/User');


router.get('/', async (req, res) => {

    try {

      // line const { tuteeID } = req.query; extracts the value of the tuteeID property from the req.query object.
      // For example, if the URL is http://example.com/api/findTutor?tuteeID=123, then req.query would be { tuteeID: '123' } or if defined in params in th axios call
      // userID is the TUTEE's user field
        const { userID } = req.query;
    
        // Find tutors based on the tuteeId
        // populate('user') method is used to populate the user field in the Tutor model, which is a reference to the User model.
        // This allows us to access the name field of the user associated with each tutor.
        // returns array of tutors with the tutee's user field in their tutees array
        const tutee = await Tutee.findOne({ user: userID }).populate(
          'tutors' // Update the model name to match your User model
        );

        if (!tutee) {
          return res.status(404).json({ message: 'Tutee not found' });
        }

        const tutorUsers = await Promise.all(
          tutee.tutors.map(async (tutor) => {
            const populatedTutor = await Tutor.findOne({ user: tutor._id }).populate('user');
            return populatedTutor;
          })
        );

        //.populate('user');

        // map over the fetched tutors and return only the user field, which represents the associated user object. (user id, name, email, etc)
        // const tutorUsers = tutors.map((tutor) => tutor.user);

        res.status(200).json(tutorUsers);
        console.log('success');

      } catch (error) {
          console.error('Error retrieving tutors:', error);
          res.status(500).json({ message: 'Server Error' });
      }
    });
    
    module.exports = router;
