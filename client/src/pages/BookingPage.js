import { useState } from "react";
import API from "../services/api";

function BookingPage() {
  const [data, setData] = useState({
    resourceType: "",
    resourceId: "",
    purpose: "",
    participants: "",
    startTime: "",
    endTime: ""
  });

  const resourceTypes = ["Room", "Lab", "Auditorium"];

  const resourceIds = {
    Room: ["R101", "R102", "R103"],
    Lab: ["L201", "L202", "L203"],
    Auditorium: ["A001", "A002"]
  };

  const submit = async () => {
    try {
      await API.post("/bookings", {
        ...data,
        participants: Number(data.participants),

        // 🔥 must match backend fields
        userName: localStorage.getItem("userName"),
        role: localStorage.getItem("role"),

        status: "PENDING"
      });

      alert("Booking Created Successfully");
    } catch (err) {
      console.log(err);
      alert("Error creating booking");
    }
  };

  const styles = {
    page: {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#F2F0E6"
    },
    card: {
      background: "#fff",
      padding: "30px",
      borderRadius: "14px",
      width: "420px",
      boxShadow: "0 10px 25px rgba(47,58,86,0.15)",
      border: "1px solid #C9C2A5"
    },
    title: {
      textAlign: "center",
      color: "#2F3A56",
      marginBottom: "20px"
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "12px",
      borderRadius: "8px",
      border: "1px solid #9AA7B1",
      outline: "none"
    },
    button: {
      width: "100%",
      padding: "12px",
      background: "#2F3A56",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontWeight: "bold",
      cursor: "pointer"
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>📅 Create Booking</h2>

        {/* Resource Type */}
        <select
          style={styles.input}
          value={data.resourceType}
          onChange={(e) =>
            setData({
              ...data,
              resourceType: e.target.value,
              resourceId: ""
            })
          }
        >
          <option value="">Select Resource Type</option>
          {resourceTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>

        {/* Resource ID */}
        <select
          style={styles.input}
          value={data.resourceId}
          onChange={(e) =>
            setData({ ...data, resourceId: e.target.value })
          }
          disabled={!data.resourceType}
        >
          <option value="">Select Resource ID</option>
          {data.resourceType &&
            resourceIds[data.resourceType].map((id) => (
              <option key={id}>{id}</option>
            ))}
        </select>

        {/* Purpose */}
        <input
          style={styles.input}
          placeholder="Purpose"
          onChange={(e) =>
            setData({ ...data, purpose: e.target.value })
          }
        />

        {/* Participants */}
        <input
          style={styles.input}
          type="number"
          placeholder="Participants"
          onChange={(e) =>
            setData({ ...data, participants: e.target.value })
          }
        />

        {/* Start Time */}
        <input
          style={styles.input}
          type="datetime-local"
          onChange={(e) =>
            setData({ ...data, startTime: e.target.value })
          }
        />

        {/* End Time */}
        <input
          style={styles.input}
          type="datetime-local"
          onChange={(e) =>
            setData({ ...data, endTime: e.target.value })
          }
        />

        <button style={styles.button} onClick={submit}>
          Submit Booking
        </button>
      </div>
    </div>
  );
}

export default BookingPage;