from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from services.claude_service import stream_linkedin_post
import json

router = APIRouter()


class GenerateRequest(BaseModel):
    topic: str
    tone: str = "Professional"
    post_format: str = "Short hook"
    target_audience: str = ""
    include_cta: bool = True
    add_emojis: bool = True
    hashtag_count: int = 3


@router.post("/generate")
async def generate_post(request: GenerateRequest):
    if not request.topic.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty")

    async def event_stream():
        try:
            async for chunk in stream_linkedin_post(request):
                yield f"data: {json.dumps({'text': chunk})}\n\n"
            yield f"data: {json.dumps({'event': 'done'})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'event': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
