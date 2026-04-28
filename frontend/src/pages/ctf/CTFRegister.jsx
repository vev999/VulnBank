import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCTFAuth } from "../../context/CTFAuthContext.jsx";
import ctfClient from "../../api/ctfClient.js";

export default function CTFRegister() {
  const [nickname, setNickname] = useState("");
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
      const res = await ctfClient.post("/auth/register", { nickname, email, password });
      loginCTF(res.data.token, res.data.player);
      navigate("/ctf");
    } catch (err) {
      setError(err.response?.data?.error || "Błąd rejestracji");
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
          <h2 className="text-xl font-semibold text-ctf-text mb-6">Nowe konto gracza</h2>

          {error && (
            <div className="bg-red-900/30 border border-ctf-danger text-ctf-danger rounded-md px-4 py-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-ctf-muted text-sm mb-1">Nickname</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                minLength={3}
                maxLength={30}
                className="w-full bg-ctf-bg border border-ctf-border rounded-md px-4 py-2.5 text-ctf-text placeholder-ctf-muted focus:outline-none focus:border-ctf-accent font-mono"
                placeholder="h4x0r"
              />
            </div>
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
                minLength={6}
                className="w-full bg-ctf-bg border border-ctf-border rounded-md px-4 py-2.5 text-ctf-text placeholder-ctf-muted focus:outline-none focus:border-ctf-accent"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ctf-accent hover:bg-ctf-accent-hover text-white font-semibold py-2.5 rounded-md transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "Rejestracja..." : "Zarejestruj się"}
            </button>
          </form>

          <p className="text-center text-ctf-muted text-sm mt-6">
            Masz już konto?{" "}
            <Link to="/ctf/login" className="text-ctf-accent hover:underline">
              Zaloguj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
