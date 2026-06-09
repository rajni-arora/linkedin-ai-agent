# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LinkedIn AI Agent — generates LinkedIn posts via a FastAPI backend that streams responses using Server-Sent Events (SSE), consumed by a React/Vite frontend.

## Commands

### Backend

```bash
cd linkedin-ai-agent/backend
source venv/bin/activate          # activate the venv at project root (../../../venv)
uvicorn main:app --reload --port 8000
```

The venv is located at the project root (`/testproject/venv`), not inside the backend folder.

### Frontend

```bash
cd linkedin-ai-agent/frontend
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # production build
npm run preview    # preview production build
```

Both services must run simultaneously during development. There are no test commands configured.

## Architecture

### Request Flow

1. User submits the form → `useGenerate.js` POSTs to `/api/generate`
2. Vite dev server proxies `/api/*` → `http://localhost:8000` (configured in `vite.config.js`)
3. FastAPI router (`routers/generate.py`) validates the `GenerateRequest` Pydantic model and calls `services/claude_service.py`
4. `claude_service.py` calls the LLM API with streaming and yields text chunks
5. Each chunk is wrapped as `data: {"text": "..."}` SSE and flushed to the browser
6. Stream ends with `data: {"event": "done"}`
7. `useGenerate.js` reads the SSE stream via `ReadableStream`, appends chunks to state, and signals `isDone`

### Key Inconsistencies to Be Aware Of

- **`claude_service.py` actually uses OpenAI** (`gpt-4o-mini` via `openai` SDK), not Anthropic/Claude — despite the filename, the README, and the frontend footer saying "Powered by Claude AI"
- **`.env.example` shows `GEMINI_API_KEY`** but the code reads `OPENAI_API_KEY` — the `.env` file needs `OPENAI_API_KEY`
- The `openai` package pinned in `requirements.txt` is `0.8.3` (very old v0 API) — this conflicts with the v1 client syntax used in `claude_service.py` (`OpenAI(api_key=...)`)

### Frontend State

All state lives in `App.jsx` via the `useGenerate` hook. There is no global state manager. The `PostForm` component is uncontrolled — it collects values and passes them up on submit. `PostPreview` is purely display-driven by props from `useGenerate`.

### Tailwind Custom Tokens

LinkedIn-branded colors are defined in `tailwind.config.js` under the `linkedin` key (`linkedin-blue`, `linkedin-bg`, `linkedin-text`, etc.). Use these instead of raw hex values.

### Prompt Assembly

`build_user_prompt()` in `claude_service.py` assembles the LLM prompt from the `GenerateRequest` fields. `SYSTEM_PROMPT` (also in that file) is the fixed system instruction. Both are the primary levers for tuning output quality.

## Environment

Backend requires a `.env` file at `linkedin-ai-agent/backend/.env`:

```
OPENAI_API_KEY=sk-...
```