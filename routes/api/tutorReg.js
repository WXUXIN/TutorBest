const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require ('jsonwebtoken');
const config = require('config');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');


// To bring in the User model and use this to interact with the database
const Tutor = require('../../models/TutorInfo');

// Write this for every route
// @route   GET/POST api/users
// @desc    Register user
// @access  Public / Private (need token)


// @route   GET api/users
// @desc    Register user
// @access  Public

// For registering a user
router.post('/', 
    async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {userID,
        isTutor,
        subjectList,
        description, 
        highestQualification} = req.body;
 
    try {
    // See if user exists
    let user = await User.findOne({ _id: userID });
    
    if (!user) {
        // If user exists, send back error
        return res.status(400).json({ errors: [{ msg: 'User does not exist' }] });
    } else {
        // Update the document without returning it
        await User.findOneAndUpdate({ _id: userID }, { isTutor: true});
    }


    // // Get users gravatar
    // const avatar = gravatar.url(email, {
    //     // These are the options for the avatar
    //     s: '200', // size
    //     r: 'pg', // rating
    //     // mm is the default image
    //     d: 'mm' // default
    // })

    // user = new User({
    //     name,
    //     email,
    //     avatar,
    //     password,
    //     isTutor
    // });

    // // Encrypt password
    // const salt = await bcrypt.genSalt(10);

    // // Hash the password by creating a hash and passing in the password and salt
    // user.password = await bcrypt.hash(password, salt);
    // await user.save()

    // If user indicated that he/she wants to be a tutor
    if (isTutor) {
        const tutor = new Tutor({
          user: userID, // Set the user reference for the tutor
          subjectList,
        // note that 
        // the first user in the tutees array is the tutor himself/herself
        // due to duplicate inde error
          tutees: [user._id],
          description,
          highestQualification
        });
        await tutor.save();
    }

    // Return jsonwebtoken, this is for user to login right away after registration
    const payload = {
        user: {
            id: user.id
        }
    }

    // Sign the token
    // Basically this will give us a token to access protected routes 
    // and this encodes the payload which includes the user id into the token
    jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, 
    (err, token) => {
        if(err) throw err;
        res.json({ token });
    });

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;