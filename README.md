# Humanize AI

A single-page tool that rewrites stiff, robotic or obviously machine-written text
into natural, clear prose in the tone you pick. Paste text, choose a tone, get a
rewrite back in a couple of seconds.

It is a thin, stateless app: a React front end, a FastAPI backend, and a real
LLM behind an OpenAI-compatible endpoint. No database, no accounts, no history.

```
humanize-text--ver2/
  client/      React 19 + Vite + TypeScript + Tailwind CSS v4
  backend/     FastAPI + Pydantic v2 + OpenAI SDK
```

---

## What this project serves

**The problem.** Text that came out of a template, a translation tool or a
first-pass AI draft reads flat: uniform sentence length, no contractions, filler
transitions, everything in the same register. Rewriting it by hand is slow, and
"just ask a chatbot" gives you no control over tone and no guardrails on meaning.

**What it does about it.** It runs a fixed, opinionated rewriting prompt against
the model of your choice and gives you four tone presets to steer the register:

| Tone           | Register it targets                                                  |
| -------------- | -------------------------------------------------------------------- |
| `natural`      | Everyday voice: contractions where idiomatic, varied sentence length |
| `professional` | Polished workplace register: clear, confident, concise               |
| `casual`       | Relaxed and conversational, still coherent                           |
| `academic`     | Formal and measured, with hedging preserved from the source          |

**Who it is for.** Writers cleaning up a draft, students and non-native speakers
smoothing their prose, and anyone who needs an email or report to stop sounding
like a machine wrote it.

**What it deliberately is not.**

- No storage. Submitted text is never persisted, logged or cached - there is no
  database and no server-side session.
- No accounts, no billing, no usage history.
- No "make it longer" / "add sources" behaviour. The prompt forbids inventing
  facts, statistics or citations, and preserves names, numbers and quoted
  material verbatim.

---

## How a request flows

1. You paste text (max 10,000 characters) and pick a tone.
2. The client `POST`s `{ text, style }` to the backend with a 65-second abort
   timeout; any in-flight request is cancelled on unmount.
3. The backend validates the payload with Pydantic, then builds a system prompt
   from a base rule set plus the tone instruction and calls the configured model
   at `temperature=0.7`.
4. The rewritten text comes back as `{ result }` and renders in the right-hand
   panel with a copy button.

Submitted text is treated as **content, never instructions** - the system prompt
explicitly refuses to follow directives embedded in it, which blunts the obvious
prompt-injection attempt.

---

## Tools used

### Front end (`client/`)

| Tool                                           | Version | Role here                                                                                                                                                 |
| ---------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [React](https://react.dev)                     | 19.2    | UI. Function components and hooks only - no class components, no state library.                                                                           |
| [TypeScript](https://www.typescriptlang.org)   | 6.0     | Typed components and API contract. `tsc -b` gates the build (`noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`).                             |
| [Vite](https://vite.dev)                       | 8.3     | Dev server with HMR and the production build. `npm run build` = `tsc -b && vite build`.                                                                   |
| [Tailwind CSS](https://tailwindcss.com)        | 4.3     | Styling via `@tailwindcss/vite`. CSS-first config: **there is no `tailwind.config.js`** - the design tokens live in an `@theme` block in `src/index.css`. |
| [@fontsource-variable](https://fontsource.org) | 5.3     | Self-hosted variable fonts (Geist for display, Inter for body). No external font CDN, no layout shift.                                                    |
| [lucide-react](https://lucide.dev)             | 1.55    | Icons, always marked `aria-hidden`.                                                                                                                       |
| [oxlint](https://oxc.rs)                       | 1.81    | Linter (`npm run lint`), configured with the React and TypeScript plugins.                                                                                |

No router (single page, anchor links only), no state manager, no component
library - roughly eight components in `src/components/`.

### Back end (`backend/`)

| Tool                                                         | Version | Role here                                                                                                                          |
| ------------------------------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [FastAPI](https://fastapi.tiangolo.com)                      | 0.115+  | Async API with automatic OpenAPI docs at `/docs`.                                                                                  |
| [Uvicorn](https://www.uvicorn.org)                           | 0.30+   | ASGI server. Plain `uvicorn`, **not** `uvicorn[standard]` - the extras pull in build-time dependencies this project does not need. |
| [Pydantic](https://docs.pydantic.dev)                        | 2.9+    | Request/response models, a `Literal` tone enum, and the 10,000-character limit enforced at the edge.                               |
| [OpenAI Python SDK](https://github.com/openai/openai-python) | 1.60+   | `AsyncOpenAI` client pointed at any OpenAI-compatible base URL. Provider switching is configuration only.                          |
| [python-dotenv](https://github.com/theskumar/python-dotenv)  | 1.0+    | Loads `backend/.env` at startup.                                                                                                   |

### Runtime

- Node.js 20+ (built and verified on Node 26.5)
- Python 3.11+ (built and verified on Python 3.15)

---

## Quick start

### 1. Backend

```bash
cd backend
python -m venv .venv

# macOS / Linux
source .venv/bin/activate
# Windows PowerShell
.venv\Scripts\Activate.ps1

pip install -r requirements.txt
cp .env.example .env      # then edit it, or set MOCK_MODE=true
uvicorn main:app --reload --port 8000
```

Check it: <http://127.0.0.1:8000/health> should report `llm_configured` and
`mode`. Interactive API docs: <http://127.0.0.1:8000/docs>.

### 2. Front end

```bash
cd client
npm install
cp .env.example .env      # VITE_API_URL=http://127.0.0.1:8000
npm run dev
```

Open <http://localhost:5173>. If that port is taken, Vite picks the next one -
add the new origin to `FRONTEND_ORIGIN` in `backend/.env` and restart the
backend, otherwise the browser will block the request as a CORS failure.

---
