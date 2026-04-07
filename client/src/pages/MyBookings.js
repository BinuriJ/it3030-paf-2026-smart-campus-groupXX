
import { useEffect, useState } from "react";
import { getBookings, deleteBooking } from "../services/api";

function MyBookings() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        getBookings().then(res => setBookings(res.data));
    };

    const handleDelete = (id) => {
        deleteBooking(id).then(fetchData);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>My Bookings</h2>

            {bookings.map(b => (
                <div key={b.id} style={card}>
                    <p><b>Resource:</b> {b.resourceId}</p>
                    <p><b>User:</b> {b.userName}</p>
                    <p><b>Status:</b> {b.status}</p>

                    <button onClick={() => handleDelete(b.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

const card = {
    border: "1px solid #ccc",
    padding: "10px",
    margin: "10px"
};

export default MyBookings;