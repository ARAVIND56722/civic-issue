import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";

function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage:
          "url('https://img.freepik.com/premium-vector/abstract-blue-wavy-with-blurred-light-curved-lines-background_41814-2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card
        className="shadow-lg text-center"
        style={{
          maxWidth: "400px",
          width: "90%",
          padding: "30px 25px",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1
          style={{
            fontWeight: "700",
            marginBottom: "10px",
            color: "#2c3e50",
            fontSize: "28px",
          }}
        >
          Civic Issue Reporting
        </h1>
        <p style={{ fontSize: "15px", marginBottom: "25px", color: "#555" }}>
          Report. Track. Resolve. Together.
        </p>

        {/* Sign In Button */}
        <Button
          variant="primary"
          size="lg"
          style={{
            borderRadius: "30px",
            marginBottom: "15px",
            width: "100%",
            backgroundColor: "#0d6efd", // force blue
            borderColor: "#0d6efd",
          }}
          onClick={() => navigate("/login")}
        >
          Sign In
        </Button>

        {/* Sign Up Button - force same blue */}
        <Button
          variant="primary"
          size="lg"
          style={{
            borderRadius: "30px",
            width: "100%",
            backgroundColor: "#0d6efd", // force blue
            borderColor: "#0d6efd",
          }}
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </Button>
      </Card>
    </div>
  );
}

export default WelcomePage;