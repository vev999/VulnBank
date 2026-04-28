import os


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "supersecretkey")
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", "postgresql://vulnbank:vulnbank@db/vulnbank"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # VULN: A08 — JWT akceptuje wiele algorytmów, w tym "none"
    JWT_SECRET_KEY = os.environ.get("SECRET_KEY", "supersecretkey")
    JWT_ALGORITHM = "HS256"
    JWT_ACCESS_TOKEN_EXPIRES = False  # 30 dni brak wygaśnięcia — celowo

    # VULN: A02 — CORS całkowicie otwarty
    CORS_ORIGINS = "*"

    REDIS_URL = os.environ.get("REDIS_URL", "redis://redis:6379")

    # VULN: A10 — Flask DEBUG włączony (stack traces z Werkzeug debuggerem)
    DEBUG = os.environ.get("FLASK_DEBUG", "true").lower() == "true"

    # VULN: A10 — connection string z flagą wbudowaną
    DB_CONNECTION_STRING = os.environ.get(
        "DATABASE_URL", "postgresql://vulnbank:vulnbank@db/vulnbank"
    )

    # Flaga A02 w zmiennych środowiskowych
    FLAG_A02 = os.environ.get("FLAG_A02", "PWR{debug_config_exposed}")
