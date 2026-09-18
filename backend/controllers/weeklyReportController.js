const path = require('path');
const fs = require('fs');
const WeeklyReport = require('../models/WeeklyReport');
const Notification = require('../models/Notification');

const uploadDir = path.join(__dirname, '..', 'uploads', 'weekly-reports');

function filesToAttachments(files = []) {
  return files.map((f) => ({
    filename: f.filename,
    originalName: f.originalname,
    mimetype: f.mimetype,
    size: f.size,
    url: `/uploads/weekly-reports/${f.filename}`,
  }));
}

function deleteAttachmentFiles(attachments = []) {
  attachments.forEach((a) => {
    fs.unlink(path.join(uploadDir, a.filename), () => {});
  });
}

exports.getByStudent = async (req, res) => {
  try { res.json(await WeeklyReport.find({ studentId: req.params.studentId }).sort({ weekNumber: -1 })); }
  catch (error) { res.status(500).json({ message: 'ไม่สามารถดึงรายงานได้', error: error.message }); }
};

exports.getAll = async (req, res) => {
  try { res.json(await WeeklyReport.find().sort({ createdAt: -1 })); }
  catch (error) { res.status(500).json({ message: 'ไม่สามารถดึงรายงานทั้งหมดได้', error: error.message }); }
};

exports.getById = async (req, res) => {
  try {
    const report = await WeeklyReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'ไม่พบรายงาน' });
    res.json(report);
  } catch (error) { res.status(400).json({ message: 'ไม่สามารถดึงรายงานได้', error: error.message }); }
};

exports.create = async (req, res) => {
  try {
    const { weekNumber, startDate, endDate, workTitle, workDescription, problems, solution } = req.body;
    if (!weekNumber || !startDate || !endDate || !workTitle || !workDescription) {
      deleteAttachmentFiles(filesToAttachments(req.files));
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลรายงานให้ครบ' });
    }

    const attachments = filesToAttachments(req.files);

    const report = await WeeklyReport.create({
      studentId: req.user.username,
      weekNumber,
      startDate,
      endDate,
      workTitle,
      workDescription,
      problems: problems || '',
      solution: solution || '',
      status: 'ส่งแล้ว',
      attachments,
    });

    await Notification.create({ studentId: 'ADVISOR', title: 'มีรายงานประจำสัปดาห์ใหม่', detail: `นักศึกษา ${req.user.username} ส่งรายงานสัปดาห์ที่ ${weekNumber} เพื่อรอตรวจ`, type: 'info' });
    res.status(201).json({ message: 'ส่งรายงานประจำสัปดาห์ให้อาจารย์แล้ว', data: report });
  } catch (error) {
    deleteAttachmentFiles(filesToAttachments(req.files));
    res.status(400).json({ message: 'ส่งรายงานไม่สำเร็จ', error: error.message });
  }
};

exports.approve = async (req, res) => {
  try {
    const report = await WeeklyReport.findByIdAndUpdate(req.params.id, { status: 'อาจารย์ตรวจแล้ว', advisorComment: req.body.advisorComment || '' }, { new: true });
    if (!report) return res.status(404).json({ message: 'ไม่พบรายงาน' });
    await Notification.create({ studentId: report.studentId, title: 'อาจารย์ตรวจรายงานประจำสัปดาห์แล้ว', detail: `รายงานสัปดาห์ที่ ${report.weekNumber} ได้รับการอนุมัติแล้ว`, type: 'success' });
    res.json({ message: 'อนุมัติรายงานสำเร็จ', data: report });
  } catch (error) { res.status(400).json({ message: 'อนุมัติรายงานไม่สำเร็จ', error: error.message }); }
};

exports.reject = async (req, res) => {
  try {
    const comment = req.body.advisorComment || 'กรุณาตรวจสอบและแก้ไขรายงาน';
    const report = await WeeklyReport.findByIdAndUpdate(req.params.id, { status: 'ต้องแก้ไข', advisorComment: comment }, { new: true });
    if (!report) return res.status(404).json({ message: 'ไม่พบรายงาน' });
    await Notification.create({ studentId: report.studentId, title: 'อาจารย์ส่งรายงานกลับมาแก้ไข', detail: comment, type: 'warning' });
    res.json({ message: 'ส่งรายงานกลับไปแก้ไขแล้ว', data: report });
  } catch (error) { res.status(400).json({ message: 'ไม่สามารถส่งกลับไปแก้ไขได้', error: error.message }); }
};

exports.update = async (req, res) => {
  try {
    const report = await WeeklyReport.findOne({ _id: req.params.id, studentId: req.user.username });
    if (!report) {
      deleteAttachmentFiles(filesToAttachments(req.files));
      return res.status(404).json({ message: 'ไม่พบรายงาน' });
    }

    const allowed = (({ weekNumber, startDate, endDate, workTitle, workDescription, problems, solution }) => ({ weekNumber, startDate, endDate, workTitle, workDescription, problems, solution }))(req.body);

    let attachments = report.attachments || [];

    if (req.body.removeAttachments) {
      let removeList = [];
      try { removeList = JSON.parse(req.body.removeAttachments); } catch { removeList = []; }

      if (Array.isArray(removeList) && removeList.length) {
        const toRemove = attachments.filter((a) => removeList.includes(a.filename));
        attachments = attachments.filter((a) => !removeList.includes(a.filename));
        deleteAttachmentFiles(toRemove);
      }
    }

    attachments = [...attachments, ...filesToAttachments(req.files)];

    const updated = await WeeklyReport.findByIdAndUpdate(
      req.params.id,
      { $set: { ...allowed, attachments, status: 'ส่งแล้ว' } },
      { new: true, runValidators: true }
    );

    res.json({ message: 'แก้ไขและส่งรายงานให้อาจารย์แล้ว', data: updated });
  } catch (error) {
    deleteAttachmentFiles(filesToAttachments(req.files));
    res.status(400).json({ message: 'แก้ไขรายงานไม่สำเร็จ', error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const report = await WeeklyReport.findOneAndDelete({ _id: req.params.id, studentId: req.user.username });
    if (!report) return res.status(404).json({ message: 'ไม่พบรายงาน' });
    deleteAttachmentFiles(report.attachments);
    res.json({ message: 'ลบรายงานสำเร็จ' });
  } catch (error) { res.status(400).json({ message: 'ลบรายงานไม่สำเร็จ', error: error.message }); }
};