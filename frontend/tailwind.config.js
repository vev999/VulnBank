/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "bank-bg": "#0f172a",
        "bank-card": "#1e293b",
        "bank-border": "#334155",
        "bank-accent": "#3b82f6",
        "bank-accent-hover": "#2563eb",
        "bank-success": "#22c55e",
        "bank-danger": "#ef4444",
        "bank-warning": "#f59e0b",
        "bank-text": "#f1f5f9",
        "bank-muted": "#94a3b8",
        // CTF Portal — zielony motyw (odróżnienie od bankowego niebieskiego)
        "ctf-bg": "#0a1a0f",
        "ctf-card": "#0f2318",
        "ctf-border": "#1a4028",
        "ctf-accent": "#22c55e",
        "ctf-accent-hover": "#16a34a",
        "ctf-text": "#f0fdf4",
        "ctf-muted": "#86efac",
        "ctf-danger": "#ef4444",
        "ctf-warning": "#f59e0b",
      },
    },
  },
  plugins: [],
};
