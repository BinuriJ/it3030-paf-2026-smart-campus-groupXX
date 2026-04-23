import api from "./api";

export async function fetchStudentNotices(studentId) {
  const response = await api.get(`/api/student/notices/${studentId}`);
  return response.data;
}

export async function fetchUnreadNoticeCount(studentId) {
  const response = await api.get(`/api/student/notices/unread-count/${studentId}`);
  return response.data?.count ?? 0;
}

export async function markStudentNoticeSeen(studentId, noticeId) {
  const response = await api.put("/api/student/notices/mark-seen", {
    studentId,
    noticeId,
  });

  return response.data;
}
