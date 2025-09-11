// src/pages/MyIssues.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

export default function MyIssues() {
  const [issues, setIssues] = useState([]);
  const citizenId = localStorage.getItem("citizenId");

  useEffect(() => {
    if (!citizenId) return;
    api.get(`/issues?reporterId=${citizenId}`)
      .then(res => setIssues(res.data.items || res.data))
      .catch(err => console.error("Failed to fetch issues", err));
  }, [citizenId]);

  return (
    <div className="container mt-4">
      <h2>My Reported Issues</h2>
      <ul className="list-group">
        {issues.map(issue => (
          <li key={issue._id} className="list-group-item">
            <strong>{issue.title}</strong> — {issue.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
