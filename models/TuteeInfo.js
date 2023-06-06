const mongoose = require("mongoose");

const TuteeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
  },
  tutors: [
    {
      tutor: {
        type: String,
      },
    },
  ],
  reviews: [
    {
      review: {
        type: String,
      },
      tutor: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("Tutor", TutorSchema);
