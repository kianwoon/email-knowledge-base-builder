from fastapi import HTTPException
from msal import ConfidentialClientApplication
from ..config import settings
import jwt

class AuthService:
    def __init__(self):
        self.client = ConfidentialClientApplication(
            client_id=settings.MS_CLIENT_ID,
            client_credential=settings.MS_CLIENT_SECRET,
            authority=f"https://login.microsoftonline.com/{settings.MS_TENANT_ID}"
        )

    def get_auth_url(self) -> str:
        auth_url = self.client.get_authorization_request_url(
            scopes=settings.MS_SCOPES,
            redirect_uri=settings.MS_REDIRECT_URI,
            response_type="code"
        )
        return auth_url

    async def get_token(self, code: str) -> str:
        result = self.client.acquire_token_by_authorization_code(
            code=code,
            scopes=settings.MS_SCOPES,
            redirect_uri=settings.MS_REDIRECT_URI
        )

        if "error" in result:
            raise HTTPException(
                status_code=400,
                detail=f"Error getting token: {result.get('error_description')}"
            )

        # Create a session token
        session_token = jwt.encode(
            {"access_token": result["access_token"]},
            settings.JWT_SECRET,
            algorithm=settings.JWT_ALGORITHM
        )

        return session_token

    async def get_current_token(self, session: str = None) -> str:
        if not session:
            raise HTTPException(status_code=401, detail="Not authenticated")

        try:
            payload = jwt.decode(
                session,
                settings.JWT_SECRET,
                algorithms=[settings.JWT_ALGORITHM]
            )
            token = payload.get("access_token")
            if not token:
                raise HTTPException(status_code=401, detail="Invalid token")
            return token
        except jwt.JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")

    async def get_current_user(self, session: str) -> dict:
        token = await self.get_current_token(session)
        from .graph import GraphService
        graph_service = GraphService(token)
        return await graph_service.get_me()