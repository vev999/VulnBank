-- VulnBank — seed transakcji (min. 20 przykładowych przelewów)

INSERT INTO transactions (id, from_account_id, to_account_id, amount, title, created_at)
VALUES
    (1,  1, 2, 200.00,  'Przelew dla Boba',              '2024-01-05 09:00:00'),
    (2,  2, 1, 150.00,  'Zwrot za obiad',                 '2024-01-05 14:30:00'),
    (3,  1, 3, 500.00,  'Faktura 01/2024',                '2024-01-06 10:15:00'),
    (4,  3, 2, 75.50,   'Bilety na koncert',              '2024-01-06 18:00:00'),
    (5,  2, 3, 320.00,  'Czynsz — styczeń',              '2024-01-07 08:00:00'),
    (6,  4, 1, 1000.00, 'Premia za styczeń',              '2024-01-08 09:30:00'),
    (7,  1, 2, 45.00,   'Pizza delivery',                 '2024-01-09 20:15:00'),
    (8,  3, 1, 280.00,  'Wynajem sprzętu',                '2024-01-10 11:00:00'),
    (9,  2, 4, 100.00,  'Płatność za usługę',             '2024-01-11 15:45:00'),
    (10, 1, 3, 900.00,  'Faktura 02/2024',                '2024-01-12 10:00:00'),
    (11, 4, 2, 500.00,  'Refundacja — grudzień',          '2024-01-13 09:00:00'),
    (12, 2, 1, 33.00,   'Netflix — podział kosztów',      '2024-01-14 12:00:00'),
    (13, 3, 4, 2000.00, 'Wpłata na konto firmowe',        '2024-01-15 14:00:00'),
    (14, 1, 2, 88.00,   'Spotify Premium — 6 miesięcy',   '2024-01-16 10:30:00'),
    (15, 4, 3, 750.00,  'Wypłata — projekt X',            '2024-01-17 16:00:00'),
    (16, 2, 3, 120.00,  'Zakupy grupowe',                 '2024-01-18 11:00:00'),
    (17, 3, 1, 400.00,  'Zwrot depozytu',                 '2024-01-19 09:15:00'),
    (18, 1, 4, 55.00,   'Opłata administracyjna',         '2024-01-20 10:00:00'),
    (19, 4, 1, 200.00,  'Bonus za polecenie',             '2024-01-21 13:30:00'),
    (20, 2, 3, 650.00,  'Faktura 03/2024',                '2024-01-22 09:45:00'),
    (21, 3, 2, 180.00,  'Wynajem auta — weekend',         '2024-01-23 08:00:00'),
    (22, 1, 3, 25.00,   'Kawa i przekąski',               '2024-01-24 15:00:00'),
    (23, 4, 2, 300.00,  'Premie Q1',                      '2024-01-25 09:00:00'),
    (24, 2, 1, 70.00,   'Koszty transportu',              '2024-01-26 17:00:00'),
    (25, 3, 4, 1500.00, 'Zlecenie — design graficzny',    '2024-01-27 11:30:00')
ON CONFLICT (id) DO NOTHING;

SELECT setval('transactions_id_seq', (SELECT MAX(id) FROM transactions));
