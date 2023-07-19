const Tutor = require('../../models/TutorInfo');
const Tutee = require('../../models/TuteeInfo');
const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {

    const { tutorId, rating, comments, tuteeId } = req.body;

    try {
        // Find the tutor by ID
        const tutor = await Tutor.findOne({ user: tutorId })
        if (!tutor) {
            return res.status(404).json({ message: 'Tutor not found' });
        }

        // Find tutee by ID
        const tutee = await Tutee.findOne({ user: tuteeId }).populate("user");
        if (!tutee) {
            return res.status(404).json({ message: 'Tutee not found' });
        }

        // create newrating object that contains tutee id and name to add to array
        const newRating = {
            rating: rating,
            comments: comments,
            tutee: {tuteeId: tutee.user._id, name: tutee.user.name, photo: tutee.user.photo}
        };

        // Update the tutor's ratings array by appending the new rating
        tutor.ratings.push(newRating);

        console.log("Tutor rated");

        await tutor.save();

        res.status(200).json({ message: 'Rating saved successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;