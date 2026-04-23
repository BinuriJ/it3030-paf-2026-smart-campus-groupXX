import React from "react";
import jsPDF from "jspdf";

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

export default function NoticeCardItem({ data, onClick }) {
  const noticeId = data._id || data.id;
  const notice = data;

  const downloadPDF = (selectedNotice) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Smart Campus Notice", 10, 10);

    doc.setFontSize(12);
    doc.text(`Title: ${selectedNotice.title || ""}`, 10, 25);

    const messageLines = doc.splitTextToSize(
      `Message: ${selectedNotice.message || selectedNotice.description || ""}`,
      180
    );
    doc.text(messageLines, 10, 40);

    doc.save("notice.pdf");
  };

  const handleCardKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.(noticeId);
    }
  };

  return (
    <article
      className={`notice-card student-notice-card ${data.seen ? "seen" : "unread"}`}
    >
      <div
        role="button"
        tabIndex={0}
        className="student-notice-main"
        onClick={() => onClick?.(noticeId)}
        onKeyDown={handleCardKeyDown}
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
      </div>

      <div className="notice-card-actions">
        <button className="pdf-btn" type="button" onClick={() => downloadPDF(notice)}>
          Download PDF
        </button>
      </div>
    </article>
  );
}
