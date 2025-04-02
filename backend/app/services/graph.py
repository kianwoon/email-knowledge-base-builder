from typing import List, Dict, Any
from msgraph.core import GraphClient
from azure.identity import ClientSecretCredential
from ..config import settings

class GraphService:
    def __init__(self, access_token: str):
        self.client = GraphClient(credential=access_token)

    async def get_me(self) -> Dict[str, Any]:
        response = await self.client.get("/me")
        return response.json()

    async def get_mail_folders(self) -> List[Dict[str, Any]]:
        response = await self.client.get("/me/mailFolders")
        return response.json().get("value", [])

    async def get_messages(self, limit: int = 10) -> List[Dict[str, Any]]:
        response = await self.client.get(
            f"/me/messages?$top={limit}&$select=id,subject,from,receivedDateTime"
        )
        return response.json().get("value", [])

    async def get_folder_messages(
        self,
        folder_id: str,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        response = await self.client.get(
            f"/me/mailFolders/{folder_id}/messages?$top={limit}&$select=id,subject,from,receivedDateTime"
        )
        return response.json().get("value", [])

    async def get_message_content(self, message_id: str) -> Dict[str, Any]:
        response = await self.client.get(
            f"/me/messages/{message_id}?$select=id,subject,body,from,receivedDateTime"
        )
        return response.json()