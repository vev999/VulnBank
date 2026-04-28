from extensions import db
from datetime import datetime


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    # VULN: A04 — MD5 bez soli zamiast bcrypt
    password_hash = db.Column(db.String(255), nullable=False)
    # VULN: A06 — PESEL przechowywany w bazie i zwracany w profilu
    pesel = db.Column(db.String(11), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    is_blocked = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    accounts = db.relationship("Account", back_populates="user", lazy=True)

    def to_dict(self, include_sensitive: bool = False) -> dict:
        data = {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "is_admin": self.is_admin,
            "is_blocked": self.is_blocked,
            "created_at": self.created_at.isoformat(),
        }
        if include_sensitive:
            # VULN: A06 — PESEL zwracany w odpowiedzi API profilu
            data["pesel"] = self.pesel
            # VULN: A04 — hash hasła zwracany w backupie
            data["password_hash"] = self.password_hash
        return data
