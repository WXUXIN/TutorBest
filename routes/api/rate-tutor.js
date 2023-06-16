const Tutor = require('../../models/TutorInfo');
const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {

    const { tutorId, rating, tuteeId } = req.body;

    try {
        // Find the tutor by ID
        const tutor = await Tutor.findOne({ user: tutorId })

        if (!tutor) {
            return res.status(404).json({ message: 'Tutor not found' });
        }

        // create newrating object to add to array
        const newRating = {
            rating: rating,
            tutee: tuteeId,
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