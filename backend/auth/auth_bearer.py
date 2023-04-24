from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from auth.auth_handler import decodeJWT


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        """
        Initialize JWT Bearer
        """
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        """
        Call JWT Bearer
        """
        credentials: HTTPAuthorizationCredentials = await super(
            JWTBearer, self
        ).__call__(request)
        if credentials:
            if not self.verify_jwt(credentials.credentials):
                raise HTTPException(
                    status_code=403, detail="Could not validate credentials"
                )
            return credentials
        else:
            raise HTTPException(
                status_code=403, detail="Could not validate credentials"
            )

    def verify_jwt(self, jwt_token: str) -> bool:
        """
        Verify JWT token
        """
        if decodeJWT(jwt_token):
            return True
        return False
