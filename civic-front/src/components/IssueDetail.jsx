// src/components/IssueDetail.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import socket from "../socket";
import { Container, Badge, Spinner, Card } from "react-bootstrap";

const statusVariant = {
  submitted: "secondary",
  acknowledged: "info",
  "in-progress": "warning",
  resolved: "success",
};

export default function IssueDetail() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchIssue = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/issues/${id}`);
      setIssue(res.data);
    } catch (err) {
      console.error("Failed to load issue", err);
      alert("Failed to load issue");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchIssue();
  }, [fetchIssue]);

  useEffect(() => {
    const onStatus = (data) => {
      if (String(data.issueId) === String(id)) fetchIssue();
    };
    const onAssign = (data) => {
      if (String(data.issueId) === String(id)) fetchIssue();
    };

    socket.on("issueStatusUpdated", onStatus);
    socket.on("issueAssigned", onAssign);

    return () => {
      socket.off("issueStatusUpdated", onStatus);
      socket.off("issueAssigned", onAssign);
    };
  }, [id, fetchIssue]);

  if (loading && !issue) return <div className="text-center mt-4"><Spinner animation="border" /></div>;
  if (!issue) return <Container className="mt-4">No issue found.</Container>;

  const history = (issue.statusHistory || []).slice().sort((a, b) => new Date(a.changedAt) - new Date(b.changedAt));

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h3>{issue.title}</h3>
            <p className="mb-1"><strong>Category:</strong> {issue.category || "—"}</p>
            <p className="mb-1"><strong>Location:</strong> {issue.location || "—"}</p>
          </div>
          <div>
            <Badge bg={statusVariant[issue.status] || "dark"}>{issue.status}</Badge>
            <div className="text-muted small mt-1">Updated: {new Date(issue.updatedAt).toLocaleString()}</div>
          </div>
        </div>

        {issue.photoUrl && <Card.Img src={issue.photoUrl} alt="issue" className="my-3 rounded" />}

        <h5>Description</h5>
        <p>{issue.description || "—"}</p>

        <h5>Status Timeline</h5>
        <ul className="list-group mb-3">
          {history.map((h, idx) => (
            <li key={idx} className="list-group-item">
              <Badge bg={statusVariant[h.status] || "dark"} className="me-2">{h.status}</Badge>
              {h.note} <br />
              <small className="text-muted">{new Date(h.changedAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>

        <h5>Assignment</h5>
        <p><strong>Department:</strong> {issue.assignedDepartment || "Unassigned"}</p>
      </Card>
    </Container>
  );
  
}
