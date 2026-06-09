from openai import AsyncOpenAI
import os
from dotenv import load_dotenv
from typing import AsyncGenerator

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """You are a world-class LinkedIn content strategist and ghostwriter.
You write posts that feel authentic, human, and drive massive engagement.
You deeply understand LinkedIn's algorithm, audience psychology, and what makes people stop scrolling.

Your writing principles:
- Hook in the FIRST line — make it impossible to ignore
- Use white space generously — short paragraphs, line breaks
- Write like a human, not a corporate brochure
- Deliver real value or emotion — no fluff
- End with intention — CTA, question, or mic-drop line
- Never use buzzwords like "synergy", "leverage", "game-changer" unless ironic
- Always match the requested tone and format exactly"""


def build_user_prompt(req) -> str:
    format_instructions = {
        "Short hook (< 150 words)": "Write a punchy, short post under 150 words. One powerful idea, strong hook, clean ending.",
        "Listicle (numbered tips)": "Write a numbered list post (5-7 points). Each point is concise and actionable. Start with a hook line before the list.",
        "Personal story": "Write a personal narrative arc: setup → conflict/struggle → lesson/resolution. First person, vulnerable, relatable.",
        "Opinion / Hot take": "Write a bold contrarian opinion post. State the hot take clearly upfront, then defend it with 2-3 sharp arguments. Invite debate.",
        "Achievement announcement": "Write a humble-brag done right — celebrate an achievement while crediting others, sharing the lesson, or inspiring the reader.",
    }

    format_instruction = format_instructions.get(req.post_format, format_instructions["Short hook (< 150 words)"])

    parts = [
        f"Write a LinkedIn post about: {req.topic}",
        f"\nTone: {req.tone}",
        f"\nFormat instruction: {format_instruction}",
    ]

    if req.target_audience:
        parts.append(f"\nTarget audience: {req.target_audience} — write specifically for them")

    if req.include_cta:
        parts.append("\nEnd with a clear, engaging call-to-action (ask a question, invite comments, or direct them to take action).")

    if req.add_emojis:
        parts.append("\nSprinkle 3-5 relevant emojis naturally throughout the post to add visual appeal.")
    else:
        parts.append("\nDo NOT use any emojis.")

    if req.hashtag_count > 0:
        parts.append(f"\nEnd the post with exactly {req.hashtag_count} relevant hashtags on a new line.")
    else:
        parts.append("\nDo NOT include any hashtags.")

    parts.append("\n\nIMPORTANT: Output ONLY the LinkedIn post text. No preamble, no explanation, no quotes around the post.")

    return "".join(parts)


async def stream_linkedin_post(req) -> AsyncGenerator[str, None]:
    user_prompt = build_user_prompt(req)

    stream = await client.chat.completions.create(
        model="gpt-4o-mini",
        max_tokens=1024,
        temperature=0.8,
        stream=True,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
    )

    async for chunk in stream:
        text = chunk.choices[0].delta.content
        if text:
            yield text