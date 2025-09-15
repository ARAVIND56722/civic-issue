import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function LoginChoice() {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        backgroundImage: "url('https://img.freepik.com/free-photo/aerial-view-city_1112-1487.jpg')", // civic background
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Card
        className="p-5 text-center shadow"
        style={{ maxWidth: '400px', width: '90%' }}
      >
        <h2 className="mb-4">Login As</h2>

        {/* Citizen button */}
        <Button
          variant="primary"
          className="mb-3 w-100"
          onClick={() => navigate('/login/citizen')}
        >
          Citizen
        </Button>

        {/* Admin button */}
        <Button
          variant="secondary"
          className="w-100"
          onClick={() => navigate('/login/admin')}
        >
          Admin
        </Button>
      </Card>
    </div>
  );
}

export default LoginChoice;