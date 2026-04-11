import { useEffect, useState } from "react";
import API from "../services/api";
import jsPDF from "jspdf";

function MyBookingsPage() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");

  const load = async () => {
    const res = await API.get("/bookings/user/" + localStorage.getItem("userId"));
    setList(res.data);
  };

  useEffect(() => { load(); }, []);

  const deleteBooking = async (id) => {
    await API.delete("/bookings/" + id);
    load();
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    list.forEach((b, i) => {
      doc.text(`${i+1}. ${b.resourceType} - ${b.date}, 10, 10 + i*10`);
    });
    doc.save("bookings.pdf");
  };

  return (
    <div className="container">
      <h2>My Bookings</h2>

      <input placeholder="Search" onChange={e => setSearch(e.target.value)} />

      <button onClick={generatePDF}>Download PDF</button>

      {list.filter(b => b.resourceType.includes(search)).map(b => (
        <div className="card" key={b.id}>
          <p>{b.resourceType} - {b.date}</p>
          <button onClick={() => deleteBooking(b.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default MyBookingsPage;
