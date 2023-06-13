const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Tutor = require('../../models/TutorInfo');
const { check, validationResult } = require('express-validator');
const jwt = require ('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

// Write this for every route
// @route   GET/POST api/users
// @desc    Register user
// @access  Public / Private (need token)


// @route   GET api/auth
// @desc    Return user data if authenticated
// @access  Public
router.get('/', auth, async (req, res) => {    
    try {
        
        // We are trying to access
        // const payload = {
        //     user: {
        //         id: user.id
        //     }
        // }
        // Which is the infromation that is originally encoded into the JWT in the routes/api/users.js file
        // when users are first created
        
        // only select tutor subjects
        const tutorData = await Tutor.findOne({user: req.user.id})

        // Returns
        // {
        //     "_id": "5f9b0b7b7f0b3b1b7c3b0b7b",
        //     "subjectList": [{
        //         "level": "pri",
        //         "subject": "A",
        //         "price" : 20
        //     }]
        // }

        res.json(tutorData);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;