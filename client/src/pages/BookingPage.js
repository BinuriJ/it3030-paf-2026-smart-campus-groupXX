import React, { useState } from "react";
import { createBooking, getSuggestions } from "../services/api";

function BookingPage() {
    const [form, setForm] = useState({
        resourceId: "",
        userName: "",
        role: "STUDENT",
        date: "",
        startTime: "",
        endTime: "",
    });

    const [suggestions, setSuggestions] = useState([]);

    const handleSubmit = async () => {
        try {
            await createBooking(form);
            alert("Booking Created!");
        } catch (err) {
            alert("Error creating booking");
        }
    };

    const checkSuggestions = async () => {
        try {
            const res = await getSuggestions(
                form.resourceId,
                form.startTime,
                form.endTime
            );
            setSuggestions(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <h2>Booking Page</h2>

            <input placeholder="Resource ID"
                onChange={(e) => setForm({ ...form, resourceId: e.target.value })} />

            <input placeholder="User Name"
                onChange={(e) => setForm({ ...form, userName: e.target.value })} />

            <select onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="STUDENT">Student</option>
                <option value="LECTURER">Lecturer</option>
            </select>

            <input type="date"
                onChange={(e) => setForm({ ...form, date: e.target.value })} />

            <input type="time"
                onChange={(e) => setForm({ ...form, startTime: e.target.value })} />

            <input type="time"
                onChange={(e) => setForm({ ...form, endTime: e.target.value })} />

            <br /><br />

            <button onClick={checkSuggestions}>Check Availability</button>
            <button onClick={handleSubmit}>Book</button>

            <h3>Suggestions:</h3>
            {suggestions.map((s, i) => (
                <p key={i}>{s}</p>
            ))}
        </div>
    );
}

export default BookingPage;
