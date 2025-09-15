// src/pages/CitizenLogin.jsx
import React, { useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api";

function CitizenLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      console.log("Login response (res.data) =>", res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("citizenId", res.data.user.id);
      navigate("/report");
    } catch (err) {
      alert(err?.response?.data?.error || "Login failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage:
          "url('https://wallpaper-mania.com/wp-content/uploads/2018/09/High_resolution_wallpaper_background_ID_77700010542.jpg')", // civic background
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
        <Card className="p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
          <h2 className="text-center mb-4">Citizen Login</h2>
          <Form onSubmit={submit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-grid">
              <Button type="submit" variant="success">
                Login
              </Button>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
}

export default CitizenLogin;