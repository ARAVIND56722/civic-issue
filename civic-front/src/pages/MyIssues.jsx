// src/pages/MyIssues.jsx
import React, { useEffect, useState, useContext, useCallback } from "react";
import { Container, Row, Col, Card, Button, Spinner, Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../contexts/AuthContext";
import IssueDetailModal from "../components/IssueDetailModal";
import NotificationBell from "../components/NotificationBell";
import NotificationListener from "../components/NotificationListener";

export default function MyIssues() {
  const [issues, setIssues] = useState([]);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const citizenId = localStorage.getItem("citizenId");

  const fetchIssues = useCallback(() => {
    if (!citizenId) return;
    setLoading(true);
    api.get(`/issues?reporterId=${citizenId}`)
      .then(res => {
        setIssues(res.data.items || res.data || []);
      })
      .catch(err => console.error("Failed to fetch issues", err))
      .finally(() => setLoading(false));
  }, [citizenId]);

  useEffect(() => {
    fetchIssues();
  }, [citizenId, fetchIssues]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <NotificationListener />
      
      {/* Premium Header */}
      <Navbar expand="lg" variant="dark" className="border-bottom" style={{ background: "rgba(15, 23, 42, 0.9)", backdropFilter: "blur(12px)", borderColor: "var(--card-border) !important" }}>
        <Container>
          <Navbar.Brand href="#" onClick={() => navigate("/report")} style={{ fontWeight: "800", color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", borderRadius: "8px", display: "flex", alignItems: "center", justifyCenter: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ margin: "auto" }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            CivicCare
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="citizen-navbar" />
          <Navbar.Collapse id="citizen-navbar">
            <Nav className="me-auto">
              <Nav.Link onClick={() => navigate("/report")} style={{ fontWeight: "600" }}>Report Issue</Nav.Link>
              <Nav.Link onClick={() => navigate("/my-issues")} active style={{ fontWeight: "600" }}>My Issues</Nav.Link>
            </Nav>
            <Nav className="align-items-center gap-3">
              <NotificationBell />
              <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                Hello, <strong style={{ color: "#fff" }}>{user?.name || "Citizen"}</strong>
              </div>
              <Button size="sm" className="btn-premium-secondary" onClick={handleLogout}>
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4 animate-fadeIn">
          <div>
            <h2 style={{ fontWeight: "800", letterSpacing: "-0.02em" }}>My Reported Issues</h2>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>View tracking details and update histories of your reported issues.</p>
          </div>
          <Button className="btn-premium-primary" onClick={() => navigate("/report")}>
            + Report New
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <div className="mt-2 text-muted">Retrieving submissions...</div>
          </div>
        ) : issues.length === 0 ? (
          <Card className="glass-panel text-center p-5 border-0">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" className="mb-3 mx-auto">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h4>No Issues Reported Yet</h4>
            <p className="text-muted">You haven't filed any issue reports. Click above to submit your first report!</p>
          </Card>
        ) : (
          <Row className="g-4">
            {issues.map((issue) => (
              <Col key={issue._id} xs={12} sm={6} md={4}>
                <Card className="glass-panel hover-scale h-100 border-0 flex-column d-flex overflow-hidden">
                  {issue.photoUrl ? (
                    <div style={{ height: "180px", overflow: "hidden", position: "relative" }}>
                      <Card.Img
                        variant="top"
                        src={issue.photoUrl}
                        style={{ height: "100%", width: "100%", objectFit: "cover" }}
                      />
                      <div style={{ position: "absolute", top: "12px", right: "12px" }}>
                        <span className={`status-badge status-${issue.status}`}>
                          {issue.status}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ height: "180px", background: "rgba(15, 23, 42, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <div style={{ position: "absolute", top: "12px", right: "12px" }}>
                        <span className={`status-badge status-${issue.status}`}>
                          {issue.status}
                        </span>
                      </div>
                    </div>
                  )}

                  <Card.Body className="d-flex flex-column p-4">
                    <div style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", color: "var(--primary-color)", marginBottom: "4px" }}>
                      {issue.category || "General"}
                    </div>
                    <Card.Title style={{ fontWeight: "700", fontSize: "18px", color: "#fff", marginBottom: "8px", lineClamp: 1, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {issue.title}
                    </Card.Title>
                    <Card.Text style={{ fontSize: "14px", color: "var(--text-muted)", lineClamp: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", flexGrow: 1, marginBottom: "16px" }}>
                      {issue.description || "No description provided."}
                    </Card.Text>
                    
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <span className="text-muted" style={{ fontSize: "12px" }}>
                        {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : ""}
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        className="btn-premium-primary"
                        style={{ padding: "6px 16px", fontSize: "13px" }}
                        onClick={() => setSelectedIssueId(issue._id)}
                      >
                        Track Status
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Modal for detailed view */}
      {selectedIssueId && (
        <IssueDetailModal
          issueId={selectedIssueId}
          onClose={() => setSelectedIssueId(null)}
          mode="citizen"
          onUpdated={fetchIssues}
        />
      )}
    </div>
  );
}
