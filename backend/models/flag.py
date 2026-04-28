from extensions import db


class Flag(db.Model):
    __tablename__ = "flags"

    id = db.Column(db.Integer, primary_key=True)
    challenge_id = db.Column(db.String(5), nullable=False)
    flag_value = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    difficulty = db.Column(db.String(10))
    points = db.Column(db.Integer, default=100)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "challenge_id": self.challenge_id,
            "description": self.description,
            "difficulty": self.difficulty,
            "points": self.points,
        }
