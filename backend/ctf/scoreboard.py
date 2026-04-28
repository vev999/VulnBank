from typing import Any

from flask import Blueprint, jsonify
from sqlalchemy import func

from extensions import db
from models.player import Player
from models.player_solve import PlayerSolve

ctf_scoreboard_bp = Blueprint("ctf_scoreboard", __name__)


@ctf_scoreboard_bp.route("/", methods=["GET"])
def get_scoreboard() -> Any:
    rows = (
        db.session.query(
            Player.id,
            Player.nickname,
            func.coalesce(func.sum(PlayerSolve.points), 0).label("total_points"),
            func.count(PlayerSolve.id).label("solved_count"),
            func.max(PlayerSolve.solved_at).label("last_solve"),
        )
        .outerjoin(PlayerSolve, Player.id == PlayerSolve.player_id)
        .group_by(Player.id, Player.nickname)
        .order_by(
            func.coalesce(func.sum(PlayerSolve.points), 0).desc(),
            func.max(PlayerSolve.solved_at).asc(),
        )
        .all()
    )

    return jsonify([
        {
            "rank": i + 1,
            "nickname": r.nickname,
            "total_points": int(r.total_points),
            "solved_count": r.solved_count,
        }
        for i, r in enumerate(rows)
    ]), 200
