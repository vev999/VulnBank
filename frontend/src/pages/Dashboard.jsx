import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import apiClient from "../api/client.js";

function TransactionCard({ tx, currentAccountId }) {
  const isIncoming = tx.to_account_id === currentAccountId;
  const sign = isIncoming ? "+" : "-";
  const color = isIncoming ? "text-bank-success" : "text-bank-danger";
  const date = new Date(tx.created_at).toLocaleString("pl-PL");

  return (
    <div className="flex items-center justify-between py-3 border-b border-bank-border last:border-0">
      <div>
        <p className="text-bank-text text-sm font-medium">{tx.title}</p>
        <p className="text-bank-muted text-xs mt-0.5">
          {isIncoming ? `Od: ${tx.from_iban || "system"}` : `Do: ${tx.to_iban}`} • {date}
        </p>
      </div>
      <span className={`${color} font-semibold text-sm`}>
        {sign}{tx.amount.toFixed(2)} PLN
      </span>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accRes, txRes] = await Promise.all([
          apiClient.get("/accounts/"),
          apiClient.get("/transactions/recent"),
        ]);
        if (accRes.data.length > 0) setAccount(accRes.data[0]);
        setTransactions(txRes.data);
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-bank-muted text-center py-12">Ładowanie...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-bank-text">
          Witaj, {user?.first_name}!
        </h1>
        <p className="text-bank-muted text-sm mt-1">Przegląd konta bankowego</p>
      </div>

      {account && (
        <div className="bg-gradient-to-br from-bank-accent to-blue-700 rounded-xl p-6 shadow-lg">
          <p className="text-blue-200 text-sm font-medium mb-1">Saldo konta</p>
          <p className="text-4xl font-bold text-white mb-4">
            {account.balance.toFixed(2)} <span className="text-2xl">PLN</span>
          </p>
          <div className="border-t border-blue-400/40 pt-4">
            <p className="text-blue-200 text-xs mb-1">Numer konta (IBAN)</p>
            <p className="text-white font-mono text-sm tracking-wider">{account.iban}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/transfer"
          className="bg-bank-card border border-bank-border rounded-xl p-5 text-center hover:border-bank-accent transition-colors group">
          <div className="text-3xl mb-2">💸</div>
          <p className="text-bank-text font-medium group-hover:text-bank-accent transition-colors">Przelew</p>
          <p className="text-bank-muted text-xs mt-1">Wyślij środki</p>
        </Link>
        <Link to="/history"
          className="bg-bank-card border border-bank-border rounded-xl p-5 text-center hover:border-bank-accent transition-colors group">
          <div className="text-3xl mb-2">📋</div>
          <p className="text-bank-text font-medium group-hover:text-bank-accent transition-colors">Historia</p>
          <p className="text-bank-muted text-xs mt-1">Wszystkie transakcje</p>
        </Link>
        <Link to="/profile"
          className="bg-bank-card border border-bank-border rounded-xl p-5 text-center hover:border-bank-accent transition-colors group">
          <div className="text-3xl mb-2">👤</div>
          <p className="text-bank-text font-medium group-hover:text-bank-accent transition-colors">Profil</p>
          <p className="text-bank-muted text-xs mt-1">Twoje dane</p>
        </Link>
      </div>

      <div className="bg-bank-card border border-bank-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-bank-text font-semibold">Ostatnie transakcje</h2>
          <Link to="/history" className="text-bank-accent text-sm hover:underline">
            Zobacz wszystkie →
          </Link>
        </div>
        {transactions.length > 0 ? (
          transactions.map((tx) => (
            <TransactionCard key={tx.id} tx={tx} currentAccountId={account?.id} />
          ))
        ) : (
          <p className="text-bank-muted text-sm text-center py-6">Brak transakcji</p>
        )}
      </div>
    </div>
  );
}
