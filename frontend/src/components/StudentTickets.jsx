// Import React hooks for state management and side effects
import { useState, useEffect } from 'react'

// Import API functions from api.js
import { createTicket, getMyTickets, addComment, getComments, uploadAttachments, editComment, deleteComment } from '../api/api'

// Predefined category options for the ticket form dropdown
const CATEGORIES = ['EQUIPMENT', 'ELECTRICAL', 'PLUMBING', 'FURNITURE', 'IT', 'OTHER']

// Predefined location options for the ticket form dropdown
const LOCATIONS = ['Lab 1', 'Lab 2', 'Lab 3', 'Lecture Hall A', 'Lecture Hall B', 'Library', 'Cafeteria', 'Office', 'Other']

function StudentTickets() {
  const userEmail = localStorage.getItem('userEmail') || 'student@email.com';
  const [tickets, setTickets] = useState([]) // stores all tickets created by this student
  const [selectedTicket, setSelectedTicket] = useState(null) // stores the ticket the student clicked on
  const [comments, setComments] = useState([]) // stores all comments for the currently selected ticket
  const [commentText, setCommentText] = useState('') // tracks what the student is typing in the comment box
  const [files, setFiles] = useState([]) // stores image files selected for attachment (max 3)
  const [form, setForm] = useState({ // stores all input values for the create ticket form
    title: '', category: '', description: '',
    priority: '', location: '', contactDetails: ''
  })
  const [errors, setErrors] = useState({}) // stores validation error messages for each form field
  const [message, setMessage] = useState('') // shows success or failure message after form submission

  // useEffect runs once when the component first loads
  // Calls loadTickets to fetch this student's tickets from the database
  useEffect(() => { loadTickets() }, [])

  // LOAD MY TICKETS -> Calls GET /api/tickets/my?createdBy=student@email.com
  // Fetches only tickets created by this student
  const loadTickets = async () => {
    try {
      const res = await getMyTickets(userEmail)
      setTickets(res.data)
    } catch {
      setMessage('Failed to load tickets')
    }
  }

  // EMAIL VALIDATION - uses regex to check if contact email format is valid
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  // FORM VALIDATION -> checks all required fields before allowing submission
  // Returns object with error messages - empty object means form is valid
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

  // SUBMIT TICKET -> runs validation -> calls POST /api/tickets to create the ticket
  // If images selected, calls POST /api/tickets/{id}/attachments
  const handleSubmit = async () => {
    const newErrors = validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return // stop if validation fails
    try {
      // Create the ticket
      const res = await createTicket({ ...form, createdBy: userEmail })
      const newTicketId = res.data.id
      // Upload attachments if any images were selected
      if (files.length > 0) await uploadAttachments(newTicketId, files)
      setMessage('Ticket created successfully!')
      setFiles([])
      setErrors({})
      // Reset form to empty state after successful submission
      setForm({ title: '', category: '', description: '', priority: '', location: '', contactDetails: '' })
      loadTickets()
    } catch {
      setMessage('Failed to create ticket')
    }
  }

  // SELECT A TICKET -> called when ticket card in the list is clicked
  // Fetches comments for that ticket -> Calls GET /api/tickets/{id}/comments
  const handleSelectTicket = async (ticket) => {
    setSelectedTicket(ticket)
    const res = await getComments(ticket.id)
    setComments(res.data)
  }

  // ADD COMMENT -> called when student clicks the Post button
  // Calls POST /api/tickets/{id}/comments
  const handleAddComment = async () => {
    if (!commentText.trim()) return // do nothing if comment is empty
    await addComment(selectedTicket.id, { content: commentText, createdBy: userEmail })
    setCommentText('')
    const res = await getComments(selectedTicket.id)
    setComments(res.data)
  }

  // EDIT COMMENT -> called when student clicks Edit on their own comment
  // Ownership rule: only the comment creator can edit it
  // Calls PUT /api/tickets/{ticketId}/comments/{commentId}
  const handleEditComment = async (comment) => {
    const newContent = prompt('Edit your comment:', comment.content)
    if (!newContent || !newContent.trim()) return // cancel if empty
    try {
      await editComment(selectedTicket.id, comment.id, newContent, userEmail)
      const res = await getComments(selectedTicket.id)
      setComments(res.data)
    } catch {
      alert('Could not edit comment. You can only edit your own comments.')
    }
  }

  // DELETE COMMENT -> called when student clicks Delete on their own comment
  // Ownership rule: only the comment creator can delete it
  // Calls DELETE /api/tickets/{ticketId}/comments/{commentId}
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

  // STATUS COLOR -> returns Tailwind CSS classes for color-coded status badges
  // OPEN=yellow, IN_PROGRESS=blue, RESOLVED=green, CLOSED=gray, REJECTED=red
  const statusColor = (status) => {
    if (status === 'OPEN') return 'bg-yellow-100 text-yellow-800'
    if (status === 'IN_PROGRESS') return 'bg-blue-100 text-blue-800'
    if (status === 'RESOLVED') return 'bg-green-100 text-green-800'
    if (status === 'CLOSED') return 'bg-gray-100 text-gray-800'
    if (status === 'REJECTED') return 'bg-red-100 text-red-800'
    return ''
  }

  // INPUT CLASS HELPER -> red border if validation error, gray border if not
  const inputClass = (field) =>
    `border rounded p-2 w-full text-sm focus:outline-none focus:ring-2 ${errors[field] ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`

  // RENDER UI
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Tickets</h2>

      {/* CREATE TICKET FORM
          White card with 2-column grid layout
          Required: title, category, priority, location, contact email
          Optional: description, image attachments */}
      <div className="rounded-lg p-6 mb-6 shadow-sm"
        style={{ backgroundColor: 'white', border: '1px solid #ACBAC4' }}>
        <h3 className="text-lg font-semibold mb-4">Create New Ticket</h3>
        <div className="grid grid-cols-2 gap-4">

          {/* Title - spans full width */}
          <div className="col-span-2">
            <input className={inputClass('title')}
              placeholder="Title *" value={form.title}
              onChange={e => { setForm({ ...form, title: e.target.value }); setErrors({ ...errors, title: '' }) }} />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Category dropdown - predefined options from CATEGORIES array */}
          <div>
            <select className={inputClass('category')} value={form.category}
              onChange={e => { setForm({ ...form, category: e.target.value }); setErrors({ ...errors, category: '' }) }}>
              <option value="">Select Category *</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          {/* Priority dropdown - LOW, MEDIUM, HIGH */}
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

          {/* Location dropdown - predefined options from LOCATIONS array */}
          <div>
            <select className={inputClass('location')} value={form.location}
              onChange={e => { setForm({ ...form, location: e.target.value }); setErrors({ ...errors, location: '' }) }}>
              <option value="">Select Location *</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>

          {/* Contact email - validated with regex */}
          <div>
            <input className={inputClass('contactDetails')}
              placeholder="Contact Email *" value={form.contactDetails}
              onChange={e => { setForm({ ...form, contactDetails: e.target.value }); setErrors({ ...errors, contactDetails: '' }) }} />
            {errors.contactDetails && <p className="text-red-500 text-xs mt-1">{errors.contactDetails}</p>}
          </div>

          {/* Description - optional, spans full width */}
          <div className="col-span-2">
            <textarea className="border border-gray-300 rounded p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Description" rows={3} value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>

          {/* Image attachments - max 3 images, image/* only */}
          <div className="col-span-2">
            <label className="text-sm block mb-1" style={{ color: '#666' }}>Attach Images (max 3)</label>
            <input type="file" accept="image/*" multiple
              className="border border-gray-300 rounded p-2 w-full text-sm"
              onChange={e => { setFiles(Array.from(e.target.files).slice(0, 3)); setErrors({ ...errors, files: '' }) }} />
            {files.length > 0 && <p className="text-xs mt-1" style={{ color: '#666' }}>{files.length} image(s) selected</p>}
            {errors.files && <p className="text-red-500 text-xs mt-1">{errors.files}</p>}
          </div>
        </div>

        {/* Submit button - triggers validation then API call */}
        <button onClick={handleSubmit}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          Submit Ticket
        </button>
        {message && <p className="mt-2 text-sm" style={{ color: '#555' }}>{message}</p>}
      </div>

      {/* TICKET DETAIL SECTION
          Only renders when student has clicked a ticket
          Student can only view - cannot change status */}
      {selectedTicket && (
        <div className="mb-6 rounded-lg p-6 shadow-sm"
          style={{ backgroundColor: 'white', border: '1px solid #ACBAC4' }}>

          {/* Ticket basic information */}
          <h3 className="text-lg font-bold mb-2">{selectedTicket.title}</h3>
          <p className="mb-1" style={{ color: '#555' }}>{selectedTicket.description}</p>
          <p className="text-sm">Priority: {selectedTicket.priority}</p>
          <p className="text-sm">Status: {selectedTicket.status}</p>

          {/* Resolution notes - shown in green when technician has resolved */}
          {selectedTicket.resolutionNotes && (
            <p className="text-sm mt-1" style={{ color: '#166534' }}>Resolution: {selectedTicket.resolutionNotes}</p>
          )}

          {/* Rejection reason - shown in red when admin has rejected */}
          {selectedTicket.rejectionReason && (
            <p className="text-sm mt-1" style={{ color: '#dc2626' }}>Rejected: {selectedTicket.rejectionReason}</p>
          )}

          {/* Attachment count - shows how many images were uploaded */}
          {selectedTicket.attachments?.length > 0 && (
            <p className="text-sm mt-1" style={{ color: '#666' }}>Attachments: {selectedTicket.attachments.length} image(s)</p>
          )}

          {/* COMMENTS SECTION
              Edit and Delete buttons only shown for student's own comments
              Comment ownership enforced in both frontend and backend */}
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Comments</h4>
            <div className="space-y-2 mb-4">
              {comments.map(c => (
                <div key={c.id} className="rounded p-3"
                  style={{ backgroundColor: '#F0F0DB', border: '1px solid #ACBAC4' }}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium">{c.createdBy}</p>
                    {/* Edit and Delete buttons - only shown if comment belongs to this student */}
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

            {/* Comment input box and Post button */}
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

      {/* TICKET LIST
          All tickets by this student as clickable cards
          Selected ticket has darker navy border
          Status badge color changes based on current status */}
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