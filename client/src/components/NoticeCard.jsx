import React from "react";

function formatNoticeDate(value) {
  if (!value) {
    return "Just now";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

export default function NoticeCard({ data, onClick }) {
  const noticeId = data._id || data.id;

  return (
    <button
      type="button"
      className={`notice-card student-notice-card ${data.seen ? "seen" : "unread"}`}
      onClick={() => onClick?.(noticeId)}
    >
      <div className="student-notice-header">
        <div>
          <h4>{data.title}</h4>
          <p>{data.message || data.description}</p>
        </div>
        {!data.seen ? <span className="new-badge">Unread</span> : null}
      </div>

      <div className="student-notice-meta">
        <small>{formatNoticeDate(data.createdAt)}</small>
        <small>Target: {data.targetGroup || "ALL"}</small>
      </div>
    </button>
  );
}
