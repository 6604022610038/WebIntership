const DailyReport = require('../models/DailyReport');
const Notification = require('../models/Notification');

exports.getByStudent = async (req, res) => {
  try {
    const reports = await DailyReport.find({ studentId: req.params.studentId }).sort({ reportDate: -1, createdAt: -1 });
    res.json(reports);
  } catch (error) { res.status(500).json({ message: 'ไม่สามารถดึงรายงานประจำวันได้', error: error.message }); }
};

exports.getAll = async (req, res) => {
  try { res.json(await DailyReport.find().sort({ reportDate: -1, createdAt: -1 })); }
  catch (error) { res.status(500).json({ message: 'ไม่สามารถดึงรายงานทั้งหมดได้', error: error.message }); }
};

exports.create = async (req, res) => {
  try {
    const data = { ...req.body, studentId: req.user.username };
    const report = await DailyReport.create(data);
    await Notification.create({ studentId: 'ADVISOR', title: 'มีรายงานประจำวันใหม่', detail: `นักศึกษา ${req.user.username} ส่งรายงานหัวข้อ ${report.title}`, type: 'info' });
    res.status(201).json({ message: 'บันทึกรายงานประจำวันสำเร็จ', data: report });
  } catch (error) { res.status(400).json({ message: 'บันทึกรายงานไม่สำเร็จ', error: error.message }); }
};

exports.update = async (req, res) => {
  try {
    const report = await DailyReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'ไม่พบรายงาน' });
    if (req.user.role === 'student' && report.studentId !== req.user.username) return res.status(403).json({ message: 'ไม่มีสิทธิ์แก้ไขรายงานนี้' });
    const allowed = (({ reportDate, title, description, problems, solution }) => ({ reportDate, title, description, problems, solution }))(req.body);
    const updated = await DailyReport.findByIdAndUpdate(req.params.id, { $set: { ...allowed, status: req.user.role === 'student' ? 'รอตรวจ' : report.status } }, { new: true, runValidators: true });
    res.json({ message: 'แก้ไขรายงานสำเร็จ', data: updated });
  } catch (error) { res.status(400).json({ message: 'แก้ไขรายงานไม่สำเร็จ', error: error.message }); }
};

exports.review = async (req, res) => {
  try {
    const { status, advisorComment = '' } = req.body;
    if (!['อนุมัติแล้ว', 'ต้องแก้ไข'].includes(status)) return res.status(400).json({ message: 'สถานะไม่ถูกต้อง' });
    const report = await DailyReport.findByIdAndUpdate(req.params.id, { status, advisorComment }, { new: true, runValidators: true });
    if (!report) return res.status(404).json({ message: 'ไม่พบรายงาน' });
    await Notification.create({ studentId: report.studentId, title: status === 'อนุมัติแล้ว' ? 'อาจารย์ตรวจรายงานประจำวันแล้ว' : 'อาจารย์ส่งรายงานกลับมาแก้ไข', detail: advisorComment || `รายงานวันที่ ${new Date(report.reportDate).toLocaleDateString('th-TH')}`, type: status === 'อนุมัติแล้ว' ? 'success' : 'warning' });
    res.json({ message: 'อัปเดตผลตรวจรายงานแล้ว', data: report });
  } catch (error) { res.status(400).json({ message: 'ตรวจรายงานไม่สำเร็จ', error: error.message }); }
};

exports.remove = async (req, res) => {
  try {
    const report = await DailyReport.findOneAndDelete({ _id: req.params.id, studentId: req.user.username });
    if (!report) return res.status(404).json({ message: 'ไม่พบรายงาน' });
    res.json({ message: 'ลบรายงานสำเร็จ' });
  } catch (error) { res.status(400).json({ message: 'ลบรายงานไม่สำเร็จ', error: error.message }); }
};
