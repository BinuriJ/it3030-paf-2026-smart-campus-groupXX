import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import StudentTickets from './components/StudentTickets'
import AdminTickets from './components/AdminTickets'
import TechnicianTickets from './components/TechnicianTickets'

function App() {
  const [role, setRole] = useState('student')

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar role={role} setRole={setRole} />
        <div className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<StudentTickets />} />
            <Route path="/student" element={<StudentTickets />} />
            <Route path="/admin" element={<AdminTickets />} />
            <Route path="/technician" element={<TechnicianTickets />} />
            <Route path="/facilities" element={<div className="text-center mt-20 text-gray-400">Facilities — Coming Soon</div>} />
            <Route path="/bookings" element={<div className="text-center mt-20 text-gray-400">Bookings — Coming Soon</div>} />
            <Route path="/notifications" element={<div className="text-center mt-20 text-gray-400">Notifications — Coming Soon</div>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App