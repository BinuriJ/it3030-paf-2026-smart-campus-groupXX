import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { fetchResources, createResource, updateResource, deleteResource } from './api/resourceApi';
import { fetchReports } from './api/reportApi';
import ModernResourceBooking from './components/ModernResourceBooking';
import AdminDashboard from './components/AdminDashboard';

const defaultSearch = '';
const defaultType = 'All';

function App() {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState('');
  const [reports, setReports] = useState([]);

  const navigate = useNavigate();

  const loadResources = async () => {
    try {
      const list = await fetchResources({});
      setResources(list);
      setError('');
    } catch {
      setError('Unable to load resources.');
    }
  };

  const loadReports = async () => {
    try {
      const list = await fetchReports();
      setReports(list);
    } catch {
      console.error('Unable to load reports.');
    }
  };

  useEffect(() => {
    loadResources();
    loadReports();
  }, []);

  const refresh = async () => {
    await loadResources();
    setBookingResource(null);
  };

  const handleCreate = async (resource) => {
    try {
      await createResource(resource);
      await refresh();
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to create resource.';
      setError(message);
    }
  };

  const handleUpdate = async (resource) => {
    try {
      await updateResource(resource.id, resource);
      await refresh();
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to update resource.';
      setError(message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteResource(id);
      await refresh();
    } catch {
      setError('Failed to delete resource.');
    }
  };



  return (
    <div className="app-shell">
      <header>
        <div className="header-content">
          <div>
            <h1>Smart Campus Facilities</h1>
            <p>Explore campus spaces, submit reports, and keep your community informed.</p>
          </div>
          <nav className="top-nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Student View
            </NavLink>
            <NavLink to="/adminbookings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Admin Bookings
            </NavLink>
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<ModernResourceBooking resources={resources} />} />
        <Route
          path="/adminbookings"
          element={
            <AdminDashboard
              resources={resources}
              reports={reports}
              onBack={() => navigate('/')}
              onRefresh={refresh}
              onCreate={handleCreate}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

    </div>
  );
}

export default App;
