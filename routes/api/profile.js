const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Tutor = require("../../models/TutorInfo");
const Tutee = require("../../models/TuteeInfo");
const User = require("../../models/User");
const Chat = require("../../models/Chat");
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
// @desc    Get tutor's information by TUTOR id
// @access  Private
router.get("/user/:tutor_id", async ({ params: { tutor_id } }, res) => {
  try {
    const profile = await Tutor.findOne({
      _id: tutor_id,
    }).populate("user");

    if (!profile) return res.status(400).json({ msg: "Profile not found" });

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server error" });
  }
});

// @route   GET api/profile/tutorInfoByUserId/:user_id
// @desc    Get tutor's information by USER id
// @access  Private
router.get("/tutorInfoByUserId/:user_id", async ({ params: { user_id } }, res) => {
  try {
    const profile = await Tutor.findOne({
      user: user_id,
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

    // 1 Find the tutee by user id
    const tutee = await Tutee.findOne({ user: user_id })
    .populate({
      path: 'tutors',
      model: 'tutors' // Assuming the tutor documents are stored in the "users" collection
    })
    .exec();
    
    if (!tutee) {
      return res.status(400).json({ msg: "Profile not found" });
    }

    // 2 Find the tutor documents by user ID of tutors
    const tutorUsers = await Promise.all(
      tutee.tutors.map(async (tutor_user_id) => {
        const populatedTutor = await Tutor.findOne({ user: tutor_user_id }).populate('user');
        return populatedTutor;
      })
    );

    return res.json(tutorUsers);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server error" });
  }
});

// @route   GET api/profile/currentChatTutors
// @desc    Get all of tutee's current chat with tutors
// @access  Private

router.get("/currentChatTutors/:user_id", async ({ params: { user_id } }, res) => {
  try {
    // 1 Find all chat room that the user is in
    const chatRooms = await Chat.find({
      $or: [
        { user1: user_id },
        { user2: user_id },
      ],
    });

    // 2 Get list of all user_id of tutors who are in the same chat room as tutee
    const tutorUserIds = chatRooms.map((chatRoom) => {
      if (chatRoom.user1 === user_id) {
        return chatRoom.user1
      } else {
        return chatRoom.user2;
      }
    });

    // 3 Map the user_id to tutor documents
    const tutorUsers = await Promise.all(
      tutorUserIds.map(async (tutor_user_id) => {
        const populatedTutor = await Tutor.findOne({ user: tutor_user_id }).populate('user');
        return populatedTutor;
      })
    );

    return res.json(tutorUsers);

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
