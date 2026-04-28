import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCTFAuth } from "../context/CTFAuthContext.jsx";

export default function CTFNavbar() {
  const { player, logoutCTF } = useCTFAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutCTF();
    navigate("/ctf/login");
  };

  if (!player) return null;

  const navLinks = [
    { to: "/ctf", label: "Wyzwania" },
    { to: "/ctf/scoreboard", label: "Scoreboard" },
  ];

  return (
    <nav className="bg-ctf-card border-b border-ctf-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/ctf" className="flex items-center gap-2">
              <span className="text-2xl">🚩</span>
              <div>
                <span className="text-ctf-accent font-bold text-lg font-mono">CTF Portal</span>
                <span className="text-ctf-muted text-xs block leading-none">VulnBank — PWr</span>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? "bg-ctf-accent text-white"
                      : "text-ctf-muted hover:text-ctf-text hover:bg-ctf-border"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 bg-ctf-border hover:bg-ctf-accent/20 border border-ctf-border hover:border-ctf-accent text-ctf-muted hover:text-ctf-accent text-sm px-3 py-1.5 rounded-md transition-colors"
            >
              <span>🏦</span>
              <span>Uruchom VulnBank</span>
              <span className="text-xs opacity-60">↗</span>
            </a>
            <span className="text-ctf-muted text-sm hidden md:block font-mono">
              {player.nickname}
            </span>
            <button
              onClick={handleLogout}
              className="bg-ctf-danger hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded-md transition-colors"
            >
              Wyloguj
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
