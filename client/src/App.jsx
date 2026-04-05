import { BrowserRouter, Routes, Route } from 'react-router-dom'
import StudentTickets from './pages/StudentTickets'
import AdminTickets from './pages/AdminTickets'
import TechnicianTickets from './pages/TechnicianTickets'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<StudentTickets />} />
          <Route path="/admin" element={<AdminTickets />} />
          <Route path="/technician" element={<TechnicianTickets />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App