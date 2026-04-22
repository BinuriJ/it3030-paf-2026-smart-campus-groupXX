// Import React hooks for state management and side effects
import { useState, useEffect } from 'react'

// Import API functions from the api.js file
import { getAllTickets, updateTicketStatus, assignTechnician, deleteTicket, getTicketStats, getComments, addComment } from '../api/api'

function AdminTickets() {
  const adminEmail = 'admin@campus.com'// Hardcoded admin email
  const [tickets, setTickets] = useState([])//stores the list of all tickets fetched from backend
  const [selectedTicket, setSelectedTicket] = useState(null)//stores the ticket the admin clicked on
  const [stats, setStats] = useState(null)//stores first response time, resolution time
  const [comments, setComments] = useState([])//stores all comments for the selected ticket
  const [commentText, setCommentText] = useState('')// what admin is typing in the comment box
  const [techEmail, setTechEmail] = useState('')// which technician is selected in the dropdown
  const [techEmailError, setTechEmailError] = useState('')//validation error message for technician selection
  const [rejectReason, setRejectReason] = useState('')// rejection reason text input
  const [rejectError, setRejectError] = useState('')//validation error message for rejection reason
  const [message, setMessage] = useState('')//success or error message 

  useEffect(() => { loadTickets() }, [])//runs once when the component first loads

  //LOAD ALL TICKETS->Calls GET /api/tickets to fetch all tickets from MongoDB
  const loadTickets = async () => {
    const res = await getAllTickets()
    setTickets(res.data)
  }

  // SELECT A TICKET->Called when admin clicks on a ticket in the list
  //Fetches the service level timer stats and comments for that ticket & Resets all error and message states
  const handleSelect = async (ticket) => {
    setSelectedTicket(ticket)
    setStats(null)
    setMessage('')
    setTechEmailError('')
    setRejectError('')
    setComments([])
    const statsRes = await getTicketStats(ticket.id)// Fetch service level timer for this ticket-> GET /api/tickets/{id}/stats
    setStats(statsRes.data)
    const commentsRes = await getComments(ticket.id)//// Fetch all comments for this ticket-> GET /api/tickets/{id}/comments
    setComments(commentsRes.data)
  }

  //Converts minutes into hour and minute
  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} mins`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours < 24) return mins > 0 ? `${hours} hrs ${mins} mins` : `${hours} hrs`
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    return remainingHours > 0 ? `${days} day${days > 1 ? 's' : ''} ${remainingHours} hrs` : `${days} day${days > 1 ? 's' : ''}`
  }

// UPDATE TICKET STATUS->Calls PUT /api/tickets/{id}/status
  const handleStatus = async (status) => {
    if (status === 'REJECTED') {//Calls PUT /api/tickets/{id}/status
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
      loadTickets()// Refresh ticket list after update
    } catch {
      setMessage('Failed to update status')
    }
  }

  // ASSIGN TECHNICIAN->Calls PUT /api/tickets/{id}/assig
 // Also automatically changes status to IN_PROGRESS in the backend
  const handleAssign = async () => {
    if (!techEmail) {// Validation: must select a technician
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

 // ADD COMMENT->Post button->Calls POST /api/tickets/{id}/comments
  const handleAddComment = async () => {
    if (!commentText.trim()) return
    await addComment(selectedTicket.id, { content: commentText, createdBy: adminEmail })
    setCommentText('')
    const res = await getComments(selectedTicket.id)
    setComments(res.data)
  }

  // DELETE TICKET-> Calls DELETE /api/tickets/{id}
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this ticket?')) return
    await deleteTicket(id)
    setSelectedTicket(null)
    setMessage('Ticket deleted')
    loadTickets()
  }

  // STATUS COLOR
  // OPEN=yellow, IN_PROGRESS=blue, RESOLVED=green, CLOSED=gray, REJECTED=red
  const statusColor = (status) => {
    if (status === 'OPEN') return 'bg-yellow-100 text-yellow-800'
    if (status === 'IN_PROGRESS') return 'bg-blue-100 text-blue-800'
    if (status === 'RESOLVED') return 'bg-green-100 text-green-800'
    if (status === 'CLOSED') return 'bg-gray-100 text-gray-800'
    if (status === 'REJECTED') return 'bg-red-100 text-red-800'
    return ''
  }

  //// RENDER UI-> Message bar, Ticket Detail, Ticket List
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Admin — All Tickets</h2>

      {/* MESSAGE BAR - Shows success or error messages after admin actions */}
      {message && (
        <div className="mb-4 rounded p-3 text-sm"
          style={{ backgroundColor: '#E1D9BC', border: '1px solid #ACBAC4' }}>
          {message}
        </div>
      )}

      {/* Ticket Detail */}
      {selectedTicket && (
        <div className="rounded-lg p-5 shadow-sm mb-6"
          style={{ backgroundColor: 'white', border: '1px solid #ACBAC4' }}>
          <h3 className="font-bold text-lg mb-1">{selectedTicket.title}</h3>
          <p className="text-sm mb-1" style={{ color: '#555' }}>{selectedTicket.description}</p>
          <p className="text-sm">Priority: {selectedTicket.priority}</p>
          <p className="text-sm">Location: {selectedTicket.location}</p>
          <p className="text-sm">Contact: {selectedTicket.contactDetails}</p>
          <p className="text-sm mb-4">Status: {selectedTicket.status}</p>

          {/* Resolution Notes view only */}
          {selectedTicket.resolutionNotes ? (
            <div className="mb-4 rounded p-3"
              style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <p className="text-xs font-semibold mb-1 uppercase">Resolution Notes</p>
              <p className="text-sm" style={{ color: '#166534' }}>{selectedTicket.resolutionNotes}</p>
            </div>
          ) : (
            <div className="mb-4 rounded p-3"
              style={{ backgroundColor: '#F0F0DB', border: '1px solid #ACBAC4' }}>
              <p className="text-xs font-semibold mb-1 uppercase">Resolution Notes</p>
              <p className="text-sm" style={{ color: '#999' }}>No resolution notes yet</p>
            </div>
          )}
          
          {/* LEFT COLUMN - Admin Actions */}
          <div className="grid grid-cols-2 gap-6">
            <div>              {/* STATUS BUTTONS */}
              <p className="text-xs font-semibold mb-2 uppercase">Update Status</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <button onClick={() => handleStatus('IN_PROGRESS')}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700">
                  In Progress
                </button>
                <button onClick={() => handleStatus('CLOSED')}
                  className="bg-gray-600 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-700">
                  Close
                </button>
              </div>

              
              {/* STATUS BUTTONS*/}
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

              {/* ASSIGN TECHNICIAN */}
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

              <button onClick={() => handleDelete(selectedTicket.id)}
                className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 w-full">
                Delete Ticket
              </button>
            </div>

            {/* RIGHT COLUMN - Timer and Comments */}
            <div>
              {stats && (
                <div className="rounded p-3 mb-4 text-sm"
                  style={{ backgroundColor: '#F0F0DB', border: '1px solid #ACBAC4' }}>
                  <h4 className="font-semibold mb-2">Service Level Timer</h4>
                  <p>First Response: {stats.timeToFirstResponseMinutes != null ? formatDuration(stats.timeToFirstResponseMinutes) : 'Not yet'}</p>
                  <p>Resolution Time: {stats.timeToResolutionMinutes != null ? formatDuration(stats.timeToResolutionMinutes) : 'Not yet'}</p>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-3 text-sm">Comments</h4>
                <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                  {comments.length === 0 && (
                    <p className="text-xs" style={{ color: '#999' }}>No comments yet</p>
                  )}
                  {comments.map(c => (
                    <div key={c.id} className="rounded p-3"
                      style={{ backgroundColor: '#F0F0DB', border: '1px solid #ACBAC4' }}>
                      <p className="text-xs font-medium">{c.createdBy}</p>
                      <p className="text-sm">{c.content}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input className="border border-gray-300 rounded p-2 flex-1 text-sm"
                    placeholder="Add a comment..." value={commentText}
                    onChange={e => setCommentText(e.target.value)} />
                  <button onClick={handleAddComment}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket List */}
      <div className="space-y-3">
        {tickets.map(ticket => (
          <div key={ticket.id}
            className="rounded-lg p-4 cursor-pointer shadow-sm hover:opacity-90"
            style={{
              backgroundColor: 'white',
              border: selectedTicket?.id === ticket.id ? '2px solid #30364F' : '1px solid #ACBAC4'
            }}
            onClick={() => handleSelect(ticket)}>
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-sm">{ticket.title}</h4>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
            <p className="text-xs mt-1" style={{ color: '#666' }}>{ticket.category} — {ticket.location}</p>
            <p className="text-xs" style={{ color: '#999' }}>By: {ticket.createdBy}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminTickets