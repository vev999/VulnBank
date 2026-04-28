import os
from app import create_app

app = create_app()

if __name__ == "__main__":
    # VULN: A10 — DEBUG=True, use_debugger=True → Werkzeug interactive debugger
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=os.environ.get("FLASK_DEBUG", "true").lower() == "true",
        use_debugger=True,
        use_reloader=False,
    )
