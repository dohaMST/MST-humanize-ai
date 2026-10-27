"""Pydantic V2 request/response models for the Humanize AI API."""

from typing import Literal

from pydantic import BaseModel, ConfigDict, field_validator

# Supported writing styles. Must stay in sync with the frontend Tone type.
Tone = Literal["natural", "professional", "casual", "academic"]

# Maximum accepted input length in characters.
MAX_INPUT_LENGTH = 10_000


class HumanizeRequest(BaseModel):
	"""Payload for POST /api/humanize/."""

	model_config = ConfigDict(str_strip_whitespace=True)

	text: str
	style: Tone = "natural"

	@field_validator("text")
	@classmethod
	def text_must_not_be_empty(cls, value: str) -> str:
		"""Reject empty or whitespace-only input after stripping."""
		if not value:
			raise ValueError("Text must not be empty.")
		if len(value) > MAX_INPUT_LENGTH:
			raise ValueError(
				f"Text must be at most {MAX_INPUT_LENGTH:,} characters "
				f"(received {len(value):,})."
			)
		return value


class HumanizeResponse(BaseModel):
	"""Successful response body."""

	model_config = ConfigDict(json_schema_extra={"example": {"result": "Rewritten text."}})

	result: str
