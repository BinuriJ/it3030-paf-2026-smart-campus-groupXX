import React, { useMemo } from "react";

export default function AdminNoticeManager({
  notices,
  form,
  setForm,
  editingId,
  saving,
  searchKeyword,
  setSearchKeyword,
  searching,
  onSearch,
  error,
  onSubmit,
  onEdit,
  onDelete,
  onCancelEdit,
}) {
  const isFormValid = useMemo(() => {
    return form.title.trim() !== "" && form.message.trim() !== "";
  }, [form.message, form.title]);

  return (
    <div className="admin-grid">
      <section className="panel admin-form-panel">
        <div className="admin-panel-header">
          <div>
            <h3>{editingId ? "Edit Notice" : "Create Notice"}</h3>
            <p>{editingId ? "Update the selected notice." : "Publish a new campus notice."}</p>
          </div>
        </div>

        <input
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          placeholder="Notice title"
        />

        <textarea
          rows="5"
          value={form.message}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          placeholder="Notice message"
        />

        <input
          value={form.targetGroup}
          onChange={(event) => setForm((current) => ({ ...current, targetGroup: event.target.value }))}
          placeholder="Target group (default: ALL)"
        />

        {error ? <p className="error">{error}</p> : null}

        <div className="admin-action-row">
          <button onClick={onSubmit} disabled={!isFormValid || saving}>
            {saving ? "Saving..." : editingId ? "Update Notice" : "Post Notice"}
          </button>

          {editingId ? (
            <button className="secondary-btn" type="button" onClick={onCancelEdit}>
              Cancel
            </button>
          ) : null}
        </div>
      </section>

      <section className="panel admin-list-panel">
        <div className="admin-panel-header">
          <div>
            <h3>Manage Notices</h3>
            <p>{notices.length} notice{notices.length === 1 ? "" : "s"} available</p>
          </div>
        </div>

        <div className="admin-search-row">
          <input
            type="search"
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onSearch(searchKeyword);
              }
            }}
            placeholder="Search notices by title or message"
          />
          <button type="button" className="secondary-btn" onClick={() => onSearch(searchKeyword)}>
            {searching ? "Searching..." : "Search"}
          </button>
        </div>

        <div className="admin-notice-list">
          {notices.length ? (
            notices.map((notice) => (
              <article key={notice._id || notice.id} className="notice-card admin-notice-card">
                <div className="admin-notice-copy">
                  <h4>{notice.title}</h4>
                  <p>{notice.message}</p>
                  <small>Target: {notice.targetGroup || "ALL"}</small>
                </div>

                <div className="btn-group">
                  <button onClick={() => onEdit(notice)}>Edit</button>
                  <button
                    className="delete-btn"
                    onClick={() => onDelete(notice._id || notice.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p className="empty-state">
              {searchKeyword.trim() ? "No results found" : "No notices yet. Create the first notice from this panel."}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
