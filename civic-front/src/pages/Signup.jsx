import React, { useState } from "react";
import { Container, Card, Form, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api"; // your axios instance, should point to http://localhost:5000/api


export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <Card className="p-4" style={{ width: 420 }}>
        <h3 className="mb-3 text-center">Create an account</h3>
        <Form onSubmit={submit}>
          <Form.Group className="mb-2">
            <Form.Label>Full name</Form.Label>
            <Form.Control value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@mail.com" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="min 6 chars" />
          </Form.Group>

          <div className="d-grid">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (<><Spinner animation="border" size="sm" /> Signing up...</>) : "Sign up"}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
