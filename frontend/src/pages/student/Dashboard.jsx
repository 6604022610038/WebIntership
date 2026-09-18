import Card from "../../components/Card";
import Badge from "../../components/Badge";
import Icon from "../../components/Icon";
import PageTitle from "../../components/PageTitle";

import "./student.css";

export default function StudentDashboard({ data, setPage }) {
  const {
    student = {},
    weeklyReports = [],
    dailyReports = [],
    activities = [],
    evaluations = [],
    notifications = [],
  } = data || {};

  const reportCount = weeklyReports.length;
  const reportPercent = Math.min(Math.round((reportCount / 10) * 100), 100);

  const totalHours = student.totalHours || 160;
  const requiredHours = student.requiredHours || 320;
  const hoursPercent = requiredHours
    ? Math.min(Math.round((totalHours / requiredHours) * 100), 100)
    : 0;

  const evaluationScore =
    evaluations.length > 0
      ? Number(evaluations[0]?.score || 4.5)
      : 4.5;

  const studentName =
    student.name ||
    student.fullName ||
    data?.user?.name ||
    "นายธนภัทร สมใจ";

  const studentId =
    student.studentId ||
    student.id ||
    "640123456";

  const faculty =
    student.faculty ||
    "คณะวิทยาการคอมพิวเตอร์";

  const major =
    student.major ||
    "สาขาเทคโนโลยีสารสนเทศ";

  const company =
    student.company ||
    student.companyName ||
    "บริษัท ตัวอย่าง จำกัด";

  const position =
    student.position ||
    "นักพัฒนาโปรแกรม (Intern)";

  const internshipStart =
    student.startDate ||
    "2 พ.ค. 2567";

  const internshipEnd =
    student.endDate ||
    "30 ก.ย. 2567";


  /* =====================================================
     กิจกรรมที่กำลังดำเนินการ
     ===================================================== */

  const dashboardActivities =
    activities.length > 0
      ? activities.slice(0, 3)
      : [
          {
            title: "ส่งรายงานสัปดาห์ที่ 5",
            date: "20 พ.ค. 2567",
            status: "กำลังส่ง",
            type: "report",
          },
          {
            title: "แบบประเมินจากสถานประกอบการ",
            date: "25 พ.ค. 2567",
            status: "รอตรวจสอบ",
            type: "form",
          },
          {
            title: "จัดทำรายงานสรุปการฝึกงาน",
            date: "30 ก.ย. 2567",
            status: "รอดำเนินการ",
            type: "summary",
          },
        ];


  /* =====================================================
     Progress
     ===================================================== */

  const progressSteps = [
    {
      title: "ปฐมนิเทศและเริ่มงาน",
      date: "2 พ.ค. 2567",
      done: true,
    },
    {
      title: "ศึกษางานและเรียนรู้ระบบงาน",
      date: "6 พ.ค. 2567",
      done: true,
    },
    {
      title: "ปฏิบัติงานจริง",
      date: "20 พ.ค. 2567",
      done: false,
      active: true,
    },
    {
      title: "จัดทำรายงานสรุป",
      date: "30 ก.ย. 2567",
      done: false,
    },
  ];


  return (
    <div className="dashboard-page">

      {/* =================================================
          WELCOME
          ================================================= */}

      <div className="dashboard-top-grid">

        <div className="welcome-card single">

          <div className="welcome-content">

            <h1>
              สวัสดีครับ, {studentName}
            </h1>

            <p className="welcome-subtitle">
              ยินดีต้อนรับสู่ระบบติดตามฝึกงานนักศึกษา
            </p>

            <p className="welcome-quote">
              “ ก้าวแรกสู่อนาคตที่ดีกว่า เริ่มที่การฝึกงาน ”
            </p>

          </div>

          <div className="welcome-illustration">

            <div className="desk"></div>

            <div className="person-illustration">

              <div className="person-head"></div>

              <div className="person-hair"></div>

              <div className="person-shirt">
                <span></span>
              </div>

              <div className="person-arm"></div>

            </div>

            <div className="laptop">
              <div className="laptop-screen"></div>
              <div className="laptop-base"></div>
            </div>

            <div className="plant">
              <div className="plant-leaf leaf-1"></div>
              <div className="plant-leaf leaf-2"></div>
              <div className="plant-leaf leaf-3"></div>
              <div className="plant-pot"></div>
            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          STAT CARDS
          ================================================= */}

      <div className="dashboard-stat-grid">

        {/* Reports */}

        <div className="dashboard-stat-card">

          <div className="stat-icon blue">
            📖
          </div>

          <div className="stat-card-content">

            <p>จำนวนรายงานที่ส่งแล้ว</p>

            <div className="stat-number">
              {reportCount || 4}
              <span>/ 10</span>
            </div>

            <div className="stat-progress">

              <div className="stat-progress-bg">
                <div
                  className="stat-progress-fill blue-fill"
                  style={{
                    width: `${reportCount ? reportPercent : 40}%`,
                  }}
                ></div>
              </div>

              <span>
                {reportCount ? reportPercent : 40}%
              </span>

            </div>

          </div>

        </div>


        {/* Hours */}

        <div className="dashboard-stat-card">

          <div className="stat-icon green">
            📄
          </div>

          <div className="stat-card-content">

            <p>ชั่วโมงการฝึกงานสะสม</p>

            <div className="stat-number">
              {totalHours}
              <span>
                / {requiredHours} ชม.
              </span>
            </div>

            <div className="stat-progress">

              <div className="stat-progress-bg">
                <div
                  className="stat-progress-fill green-fill"
                  style={{
                    width: `${hoursPercent}%`,
                  }}
                ></div>
              </div>

              <span>{hoursPercent}%</span>

            </div>

          </div>

        </div>


        {/* Tasks */}

        <div className="dashboard-stat-card">

          <div className="stat-icon orange">
            👤
          </div>

          <div className="stat-card-content">

            <p>งานที่ต้องดำเนินการ</p>

            <div className="stat-number">
              2
              <span> รายการ</span>
            </div>

            <small>
              ต้องส่งภายใน 7 วัน
            </small>

          </div>

          <button
            className="round-arrow"
            onClick={() => setPage("reports")}
          >
            ›
          </button>

        </div>


        {/* Evaluation */}

        <div className="dashboard-stat-card">

          <div className="stat-icon purple-stat">
            ★
          </div>

          <div className="stat-card-content">

            <p>คะแนนประเมินล่าสุด</p>

            <div className="stat-number">
              {evaluationScore}
              <span>/ 5</span>
            </div>

            <div className="stars">
              ★ ★ ★ ★ ★
            </div>

          </div>

          <button
            className="round-arrow"
            onClick={() => setPage("evaluation")}
          >
            ›
          </button>

        </div>

      </div>


      {/* =================================================
          MAIN GRID
          ================================================= */}

      <div className="dashboard-main-grid">


        {/* =================================================
            INTERNSHIP INFORMATION
            ================================================= */}

        <div className="dashboard-panel internship-panel">

          <div className="panel-title">

            <div>
              📄
            </div>

            <h2>
              ข้อมูลการฝึกงาน
            </h2>

          </div>


          <div className="internship-box">

            <div className="internship-company-icon">
              📄
            </div>

            <div className="internship-details">

              <p>
                บริษัท: <strong>{company}</strong>
              </p>

              <p>
                ตำแหน่ง: {position}
              </p>

              <p>
                ระยะเวลา: {internshipStart} - {internshipEnd}
              </p>

            </div>

            <div className="internship-status">
              กำลังฝึกงาน
            </div>

            <button
              className="details-button"
              onClick={() => setPage("internship")}
            >
              ดูรายละเอียด&nbsp; →
            </button>

          </div>


          {/* Progress */}

          <div className="progress-section">

            <div className="progress-title">
              📈 &nbsp; ความคืบหน้าการฝึกงาน
            </div>

            <div className="progress-content">

              <div className="progress-circle">

                <svg
                  width="145"
                  height="145"
                  viewBox="0 0 145 145"
                >

                  <circle
                    cx="72.5"
                    cy="72.5"
                    r="57"
                    className="circle-background"
                  />

                  <circle
                    cx="72.5"
                    cy="72.5"
                    r="57"
                    className="circle-progress"
                    style={{
                      strokeDasharray: "358",
                      strokeDashoffset: "215",
                    }}
                  />

                </svg>

                <div className="progress-circle-text">
                  <strong>40%</strong>
                  <span>เสร็จสิ้น</span>
                </div>

              </div>


              <div className="progress-steps">

                {progressSteps.map((step, index) => (

                  <div
                    className={`progress-step ${
                      step.done
                        ? "completed"
                        : step.active
                        ? "current"
                        : ""
                    }`}
                    key={index}
                  >

                    <div className="step-dot">

                      {step.done
                        ? "✓"
                        : step.active
                        ? ""
                        : ""}

                    </div>

                    <div className="step-text">

                      <strong>
                        {step.title}
                      </strong>

                      <span>
                        {step.date}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            ACTIVITIES + ANNOUNCEMENT
            ================================================= */}

        <div className="dashboard-middle-column">


          {/* Activities */}

          <div className="dashboard-panel activities-panel">

            <div className="panel-title panel-title-between">

              <div className="panel-title-left">
                📅
                <h2>
                  กิจกรรมที่กำลังดำเนินการ
                </h2>
              </div>

              <button
                className="view-all-button"
                onClick={() => setPage("reports")}
              >
                ดูทั้งหมด&nbsp; →
              </button>

            </div>


            <div className="activity-list">

              {dashboardActivities.map((activity, index) => (

                <div
                  className="activity-item"
                  key={index}
                >

                  <div
                    className={`activity-icon activity-${index}`}
                  >
                    {index === 0
                      ? "♟"
                      : index === 1
                      ? "▤"
                      : "▣"}
                  </div>

                  <div className="activity-content">

                    <strong>
                      {activity.title}
                    </strong>

                    <span>
                      {activity.date}
                    </span>

                  </div>

                  <span
                    className={`activity-status ${
                      index === 0
                        ? "status-pending"
                        : "status-waiting"
                    }`}
                  >
                    {activity.status}
                  </span>

                </div>

              ))}

            </div>

          </div>


          {/* Announcement */}

          <div className="dashboard-panel announcement-panel">

            <div className="panel-title">

              <div>
                📢
              </div>

              <h2>
                ประกาศล่าสุด
              </h2>

            </div>

            <div className="announcement-content">

              <div>

                <strong>
                  กำหนดส่งรายงานสัปดาห์ที่ 5
                  ภายในวันที่ 20 พ.ค. 2567
                </strong>

                <p>
                  โดย อาจารย์ที่ปรึกษา&nbsp;&nbsp;•&nbsp;&nbsp;
                  18 พ.ค. 2567
                </p>

              </div>

              <button>
                ›
              </button>

            </div>

          </div>

        </div>


        {/* =================================================
            CALENDAR
            ================================================= */}

        <div className="dashboard-panel calendar-panel">

          <div className="panel-title">

            <div>
              📅
            </div>

            <h2>
              ปฏิทินการฝึกงาน
            </h2>

          </div>


          <div className="calendar-header">

            <button>‹</button>

            <strong>
              พฤษภาคม 2567
            </strong>

            <button>›</button>

          </div>


          <div className="calendar-week">

            <span>อา</span>
            <span>จ</span>
            <span>อ</span>
            <span>พ</span>
            <span>พฤ</span>
            <span>ศ</span>
            <span>ส</span>

          </div>


          <div className="calendar-days">

            {[
              "", "", "1", "2", "3", "4", "5",
              "6", "7", "8", "9", "10", "11", "12",
              "13", "14", "15", "16", "17", "18", "19",
              "20", "21", "22", "23", "24", "25", "26",
              "27", "28", "29", "30", "31", "", "",
            ].map((day, index) => (

              <span
                key={index}
                className={
                  day === "20"
                    ? "selected-day"
                    : ""
                }
              >
                {day}
              </span>

            ))}

          </div>


          <div className="calendar-events">

            <div className="calendar-event">
              <span className="event-dot blue-dot"></span>
              <span>08:00 - 12:00</span>
              <strong>ฝึกงานที่บริษัท (ครึ่งวันเช้า)</strong>
            </div>

            <div className="calendar-event">
              <span className="event-dot purple-dot"></span>
              <span>13:00 - 16:00</span>
              <strong>ศึกษางานระบบ</strong>
            </div>

            <div className="calendar-event">
              <span className="event-dot blue-dot"></span>
              <span>09:00 - 11:00</span>
              <strong>ประชุมกับพี่เลี้ยง</strong>
            </div>

          </div>


          <button
            className="advisor-contact"
            onClick={() => setPage("notifications")}
          >
            🎧
            ติดต่ออาจารย์ที่ปรึกษา
            <span>›</span>
          </button>

        </div>

      </div>

    </div>
  );
}