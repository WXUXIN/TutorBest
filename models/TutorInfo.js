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
  tutees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      unique: true,
      default: []
    },
  ],
  description: {
    type: String,
    default: ""
  },
});

TutorSchema.pre("save", function (next) {
  this.tutees = this.tutees.filter((tutee) => tutee !== undefined);
  next();
});

module.exports = mongoose.model("tutors", TutorSchema);
