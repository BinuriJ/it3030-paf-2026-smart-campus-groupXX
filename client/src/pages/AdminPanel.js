import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const navigate = useNavigate();
  const adminName = "ADMIN";

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await API.get("/bookings/admin/all");
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(
        `/bookings/admin/status/${id}?status=${status}&adminName=${adminName}`
      );
      load();
    } catch (err) {
      console.error("Status update failed:", err.response?.data || err.message);
    }
  };

  // ✅ FILTER LOGIC
  const filteredBookings =
    statusFilter === "ALL"
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);

  // ✅ PDF EXPORT (PRINT)
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
            th { background: #343C59; color: #fff; }
          </style>
        </head>
        <body>
          <h2>Booking Report (${statusFilter})</h2>
          <table>
            <tr>
              <th>User</th>
              <th>Resource</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
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
          <script>
            window.print();
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED": return "#16a34a";
      case "REJECTED": return "#dc2626";
      case "PENDING": return "#f59e0b";
      case "COMPLETED": return "#2563eb";
      case "EXPIRED": return "#64748b";
      default: return "#64748b";
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      fontFamily: "Segoe UI, sans-serif",
      background: "linear-gradient(180deg, #343C59 0%, #C8C1A6 100%)",
      padding: "30px"
    },

    headerBar: {
      background: "#343C59",
      padding: "18px",
      borderRadius: "12px",
      marginBottom: "15px",
      textAlign: "center",
      color: "#fff",
      fontSize: "22px",
      fontWeight: "600",
      position: "relative"
    },

    backBtn: {
      position: "absolute",
      left: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "#C8C1A6",
      color: "#343C59",
      border: "none",
      padding: "6px 12px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600"
    },

    filterBar: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "20px",
      gap: "10px"
    },

    select: {
      padding: "8px",
      borderRadius: "8px",
      border: "1px solid #9AA6AF"
    },

    exportBtn: {
      background: "#2563eb",
      color: "#fff",
      border: "none",
      padding: "8px 12px",
      borderRadius: "8px",
      cursor: "pointer"
    },

    list: {
      display: "flex",
      flexDirection: "column",
      gap: "12px"
    },

    item: {
      background: "#D3D3CF",
      border: "1px solid #9AA6AF",
      borderRadius: "12px",
      padding: "14px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap"
    },

    left: {
      display: "flex",
      flexDirection: "column",
      gap: "4px"
    },

    user: { fontWeight: "600", color: "#343C59" },

    text: { fontSize: "13px", color: "#343C59" },

    right: { display: "flex", gap: "10px", alignItems: "center" },

    status: {
      padding: "4px 10px",
      borderRadius: "20px",
      color: "#fff",
      fontSize: "11px",
      fontWeight: "bold"
    },

    btn: {
      padding: "6px 10px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontSize: "12px"
    },

    approve: { background: "#16a34a", color: "#fff" },
    reject: { background: "#dc2626", color: "#fff" },
    view: { background: "#2563eb", color: "#fff" },

    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(52,60,89,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },

    modal: {
      background: "#D3D3CF",
      padding: "22px",
      borderRadius: "14px",
      width: "420px"
    },

    closeBtn: {
      marginTop: "12px",
      background: "#343C59",
      color: "#fff",
      border: "none",
      padding: "8px 12px",
      borderRadius: "8px",
      cursor: "pointer"
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.headerBar}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>
        Admin Booking Panel
      </div>

      {/* FILTER + EXPORT */}
      <div style={styles.filterBar}>
        <select
          style={styles.select}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="COMPLETED">Completed</option>
          <option value="EXPIRED">Expired</option>
        </select>

        <button style={styles.exportBtn} onClick={exportPDF}>
          Export PDF
        </button>
      </div>

      {/* LIST */}
      <div style={styles.list}>
        {filteredBookings.map((b) => (
          <div key={b.id} style={styles.item}>
            <div style={styles.left}>
              <span style={styles.user}>{b.userName}</span>
              <span style={styles.text}>
                {b.resourceType} | {b.resourceId}
              </span>
              <span style={styles.text}>
                {new Date(b.startTime).toLocaleString()}
              </span>
            </div>

            <div style={styles.right}>
              <span
                style={{
                  ...styles.status,
                  background: getStatusColor(b.status)
                }}
              >
                {b.status}
              </span>

              <button style={{ ...styles.btn, ...styles.view }} onClick={() => setSelected(b)}>
                View
              </button>

              <button style={{ ...styles.btn, ...styles.approve }} onClick={() => updateStatus(b.id, "APPROVED")}>
                Approve
              </button>

              <button style={{ ...styles.btn, ...styles.reject }} onClick={() => updateStatus(b.id, "REJECTED")}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selected && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Booking Details</h3>
            <p><b>User:</b> {selected.userName}</p>
            <p><b>Resource:</b> {selected.resourceType}</p>
            <p><b>ID:</b> {selected.resourceId}</p>
            <p><b>Status:</b> {selected.status}</p>
            <p><b>Purpose:</b> {selected.purpose}</p>
            <p><b>Participants:</b> {selected.participants}</p>

            <button style={styles.closeBtn} onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;