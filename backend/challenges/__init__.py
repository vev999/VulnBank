import importlib
import pkgutil
import os
from flask import Flask


def register_challenges(app: Flask) -> None:
    """Auto-discovery i rejestracja wszystkich blueprintów z folderu challenges/."""
    challenges_dir = os.path.dirname(__file__)
    for _, module_name, _ in pkgutil.iter_modules([challenges_dir]):
        if module_name.startswith("_"):
            continue
        try:
            module = importlib.import_module(f".{module_name}", package=__name__)
            if hasattr(module, "blueprint"):
                app.register_blueprint(module.blueprint)
                app.logger.info(f"[+] Challenge loaded: {module_name}")
        except Exception as e:
            app.logger.error(f"[-] Failed to load challenge {module_name}: {e}")
