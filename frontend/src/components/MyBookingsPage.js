import { useEffect, useState, useCallback } from "react";
import API from "../api/bookingApi";
import { useNavigate } from "react-router-dom";

function MyBookingsPage() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "u1001";

  // =========================
  // LOAD BOOKINGS
  // =========================
  const load = useCallback(async () => {
    try {
      const res = await API.get("/bookings/my", {
        params: { userName }
      });

      setList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      alert("Failed to load bookings");
    }
  }, [userName]);

  useEffect(() => {
    load();
  }, [load]);

  // =========================
  // DELETE
  // =========================
  const deleteBooking = async (id) => {
    await API.delete(`/bookings/${id}`, {
      params: { userName }
    });
    load();
  };

  // =========================
  // FILTER
  // =========================
  const filtered = (list || [])
    .filter((b) =>
      (b?.resourceType || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((b) =>
      statusFilter === "ALL" ? true : b?.status === statusFilter
    );

  // =========================
  // DOWNLOAD PDF
  // =========================
  const downloadPDF = () => {
    const win = window.open("", "_blank");

    win.document.write(`
      <html>
        <head>
          <title>My Bookings Report</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h2 { text-align: center; color: #2F3A56; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
            th { background: #2F3A56; color: white; }
          </style>
        </head>
        <body>
          <h2>My Bookings Report</h2>

          <table>
            <tr>
              <th>Resource ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Purpose</th>
            </tr>

            ${filtered
              .map(
                (b) => `
                  <tr>
                    <td>${b.resourceId}</td>
                    <td>${b.resourceType}</td>
                    <td>${b.status}</td>
                    <td>${b.purpose || "-"}</td>
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

  // =========================
  // STATUS COLORS
  // =========================
  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return { background: "#DCFCE7", color: "#166534" };
      case "REJECTED":
        return { background: "#FEE2E2", color: "#991B1B" };
      case "COMPLETED":
        return { background: "#DBEAFE", color: "#1E3A8A" };
      case "EXPIRED":
        return { background: "#E5E7EB", color: "#374151" };
      default:
        return { background: "#FEF9C3", color: "#854D0E" };
    }
  };

  // =========================
  // STYLES
  // =========================
  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(135deg,#F2F0E6,#EAE6D9)",
      padding: "30px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "Segoe UI"
    },
    header: {
      fontSize: "26px",
      fontWeight: "800",
      color: "#2F3A56"
    },
    sub: {
      color: "#6B7280",
      marginBottom: "15px"
    },
    topBar: {
      display: "flex",
      gap: "10px",
      marginBottom: "20px"
    },
    input: {
      padding: "10px",
      borderRadius: "10px",
      border: "1px solid #C9C2A5",
      width: "200px"
    },
    card: {
      background: "#fff",
      padding: "15px",
      marginTop: "12px",
      width: "540px",
      borderRadius: "14px",
      border: "1px solid #E0DCC8",
      boxShadow: "0 8px 18px rgba(0,0,0,0.06)"
    },
    titleRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    button: {
      padding: "8px 12px",
      background: "#2F3A56",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      marginRight: "5px"
    },
    deleteBtn: {
      padding: "8px 12px",
      background: "#B91C1C",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer"
    },
    badge: {
      padding: "4px 10px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: "700"
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>📋 My Bookings</div>
      <div style={styles.sub}>Manage your reservations</div>

      <button style={styles.button} onClick={() => navigate(-1)}>
        ⬅ Back
      </button>

      {/* SEARCH + FILTER + PDF */}
      <div style={styles.topBar}>
        <input
          style={styles.input}
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          style={styles.input}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="COMPLETED">Completed</option>
          <option value="EXPIRED">Expired</option>
        </select>

        {/* ✅ PDF BUTTON */}
        <button style={styles.button} onClick={downloadPDF}>
          ⬇ Download PDF
        </button>
      </div>

      {/* LIST */}
      {filtered.map((b) => (
        <div key={b.id} style={styles.card}>
          <div style={styles.titleRow}>
            <b>{b.resourceType} - {b.resourceId}</b>

            <span
              style={{
                ...styles.badge,
                ...getStatusStyle(b.status)
              }}
            >
              {b.status}
            </span>
          </div>

          <p>{b.purpose}</p>

          <button
            style={styles.button}
            onClick={() => navigate(`/edit-booking/${b.id}`)}
          >
            Edit
          </button>

          <button
            style={styles.deleteBtn}
            onClick={() => deleteBooking(b.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default MyBookingsPage;