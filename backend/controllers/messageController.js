const Message = require('../models/Message');
const Student = require('../models/Student');

// ดึงบทสนทนาของนักศึกษาคนหนึ่ง (นักศึกษาดูของตัวเอง / อาจารย์ดูของนักศึกษาคนไหนก็ได้)
exports.getThread = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (req.user.role === 'student' && req.user.username !== studentId) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์ดูข้อความนี้' });
    }

    const messages = await Message.find({ studentId }).sort({ createdAt: 1 });

    // มาร์คว่าอ่านแล้วฝั่งที่กำลังเปิดดูอยู่
    if (req.user.role === 'student') {
      await Message.updateMany(
        { studentId, sender: 'advisor', readByStudent: false },
        { $set: { readByStudent: true } }
      );
    } else {
      await Message.updateMany(
        { studentId, sender: 'student', readByAdvisor: false },
        { $set: { readByAdvisor: true } }
      );
    }

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถดึงข้อความได้', error: error.message });
  }
};

// ส่งข้อความ
exports.send = async (req, res) => {
  try {
    const text = String(req.body.text || '').trim();
    if (!text) return res.status(400).json({ message: 'กรุณาพิมพ์ข้อความ' });

    const studentId = req.user.role === 'student'
      ? req.user.username
      : String(req.body.studentId || '').trim();

    if (!studentId) {
      return res.status(400).json({ message: 'ไม่พบนักศึกษาปลายทาง' });
    }

    if (req.user.role === 'advisor') {
      const exists = await Student.exists({ studentId });
      if (!exists) return res.status(404).json({ message: 'ไม่พบนักศึกษานี้ในระบบ' });
    }

    const data = await Message.create({
      studentId,
      sender: req.user.role,
      senderName: req.user.name || req.user.username,
      text,
      readByStudent: req.user.role === 'student',
      readByAdvisor: req.user.role === 'advisor',
    });

    res.status(201).json({ message: 'ส่งข้อความสำเร็จ', data });
  } catch (error) {
    res.status(400).json({ message: 'ส่งข้อความไม่สำเร็จ', error: error.message });
  }
};

// รายชื่อบทสนทนาทั้งหมด (สำหรับอาจารย์) พร้อมข้อความล่าสุดและจำนวนที่ยังไม่อ่าน
exports.getConversations = async (req, res) => {
  try {
    const students = await Student.find().select('studentId name company position').sort({ name: 1 }).lean();

    const [lastMessages, unreadCounts] = await Promise.all([
      Message.aggregate([
        { $sort: { createdAt: -1 } },
        { $group: { _id: '$studentId', text: { $first: '$text' }, sender: { $first: '$sender' }, createdAt: { $first: '$createdAt' } } },
      ]),
      Message.aggregate([
        { $match: { sender: 'student', readByAdvisor: false } },
        { $group: { _id: '$studentId', count: { $sum: 1 } } },
      ]),
    ]);

    const lastMap = new Map(lastMessages.map((m) => [m._id, m]));
    const unreadMap = new Map(unreadCounts.map((u) => [u._id, u.count]));

    const conversations = students.map((s) => {
      const last = lastMap.get(s.studentId);

      return {
        studentId: s.studentId,
        name: s.name,
        company: s.company || '',
        position: s.position || '',
        lastMessage: last?.text || '',
        lastSender: last?.sender || '',
        lastMessageAt: last?.createdAt || null,
        unreadCount: unreadMap.get(s.studentId) || 0,
      };
    });

    conversations.sort((a, b) => {
      if (a.unreadCount !== b.unreadCount) return b.unreadCount - a.unreadCount;

      const at = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const bt = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return bt - at;
    });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถดึงรายการสนทนาได้', error: error.message });
  }
};

// จำนวนข้อความที่ยังไม่อ่านทั้งหมด (ใช้แสดง badge)
exports.getUnreadCount = async (req, res) => {
  try {
    if (req.user.role === 'student') {
      const count = await Message.countDocuments({
        studentId: req.user.username,
        sender: 'advisor',
        readByStudent: false,
      });
      return res.json({ count });
    }

    const count = await Message.countDocuments({ sender: 'student', readByAdvisor: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถดึงจำนวนข้อความได้', error: error.message });
  }
};