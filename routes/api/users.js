const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
// To bring in the User model and use this to interact with the database
const User = require("../../models/User");
const Tutor = require("../../models/TutorInfo");
const Tutee = require("../../models/TuteeInfo");

// Write this for every route
// @route   GET/POST api/users
// @desc    Register user
// @access  Public / Private (need token)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "client/public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter });

// @route   GET api/users
// @desc    Register user
// @access  Public
// For registering a user
router.post(
  "/",
  upload.single("photo"),
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please include a valid email").not().isEmpty(),
  check(
    "password",
    "Please enter a password that has 6 or more characters"
  ).isLength({ min: 6 }),

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const subjectList = JSON.parse(req.body.subjectList);
    const isTutor = JSON.parse(req.body.isTutor);
    const { name, email, password, description, highestQualification } =
      req.body;

    const photo = req.file.filename;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (user) {
        // If user exists, send back error
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // Get users gravatar
      const avatar = gravatar.url(email, {
        // These are the options for the avatar
        s: "200", // size
        r: "pg", // rating
        // mm is the default image
        d: "mm", // default
      });

      user = new User({
        name,
        email,
        avatar,
        password,
        isTutor,
        photo,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);

      // Hash the password by creating a hash and passing in the password and salt
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // If user indicated that he/she wants to be a tutor

      if (isTutor) {
        const tutor = new Tutor({
          user: user._id, // Set the user reference for the tutor
          subjectList,
          // note that
          // the first user in the tutees array is the tutor himself/herself
          // due to duplicate index error
          description,
          tutees: [user._id],
          highestQualification,
        });
        await tutor.save();
      }

      const tutee = new Tutee({
        user: user._id,
      });

      await tutee.save();

      // Return jsonwebtoken, this is for user to login right away after registration
      const payload = {
        user: {
          id: user.id,
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
  }
);

module.exports = router;
