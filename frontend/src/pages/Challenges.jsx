import React, { useState, useEffect } from "react";
import FlagChecker from "../components/FlagChecker.jsx";

const CHALLENGES = [
  {
    id: "A01", name: "Broken Access Control (IDOR)", category: "OWASP A01:2021",
    difficulty: "easy", points: 100,
    hint: "Sprawdź endpoint /api/accounts/<id>. Czy możesz zobaczyć konta innych użytkowników?",
    endpoint: "GET /api/accounts/1",
  },
  {
    id: "A02", name: "Security Misconfiguration", category: "OWASP A02:2021",
    difficulty: "easy", points: 100,
    hint: "Poszukaj zapomnianego endpointu debug w /api/debug/.",
    endpoint: "GET /api/debug/config",
  },
  {
    id: "A03", name: "Supply Chain Failures", category: "OWASP A03:2021",
    difficulty: "easy", points: 100,
    hint: "Sprawdź listę zależności: /api/debug/dependencies. Poszukaj pakietu z polem 'flag'.",
    endpoint: "GET /api/debug/dependencies",
  },
  {
    id: "A04", name: "Cryptographic Failures (MD5)", category: "OWASP A04:2021",
    difficulty: "medium", points: 150,
    hint: "Zdobądź dostęp admina (A08), pobierz /api/admin/backup, złam hash MD5 na crackstation.net.",
    endpoint: "GET /api/admin/backup",
  },
  {
    id: "A05", name: "SQL Injection", category: "OWASP A05:2021",
    difficulty: "medium", points: 150,
    hint: "Wyszukiwarka transakcji jest podatna. Wstrzyknij UNION SELECT do parametru ?q=",
    endpoint: "GET /api/transactions/search?q=",
  },
  {
    id: "A06", name: "Insecure Design", category: "OWASP A06:2021",
    difficulty: "easy", points: 100,
    hint: "Reset hasła wymaga tylko PESELU — brak tokenu emailowego. PESEL widoczny w profilu.",
    endpoint: "POST /api/auth/forgot-password",
  },
  {
    id: "A07", name: "Authentication Failures", category: "OWASP A07:2021",
    difficulty: "easy", points: 100,
    hint: "Brak rate limitingu na logowaniu. Użyj Burp Intruder lub curl na bob@vulnbank.pl.",
    endpoint: "POST /api/auth/login",
  },
  {
    id: "A08", name: "JWT None Algorithm", category: "OWASP A08:2021",
    difficulty: "medium", points: 150,
    hint: "Czy JWT sprawdza algorytm? Spróbuj zmienić alg na 'none' i is_admin na true.",
    endpoint: "GET /api/admin/dashboard",
  },
  {
    id: "A09", name: "Logging & Alerting Failures", category: "OWASP A09:2021",
    difficulty: "easy", points: 100,
    hint: "Endpoint logów nie wymaga autoryzacji. Sprawdź GET /api/admin/logs.",
    endpoint: "GET /api/admin/logs",
  },
  {
    id: "A10", name: "Exceptional Conditions", category: "OWASP A10:2021",
    difficulty: "easy", points: 100,
    hint: "Wyślij nieprawidłowy parametr do kalkulatora kredytu. Flask DEBUG ujawni stack trace.",
    endpoint: "GET /api/loans/calculate?amount=abc&rate=2",
  },
];

const DIFFICULTY_BADGE = {
  easy: "bg-green-900/40 text-bank-success border border-green-700/40",
  medium: "bg-yellow-900/40 text-bank-warning border border-yellow-700/40",
  hard: "bg-red-900/40 text-bank-danger border border-red-700/40",
};

export default function Challenges() {
  const [found, setFound] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vulnbank_flags") || "{}");
    } catch {
      return {};
    }
  });
  const [expanded, setExpanded] = useState(null);

  const totalPoints = CHALLENGES.reduce(
    (sum, c) => sum + (found[c.id] ? c.points : 0), 0
  );
  const maxPoints = CHALLENGES.reduce((sum, c) => sum + c.points, 0);

  const handleFlagSuccess = (data) => {
    const updatedFound = { ...found, [data.challenge_id]: true };
    setFound(updatedFound);
    localStorage.setItem("vulnbank_flags", JSON.stringify(updatedFound));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-bank-text">Wyzwania CTF</h1>
          <p className="text-bank-muted text-sm mt-1">OWASP Top 10 — VulnBank Edition</p>
        </div>
        <div className="bg-bank-card border border-bank-border rounded-xl px-6 py-4 text-center">
          <p className="text-bank-muted text-xs">Łączny wynik</p>
          <p className="text-3xl font-bold text-bank-accent">{totalPoints}</p>
          <p className="text-bank-muted text-xs">/ {maxPoints} punktów</p>
        </div>
      </div>

      <div className="bg-bank-card border border-bank-border rounded-full h-3 overflow-hidden">
        <div
          className="bg-bank-accent h-full transition-all duration-500"
          style={{ width: `${(totalPoints / maxPoints) * 100}%` }}
        />
      </div>

      <div className="space-y-3">
        {CHALLENGES.map((c) => {
          const isFound = !!found[c.id];
          const isOpen = expanded === c.id;
          return (
            <div key={c.id}
              className={`bg-bank-card border rounded-xl transition-colors ${
                isFound ? "border-bank-success/40" : "border-bank-border"
              }`}>
              <button
                onClick={() => setExpanded(isOpen ? null : c.id)}
                className="w-full text-left px-5 py-4 flex items-center gap-4"
              >
                <span className={`text-xl ${isFound ? "" : "grayscale"}`}>
                  {isFound ? "✅" : "🔒"}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-bank-muted text-xs font-mono font-bold">{c.id}</span>
                    <span className="text-bank-text font-medium text-sm">{c.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${DIFFICULTY_BADGE[c.difficulty]}`}>
                      {c.difficulty}
                    </span>
                  </div>
                  <p className="text-bank-muted text-xs mt-0.5">{c.category}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`font-bold text-sm ${isFound ? "text-bank-success" : "text-bank-muted"}`}>
                    {isFound ? `+${c.points}` : `${c.points} pkt`}
                  </p>
                  <p className="text-bank-muted text-xs">{isOpen ? "▲" : "▼"}</p>
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 border-t border-bank-border/50 pt-4 space-y-3">
                  <div>
                    <p className="text-bank-muted text-xs font-medium mb-1">Podatny endpoint</p>
                    <code className="bg-bank-bg px-3 py-1.5 rounded text-bank-accent text-xs font-mono block">
                      {c.endpoint}
                    </code>
                  </div>
                  <div>
                    <p className="text-bank-muted text-xs font-medium mb-1">Wskazówka</p>
                    <p className="text-bank-text text-sm">{c.hint}</p>
                  </div>
                  <div>
                    <p className="text-bank-muted text-xs font-medium mb-1">
                      {isFound ? "Flaga znaleziona!" : "Wprowadź flagę"}
                    </p>
                    {isFound ? (
                      <p className="text-bank-success text-sm">✓ Wyzwanie ukończone</p>
                    ) : (
                      <FlagChecker challengeId={c.id} onSuccess={handleFlagSuccess} />
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
