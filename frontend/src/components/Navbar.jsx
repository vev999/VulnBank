import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import apiClient from "../api/client.js";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {}
    logout();
    navigate("/login");
  };

  if (!user) return null;

  const navLinks = [
    { to: "/dashboard", label: "Pulpit" },
    { to: "/transfer", label: "Przelew" },
    { to: "/history", label: "Historia" },
    { to: "/profile", label: "Profil" },
    ...(user.is_admin ? [{ to: "/admin", label: "Admin" }] : []),
  ];

  return (
    <nav className="bg-bank-card border-b border-bank-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="text-2xl">🏦</span>
              <div>
                <span className="text-bank-accent font-bold text-lg">VulnBank</span>
                <span className="text-bank-muted text-xs block leading-none">PWr CTF Edition</span>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? "bg-bank-accent text-white"
                      : "text-bank-muted hover:text-bank-text hover:bg-bank-border"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/ctf/login"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 bg-bank-border hover:bg-green-900/30 border border-bank-border hover:border-green-700 text-bank-muted hover:text-bank-success text-sm px-3 py-1.5 rounded-md transition-colors"
            >
              <span>🚩</span>
              <span>CTF Portal</span>
              <span className="text-xs opacity-60">↗</span>
            </a>
            <span className="text-bank-muted text-sm hidden md:block">
              {user.first_name} {user.last_name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-bank-danger hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded-md transition-colors"
            >
              Wyloguj
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
