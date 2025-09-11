import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function LoginChoice() {
  const navigate = useNavigate();

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
      <Card className="p-5 text-center shadow" style={{ maxWidth: "500px" }}>
        <h2 className="mb-4">Login as</h2>
        <div className="d-flex flex-column gap-3">
          <Button variant="primary" onClick={() => navigate("/login/citizen")}>Citizen</Button>
          <Button variant="secondary" onClick={() => navigate("/login/admin")}>Admin</Button>

        </div>
      </Card>
    </Container>
  );
}

export default LoginChoice;
