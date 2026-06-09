import asyncio
import os
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

MODEL = "gpt-4o-mini"

BASE_SYSTEM = """You are a world-class LinkedIn content strategist.
You receive a LinkedIn post and rewrite it according to a specific strategy.
Output ONLY the rewritten post — no preamble, no labels, no explanation."""

STRATEGIES = [
    {
        "name": "hook_optimizer",
        "label": "Hook Optimizer",
        "instruction": (
            "Rewrite this LinkedIn post with a significantly stronger opening line. "
            "The first sentence must create irresistible curiosity, bold contrast, or an unexpected claim "
            "that makes the reader stop scrolling. Keep the body and closing intact — only transform the hook."
        ),
    },
    {
        "name": "storytelling",
        "label": "Storytelling Rewrite",
        "instruction": (
            "Rewrite this LinkedIn post as a personal narrative. "
            "Structure it as: setup (the situation) → tension (the challenge or turning point) → resolution (the lesson). "
            "Use first person, specific sensory details, and a human voice. Preserve the core message."
        ),
    },
    {
        "name": "viral_engagement",
        "label": "Viral & Engagement",
        "instruction": (
            "Rewrite this LinkedIn post to maximize engagement and shareability. "
            "Use short punchy sentences, bold line breaks, and a format optimized for LinkedIn's feed. "
            "Open with a pattern-interrupt, build momentum through the middle, and close with a thought-provoking "
            "question or a mic-drop line that invites comments."
        ),
    },
]


async def _run_strategy(original_post: str, strategy: dict, context: str) -> dict:
    user_content = f"{strategy['instruction']}"
    if context:
        user_content += f"\n\nContext: {context}"
    user_content += f"\n\nOriginal post:\n{original_post}"

    response = await client.chat.completions.create(
        model=MODEL,
        max_tokens=1024,
        temperature=0.8,
        messages=[
            {"role": "system", "content": BASE_SYSTEM},
            {"role": "user", "content": user_content},
        ],
    )
    return {
        "strategy": strategy["name"],
        "label": strategy["label"],
        "post": response.choices[0].message.content,
    }


async def refine_post(original_post: str, tone: str = "", topic: str = "") -> list[dict]:
    context_parts = []
    if topic:
        context_parts.append(f"Topic: {topic}")
    if tone:
        context_parts.append(f"Tone: {tone}")
    context = " | ".join(context_parts)

    tasks = [_run_strategy(original_post, strategy, context) for strategy in STRATEGIES]
    results = await asyncio.gather(*tasks)
    return list(results)
