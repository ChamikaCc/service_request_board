"use client";

import { useEffect, useState } from "react";
import JobCard, { Job } from "@/components/JobCard";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const CATEGORIES = ["All","Plumbing","Electrical","Painting","Joinery","Other"];
const STATUSES   = ["All","Open","In Progress","Closed"];
const LOCATIONS  = ["All","Colombo","Kandy","Galle","Negombo","Kurunegala","Matara","Anuradhapura","Jaffna","Ratnapura"];

export default function HomePage() {
  const [jobs, setJobs]         = useState<Job[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus]     = useState("All");
  const [location, setLocation] = useState("All");
  const [search, setSearch]     = useState("");

  useEffect(() => {
    fetchJobs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, status, location]);

  async function fetchJobs() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (category !== "All") params.append("category", category);
      if (status   !== "All") params.append("status",   status);
      if (location !== "All") params.append("search",   location);
      if (search)             params.append("search",   search);

      const res = await fetch(`${API_URL}/api/jobs?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setJobs(data.data);
    } catch {
      setError("Failed to load jobs. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") fetchJobs();
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Service Requests</h1>
          <p className="page-subtitle">Browse and manage service requests</p>
        </div>
        <Link href="/jobs/new" className="btn-primary">
          + Post a Job
        </Link>
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          className="filter-input"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="filter-select"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All Categories" : c}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="filter-select"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "All" ? "All Statuses" : s}
            </option>
          ))}
        </select>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="filter-select"
        >
          {LOCATIONS.map((l) => (
            <option key={l} value={l}>
              {l === "All" ? "All Locations" : l}
            </option>
          ))}
        </select>
        <button onClick={fetchJobs} className="btn-primary">
          Search
        </button>
      </div>

      {/* Error */}
      {error && <div className="error-box">{error}</div>}

      {/* Loading */}
      {loading && <div className="spinner" />}

      {/* Jobs Count */}
      {!loading && !error && (
        <p className="jobs-count">
          {jobs.length} job{jobs.length !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Empty State */}
      {!loading && !error && jobs.length === 0 && (
        <div className="empty-state">
          <p className="empty-icon">📋</p>
          <p className="empty-title">No jobs found</p>
          <p className="empty-text">
            Try changing filters or post a new job
          </p>
        </div>
      )}

      {/* Jobs Grid */}
      {!loading && !error && (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}