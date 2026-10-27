import { ApiError } from "../types";
import type { HumanizeRequest, HumanizeResponse } from "../types";

/** Base URL of the FastAPI backend. Set in client/.env as VITE_API_URL. */
const API_BASE_URL: string =
(import.meta.env.VITE_API_URL as string | undefined) ??
	"http://127.0.0.1:8000";

/** Hard client-side timeout so a hung backend never spins forever. */
const REQUEST_TIMEOUT_MS = 65_000;

/** Max input length the backend accepts. Kept in sync with schemas.py. */
export const MAX_INPUT_LENGTH = 10_000;

/**
 * Translate a FastAPI error payload into a readable message.
 * Handles {"detail": "..."} and Pydantic's {"detail": [{msg, loc}, ...]}.
 */
function extractErrorMessage(payload: unknown): string | null {
	if (typeof payload !== "object" || payload === null) return null;
	const detail = (payload as { detail?: unknown }).detail;
	if (typeof detail === "string" && detail.trim() !== "") return detail;
	if (Array.isArray(detail)) {
		const messages = detail
			.map((item) =>
				typeof item === "object" && item !== null && "msg" in item
					? String((item as { msg: unknown }).msg)
					: null,
			)
			.filter((msg): msg is string => msg !== null);
		if (messages.length > 0) return messages.join(" ");
	}
	return null;
}

/**
 * Send text to the backend and return the rewritten result.
 *
 * Throws {@link ApiError} with a user-readable message on network failure,
 * non-success status codes, timeouts, or malformed payloads.
 */
export async function humanizeText(
request: HumanizeRequest,
signal?: AbortSignal,
): Promise<string> {
	const controller = new AbortController();
	const timeoutId = window.setTimeout(
		() => controller.abort(),
		REQUEST_TIMEOUT_MS,
	);
	if (signal) {
		if (signal.aborted) controller.abort();
		else signal.addEventListener("abort", () => controller.abort());
	}

	let response: Response;
	try {
		response = await fetch(`${API_BASE_URL}/api/humanize/`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(request),
			signal: controller.signal,
		});
	} catch (error) {
		window.clearTimeout(timeoutId);
		if (controller.signal.aborted) {
			throw new ApiError(
				"The request timed out. The server may be busy — try again in a moment.",
				null,
				"timeout",
			);
		}
		throw new ApiError(
			"Could not reach the server. Check that the backend is running, then try again.",
			null,
			"network",
		);
	} finally {
		window.clearTimeout(timeoutId);
	}

	let payload: unknown = null;
	try {
		payload = await response.json();
	} catch {
		throw new ApiError(
			"The server returned an unexpected response. Try again in a moment.",
			response.status,
			"malformed",
		);
	}

	if (!response.ok) {
		throw new ApiError(
			extractErrorMessage(payload) ??
				`The server could not process this request (error ${response.status}).`,
			response.status,
			"http",
		);
	}

	const result = (payload as Partial<HumanizeResponse> | null)?.result;
	if (typeof result !== "string" || result.trim() === "") {
		throw new ApiError(
			"The server returned an empty result. Try again in a moment.",
			response.status,
			"malformed",
		);
	}

	return result;
}

