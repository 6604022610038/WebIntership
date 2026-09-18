const Student = require('../models/Student');
const WeeklyReport = require('../models/WeeklyReport');
const DailyReport = require('../models/DailyReport');
const Activity = require('../models/Activity');
const Evaluation = require('../models/Evaluation');
const Notification = require('../models/Notification');
const Message = require('../models/Message');

exports.getStudentDashboard = async (req, res) => {
  try {
    const [student, weeklyReports, dailyReports, activities, evaluations, notifications, unreadMessages] = await Promise.all([
      Student.findOne({ studentId: req.params.studentId }).lean(),
      WeeklyReport.find({ studentId: req.params.studentId }).sort({ weekNumber: -1 }).lean(),
      DailyReport.find({ studentId: req.params.studentId }).sort({ reportDate: -1, createdAt: -1 }).lean(),
      Activity.find({ studentId: req.params.studentId }).sort({ activityDate: 1, time: 1 }).lean(),
      Evaluation.find({ studentId: req.params.studentId }).sort({ createdAt: -1 }).lean(),
      Notification.find({ studentId: req.params.studentId }).sort({ createdAt: -1 }).limit(20).lean(),
      Message.countDocuments({ studentId: req.params.studentId, sender: 'advisor', readByStudent: false }),
    ]);
    if (!student) return res.status(404).json({ message: 'ไม่พบข้อมูลนักศึกษา' });
    res.json({ student, weeklyReports, dailyReports, activities, evaluations, notifications, unreadMessages });
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถโหลด Dashboard ได้', error: error.message });
  }
};

exports.getAdvisorDashboard = async (req, res) => {
  try {
    const [students, weeklyReports, dailyReports, evaluations, notifications, activities, unreadMessages] = await Promise.all([
      Student.find().sort({ createdAt: -1 }).lean(),
      WeeklyReport.find().sort({ createdAt: -1 }).lean(),
      DailyReport.find().sort({ createdAt: -1 }).lean(),
      Evaluation.find().sort({ createdAt: -1 }).lean(),
      Notification.find({ studentId: 'ADVISOR' }).sort({ createdAt: -1 }).limit(30).lean(),
      Activity.find().sort({ activityDate: 1, time: 1 }).lean(),
      Message.countDocuments({ sender: 'student', readByAdvisor: false }),
    ]);
    res.json({ students, weeklyReports, dailyReports, evaluations, notifications, activities, unreadMessages });
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถโหลด Dashboard อาจารย์ได้', error: error.message });
  }
};