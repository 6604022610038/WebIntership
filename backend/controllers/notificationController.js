const Notification = require('../models/Notification');

exports.getByStudent = async (req, res) => {
  try {
    if (req.user.role === 'student' && req.user.username !== req.params.studentId) return res.status(403).json({ message: 'ไม่มีสิทธิ์ดูการแจ้งเตือนนี้' });
    res.json(await Notification.find({ studentId: req.params.studentId }).sort({ createdAt: -1 }));
  } catch (error) { res.status(500).json({ message: 'ไม่สามารถดึงการแจ้งเตือนได้', error: error.message }); }
};

exports.markRead = async (req, res) => {
  try {
    const filter = req.user.role === 'advisor' ? { _id: req.params.id, studentId: 'ADVISOR' } : { _id: req.params.id, studentId: req.user.username };
    const item = await Notification.findOneAndUpdate(filter, { isRead: true }, { new: true });
    if (!item) return res.status(404).json({ message: 'ไม่พบการแจ้งเตือน' });
    res.json({ message: 'อ่านการแจ้งเตือนแล้ว', data: item });
  } catch (error) { res.status(400).json({ message: 'อัปเดตการแจ้งเตือนไม่สำเร็จ', error: error.message }); }
};

exports.markAllReadForStudent = async (req, res) => {
  try {
    if (req.user.role === 'student' && req.user.username !== req.params.studentId) return res.status(403).json({ message: 'ไม่มีสิทธิ์ดำเนินการนี้' });
    await Notification.updateMany({ studentId: req.params.studentId }, { isRead: true });
    res.json({ message: 'อ่านการแจ้งเตือนทั้งหมดแล้ว' });
  } catch (error) { res.status(400).json({ message: 'อัปเดตการแจ้งเตือนไม่สำเร็จ', error: error.message }); }
};

exports.markAllReadForAdvisor = async (req, res) => {
  try {
    if (req.user.role !== 'advisor') return res.status(403).json({ message: 'ไม่มีสิทธิ์ดำเนินการนี้' });
    await Notification.updateMany({ studentId: 'ADVISOR' }, { isRead: true });
    res.json({ message: 'อ่านการแจ้งเตือนทั้งหมดแล้ว' });
  } catch (error) { res.status(400).json({ message: 'อัปเดตการแจ้งเตือนไม่สำเร็จ', error: error.message }); }
};
