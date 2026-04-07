import React, { useEffect, useState } from "react";
import { getBookings, deleteBooking } from "../services/api";

function ViewBookings() {
    const [data, setData] = useState([]);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        const res = await getBookings();
        setData(res.data);
    };

    return (
        <div>
            <h2>My Bookings</h2>

            {data.map((b) => (
                <div key={b.id}>
                    <p>{b.resourceId} - {b.status}</p>
                    <button onClick={() => deleteBooking(b.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default ViewBookings;
