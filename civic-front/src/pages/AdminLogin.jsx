// src/pages/AdminLogin.jsx
import React, { useState, useContext } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../contexts/AuthContext";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      
      const userData = {
        ...res.data.user,
        _id: res.data.user.id || res.data.user._id,
      };
      login(userData);
      navigate("/admin"); // redirect to AdminDashboard
    } catch (err) {
      alert(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "var(--bg-app)",
        backgroundImage: "radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.08), transparent 50%)",
        padding: "24px 0",
      }}
    >
      <Container className="d-flex justify-content-center align-items-center">
        <Card className="glass-panel p-5 shadow" style={{ maxWidth: "420px", width: "100%", border: "1px solid var(--card-border)" }}>
          <div className="text-center mb-4">
            <h2 style={{ fontWeight: "800", letterSpacing: "-0.02em", marginBottom: "8px" }}>Admin Login</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Authorized administrative personnel only</p>
          </div>
          
          <Form onSubmit={submit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: "14px", fontWeight: "600", color: "#cbd5e1" }}>Admin Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="admin@civic.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="modern-input"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label style={{ fontSize: "14px", fontWeight: "600", color: "#cbd5e1" }}>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="modern-input"
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button type="submit" className="btn-premium-primary" disabled={loading} style={{ padding: "12px", background: "linear-gradient(135deg, var(--success-color) 0%, #047857 100%)", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)" }}>
                {loading ? "Logging in..." : "Access Control"}
              </Button>
              <Button type="button" variant="link" onClick={() => navigate("/")} style={{ color: "var(--text-muted)", fontSize: "13px", textDecoration: "none" }}>
                ← Back to Home
              </Button>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
}

export default AdminLogin;
