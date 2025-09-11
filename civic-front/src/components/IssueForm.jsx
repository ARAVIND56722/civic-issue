// src/components/IssueForm.jsx
import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { Form, Button, Spinner, Card } from "react-bootstrap";

export default function IssueForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState(null);
  const [latLng, setLatLng] = useState({ lat: "", lng: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => setLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => alert("Unable to get location: " + err.message),
      { enableHighAccuracy: true }
    );
  };
const submit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    fd.append("category", category);
    fd.append("location", location);
    
    if (latLng.lat && latLng.lng) {
      fd.append("lat", latLng.lat);
      fd.append("lng", latLng.lng);
    }
    if (photo) fd.append("photo", photo);
    // 👇 Add this line to check if citizenId is stored
    // ✅ Add this debug loop here
  for (let pair of fd.entries()) {
    console.log(pair[0] + ": " + pair[1]);
  }
  
    
    await api.post("/issues", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Issue Submitted!");
    navigate("/report");   // stay on report page
  } catch (err) {
    console.error(err);
    alert("Error: " + (err?.response?.data?.error || err.message));
  } finally {
    setLoading(false);
  }
};


  return (
    <Card className="shadow p-4">
      <Card.Title>Report an Issue</Card.Title>
      <Form onSubmit={submit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter issue title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Describe the issue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            placeholder="Eg. Sanitation, Roads, Electricity"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Button
            variant="outline-primary"
            size="sm"
            className="mt-2"
            type="button"
            onClick={getMyLocation}
          >
            Use My GPS
          </Button>
          {latLng.lat && (
            <div className="text-muted mt-1">
              Lat: {latLng.lat}, Lng: {latLng.lng}
            </div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Photo</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </Form.Group>

        {/* 🔹 Step 3: Submit + View My Issues buttons */}
        <div className="mt-3">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" /> Submitting...
              </>
            ) : (
              "Submit Issue"
            )}
          </Button>
          <Button
            variant="secondary"
            type="button"
            className="ms-2"
            onClick={() => navigate("/my-issues")}
          >
            View My Issues
          </Button>
        </div>
      </Form>
    </Card>
  );
}
