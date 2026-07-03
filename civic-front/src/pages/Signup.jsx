import React, { useState, useContext } from "react";
import { Container, Card, Form, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../contexts/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", {
        name,
        email,
        password,
        role: "citizen",
      });

      // save token and citizen id (your backend returns user.id)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("citizenId", res.data.user?.id || res.data.user?._id);

      const userData = {
        ...res.data.user,
        _id: res.data.user?.id || res.data.user?._id,
      };
      login(userData);

      alert("Signup successful — logged in as citizen");
      navigate("/report"); // go to reporting page
    } catch (err) {
      console.error("Signup error", err);
      alert(err?.response?.data?.error || (err?.response?.data?.errors && err.response.data.errors[0].msg) || "Signup failed");
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
        backgroundImage: "radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.1), transparent 50%)",
        padding: "24px 0",
      }}
    >
      <Container className="d-flex justify-content-center align-items-center">
        <Card className="glass-panel p-5 shadow" style={{ maxWidth: "440px", width: "100%", border: "1px solid var(--card-border)" }}>
          <div className="text-center mb-4">
            <h2 style={{ fontWeight: "800", letterSpacing: "-0.02em", marginBottom: "8px" }}>Create Account</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Register to report civic concerns and monitor resolutions</p>
          </div>
          <Form onSubmit={submit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: "14px", fontWeight: "600", color: "#cbd5e1" }}>Full Name</Form.Label>
              <Form.Control 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="John Doe" 
                className="modern-input"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: "14px", fontWeight: "600", color: "#cbd5e1" }}>Email Address</Form.Label>
              <Form.Control 
                required 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="you@mail.com" 
                className="modern-input"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label style={{ fontSize: "14px", fontWeight: "600", color: "#cbd5e1" }}>Password</Form.Label>
              <Form.Control 
                required 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="At least 6 characters" 
                className="modern-input"
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button type="submit" className="btn-premium-primary" disabled={loading} style={{ padding: "12px" }}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Creating Account...
                  </>
                ) : (
                  "Register Account"
                )}
              </Button>
              <Button type="button" variant="link" onClick={() => navigate("/")} style={{ color: "var(--text-muted)", fontSize: "13px", textDecoration: "none" }}>
                Already have an account? Sign In
              </Button>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
}
