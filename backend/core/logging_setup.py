import logging
import os

LOG_FILE = "/tmp/vulnbank.log"

SEEDED_LOGS = [
    "2024-01-15 08:23:11 ERROR Login failed for admin@vulnbank.pl with password PWR{logs_exposed_no_auth}",
    "2024-01-15 08:23:15 ERROR Login failed for alice@vulnbank.pl with password qwerty123",
    "2024-01-15 09:01:33 INFO User 3 logged in successfully",
    "2024-01-15 09:45:22 ERROR Login failed for bob@vulnbank.pl with password 12345",
    "2024-01-15 10:12:44 ERROR Login failed for admin@vulnbank.pl with password PWR{logs_exposed_no_auth}",
    "2024-01-15 11:30:01 INFO Transfer completed: 500.00 PLN from account 2 to account 3",
    "2024-01-15 12:00:00 INFO User 1 logged in successfully",
    "2024-01-15 13:22:19 ERROR Login failed for test@test.pl with password test123",
    "2024-01-15 14:11:05 INFO Transfer completed: 200.00 PLN from account 1 to account 2",
    "2024-01-15 15:55:33 ERROR Login failed for admin@vulnbank.pl with password wrongpassword",
]


def setup_logging(app):
    """Inicjalizacja logowania — zaseeduj plik logów z przykładowymi danymi (VULN: A09)."""
    handler = logging.FileHandler(LOG_FILE)
    handler.setLevel(logging.DEBUG)
    formatter = logging.Formatter("%(asctime)s %(levelname)s %(message)s")
    handler.setFormatter(formatter)

    app.logger.addHandler(handler)
    app.logger.setLevel(logging.DEBUG)

    vuln_logger = logging.getLogger("vulnbank")
    vuln_logger.addHandler(handler)
    vuln_logger.setLevel(logging.DEBUG)

    # Zaseeduj plik logów jeśli pusty
    if not os.path.exists(LOG_FILE) or os.path.getsize(LOG_FILE) == 0:
        with open(LOG_FILE, "w") as f:
            for line in SEEDED_LOGS:
                f.write(line + "\n")
