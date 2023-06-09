const mongoose = require("mongoose");

const TuteeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    unique: true,
    required: true,
  },
  tutors: [
    {
      tutor: {
        type: String,
      },
      default: []
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
      default: []
    },
  ],
});

module.exports = mongoose.model("tutees", TuteeSchema);
