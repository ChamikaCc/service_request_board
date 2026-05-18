"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const CATEGORIES = ["Plumbing", "Electrical", "Painting", "Joinery", "Other"];
const LOCATIONS  = ["Colombo", "Kandy", "Galle", "Negombo", "Kurunegala", "Matara", "Anuradhapura", "Jaffna", "Ratnapura"];

type FormData = {
  title:        string;
  description:  string;
  category:     string;
  location:     string;
  contactName:  string;
  contactEmail: string;
};

type FormErrors = Partial<FormData>;

export default function NewJobPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    title:        "",
    description:  "",
    category:     "",
    location:     "",
    contactName:  "",
    contactEmail: "",
  });

  const [errors, setErrors]     = useState<FormErrors>({});
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState("");

  // client side validation
  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!formData.title.trim())
      newErrors.title = "Title is required";

    if (!formData.description.trim())
      newErrors.description = "Description is required";

    if (!formData.category)
      newErrors.category = "Category is required";

    if (!formData.location)
      newErrors.location = "Location is required";

    if (!formData.contactName.trim())
      newErrors.contactName = "Contact name is required";

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
  if (errors[name as keyof FormErrors]) {
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }
}
 
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setApiError("");

      // get token from localStorage
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/jobs`, {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create job");
      }

      // redirect to home on success
      router.push("/");

    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : "Failed to create job"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Post a New Job</h1>
          <p className="page-subtitle">
            Fill in the details below to post a service request
          </p>
        </div>
        <Link href="/" className="btn-secondary">
          ← Back to Jobs
        </Link>
      </div>

      {/* Form */}
      <div className="form-card">

        {/* API Error */}
        {apiError && (
          <div className="error-box" style={{ marginBottom: "20px" }}>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">
              Title <span>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Leaking kitchen tap"
              className={`form-input ${errors.title ? "error" : ""}`}
            />
            {errors.title && (
              <p className="form-error">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">
              Description <span>*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the job in detail..."
              rows={4}
              className={`form-input ${errors.description ? "error" : ""}`}
            />
            {errors.description && (
              <p className="form-error">{errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">
              Category <span>*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`form-input ${errors.category ? "error" : ""}`}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && (
              <p className="form-error">{errors.category}</p>
            )}
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label">
              Location <span>*</span>
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`form-input ${errors.location ? "error" : ""}`}
            >
              <option value="">Select a location</option>
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            {errors.location && (
              <p className="form-error">{errors.location}</p>
            )}
          </div>

          {/* Contact Name */}
          <div className="form-group">
            <label className="form-label">
              Contact Name <span>*</span>
            </label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="e.g. Kamal Perera"
              className={`form-input ${errors.contactName ? "error" : ""}`}
            />
            {errors.contactName && (
              <p className="form-error">{errors.contactName}</p>
            )}
          </div>

          {/* Contact Email */}
          <div className="form-group">
            <label className="form-label">
              Contact Email <span>*</span>
            </label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="e.g. kamal@gmail.com"
              className={`form-input ${errors.contactEmail ? "error" : ""}`}
            />
            {errors.contactEmail && (
              <p className="form-error">{errors.contactEmail}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Job"}
            </button>
            <Link href="/" className="btn-secondary">
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}