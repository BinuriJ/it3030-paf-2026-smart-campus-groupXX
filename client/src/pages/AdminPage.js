import React, { useEffect, useState } from "react";
import { getBookings, updateBooking, deleteBooking } from "../services/api";

function AdminPage() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        const res = await getBookings();
        setData(res.data);
    };

    const filtered = data.filter((b) =>
        b.resourceId.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <h2>Admin Panel</h2>

            <input placeholder="Search"
                onChange={(e) => setSearch(e.target.value)} />

            {filtered.map((b) => (
                <div key={b.id}>
                    <p>{b.resourceId} - {b.status}</p>

                    <button onClick={() => updateBooking(b.id, "APPROVED")}>
                        Approve
                    </button>

                    <button onClick={() => updateBooking(b.id, "REJECTED")}>
                        Reject
                    </button>

                    <button onClick={() => deleteBooking(b.id)}>
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}

export default AdminPage;