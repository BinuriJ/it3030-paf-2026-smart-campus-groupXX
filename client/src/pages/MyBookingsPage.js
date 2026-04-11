import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function MyBookingsPage() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editing, setEditing] = useState(null);

  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "u1001";

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

  const deleteBooking = async (id) => {
    await API.delete(`/bookings/${id}`, { params: { userName } });
    load();
  };

  const updateBooking = async () => {
    const payload = {
      resourceType: editing.resourceType,
      resourceId: editing.resourceId,
      purpose: editing.purpose
    };

    await API.put(`/bookings/${editing.id}`, payload, {
      params: { userName }
    });

    setEditing(null);
    load();
  };

  const filtered = (list || [])
    .filter((b) =>
      (b?.resourceType || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((b) =>
      statusFilter === "ALL" ? true : b?.status === statusFilter
    );

  // 🎨 STATUS COLORS
  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return { background: "#DCFCE7", color: "#166534" };
      case "REJECTED":
        return { background: "#FEE2E2", color: "#991B1B" };
      default:
        return { background: "#FEF9C3", color: "#854D0E" };
    }
  };

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
      fontSize: "24px",
      fontWeight: "700",
      color: "#2F3A56",
      marginBottom: "5px"
    },

    sub: {
      color: "#6B7280",
      marginBottom: "20px"
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
      outline: "none",
      width: "200px"
    },

    card: {
      background: "#fff",
      padding: "15px",
      marginTop: "12px",
      width: "520px",
      borderRadius: "14px",
      border: "1px solid #E0DCC8",
      boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
      transition: "0.2s"
    },

    cardHover: {
      transform: "scale(1.01)"
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
      fontWeight: "600"
    },

    editBox: {
      background: "#fff",
      padding: "15px",
      borderRadius: "12px",
      width: "520px",
      border: "1px solid #C9C2A5",
      marginBottom: "15px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>📋 My Bookings</div>
      <div style={styles.sub}>Manage your reservations</div>

      <button style={styles.button} onClick={() => navigate(-1)}>
        ⬅ Back
      </button>

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
        </select>
      </div>

      {editing && (
        <div style={styles.editBox}>
          <h3>Edit Booking</h3>

          <input
            style={styles.input}
            value={editing.resourceType || ""}
            onChange={(e) =>
              setEditing({ ...editing, resourceType: e.target.value })
            }
          />

          <input
            style={styles.input}
            value={editing.resourceId || ""}
            onChange={(e) =>
              setEditing({ ...editing, resourceId: e.target.value })
            }
          />

          <input
            style={styles.input}
            value={editing.purpose || ""}
            onChange={(e) =>
              setEditing({ ...editing, purpose: e.target.value })
            }
          />

          <button style={styles.button} onClick={updateBooking}>
            Save
          </button>

          <button
            style={styles.deleteBtn}
            onClick={() => setEditing(null)}
          >
            Cancel
          </button>
        </div>
      )}

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

          <p style={{ color: "#6B7280" }}>{b.purpose}</p>

          <button style={styles.button} onClick={() => setEditing(b)}>
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