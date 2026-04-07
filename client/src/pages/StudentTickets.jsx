import { useState, useEffect } from 'react'
import { createTicket, getMyTickets, addComment, getComments, uploadAttachments, editComment, deleteComment } from '../api/api'

const CATEGORIES = ['EQUIPMENT', 'ELECTRICAL', 'PLUMBING', 'FURNITURE', 'IT', 'OTHER']
const LOCATIONS = ['Lab 1', 'Lab 2', 'Lab 3', 'Lecture Hall A', 'Lecture Hall B', 'Library', 'Cafeteria', 'Office', 'Other']

function StudentTickets() {
  const userEmail = 'student@email.com'
  const [tickets, setTickets] = useState([])
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [files, setFiles] = useState([])
  const [form, setForm] = useState({
    title: '', category: '', description: '',
    priority: '', location: '', contactDetails: ''
  })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  useEffect(() => { loadTickets() }, [])

  const loadTickets = async () => {
    try {
      const res = await getMyTickets(userEmail)
      setTickets(res.data)
    } catch {
      setMessage('Failed to load tickets')
    }
  }

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const validate = () => {
    const newErrors = {}
    if (!form.title.trim()) newErrors.title = 'Title is required'
    if (!form.category) newErrors.category = 'Category is required'
    if (!form.priority) newErrors.priority = 'Priority is required'
    if (!form.location) newErrors.location = 'Location is required'
    if (!form.contactDetails.trim()) {
      newErrors.contactDetails = 'Contact email is required'
    } else if (!isValidEmail(form.contactDetails)) {
      newErrors.contactDetails = 'Please enter a valid email address'
    }
    if (files.length > 3) newErrors.files = 'Maximum 3 images allowed'
    return newErrors
  }

  const handleSubmit = async () => {
    const newErrors = validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return
    try {
      const res = await createTicket({ ...form, createdBy: userEmail })
      const newTicketId = res.data.id
      if (files.length > 0) await uploadAttachments(newTicketId, files)
      setMessage('Ticket created successfully!')
      setFiles([])
      setErrors({})
      setForm({ title: '', category: '', description: '', priority: '', location: '', contactDetails: '' })
      loadTickets()
    } catch {
      setMessage('Failed to create ticket')
    }
  }

  const handleSelectTicket = async (ticket) => {
    setSelectedTicket(ticket)
    const res = await getComments(ticket.id)
    setComments(res.data)
  }

  const handleAddComment = async () => {
    if (!commentText.trim()) return
    await addComment(selectedTicket.id, { content: commentText, createdBy: userEmail })
    setCommentText('')
    const res = await getComments(selectedTicket.id)
    setComments(res.data)
  }

  const handleEditComment = async (comment) => {
    const newContent = prompt('Edit your comment:', comment.content)
    if (!newContent || !newContent.trim()) return
    try {
      await editComment(selectedTicket.id, comment.id, newContent, userEmail)
      const res = await getComments(selectedTicket.id)
      setComments(res.data)
    } catch {
      alert('Could not edit comment. You can only edit your own comments.')
    }
  }

  const handleDeleteComment = async (comment) => {
    if (!window.confirm('Delete this comment?')) return
    try {
      await deleteComment(selectedTicket.id, comment.id, userEmail)
      const res = await getComments(selectedTicket.id)
      setComments(res.data)
    } catch {
      alert('Could not delete comment. You can only delete your own comments.')
    }
  }

  const statusColor = (status) => {
    if (status === 'OPEN') return 'bg-yellow-100 text-yellow-800'
    if (status === 'IN_PROGRESS') return 'bg-blue-100 text-blue-800'
    if (status === 'RESOLVED') return 'bg-green-100 text-green-800'
    if (status === 'CLOSED') return 'bg-gray-100 text-gray-800'
    if (status === 'REJECTED') return 'bg-red-100 text-red-800'
    return ''
  }

  const inputClass = (field) =>
    `border rounded p-2 w-full text-sm focus:outline-none focus:ring-2 ${errors[field] ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Tickets</h2>

      {/* Create Ticket Form */}
      <div className="rounded-lg p-6 mb-6 shadow-sm"
        style={{ backgroundColor: 'white', border: '1px solid #ACBAC4' }}>
        <h3 className="text-lg font-semibold mb-4">Create New Ticket</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <input className={inputClass('title')}
              placeholder="Title *" value={form.title}
              onChange={e => { setForm({ ...form, title: e.target.value }); setErrors({ ...errors, title: '' }) }} />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>
          <div>
            <select className={inputClass('category')} value={form.category}
              onChange={e => { setForm({ ...form, category: e.target.value }); setErrors({ ...errors, category: '' }) }}>
              <option value="">Select Category *</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>
          <div>
            <select className={inputClass('priority')} value={form.priority}
              onChange={e => { setForm({ ...form, priority: e.target.value }); setErrors({ ...errors, priority: '' }) }}>
              <option value="">Select Priority *</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
            {errors.priority && <p className="text-red-500 text-xs mt-1">{errors.priority}</p>}
          </div>
          <div>
            <select className={inputClass('location')} value={form.location}
              onChange={e => { setForm({ ...form, location: e.target.value }); setErrors({ ...errors, location: '' }) }}>
              <option value="">Select Location *</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>
          <div>
            <input className={inputClass('contactDetails')}
              placeholder="Contact Email *" value={form.contactDetails}
              onChange={e => { setForm({ ...form, contactDetails: e.target.value }); setErrors({ ...errors, contactDetails: '' }) }} />
            {errors.contactDetails && <p className="text-red-500 text-xs mt-1">{errors.contactDetails}</p>}
          </div>
          <div className="col-span-2">
            <textarea className="border border-gray-300 rounded p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Description" rows={3} value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="col-span-2">
            <label className="text-sm block mb-1" style={{ color: '#666' }}>Attach Images (max 3)</label>
            <input type="file" accept="image/*" multiple
              className="border border-gray-300 rounded p-2 w-full text-sm"
              onChange={e => { setFiles(Array.from(e.target.files).slice(0, 3)); setErrors({ ...errors, files: '' }) }} />
            {files.length > 0 && <p className="text-xs mt-1" style={{ color: '#666' }}>{files.length} image(s) selected</p>}
            {errors.files && <p className="text-red-500 text-xs mt-1">{errors.files}</p>}
          </div>
        </div>
        <button onClick={handleSubmit}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          Submit Ticket
        </button>
        {message && <p className="mt-2 text-sm" style={{ color: '#555' }}>{message}</p>}
      </div>

      {/* Ticket Detail */}
      {selectedTicket && (
        <div className="mb-6 rounded-lg p-6 shadow-sm"
          style={{ backgroundColor: 'white', border: '1px solid #ACBAC4' }}>
          <h3 className="text-lg font-bold mb-2">{selectedTicket.title}</h3>
          <p className="mb-1" style={{ color: '#555' }}>{selectedTicket.description}</p>
          <p className="text-sm">Priority: {selectedTicket.priority}</p>
          <p className="text-sm">Status: {selectedTicket.status}</p>
          {selectedTicket.resolutionNotes && (
            <p className="text-sm mt-1" style={{ color: '#166534' }}>Resolution: {selectedTicket.resolutionNotes}</p>
          )}
          {selectedTicket.rejectionReason && (
            <p className="text-sm mt-1" style={{ color: '#dc2626' }}>Rejected: {selectedTicket.rejectionReason}</p>
          )}
          {selectedTicket.attachments?.length > 0 && (
            <p className="text-sm mt-1" style={{ color: '#666' }}>Attachments: {selectedTicket.attachments.length} image(s)</p>
          )}

          <div className="mt-6">
            <h4 className="font-semibold mb-3">Comments</h4>
            <div className="space-y-2 mb-4">
              {comments.map(c => (
                <div key={c.id} className="rounded p-3"
                  style={{ backgroundColor: '#F0F0DB', border: '1px solid #ACBAC4' }}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium">{c.createdBy}</p>
                    {c.createdBy === userEmail && (
                      <div className="flex gap-2">
                        <button onClick={() => handleEditComment(c)}
                          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteComment(c)}
                          className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-sm">{c.content}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="border border-gray-300 rounded p-2 flex-1 text-sm"
                placeholder="Add a comment..." value={commentText}
                onChange={e => setCommentText(e.target.value)} />
              <button onClick={handleAddComment}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Post
              </button>
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
            onClick={() => handleSelectTicket(ticket)}>
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">{ticket.title}</h4>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
            <p className="text-sm mt-1" style={{ color: '#666' }}>{ticket.category} — {ticket.location}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StudentTickets