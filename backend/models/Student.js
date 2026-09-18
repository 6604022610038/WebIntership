const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: { type: String, default: "" },
    address: { type: String, default: "" },

    major: {
      type: String,
      default: "Computer Mathematics",
    },

    company: {
      type: String,
      default: "",
    },

    position: {
      type: String,
      default: "",
    },

    internshipStart: {
      type: Date,
    },

    internshipEnd: {
      type: Date,
    },

    status: {
      type: String,
      default: "กำลังฝึกงาน",
    },

    progress: { type: Number, min: 0, max: 100, default: 0 },
    totalWeeks: { type: Number, default: 16 },
    currentWeek: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);