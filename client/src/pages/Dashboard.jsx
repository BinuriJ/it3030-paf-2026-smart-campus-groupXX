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

      <h2 className="page-title">Welcome Back</h2>

      <div className="dashboard-content">
        <div className="panel">
          <h3>Recent Notifications</h3>

          <div className="notification-item unread">
            Booking Approved
            <small>2 mins ago</small>
          </div>

          <div className="notification-item">
            Ticket Updated
            <small>10 mins ago</small>
          </div>
        </div>

        <NoticePanel
          notices={notices}
          onNoticeClick={handleNoticeClick}
          emptyMessage="No campus notices available yet."
        />
      </div>

      {error ? <p className="dashboard-message error">{error}</p> : null}
    </div>
  );
}
