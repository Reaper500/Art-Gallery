"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-purple-500/20 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl sm:text-3xl font-bold text-purple-400">
              J&M
            </span>
          </Link>

          {/* Admin Button */}
          <Link
            href="/login"
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 active:scale-95 transition-all duration-200 text-sm sm:text-base font-medium shadow-md hover:shadow-lg"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
