/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name:     "",
    email:    "",
    password: "",
  });

  const [errors, setErrors]     = useState<any>({});
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState("");

  function validate(): boolean {
    const newErrors: any = {};

    if (!formData.name.trim())
      newErrors.name = "Name is required";

    if (!formData.email.trim())
      newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!formData.password.trim())
      newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/.test(formData.password))
      newErrors.password = "Password must have uppercase, lowercase and a number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e: any) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setApiError("");

      const res = await fetch(`${API_URL}/api/auth/register`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Registration failed");

      // save token and user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user",  JSON.stringify(data.user));

      // redirect to home
      router.push("/");
      router.refresh();

    } catch (err: any) {
      setApiError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Register</h1>
          <p className="page-subtitle">
            Create an account to post and manage jobs
          </p>
        </div>
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

          {/* Name */}
          <div className="form-group">
            <label className="form-label">
              Full Name <span>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Kamal Perera"
              className={`form-input ${errors.name ? "error" : ""}`}
            />
            {errors.name && (
              <p className="form-error">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">
              Email <span>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. kamal@gmail.com"
              className={`form-input ${errors.email ? "error" : ""}`}
            />
            {errors.email && (
              <p className="form-error">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">
              Password <span>*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 8 chars, uppercase, lowercase, number"
              className={`form-input ${errors.password ? "error" : ""}`}
            />
            {errors.password && (
              <p className="form-error">{errors.password}</p>
            )}
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>

        </form>

        {/* Login Link */}
        <p style={{ marginTop: "20px", fontSize: "14px", color: "#6b7280" }}>
          Already have an account?{" "}
          <Link
            href="/login"
            style={{ color: "#2563eb", fontWeight: "500" }}
          >
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
}