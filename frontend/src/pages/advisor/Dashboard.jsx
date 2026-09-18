import Card from "../../components/Card";
import Badge from "../../components/Badge";
import PageTitle from "../../components/PageTitle";

import "./advisor.css";


export default function AdvisorDashboard({
  data = {},
  setPage,
}) {

  // ==============================
  // DATA
  // ==============================

  const students =
    data.students || [];

  const weeklyReports =
    data.weeklyReports || [];

  const notifications =
    data.notifications || [];


  // ==============================
  // REPORT STATUS
  // ==============================

  const submitted =
    weeklyReports.filter(
      (x) =>
        x.status === "ส่งแล้ว" ||
        x.status === "รอตรวจสอบ" ||
        x.status === "submitted" ||
        x.status === "pending"
    ).length;


  const checked =
    weeklyReports.filter(
      (x) =>
        x.status === "อาจารย์ตรวจแล้ว" ||
        x.status === "ผ่าน" ||
        x.status === "approved" ||
        x.status === "ผ่านการตรวจสอบ"
    ).length;


  const needFix =
    weeklyReports.filter(
      (x) =>
        x.status === "ต้องแก้ไข" ||
        x.status === "แก้ไข" ||
        x.status === "rejected" ||
        x.status === "ต้องปรับปรุง"
    ).length;


  // ==============================
  // REPORTS WAITING FOR CHECK
  // ==============================

  const pending =
    weeklyReports
      .filter(
        (x) =>
          x.status === "ส่งแล้ว" ||
          x.status === "รอตรวจสอบ" ||
          x.status === "submitted" ||
          x.status === "pending"
      )
      .slice(0, 5);


  // ==============================
  // UNREAD NOTIFICATION
  // ==============================

  const unreadNotifications =
    notifications.filter(
      (n) =>
        !n.isRead
    ).length;


  // ==============================
  // NAVIGATION
  // ==============================

  function goTo(page) {

    if (
      typeof setPage ===
      "function"
    ) {
      setPage(page);
    }

  }


  return (
    <div className="content">

      {/* =====================================
          PAGE TITLE
      ====================================== */}

      <PageTitle
        title="ระบบติดตามฝึกงานนักศึกษา (สำหรับอาจารย์ที่ปรึกษา)"
        subtitle="บริหารจัดการข้อมูลการฝึกงานของนักศึกษา ติดตามความก้าวหน้า และประเมินผลการฝึกงาน"
      />


      {/* =====================================
          STATISTICS
      ====================================== */}

      <div className="stat-grid advisor-stats">

        <Stat
          icon="●"
          title="นักศึกษาทั้งหมด"
          value={students.length}
          suffix="คน"
          tone="purple"
        />


        <Stat
          icon="▤"
          title="รายงานที่ส่งแล้ว"
          value={weeklyReports.length}
          suffix="ฉบับ"
          tone="green"
          onClick={() =>
            goTo("advisor-reports")
          }
        />


        <Stat
          icon="◷"
          title="รอตรวจสอบ"
          value={submitted}
          suffix="ฉบับ"
          tone="orange"
          onClick={() =>
            goTo("advisor-reports")
          }
        />


        <Stat
          icon="✓"
          title="ผ่านการตรวจสอบ"
          value={checked}
          suffix="ฉบับ"
          tone="blue"
        />

      </div>


      {/* =====================================
          STUDENTS + PENDING REPORTS
      ====================================== */}

      <div className="two-col advisor">


        {/* =================================
            STUDENT TABLE
        ================================== */}

        <Card
          title="รายชื่อนักศึกษาฝึกงาน (ล่าสุด)"
          action={
            <button
              className="text-btn"
              onClick={() =>
                goTo("advisor-students")
              }
            >
              ดูนักศึกษาทั้งหมด ›
            </button>
          }
        >

          <div className="student-table">

            <div className="table-head">

              <span>
                ลำดับ
              </span>

              <span>
                นักศึกษา
              </span>

              <span>
                สถานประกอบการ
              </span>

              <span>
                ตำแหน่ง
              </span>

              <span>
                ความก้าวหน้า
              </span>

              <span>
                สถานะ
              </span>

            </div>


            {students
              .slice(0, 5)
              .map(
                (s, i) => {

                  const progress =
                    Math.min(
                      100,
                      Math.max(
                        0,
                        Number(
                          s.progress || 0
                        )
                      )
                    );


                  return (
                    <div
                      className="student-row"
                      key={
                        s._id ||
                        s.studentId ||
                        i
                      }
                    >

                      {/* ลำดับ */}

                      <span>
                        {i + 1}
                      </span>


                      {/* นักศึกษา */}

                      <span className="person-cell">

                        <div className="avatar tiny">

                          {s.name
                            ?.charAt(0) ||
                            "น"}

                        </div>

                        <span>
                          {s.name ||
                            "ไม่ระบุชื่อ"}
                        </span>

                      </span>


                      {/* บริษัท */}

                      <span>
                        {s.company ||
                          s.companyName ||
                          "-"}
                      </span>


                      {/* ตำแหน่ง */}

                      <span>
                        {s.position ||
                          s.jobPosition ||
                          "-"}
                      </span>


                      {/* ความก้าวหน้า */}

                      <span>

                        <div className="progress-cell">

                          <div className="bar">

                            <i
                              style={{
                                width:
                                  `${progress}%`,
                              }}
                            />

                          </div>

                          <small>
                            {progress}%
                          </small>

                        </div>

                      </span>


                      {/* สถานะ */}

                      <Badge
                        tone={
                          progress >= 70
                            ? "green"
                            : "orange"
                        }
                      >

                        {progress >= 70
                          ? "ความคืบหน้าดี"
                          : "กำลังฝึกงาน"}

                      </Badge>

                    </div>
                  );

                }
              )}

          </div>


          {!students.length && (

            <Empty
              text="ยังไม่มีข้อมูลนักศึกษา"
            />

          )}

        </Card>


        {/* =================================
            PENDING REPORTS
        ================================== */}

        <Card
          title="รายงานที่รอตรวจ"
          action={
            <button
              className="text-btn"
              onClick={() =>
                goTo("advisor-reports")
              }
            >
              ดูทั้งหมด ›
            </button>
          }
        >

          <List
            items={
              pending.map(
                (r) => {

                  const student =
                    students.find(
                      (s) =>
                        s.studentId ===
                        r.studentId
                    );


                  return [
                    `รายงานสัปดาห์ที่ ${
                      r.weekNumber ??
                      "-"
                    }`,

                    `${
                      student?.name ||
                      r.studentName ||
                      r.studentId ||
                      "-"
                    } · ${
                      fmt(
                        r.createdAt ||
                        r.reportDate
                      )
                    }`,

                    "รอตรวจสอบ",
                  ];

                }
              )
            }
          />


          {!pending.length && (

            <Empty
              text="ไม่มีรายงานที่รอตรวจ"
            />

          )}

        </Card>

      </div>


      {/* =====================================
          SYSTEM SUMMARY
      ====================================== */}

      <div>

        {/* =================================
            SYSTEM SUMMARY
        ================================== */}

        <Card
          title="สรุประบบ"
        >

          <div className="company-info">

            <div className="company-logo">
              ▥
            </div>


            <div>

              <b>
                ระบบติดตามฝึกงาน
              </b>


              <span>
                นักศึกษาทั้งหมด{" "}
                {students.length}{" "}
                คน
              </span>


              <span>
                รายงานทั้งหมด{" "}
                {weeklyReports.length}{" "}
                ฉบับ
              </span>


              <span>
                รายงานที่ตรวจแล้ว{" "}
                {checked}{" "}
                ฉบับ
              </span>


              <span>
                รายงานที่ต้องแก้ไข{" "}
                {needFix}{" "}
                ฉบับ
              </span>


              <span>
                รายงานรอตรวจ{" "}
                {submitted}{" "}
                ฉบับ
              </span>


              <span>
                แจ้งเตือนใหม่{" "}
                {unreadNotifications}{" "}
                รายการ
              </span>

            </div>

          </div>


          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "14px",
              flexWrap: "wrap",
            }}
          >

            <button
              className="small-btn"
              onClick={() =>
                goTo(
                  "advisor-students"
                )
              }
            >
              ดูนักศึกษา
            </button>


            <button
              className="small-btn"
              onClick={() =>
                goTo(
                  "advisor-reports"
                )
              }
            >
              ตรวจรายงาน
            </button>


            <button
              className="small-btn"
              onClick={() =>
                goTo(
                  "advisor-evaluations"
                )
              }
            >
              ประเมินผล
            </button>

          </div>

        </Card>

      </div>

    </div>
  );
}


/* =================================================
   STAT COMPONENT
================================================= */

function Stat({
  icon,
  title,
  value,
  suffix,
  tone = "blue",
  onClick,
}) {

  const tones = {

    purple: {
      background:
        "#f0eaff",
      color:
        "#7654d6",
    },

    green: {
      background:
        "#e5f8f0",
      color:
        "#20a978",
    },

    orange: {
      background:
        "#fff1dc",
      color:
        "#e69a22",
    },

    blue: {
      background:
        "#e8f1ff",
      color:
        "#3474dc",
    },

  };


  const selected =
    tones[tone] ||
    tones.blue;


  return (
    <div
      className="stat-card"
      onClick={onClick}
      style={{
        cursor:
          onClick
            ? "pointer"
            : "default",
      }}
    >

      <div
        className="stat-icon"
        style={{
          background:
            selected.background,

          color:
            selected.color,
        }}
      >
        {icon}
      </div>


      <div className="stat-info">

        <span>
          {title}
        </span>


        <strong>
          {value ?? 0}

          {suffix && (
            <small>
              {" "}
              {suffix}
            </small>
          )}

        </strong>

      </div>

    </div>
  );
}


/* =================================================
   LIST COMPONENT
================================================= */

function List({
  items = [],
}) {

  if (!items.length) {
    return null;
  }


  return (
    <div className="dashboard-list">

      {items.map(
        (
          item,
          index
        ) => {

          const [
            title,
            detail,
            status,
          ] = item;


          return (
            <div
              className="dashboard-list-item"
              key={index}
            >

              <div className="list-icon">
                {index + 1}
              </div>


              <div className="list-content">

                <b>
                  {title ||
                    "-"}
                </b>

                <span>
                  {detail ||
                    "-"}
                </span>

              </div>


              {status && (

                <Badge
                  tone={
                    getStatusTone(
                      status
                    )
                  }
                >
                  {status}
                </Badge>

              )}

            </div>
          );

        }
      )}

    </div>
  );
}


/* =================================================
   EMPTY COMPONENT
================================================= */

function Empty({
  text =
    "ไม่มีข้อมูล",
}) {

  return (
    <div
      style={{
        padding:
          "24px 10px",
        textAlign:
          "center",
        color:
          "#94a2b8",
        fontSize:
          "11px",
      }}
    >
      {text}
    </div>
  );
}


/* =================================================
   STATUS COLOR
================================================= */

function getStatusTone(
  status
) {

  const text =
    String(
      status || ""
    );


  if (
    text.includes("ผ่าน") ||
    text.includes("ตรวจแล้ว") ||
    text.includes("สำเร็จ") ||
    text === "approved"
  ) {
    return "green";
  }


  if (
    text.includes("แก้ไข") ||
    text.includes("ต้องปรับปรุง") ||
    text === "rejected"
  ) {
    return "red";
  }


  if (
    text.includes("รอ") ||
    text === "pending" ||
    text === "submitted"
  ) {
    return "orange";
  }


  return "blue";
}


/* =================================================
   DATE FORMAT
================================================= */

function fmt(
  date
) {

  if (!date) {
    return "-";
  }


  try {

    const d =
      new Date(date);


    if (
      Number.isNaN(
        d.getTime()
      )
    ) {
      return "-";
    }


    return d.toLocaleDateString(
      "th-TH",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  } catch {

    return "-";

  }
}