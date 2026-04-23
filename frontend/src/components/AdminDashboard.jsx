import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResourceForm from './ResourceForm';
import ResourceList from './ResourceList';
import { fetchResources, createResource, updateResource, deleteResource } from '../api/resourceApi';
import { fetchReports } from '../api/reportApi';

function AdminDashboard() {
  const [resources, setResources] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const resData = await fetchResources({});
      setResources(resData || []);
      const repData = await fetchReports();
      setReports(repData || []);
    } catch (error) {
      console.error("Failed to load admin data", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (data) => {
    try {
      await createResource(data);
      loadData();
    } catch(err) {
      alert("Failed to create resource");
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateResource(selectedResource.id || selectedResource._id, data);
      setSelectedResource(null);
      loadData();
    } catch(err) {
      alert("Failed to update resource");
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await deleteResource(id);
        loadData();
      } catch(err) {
        alert("Failed to delete resource");
      }
    }
  };

  const onBack = () => navigate('/dashboard');

  const generateReport = () => {
    const reportData = {
      totalResources: resources.length,
      activeResources: resources.filter(r => r.status === 'ACTIVE').length,
      outOfService: resources.filter(r => r.status === 'OUT_OF_SERVICE').length,
      totalReports: reports.length,
      resourcesByType: resources.reduce((acc, r) => {
        acc[r.type] = (acc[r.type] || 0) + 1;
        return acc;
      }, {}),
      reportsByPriority: reports.reduce((acc, r) => {
        acc[r.priority] = (acc[r.priority] || 0) + 1;
        return acc;
      }, {}),
    };
    return reportData;
  };

  const exportResourcesPdf = () => {
    const rows = resources.map((resource) => `
      <tr>
        <td>${resource.name}</td>
        <td>${resource.type}</td>
        <td>${resource.location}</td>
        <td>${resource.capacity}</td>
        <td>${resource.status}</td>
      </tr>
    `).join('');

    const html = `<!DOCTYPE html>
      <html>
        <head>
          <title>Resource Catalog</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #30364F; }
            h1 { font-size: 24px; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { border: 1px solid #ccc; padding: 12px; text-align: left; }
            th { background: #f4f4f4; }
          </style>
        </head>
        <body>
          <h1>Resource Catalog</h1>
          <p>Total resources: ${resources.length}</p>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Location</th>
                <th>Capacity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>`;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const reportData = generateReport();

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage facilities and generate real-time system reports</p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-4xl font-black text-blue-600 mb-2">{reportData.totalResources}</div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Resources</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-4xl font-black text-emerald-500 mb-2">{reportData.activeResources}</div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Resources</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-4xl font-black text-rose-500 mb-2">{reportData.outOfService}</div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Out of Service</p>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-md">
          <div className="text-4xl font-black text-white mb-2">{reportData.totalReports}</div>
          <p className="text-sm font-bold text-slate-300 uppercase tracking-wider">Total Reports</p>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Form */}
        <div className="xl:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-fit">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Manage Resources</h2>
            {selectedResource && (
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Editing Mode</span>
            )}
          </div>
          <ResourceForm
            onSubmit={selectedResource ? handleUpdate : handleCreate}
            resource={selectedResource}
            onCancel={() => setSelectedResource(null)}
          />
        </div>

        {/* Right Column - Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-fit">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">All Facilities</h2>
            <div className="flex gap-3">
              <button 
                className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-bold rounded-xl transition-colors"
                onClick={() => setShowReportModal(true)}
              >
                View Report
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 text-sm font-bold rounded-xl transition-colors shadow-sm"
                onClick={exportResourcesPdf}
              >
                Export PDF
              </button>
            </div>
          </div>
          <ResourceList
            resources={resources}
            onEdit={setSelectedResource}
            onDelete={handleDelete}
          />
        </div>
      </section>

      {/* Modal overlay */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowReportModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl transform transition-all" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Facility Report Analytics</h2>
              <button className="text-slate-400 hover:text-slate-600 focus:outline-none" onClick={() => setShowReportModal(false)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-4">Resource Summary</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4 text-center">
                      <div className="text-xl font-bold text-slate-800">{reportData.totalResources}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">Total</div>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4 text-center">
                      <div className="text-xl font-bold text-emerald-600">{reportData.activeResources}</div>
                      <div className="text-[10px] uppercase font-bold text-emerald-600 mt-1">Active</div>
                    </div>
                    <div className="bg-rose-50 rounded-xl p-4 text-center">
                      <div className="text-xl font-bold text-rose-600">{reportData.outOfService}</div>
                      <div className="text-[10px] uppercase font-bold text-rose-600 mt-1">Inactive</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-4">Resources by Type</h3>
                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 divide-y divide-slate-100">
                    {Object.entries(reportData.resourcesByType).map(([type, count]) => (
                      <div key={type} className="flex justify-between py-2 first:pt-0 last:pb-0">
                        <span className="text-sm font-semibold text-slate-700">{type}</span>
                        <span className="text-sm font-bold text-blue-600">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-4">Reports by Priority</h3>
                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 divide-y divide-slate-100">
                    {Object.entries(reportData.reportsByPriority).map(([priority, count]) => (
                      <div key={priority} className="flex justify-between py-2 first:pt-0 last:pb-0">
                        <span className="text-sm font-semibold text-slate-700">{priority}</span>
                        <span className="text-sm font-bold text-amber-600">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;