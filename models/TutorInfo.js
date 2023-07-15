const mongoose = require("mongoose");

const TutorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    unique: true,
    required: true,
  },
  subjectList: [
    {
      subject: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      level: {
        type: String,
        required: true,
      },
    },
  ],

  // Each tutor can have multiple ratings, so we store them in an array
  ratings: [
    {
      rating: {
        type: Number,
      },
      tutee: {
        type: String,
      },
    },
  ],

  highestQualification: {
    type: "String",
    required: true,
  },

  // Each tutor can have multiple tutees, so we store them in an array
  // First element in the array is the tutor himself/herself
  tutees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  description: {
    type: String,
  },

  linkingRequests: [
    {
      tutee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      tuteeName: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("tutors", TutorSchema);
