/*import React, { useEffect, useState } from "react";
import axios from "axios";

function NoticePanel() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8081/api/notices")
      .then(res => setNotices(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{
      padding: "15px",
      background: "#E1D9BC",
      borderRadius: "10px"
    }}>
      <h3 style={{ color: "#30364F" }}>📢 Notices</h3>

      {notices.map(n => (
        <div key={n.id} style={{
          marginBottom: "10px",
          padding: "10px",
          background: "#F0F0DB",
          borderRadius: "5px"
        }}>
          <h4>{n.title}</h4>
          <p>{n.message}</p>
        </div>
      ))}
    </div>
  );
}

export default NoticePanel; */

import NoticeCard from "./NoticeCard";

export default function NoticePanel() {
  const notices = [
    { id: 1, title: "Maintenance Notice", message: "System downtime tonight" },
  ];

  return (
    <div className="panel">
      <h3>Notices</h3>

      {notices.map((n) => (
        <NoticeCard key={n.id} data={n} />
      ))}
    </div>
  );
}