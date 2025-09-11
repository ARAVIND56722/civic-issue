// src/components/IssueDetailModal.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import MapView from "./MapView";
import { toast } from "react-toastify";
import { Modal, Button, Badge, Spinner, Card, Form } from "react-bootstrap";

const allowedTransitions = {
  submitted: ["acknowledged"],
  acknowledged: ["in-progress", "resolved"],
  "in-progress": ["resolved"],
  resolved: [],
};

const statusVariant = {
  submitted: "secondary",
  acknowledged: "info",
  "in-progress": "warning",
  resolved: "success",
};

export default function IssueDetailModal({ issueId, onClose, onUpdated }) {
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchIssue() {
    try {
      setLoading(true);
      const res = await api.get(`/issues/${issueId}`);
      setIssue(res.data);
    } catch (err) {
      console.error("Failed to fetch issue", err);
      toast.error("Failed to load issue details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (issueId) fetchIssue();
  }, [issueId]);

  if (!issueId) return null;

  const nextStatuses = allowedTransitions[issue?.status] || [];

  const handleStatusChange = async (newStatus) => {
    if (!newStatus) return;
    if (!window.confirm(`Change status to "${newStatus}"?`)) return;
    try {
      await api.put(`/issues/${issue._id}/status`, { status: newStatus, note: `Changed via Admin UI` });
      toast.success("Status updated");
      await fetchIssue();
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error(err);
      toast.error("Status update failed");
    }
  };

  const handleAssign = async (department) => {
    if (!department) return;
    try {
      await api.put(`/issues/${issue._id}/assign`, { department });
      toast.success("Assigned");
      await fetchIssue();
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error(err);
      toast.error("Assign failed");
    }
  };

  return (
    <Modal show={!!issueId} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{issue?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <div className="text-center"><Spinner animation="border" /></div>}

        {issue && (
          <>
            <p><strong>Category:</strong> {issue.category || "—"}</p>
            <p><strong>Location:</strong> {issue.location || "—"}</p>
            <p><strong>Description:</strong> {issue.description}</p>

            {issue.photoUrl && <Card.Img src={issue.photoUrl} alt="issue" className="mb-3 rounded" />}

            <h5>Status</h5>
            <Badge bg={statusVariant[issue.status] || "dark"} className="mb-3">
              {issue.status}
            </Badge>

            <h5>Status Timeline</h5>
            <ul className="list-group mb-3">
              {(issue.statusHistory || []).map((h, idx) => (
                <li key={idx} className="list-group-item">
                  <strong>{h.status}</strong> – {h.note} <br />
                  <small className="text-muted">{new Date(h.changedAt).toLocaleString()}</small>
                </li>
              ))}
            </ul>

            <h5>Assign Department</h5>
            <Form.Select onChange={(e) => handleAssign(e.target.value)} defaultValue="">
              <option value="">Choose</option>
              <option value="Electricity">Electricity</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Public Works">Public Works</option>
              <option value="Roads">Roads</option>
              <option value="General">General</option>
            </Form.Select>

            {issue.coords?.coordinates && (
              <div className="mt-3" style={{ height: 200 }}>
                <MapView issues={[issue]} onMarkerClick={() => {}} />
              </div>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {nextStatuses.map((s) => (
          <Button key={s} variant="primary" onClick={() => handleStatusChange(s)}>
            {s}
          </Button>
        ))}
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
