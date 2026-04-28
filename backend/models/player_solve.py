from datetime import datetime
from extensions import db


class PlayerSolve(db.Model):
    __tablename__ = "player_solves"

    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey("players.id"), nullable=False)
    challenge_id = db.Column(db.String(5), nullable=False)
    points = db.Column(db.Integer, nullable=False)
    solved_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint("player_id", "challenge_id", name="uq_player_challenge"),
    )

    player = db.relationship("Player", back_populates="solves")
