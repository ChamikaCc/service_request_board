"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, [pathname]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">
        🔧 ServiceBoard
      </Link>
      <div className="navbar-links">
        <Link
          href="/"
          className={`nav-link ${pathname === "/" ? "active" : ""}`}
        >
          All Jobs
        </Link>

        {user ? (
          <>
            <Link href="/jobs/new" className="btn-primary">
              + Post a Job
            </Link>
            <span style={{ fontSize: "14px", color: "#6b7280" }}>
              👤 {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="btn-secondary"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className={`nav-link ${pathname === "/login" ? "active" : ""}`}
            >
              Login
            </Link>
            <Link href="/register" className="btn-primary">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}