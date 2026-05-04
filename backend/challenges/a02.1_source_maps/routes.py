# Challenge: A02.2 - Security Misconfiguration (Source Maps Leak)
# Difficulty: easy
# Flag: PWR{S0urc3_M4ps_L34k}
# Tools: przeglądarka (Narzędzia Deweloperskie / F12)
# Author: VulnBank Team

from typing import Any
from flask import Blueprint, jsonify

# Rejestrujemy blueprint, aby główny skrypt app.py mógł go poprawnie załadować.
blueprint = Blueprint("challenge_a02_source_maps", __name__, url_prefix="/api/a02")

@blueprint.route("/", methods=["GET"])
def challenge_info() -> Any:
    return jsonify({
        "challenge": "A02",
        "name": "Source Maps Leak",
        "category": "OWASP: A05:2021",
        "difficulty": "easy",
        "points": 100,
        "description": (
            "Aplikacja błędnie udostępnia pliki mapowania źródeł (Source Maps) na produkcji. "
            "Narzędzia deweloperskie przeglądarki (zakładka Sources / F12) ujawniają oryginalny, "
            "niezminifikowany kod źródłowy frontendu wraz z wrażliwymi komentarzami."
        ),
        "hint": "Zajrzyj do DevTools -> Sources i przeszukaj kod źródłowy"
    }), 200