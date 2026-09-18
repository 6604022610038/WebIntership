const mongoose = require("mongoose");

const dailyReportSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, index: true },
    reportDate: { type: Date, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    problems: { type: String, default: "" },
    solution: { type: String, default: "" },
    status: {
      type: String,
      enum: ["ร่าง", "รอตรวจ", "อนุมัติแล้ว", "ต้องแก้ไข"],
      default: "รอตรวจ",
    },
    advisorComment: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DailyReport", dailyReportSchema);
