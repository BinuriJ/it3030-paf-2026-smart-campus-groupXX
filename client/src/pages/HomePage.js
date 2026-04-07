import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h1>Campus Booking System</h1>

            <button onClick={() => navigate("/booking")} style={btn}>
                Go to Booking Page
            </button>

            <br /><br />

            <button onClick={() => navigate("/mybookings")} style={btn}>
                View My Bookings
            </button>

            <br /><br />

            <button onClick={() => navigate("/admin")} style={btn}>
                Admin Panel
            </button>
        </div>
    );
}

const btn = {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer"
};

export default HomePage;
