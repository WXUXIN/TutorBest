const mongoose = require("mongoose");

const TutorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    unique: true,
    required: true,
  },
  subjects: [
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
      default: []
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
      default: []
    },
  ],
  highestQualification: {
    type: "String",
    required: true,
    default: ""
  },

  // Each tutor can have multiple tutees, so we store them in an array
  tutees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  description: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("tutors", TutorSchema);
