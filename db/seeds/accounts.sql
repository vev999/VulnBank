-- VulnBank — seed kont bankowych

INSERT INTO accounts (id, user_id, iban, balance, currency, internal_note, created_at)
VALUES
    -- VULN: A01 — flaga ukryta w internal_note konta alice (id=1)
    (1, 1, 'PL00100100100100100100100100', 5432.50, 'PLN', 'PWR{idor_account_takeover}', '2024-01-01 10:05:00'),
    (2, 2, 'PL00200200200200200200200200', 2891.75, 'PLN', NULL, '2024-01-02 11:05:00'),
    (3, 3, 'PL00300300300300300300300300', 7234.00, 'PLN', NULL, '2024-01-03 12:05:00'),
    (4, 4, 'PL00400400400400400400400400', 99999.99,'PLN', NULL, '2024-01-04 09:05:00')
ON CONFLICT (id) DO NOTHING;

-- VULN: A04 — flaga w profilu charlie (przechowywana w bazie, dostępna po złamaniu hasła)
-- Flaga A04 jest w tabeli flags i ujawniana przez /api/profile po zalogowaniu jako charlie

SELECT setval('accounts_id_seq', (SELECT MAX(id) FROM accounts));
