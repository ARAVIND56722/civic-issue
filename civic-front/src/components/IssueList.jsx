// src/components/IssueList.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { Table, Badge, Spinner, Container } from "react-bootstrap";

export default function IssueList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get("/issues?page=1&limit=20");
      setItems(res.data.items || res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load issues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  if (loading) return <div className="text-center mt-4"><Spinner animation="border" /></div>;

  const statusVariant = {
    submitted: "secondary",
    acknowledged: "info",
    "in-progress": "warning",
    resolved: "success",
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Reported Issues</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it._id}>
              <td><Link to={`/issues/${it._id}`}>{it.title}</Link></td>
              <td>{it.category}</td>
              <td><Badge bg={statusVariant[it.status] || "dark"}>{it.status}</Badge></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
