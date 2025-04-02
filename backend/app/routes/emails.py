from fastapi import APIRouter, Depends, HTTPException
from ..services.auth import AuthService
from ..services.graph import GraphService

router = APIRouter()
auth_service = AuthService()

@router.get("/folders")
async def get_folders(token: str = Depends(auth_service.get_current_token)):
    try:
        graph_service = GraphService(token)
        folders = await graph_service.get_mail_folders()
        return folders
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/preview")
async def get_email_preview(token: str = Depends(auth_service.get_current_token)):
    try:
        graph_service = GraphService(token)
        emails = await graph_service.get_messages()
        return emails
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{folder_id}")
async def get_folder_emails(
    folder_id: str,
    token: str = Depends(auth_service.get_current_token)
):
    try:
        graph_service = GraphService(token)
        emails = await graph_service.get_folder_messages(folder_id)
        return emails
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))