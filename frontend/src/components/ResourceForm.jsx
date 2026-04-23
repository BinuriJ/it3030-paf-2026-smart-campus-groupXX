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
    <div>
      <form onSubmit={submit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-1.5 text-sm font-bold text-slate-700">
          Name
          <input 
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-slate-900"
            value={form.name} onChange={(e) => handleChange('name', e.target.value)} required 
          />
        </label>
        <div className="grid grid-cols-2 gap-5">
          <label className="flex flex-col gap-1.5 text-sm font-bold text-slate-700">
            Type
            <select 
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-slate-900"
              value={form.type} onChange={(e) => handleChange('type', e.target.value)} required>
              <option value="">Select resource type</option>
              <option value="Lecture Hall">Lecture Hall</option>
              <option value="Lab">Lab</option>
              <option value="Meeting Room">Meeting Room</option>
              <option value="Equipment">Equipment</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-bold text-slate-700">
            Capacity
            <input 
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-slate-900"
              type="number" value={form.capacity} min="1" onChange={(e) => handleChange('capacity', Number(e.target.value))} required 
            />
          </label>
        </div>
        <label className="flex flex-col gap-1.5 text-sm font-bold text-slate-700">
          Location
          <input 
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-slate-900"
            value={form.location} onChange={(e) => handleChange('location', e.target.value)} required 
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-bold text-slate-700">
          Availability Hours
          <input
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-slate-900"
            value={form.availabilityWindow}
            onChange={(e) => handleChange('availabilityWindow', e.target.value)}
            required
            pattern="^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$"
            placeholder="08:00-18:00"
          />
        </label>
        <div className="grid grid-cols-2 gap-5">
          <label className="flex flex-col gap-1.5 text-sm font-bold text-slate-700">
            Available from
            <input
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-slate-900"
              type="date"
              value={form.availableFrom}
              onChange={(e) => handleChange('availableFrom', e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-bold text-slate-700">
            Available to
            <input
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-slate-900"
              type="date"
              value={form.availableTo}
              onChange={(e) => handleChange('availableTo', e.target.value)}
              required
            />
          </label>
        </div>
        <label className="flex flex-col gap-1.5 text-sm font-bold text-slate-700">
          Status
          <select 
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-slate-900"
            value={form.status} onChange={(e) => handleChange('status', e.target.value)}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-bold text-slate-700">
          Image
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-slate-500"
          />
          {uploading && <span className="text-sm font-semibold text-blue-500 animate-pulse mt-1">Uploading...</span>}
        </label>
        
        <div className="mt-2 w-full aspect-video bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden relative group shadow-inner">
          <img 
            className="w-full h-full object-cover"
            src={form.imageUrl.startsWith('http') ? form.imageUrl : (form.imageUrl.startsWith('/') ? `http://localhost:8081${form.imageUrl}` : form.imageUrl)}
            alt="Resource preview" 
            onError={(e) => { e.target.src = '/images/resource-placeholder.svg'; }}
          />
          {selectedFile && (
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/80 to-transparent p-4 pb-3">
              <p className="text-white text-xs font-semibold truncate">{selectedFile.name}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-100 mt-2">
          <button 
            type="submit"
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-colors"
          >
            {resource ? 'Update Resource' : 'Create Resource'}
          </button>
          {resource && (
            <button 
              type="button" 
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ResourceForm;
