import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client.js";

export default function Transfer() {
  const [form, setForm] = useState({ to_iban: "", amount: "", title: "" });
  const [balance, setBalance] = useState(null);
  const [myIban, setMyIban] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get("/accounts/").then((res) => {
      if (res.data.length > 0) {
        setBalance(res.data[0].balance);
        setMyIban(res.data[0].iban);
      }
    });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      const res = await apiClient.post("/transactions/transfer", {
        to_iban: form.to_iban,
        amount: parseFloat(form.amount),
        title: form.title || "Przelew",
      });
      setSuccess(`Przelew wykonany pomyślnie! Nowe saldo: ${res.data.transaction ? "" : ""}Odśwież stronę.`);
      setForm({ to_iban: "", amount: "", title: "" });
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Błąd wykonania przelewu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-bank-text mb-2">Wykonaj przelew</h1>
      <p className="text-bank-muted text-sm mb-6">Przelej środki na inne konto bankowe</p>

      {balance !== null && (
        <div className="bg-bank-card border border-bank-border rounded-xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-bank-muted text-xs">Dostępne środki</p>
            <p className="text-bank-text font-bold text-xl">{balance.toFixed(2)} PLN</p>
          </div>
          <div className="text-right">
            <p className="text-bank-muted text-xs">Twój IBAN</p>
            <p className="text-bank-text font-mono text-xs">{myIban}</p>
          </div>
        </div>
      )}

      <div className="bg-bank-card border border-bank-border rounded-xl p-6">
        {error && (
          <div className="bg-red-900/30 border border-bank-danger text-bank-danger rounded-md px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-900/30 border border-bank-success text-bank-success rounded-md px-4 py-3 mb-4 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-bank-muted text-sm mb-1">IBAN odbiorcy</label>
            <input name="to_iban" value={form.to_iban} onChange={handleChange} required
              className="w-full bg-bank-bg border border-bank-border rounded-md px-4 py-2.5 text-bank-text font-mono text-sm focus:outline-none focus:border-bank-accent"
              placeholder="PL00000000000000000000000000" />
          </div>
          <div>
            <label className="block text-bank-muted text-sm mb-1">Kwota (PLN)</label>
            <input name="amount" type="number" step="0.01" min="0.01" value={form.amount} onChange={handleChange} required
              className="w-full bg-bank-bg border border-bank-border rounded-md px-4 py-2.5 text-bank-text focus:outline-none focus:border-bank-accent"
              placeholder="100.00" />
          </div>
          <div>
            <label className="block text-bank-muted text-sm mb-1">Tytuł przelewu</label>
            <input name="title" value={form.title} onChange={handleChange}
              className="w-full bg-bank-bg border border-bank-border rounded-md px-4 py-2.5 text-bank-text focus:outline-none focus:border-bank-accent"
              placeholder="Przelew za fakturę 01/2024" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-bank-accent hover:bg-bank-accent-hover text-white font-semibold py-2.5 rounded-md transition-colors disabled:opacity-50">
            {loading ? "Wykonywanie przelewu..." : "Wykonaj przelew"}
          </button>
        </form>
      </div>
    </div>
  );
}
