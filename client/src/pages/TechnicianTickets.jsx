import { useState, useEffect } from 'react'
import { getAssignedTickets, updateTicketStatus, addResolutionNotes, addComment, getComments } from '../api/api'

function TechnicianTickets() {
  const techEmail = 'tech1@campus.com'
  const [tickets, setTickets] = useState([])
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [resolutionNotes, setResolutionNotes] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => { loadTickets() }, [])

  const loadTickets = async () => {
    try {
      const res = await getAssignedTickets(techEmail)
      setTickets(res.data)
    } catch {
      setMessage('Failed to load tickets')
    }
  }

  const handleSelect = async (ticket) => {
    setSelectedTicket(ticket)
    setMessage('')
    const res = await getComments(ticket.id)
    setComments(res.data)
  }

  const handleStatus = async (status) => {
    try {
      await updateTicketStatus(selectedTicket.id, status, '')
      setMessage(`Status updated to ${status}`)
      loadTickets()
    } catch {
      setMessage('Failed to update status')
    }
  }

  const handleResolve = async () => {
    if (!resolutionNotes.trim()) {
      setMessage('Please enter resolution notes')
      return
    }
    try {
      await addResolutionNotes(selectedTicket.id, resolutionNotes)
      setMessage('Resolution notes saved')
      setResolutionNotes('')
      loadTickets()
    } catch {
      setMessage('Failed to add notes')
    }
  }

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      setMessage('Please enter a comment')
      return
    }
    await addComment(selectedTicket.id, { content: commentText, createdBy: techEmail })
    setCommentText('')
    setMessage('')
    const res = await getComments(selectedTicket.id)
    setComments(res.data)
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Technician — My Assigned Tickets</h2>

      {message && (
        <div className="mb-4 bg-gray-100 border border-gray-300 rounded p-3 text-sm text-gray-700">
          {message}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Ticket List */}
        <div className="space-y-3">
          {tickets.length === 0 && (
            <p className="text-gray-500 text-sm">No tickets assigned to you yet.</p>
          )}
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

        {/* Ticket Detail */}
        {selectedTicket && (
          <div className="border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-lg mb-1">{selectedTicket.title}</h3>
            <p className="text-sm text-gray-600 mb-1">{selectedTicket.description}</p>
            <p className="text-sm text-gray-500">Priority: {selectedTicket.priority}</p>
            <p className="text-sm text-gray-500">Location: {selectedTicket.location}</p>
            <p className="text-sm text-gray-500">Contact: {selectedTicket.contactDetails}</p>
            <p className="text-sm text-gray-500 mb-4">Status: {selectedTicket.status}</p>

            {/* Status Buttons — technician can only mark In Progress or Resolved */}
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Update Status</p>
            <div className="flex gap-2 mb-4">
              <button onClick={() => handleStatus('IN_PROGRESS')}
                className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700">
                In Progress
              </button>
              <button onClick={() => handleStatus('RESOLVED')}
                className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700">
                Mark Resolved
              </button>
            </div>

            {/* Resolution Notes */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">Resolution Notes</p>
              <p className="text-xs text-gray-400 mb-2">Describe how you fixed the issue</p>
              <textarea className="border border-gray-300 rounded p-2 w-full text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="e.g. Replaced the projector bulb. Unit is now operational." rows={3} value={resolutionNotes}
                onChange={e => setResolutionNotes(e.target.value)} />
              <button onClick={handleResolve}
                className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 w-full">
                Save Resolution Notes
              </button>
            </div>

            {/* Comments — shows all comments including student's */}
            <div className="mt-4">
              <h4 className="font-semibold mb-3 text-gray-700 text-sm">Comments</h4>
              <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                {comments.length === 0 && (
                  <p className="text-xs text-gray-400">No comments yet</p>
                )}
                {comments.map(c => (
                  <div key={c.id} className="bg-gray-50 border border-gray-200 rounded p-3">
                    <p className="text-xs font-medium text-gray-700">{c.createdBy}</p>
                    <p className="text-sm text-gray-600">{c.content}</p>
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
        )}
      </div>
    </div>
  )
}

export default TechnicianTickets