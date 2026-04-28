import React, { useState, useEffect } from "react";
import apiClient from "../api/client.js";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [tab, setTab] = useState("users");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersRes, txRes, logsRes] = await Promise.all([
          apiClient.get("/admin/users"),
          apiClient.get("/admin/transactions"),
          apiClient.get("/admin/logs"),
        ]);
        setUsers(usersRes.data);
        setTransactions(txRes.data);
        setLogs(logsRes.data.logs || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  const handleBlock = async (userId) => {
    try {
      const res = await apiClient.post(`/admin/users/${userId}/block`);
      setUsers(users.map((u) => (u.id === userId ? { ...u, is_blocked: res.data.is_blocked } : u)));
    } catch {}
  };

  if (loading) return <div className="text-bank-muted text-center py-12">Ładowanie...</div>;

  const tabs = ["users", "transactions", "logs"];
  const tabLabels = { users: "Użytkownicy", transactions: "Transakcje", logs: "Logi systemu" };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-bank-text">Panel Administratora</h1>
        <p className="text-bank-muted text-sm mt-1">Zarządzanie systemem VulnBank</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          ["Użytkownicy", users.length, "👤"],
          ["Transakcje", transactions.length, "💰"],
          ["Zablokowane", users.filter((u) => u.is_blocked).length, "🔒"],
        ].map(([label, count, icon]) => (
          <div key={label} className="bg-bank-card border border-bank-border rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-2xl font-bold text-bank-text">{count}</div>
            <div className="text-bank-muted text-xs">{label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-b border-bank-border">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              tab === t ? "border-bank-accent text-bank-accent" : "border-transparent text-bank-muted hover:text-bank-text"
            }`}>
            {tabLabels[t]}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div className="bg-bank-card border border-bank-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-bank-border">
                {["ID", "Imię i nazwisko", "Email", "IBAN", "Saldo", "Status", "Akcja"].map((h) => (
                  <th key={h} className="text-left text-bank-muted text-sm font-medium px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-bank-border/50 hover:bg-bank-bg/30">
                  <td className="px-4 py-3 text-sm text-bank-muted">{u.id}</td>
                  <td className="px-4 py-3 text-sm text-bank-text">{u.first_name} {u.last_name}</td>
                  <td className="px-4 py-3 text-sm text-bank-muted">{u.email}</td>
                  <td className="px-4 py-3 text-xs text-bank-muted font-mono">{u.iban || "—"}</td>
                  <td className="px-4 py-3 text-sm text-bank-text">{u.balance?.toFixed(2)} PLN</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      u.is_blocked ? "bg-red-900/40 text-bank-danger" : "bg-green-900/40 text-bank-success"
                    }`}>
                      {u.is_blocked ? "Zablokowane" : "Aktywne"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleBlock(u.id)}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        u.is_blocked
                          ? "bg-bank-success/20 text-bank-success hover:bg-bank-success/30"
                          : "bg-bank-danger/20 text-bank-danger hover:bg-bank-danger/30"
                      }`}>
                      {u.is_blocked ? "Odblokuj" : "Zablokuj"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "transactions" && (
        <div className="bg-bank-card border border-bank-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-bank-border">
                {["ID", "Tytuł", "Kwota", "Data"].map((h) => (
                  <th key={h} className="text-left text-bank-muted text-sm font-medium px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-bank-border/50">
                  <td className="px-4 py-3 text-sm text-bank-muted">{tx.id}</td>
                  <td className="px-4 py-3 text-sm text-bank-text">{tx.title}</td>
                  <td className="px-4 py-3 text-sm text-bank-text">{tx.amount} PLN</td>
                  <td className="px-4 py-3 text-xs text-bank-muted">
                    {new Date(tx.created_at).toLocaleString("pl-PL")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "logs" && (
        <div className="bg-bank-bg border border-bank-border rounded-xl p-4">
          <p className="text-bank-warning text-xs font-medium mb-3">
            UWAGA: logi zawierają dane wrażliwe (podatność A09)
          </p>
          <div className="font-mono text-xs space-y-1 max-h-96 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className={`py-1 px-2 rounded ${
                log.includes("ERROR") ? "text-bank-danger bg-red-900/10" : "text-bank-muted"
              }`}>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
