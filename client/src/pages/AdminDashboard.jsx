import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { clearAuth, getStoredUser, syncStoredUser } from "../api/api";
import AdminSidebar from "../components/AdminSidebar";
import AdminNoticeManager from "../components/AdminNoticeManager";
import "../styles/dashboard.css";

const emptyForm = {
  title: "",
  message: "",
  targetGroup: "ALL",
};

export default function AdminDashboard({ initialPage = "dashboard" }) {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const [activePage, setActivePage] = useState(initialPage);
  const [notices, setNotices] = useState([]);
  const [allNotices, setAllNotices] = useState([]);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    setActivePage(initialPage);
  }, [initialPage]);

  useEffect(() => {
    if (!storedUser?._id) {
      navigate("/login", { replace: true });
      return;
    }

    const loadDashboard = async () => {
      try {
        const [noticeResponse, profileResponse] = await Promise.all([
          api.get("/api/notices"),
          api.get(`/api/users/${storedUser._id}`),
        ]);

        setNotices(noticeResponse.data);
        setAllNotices(noticeResponse.data);
        setProfile(profileResponse.data);
        syncStoredUser(profileResponse.data);
      } catch (requestError) {
        setError(
          requestError?.response?.data?.message ||
            requestError?.message ||
            "Failed to load the admin dashboard."
        );
      }
    };

    loadDashboard();
  }, [navigate, storedUser?._id]);

  const fetchNotices = async () => {
    const response = await api.get("/api/notices");
    setAllNotices(response.data);
    setNotices(response.data);
  };

  const handleSearch = async (keyword = searchKeyword) => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      setNotices(allNotices);
      return;
    }

    setSearching(true);

    try {
      const response = await api.get("/api/notices/search", {
        params: { keyword: trimmedKeyword },
      });
      setNotices(response.data);
      setError("");
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to search notices."
      );
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    const trimmedKeyword = searchKeyword.trim();

    if (!trimmedKeyword) {
      setNotices(allNotices);
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      handleSearch(searchKeyword);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [allNotices, searchKeyword]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async () => {
    if (saving) {
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      title: form.title.trim(),
      message: form.message.trim(),
      targetGroup: form.targetGroup.trim() || "ALL",
    };

    try {
      if (editingId) {
        await api.put(`/api/notices/${editingId}`, payload);
      } else {
        await api.post("/api/notices", payload);
      }

      await fetchNotices();
      resetForm();
      setActivePage("dashboard");
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to save this notice."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/notices/${id}`);
      await fetchNotices();
      if (editingId === id) {
        resetForm();
      }
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to delete this notice."
      );
    }
  };

  const handleEdit = (notice) => {
    setEditingId(notice._id || notice.id);
    setForm({
      title: notice.title || "",
      message: notice.message || "",
      targetGroup: notice.targetGroup || "ALL",
    });
    setActivePage("create");
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard-container admin-shell">
      <AdminSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        handleLogout={handleLogout}
      />

      <main className="admin-content">
        {activePage === "dashboard" ? (
          <>
            <section className="admin-hero">
              <div>
                <p className="admin-kicker">Administration</p>
                <h1>Notice Control Center</h1>
                <p>Manage announcements and keep the campus informed from one workspace.</p>
              </div>

              <div className="admin-stat-card">
                <span>Total Notices</span>
                <strong>{notices.length}</strong>
              </div>
            </section>

            <AdminNoticeManager
              notices={notices}
              form={form}
              setForm={setForm}
              editingId={editingId}
              saving={saving}
              searchKeyword={searchKeyword}
              setSearchKeyword={setSearchKeyword}
              searching={searching}
              onSearch={handleSearch}
              error={error}
              onSubmit={handleSubmit}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCancelEdit={resetForm}
            />
          </>
        ) : null}

        {activePage === "create" ? (
          <>
            <section className="admin-hero">
              <div>
                <p className="admin-kicker">Create Notice</p>
                <h1>{editingId ? "Update announcement" : "Write a new announcement"}</h1>
                <p>Your changes are saved through the protected notice API and the list refreshes immediately.</p>
              </div>
            </section>

            <AdminNoticeManager
              notices={notices}
              form={form}
              setForm={setForm}
              editingId={editingId}
              saving={saving}
              searchKeyword={searchKeyword}
              setSearchKeyword={setSearchKeyword}
              searching={searching}
              onSearch={handleSearch}
              error={error}
              onSubmit={handleSubmit}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCancelEdit={resetForm}
            />
          </>
        ) : null}

        {activePage === "profile" ? (
          <>
            <section className="admin-hero">
              <div>
                <p className="admin-kicker">Profile</p>
                <h1>Administrator account</h1>
                <p>This profile is loaded from the protected user endpoint and never exposes a password.</p>
              </div>
            </section>

            <section className="panel admin-profile-panel">
              <div className="profile-overview">
                <div className="admin-profile-avatar">
                  {profile?.fullName?.charAt(0)?.toUpperCase() || "A"}
                </div>

                <div>
                  <h3>{profile?.fullName || "-"}</h3>
                  <p>{profile?.email || "-"}</p>
                  <span className="role-badge admin">{profile?.role || "ADMIN"}</span>
                </div>
              </div>

              <div className="grid">
                <p><strong>Phone:</strong> {profile?.phone || "-"}</p>
                <p><strong>Address:</strong> {profile?.address || "-"}</p>
                <p><strong>Organization:</strong> {profile?.orgName || "-"}</p>
                <p><strong>Admin Type:</strong> {profile?.adminType || "-"}</p>
              </div>
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}
