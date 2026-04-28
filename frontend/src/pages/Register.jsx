import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import apiClient from "../api/client.js";

export default function Register() {
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", password: "", pesel: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await apiClient.post("/auth/register", form);
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Błąd rejestracji");
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
          <p className="text-bank-muted mt-1">Otwórz konto bankowe</p>
        </div>

        <div className="bg-bank-card border border-bank-border rounded-xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-bank-text mb-6">Nowe konto</h2>

          {error && (
            <div className="bg-red-900/30 border border-bank-danger text-bank-danger rounded-md px-4 py-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-bank-muted text-sm mb-1">Imię</label>
                <input name="first_name" value={form.first_name} onChange={handleChange} required
                  className="w-full bg-bank-bg border border-bank-border rounded-md px-3 py-2.5 text-bank-text focus:outline-none focus:border-bank-accent"
                  placeholder="Jan" />
              </div>
              <div>
                <label className="block text-bank-muted text-sm mb-1">Nazwisko</label>
                <input name="last_name" value={form.last_name} onChange={handleChange} required
                  className="w-full bg-bank-bg border border-bank-border rounded-md px-3 py-2.5 text-bank-text focus:outline-none focus:border-bank-accent"
                  placeholder="Kowalski" />
              </div>
            </div>
            <div>
              <label className="block text-bank-muted text-sm mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required
                className="w-full bg-bank-bg border border-bank-border rounded-md px-3 py-2.5 text-bank-text focus:outline-none focus:border-bank-accent"
                placeholder="email@example.com" />
            </div>
            <div>
              <label className="block text-bank-muted text-sm mb-1">PESEL</label>
              <input name="pesel" value={form.pesel} onChange={handleChange} required maxLength={11}
                className="w-full bg-bank-bg border border-bank-border rounded-md px-3 py-2.5 text-bank-text focus:outline-none focus:border-bank-accent font-mono"
                placeholder="00000000000" />
            </div>
            <div>
              <label className="block text-bank-muted text-sm mb-1">Hasło</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required
                className="w-full bg-bank-bg border border-bank-border rounded-md px-3 py-2.5 text-bank-text focus:outline-none focus:border-bank-accent"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-bank-accent hover:bg-bank-accent-hover text-white font-semibold py-2.5 rounded-md transition-colors disabled:opacity-50 mt-2">
              {loading ? "Tworzenie konta..." : "Utwórz konto"}
            </button>
          </form>

          <p className="text-center text-bank-muted text-sm mt-6">
            Masz już konto?{" "}
            <Link to="/login" className="text-bank-accent hover:underline">Zaloguj się</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
