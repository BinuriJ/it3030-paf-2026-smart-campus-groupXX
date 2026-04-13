import React, { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import NoticePanel from "../components/NoticePanel";
import { getStoredUser } from "../api/api";
import {
  fetchStudentNotices,
  fetchUnreadNoticeCount,
  markStudentNoticeSeen,
} from "../api/studentNotices";
import "../styles/dashboard.css";


export default function Dashboard() {
  const storedUser = getStoredUser();
  const studentId = storedUser?._id;
  const [notices, setNotices] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!studentId) {
      return;
    }

    const loadDashboardNotices = async () => {
      try {
        const [noticeData, unreadTotal] = await Promise.all([
          fetchStudentNotices(studentId),
          fetchUnreadNoticeCount(studentId),
        ]);

        setNotices(noticeData);
        setUnreadCount(unreadTotal);
        setError("");
      } catch (requestError) {
        setError(
          requestError?.response?.data?.message ||
            requestError?.message ||
            "Unable to load notices right now."
        );
      }
    };

    loadDashboardNotices();
  }, [studentId]);

  if (!storedUser) {
    return (
      <div className="dashboard">
        <Navbar newCount={0} />
        <h2 className="page-title">Loading...</h2>
      </div>
    );
  }

  const handleNoticeClick = async (noticeId) => {
    const selectedNotice = notices.find((notice) => (notice._id || notice.id) === noticeId);
    if (!studentId || !selectedNotice || selectedNotice.seen) {
      return;
    }

    try {
      await markStudentNoticeSeen(studentId, noticeId);
      setNotices((current) =>
        current.map((notice) =>
          (notice._id || notice.id) === noticeId
            ? { ...notice, seen: true, seenAt: new Date().toISOString() }
            : notice
        )
      );
      setUnreadCount((current) => Math.max(0, current - 1));
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to mark this notice as seen."
      );
    }
  };

  return (
    <div className="dashboard">
      <Navbar newCount={unreadCount} />

      

      <div className="dashboard-content">
        <div className="simple-hero">
  <div className="simple-hero-left">
    <h2>Welcome</h2>
    <h1>Best Learning Opportunities</h1>
    <p>
      Our goal is to make online education work for everyone
    </p>

    <div className="simple-buttons">
  <button onClick={() => window.location.href="/about"}>
    About Us
  </button>

  <button
    className="outline"
    onClick={() => window.location.href="/contact"}
  >
    Contact Us
  </button>
</div>
  </div>

  <div className="simple-hero-right">
    <img src="/student.png" alt="student" />
    
  </div>
</div>

      
      </div>

      {error ? <p className="dashboard-message error">{error}</p> : null}
    </div>
  );
}
