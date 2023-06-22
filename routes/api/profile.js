const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Tutor = require("../../models/TutorInfo");
const Tutee = require("../../models/TuteeInfo");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");

// Write this for every route
// @route   GET/POST api/users
// @desc    Register user
// @access  Public / Private (need token)

// @route   GET api/profile/
// @desc    Get all tutor's information with user field replaced
//          with user's information
// @access  Private
router.get("/", async (req, res) => {
  try {
    const profiles = await Tutor.find().populate("user");
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/profile/filter
// @desc    Get filtered tutor profiles
// @access  Public
router.get("/filter", async (req, res) => {
  const { levelOfStudy, subject } = req.query;

  try {
    const filteredProfiles = await Tutor.find({
      subjectList: { $elemMatch: { level: levelOfStudy, subject: subject } },
    }).populate("user");

    res.json(filteredProfiles);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get tutor's information by tutor id
// @access  Private
router.get("/user/:user_id", async ({ params: { user_id } }, res) => {
  try {
    const profile = await Tutor.findOne({
      _id: user_id,
    }).populate("user");

    if (!profile) return res.status(400).json({ msg: "Profile not found" });

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server error" });
  }
});


// @route   GET api/profile/registeredTutors
// @desc    Get all of tutee's registered tutors
// @access  Private
router.get("/registeredTutors/:user_id", async ({ params: { user_id } }, res) => {
  try {
    const tutee = await Tutee.findOne({ user: user_id })
    .populate({
      path: 'tutors',
      model: 'tutors' // Assuming the tutor documents are stored in the "users" collection
    })
    .exec();
    
    console.log(tutee, "these are the registered tutors");

    if (!tutee) {
      return res.status(400).json({ msg: "Profile not found" });
    }

    const tutorUsers = await Promise.all(
      tutee.tutors.map(async (tutor_user_id) => {
        const populatedTutor = await Tutor.findOne({ user: tutor_user_id }).populate('user');
        return populatedTutor;
      })
    );

    console.log(tutorUsers, "these should be the registerd tutors documents");

    return res.json(tutorUsers);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
