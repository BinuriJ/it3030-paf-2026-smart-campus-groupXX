function ResourceList({ resources, onEdit, onDelete, onBook }) {
  const getStatusClassName = (status) => {
    if (status === 'ACTIVE') {
      return 'status-chip active';
    }
    return 'status-chip inactive';
  };

  return (
    <div className="cards-grid">
      {resources.length === 0 ? (
        <div className="empty-state">No resources found.</div>
      ) : (
        resources.map((resource) => (
          <article key={resource.id} className="resource-card">
            <div className="card-image">
              <img 
                src={resource.imageUrl ? `http://localhost:8081/api${resource.imageUrl}` : '/images/resource-placeholder.svg'} 
                alt={resource.name}
                onError={(e) => { e.target.src = '/images/resource-placeholder.svg'; }}
              />
            </div>
            <div className="card-content">
              <div className="card-title-row">
                <h3>{resource.name}</h3>
                <span className={getStatusClassName(resource.status)}>{resource.status}</span>
              </div>
              <p className="card-meta">{resource.type} · {resource.location}</p>
              <div className="card-details">
                <span>Capacity: {resource.capacity}</span>
                <span>Availability: {resource.availabilityWindow}</span>
              </div>
            </div>
            <div className="card-actions">
              {onBook && <button disabled={resource.status !== 'ACTIVE'} className={resource.status !== 'ACTIVE' ? 'disabled' : ''} onClick={() => onBook(resource)}>{resource.status === 'ACTIVE' ? 'Book' : 'Out of Service'}</button>}
              {onEdit && <button onClick={() => onEdit(resource)}>Edit</button>}
              {onDelete && <button className="danger" onClick={() => onDelete(resource.id)}>Delete</button>}
            </div>
          </article>
        ))
      )}
    </div>
  );
}

export default ResourceList;
