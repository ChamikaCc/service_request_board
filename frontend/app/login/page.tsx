/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email:    "",
    password: "",
  });

  const [errors, setErrors]     = useState<any>({});
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState("");

  function validate(): boolean {
    const newErrors: any = {};

    if (!formData.email.trim())
      newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!formData.password.trim())
      newErrors.password = "Password is required";

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

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      // save token and user to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user",  JSON.stringify(data.user));

      // redirect to home
      router.push("/");
      router.refresh();

    } catch (err: any) {
      setApiError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Login</h1>
          <p className="page-subtitle">
            Sign in to post and manage jobs
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
              placeholder="Enter your password"
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

        </form>

        {/* Register Link */}
        <p style={{ marginTop: "20px", fontSize: "14px", color: "#6b7280" }}>
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            style={{ color: "#2563eb", fontWeight: "500" }}
          >
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}