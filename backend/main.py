"""Humanize AI — FastAPI backend.

Endpoints:
    GET  /                - basic health message
    GET  /health          - structured health status
    POST /api/humanize/   - rewrite text in a chosen tone
"""

import logging
import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import HumanizeRequest, HumanizeResponse
from services import rewriter

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("humanize.api")

app = FastAPI(
	title="Humanize AI API",
	description="Rewrite text into natural, clear writing.",
	version="1.0.0",
)

# CORS — only the configured frontend origin(s). Never "*" in any environment.
# Set FRONTEND_ORIGIN in backend/.env (comma-separated for multiple origins).
_raw_origins = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
	CORSMiddleware,
	allow_origins=allowed_origins,
	allow_credentials=False,
	allow_methods=["GET", "POST"],
	allow_headers=["Content-Type"],
)


@app.get("/")
async def root() -> dict[str, str]:
	"""Basic health message."""
	return {"message": "Humanize AI API is running."}


@app.get("/health")
async def health() -> dict[str, str]:
	"""Structured health status. Never exposes secrets."""
	configured = bool(os.getenv("GEMINI_API_KEY", "").strip())
	mock = os.getenv("MOCK_MODE", "false").lower() in ("true", "1", "yes")
	return {
		"status": "ok",
		"llm_configured": "yes" if configured else "no",
		"mode": "mock" if mock else "live",
	}


@app.post("/api/humanize/", response_model=HumanizeResponse)
async def humanize(payload: HumanizeRequest) -> HumanizeResponse:
	"""Rewrite the submitted text in the requested tone."""
	try:
		result = await rewriter.rewrite(payload.text, payload.style)
	except rewriter.RewriterError as exc:
		# Config / upstream failures surface as 502/503/504 with a clear message.
		raise HTTPException(status_code=exc.status_code, detail=str(exc)) from exc

	return HumanizeResponse(result=result)
