// import React from "react";
// import NoticeCard from "./NoticeCard";


// export default function NoticePanel({
//   notices = [],
//   onNoticeClick,
//   emptyMessage = "No notices yet.",
// }) {
//   return (
//     <div className="panel">
//       <h3>Notices</h3>

//       <div className="student-notice-list">
//         {notices.length ? (
//           notices.map((notice) => (
//             <NoticeCard
//               key={notice._id || notice.id}
//               data={notice}
//               onClick={onNoticeClick}
//             />
//           ))
//         ) : (
//           <p className="empty-state">{emptyMessage}</p>
//         )}
//       </div>
//     </div>
//   );
// }

import React from "react";
import NoticeCard from "./NoticeCard";

export default function NoticePanel({
  notices = [],
  onNoticeClick = () => {},
  emptyMessage = "No notices yet.",
}) {
  return (
    <div className="panel">
      <h3>Notices</h3>

      <div className="student-notice-list">
        {Array.isArray(notices) && notices.length > 0 ? (
          notices.map((notice) => (
            <NoticeCard
              key={notice?._id || notice?.id}
              data={notice}
              onClick={onNoticeClick}
            />
          ))
        ) : (
          <p className="empty-state">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
}