// src/components/AdminDashboard.jsx
import React, { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import socket from "../socket";
import IssueDetailModal from "./IssueDetailModal";
import MapView from "./MapView";
import { AuthContext } from "../contexts/AuthContext";
import NotificationBell from "./NotificationBell";
import NotificationListener from "./NotificationListener";
import { Container, Navbar, Nav, Button, Row, Col, Card, Spinner, Table } from "react-bootstrap";

export default function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  // Check admin role
  useEffect(() => {
    async function check() {
      try {
        const res = await api.get("/auth/me");
        if (res.data.role !== "admin") {
          alert("Admin access required");
          navigate("/");
        } else {
          setIsAuthorized(true);
        }
      } catch (err) {
        navigate("/login");
      }
    }
    check();
  }, [navigate]);

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
        note: "Changed via Admin Dashboard Quick Actions",
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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Metrics calculators
  const stats = {
    total: issues.length,
    submitted: issues.filter((it) => it.status === "submitted").length,
    acknowledged: issues.filter((it) => it.status === "acknowledged").length,
    inProgress: issues.filter((it) => it.status === "in-progress").length,
    resolved: issues.filter((it) => it.status === "resolved").length,
  };

  const statusVariant = {
    submitted: "status-submitted",
    acknowledged: "status-acknowledged",
    "in-progress": "status-in-progress",
    resolved: "status-resolved",
  };

  if (!isAuthorized) {
    return <div style={{ height: "100vh", background: "var(--bg-app)" }} />;
  }

  return (
    <div>
      <NotificationListener />

      {/* Premium Header */}
      <Navbar expand="lg" variant="dark" className="border-bottom" style={{ background: "rgba(15, 23, 42, 0.9)", backdropFilter: "blur(12px)", borderColor: "var(--card-border) !important" }}>
        <Container fluid className="px-lg-5">
          <Navbar.Brand href="#" onClick={() => navigate("/admin")} style={{ fontWeight: "800", color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, var(--success-color), #047857)", borderRadius: "8px", display: "flex", alignItems: "center", justifyCenter: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ margin: "auto" }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            CivicCare <span style={{ fontSize: "12px", fontWeight: "600", padding: "2px 8px", background: "rgba(255,255,255,0.1)", borderRadius: "6px", marginLeft: "6px", color: "var(--success-color)" }}>Admin</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="admin-navbar" />
          <Navbar.Collapse id="admin-navbar">
            <Nav className="me-auto" />
            <Nav className="align-items-center gap-3">
              <NotificationBell />
              <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                Hello Admin, <strong style={{ color: "#fff" }}>{user?.name || "Officer"}</strong>
              </div>
              <Button size="sm" className="btn-premium-secondary" onClick={handleLogout}>
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="py-4 px-lg-5">
        {/* Metric Summary Cards */}
        <Row className="g-3 mb-4">
          <Col xs={6} md={2.4} style={{ width: "20%" }}>
            <Card className="glass-panel text-center p-3 border-0 h-100">
              <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "600" }}>Total Issues</div>
              <h2 className="mt-2 mb-0" style={{ fontWeight: "800", color: "#fff" }}>{stats.total}</h2>
            </Card>
          </Col>
          <Col xs={6} md={2.4} style={{ width: "20%" }}>
            <Card className="glass-panel text-center p-3 border-0 h-100" style={{ borderLeft: "3px solid #cbd5e1 !important" }}>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "600" }}>Submitted</div>
              <h2 className="mt-2 mb-0" style={{ fontWeight: "800", color: "#cbd5e1" }}>{stats.submitted}</h2>
            </Card>
          </Col>
          <Col xs={6} md={2.4} style={{ width: "20%" }}>
            <Card className="glass-panel text-center p-3 border-0 h-100" style={{ borderLeft: "3px solid #93c5fd !important" }}>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "600" }}>Acknowledged</div>
              <h2 className="mt-2 mb-0" style={{ fontWeight: "800", color: "#93c5fd" }}>{stats.acknowledged}</h2>
            </Card>
          </Col>
          <Col xs={6} md={2.4} style={{ width: "20%" }}>
            <Card className="glass-panel text-center p-3 border-0 h-100" style={{ borderLeft: "3px solid #fcd34d !important" }}>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "600" }}>In Progress</div>
              <h2 className="mt-2 mb-0" style={{ fontWeight: "800", color: "#fcd34d" }}>{stats.inProgress}</h2>
            </Card>
          </Col>
          <Col xs={6} md={2.4} style={{ width: "20%" }}>
            <Card className="glass-panel text-center p-3 border-0 h-100" style={{ borderLeft: "3px solid #6ee7b7 !important" }}>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "600" }}>Resolved</div>
              <h2 className="mt-2 mb-0" style={{ fontWeight: "800", color: "#6ee7b7" }}>{stats.resolved}</h2>
            </Card>
          </Col>
        </Row>

        {/* Map Panel */}
        <Card className="glass-panel mb-4 overflow-hidden border-0 shadow">
          <Card.Header className="bg-transparent border-bottom p-3 d-flex align-items-center" style={{ borderColor: "rgba(255,255,255,0.08) !important" }}>
            <h5 className="mb-0" style={{ fontWeight: "700" }}>🗺️ Real-time Incident Heatmap</h5>
          </Card.Header>
          <div style={{ height: "360px", position: "relative" }}>
            <MapView
              issues={issues}
              onMarkerClick={(issue) => setSelectedId(issue._id)}
            />
          </div>
        </Card>

        {/* Data Table */}
        <Card className="glass-panel border-0 shadow overflow-hidden">
          <Card.Header className="bg-transparent border-bottom p-3 d-flex justify-content-between align-items-center" style={{ borderColor: "rgba(255,255,255,0.08) !important" }}>
            <h5 className="mb-0" style={{ fontWeight: "700" }}>📋 Incident Records</h5>
            <Button size="sm" className="btn-premium-secondary" onClick={fetchIssues}>
              🔄 Refresh List
            </Button>
          </Card.Header>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <div className="mt-2 text-muted">Loading incidents...</div>
            </div>
          ) : (
            <Table hover responsive className="admin-incidents-table" style={{ margin: 0, background: "transparent" }}>
              <thead style={{ background: "rgba(15, 23, 42, 0.4)" }}>
                <tr style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                  <th style={{ padding: "16px", color: "var(--text-muted)", borderBottom: "none" }}>Title</th>
                  <th style={{ padding: "16px", color: "var(--text-muted)", borderBottom: "none" }}>Category</th>
                  <th style={{ padding: "16px", color: "var(--text-muted)", borderBottom: "none" }}>Status</th>
                  <th style={{ padding: "16px", color: "var(--text-muted)", borderBottom: "none" }}>Department</th>
                  <th style={{ padding: "16px", color: "var(--text-muted)", borderBottom: "none" }}>Evidence</th>
                  <th style={{ padding: "16px", color: "var(--text-muted)", borderBottom: "none", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((it) => (
                  <tr key={it._id} style={{ borderColor: "rgba(255,255,255,0.06)", verticalAlign: "middle", background: "transparent" }}>
                    <td style={{ padding: "16px", fontWeight: "600", color: "#fff", background: "transparent" }}>{it.title}</td>
                    <td style={{ padding: "16px", color: "var(--text-muted)", background: "transparent" }}>{it.category || "—"}</td>
                    <td style={{ padding: "16px", background: "transparent" }}>
                      <span className={`status-badge ${statusVariant[it.status] || "status-submitted"}`}>
                        {it.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px", background: "transparent" }}>
                      <strong style={{ color: it.assignedDepartment ? "#cbd5e1" : "var(--text-muted)" }}>
                        {it.assignedDepartment || "Unassigned"}
                      </strong>
                    </td>
                    <td style={{ padding: "16px", background: "transparent" }}>
                      {it.photoUrl ? (
                        <img
                          src={it.photoUrl}
                          alt="Evidence"
                          style={{
                            width: 60,
                            height: 44,
                            objectFit: "cover",
                            borderRadius: 6,
                            border: "1px solid rgba(255,255,255,0.1)"
                          }}
                        />
                      ) : (
                        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>None</span>
                      )}
                    </td>
                    <td style={{ padding: "16px", textAlign: "right", background: "transparent" }}>
                      <div className="d-inline-flex gap-2 justify-content-end align-items-center">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          style={{ borderRadius: "8px", fontWeight: "600", fontSize: "13px" }}
                          onClick={() => setSelectedId(it._id)}
                        >
                          Details
                        </Button>

                        {/* Assign Dropdown */}
                        <select
                          className="form-select form-select-sm"
                          style={{ fontSize: "13px", height: "31px", minWidth: "120px", background: "var(--input-bg)", color: "var(--text-main)", borderColor: "var(--input-border)" }}
                          onChange={(e) => quickAssign(it._id, e.target.value)}
                          defaultValue=""
                        >
                          <option value="">Assign Dept</option>
                          <option value="Electricity">Electricity</option>
                          <option value="Sanitation">Sanitation</option>
                          <option value="Public Works">Public Works</option>
                          <option value="Roads">Roads</option>
                        </select>

                        {/* Status updates */}
                        {(allowedTransitions[it.status] || []).map((s) => (
                          <Button
                            key={s}
                            size="sm"
                            style={{
                              borderRadius: "8px",
                              fontWeight: "600",
                              fontSize: "12px",
                              padding: "4px 10px"
                            }}
                            className={s === "resolved" ? "btn-success" : "btn-primary"}
                            onClick={() => quickChangeStatus(it._id, s)}
                          >
                            Mark {s}
                          </Button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Container>

      {/* Detail view Modal */}
      {selectedId && (
        <IssueDetailModal
          issueId={selectedId}
          onClose={() => setSelectedId(null)}
          onUpdated={fetchIssues}
        />
      )}
    </div>
  );
}
