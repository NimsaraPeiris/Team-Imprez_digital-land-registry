from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    system: str | None = None
    history: str | None = None
    user: str

class ChatResponse(BaseModel):
    reply: str

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(payload: ChatRequest):
    """Simple development/stub chat endpoint.

    Returns a deterministic short reply so frontend can function in dev and tests.
    Production can swap this with a real AI service implementation.
    """
    user_text = payload.user or ""
    # Very small deterministic response for tests and dev
    reply = f"Echo: {user_text}"
    return {"reply": reply}
