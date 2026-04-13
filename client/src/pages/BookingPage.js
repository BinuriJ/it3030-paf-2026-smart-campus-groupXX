import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";

function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // =========================
  // EDIT MODE DETECTION
  // =========================
  const editData = location.state || null;
  const isEdit = !!editData;

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
      .then((res) =>
        setResources(Array.isArray(res.data) ? res.data : [])
      )
      .catch(() => alert("Failed to load resources"));
  }, []);

  // =========================
  // PREFILL WHEN EDITING
  // =========================
  useEffect(() => {
    if (editData) {
      setData({
        resourceType: editData.resourceType || "",
        resourceId: editData.resourceId || "",
        purpose: editData.purpose || "",
        participants: editData.participants || "",
        startTime: editData.startTime?.slice(0, 16) || "",
        endTime: editData.endTime?.slice(0, 16) || ""
      });
    }
  }, [editData]);

  // =========================
  // SUGGEST RESOURCES
  // =========================
  const suggest = () => {
    const capacity = Number(data.participants || 0);

    const result = resources
      .filter(
        (r) =>
          (r.type || "").toLowerCase() ===
          (data.resourceType || "").toLowerCase()
      )
      .filter((r) => (r.capacity || 0) >= capacity)
      .sort((a, b) => a.capacity - b.capacity);

    setSuggestions(result);
  };

  // =========================
  // VALIDATION + CONFLICT CHECK
  // =========================
  const validate = () => {
    if (
      !data.resourceType ||
      !data.resourceId ||
      !data.purpose ||
      !data.participants ||
      !data.startTime ||
      !data.endTime
    ) {
      alert("Please fill all fields");
      return false;
    }

    if (new Date(data.endTime) <= new Date(data.startTime)) {
      alert("End time must be after start time");
      return false;
    }

    return true;
  };

  // =========================
  // SUBMIT (CREATE OR UPDATE)
  // =========================
  const submit = async () => {
    if (!validate()) return;

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

    try {
      if (isEdit) {
        await API.put(`/bookings/${editData.id}`, payload, {
          params: { userName: payload.userName }
        });
        alert("Booking Updated Successfully");
      } else {
        await API.post("/bookings", payload);
        alert("Booking Created Successfully");
      }

      // RESET FORM AFTER SUCCESS
      setData({
        resourceType: "",
        resourceId: "",
        purpose: "",
        participants: "",
        startTime: "",
        endTime: ""
      });

      setSuggestions([]);

      navigate("/my-bookings");
    } catch (err) {
      console.log(err);
      alert(err.response?.data || "Operation failed");
    }
  };

  // =========================
  // UI
  // =========================
  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #F2F0E6, #E8E4D9)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "30px",
      fontFamily: "Segoe UI"
    },

    card: {
      width: "520px",
      background: "#fff",
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
      fontSize: "14px"
    },

    button: {
      width: "100%",
      padding: "12px",
      background: "#2F3A56",
      color: "white",
      border: "none",
      borderRadius: "10px",
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
      fontWeight: "600"
    },

    backBtn: {
      width: "100%",
      padding: "12px",
      marginTop: "10px",
      background: "#9AA7B1",
      color: "white",
      border: "none",
      borderRadius: "10px"
    },

    suggestionBox: {
      border: "1px solid #E0DCC8",
      padding: "12px",
      marginTop: "8px",
      borderRadius: "10px",
      cursor: "pointer",
      background: "#F9F8F3"
    },

    hint: {
      fontSize: "12px",
      color: "#6B7280"
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          {isEdit ? "✏️ Edit Booking" : "📅 Booking System "}
        </h2>

        <input
          style={styles.input}
          placeholder="Purpose"
          value={data.purpose}
          onChange={(e) =>
            setData({ ...data, purpose: e.target.value })
          }
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Participants"
          value={data.participants}
          onChange={(e) =>
            setData({ ...data, participants: e.target.value })
          }
        />

        <select
          style={styles.input}
          value={data.resourceType}
          onChange={(e) =>
            setData({ ...data, resourceType: e.target.value })
          }
        >
          <option value="">Select Type</option>
          <option value="Room">Room</option>
          <option value="Lab">Lab</option>
          <option value="Auditorium">Auditorium</option>
        </select>

        <button style={styles.suggestBtn} onClick={suggest}>
          🧠 Suggest Best Resource
        </button>

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
            <b>{r.name}</b>
            <div style={styles.hint}>Capacity: {r.capacity}</div>
          </div>
        ))}

        <input
          style={styles.input}
          value={data.resourceId}
          readOnly
          placeholder="Selected Resource"
        />

        <input
          style={styles.input}
          type="datetime-local"
          value={data.startTime}
          onChange={(e) =>
            setData({ ...data, startTime: e.target.value })
          }
        />

        <input
          style={styles.input}
          type="datetime-local"
          value={data.endTime}
          onChange={(e) =>
            setData({ ...data, endTime: e.target.value })
          }
        />

        <button style={styles.button} onClick={submit}>
          {isEdit ? "Update Booking" : "Confirm Booking"}
        </button>

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