const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

// To bring in the User model and use this to interact with the database
const User = require("../../models/User");
const Tutor = require("../../models/TutorInfo");
const Tutee = require("../../models/TuteeInfo");

// Write this for every route
// @route   GET/POST api/users
// @desc    Register user
// @access  Public / Private (need token)

// @route   GET api/users
// @desc    Register user
// @access  Public

// For registering a user

router.post("/", async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userID, subjectList, highestQualification, description } = req.body;

  try {
    // See if user exists
    let tutor = await Tutor.findOne({ user: userID });

    if (!tutor) {
      // If user exists, send back error
      return res
        .status(400)
        .json({ errors: [{ msg: "Tutor does not exist" }] });
    }

    // Update tutor documents
    const updatedFields = {};

    // Loop through req.body and update tutor documents if conditions are met
    for (const [key, value] of Object.entries(req.body)) {

    // If subject array is empty, or other fileds are empty, do not update
      if (
        (Array.isArray(value) && value.length === 0) ||
        (value === "" && !Array.isArray(value))
      ) {
        continue;
      }

      updatedFields[key] = value;
    }

    // Update tutor documents if there are any updated fields
    if (Object.keys(updatedFields).length > 0) {
      await Tutor.findOneAndUpdate({ user: userID }, { $set: updatedFields });
    }

    // Return jsonwebtoken, this is for user to login right away after registration
    const payload = {
      user: {
        id: userID,
      },
    };

    // Sign the token
    // Basically this will give us a token to access protected routes
    // and this encodes the payload which includes the user id into the token
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
