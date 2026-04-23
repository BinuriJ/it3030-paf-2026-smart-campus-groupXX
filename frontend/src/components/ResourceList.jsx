function ResourceList({ resources, onEdit, onDelete, onBook }) {
  if (resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <svg className="w-16 h-16 mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p className="text-sm font-semibold">No resources found</p>
        <p className="text-xs mt-1">Add your first resource using the form on the left.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Resource</th>
            <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider hidden md:table-cell">Type</th>
            <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider hidden lg:table-cell">Location</th>
            <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider hidden md:table-cell">Capacity</th>
            <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-right text-xs font-black text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {resources.map((resource) => (
            <tr key={resource.id} className="hover:bg-slate-50/60 transition-colors group">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img
                      className="w-full h-full object-cover"
                      src={resource.imageUrl ? `http://localhost:8081/api${resource.imageUrl}` : '/images/resource-placeholder.svg'}
                      alt={resource.name}
                      onError={(e) => { e.target.src = '/images/resource-placeholder.svg'; }}
                    />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{resource.name}</div>
                    <div className="text-xs text-slate-400 font-medium md:hidden">{resource.type}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-600 font-medium hidden md:table-cell">{resource.type}</td>
              <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">{resource.location}</td>
              <td className="px-4 py-3 font-semibold text-slate-700 hidden md:table-cell">{resource.capacity}</td>
              <td className="px-4 py-3">
                {resource.status === 'ACTIVE' ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 flex-shrink-0"></span>
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 flex-shrink-0"></span>
                    Out of Service
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  {onBook && (
                    <button
                      disabled={resource.status !== 'ACTIVE'}
                      onClick={() => onBook(resource)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Book
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(resource)}
                      className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-bold rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(resource.id)}
                      className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResourceList;
