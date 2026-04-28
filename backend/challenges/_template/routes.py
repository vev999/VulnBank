# Challenge: AXX - Nazwa Podatności
# Difficulty: easy/medium/hard
# Flag: PWR{twoja_flaga_tutaj}
# Tools: curl / Burp Suite
# Author: VulnBank Team

from typing import Any
from flask import Blueprint, jsonify

# Zmień nazwę blueprintu na unikalną nazwę wyzwania
blueprint = Blueprint("challenge_template", __name__, url_prefix="/api/challenges/template")


@blueprint.route("/", methods=["GET"])
def challenge_info() -> Any:
    """Opis wyzwania i hint."""
    return jsonify({
        "challenge": "AXX",
        "name": "Nazwa Podatności",
        "description": "Opis podatności",
        "hint": "Hint dla uczestnika",
    }), 200


# VULN: AXX — Tutaj umieść podatny endpoint
@blueprint.route("/vulnerable", methods=["GET"])
def vulnerable_endpoint() -> Any:
    return jsonify({"message": "Podatny endpoint"}), 200
