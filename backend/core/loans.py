from typing import Any

from flask import Blueprint, jsonify, request

loans_bp = Blueprint("loans", __name__)


@loans_bp.route("/calculate", methods=["GET"])
def calculate_loan() -> Any:
    """
    VULN: A10 — Mishandling of Exceptional Conditions
    Brak obsługi wyjątków. Flask DEBUG=True → pełny stack trace Werkzeug
    z wartościami zmiennych lokalnych, w tym connection string do bazy.
    Parametr amount=abc powoduje ValueError ujawniający internale.

    Exploit: GET /api/loans/calculate?amount=abc&rate=2
    W stack trace widoczna zmienna db_url z flagą wbudowaną w connection string.
    """
    import os

    amount_str = request.args.get("amount", "")
    rate_str = request.args.get("rate", "")

    db_url = os.environ.get(
        "DATABASE_URL",
        "postgresql://vulnbank:PWR{stacktrace_db_url_leaked}@db/vulnbank"
    )

    # VULN: A10 — brak try/except, brak walidacji wejścia
    amount = float(amount_str)
    rate = float(rate_str)

    monthly_rate = rate / 100 / 12
    months = 12
    payment = amount * (monthly_rate * (1 + monthly_rate) ** months) / (
        (1 + monthly_rate) ** months - 1
    )

    return jsonify({
        "amount": amount,
        "rate": rate,
        "monthly_payment": round(payment, 2),
        "total": round(payment * months, 2),
    }), 200
