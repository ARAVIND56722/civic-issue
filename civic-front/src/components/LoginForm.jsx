// src/components/LoginForm.jsx
import React, { useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";

function LoginForm({ role, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // call parent onLogin with credentials
    onLogin({ email, password });
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
      <Card className="p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">{role} Login</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </Form.Group>
          <div className="d-grid">
            <Button type="submit" variant="primary">Login</Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default LoginForm;
