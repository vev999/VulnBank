from extensions import db
from datetime import datetime


class Account(db.Model):
    __tablename__ = "accounts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    iban = db.Column(db.String(32), unique=True, nullable=False)
    balance = db.Column(db.Numeric(12, 2), default=0)
    currency = db.Column(db.String(3), default="PLN")
    # VULN: A01 — flaga ukryta w polu internal_note konta alice (id=1)
    internal_note = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="accounts")
    sent_transactions = db.relationship(
        "Transaction", foreign_keys="Transaction.from_account_id", lazy=True
    )
    received_transactions = db.relationship(
        "Transaction", foreign_keys="Transaction.to_account_id", lazy=True
    )

    def to_dict(self, include_internal: bool = False) -> dict:
        data = {
            "id": self.id,
            "user_id": self.user_id,
            "iban": self.iban,
            "balance": float(self.balance),
            "currency": self.currency,
            "created_at": self.created_at.isoformat(),
        }
        if include_internal:
            data["internal_note"] = self.internal_note
        return data
