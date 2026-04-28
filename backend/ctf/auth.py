from typing import Any

from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token

from extensions import db
from models.player import Player
from ctf.decorators import ctf_jwt_required, get_ctf_player_id

ctf_auth_bp = Blueprint("ctf_auth", __name__)


@ctf_auth_bp.route("/register", methods=["POST"])
def ctf_register() -> Any:
    data = request.get_json() or {}
    nickname = data.get("nickname", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "")

    if not all([nickname, email, password]):
        return jsonify({"error": "Wymagane pola: nickname, email, password"}), 400
    if len(nickname) < 3 or len(nickname) > 30:
        return jsonify({"error": "Nickname musi mieć 3–30 znaków"}), 400
    if len(password) < 6:
        return jsonify({"error": "Hasło musi mieć co najmniej 6 znaków"}), 400

    if Player.query.filter_by(nickname=nickname).first():
        return jsonify({"error": "Nickname już zajęty"}), 409
    if Player.query.filter_by(email=email).first():
        return jsonify({"error": "Email już zajęty"}), 409

    player = Player(nickname=nickname, email=email)
    player.set_password(password)
    db.session.add(player)
    db.session.commit()

    token = create_access_token(
        identity=f"ctf_{player.id}",
        additional_claims={"ctf_player": True, "nickname": player.nickname},
    )
    return jsonify({"token": token, "player": player.to_dict()}), 201


@ctf_auth_bp.route("/login", methods=["POST"])
def ctf_login() -> Any:
    data = request.get_json() or {}
    email = data.get("email", "")
    password = data.get("password", "")

    player = Player.query.filter_by(email=email).first()
    if not player or not player.check_password(password):
        return jsonify({"error": "Nieprawidłowy email lub hasło"}), 401

    token = create_access_token(
        identity=f"ctf_{player.id}",
        additional_claims={"ctf_player": True, "nickname": player.nickname},
    )
    return jsonify({"token": token, "player": player.to_dict()}), 200


@ctf_auth_bp.route("/me", methods=["GET"])
@ctf_jwt_required
def ctf_me() -> Any:
    player_id = get_ctf_player_id()
    player = Player.query.get_or_404(player_id)
    return jsonify(player.to_dict()), 200
