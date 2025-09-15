// src/components/IssueDetail.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import socket from "../socket";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

const styles = {
  container: { maxWidth: 900, margin: "0 auto", padding: 16 },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  badge: { padding: "6px 10px", borderRadius: 6, color: "white", fontWeight: 600 },
  timeline: { marginTop: 20, borderLeft: "2px solid #eee", paddingLeft: 18 },
  item: { position: "relative", marginBottom: 18, paddingLeft: 10 },
  dot: { position: "absolute", left: -11, top: 4, width: 14, height: 14, borderRadius: 8, border: "3px solid white" },
  note: { marginTop: 6, color: "#444" },
  small: { color: "#666", fontSize: 13 }
};

const statusColor = {
  submitted: "#6c757d",
  acknowledged: "#0d6efd",
  "in-progress": "#f0ad4e",
  resolved: "#28a745",
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

  // initial load
  useEffect(() => {
    fetchIssue();
  }, [fetchIssue]);

  // Listen for socket events and refresh when current issue is updated/assigned
  useEffect(() => {
    const onStatus = (data) => {
      if (!data) return;
      if (String(data.issueId) === String(id)) {
        fetchIssue();
      }
    };

    const onAssign = (data) => {
      if (!data) return;
      if (String(data.issueId) === String(id)) {
        fetchIssue();
      }
    };

    socket.on("issueStatusUpdated", onStatus);
    socket.on("issueAssigned", onAssign);

    return () => {
      socket.off("issueStatusUpdated", onStatus);
      socket.off("issueAssigned", onAssign);
    };
  }, [id, fetchIssue]);

  if (loading && !issue) return <div style={{ padding: 16 }}>Loading...</div>;
  if (!issue) return <div style={{ padding: 16 }}>No issue found.</div>;

  // sort history by changedAt ascending (old -> new)
  const history = (issue.statusHistory || []).slice().sort((a, b) => new Date(a.changedAt || a._id) - new Date(b.changedAt || b._id));

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={{ margin: 0 }}>{issue.title}</h2>
          <div style={{ marginTop: 6 }}>
            <span style={{ marginRight: 12 }} className="small">
              <strong>Category:</strong> {issue.category || "—"}
            </span>
            <span style={styles.small}><strong>Location:</strong> {issue.location || "—"}</span>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div
            style={{
              ...styles.badge,
              background: statusColor[issue.status] || "#777",
            }}
          >
            {issue.status.toUpperCase()}
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: "#666" }}>
            Updated: {formatDate(issue.updatedAt)}
          </div>
        </div>
      </div>

      {issue.photoUrl && (
        <div style={{ marginTop: 16 }}>
          <img src={issue.photoUrl} alt="issue" style={{ maxWidth: "100%", borderRadius: 6 }} />
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <h3 style={{ marginBottom: 6 }}>Description</h3>
        <p style={{ marginTop: 0 }}>{issue.description || "—"}</p>
      </div>

      <div style={{ marginTop: 18 }}>
        <h3>Status timeline</h3>
        <div style={styles.timeline}>
          {history.length === 0 && (
            <div style={styles.item}>
              <div style={{ ...styles.dot, background: "#ccc" }} />
              <div>No status updates yet.</div>
            </div>
          )}

          {history.map((h, idx) => {
            const color = statusColor[h.status] || "#666";
            return (
              <div key={idx} style={styles.item}>
                <div style={{ ...styles.dot, background: color }} />
                <div>
                  <strong style={{ textTransform: "capitalize" }}>{h.status}</strong>{" "}
                  <span style={{ marginLeft: 8, color: "#666", fontSize: 13 }}>{formatDate(h.changedAt)}</span>
                  <div style={styles.note}>{h.note || ""}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <h3>Assignment</h3>
        <div>
          <strong>Department:</strong> {issue.assignedDepartment || "Unassigned"}
        </div>
      </div>
    </div>
  );
}
