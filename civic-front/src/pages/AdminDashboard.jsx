// src/components/AdminDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";   // ✅ import navigate
import api from "../api";
import socket from "../socket";
import IssueDetailModal from "./IssueDetailModal";
import MapView from "./MapView";

export default function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const navigate = useNavigate();   // ✅ hook for redirecting

  // ✅ Step 1: Check if user is admin when component loads
  useEffect(() => {
    async function check() {
      try {
        const res = await api.get("/auth/me");   // backend will return user info
        if (res.data.role !== "admin") {
          alert("Admin access required");
          navigate("/"); // send back to home if not admin
        }
      } catch (err) {
        navigate("/login"); // not logged in
      }
    }
    check();
  }, [navigate]);

  // ✅ Step 2: Your existing logic starts here
  const fetchIssues = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/issues?page=1&limit=100");
      const list = res.data.items || res.data || [];
      setIssues(list);
    } catch (err) {
      console.error(err);
      alert("Failed to load issues");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  useEffect(() => {
    const onUpdate = () => fetchIssues();
    socket.on("issueStatusUpdated", onUpdate);
    socket.on("issueAssigned", onUpdate);
    return () => {
      socket.off("issueStatusUpdated", onUpdate);
      socket.off("issueAssigned", onUpdate);
    };
  }, [fetchIssues]);

  const quickAssign = async (id, dept) => {
    if (!dept) return;
    try {
      await api.put(`/issues/${id}/assign`, { department: dept });
      fetchIssues();
    } catch (err) {
      console.error(err);
      alert("Assign failed");
    }
  };

  const allowedTransitions = {
    submitted: ["acknowledged"],
    acknowledged: ["in-progress", "resolved"],
    "in-progress": ["resolved"],
    resolved: [],
  };

  const quickChangeStatus = async (id, newStatus) => {
    try {
      await api.put(`/issues/${id}/status`, {
        status: newStatus,
        note: "Changed via Admin Dashboard",
      });
      fetchIssues();
    } catch (err) {
      console.error(err);
      alert(
        "Status update failed: " +
          (err?.response?.data?.error || err.message)
      );
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Admin Dashboard</h2>

      <div style={{ marginBottom: 12 }}>
        <strong>Total issues:</strong> {issues.length}
      </div>

      {/* Map (show all markers) */}
      <div style={{ marginBottom: 12 }}>
        <MapView
          issues={issues}
          onMarkerClick={(issue) => setSelectedId(issue._id)}
        />
      </div>

      {/* Table */}
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                <th style={{ padding: 8 }}>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Dept</th>
                <th>Photo</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((it) => (
                <tr
                  key={it._id}
                  style={{ borderBottom: "1px solid #f0f0f0" }}
                >
                  <td style={{ padding: 8 }}>{it.title}</td>
                  <td>{it.category}</td>
                  <td>{it.status}</td>
                  <td>{it.assignedDepartment || "—"}</td>
                  <td>
                    {it.photoUrl ? (
                      <img
                        src={it.photoUrl}
                        alt=""
                        style={{
                          width: 80,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                    ) : (
                      <span style={{ color: "#888" }}>No photo</span>
                    )}
                  </td>
                  <td>
                    <button onClick={() => setSelectedId(it._id)}>View</button>

                    {/* Assign dropdown */}
                    <select
                      onChange={(e) => quickAssign(it._id, e.target.value)}
                      defaultValue=""
                    >
                      <option value="">Assign</option>
                      <option value="Electricity">Electricity</option>
                      <option value="Sanitation">Sanitation</option>
                      <option value="Public Works">Public Works</option>
                      <option value="Roads">Roads</option>
                    </select>

                    {/* quick status actions (show allowed transitions) */}
                    {(allowedTransitions[it.status] || []).map((s) => (
                      <button
                        key={s}
                        onClick={() => quickChangeStatus(it._id, s)}
                        style={{ marginLeft: 6 }}
                      >
                        {s}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* modal */}
      {selectedId && (
        <IssueDetailModal
          issueId={selectedId}
          onClose={() => setSelectedId(null)}
          onUpdated={() => {
            fetchIssues();
          }}
        />
      )}
    </div>
  );
}
