import { useEffect, useState } from "react";
import API from "../services/api";

function AdminPanel() {
  const [list, setList] = useState([]);

  useEffect(() => {
    API.get("/bookings").then(res => setList(res.data));
  }, []);

  return (
    <div className="container">
      <h2>Admin Panel</h2>

      {list.map(b => (
        <div className="card" key={b.id}>
          <p>{b.userId} - {b.resourceType}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminPanel;
