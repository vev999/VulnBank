import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCTFAuth } from "../../context/CTFAuthContext.jsx";
import ctfClient from "../../api/ctfClient.js";

export default function CTFLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginCTF } = useCTFAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await ctfClient.post("/auth/login", { email, password });
      loginCTF(res.data.token, res.data.player);
      navigate("/ctf");
    } catch (err) {
      setError(err.response?.data?.error || "Błąd logowania");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ctf-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🚩</div>
          <h1 className="text-3xl font-bold text-ctf-accent font-mono">CTF Portal</h1>
          <p className="text-ctf-muted mt-1">VulnBank — PWr Edition</p>
        </div>

        <div className="bg-ctf-card border border-ctf-border rounded-xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-ctf-text mb-6">Zaloguj się</h2>

          {error && (
            <div className="bg-red-900/30 border border-ctf-danger text-ctf-danger rounded-md px-4 py-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-ctf-muted text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-ctf-bg border border-ctf-border rounded-md px-4 py-2.5 text-ctf-text placeholder-ctf-muted focus:outline-none focus:border-ctf-accent"
                placeholder="gracz@example.com"
              />
            </div>
            <div>
              <label className="block text-ctf-muted text-sm mb-1">Hasło</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-ctf-bg border border-ctf-border rounded-md px-4 py-2.5 text-ctf-text placeholder-ctf-muted focus:outline-none focus:border-ctf-accent"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ctf-accent hover:bg-ctf-accent-hover text-white font-semibold py-2.5 rounded-md transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "Logowanie..." : "Zaloguj się"}
            </button>
          </form>

          <p className="text-center text-ctf-muted text-sm mt-6">
            Nie masz konta?{" "}
            <Link to="/ctf/register" className="text-ctf-accent hover:underline">
              Zarejestruj się
            </Link>
          </p>
        </div>

        <div className="mt-6 bg-ctf-card border border-ctf-border rounded-xl p-4 text-center">
          <p className="text-ctf-muted text-xs mb-2">Chcesz od razu zaatakować bank?</p>
          <a
            href="/login"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-ctf-muted hover:text-ctf-accent text-sm transition-colors"
          >
            <span>🏦</span>
            <span>Otwórz VulnBank</span>
            <span className="text-xs opacity-60">↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
