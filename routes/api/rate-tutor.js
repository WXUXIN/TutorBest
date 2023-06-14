const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { tutorId, rating } = req.body;

    try {
        // Find the tutor by ID
        const tutor = await Tutor.findById(tutorId);

        if (!tutor) {
            return res.status(404).json({ message: 'Tutor not found' });
        }

        // Update the tutor's rating
        tutor.rating = tutor.rating.push(rating);

        console.log("Tutor rated");

        await tutor.save();

        res.status(200).json({ message: 'Rating saved successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;