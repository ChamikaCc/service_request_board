"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          🔧 ServiceBoard
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              pathname === "/"
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            All Jobs
          </Link>

          <Link
            href="/jobs/new"
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Post a Job
          </Link>
        </div>

      </div>
    </nav>
  );
}