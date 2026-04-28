import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import apiClient from "../api/client.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await apiClient.post("/auth/login", { email, password });
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Błąd logowania");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bank-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏦</div>
          <h1 className="text-3xl font-bold text-bank-accent">VulnBank</h1>
          <p className="text-bank-muted mt-1">PWr CTF Edition</p>
        </div>

        <div className="bg-bank-card border border-bank-border rounded-xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-bank-text mb-6">Zaloguj się</h2>

          {error && (
            <div className="bg-red-900/30 border border-bank-danger text-bank-danger rounded-md px-4 py-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-bank-muted text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-bank-bg border border-bank-border rounded-md px-4 py-2.5 text-bank-text placeholder-bank-muted focus:outline-none focus:border-bank-accent"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-bank-muted text-sm mb-1">Hasło</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-bank-bg border border-bank-border rounded-md px-4 py-2.5 text-bank-text placeholder-bank-muted focus:outline-none focus:border-bank-accent"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-bank-accent hover:bg-bank-accent-hover text-white font-semibold py-2.5 rounded-md transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "Logowanie..." : "Zaloguj się"}
            </button>
          </form>

          <p className="text-center text-bank-muted text-sm mt-6">
            Nie masz konta?{" "}
            <Link to="/register" className="text-bank-accent hover:underline">
              Zarejestruj się
            </Link>
          </p>
        </div>

        <p className="text-center text-bank-muted text-xs mt-4">
          Konta testowe: alice@vulnbank.pl, bob@vulnbank.pl, admin@vulnbank.pl
        </p>
      </div>
    </div>
  );
}
