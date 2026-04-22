import { useEffect, useState } from 'react';

const initialReport = {
  resourceId: '',
  title: '',
  description: '',
  priority: 'Medium',
  reporterName: '',
  contactEmail: '',
  screenshotUrl: '/images/resource-placeholder.svg',
};

function ReportForm({ resources, onSubmit }) {
  const [form, setForm] = useState(initialReport);

  useEffect(() => {
    if (resources.length > 0 && !form.resourceId) {
      setForm((prev) => ({ ...prev, resourceId: resources[0].id }));
    }
  }, [resources]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      resourceId: Number(form.resourceId),
    });
    setForm(initialReport);
  };

  return (
    <div className="panel report-panel">
      <div className="panel-title">Create a Resource Report</div>
      <form onSubmit={submit} className="resource-form">
        <label>
          Resource
          <select value={form.resourceId} onChange={(e) => handleChange('resourceId', e.target.value)} required>
            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>
                {resource.name} — {resource.location}
              </option>
            ))}
          </select>
        </label>
        <label>
          Report title
          <input value={form.title} onChange={(e) => handleChange('title', e.target.value)} required />
        </label>
        <label>
          Description
          <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows="4" required />
        </label>
        <label>
          Priority
          <select value={form.priority} onChange={(e) => handleChange('priority', e.target.value)}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>
        <label>
          Reporter name
          <input value={form.reporterName} onChange={(e) => handleChange('reporterName', e.target.value)} required />
        </label>
        <label>
          Contact email
          <input type="email" value={form.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} required />
        </label>
        <label>
          Screenshot image
          <select value={form.screenshotUrl} onChange={(e) => handleChange('screenshotUrl', e.target.value)}>
            <option value="/images/resource-placeholder.svg">Default image</option>
            <option value="/images/lecture-hall.svg">Lecture hall image</option>
            <option value="/images/lab-room.svg">Lab room image</option>
            <option value="/images/meeting-room.svg">Meeting room image</option>
            <option value="/images/equipment.svg">Equipment image</option>
          </select>
        </label>
        <div className="form-actions">
          <button type="submit">Submit Report</button>
        </div>
      </form>
    </div>
  );
}

export default ReportForm;
