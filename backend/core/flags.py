from typing import Any

from flask import Blueprint, jsonify

flags_bp = Blueprint("flags", __name__)


@flags_bp.route("/", methods=["GET"])
def list_challenges() -> Any:
    """Publiczny listing challengów — szczegóły i submit flag w /api/ctf/flags/."""
    from ctf.flags import CHALLENGE_META
    return jsonify(CHALLENGE_META), 200


@flags_bp.route("/check", methods=["POST"])
def check_flag_deprecated() -> Any:
    return jsonify({
        "error": "Ten endpoint został przeniesiony. Użyj POST /api/ctf/flags/check po zalogowaniu do portalu CTF.",
        "ctf_login": "/ctf/login",
    }), 410
