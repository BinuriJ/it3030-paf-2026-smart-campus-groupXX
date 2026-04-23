import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const roleConfig = {
  student: {
    label: 'Student',
    initial: 'S',
    color: '#2563eb',
    links: [
      { name: 'My Tickets', path: '/student' },
      { name: 'Notifications', path: '/notifications' },
    ]
  },
  lecturer: {
    label: 'Lecturer',
    initial: 'L',
    color: '#9333ea',
    links: [
      { name: 'Bookings', path: '/bookings' },
      { name: 'Notifications', path: '/notifications' },
    ]
  },
  technician: {
    label: 'Technician',
    initial: 'T',
    color: '#f97316',
    links: [
      { name: 'My Assigned Tickets', path: '/technician' },
      { name: 'Notifications', path: '/notifications' },
    ]
  },
  admin: {
    label: 'Admin',
    initial: 'A',
    color: '#dc2626',
    links: [
      { name: 'All Tickets', path: '/admin' },
      { name: 'Facilities', path: '/facilities' },
      { name: 'Bookings', path: '/bookings' },
      { name: 'Notifications', path: '/notifications' },
    ]
  }
}

function Navbar({ role, setRole }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const current = roleConfig[role]

  const handleRoleChange = (newRole) => {
    setRole(newRole)
    setDropdownOpen(false)
    navigate(roleConfig[newRole].links[0].path)
  }

  return (
    <nav style={{ backgroundColor: '#30364F' }} className="px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold" style={{ color: 'white' }}>Smart Campus</h1>

      <div className="flex gap-6">
        {current.links.map(link => (
          <Link key={link.path} to={link.path}
            className="font-medium text-sm hover:opacity-75"
            style={{ color: '#ACBAC4' }}>
            {link.name}
          </Link>
        ))}
      </div>

      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          className="flex items-center gap-2">
          <div style={{
            backgroundColor: current.color,
            color: 'white',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {current.initial}
          </div>
          <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>
            {current.label}
          </span>
          <span style={{ color: '#ACBAC4', fontSize: '12px' }}>▼</span>
        </button>

        {dropdownOpen && (
          <div style={{
            position: 'absolute',
            right: 0,
            marginTop: '8px',
            width: '176px',
            backgroundColor: 'white',
            border: '1px solid #ACBAC4',
            borderRadius: '6px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 50
          }}>
            {Object.entries(roleConfig).map(([key, val]) => (
              <div key={key}
                onClick={() => handleRoleChange(key)}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: '#111827',
                  fontWeight: role === key ? '600' : '400',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <div style={{
                  backgroundColor: val.color,
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  {val.initial}
                </div>
                <span style={{ color: '#111827' }}>{val.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar