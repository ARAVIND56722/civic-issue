// src/components/CitizenDashboard.jsx
import React, { useEffect, useState } from "react";
import { Container, Card, Form, Button, ListGroup } from "react-bootstrap";
import axios from "axios";

function CitizenDashboard() {
  const [issues, setIssues] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    photo: null,
  });

  const token = localStorage.getItem("token");

  // ✅ Fetch citizen's issues when component loads
  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:5000/api/issues/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIssues(res.data);
    } catch (err) {
      console.error("Error fetching issues:", err);
    }
  };

  // ✅ Handle GPS button
  const handleGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = `${pos.coords.latitude}, ${pos.coords.longitude}`;
          setForm({ ...form, location: coords });
        },
        (err) => {
          alert("Unable to fetch GPS: " + err.message);
        }
      );
    } else {
      alert("Geolocation not supported by browser");
    }
  };

  // ✅ Handle form submit with photo upload
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("location", form.location);
      if (form.photo) {
        formData.append("photo", form.photo);
      }

      await axios.post("http://localhost:5000/api/issues", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Issue submitted successfully ✅");

      // reset form
      setForm({
        title: "",
        description: "",
        category: "",
        location: "",
        photo: null,
      });

      // refresh issues list
      fetchIssues();
    } catch (err) {
      console.error("Error submitting issue:", err);
      alert("Failed to submit issue ❌");
    }
  };

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">Citizen Dashboard</h2>

      {/* Report Issue Form */}
      <Card className="p-4 mb-4 shadow">
        <h4>Report a New Issue</h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Location</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
              />
              <Button variant="info" onClick={handleGPS}>
                Use my GPS
              </Button>
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Photo</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm({ ...form, photo: e.target.files[0] })
              }
            />
          </Form.Group>

          <div className="d-grid">
            <Button type="submit" variant="success">
              Submit Issue
            </Button>
          </div>
        </Form>
      </Card>

      {/* Display Citizen's Issues */}
      <Card className="p-4 shadow">
        <h4>My Reported Issues</h4>
        <ListGroup>
          {issues.length > 0 ? (
            issues.map((issue) => (
              <ListGroup.Item key={issue._id}>
                <strong>{issue.title}</strong> — {issue.status} <br />
                {issue.location && <small>📍 {issue.location}</small>}
                {issue.photo && (
                  <div>
                    <img
                      src={`http://localhost:5000/uploads/${issue.photo}`}
                      alt="issue"
                      width="150"
                      className="mt-2"
                    />
                  </div>
                )}
              </ListGroup.Item>
            ))
          ) : (
            <p>No issues reported yet.</p>
          )}
        </ListGroup>
      </Card>
    </Container>
  );
}

export default CitizenDashboard;
