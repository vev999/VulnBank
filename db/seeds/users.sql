-- VulnBank — seed użytkowników
-- Hasła hashowane MD5 (celowo — podatność A04)
-- Wyliczone: python3 -c "import hashlib; print(hashlib.md5(b'HASLO').hexdigest())"
--
-- alice   / qwerty123   → 3fc0a7acf087f549ac2b266baf94b8b1
-- bob     / password123 → 482c811da5d5b4bc6d497ffa98491e38
-- charlie / charlie2024 → 5e201833a6a6462cc668004937b4f857
-- admin   / admin123    → 0192023a7bbd73250516f069df18b500

INSERT INTO users (id, first_name, last_name, email, password_hash, pesel, is_admin, is_blocked, created_at)
VALUES
    (1, 'Alice',   'Kowalska',   'alice@vulnbank.pl',   '3fc0a7acf087f549ac2b266baf94b8b1', '90010112345', false, false, '2024-01-01 10:00:00'),
    (2, 'Bob',     'Nowak',      'bob@vulnbank.pl',     '482c811da5d5b4bc6d497ffa98491e38', '85050267890', false, false, '2024-01-02 11:00:00'),
    (3, 'Charlie', 'Wisniewski', 'charlie@vulnbank.pl', '5e201833a6a6462cc668004937b4f857', '92110398765', false, false, '2024-01-03 12:00:00'),
    (4, 'Admin',   'VulnBank',   'admin@vulnbank.pl',   '0192023a7bbd73250516f069df18b500', '70010145678', true,  false, '2024-01-04 09:00:00')
ON CONFLICT (id) DO NOTHING;

-- Resetuj sekwencję po manualnym insercie z ID
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
