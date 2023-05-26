const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
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

        const user = await User.findById(req.user.id).select('-password'); // Don't return the password
        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/users
// @desc    Authenticate user and get token (Login)
// @access  Public
router.post('/', 
    check('email', 'Please include a valid email').not().isEmpty(), 
    check('password', 'Password is required').exists()
    ,
    // req here will be what the user enters when trying to log in
    async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;

    try {
    // See if user exists
    let user = await User.findOne({ email });
    
    if (!user) {
        // If user exists, send back error
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    // Make sure that the password matches the password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
        // If user exists, send back error
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    };

    // Return jsonwebtoken, this is for user to login right away after registration
    const payload = {
        user: {
            id: user.id
        }
    };

    // Sign the token
    // Basically this will give us a token to access protected routes 
    // and this encodes the payload which includes the user id into the token
    jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
