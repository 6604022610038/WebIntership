const Activity = require('../models/Activity');

// อาจารย์ไม่มี studentId ของตัวเอง จึงใช้ค่าคงที่ "ADVISOR" แทน
// (รูปแบบเดียวกับที่ใช้เก็บการแจ้งเตือนของอาจารย์)
function ownerStudentId(user) {
  return user.role === 'advisor' ? 'ADVISOR' : user.username;
}

exports.getByStudent = async (req, res) => {
  try { res.json(await Activity.find({ studentId: req.params.studentId }).sort({ activityDate: 1, time: 1 })); }
  catch (error) { res.status(500).json({ message: 'ไม่สามารถดึงกิจกรรมได้', error: error.message }); }
};

exports.create = async (req, res) => {
  try {
    const data = await Activity.create({ ...req.body, studentId: ownerStudentId(req.user) });
    res.status(201).json({ message: 'เพิ่มกิจกรรมสำเร็จ', data });
  } catch (error) { res.status(400).json({ message: 'เพิ่มกิจกรรมไม่สำเร็จ', error: error.message }); }
};

exports.update = async (req, res) => {
  try {
    const data = await Activity.findOneAndUpdate({ _id: req.params.id, studentId: ownerStudentId(req.user) }, { $set: req.body }, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ message: 'ไม่พบกิจกรรม' });
    res.json({ message: 'แก้ไขกิจกรรมสำเร็จ', data });
  } catch (error) { res.status(400).json({ message: 'แก้ไขกิจกรรมไม่สำเร็จ', error: error.message }); }
};

exports.remove = async (req, res) => {
  try {
    const data = await Activity.findOneAndDelete({ _id: req.params.id, studentId: ownerStudentId(req.user) });
    if (!data) return res.status(404).json({ message: 'ไม่พบกิจกรรม' });
    res.json({ message: 'ลบกิจกรรมสำเร็จ' });
  } catch (error) { res.status(400).json({ message: 'ลบกิจกรรมไม่สำเร็จ', error: error.message }); }
};