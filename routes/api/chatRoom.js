const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Tutor = require("../../models/TutorInfo");
const Tutee = require("../../models/TuteeInfo");
const User = require("../../models/User");
const Chat = require("../../models/Chat");
const { check, validationResult } = require("express-validator");

router.get("/", auth, async (req, res) => {
  try {
    const chatID = req.query.ChatID;

    // Check if there exists a chat with the given chat ID
    const chat = await Chat.findById(chatID).populate("user1 user2")

    if (chat) {
      // If chat exists, return the chat object
      return res.json(chat);
    } else {
      // If chat doesn't exist, return an error message
      return res.status(404).json({ msg: "Chat not found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { userID, profileID } = req.body;

    // Check if there exists a chat between the tutor and tutee
    const chat = await Chat.findOne({
      $or: [
        { user1: userID, user2: profileID },
        { user1: profileID, user2: userID },
      ],
    });

    if (chat) {
      // If chat exists, redirect to the chat page with chat room ID
      return res.json(chat._id);
    } else {
      // If chat doesn't exist, create a new chat between tutor and tutee
      const newChat = new Chat({
        user1: userID,
        user2: profileID,
        messages: [],
      });

      await newChat.save();

      // Redirect to the chat page with the newly created chat room ID
      return res.json(newChat._id);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
