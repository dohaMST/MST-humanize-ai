/** Writing styles accepted by the backend. Mirrors the Pydantic model. */
export type Tone = "natural" | "professional" | "casual" | "academic";

export const TONES: readonly Tone[] = [
	"natural",
	"professional",
	"casual",
	"academic",
] as const;

/** Human-readable labels for each tone. */
export const TONE_LABELS: Record<Tone, string> = {
	natural: "Natural",
	professional: "Professional",
	casual: "Casual",
	academic: "Academic",
};

/** Request body for POST /api/humanize/. */
export interface HumanizeRequest {
	text: string;
	style: Tone;
}

/** Response body for POST /api/humanize/. */
export interface HumanizeResponse {
	result: string;
}

/** Structured error the UI can render. */
export class ApiError extends Error {
	readonly status: number | null;

	readonly code: string;

	constructor(message: string, status: number | null = null, code = "unknown") {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.code = code;
	}
}
