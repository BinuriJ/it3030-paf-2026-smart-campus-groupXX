// import React from "react";
// import Navbar from "../components/Navbar";
// import "../styles/dashboard.css";

// export default function Notices() {
//   return (
//     <div className="dashboard">
//       <Navbar />

//       <h2 className="page-title">All Notices 📢</h2>

//       <div className="panel">
//         <div className="notice-card">System Maintenance Tonight</div>
//         <div className="notice-card">New Lab Available</div>
//         <div className="notice-card">Exam Schedule Released</div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import axios from "axios";

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/notices");
      setNotices(res.data);

      // simple logic → latest 2 = new
      setNewCount(res.data.length > 2 ? 2 : res.data.length);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard">
      <Navbar newCount={newCount} />

      <div className="notice-header">
        <h2 className="page-title">📢 Student Notices</h2>

        <div className="notice-summary">
          <span>Total Notices</span>
          <h3>{notices.length}</h3>
        </div>
      </div>

      <div className="notice-container">
        {notices.map((notice, index) => (
          <div key={notice._id} className="notice-card">
            <div className="notice-top">
              <h3>{notice.title}</h3>

              {index < newCount && (
                <span className="new-badge">NEW</span>
              )}
            </div>

            <p>{notice.message}</p>
            <small>Target: {notice.target || "ALL"}</small>
          </div>
        ))}
      </div>
    </div>
  );
}