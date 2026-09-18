import { useEffect, useMemo, useRef, useState } from "react";

import Icon from "./Icon";
import { api } from "../services/api";

const navStudent = [
  ["dashboard", "⌂", "หน้าหลัก"],
  ["internship", "▣", "ข้อมูลการฝึกงาน"],
  ["reports", "▤", "บันทึกรายงาน"],
  ["calendar", "▦", "ปฏิทินกิจกรรม"],
  ["forms", "▧", "แบบฟอร์มต่าง ๆ"],
  ["chat", "💬", "แชท"],
  ["notifications", "♟", "การแจ้งเตือน"],
  ["evaluation", "✓", "ประเมินผล"],
  ["profile", "●", "โปรไฟล์"],
];

const navAdvisor = [
  ["advisor-dashboard", "⌂", "หน้าหลัก"],
  ["advisor-students", "♟", "รายชื่อนักศึกษา"],
  ["advisor-reports", "▤", "รายงานประจำสัปดาห์"],
  ["advisor-announcements", "◈", "ประกาศ"],
  ["advisor-evaluations", "✓", "ประเมินผล"],
  ["calendar", "▦", "ปฏิทินกิจกรรม"],
  ["chat", "💬", "แชท"],
  ["advisor-forms", "▧", "แบบฟอร์มต่าง ๆ"],
  ["notifications", "♟", "การแจ้งเตือน"],
  ["profile", "●", "โปรไฟล์"],
];

export default function Layout({
  user,
  page,
  setPage,
  onLogout,
  children,
  notifications = [],
  unreadMessages = 0,
  data = {},
}) {
  const student = user?.role === 'student';

  const nav = student
    ? navStudent
    : navAdvisor;

  const unread = notifications.filter(
    (n) => !n.isRead
  ).length;

  /* ============ เมนูมือถือ (Mobile Drawer) ============ */

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function closeMobileNav() {
    setMobileNavOpen(false);
  }

  function goPage(key) {
    setPage(key);
    closeMobileNav();
  }

  /* ============ ค้นหา (Global Search) ============ */

  const [announcements, setAnnouncements] = useState([]);
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchBoxRef = useRef(null);

  useEffect(() => {
    let ignore = false;

    api("/announcements")
      .then((list) => {
        if (!ignore) setAnnouncements(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (!ignore) setAnnouncements([]);
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(e.target)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchItems = useMemo(() => {
    const items = [];

    const weeklyReports = data?.weeklyReports || [];
    const dailyReports = data?.dailyReports || [];
    const students = data?.students || [];
    const list = announcements || [];
    const notifList = data?.notifications || notifications || [];

    weeklyReports.forEach((r) => {
      items.push({
        id: `weekly-${r._id}`,
        type: "รายงานประจำสัปดาห์",
        title: r.workTitle || `รายงานสัปดาห์ที่ ${r.weekNumber || ""}`,
        subtitle: r.workDescription || "",
        page: student ? "reports" : "advisor-reports",
      });
    });

    dailyReports.forEach((r) => {
      items.push({
        id: `daily-${r._id}`,
        type: "บันทึกประจำวัน",
        title: r.title || "บันทึกประจำวัน",
        subtitle: r.description || "",
        page: student ? "reports" : "advisor-reports",
      });
    });

    list.forEach((a) => {
      items.push({
        id: `ann-${a._id}`,
        type: "ประกาศ",
        title: a.title || "ประกาศ",
        subtitle: a.content || "",
        page: student ? "notifications" : "advisor-announcements",
      });
    });

    if (!student) {
      students.forEach((s) => {
        items.push({
          id: `student-${s._id || s.studentId}`,
          type: "นักศึกษา",
          title: s.name || s.studentId || "นักศึกษา",
          subtitle: `${s.studentId || ""} ${s.company || ""}`.trim(),
          page: "advisor-students",
        });
      });
    }

    notifList.forEach((n) => {
      items.push({
        id: `notif-${n._id}`,
        type: "การแจ้งเตือน",
        title: n.title || "การแจ้งเตือน",
        subtitle: n.message || "",
        page: "notifications",
      });
    });

    return items;
  }, [data, announcements, notifications, student]);

  const searchResults = useMemo(() => {
    const text = query.trim().toLowerCase();

    if (!text) return [];

    return searchItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(text) ||
          item.subtitle.toLowerCase().includes(text)
      )
      .slice(0, 8);
  }, [query, searchItems]);

  function goToResult(item) {
    setPage(item.page);
    setQuery("");
    setShowResults(false);
  }

  return (
    <div className="app-shell">

      {/* ================= MOBILE BACKDROP ================= */}
      {mobileNavOpen && (
        <div
          className="sidebar-backdrop"
          onClick={closeMobileNav}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside className={mobileNavOpen ? 'sidebar mobile-open' : 'sidebar'}>

        {/* Logo */}
        <div className="brand">
          <div className="brand-icon">
            🎓
          </div>

          <div className="brand-text">
            <b>
              ระบบติดตามฝึกงาน
              <br />
              นักศึกษา
            </b>

            <small>
              Internship Tracking App
            </small>
          </div>

          <button
            type="button"
            className="sidebar-close"
            onClick={closeMobileNav}
            aria-label="ปิดเมนู"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">

          {nav.map(([key, icon, label]) => (
            <button
              key={key}
              type="button"
              className={
                page === key
                  ? 'sidebar-nav-button active'
                  : 'sidebar-nav-button'
              }
              onClick={() => goPage(key)}
            >

              <span className="nav-icon">
                <Icon>{icon}</Icon>
              </span>

              <span className="nav-label">
                {label}
              </span>

               {key === 'notifications' &&
                unread > 0 && (
                  <span className="nav-badge">
                    {unread}
                  </span>
                )}

              {key === 'chat' &&
                unreadMessages > 0 && (
                  <span className="nav-badge">
                    {unreadMessages}
                  </span>
                )}

            </button>
          ))}

          {/* Logout */}
          <button
            type="button"
            className="sidebar-nav-button logout"
            onClick={() => {
              closeMobileNav();
              onLogout();
            }}
          >

            <span className="nav-icon">
              <Icon>↪</Icon>
            </span>

            <span className="nav-label">
              ออกจากระบบ
            </span>

          </button>

        </nav>

        {/* University */}
        <div className="sidebar-footer">

          <div className="university-logo">
            🏫
          </div>

          <b>
            มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน
          </b>

          <span>
            วิทยาเขตขอนแก่น
          </span>

          <small>
            © 2025 Internship Tracking
          </small>

        </div>

      </aside>


      {/* ================= MAIN ================= */}
      <main className="main">

        {/* Topbar */}
        <header className="topbar">

          {/* Mobile menu button */}
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMobileNavOpen(true)}
            aria-label="เปิดเมนู"
          >
            ☰
          </button>

          {/* Search */}
          <div
            className="search"
            ref={searchBoxRef}
            style={{ position: "relative" }}
          >

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              placeholder="ค้นหา เอกสาร, รายงาน, หรือประกาศ..."
            />

            {showResults && query.trim() && (
              <div className="search-dropdown">

                {searchResults.length === 0 && (
                  <div className="search-empty">
                    ไม่พบผลลัพธ์ที่ตรงกับ "{query}"
                  </div>
                )}

                {searchResults.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className="search-result"
                    onClick={() => goToResult(item)}
                  >
                    <span className="search-result-type">
                      {item.type}
                    </span>

                    <span className="search-result-title">
                      {item.title}
                    </span>

                    {item.subtitle && (
                      <span className="search-result-sub">
                        {item.subtitle}
                      </span>
                    )}
                  </button>
                ))}

              </div>
            )}

          </div>


          {/* Right */}
          <div className="topbar-right">

            {/* Notification */}
            <button
              type="button"
              className="bell"
              onClick={() =>
                setPage('notifications')
              }
              title="การแจ้งเตือน"
            >

              <span>🔔</span>

              {unread > 0 && (
                <i>
                  {unread}
                </i>
              )}

            </button>


            {/* User */}
            <button
              type="button"
              className="top-user"
              onClick={() =>
                setPage('profile')
              }
              title="เปิดโปรไฟล์"
            >

              <div className="top-avatar">
                {student ? 'น' : 'อ'}
              </div>

              <div className="top-user-info">

                <b>
                  {user?.name ||
                    user?.username ||
                    'ผู้ใช้งาน'}
                </b>

                <span>
                  {student
                    ? 'นักศึกษา'
                    : 'อาจารย์ที่ปรึกษา'}
                </span>

              </div>

              <span className="top-arrow">
               ⌄
              </span>

            </button>

          </div>

        </header>


        {/* Page */}
        <section className="page-area">
          {children}
        </section>

      </main>

    </div>
  );
}