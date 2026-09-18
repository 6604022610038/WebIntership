import Card from "../../components/Card";
import PageTitle from "../../components/PageTitle";
import Empty from "../../components/Empty";
import { fmtLong } from "../../utils/format";

import "./student.css";

export default function Announcements({
  notifications,
}) {
  return (
    <div className="content narrow">
      <PageTitle
        title="ประกาศ"
        subtitle="ข่าวสารและกำหนดการจากอาจารย์ที่ปรึกษา"
      />

      <Card title="ประกาศล่าสุด">
        <div className="announcement-list">
          {notifications.length ? (
            notifications.map(
              (n) => (
                <article
                  key={n._id}
                >
                  <div className="announce-icon">
                    ◈
                  </div>

                  <div>
                    <b>
                      {n.title}
                    </b>

                    <p>
                      {n.detail}
                    </p>

                    <small>
                      {fmtLong(
                        n.createdAt
                      )}
                    </small>
                  </div>
                </article>
              )
            )
          ) : (
            <Empty text="ยังไม่มีประกาศ" />
          )}
        </div>
      </Card>
    </div>
  );
}
