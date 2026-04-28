from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import redis as redis_client
import os

db = SQLAlchemy()
jwt = JWTManager()
cors = CORS()


def init_redis():
    url = os.environ.get("REDIS_URL", "redis://redis:6379")
    try:
        r = redis_client.from_url(url, decode_responses=True)
        r.ping()
        return r
    except Exception:
        return None


redis_store = None


def init_extensions(app):
    global redis_store

    db.init_app(app)

    # VULN: A08 — JWT skonfigurowany bez wymuszania algorytmu
    jwt.init_app(app)

    # VULN: A02 — CORS całkowicie otwarty
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    redis_store = init_redis()
    app.redis = redis_store
