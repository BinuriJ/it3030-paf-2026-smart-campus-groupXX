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

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [newCount, setNewCount] = useState(0);
  const [error, setError] = useState("");
  const storedUser = getStoredUser();
  const studentId = storedUser?._id;

  useEffect(() => {
    if (!studentId) {
      return;
    }

    const loadNotices = async () => {
      try {
        const [noticeData, unreadCount] = await Promise.all([
          fetchStudentNotices(studentId),
          fetchUnreadNoticeCount(studentId),
        ]);

        setNotices(noticeData);
        setNewCount(unreadCount);
        setError("");
      } catch (requestError) {
        setError(
          requestError?.response?.data?.message ||
            requestError?.message ||
            "Unable to load student notices."
        );
      }
    };

    loadNotices();
  }, [studentId]);

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
      setNewCount((current) => Math.max(0, current - 1));
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
      <Navbar newCount={newCount} />

      <div className="notice-header">
        <h2 className="page-title">Student Notices</h2>

        <div className="notice-summary">
          <span>Unread Notices</span>
          <h3>{newCount}</h3>
        </div>
      </div>

      <div className="notice-container">
        <NoticePanel
          notices={notices}
          onNoticeClick={handleNoticeClick}
          emptyMessage="No student notices available."
        />
      </div>

      {error ? <p className="dashboard-message error">{error}</p> : null}
    </div>
  );
}
