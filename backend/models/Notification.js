const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    detail: { type: String, default: "" },
    type: { type: String, default: "info" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
