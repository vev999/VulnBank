from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db


class Player(db.Model):
    __tablename__ = "players"

    id = db.Column(db.Integer, primary_key=True)
    nickname = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    solves = db.relationship("PlayerSolve", back_populates="player", lazy=True)

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self) -> dict:
        total_points = sum(s.points for s in self.solves)
        return {
            "id": self.id,
            "nickname": self.nickname,
            "email": self.email,
            "total_points": total_points,
            "solved_count": len(self.solves),
            "created_at": self.created_at.isoformat(),
        }
