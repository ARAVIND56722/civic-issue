// src/components/IssueDetailModal.jsx
import React, { useEffect, useState, useContext } from "react";
import api from "../api";
import MapView from "./MapView";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext"; // 👈 add this

const allowedTransitions = {
  submitted: ["acknowledged"],
  acknowledged: ["in-progress", "resolved"],
  "in-progress": ["resolved"],
  resolved: [],
};

const modalStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const cardStyle = {
  width: "90%",
  maxWidth: 1000,
  maxHeight: "90%",
  overflowY: "auto",
  background: "white",
  borderRadius: 8,
  padding: 16,
};

export default function IssueDetailModal({ issueId, onClose, onUpdated }) {
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext); // 👈 check current user

  async function fetchIssue() {
    try {
      setLoading(true);
      const res = await api.get(`/issues/${issueId}`);
      setIssue(res.data);
    } catch (err) {
      console.error("Failed to fetch issue", err);
      toast.error("Failed to load issue details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (issueId) fetchIssue();
  }, [issueId]);

  if (!issueId) return null;
  if (loading && !issue) return (
    <div style={modalStyle}>
      <div style={cardStyle}>Loading...</div>
    </div>
  );

  if (!issue) return null;

  const nextStatuses = allowedTransitions[issue.status] || [];

  const handleStatusChange = async (newStatus) => {
    if (!newStatus) return;
    if (!window.confirm(`Change status to "${newStatus}"?`)) return;
    try {
      await api.put(`/issues/${issue._id}/status`, { status: newStatus, note: `Changed via Admin UI` });
      toast.success("Status updated");
      await fetchIssue();
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Status update failed");
    }
  };

  const handleAssign = async (department) => {
    if (!department) return;
    if (!window.confirm(`Assign to "${department}"?`)) return;
    try {
      await api.put(`/issues/${issue._id}/assign`, { department });
      toast.success("Assigned");
      await fetchIssue();
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error(err);
      toast.error("Assign failed");
    }
  };

  return (
    <div style={modalStyle}>
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>{issue.title}</h3>
          <div>
            <button onClick={onClose} style={{ marginLeft: 8 }}>Close</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 12, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div><strong>Category:</strong> {issue.category || "—"}</div>
            <div><strong>Location text:</strong> {issue.location || "—"}</div>
            <div style={{ marginTop: 8 }}>
              <strong>Description:</strong>
              <p>{issue.description}</p>
            </div>

            {issue.photoUrl && (
              <div style={{ marginTop: 8 }}>
                <img src={issue.photoUrl} alt="issue" style={{ maxWidth: "100%", borderRadius: 6 }} />
              </div>
            )}

            <div style={{ marginTop: 14 }}>
              <h4>Status timeline</h4>
              <div>
                {(issue.statusHistory || []).slice().sort((a,b) => new Date(a.changedAt) - new Date(b.changedAt)).map((h, idx) => (
                  <div key={idx} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
                    <div style={{ fontWeight: 700 }}>{h.status} <span style={{ fontWeight: 400, marginLeft: 8 }}>{h.by ? `by ${h.by}` : ""}</span></div>
                    <div style={{ color: "#555", fontSize: 13 }}>{h.note}</div>
                    <div style={{ color: "#888", fontSize: 12 }}>{h.changedAt ? new Date(h.changedAt).toLocaleString() : ""}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside style={{ width: 320 }}>
            <div style={{ marginBottom: 12 }}>
              <div><strong>Current status</strong></div>
              <div style={{ padding: 8, marginTop: 6, background: "#f5f5f5", borderRadius: 6 }}>{issue.status}</div>
            </div>

            {/* ✅ Only admins see these controls */}
            {user?.role === "admin" && (
              <>
                <div style={{ marginBottom: 12 }}>
                  <div><strong>Quick actions</strong></div>
                  <div style={{ marginTop: 8 }}>
                    {nextStatuses.length === 0 ? <div style={{ color: "#555" }}>No allowed transitions</div> : nextStatuses.map(s => (
                      <div key={s} style={{ marginBottom: 6 }}>
                        <button onClick={() => handleStatusChange(s)}>{s}</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div><strong>Assign department</strong></div>
                  <select onChange={(e) => handleAssign(e.target.value)} defaultValue="">
                    <option value="">Choose</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Sanitation">Sanitation</option>
                    <option value="Public Works">Public Works</option>
                    <option value="Roads">Roads</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <strong>Small map</strong>
              {issue.coords && issue.coords.coordinates ? (
                <div style={{ height: 200, marginTop: 8 }}>
                  <MapView issues={[issue]} onMarkerClick={() => {}} />
                </div>
              ) : (
                <div style={{ color: "#666", marginTop: 8 }}>No coordinates</div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
