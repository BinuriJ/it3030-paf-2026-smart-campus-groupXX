import { useState, useEffect } from 'react'
import { getAllTickets, updateTicketStatus, assignTechnician, deleteTicket, addResolutionNotes, getTicketStats } from '../api/api'

function AdminTickets() {
  const [tickets, setTickets] = useState([])
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [stats, setStats] = useState(null)
  const [techEmail, setTechEmail] = useState('')
  const [techEmailError, setTechEmailError] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [rejectError, setRejectError] = useState('')
  const [resolutionNotes, setResolutionNotes] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => { loadTickets() }, [])

  const loadTickets = async () => {
    const res = await getAllTickets()
    setTickets(res.data)
  }

  const handleSelect = async (ticket) => {
    setSelectedTicket(ticket)
    setStats(null)
    setMessage('')
    setTechEmailError('')
    setRejectError('')
    const res = await getTicketStats(ticket.id)
    setStats(res.data)
  }

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} mins`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours < 24) return mins > 0 ? `${hours} hrs ${mins} mins` : `${hours} hrs`
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    return remainingHours > 0 ? `${days} day${days > 1 ? 's' : ''} ${remainingHours} hrs` : `${days} day${days > 1 ? 's' : ''}`
  }

  const handleStatus = async (status) => {
    if (status === 'REJECTED') {
      if (!rejectReason.trim()) {
        setRejectError('Rejection reason is required')
        return
      }
    }
    try {
      await updateTicketStatus(selectedTicket.id, status, rejectReason)
      setMessage(`Status updated to ${status}`)
      setRejectReason('')
      setRejectError('')
      loadTickets()
    } catch {
      setMessage('Failed to update status')
    }
  }

  const handleAssign = async () => {
    if (!techEmail) {
      setTechEmailError('Please select a technician')
      return
    }
    try {
      await assignTechnician(selectedTicket.id, techEmail)
      setMessage(`Assigned to ${techEmail}`)
      setTechEmail('')
      setTechEmailError('')
      loadTickets()
    } catch {
      setMessage('Failed to assign technician')
    }
  }

  const handleResolve = async () => {
    if (!resolutionNotes.trim()) {
      setMessage('Please enter resolution notes')
      return
    }
    try {
      await addResolutionNotes(selectedTicket.id, resolutionNotes)
      setMessage('Resolution notes added')
      setResolutionNotes('')
      loadTickets()
    } catch {
      setMessage('Failed to add notes')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this ticket?')) return
    await deleteTicket(id)
    setSelectedTicket(null)
    setMessage('Ticket deleted')
    loadTickets()
  }

  const statusColor = (status) => {
    if (status === 'OPEN') return 'bg-yellow-100 text-yellow-800'
    if (status === 'IN_PROGRESS') return 'bg-blue-100 text-blue-800'
    if (status === 'RESOLVED') return 'bg-green-100 text-green-800'
    if (status === 'CLOSED') return 'bg-gray-100 text-gray-800'
    if (status === 'REJECTED') return 'bg-red-100 text-red-800'
    return ''
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin — All Tickets</h2>

      {message && (
        <div className="mb-4 bg-gray-100 border border-gray-300 rounded p-3 text-sm text-gray-700">
          {message}
        </div>
      )}

      {/* Ticket Detail shown at top when selected */}
      {selectedTicket && (
        <div className="border border-gray-200 rounded-lg p-5 shadow-sm mb-6">
          <h3 className="font-bold text-lg mb-1">{selectedTicket.title}</h3>
          <p className="text-sm text-gray-600 mb-1">{selectedTicket.description}</p>
          <p className="text-sm text-gray-500">Priority: {selectedTicket.priority}</p>
          <p className="text-sm text-gray-500 mb-4">Status: {selectedTicket.status}</p>

          <div className="grid grid-cols-2 gap-6">
            <div>
              {/* Status Buttons */}
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Update Status</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <button onClick={() => handleStatus('IN_PROGRESS')}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700">
                  In Progress
                </button>
                <button onClick={() => handleStatus('RESOLVED')}
                  className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700">
                  Resolve
                </button>
                <button onClick={() => handleStatus('CLOSED')}
                  className="bg-gray-600 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-700">
                  Close
                </button>
              </div>

              {/* Reject */}
              <div className="mb-4">
                <input
                  className={`border rounded p-2 w-full text-sm mb-1 focus:outline-none focus:ring-2 ${rejectError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                  placeholder="Rejection reason *" value={rejectReason}
                  onChange={e => { setRejectReason(e.target.value); setRejectError('') }} />
                {rejectError && <p className="text-red-500 text-xs mb-1">{rejectError}</p>}
                <button onClick={() => handleStatus('REJECTED')}
                  className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 w-full">
                  Reject
                </button>
              </div>

              {/* Assign Technician */}
              <div className="mb-4">
                <select
                  className={`border rounded p-2 w-full text-sm mb-1 focus:outline-none focus:ring-2 ${techEmailError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                  value={techEmail}
                  onChange={e => { setTechEmail(e.target.value); setTechEmailError('') }}>
                  <option value="">Select Technician *</option>
                  <option value="tech1@campus.com">Tech 1 — tech1@campus.com</option>
                  <option value="tech2@campus.com">Tech 2 — tech2@campus.com</option>
                  <option value="tech3@campus.com">Tech 3 — tech3@campus.com</option>
                </select>
                {techEmailError && <p className="text-red-500 text-xs mb-1">{techEmailError}</p>}
                <button onClick={handleAssign}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 w-full">
                  Assign Technician
                </button>
              </div>
            </div>

            <div>
              {/* Resolution Notes */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Resolution Notes</p>
                <p className="text-xs text-gray-400 mb-2">Describe how the issue was resolved</p>
                <textarea className="border border-gray-300 rounded p-2 w-full text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="e.g. Replaced the projector bulb. Unit is now operational." rows={3} value={resolutionNotes}
                  onChange={e => setResolutionNotes(e.target.value)} />
                <button onClick={handleResolve}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 w-full">
                  Save Resolution Notes
                </button>
              </div>

              {/* Service Level Timer */}
              {stats && (
                <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-4 text-sm">
                  <h4 className="font-semibold text-gray-700 mb-2">Service Level Timer</h4>
                  <p className="text-gray-600">First Response: {stats.timeToFirstResponseMinutes != null ? formatDuration(stats.timeToFirstResponseMinutes) : 'Not yet'}</p>
                  <p className="text-gray-600">Resolution Time: {stats.timeToResolutionMinutes != null ? formatDuration(stats.timeToResolutionMinutes) : 'Not yet'}</p>
                </div>
              )}

              <button onClick={() => handleDelete(selectedTicket.id)}
                className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 w-full">
                Delete Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket List */}
      <div className="space-y-3">
        {tickets.map(ticket => (
          <div key={ticket.id}
            className={`border rounded-lg p-4 cursor-pointer shadow-sm hover:bg-gray-50 ${selectedTicket?.id === ticket.id ? 'border-blue-400' : 'border-gray-200'}`}
            onClick={() => handleSelect(ticket)}>
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-sm">{ticket.title}</h4>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{ticket.category} — {ticket.location}</p>
            <p className="text-xs text-gray-400">By: {ticket.createdBy}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminTickets