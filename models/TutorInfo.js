const mongoose = require("mongoose");

const TutorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
    },
  ],
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
  },
  tutees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
  ],
  description: {
    type: String,
  },
});

module.exports = mongoose.model("Tutor", TutorSchema);
