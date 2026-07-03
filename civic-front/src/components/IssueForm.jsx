// src/components/IssueForm.jsx
import React, { useState, useContext, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { Form, Button, Spinner, Card, Container, Navbar, Nav } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import NotificationBell from "./NotificationBell";
import NotificationListener from "./NotificationListener";

export default function IssueForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState(null);
  const [latLng, setLatLng] = useState({ lat: "", lng: "" });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const getMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLatLng({ lat, lng });
        setLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      },
      (err) => alert("Unable to get location: " + err.message),
      { enableHighAccuracy: true }
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      fd.append("category", category);
      fd.append("location", location);
      
      if (latLng.lat && latLng.lng) {
        fd.append("lat", latLng.lat);
        fd.append("lng", latLng.lng);
      }
      if (photo) fd.append("photo", photo);

      for (let pair of fd.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      
      await api.post("/issues", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Issue Submitted!");
      // Reset form
      setTitle("");
      setDescription("");
      setCategory("");
      setLocation("");
      setPhoto(null);
      setLatLng({ lat: "", lng: "" });
    } catch (err) {
      console.error(err);
      alert("Error: " + (err?.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

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
              <Nav.Link onClick={() => navigate("/report")} active style={{ fontWeight: "600" }}>Report Issue</Nav.Link>
              <Nav.Link onClick={() => navigate("/my-issues")} style={{ fontWeight: "600" }}>My Issues</Nav.Link>
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
      <Container className="py-5" style={{ maxWidth: "680px" }}>
        <Card className="glass-panel p-4 p-md-5 shadow-lg border-0">
          <div className="mb-4">
            <h3 style={{ fontWeight: "800", letterSpacing: "-0.02em", color: "#fff" }}>Report a Civic Issue</h3>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>Provide details below. Submissions will automatically route to the corresponding department.</p>
          </div>

          <Form onSubmit={submit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: "14px", fontWeight: "600", color: "#cbd5e1" }}>Issue Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="E.g., Pothole on 5th Avenue, broken street lamp"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="modern-input"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: "14px", fontWeight: "600", color: "#cbd5e1" }}>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Please describe the issue in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="modern-input"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: "14px", fontWeight: "600", color: "#cbd5e1" }}>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="E.g., Sanitation, Roads, Electricity, Water"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="modern-input"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label style={{ fontSize: "14px", fontWeight: "600", color: "#cbd5e1" }}>Location Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Street address, landmarks..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="modern-input mb-2"
              />
              <div className="d-flex align-items-center justify-content-between">
                <Button
                  variant="outline-primary"
                  size="sm"
                  type="button"
                  onClick={getMyLocation}
                  style={{ borderRadius: "8px", fontWeight: "600", fontSize: "13px" }}
                >
                  📍 Use My GPS Coordinates
                </Button>
                {latLng.lat && (
                  <span className="text-muted" style={{ fontSize: "12px" }}>
                    Coords: {Number(latLng.lat).toFixed(4)}, {Number(latLng.lng).toFixed(4)}
                  </span>
                )}
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label style={{ fontSize: "14px", fontWeight: "600", color: "#cbd5e1" }}>Upload Photo Evidence</Form.Label>
              <div style={{
                border: "2px dashed rgba(255, 255, 255, 0.15)",
                borderRadius: "12px",
                padding: "24px",
                textAlign: "center",
                background: "rgba(15, 23, 42, 0.4)",
                cursor: "pointer",
                transition: "border-color 0.2s",
                position: "relative"
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  setPhoto(e.dataTransfer.files[0]);
                }
              }}>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  style={{
                    position: "absolute",
                    top: 0, left: 0, width: "100%", height: "100%",
                    opacity: 0, cursor: "pointer", zIndex: 2
                  }}
                />
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2.5" style={{ marginBottom: "8px", pointerEvents: "none" }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <div style={{ fontWeight: "600", fontSize: "14px", pointerEvents: "none" }}>
                  {photo ? photo.name : "Drag & drop or click to choose photo"}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px", pointerEvents: "none" }}>
                  Supports JPEG, PNG, WEBP
                </div>
              </div>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button type="submit" className="btn-premium-primary" disabled={loading} style={{ padding: "12px" }}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" /> Submitting issue...
                  </>
                ) : (
                  "Submit Issue Report"
                )}
              </Button>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
}
