import time
from typing import Dict
import jwt
from decouple import config

# JWT configuration
JWT_SECRET = config("JWT_SECRET")
JWT_ALGORITHM = config("JWT_ALGORITHM")


def token_response(token: str):
    """Return a response object containing the JWT token."""
    return {
        "access_token": token
    }


def signJWT(user_id: str) -> Dict[str, str]:
    """Sign JWT token and return it in a response object."""
    payload = {
        "user_id": user_id,
        "exp": time.time() + 3600
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token_response(token)


def decodeJWT(token: str) -> dict:
    """Verify JWT token and return the payload."""
    try:
        decoded_token = jwt.decode(
            token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return decoded_token if decoded_token["exp"] > time.time() else None
    except:
        return {}
