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

| Tone           | Register it targets                                             |
| -------------- | --------------------------------------------------------------- |
| `natural`      | Everyday voice: contractions where idiomatic, varied sentence length |
| `professional` | Polished workplace register: clear, confident, concise           |
| `casual`       | Relaxed and conversational, still coherent                       |
| `academic`     | Formal and measured, with hedging preserved from the source      |

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

| Tool | Version | Role here |
| ---- | ------- | --------- |
| [React](https://react.dev) | 19.2 | UI. Function components and hooks only - no class components, no state library. |
| [TypeScript](https://www.typescriptlang.org) | 6.0 | Typed components and API contract. `tsc -b` gates the build (`noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`). |
| [Vite](https://vite.dev) | 8.3 | Dev server with HMR and the production build. `npm run build` = `tsc -b && vite build`. |
| [Tailwind CSS](https://tailwindcss.com) | 4.3 | Styling via `@tailwindcss/vite`. CSS-first config: **there is no `tailwind.config.js`** - the design tokens live in an `@theme` block in `src/index.css`. |
| [@fontsource-variable](https://fontsource.org) | 5.3 | Self-hosted variable fonts (Geist for display, Inter for body). No external font CDN, no layout shift. |
| [lucide-react](https://lucide.dev) | 1.55 | Icons, always marked `aria-hidden`. |
| [oxlint](https://oxc.rs) | 1.81 | Linter (`npm run lint`), configured with the React and TypeScript plugins. |

No router (single page, anchor links only), no state manager, no component
library - roughly eight components in `src/components/`.

### Back end (`backend/`)

| Tool | Version | Role here |
| ---- | ------- | --------- |
| [FastAPI](https://fastapi.tiangolo.com) | 0.115+ | Async API with automatic OpenAPI docs at `/docs`. |
| [Uvicorn](https://www.uvicorn.org) | 0.30+ | ASGI server. Plain `uvicorn`, **not** `uvicorn[standard]` - the extras pull in build-time dependencies this project does not need. |
| [Pydantic](https://docs.pydantic.dev) | 2.9+ | Request/response models, a `Literal` tone enum, and the 10,000-character limit enforced at the edge. |
| [OpenAI Python SDK](https://github.com/openai/openai-python) | 1.60+ | `AsyncOpenAI` client pointed at any OpenAI-compatible base URL. Provider switching is configuration only. |
| [python-dotenv](https://github.com/theskumar/python-dotenv) | 1.0+ | Loads `backend/.env` at startup. |

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

## LLM configuration

Everything provider-related lives in `backend/.env`. The backend speaks the
OpenAI-compatible protocol, so switching providers needs no code changes.

| Provider   | `LLM_BASE_URL`                                            | Example `LLM_MODEL`                |
| ---------- | --------------------------------------------------------- | ---------------------------------- |
| Gemini     | `https://generativelanguage.googleapis.com/v1beta/openai`  | `gemini-3.5-flash-lite`            |
| Groq       | `https://api.groq.com/openai/v1`                           | `llama-3.3-70b-versatile`          |
| OpenAI     | *(leave empty)*                                            | `gpt-4o-mini`                      |
| OpenRouter | `https://openrouter.ai/api/v1`                             | `meta-llama/llama-3.3-70b-instruct` |
| Ollama     | `http://localhost:11434/v1`                                | `llama3.2`                         |

No trailing slash on the base URL - the SDK appends `/chat/completions` itself.
The key variable is named `GEMINI_API_KEY` for historical reasons; it is passed
to whichever provider you configure.

**Gemini free tier notes** (the default here, no credit card required):

- `-lite` is the default because the standard flash pool and the lite pool draw
  from **separate quotas**. In testing, the standard pool exhausted its daily
  request limit while lite kept answering, with little quality difference on
  `casual` and `academic` rewrites.
- Quota is **per project**, not per key - extra keys add no headroom. The daily
  cap resets at midnight Pacific, not on your local clock.
- Google retires models from the free tier without notice. An `HTTP 404` means
  the model is gone, not misconfigured: re-list `/v1beta/openai/models` and pin
  a current one.

### Mock mode (no key needed)

```ini
MOCK_MODE=true
```

Returns a clearly labelled placeholder instead of calling a model:

```
[MOCK OUTPUT - MOCK_MODE=true, no model was called]

(tone: natural) <your text>
```

It never masquerades as a real rewrite. With `MOCK_MODE` false and no key set,
the API returns **503** with an actionable message rather than faking a result.

### Environment variables

**`backend/.env`**

| Variable          | Required | Default                 | Purpose |
| ----------------- | -------- | ----------------------- | ------- |
| `GEMINI_API_KEY`  | Yes\*    | -                       | Provider API key |
| `LLM_MODEL`       | Yes\*    | -                       | Model name |
| `LLM_BASE_URL`    | No       | OpenAI                  | OpenAI-compatible base URL |
| `LLM_TIMEOUT`     | No       | `60`                    | Upstream timeout, seconds |
| `FRONTEND_ORIGIN` | No       | `http://localhost:5173` | Allowed CORS origins, comma-separated |
| `MOCK_MODE`       | No       | `false`                 | Return labelled mock output |

\* unless `MOCK_MODE=true`

**`client/.env`**

| Variable       | Default                 | Purpose |
| -------------- | ----------------------- | ------- |
| `VITE_API_URL` | `http://127.0.0.1:8000` | Backend base URL |

`.env` files are git-ignored; only `.env.example` is committed.

---

## API

| Method | Path             | Body                                  | Response |
| ------ | ---------------- | ------------------------------------- | -------- |
| GET    | `/`              | -                                     | `{"message": ...}` |
| GET    | `/health`        | -                                     | `{"status", "llm_configured", "mode"}` |
| POST   | `/api/humanize/` | `{"text": "...", "style": "natural"}` | `{"result": "..."}` |

| Status | Meaning |
| ------ | ------- |
| `422`  | Empty or whitespace-only text, more than 10,000 characters, or an unknown tone |
| `503`  | No API key or model configured (message explains the fix) |
| `502`  | Provider error, unreachable provider, rate limit, or an empty model response |
| `504`  | Model exceeded `LLM_TIMEOUT` |

CORS is a strict allowlist built from `FRONTEND_ORIGIN` - never `*`. Allowed
methods are `GET` and `POST` with only the `Content-Type` header.

---

## Design and accessibility notes

- **One token block.** `client/src/index.css` holds the entire design system: a
  single type ratio (1.25), one radius, two shadows, three durations. Components
  are expected to compose from those tokens rather than invent values.
- **Keyboard and screen readers.** Skip link first in the body, restyled
  `:focus-visible` rings (never removed), `aria-live` status announcements for
  loading/success/error, `role="alert"` on errors, labelled inputs.
- **Motion.** The hero sequence is the only orchestrated animation; everything
  else is a 150-220 ms transition, and `prefers-reduced-motion` disables both.
- **Failure states are honest.** Errors preserve your text and tone, and say
  what went wrong (timeout, unreachable server, rate limit, provider error).

---

## Troubleshooting

| Symptom | Cause and fix |
| ------- | ------------- |
| "Could not reach the server" | Backend not running, or its origin is not in `FRONTEND_ORIGIN`. Check `/health`, then restart the backend after editing `.env`. |
| `503` `GEMINI_API_KEY is not configured` | Copy `backend/.env.example` to `backend/.env` and add a key, or set `MOCK_MODE=true`. `python-dotenv` reads the file once at startup, so restart after editing. |
| `502` reporting `HTTP 404` | The model left the provider's free tier. Re-list `/v1beta/openai/models` and pin a current one. |
| `502` reporting `HTTP 503` | Free-tier congestion at the provider, not your setup. Retry in a few seconds. |
| `502` "rate-limited right now" | Daily requests-per-day cap hit. Resets at midnight Pacific. A faster model will not help; a second AI Studio *project* gets a second pool. |
| `504` or client timeout | Model slower than `LLM_TIMEOUT` (60 s) or the client's 65 s cap. Raise the timeout or pick a faster model. |
| CORS error in the console | The frontend origin is not allowlisted. Add it to `FRONTEND_ORIGIN` (comma-separated) and restart. |
| Vite took port 5174 instead of 5173 | Another dev server holds 5173. Add `http://localhost:5174` to `FRONTEND_ORIGIN` and restart. |
| `pip` fails building `pyyaml` | Comes from `uvicorn[standard]` extras. `requirements.txt` must say `uvicorn>=0.30`, not `uvicorn[standard]`. |

---

## Status

Checked end-to-end on the development machine:

- `npm run build` (TypeScript project build + Vite) clean; `npm run lint` clean.
- `python -m py_compile` clean on all backend modules.
- Backend matrix: `200` in mock mode; `422` for empty, whitespace-only, over
  10,000 characters, unknown tone and missing field; `503` with an actionable
  message when unconfigured.
- Live Gemini rewrites return tone-correct output for all four tones, verified
  through both `curl` and the browser UI.
- Browser walkthrough at 360 / 768 / 1440 px: no horizontal overflow, mobile menu
  works, error state preserves input, copy button confirms, console clean.

## Cost

A 10,000-character rewrite is roughly 2,500 input tokens plus the system prompt.
The free tiers on Gemini and Groq cover development comfortably; paid providers
stay in fractions of a cent per request because nothing is stored and input is
capped.
