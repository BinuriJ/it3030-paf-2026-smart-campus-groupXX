import { useEffect, useState } from "react";
import API from "../api/bookingApi";

function BookingAdminPanel() {
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(true);

  const adminName = localStorage.getItem("userName") || "ADMIN";

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get("/bookings/admin/all");
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, reason = "") => {
    try {
      await API.put(
        `/bookings/admin/status/${id}?status=${status}&adminName=${encodeURIComponent(adminName)}&reason=${encodeURIComponent(reason)}`
      );
      load();
    } catch (err) {
      console.error("Status update failed:", err.response?.data || err.message);
    }
  };

  const filteredBookings =
    statusFilter === "ALL"
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);

  const exportPDF = () => {
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Bookings Report</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #333; padding: 8px; text-align: left; }
            th { background: #1e293b; color: #fff; }
          </style>
        </head>
        <body>
          <h2>Booking Report (${statusFilter})</h2>
          <table>
            <tr><th>User</th><th>Resource</th><th>Status</th><th>Start Time</th></tr>
            ${filteredBookings
              .map(
                (b) => `
              <tr>
                <td>${b.userName}</td>
                <td>${b.resourceType} - ${b.resourceId}</td>
                <td>${b.status}</td>
                <td>${new Date(b.startTime).toLocaleString()}</td>
              </tr>
            `
              )
              .join("")}
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  const statusConfig = {
    APPROVED:  { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
    REJECTED:  { bg: "bg-rose-100",    text: "text-rose-700",    dot: "bg-rose-500" },
    PENDING:   { bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-500" },
    COMPLETED: { bg: "bg-blue-100",    text: "text-blue-700",    dot: "bg-blue-500" },
    EXPIRED:   { bg: "bg-slate-100",   text: "text-slate-500",   dot: "bg-slate-400" },
    CANCELLED: { bg: "bg-slate-100",   text: "text-slate-500",   dot: "bg-slate-400" },
  };

  const StatusBadge = ({ status }) => {
    const cfg = statusConfig[status] || statusConfig.EXPIRED;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Booking Approvals</h1>
          <p className="text-slate-500 mt-1 font-medium">Review, approve or reject student facility booking requests</p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <select
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm font-semibold text-slate-700"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Bookings</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="COMPLETED">Completed</option>
            <option value="EXPIRED">Expired</option>
          </select>
          <button
            onClick={exportPDF}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors"
          >
            Export PDF
          </button>
        </div>
      </header>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {["PENDING", "APPROVED", "REJECTED", "COMPLETED"].map((s) => {
          const count = bookings.filter((b) => b.status === s).length;
          const cfg = statusConfig[s];
          return (
            <div key={s} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className={`text-3xl font-black mb-1 ${cfg.text}`}>{count}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{s}</div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400">
            <svg className="w-6 h-6 animate-spin mr-3 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Loading bookings...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <svg className="w-14 h-14 mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-semibold">No bookings found</p>
            <p className="text-xs mt-1">No bookings match the selected filter.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3.5 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Student</th>
                <th className="px-5 py-3.5 text-left text-xs font-black text-slate-500 uppercase tracking-wider hidden md:table-cell">Resource</th>
                <th className="px-5 py-3.5 text-left text-xs font-black text-slate-500 uppercase tracking-wider hidden lg:table-cell">Date & Time</th>
                <th className="px-5 py-3.5 text-left text-xs font-black text-slate-500 uppercase tracking-wider hidden lg:table-cell">Purpose</th>
                <th className="px-5 py-3.5 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-right text-xs font-black text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-800">{b.userName}</div>
                    <div className="text-xs text-slate-400">{b.userEmail}</div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="font-semibold text-slate-700">{b.resourceType}</div>
                    <div className="text-xs text-slate-400 font-mono">{b.resourceId?.slice(0, 8)}...</div>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="font-semibold text-slate-700">{b.startTime ? new Date(b.startTime).toLocaleDateString() : '—'}</div>
                    <div className="text-xs text-slate-400">{b.startTime ? new Date(b.startTime).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : ''}</div>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <p className="text-slate-600 max-w-[180px] truncate" title={b.purpose}>{b.purpose || '—'}</p>
                    {b.participants > 0 && <p className="text-xs text-slate-400">{b.participants} attendees</p>}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={b.status} />
                    {b.rejectionReason && (
                      <p className="text-xs text-rose-500 mt-1 max-w-[130px] truncate" title={b.rejectionReason}>{b.rejectionReason}</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelected(b)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                      >
                        View
                      </button>
                      {b.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => updateStatus(b.id, "APPROVED")}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => { setRejectId(b.id); setShowRejectModal(true); }}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Booking Details</h2>
              <button className="text-slate-400 hover:text-slate-600" onClick={() => setSelected(null)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <StatusBadge status={selected.status} />
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Student", selected.userName],
                  ["Email", selected.userEmail],
                  ["Resource Type", selected.resourceType],
                  ["Participants", selected.participants],
                  ["Start Time", selected.startTime ? new Date(selected.startTime).toLocaleString() : '—'],
                  ["End Time", selected.endTime ? new Date(selected.endTime).toLocaleString() : '—'],
                ].map(([label, value]) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-4">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">{label}</div>
                    <div className="font-semibold text-slate-800 truncate">{value || '—'}</div>
                  </div>
                ))}
              </div>
              {selected.purpose && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Purpose</div>
                  <div className="font-semibold text-slate-800">{selected.purpose}</div>
                </div>
              )}
              {selected.rejectionReason && (
                <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
                  <div className="text-xs font-black text-rose-400 uppercase tracking-wider mb-1">Rejection Reason</div>
                  <div className="font-semibold text-rose-700">{selected.rejectionReason}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => { setShowRejectModal(false); setRejectReason(""); setRejectId(null); }}>
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Reject Booking</h2>
              <button className="text-slate-400 hover:text-slate-600" onClick={() => { setShowRejectModal(false); setRejectReason(""); setRejectId(null); }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">Please provide a reason for rejecting this booking. The student will be notified.</p>
              <textarea
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all resize-none text-slate-800 font-medium"
                rows={4}
                placeholder="Enter rejection reason..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <div className="flex gap-3">
                <button
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors shadow-sm"
                  onClick={() => {
                    updateStatus(rejectId, "REJECTED", rejectReason);
                    setShowRejectModal(false);
                    setRejectReason("");
                    setRejectId(null);
                  }}
                >
                  Confirm Rejection
                </button>
                <button
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                  onClick={() => { setShowRejectModal(false); setRejectReason(""); setRejectId(null); }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingAdminPanel;