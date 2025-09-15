// src/pages/MyIssues.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import IssueDetailModal from "../components/IssueDetailModal";

export default function MyIssues() {
  const [issues, setIssues] = useState([]);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
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
          <li
            key={issue._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{issue.title}</strong> — {issue.status}
            </div>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => setSelectedIssueId(issue._id)}
            >
              View
            </button>
          </li>
        ))}
      </ul>

      {/* Modal for detailed view */}
      {selectedIssueId && (
        <IssueDetailModal
          issueId={selectedIssueId}
          onClose={() => setSelectedIssueId(null)}
          mode="citizen"  // 👈 tell the modal it’s citizen view
        />
      )}
    </div>
  );
}
