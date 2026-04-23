import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoginPage from './pages/LoginPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import StudentTickets from './components/StudentTickets'
import AdminTickets from './components/AdminTickets'
import TechnicianTickets from './components/TechnicianTickets'
import ModernResourceBooking from './components/ModernResourceBooking'
import MyBookingsPage from './components/MyBookingsPage'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import AdminDashboard from './components/AdminDashboard'
import BookingAdminPanel from './components/BookingAdminPanel'
import { useState } from 'react';

// A simple wrapper to conditionally render ticket component based on role
function TicketsRouter() {
  const role = localStorage.getItem('role') || 'student';
  if (role === 'admin') return <AdminTickets />;
  if (role === 'technician') return <TechnicianTickets />;
  return <StudentTickets />;
}

// Layout for pages that need navbar/footer
function AuthenticatedLayout({ children }) {
  const role = localStorage.getItem('role') || 'student';
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}

// Admin wrapper for multi-tabs
function AdminTabsWrapper() {
  const [activeTab, setActiveTab] = useState('resources');
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Admin';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky Admin Nav */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <span className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">Smart Campus — Admin</span>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${
                activeTab === 'resources'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => setActiveTab('resources')}
            >
              🏛️ Facility Management
            </button>
            <button
              className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${
                activeTab === 'bookings'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => setActiveTab('bookings')}
            >
              📋 Booking Approvals
            </button>
          </div>

          {/* User + Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-800">{userName}</span>
              <span className="text-xs font-semibold text-slate-400">Administrator</span>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              ← Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Tab Content — no extra padding, each page manages its own */}
      <div className="w-full">
        {activeTab === 'resources' ? <AdminDashboard /> : <BookingAdminPanel />}
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public Login Route */}
          <Route path="/" element={<LoginPage />} />
          
          {/* Dashboard Home */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Tickets workflow */}
          <Route 
            path="/tickets" 
            element={
              <AuthenticatedLayout>
                 <div className="p-6">
                    <TicketsRouter />
                 </div>
              </AuthenticatedLayout>
            } 
          />
          
          {/* Facilities / Booking workflow */}
          <Route 
            path="/facilities" 
            element={
              <AuthenticatedLayout>
                 <ModernResourceBooking />
              </AuthenticatedLayout>
            } 
          />

           {/* User's past/current bookings workflow */}
           <Route 
            path="/bookings" 
            element={
              <AuthenticatedLayout>
                 <MyBookingsPage />
              </AuthenticatedLayout>
            } 
          />

          {/* Admin Workflow - AdminTabsWrapper manages its own full layout */}
          <Route 
            path="/admin" 
            element={<AdminTabsWrapper />} 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
