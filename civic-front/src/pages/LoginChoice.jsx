import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function LoginChoice() {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        background: 'var(--bg-app)',
        backgroundImage: "radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.1), transparent 50%), radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.08), transparent 50%)",
        padding: '24px 0',
      }}
    >
      <Container style={{ maxWidth: '800px' }}>
        <div className="text-center mb-5 animate-fadeIn">
          <h2 style={{ fontWeight: '800', letterSpacing: '-0.02em', fontSize: '32px' }}>Welcome back</h2>
          <p style={{ color: 'var(--text-muted)' }}>Choose your dashboard portal below to login</p>
        </div>

        <Row className="g-4 justify-content-center">
          {/* Citizen Card */}
          <Col md={5}>
            <Card
              className="glass-panel hover-scale text-center p-4 h-100"
              style={{ cursor: 'pointer', border: '1px solid var(--card-border)' }}
              onClick={() => navigate('/login/citizen')}
            >
              <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  color: 'var(--primary-color)',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h4 style={{ fontWeight: '700', marginBottom: '8px' }}>Citizen Portal</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: 0 }}>
                  Report public infrastructure issues, check statuses, and receive real-time resolution alerts.
                </p>
              </Card.Body>
            </Card>
          </Col>

          {/* Admin Card */}
          <Col md={5}>
            <Card
              className="glass-panel hover-scale text-center p-4 h-100"
              style={{ cursor: 'pointer', border: '1px solid var(--card-border)' }}
              onClick={() => navigate('/login/admin')}
            >
              <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  color: 'var(--success-color)',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h4 style={{ fontWeight: '700', marginBottom: '8px' }}>Admin Portal</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: 0 }}>
                  Acknowledge submissions, assign departments, manage issue workflows, and post resolutions.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LoginChoice;