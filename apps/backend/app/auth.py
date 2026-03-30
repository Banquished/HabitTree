import time

import httpx
import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import settings

_security = HTTPBearer()
_jwks_cache: dict = {}
_jwks_cache_time: float = 0
_JWKS_CACHE_TTL = 3600


async def _get_jwks() -> dict:
    global _jwks_cache, _jwks_cache_time
    now = time.time()
    if _jwks_cache and (now - _jwks_cache_time) < _JWKS_CACHE_TTL:
        return _jwks_cache

    jwks_url = f"{settings.clerk_issuer}/.well-known/jwks.json"
    async with httpx.AsyncClient() as client:
        resp = await client.get(jwks_url)
        resp.raise_for_status()
        _jwks_cache = resp.json()
        _jwks_cache_time = now
        return _jwks_cache


async def verify_clerk_token(
    credentials: HTTPAuthorizationCredentials = Depends(_security),
) -> str:
    """Validate Clerk JWT and return clerk_user_id (sub claim)."""
    token = credentials.credentials
    try:
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        if not kid:
            raise HTTPException(401, "Token missing kid header")

        jwks = await _get_jwks()
        key = None
        for k in jwks.get("keys", []):
            if k["kid"] == kid:
                key = jwt.algorithms.RSAAlgorithm.from_jwk(k)
                break

        if key is None:
            raise HTTPException(401, "Token signing key not found")

        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            issuer=settings.clerk_issuer,
            options={"require": ["exp", "iss", "sub"]},
        )

        clerk_user_id = payload.get("sub")
        if not clerk_user_id:
            raise HTTPException(401, "Token missing sub claim")

        return clerk_user_id

    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(401, f"Invalid token: {e}")
