const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');
const Student = require('./models/Student');
const Activity = require('./models/Activity');
const Notification = require('./models/Notification');
const DailyReport = require('./models/DailyReport');
const Evaluation = require('./models/Evaluation');
const WeeklyReport = require('./models/WeeklyReport');

async function upsertUser(username, password, name, role) {
  const hash = await bcrypt.hash(password, 10);
  return User.findOneAndUpdate({ username }, { $set: { username, password: hash, name, role } }, { upsert: true, new: true, setDefaultsOnInsert: true });
}

async function upsertStudent(data) {
  return Student.findOneAndUpdate({ studentId: data.studentId }, { $set: data }, { upsert: true, new: true, setDefaultsOnInsert: true });
}

async function seed() {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri) throw new Error('Missing MONGO_URI in .env');
    await mongoose.connect(uri);

    await upsertUser('640123456', '123456', 'ธนภัทร สมใจ', 'student');
    await upsertUser('teacher001', '123456', 'ผศ. ดร.กฤตดุล เหมือนทอง', 'advisor');

    const mainStudent = await upsertStudent({
      studentId: '640123456', name: 'ธนภัทร สมใจ', email: 'thanapat@example.com', major: 'คณะวิทยาการคอมพิวเตอร์',
      company: 'บริษัท เทคโนโลยี จำกัด', position: 'Data Analyst', internshipStart: new Date('2026-05-02'), internshipEnd: new Date('2026-09-30'),
      status: 'กำลังฝึกงาน', progress: 50, totalWeeks: 10, currentWeek: 5,
    });

    const demoStudents = [
      ['640123457','นางสาวณัฐธิดา ใจดี','บริษัท เทคโนโลยี จำกัด','Frontend Developer',80],
      ['640123458','นายธนภัทร สมใจ','บริษัท คอมพิวเตอร์ จำกัด','Data Analyst',65],
      ['640123459','นางสาวกมลพร ใจดี','โรงพยาบาลนครราชสีมา','ผู้ช่วยพยาบาล',40],
      ['640123460','นายกฤษณะ พรมมา','บริษัท สยามเทคโนโลยี จำกัด','Software Developer',70],
      ['640123461','นางสาวกนกวรรณ ศรีสุข','บริษัท ไอทีโซลูชั่น จำกัด','QA Tester',90],
    ];
    const moreNames = ['พีรพล','กิตติพงษ์','ชลธิชา','พิมพ์ชนก','ณัฐวุฒิ','ศุภกร','วรัญญา','ธนกฤต','ปาริชาติ','อธิวัฒน์','สุภัสสรา','ภาณุพงศ์','กัญญาณัฐ','ณัฐดนัย','ชนาธิป','วริศรา','ธีรภัทร์','นภัสสร','ภูวดล','กมลชนก','สิรภพ','อรปรียา'];
    const jobs = ['Web Developer','Mobile Developer','Data Analyst','Software Developer','UX/UI Designer','QA Tester','System Analyst'];
    for (let i=0;i<moreNames.length;i++) {
      const id=String(640123462+i);
      demoStudents.push([id,`${i%2===0?'นาย':'นางสาว'}${moreNames[i]} ตัวอย่าง`,'บริษัท เทคโนโลยี จำกัด',jobs[i%jobs.length],[35,45,55,60,65,70,75,80,85,90][i%10]]);
    }
    for (const [studentId,name,company,position,progress] of demoStudents) {
      await upsertStudent({ studentId, name, email: `${studentId}@example.com`, major:'คณะวิทยาการคอมพิวเตอร์', company, position, internshipStart:new Date('2026-05-02'), internshipEnd:new Date('2026-09-30'), status:'กำลังฝึกงาน', progress, totalWeeks:10, currentWeek:5 });
    }

    await Activity.deleteMany({ studentId: mainStudent.studentId });
    await Activity.insertMany([
      { studentId: mainStudent.studentId, title: 'ส่งรายงานประจำสัปดาห์ที่ 5', activityDate: new Date('2026-05-20'), time: '09:00 น.', type: 'รายงาน' },
      { studentId: mainStudent.studentId, title: 'นัดพบอาจารย์นิเทศ', activityDate: new Date('2026-05-21'), time: '13:00 น.', type: 'นัดหมาย' },
      { studentId: mainStudent.studentId, title: 'ส่งรายงานความก้าวหน้า', activityDate: new Date('2026-05-23'), time: '16:00 น.', type: 'รายงาน' },
    ]);

    await DailyReport.deleteMany({ studentId: mainStudent.studentId });
    await DailyReport.insertMany([
      { studentId: mainStudent.studentId, reportDate: new Date('2026-05-19'), title: 'พัฒนา API ระบบนักศึกษา', description: 'พัฒนาและทดสอบ API สำหรับดึงข้อมูลนักศึกษา', problems: 'พบปัญหาการเชื่อมต่อฐานข้อมูล', solution: 'ตรวจสอบ URL และ Token', status: 'อนุมัติแล้ว' },
    ]);

    await WeeklyReport.deleteMany({ studentId: mainStudent.studentId });
    const weekly = [];
    for (let week=1; week<=5; week++) {
      const start = new Date(`2026-05-${String(2 + (week-1)*7).padStart(2,'0')}`);
      const end = new Date(start); end.setDate(end.getDate()+6);
      weekly.push({ studentId:mainStudent.studentId, weekNumber:week, startDate:start, endDate:end, workTitle:week===5?'วิเคราะห์ข้อมูลและจัดทำ Dashboard':'เรียนรู้ระบบและปฏิบัติงานประจำสัปดาห์', workDescription:'ศึกษา requirement พัฒนาและทดสอบงานที่ได้รับมอบหมาย พร้อมจัดทำเอกสารประกอบ', problems:week===5?'อยู่ระหว่างตรวจสอบข้อมูลบางส่วน':'-', solution:'ตรวจสอบข้อมูลและปรึกษาพี่เลี้ยงในสถานประกอบการ', status:week<=3?'อาจารย์ตรวจแล้ว':week===4?'ต้องแก้ไข':'ส่งแล้ว' });
    }
    // Demo advisor reports: total 18, 7 waiting for review, 3 checked, 8 waiting/other.
    const advisorReports = [];
    const demoReportStudents = demoStudents.slice(0,13);
    for (let i=0;i<13;i++) {
      const [studentId] = demoReportStudents[i];
      const start = new Date('2026-05-02'); start.setDate(start.getDate()+i*7);
      const end = new Date(start); end.setDate(end.getDate()+6);
      const status = i<5 ? 'ส่งแล้ว' : 'ร่าง';
      advisorReports.push({ studentId, weekNumber: i+1, startDate:start, endDate:end, workTitle:'งานที่ได้รับมอบหมายประจำสัปดาห์', workDescription:'สรุปงานและความก้าวหน้าจากการฝึกงาน', problems:'-', solution:'ปรึกษาพี่เลี้ยงและดำเนินการตามแผน', status });
    }
    await WeeklyReport.insertMany([...weekly, ...advisorReports]);

    await Evaluation.deleteMany({ studentId: mainStudent.studentId });
    await Evaluation.create({ studentId: mainStudent.studentId, advisorId:'teacher001', score:4.5, comment:'นักศึกษามีความตั้งใจในการทำงาน เรียนรู้เร็ว และสามารถทำงานร่วมกับผู้อื่นได้ดี', skills:{ knowledge:80, performance:80, problemSolving:70, teamwork:90, ethics:100 } });

    await Notification.deleteMany({ studentId: mainStudent.studentId });
    await Notification.insertMany([
      { studentId: mainStudent.studentId, title:'อาจารย์ตรวจรายงานประจำวันแล้ว', detail:'รายงานวันที่ 19 พฤษภาคม 2569 ได้รับการอนุมัติ', type:'success' },
      { studentId: mainStudent.studentId, title:'ใกล้ถึงกำหนดส่งรายงาน', detail:'กรุณาส่งรายงานประจำสัปดาห์ที่ 5', type:'warning' },
      { studentId: mainStudent.studentId, title:'มีประกาศใหม่จากอาจารย์', detail:'เรื่อง การส่งรายงานฝึกงาน', type:'info' },
    ]);

    await Notification.deleteMany({ studentId: 'ADVISOR' });
    await Notification.insertMany([
      { studentId:'ADVISOR', title:'มีรายงานใหม่รอตรวจสอบ', detail:'มีรายงานประจำสัปดาห์จากนักศึกษาที่ส่งเข้าระบบ', type:'info' },
      { studentId:'ADVISOR', title:'มีรายงานประจำวันใหม่', detail:'มีรายงานประจำวันของนักศึกษาที่อยู่ในความดูแล', type:'info' },
      { studentId:'ADVISOR', title:'ใกล้ถึงกำหนดประเมินผล', detail:'กรุณาตรวจสอบและบันทึกผลประเมินนักศึกษา', type:'warning' },
    ]);

    console.log('Seed complete');
    console.log('Student login: 640123456 / 123456');
    console.log('Advisor login: teacher001 / 123456');
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally { await mongoose.disconnect(); }
}
seed();
