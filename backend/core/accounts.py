from typing import Any

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models.account import Account

accounts_bp = Blueprint("accounts", __name__)


@accounts_bp.route("/", methods=["GET"])
@jwt_required()
def get_my_accounts() -> Any:
    user_id = int(get_jwt_identity())
    accounts = Account.query.filter_by(user_id=user_id).all()
    return jsonify([a.to_dict() for a in accounts]), 200


@accounts_bp.route("/<int:account_id>", methods=["GET"])
@jwt_required()
def get_account(account_id: int) -> Any:
    """
    VULN: A01 — Broken Access Control / IDOR
    Brak weryfikacji czy konto należy do zalogowanego użytkownika.
    Zalogowany użytkownik może pobrać dane KAŻDEGO konta po ID.
    Flaga PWR{idor_account_takeover} ukryta w polu internal_note konta alice (id=1).
    """
    # VULN: A01 — brakuje: if account.user_id != int(get_jwt_identity()): return 403
    account = Account.query.get_or_404(account_id)

    data = account.to_dict()
    # VULN: A01 — internal_note zawiera flagę i jest zawsze zwracane
    data["internal_note"] = account.internal_note
    return jsonify(data), 200


@accounts_bp.route("/iban/<string:iban>", methods=["GET"])
@jwt_required()
def get_account_by_iban(iban: str) -> Any:
    account = Account.query.filter_by(iban=iban).first()
    if not account:
        return jsonify({"error": "Konto o podanym IBAN nie istnieje"}), 404
    return jsonify({"id": account.id, "iban": account.iban, "currency": account.currency}), 200
