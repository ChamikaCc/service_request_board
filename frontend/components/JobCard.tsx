import Link from "next/link";

export type Job = {
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

const statusBadge = {
  Open:          "badge badge-open",
  "In Progress": "badge badge-in-progress",
  Closed:        "badge badge-closed",
};

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <h2 className="job-title">{job.title}</h2>
        <span className={statusBadge[job.status]}>
          {job.status}
        </span>
      </div>
      <p className="job-description">{job.description}</p>
      <div className="job-tags">
        <span className="tag tag-blue">📂 {job.category}</span>
        <span className="tag tag-gray">📍 {job.location}</span>
        <span className="tag tag-gray">👤 {job.contactName}</span>
      </div>
      <div className="job-card-footer">
        <span className="job-date">
          {new Date(job.createdAt).toLocaleDateString("en-GB", {
            day:   "numeric",
            month: "short",
            year:  "numeric",
          })}
        </span>
        <Link href={`/jobs/${job._id}`} className="view-link">
          View Details →
        </Link>
      </div>
    </div>
  );
}