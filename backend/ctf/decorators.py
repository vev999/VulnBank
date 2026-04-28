from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt, get_jwt_identity


def ctf_jwt_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt()
        if not claims.get("ctf_player"):
            return jsonify({"error": "Wymagany token CTF. Zaloguj się do portalu CTF."}), 403
        return fn(*args, **kwargs)
    return wrapper


def get_ctf_player_id() -> int:
    identity = get_jwt_identity()  # "ctf_<id>"
    return int(identity.split("_")[1])
