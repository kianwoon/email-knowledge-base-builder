from fastapi import APIRouter, HTTPException, Response, Request
from fastapi.responses import RedirectResponse
from ..services.auth import AuthService
from ..config import settings

router = APIRouter()
auth_service = AuthService()

@router.get("/login")
async def login():
    auth_url = auth_service.get_auth_url()
    return {"auth_url": auth_url}

@router.get("/callback")
async def callback(code: str, request: Request):
    try:
        token = await auth_service.get_token(code)
        response = RedirectResponse(url=settings.FRONTEND_URL)
        response.set_cookie(
            key="session",
            value=token,
            httponly=True,
            secure=True,
            samesite="lax"
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me")
async def get_current_user(request: Request):
    try:
        session = request.cookies.get("session")
        if not session:
            raise HTTPException(status_code=401, detail="Not authenticated")
        user = await auth_service.get_current_user(session)
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/logout")
async def logout():
    response = Response()
    response.delete_cookie(key="session")
    return response