# LinkedIn AI Agent

Generate high-quality LinkedIn posts using Claude AI. FastAPI backend + React frontend.

---

## Project Structure

```
linkedin-ai-agent/
├── backend/
│   ├── main.py                  # FastAPI app
│   ├── routers/
│   │   └── generate.py          # POST /api/generate (SSE stream)
│   ├── services/
│   │   └── claude_service.py    # Claude API + prompt builder
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── package.json
    └── src/
        ├── App.jsx
        ├── components/
        │   ├── PostForm.jsx      # Form with all controls
        │   └── PostPreview.jsx   # LinkedIn card mockup
        └── hooks/
            └── useGenerate.js   # SSE streaming hook
```

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- An Anthropic API key → https://console.anthropic.com

---

## Setup & Run

### Step 1 — Get your API key

1. Go to https://console.anthropic.com
2. Create an account and go to **API Keys**
3. Click **Create Key** and copy it

---

### Step 2 — Backend Setup

```bash
# Navigate to backend
cd linkedin-ai-agent/backend

# Create virtual environment
python -m venv venv

# Activate it
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create your .env file
cp .env.example .env
```

Now open `.env` and paste your key:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxx
```

Start the backend:
```bash
uvicorn main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

Test it: http://localhost:8000 → should return `{"status": "LinkedIn AI Agent is running"}`

---

### Step 3 — Frontend Setup

Open a **new terminal**:

```bash
# Navigate to frontend
cd linkedin-ai-agent/frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

You should see:
```
  VITE v5.x  ready in Xms
  ➜  Local:   http://localhost:5173/
```

---

### Step 4 — Open the app

Go to: **http://localhost:5173**

---

## How to Use

1. Enter your **topic or idea** in the textarea
2. Select a **tone** (pill buttons)
3. Choose a **post format** from the dropdown
4. (Optional) Set your **target audience**
5. Adjust **hashtag count** with the slider
6. Toggle **CTA** and **Emojis** as desired
7. Click **Generate Post** — watch it stream in real time!
8. Hit **Copy** to copy to clipboard, or **Regenerate** for a new variation

---

## API Endpoints

### `POST /api/generate`
Streams a LinkedIn post as Server-Sent Events.

**Request body:**
```json
{
  "topic": "Why I quit my 9-5",
  "tone": "Storytelling",
  "post_format": "Personal story",
  "target_audience": "Startup founders",
  "include_cta": true,
  "add_emojis": true,
  "hashtag_count": 5
}
```

**Response:** `text/event-stream`
```
data: {"text": "Three years ago,"}
data: {"text": " I walked out of"}
...
data: {"event": "done"}
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `ANTHROPIC_API_KEY not set` | Check your `backend/.env` file |
| CORS error in browser | Make sure backend is running on port 8000 |
| `npm install` fails | Use Node.js 18+ (`node --version`) |
| Stream not working | Disable browser extensions that block SSE |
