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
        background: "var(--bg-app)",
        backgroundImage: "radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15), transparent 40%), radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.1), transparent 45%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Blur Orbs */}
      <div style={{
        position: "absolute",
        width: "300px",
        height: "300px",
        background: "rgba(59, 130, 246, 0.18)",
        borderRadius: "50%",
        filter: "blur(80px)",
        top: "10%",
        right: "15%",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        width: "250px",
        height: "250px",
        background: "rgba(16, 185, 129, 0.12)",
        borderRadius: "50%",
        filter: "blur(80px)",
        bottom: "10%",
        left: "15%",
        pointerEvents: "none",
      }} />

      <Card
        className="glass-panel text-center"
        style={{
          maxWidth: "440px",
          width: "90%",
          padding: "40px 32px",
          border: "1px solid var(--card-border)",
          zIndex: 1,
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          {/* Custom SVG Logo */}
          <div style={{
            width: "64px",
            height: "64px",
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            borderRadius: "16px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(59, 130, 246, 0.4)",
            marginBottom: "16px",
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>

          <h1
            style={{
              fontWeight: "800",
              fontSize: "30px",
              letterSpacing: "-0.02em",
              color: "#ffffff",
              marginBottom: "8px",
            }}
          >
            CivicCare
          </h1>
          <p style={{ fontSize: "15px", color: "var(--text-muted)", margin: 0 }}>
            Empowering communities to report, track, and resolve local issues together.
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Button
            className="btn-premium-primary"
            size="lg"
            style={{ width: "100%", padding: "12px" }}
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>

          <Button
            className="btn-premium-secondary"
            size="lg"
            style={{ width: "100%", padding: "12px" }}
            onClick={() => navigate("/signup")}
          >
            Create Account
          </Button>
        </div>

        <div style={{ marginTop: "24px", fontSize: "12px", color: "var(--text-muted)" }}>
          Secure Portal • Government Verified
        </div>
      </Card>
    </div>
  );
}

export default WelcomePage;