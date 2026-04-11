import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function BookingPage() {
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const [data, setData] = useState({
    resourceType: "",
    resourceId: "",
    purpose: "",
    participants: "",
    startTime: "",
    endTime: ""
  });

  // =========================
  // LOAD RESOURCES
  // =========================
  useEffect(() => {
    API.get("/resources")
      .then((res) => setResources(Array.isArray(res.data) ? res.data : []))
      .catch(() => alert("Failed to load resources"));
  }, []);

  // =========================
  // SUGGEST BEST RESOURCE
  // (ONLY based on capacity + type)
  // =========================
  const suggest = () => {
    const capacity = Number(data.participants || 0);

    const result = (resources || [])
      .filter(
        (r) =>
          (r.type || "").toLowerCase() ===
          (data.resourceType || "").toLowerCase()
      )
      .filter((r) => (r.capacity || 0) >= capacity)
      .sort((a, b) => (a.capacity || 0) - (b.capacity || 0));

    setSuggestions(result);
  };

  // =========================
  // SUBMIT BOOKING
  // =========================
  const submit = async () => {
    if (
      !data.resourceType ||
      !data.resourceId ||
      !data.purpose ||
      !data.participants ||
      !data.startTime ||
      !data.endTime
    ) {
      alert("Please fill all fields");
      return;
    }

    if (new Date(data.endTime) <= new Date(data.startTime)) {
      alert("End time must be after start time");
      return;
    }

    try {
      const payload = {
        resourceType: data.resourceType,
        resourceId: data.resourceId,
        purpose: data.purpose,
        participants: Number(data.participants),
        userName: localStorage.getItem("userName") || "u1001",
        role: localStorage.getItem("role") || "STUDENT",
        status: "PENDING",
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString()
      };

      await API.post("/bookings", payload);

      alert("Booking Created Successfully");
      navigate("/my-bookings");
    } catch (err) {
      console.log(err);
      alert(err.response?.data || "Booking Failed");
    }
  };

  // =========================
  // INLINE STYLES
  // =========================
  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #F2F0E6, #E8E4D9)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "30px",
      fontFamily: "Segoe UI, Arial, sans-serif"
    },

    card: {
      width: "520px",
      background: "#ffffff",
      padding: "30px",
      borderRadius: "16px",
      border: "1px solid #E0DCC8",
      boxShadow: "0 12px 30px rgba(47,58,86,0.12)"
    },

    title: {
      textAlign: "center",
      color: "#2F3A56",
      fontSize: "22px",
      fontWeight: "700",
      marginBottom: "20px"
    },

    input: {
      width: "100%",
      padding: "11px",
      marginBottom: "14px",
      borderRadius: "10px",
      border: "1px solid #C9C2A5",
      outline: "none",
      fontSize: "14px",
      background: "#FAFAF7"
    },

    button: {
      width: "100%",
      padding: "12px",
      background: "#2F3A56",
      color: "white",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "600"
    },

    suggestBtn: {
      width: "100%",
      padding: "12px",
      marginBottom: "10px",
      background: "#4B5A78",
      color: "white",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "600"
    },

    backBtn: {
      width: "100%",
      padding: "12px",
      marginTop: "10px",
      background: "#9AA7B1",
      color: "white",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer"
    },

    suggestionBox: {
      border: "1px solid #E0DCC8",
      padding: "12px",
      marginTop: "8px",
      borderRadius: "10px",
      cursor: "pointer",
      background: "#F9F8F3"
    },

    suggestionTitle: {
      fontWeight: "600",
      color: "#2F3A56"
    },

    hint: {
      fontSize: "12px",
      color: "#6B7280"
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>📅 Smart Booking System</h2>

        {/* PURPOSE */}
        <input
          style={styles.input}
          placeholder="Purpose"
          onChange={(e) =>
            setData({ ...data, purpose: e.target.value })
          }
        />

        {/* PARTICIPANTS */}
        <input
          style={styles.input}
          type="number"
          placeholder="Participants"
          onChange={(e) =>
            setData({ ...data, participants: e.target.value })
          }
        />

        {/* TYPE */}
        <select
          style={styles.input}
          onChange={(e) =>
            setData({ ...data, resourceType: e.target.value })
          }
        >
          <option value="">Select Type</option>
          <option value="Room">Room</option>
          <option value="Lab">Lab</option>
          <option value="Auditorium">Auditorium</option>
        </select>

        {/* SUGGEST */}
        <button style={styles.suggestBtn} onClick={suggest}>
          🧠 Suggest Best Resource
        </button>

        {/* SUGGESTIONS */}
        {suggestions.map((r) => (
          <div
            key={r.id}
            style={styles.suggestionBox}
            onClick={() =>
              setData({
                ...data,
                resourceId: r.name,
                resourceType: r.type
              })
            }
          >
            <div style={styles.suggestionTitle}>{r.name}</div>
            <div style={styles.hint}>
              Capacity: {r.capacity}
            </div>
          </div>
        ))}

        {/* SELECTED */}
        <input
          style={styles.input}
          value={data.resourceId}
          readOnly
          placeholder="Selected Resource"
        />

        {/* TIME */}
        <input
          style={styles.input}
          type="datetime-local"
          onChange={(e) =>
            setData({ ...data, startTime: e.target.value })
          }
        />

        <input
          style={styles.input}
          type="datetime-local"
          onChange={(e) =>
            setData({ ...data, endTime: e.target.value })
          }
        />

        {/* SUBMIT */}
        <button style={styles.button} onClick={submit}>
          Confirm Booking
        </button>

        {/* BACK */}
        <button
          style={styles.backBtn}
          onClick={() => navigate(-1)}
        >
          ⬅ Back
        </button>
      </div>
    </div>
  );
}

export default BookingPage;