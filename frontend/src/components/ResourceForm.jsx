import { useEffect, useState } from 'react';
import axios from 'axios';

const today = new Date().toISOString().slice(0, 10);
const oneWeekLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

const initialState = {
  name: '',
  type: '',
  capacity: 1,
  location: '',
  availabilityWindow: '',
  status: 'ACTIVE',
  imageUrl: '/images/resource-placeholder.svg',
  availableFrom: today,
  availableTo: oneWeekLater,
};

function ResourceForm({ onSubmit, resource, onCancel }) {
  const [form, setForm] = useState(initialState);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (resource) {
      setForm({ ...initialState, ...resource });
    } else {
      setForm(initialState);
    }
  }, [resource]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, imageUrl: previewUrl }));
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return form.imageUrl;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post('http://localhost:8081/api/resources/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data; // This will be the image URL
    } catch (error) {
      console.error('Error uploading image:', error);
      return '/images/resource-placeholder.svg';
    } finally {
      setUploading(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();

    // Upload image first if a file is selected
    let imageUrl = form.imageUrl;
    if (selectedFile) {
      imageUrl = await uploadImage();
    }

    // Submit form with the image URL
    onSubmit({ ...form, imageUrl });
  };

  return (
    <div className="panel">
      <div className="panel-title">{resource ? 'Edit Resource' : 'New Resource'}</div>
      <form onSubmit={submit} className="resource-form">
        <label>
          Name
          <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
        </label>
        <label>
          Type
          <select value={form.type} onChange={(e) => handleChange('type', e.target.value)} required>
            <option value="">Select resource type</option>
            <option value="Lecture Hall">Lecture Hall</option>
            <option value="Lab">Lab</option>
            <option value="Meeting Room">Meeting Room</option>
            <option value="Equipment">Equipment</option>
          </select>
        </label>
        <label>
          Capacity
          <input type="number" value={form.capacity} min="1" onChange={(e) => handleChange('capacity', Number(e.target.value))} required />
        </label>
        <label>
          Location
          <input value={form.location} onChange={(e) => handleChange('location', e.target.value)} required />
        </label>
        <label>
          Availability
          <input
            value={form.availabilityWindow}
            onChange={(e) => handleChange('availabilityWindow', e.target.value)}
            required
            pattern="^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$"
            placeholder="08:00-18:00"
          />
        </label>
        <label>
          Available from
          <input
            type="date"
            value={form.availableFrom}
            onChange={(e) => handleChange('availableFrom', e.target.value)}
            required
          />
        </label>
        <label>
          Available to
          <input
            type="date"
            value={form.availableTo}
            onChange={(e) => handleChange('availableTo', e.target.value)}
            required
          />
        </label>
        <label>
          Status
          <select value={form.status} onChange={(e) => handleChange('status', e.target.value)}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
          </select>
        </label>
        <label>
          Image
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
          {uploading && <span className="uploading-text">Uploading...</span>}
        </label>
        <div className="image-preview">
          <img 
            src={form.imageUrl.startsWith('http') ? form.imageUrl : (form.imageUrl.startsWith('/') ? `http://localhost:8081${form.imageUrl}` : form.imageUrl)}
            alt="Resource preview" 
            onError={(e) => { e.target.src = '/images/resource-placeholder.svg'; }}
          />
          {selectedFile && <p className="file-name">{selectedFile.name}</p>}
        </div>
        <div className="form-actions">
          <button type="submit">{resource ? 'Update' : 'Create'}</button>
          {resource && <button type="button" className="secondary" onClick={onCancel}>Cancel</button>}
        </div>
      </form>
    </div>
  );
}

export default ResourceForm;
