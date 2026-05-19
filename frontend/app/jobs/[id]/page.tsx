/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const STATUSES = ["Open", "In Progress", "Closed"];

type Job = {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  contactName: string;
  contactEmail: string;
  status: "Open" | "In Progress" | "Closed";
  createdAt: string;
};

const statusBadge: Record<string, string> = {
  Open:          "badge badge-open",
  "In Progress": "badge badge-in-progress",
  Closed:        "badge badge-closed",
};

export default function JobDetailPage({ params }: any) {
  const router = useRouter();
  const { id } = params;

  const [job, setJob]             = useState<Job | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [status, setStatus]       = useState("");
  const [updating, setUpdating]   = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [updateMsg, setUpdateMsg] = useState("");

  useEffect(() => {
    async function fetchJob() {
      try {
        setLoading(true);
        setError("");

        const res  = await fetch(`${API_URL}/api/jobs/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Job not found");

        setJob(data.data);
        setStatus(data.data.status);
      } catch (err: any) {
        setError(err.message || "Failed to load job");
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [id]);

  async function handleStatusUpdate() {
    try {
      setUpdating(true);
      setUpdateMsg("");

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/jobs/${id}`, {
        method:  "PATCH",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update");

      setJob(data.data);
      setUpdateMsg("✅ Status updated successfully!");
      setTimeout(() => setUpdateMsg(""), 3000);

    } catch (err: any) {
      setUpdateMsg(`❌ ${err.message}`);
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      setDeleting(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/jobs/${id}`, {
        method:  "DELETE",
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete");

      router.push("/");

    } catch (err: any) {
      setError(err.message || "Failed to delete job");
      setDeleting(false);
    }
  }

  // Loading
  if (loading) return <div className="spinner" />;

  // Error
  if (error) {
    return (
      <div>
        <div className="error-box">{error}</div>
        <Link href="/" className="btn-secondary">
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  // Not Found
  if (!job) {
    return (
      <div className="empty-state">
        <p className="empty-icon">🔍</p>
        <p className="empty-title">Job not found</p>
        <Link
          href="/"
          className="btn-primary"
          style={{ marginTop: "16px", display: "inline-block" }}
        >
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Job Details</h1>
          <p className="page-subtitle">
            View and manage this service request
          </p>
        </div>
        <Link href="/" className="btn-secondary">
          ← Back to Jobs
        </Link>
      </div>

      {/* Detail Card */}
      <div className="detail-card">

        {/* Header */}
        <div className="detail-header">
          <h2 className="detail-title">{job.title}</h2>
          <span className={statusBadge[job.status]}>
            {job.status}
          </span>
        </div>

        {/* Description */}
        <div className="detail-section">
          <p className="detail-label">Description</p>
          <p className="detail-value">{job.description}</p>
        </div>

        {/* Details Grid */}
        <div className="detail-grid">
          <div>
            <p className="detail-label">Category</p>
            <p className="detail-value">📂 {job.category}</p>
          </div>
          <div>
            <p className="detail-label">Location</p>
            <p className="detail-value">📍 {job.location}</p>
          </div>
          <div>
            <p className="detail-label">Contact Name</p>
            <p className="detail-value">👤 {job.contactName}</p>
          </div>
          <div>
            <p className="detail-label">Contact Email</p>
            <p className="detail-value">✉️ {job.contactEmail}</p>
          </div>
          <div>
            <p className="detail-label">Posted On</p>
            <p className="detail-value">
              📅 {new Date(job.createdAt).toLocaleDateString("en-GB", {
                day:   "numeric",
                month: "long",
                year:  "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="detail-label">Current Status</p>
            <p className="detail-value">
              <span className={statusBadge[job.status]}>
                {job.status}
              </span>
            </p>
          </div>
        </div>

        {/* Update Status */}
        <div className="detail-section">
          <p className="detail-label">Update Status</p>
          <div style={{
            display:    "flex",
            gap:        "12px",
            alignItems: "center",
            flexWrap:   "wrap",
            marginTop:  "8px",
          }}>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="status-select"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={updating || status === job.status}
              className="btn-primary"
            >
              {updating ? "Updating..." : "Update Status"}
            </button>
          </div>
          {updateMsg && (
            <p style={{ marginTop: "8px", fontSize: "14px" }}>
              {updateMsg}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="detail-actions">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="btn-danger"
          >
            {deleting ? "Deleting..." : "🗑️ Delete Job"}
          </button>
          <Link href="/" className="btn-secondary">
            ← Back to Jobs
          </Link>
        </div>

      </div>
    </div>
  );
}