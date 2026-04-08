import { useMemo, useState } from 'react';

const categories = [
  {
    id: 'All',
    name: 'All Resources',
    description: 'Browse all available campus spaces and equipment.',
  },
  {
    id: 'Lecture Hall',
    name: 'Lecture Halls',
    description: 'Spacious audit rooms for lectures and presentations.',
  },
  {
    id: 'Lab',
    name: 'Laboratories',
    description: 'Fully equipped labs for practical sessions.',
  },
  {
    id: 'Meeting Room',
    name: 'Meeting Rooms',
    description: 'Private rooms for small teams and discussions.',
  },
  {
    id: 'Equipment',
    name: 'Equipment',
    description: 'Specialized tools and devices for campus projects.',
  },
];

const defaultSlots = [
  { id: '8-10', label: '8:00 AM - 10:00 AM', startTime: '08:00', endTime: '10:00' },
  { id: '10-12', label: '10:00 AM - 12:00 PM', startTime: '10:00', endTime: '12:00' },
  { id: '12-14', label: '12:00 PM - 2:00 PM', startTime: '12:00', endTime: '14:00' },
  { id: '14-16', label: '2:00 PM - 4:00 PM', startTime: '14:00', endTime: '16:00' },
  { id: '16-18', label: '4:00 PM - 6:00 PM', startTime: '16:00', endTime: '18:00' },
];

function ModernResourceBooking({ resources = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Lecture Hall');
  const [selectedResource, setSelectedResource] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    date: '',
    purpose: '',
    attendees: 1,
    studentName: '',
    studentEmail: '',
    studentPhone: '',
    agreeTerms: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [bookingMessage, setBookingMessage] = useState('');

  const filteredResources = useMemo(() => {
    let filtered = resources;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((resource) => resource.type === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((resource) =>
        resource.name.toLowerCase().includes(query) ||
        (resource.location || '').toLowerCase().includes(query) ||
        (resource.description || '').toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [resources, selectedCategory, searchQuery]);

  const resourcesByCategory = useMemo(() => {
    return categories
      .filter((category) => category.id === 'All' || filteredResources.some((resource) => resource.type === category.id))
      .map((category) => ({
        ...category,
        resources:
          category.id === 'All'
            ? filteredResources
            : filteredResources.filter((resource) => resource.type === category.id),
      }))
      .filter((category) => category.resources.length > 0);
  }, [filteredResources]);

  const openBooking = (resource) => {
    setSelectedResource(resource);
    setShowBookingModal(true);
    setSelectedSlot(null);
    setBookingForm({
      date: '',
      purpose: '',
      attendees: 1,
      studentName: '',
      studentEmail: '',
      studentPhone: '',
      agreeTerms: false,
    });
    setFormErrors({});
    setTouched({});
  };

  const validateField = (field, value) => {
    if (field === 'studentName') {
      if (!value.trim()) return 'Please enter your name';
      if (value.trim().length < 3) return 'Name should have at least 3 characters';
    }
    if (field === 'studentEmail') {
      if (!value.trim()) return 'Please enter your email';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email';
    }
    if (field === 'studentPhone') {
      if (!value.trim()) return 'Please enter your phone number';
    }
    if (field === 'date') {
      if (!value) return 'Please select a date';
    }
    if (field === 'purpose') {
      if (!value.trim()) return 'Please describe your purpose';
      if (value.trim().length < 10) return 'Write at least 10 characters';
    }
    if (field === 'attendees') {
      if (!value || value < 1) return 'Enter at least 1 attendee';
      if (selectedResource && value > selectedResource.capacity) return `Max capacity is ${selectedResource.capacity}`;
    }
    if (field === 'agreeTerms') {
      if (!value) return 'You must agree to the terms';
    }
    return '';
  };

  const handleInputChange = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setFormErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, bookingForm[field]);
    setFormErrors((prev) => ({ ...prev, [field]: error }));
  };

  const toggleSlot = (slot) => {
    if (selectedSlot?.id === slot.id) {
      setSelectedSlot(null);
      return;
    }
    setSelectedSlot(slot);
  };

  const submitBooking = () => {
    const fields = ['studentName', 'studentEmail', 'studentPhone', 'date', 'purpose', 'attendees', 'agreeTerms'];
    const newErrors = {};
    fields.forEach((field) => {
      const error = validateField(field, bookingForm[field]);
      if (error) newErrors[field] = error;
    });
    if (!selectedSlot) newErrors.slot = 'Please select a time slot';
    setFormErrors(newErrors);
    setTouched(fields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));

    if (Object.keys(newErrors).length > 0) return;

    setBookingMessage(`Booking request sent for ${selectedResource.name} on ${bookingForm.date} at ${selectedSlot.label}.`);
    setShowBookingModal(false);
    setSelectedSlot(null);
  };

  return (
    <div className="modern-booking-shell">
      <section className="modern-hero">
        <div className="hero-copy">
          <span className="hero-tag">Student Booking</span>
          <h1>Reserve campus facilities in minutes</h1>
          <p>Choose from lecture halls, labs, meeting rooms, and equipment with a modern, category-based view.</p>
        </div>

        <div className="hero-tracker">
          <div>
            <strong>{resources.length}</strong>
            <span>Available resources</span>
          </div>
          <div>
            <strong>{filteredResources.length}</strong>
            <span>Filtered matches</span>
          </div>
          <div>
            <strong>{resources.reduce((sum, item) => sum + (item.capacity || 0), 0)}</strong>
            <span>Total capacity</span>
          </div>
        </div>
      </section>

      <section className="modern-search-panel">
        <input
          type="text"
          value={searchQuery}
          placeholder="Search by name, location, or description"
          onChange={(e) => setSearchQuery(e.target.value)}
          className="modern-search-input"
        />
      </section>

      <section className="modern-category-tabs">
        {categories.filter(category => category.id !== 'All').map((category) => (
          <button
            key={category.id}
            type="button"
            className={`category-pill ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </section>

      {bookingMessage && <div className="booking-notice">{bookingMessage}</div>}

      <main className="modern-card-grid">
        <div className="flat-resource-grid">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <article key={resource.id} className="resource-card modern-card">
                <div className="resource-image">
                  <img 
                    src={resource.imageUrl ? `http://localhost:8081/api${resource.imageUrl}` : '/images/resource-placeholder.svg'} 
                    alt={resource.name}
                    onError={(e) => { e.target.src = '/images/resource-placeholder.svg'; }}
                  />
                </div>
                <div className="resource-card-body">
                  <div className="resource-labels">
                    <span className="resource-type">{resource.type}</span>
                    <span className={`resource-status ${resource.status === 'ACTIVE' ? 'active' : 'inactive'}`}>{resource.status}</span>
                  </div>
                  <h3>{resource.name}</h3>
                  <p className="resource-copy">{resource.description || 'Well-equipped space for campus activities.'}</p>
                  <div className="resource-meta">
                    <span>{resource.location}</span>
                    <span>Capacity: {resource.capacity}</span>
                  </div>
                  <button 
                    type="button" 
                    className={`booking-button ${resource.status !== 'ACTIVE' ? 'disabled' : ''}`}
                    onClick={() => openBooking(resource)}
                    disabled={resource.status !== 'ACTIVE'}
                  >
                    {resource.status === 'ACTIVE' ? 'Book Resource' : 'Out of Service'}
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">No resources found. Try adjusting your search or filters.</div>
          )}
        </div>
      </main>

      {showBookingModal && selectedResource && (
        <div className="booking-modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="booking-modal" onClick={(event) => event.stopPropagation()}>
            <header className="booking-modal-header">
              <div>
                <p className="mini-label">Booking Request</p>
                <h2>{selectedResource.name}</h2>
                <p>{selectedResource.location}</p>
              </div>
              <button className="close-modal" type="button" onClick={() => setShowBookingModal(false)}>
                ×
              </button>
            </header>

            <div className="booking-modal-body">
              <div className="booking-row">
                <label>
                  Date
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    onBlur={() => handleBlur('date')}
                    className="booking-input"
                  />
                  {formErrors.date && <span className="field-error">{formErrors.date}</span>}
                </label>
                <label>
                  Attendees
                  <input
                    type="number"
                    min="1"
                    max={selectedResource.capacity}
                    value={bookingForm.attendees}
                    onChange={(e) => handleInputChange('attendees', Number(e.target.value))}
                    onBlur={() => handleBlur('attendees')}
                    className="booking-input"
                  />
                  {formErrors.attendees && <span className="field-error">{formErrors.attendees}</span>}
                </label>
              </div>

              <div className="slot-section">
                <p className="slot-label">Choose a 2-hour slot</p>
                <div className="slot-grid">
                  {defaultSlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => toggleSlot(slot)}
                      className={`slot-card ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
                {formErrors.slot && <span className="field-error">{formErrors.slot}</span>}
              </div>

              <label>
                Purpose
                <textarea
                  value={bookingForm.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                  onBlur={() => handleBlur('purpose')}
                  className="booking-textarea"
                />
                {formErrors.purpose && <span className="field-error">{formErrors.purpose}</span>}
              </label>

              <div className="booking-row">
                <label>
                  Name
                  <input
                    type="text"
                    value={bookingForm.studentName}
                    onChange={(e) => handleInputChange('studentName', e.target.value)}
                    onBlur={() => handleBlur('studentName')}
                    className="booking-input"
                  />
                  {formErrors.studentName && <span className="field-error">{formErrors.studentName}</span>}
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={bookingForm.studentEmail}
                    onChange={(e) => handleInputChange('studentEmail', e.target.value)}
                    onBlur={() => handleBlur('studentEmail')}
                    className="booking-input"
                  />
                  {formErrors.studentEmail && <span className="field-error">{formErrors.studentEmail}</span>}
                </label>
              </div>

              <label>
                Phone
                <input
                  type="tel"
                  value={bookingForm.studentPhone}
                  onChange={(e) => handleInputChange('studentPhone', e.target.value)}
                  onBlur={() => handleBlur('studentPhone')}
                  className="booking-input"
                />
                {formErrors.studentPhone && <span className="field-error">{formErrors.studentPhone}</span>}
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={bookingForm.agreeTerms}
                  onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                />
                <span>I agree to the booking terms and conditions</span>
              </label>
              {formErrors.agreeTerms && <span className="field-error">{formErrors.agreeTerms}</span>}

              <div className="booking-actions">
                <button type="button" className="cancel-button" onClick={() => setShowBookingModal(false)}>
                  Cancel
                </button>
                <button type="button" className="confirm-button" onClick={submitBooking}>
                  Submit Booking Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModernResourceBooking;
