const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');
const weeklyReportRoutes = require('./routes/weeklyReportRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const dailyReportRoutes = require('./routes/dailyReportRoutes');
const activityRoutes = require('./routes/activityRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const messageRoutes = require('./routes/messageRoutes');
const formRoutes = require('./routes/formRoutes');

const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '5mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => res.json({ message: 'Internship Tracking API is running!' }));
app.get('/api/health', (req, res) => res.json({ ok: true, service: 'internship-tracking-api' }));

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/daily-reports', dailyReportRoutes);
app.use('/api/weekly-reports', weeklyReportRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/forms', formRoutes);

app.use((req, res) => res.status(404).json({ message: 'ไม่พบ API endpoint นี้' }));
app.use((err, req, res, next) => {
  if (err && err.name === 'MulterError') {
    const message = err.code === 'LIMIT_FILE_SIZE'
      ? 'ไฟล์แนบมีขนาดใหญ่เกินไป (สูงสุด 10MB ต่อไฟล์)'
      : err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE'
      ? 'แนบไฟล์ได้สูงสุด 5 ไฟล์ต่อรายงาน'
      : 'อัปโหลดไฟล์แนบไม่สำเร็จ';
    return res.status(400).json({ message });
  }

  if (err && /รองรับเฉพาะไฟล์/.test(err.message || '')) {
    return res.status(400).json({ message: err.message });
  }

  console.error(err);
  res.status(500).json({ message: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
});

const PORT = Number(process.env.PORT || 5000);

connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://localhost:${PORT}`));
});