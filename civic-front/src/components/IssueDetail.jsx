// src/components/IssueDetail.jsx
import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import socket from "../socket";
import { AuthContext } from "../contexts/AuthContext";
import MapView from "./MapView";
import NotificationBell from "./NotificationBell";
import NotificationListener from "./NotificationListener";
import { Container, Navbar, Nav, Button, Card, Row, Col, Spinner } from "react-bootstrap";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchIssue = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/issues/${id}`);
      setIssue(res.data);
    } catch (err) {
      console.error("Failed to load issue", err);
      alert("Failed to load issue");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchIssue();
  }, [fetchIssue]);

  useEffect(() => {
    const onStatus = (data) => {
      if (!data) return;
      if (String(data.issueId) === String(id)) {
        fetchIssue();
      }
    };

    const onAssign = (data) => {
      if (!data) return;
      if (String(data.issueId) === String(id)) {
        fetchIssue();
      }
    };

    socket.on("issueStatusUpdated", onStatus);
    socket.on("issueAssigned", onAssign);

    return () => {
      socket.off("issueStatusUpdated", onStatus);
      socket.off("issueAssigned", onAssign);
    };
  }, [id, fetchIssue]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading && !issue) return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" />
      <div className="mt-2 text-muted">Loading issue details...</div>
    </div>
  );

  if (!issue) return <div className="text-center py-5 text-muted">No issue found.</div>;

  const history = (issue.statusHistory || []).slice().sort((a, b) => new Date(a.changedAt || a._id) - new Date(b.changedAt || b._id));

  const statusVariant = {
    submitted: "status-submitted",
    acknowledged: "status-acknowledged",
    "in-progress": "status-in-progress",
    resolved: "status-resolved",
  };

  return (
    <div>
      <NotificationListener />

      {/* Premium Header */}
      <Navbar expand="lg" variant="dark" className="border-bottom" style={{ background: "rgba(15, 23, 42, 0.9)", backdropFilter: "blur(12px)", borderColor: "var(--card-border) !important" }}>
        <Container>
          <Navbar.Brand href="#" onClick={() => navigate(user?.role === "admin" ? "/admin" : "/report")} style={{ fontWeight: "800", color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", borderRadius: "8px", display: "flex", alignItems: "center", justifyCenter: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ margin: "auto" }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            CivicCare
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="detail-navbar" />
          <Navbar.Collapse id="detail-navbar">
            <Nav className="me-auto">
              <Nav.Link onClick={() => navigate(user?.role === "admin" ? "/admin" : "/report")} style={{ fontWeight: "600" }}>Dashboard</Nav.Link>
            </Nav>
            <Nav className="align-items-center gap-3">
              <NotificationBell />
              <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                Hello, <strong style={{ color: "#fff" }}>{user?.name || "User"}</strong>
              </div>
              <Button size="sm" className="btn-premium-secondary" onClick={handleLogout}>
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="py-5" style={{ maxWidth: "860px" }}>
        <Card className="glass-panel p-4 p-md-5 border-0 shadow">
          {/* Header section */}
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
            <Button className="btn-premium-secondary" size="sm" onClick={() => navigate(-1)}>
              ← Back
            </Button>
          </div>

          <Row className="g-4">
            <Col md={7}>
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
                  {history.length === 0 ? (
                    <div className="text-muted" style={{ fontSize: "14px" }}>No status updates yet.</div>
                  ) : history.map((h, idx) => (
                    <div key={idx} style={{ position: "relative", marginBottom: "20px" }}>
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
                        {formatDate(h.changedAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Col>

            <Col md={5}>
              <Card className="glass-panel overflow-hidden border-0 shadow mb-4">
                <Card.Header className="bg-transparent border-bottom p-3" style={{ borderColor: "rgba(255,255,255,0.08) !important" }}>
                  <h6 className="mb-0" style={{ fontWeight: "700" }}>📁 Assignment Details</h6>
                </Card.Header>
                <Card.Body className="p-3">
                  <div><strong>Assigned Department:</strong></div>
                  <div className="text-muted mt-1">{issue.assignedDepartment || "Unassigned"}</div>
                </Card.Body>
              </Card>

              {/* Map Panel */}
              <Card className="glass-panel overflow-hidden border-0 shadow">
                <Card.Header className="bg-transparent border-bottom p-3" style={{ borderColor: "rgba(255,255,255,0.08) !important" }}>
                  <h6 className="mb-0" style={{ fontWeight: "700" }}>📍 Map Coordinates</h6>
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
        </Card>
      </Container>
    </div>
  );
}
