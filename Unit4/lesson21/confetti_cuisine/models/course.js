const mongoose = require("mongoose");
const { Schema } = mongoose; // require("mongoose") returns an object, this extracts the Schema property and assigns it to a variable name schema. Schema = mongoose.Schema is the simpler alternative

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    maxStudents: {
      type: Number,
      default: 0,
      min: [0, "Course cannot have a negative number of students"],
    },
    cost: {
      type: Number,
      default: 0,
      min: [0, "Course cannot have a negative cost"],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Course", courseSchema);
