from flask import Flask
from config import Config
from extensions import init_extensions, db


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    init_extensions(app)

    with app.app_context():
        from core.auth import auth_bp
        from core.accounts import accounts_bp
        from core.transactions import transactions_bp
        from core.profile import profile_bp
        from core.admin import admin_bp
        from core.loans import loans_bp
        from core.flags import flags_bp
        from ctf.auth import ctf_auth_bp
        from ctf.flags import ctf_flags_bp
        from ctf.scoreboard import ctf_scoreboard_bp

        app.register_blueprint(auth_bp, url_prefix="/api/auth")
        app.register_blueprint(accounts_bp, url_prefix="/api/accounts")
        app.register_blueprint(transactions_bp, url_prefix="/api/transactions")
        app.register_blueprint(profile_bp, url_prefix="/api/profile")
        app.register_blueprint(admin_bp, url_prefix="/api/admin")
        app.register_blueprint(loans_bp, url_prefix="/api/loans")
        app.register_blueprint(flags_bp, url_prefix="/api/flags")
        app.register_blueprint(ctf_auth_bp, url_prefix="/api/ctf/auth")
        app.register_blueprint(ctf_flags_bp, url_prefix="/api/ctf/flags")
        app.register_blueprint(ctf_scoreboard_bp, url_prefix="/api/ctf/scoreboard")

        from challenges import register_challenges
        register_challenges(app)

        db.create_all()

        from core.logging_setup import setup_logging
        setup_logging(app)

    return app
