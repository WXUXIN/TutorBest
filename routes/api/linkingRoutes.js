const express = require('express');
const router = express.Router();
const Tutor = require('../../models/TutorInfo');
const Tutee = require('../../models/TuteeInfo');
const mongoose = require('mongoose');


// Get linking requests for a tutor
router.get("/:tutorId/requests", async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.tutorId);
    if (!tutor) {
      return res.status(404).json({ msg: "Tutor not found" });
    }
    res.json(tutor.linkingRequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// Send a linking request from a tutee to a tutor
router.post("/:tutorId/request/:tuteeId", async (req, res) => {
  try {
    console.log(req.params)
    const tutor = await Tutor.findOne({ user: req.params.tutorId });
    console.log(tutor)
    if (!tutor) {
      return res.status(404).json({ msg: "Tutor not found" });
    }
    const tuteeId = req.params.tuteeId;
    // Check if the linking request already exists
    const existingRequest = tutor.linkingRequests.find(
      (request) => request.tutee.user._id === tuteeId
    );
    if (existingRequest) {
      return res.status(400).json({ msg: "Linking request already sent" });
    }
    // add to tutee object array of linking requests
    tutor.linkingRequests.push(new mongoose.Types.ObjectId(tuteeId));
    await tutor.save();
    res.json(tutor.linkingRequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// Accept a linking request 
router.post("/:tutorId/request/:tuteeId/accept", async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.tutorId);
    if (!tutor) {
      return res.status(404).json({ msg: "Tutor not found" });
    }
    // find Linking Request
    const linkingRequestIndex = tutor.linkingRequests.findIndex(
        (request) => request.tutee.user._id === req.params.tuteeId
      );
      if (linkingRequestIndex === -1) {
        return res.status(404).json({ msg: "Linking request not found" });
      }  
    const linkingRequest = tutor.linkingRequests[linkingRequestIndex];
    // add the tutor to the tutee's tutor array
    const tutee = await Tutee.findOne({ user: req.params.tuteeId });
    if (!tutee) {
      return res.status(404).json({ msg: "Tutee not found" });
    }
    tutee.tutors.push(new mongoose.Types.ObjectId(tutor._id));
    await tutee.save();
    // Remove the linking request from the tutor's linkingRequests array
    tutor.linkingRequests.splice(linkingRequestIndex, 1);
    await tutor.save();
    res.json(linkingRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// Reject a linking request
router.post("/:tutorId/request/:tuteeId/reject", async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.tutorId);
    if (!tutor) {
      return res.status(404).json({ msg: "Tutor not found" });
    }
    // find Linking Request
    const linkingRequestIndex = tutor.linkingRequests.findIndex(
        (request) => request.tutee.user._id === req.params.tuteeId
    );
    if (linkingRequestIndex === -1) {
        return res.status(404).json({ msg: "Linking request not found" });
    }
    const linkingRequest = tutor.linkingRequests[linkingRequestIndex];
    // Remove the linking request from the tutor's linkingRequests array
    tutor.linkingRequests.splice(linkingRequestIndex, 1);
    await tutor.save();
    res.json(linkingRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;