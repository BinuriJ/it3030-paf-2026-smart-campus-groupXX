import { useState } from 'react';
import ResourceForm from './ResourceForm';
import ResourceList from './ResourceList';

function AdminDashboard({ resources, reports, onBack, onRefresh, onCreate, onUpdate, onDelete }) {
  const [selectedResource, setSelectedResource] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

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
    <div className="app-shell admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage facilities and generate reports</p>
          </div>
          <button className="back-button" onClick={onBack}>
            ← Back to Student View
          </button>
        </div>
      </header>

      <section className="admin-stats">
        <div className="stat-card">
          <h3>{reportData.totalResources}</h3>
          <p>Total Resources</p>
        </div>
        <div className="stat-card">
          <h3>{reportData.activeResources}</h3>
          <p>Active Resources</p>
        </div>
        <div className="stat-card">
          <h3>{reportData.outOfService}</h3>
          <p>Out of Service</p>
        </div>
        <div className="stat-card">
          <h3>{reportData.totalReports}</h3>
          <p>Total Reports</p>
        </div>
      </section>

      <section className="admin-layout">
        <div className="admin-panel">
          <div className="panel-title">Manage Resources</div>
          <ResourceForm
            onSubmit={selectedResource ? onUpdate : onCreate}
            resource={selectedResource}
            onCancel={() => setSelectedResource(null)}
          />
        </div>
        <div className="admin-panel">
          <div className="panel-title">All Facilities</div>
          <ResourceList
            resources={resources}
            onEdit={setSelectedResource}
            onDelete={onDelete}
          />
          <div className="report-actions">
            <button className="generate-report-btn" onClick={() => setShowReportModal(true)}>
              Generate Facility Report
            </button>
            <button className="pdf-btn" onClick={exportResourcesPdf}>
              Export Resources PDF
            </button>
          </div>
        </div>
      </section>

      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Facility Report</h2>
              <button className="close-modal" onClick={() => setShowReportModal(false)}>×</button>
            </div>
            <div className="report-content">
              <div className="report-section">
                <h3>Resource Summary</h3>
                <p>Total Resources: {reportData.totalResources}</p>
                <p>Active: {reportData.activeResources}</p>
                <p>Out of Service: {reportData.outOfService}</p>
              </div>
              <div className="report-section">
                <h3>Resources by Type</h3>
                {Object.entries(reportData.resourcesByType).map(([type, count]) => (
                  <p key={type}>{type}: {count}</p>
                ))}
              </div>
              <div className="report-section">
                <h3>Reports by Priority</h3>
                {Object.entries(reportData.reportsByPriority).map(([priority, count]) => (
                  <p key={priority}>{priority}: {count}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;