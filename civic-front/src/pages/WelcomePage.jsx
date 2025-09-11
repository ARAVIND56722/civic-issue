// src/pages/WelcomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function WelcomePage() {
  const navigate = useNavigate();

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <Card className="p-5 text-center shadow" style={{ maxWidth: "500px" }}>
        <h1 className="mb-4">Welcome to Civic Issue Reporting</h1>
        <p className="mb-4">Please click any of these to continue.</p>

        {/* Sign In button */}
        <Button
          variant="primary"
          className="mb-3 w-100"
          onClick={() => navigate("/login")}
        >
          Sign in
        </Button>

        {/* Sign Up button */}
        <Button
          variant="primary"
          className="w-100"
          onClick={() => navigate("/signup")}
        >
          Sign up
        </Button>
      </Card>
    </Container>
  );
}

export default WelcomePage;