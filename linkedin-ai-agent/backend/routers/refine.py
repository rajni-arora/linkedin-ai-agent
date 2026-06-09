from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.refinement_agent import refine_post

router = APIRouter()


class RefineRequest(BaseModel):
    original_post: str
    tone: str = ""
    topic: str = ""


class Variant(BaseModel):
    strategy: str
    content: str


class RefineResponse(BaseModel):
    variants: list[Variant]


@router.post("/refine", response_model=RefineResponse)
async def refine_post_endpoint(request: RefineRequest):
    if not request.original_post.strip():
        raise HTTPException(status_code=400, detail="original_post cannot be empty")

    raw = await refine_post(
        original_post=request.original_post,
        tone=request.tone,
        topic=request.topic,
    )

    return RefineResponse(
        variants=[Variant(strategy=v["label"], content=v["post"]) for v in raw]
    )
