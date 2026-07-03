// src/components/IssueDetailModal.jsx
import React, { useEffect, useState, useContext, useCallback } from "react";
import api from "../api";
import MapView from "./MapView";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext";
import { Spinner, Button, Row, Col, Card } from "react-bootstrap";

const allowedTransitions = {
  submitted: ["acknowledged"],
  acknowledged: ["in-progress", "resolved"],
  "in-progress": ["resolved"],
  resolved: [],
};

export default function IssueDetailModal({ issueId, onClose, onUpdated }) {
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchIssue = useCallback(async () => {
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
  }, [issueId]);

  useEffect(() => {
    if (issueId) fetchIssue();
  }, [issueId, fetchIssue]);

  if (!issueId) return null;

  if (loading && !issue) return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(3, 7, 18, 0.8)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    }}>
      <div className="glass-panel p-5 text-center" style={{ maxWidth: "200px" }}>
        <Spinner animation="border" variant="primary" />
        <div className="mt-2 text-muted">Retrieving details...</div>
      </div>
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

  const statusVariant = {
    submitted: "status-submitted",
    acknowledged: "status-acknowledged",
    "in-progress": "status-in-progress",
    resolved: "status-resolved",
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(3, 7, 18, 0.85)",
      backdropFilter: "blur(12px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      padding: "20px"
    }}>
      <div className="glass-panel p-4 p-md-5" style={{
        width: "100%",
        maxWidth: "980px",
        maxHeight: "90vh",
        overflowY: "auto",
        border: "1px solid var(--card-border)",
        position: "relative"
      }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <div className="d-flex align-items-center gap-3 mb-2">
              <span className={`status-badge ${statusVariant[issue.status] || "status-submitted"}`}>
                {issue.status}
              </span>
              <span style={{ color: "var(--primary-color)", fontSize: "14px", fontWeight: "700", textTransform: "uppercase" }}>
                {issue.category || "General"}
              </span>
            </div>
            <h2 className="mb-0" style={{ fontWeight: "800", color: "#fff" }}>{issue.title}</h2>
          </div>
          <Button className="btn-premium-secondary" size="sm" onClick={onClose}>
            ✕ Close
          </Button>
        </div>

        <Row className="g-4">
          {/* Main Info */}
          <Col lg={7}>
            <div className="mb-4">
              <h5 style={{ fontWeight: "700", color: "#fff" }}>📍 Incident Location</h5>
              <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>{issue.location || "No address details provided."}</p>
            </div>

            <div className="mb-4">
              <h5 style={{ fontWeight: "700", color: "#fff" }}>📝 Description</h5>
              <p style={{ color: "var(--text-muted)", fontSize: "15px", whiteSpace: "pre-line" }}>{issue.description || "No description provided."}</p>
            </div>

            {issue.photoUrl && (
              <div className="mb-4">
                <h5 style={{ fontWeight: "700", color: "#fff", marginBottom: "12px" }}>📸 Image Evidence</h5>
                <img
                  src={issue.photoUrl}
                  alt="Evidence"
                  style={{
                    width: "100%",
                    maxHeight: "360px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.08)"
                  }}
                />
              </div>
            )}

            {/* Timeline */}
            <div className="mb-4">
              <h5 style={{ fontWeight: "700", color: "#fff", marginBottom: "16px" }}>🕒 Status Timeline</h5>
              <div style={{ position: "relative", paddingLeft: "24px", borderLeft: "2px dashed rgba(255,255,255,0.1)" }}>
                {(issue.statusHistory || []).slice().sort((a,b) => new Date(a.changedAt) - new Date(b.changedAt)).map((h, idx) => (
                  <div key={idx} style={{ position: "relative", marginBottom: "20px" }}>
                    {/* Bullet circle */}
                    <div style={{
                      position: "absolute",
                      left: "-33px",
                      top: "2px",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: h.status === "resolved" ? "var(--success-color)" : h.status === "in-progress" ? "var(--warning-color)" : h.status === "acknowledged" ? "var(--primary-color)" : "#94a3b8",
                      border: "3px solid #090d16",
                      boxShadow: "0 0 10px currentColor"
                    }} />
                    <div style={{ fontWeight: "700", textTransform: "capitalize", color: "#fff" }}>
                      {h.status}
                      {h.by && <span style={{ fontWeight: "400", color: "var(--text-muted)", fontSize: "13px", marginLeft: "8px" }}>by {h.by}</span>}
                    </div>
                    {h.note && <div style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>{h.note}</div>}
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginTop: "2px" }}>
                      {h.changedAt ? new Date(h.changedAt).toLocaleString() : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          {/* Map and Administration */}
          <Col lg={5}>
            {user?.role === "admin" && (
              <Card className="glass-panel p-4 mb-4 border-0" style={{ background: "rgba(15, 23, 42, 0.4)" }}>
                <h5 style={{ fontWeight: "700", color: "#fff", marginBottom: "16px" }}>⚙️ Incident Management</h5>

                <div className="mb-3">
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px" }}>Quick State Transition</div>
                  <div className="d-flex flex-wrap gap-2">
                    {nextStatuses.length === 0 ? (
                      <span className="text-muted" style={{ fontSize: "13px" }}>No transitions available (Resolved)</span>
                    ) : nextStatuses.map(s => (
                      <Button
                        key={s}
                        size="sm"
                        onClick={() => handleStatusChange(s)}
                        style={{ textTransform: "capitalize", borderRadius: "8px", fontWeight: "600" }}
                        variant={s === "resolved" ? "success" : "primary"}
                      >
                        Mark as {s}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="mb-2">
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px" }}>Assign Department</div>
                  <select
                    className="modern-input w-100"
                    onChange={(e) => handleAssign(e.target.value)}
                    value={issue.assignedDepartment || ""}
                  >
                    <option value="">Select Department</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Sanitation">Sanitation</option>
                    <option value="Public Works">Public Works</option>
                    <option value="Roads">Roads</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </Card>
            )}

            {/* Map panel */}
            <Card className="glass-panel overflow-hidden border-0 shadow">
              <Card.Header className="bg-transparent border-bottom p-3" style={{ borderColor: "rgba(255,255,255,0.08) !important" }}>
                <h6 className="mb-0" style={{ fontWeight: "700" }}>📍 Map Location</h6>
              </Card.Header>
              <div style={{ height: "240px" }}>
                {issue.coords && issue.coords.coordinates ? (
                  <MapView issues={[issue]} onMarkerClick={() => {}} />
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 bg-dark text-muted" style={{ fontSize: "13px" }}>
                    No coordinate telemetry available
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
