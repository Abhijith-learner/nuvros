# Backend Auth Notes

Endpoints:

- POST `/api/auth/signup/` { username, password, email?, full_name? }
- POST `/api/auth/login/` { username, password }
- GET `/api/auth/me/` with `Authorization: Bearer <token>`

All existing data endpoints require `Authorization: Bearer <token>`.

Token is a JWT signed with `SECRET_KEY` and expires after 24 hours.


