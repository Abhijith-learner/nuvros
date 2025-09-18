from datetime import datetime, timedelta, timezone
from functools import wraps
from typing import Optional, Tuple

import jwt
from django.conf import settings
from django.http import JsonResponse

from .models import AppUser


JWT_ALGORITHM = "HS256"
JWT_EXPIRY_HOURS = 24


def generate_jwt(user_id: int) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(hours=JWT_EXPIRY_HOURS)).timestamp()),
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=JWT_ALGORITHM)
    # In PyJWT>=2, encode returns str
    return token


def verify_jwt(token: str) -> Tuple[bool, Optional[AppUser], Optional[str]]:
    try:
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id = int(decoded.get("sub"))
        try:
            user = AppUser.objects.get(pk=user_id, is_active=True)
        except AppUser.DoesNotExist:
            return False, None, "User not found"
        return True, user, None
    except jwt.ExpiredSignatureError:
        return False, None, "Token expired"
    except Exception as exc:  # noqa: BLE001
        return False, None, str(exc)


def refresh_jwt(token: str) -> Tuple[bool, Optional[str], Optional[str]]:
    """
    Refresh a JWT token if it's valid (even if expired recently)
    Returns: (success, new_token, error_message)
    """
    try:
        # Allow expired tokens for refresh (within a reasonable window)
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=[JWT_ALGORITHM], options={"verify_exp": False})
        user_id = int(decoded.get("sub"))
        exp_timestamp = decoded.get("exp")
        
        if not exp_timestamp:
            return False, None, "Invalid token"
            
        # Check if token expired more than 7 days ago (refuse to refresh old tokens)
        now = datetime.now(timezone.utc)
        exp_time = datetime.fromtimestamp(exp_timestamp, timezone.utc)
        if (now - exp_time).days > 7:
            return False, None, "Token too old to refresh"
        
        try:
            user = AppUser.objects.get(pk=user_id, is_active=True)
        except AppUser.DoesNotExist:
            return False, None, "User not found"
            
        # Generate new token
        new_token = generate_jwt(user.id)
        return True, new_token, None
        
    except Exception as exc:  # noqa: BLE001
        return False, None, str(exc)


def _extract_bearer_token(authorization_header: Optional[str]) -> Optional[str]:
    if not authorization_header:
        return None
    parts = authorization_header.split()
    if len(parts) == 2 and parts[0].lower() == "bearer":
        return parts[1]
    return None


def require_auth(view_func):  # noqa: ANN001
    @wraps(view_func)
    def _wrapped(request, *args, **kwargs):  # noqa: ANN001
        token = _extract_bearer_token(request.headers.get("Authorization"))
        if not token:
            return JsonResponse({"success": False, "error": "Missing Authorization header"}, status=401)
        ok, user, err = verify_jwt(token)
        if not ok or not user:
            return JsonResponse({"success": False, "error": err or "Invalid token"}, status=401)
        # Attach the current user to the request for downstream use
        request.current_user = user  # type: ignore[attr-defined]
        return view_func(request, *args, **kwargs)

    return _wrapped


