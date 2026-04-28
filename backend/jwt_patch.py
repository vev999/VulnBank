"""
JWT patch umożliwiający akceptowanie algorytmu 'none'.
VULN: A08 — celowo podatna konfiguracja JWT.
"""
import base64
import json
from typing import Optional


def decode_jwt_unsafe(token: str) -> Optional[dict]:
    """
    Dekoduje JWT bez weryfikacji podpisu.
    Akceptuje algorytm 'none'.
    """
    try:
        parts = token.split(".")
        if len(parts) < 2:
            return None

        header_raw = parts[0]
        payload_raw = parts[1]

        # Dopełnij padding base64url
        def pad(s: str) -> str:
            return s + "=" * (4 - len(s) % 4) if len(s) % 4 else s

        header = json.loads(base64.urlsafe_b64decode(pad(header_raw)))
        payload = json.loads(base64.urlsafe_b64decode(pad(payload_raw)))

        return {"header": header, "payload": payload}
    except Exception:
        return None
