import { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TextEditor from "./components/TextEditor";
import ToneSelector from "./components/ToneSelector";
import HumanizeButton from "./components/HumanizeButton";
import ResultPanel from "./components/ResultPanel";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import { humanizeText, MAX_INPUT_LENGTH } from "./services/api";
import { ApiError } from "./types";
import type { Tone } from "./types";

type PanelStatus = "idle" | "loading" | "success" | "error";

function App() {
	const [text, setText] = useState("");
	const [tone, setTone] = useState<Tone>("natural");
	const [status, setStatus] = useState<PanelStatus>("idle");
	const [result, setResult] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const copyResetTimer = useRef<number | null>(null);
	const abortRef = useRef<AbortController | null>(null);

	// Abort any in-flight request on unmount; clear copy feedback timer.
	useEffect(() => {
		return () => {
			abortRef.current?.abort();
			if (copyResetTimer.current !== null) {
				window.clearTimeout(copyResetTimer.current);
			}
		};
	}, []);

	const trimmed = text.trim();
	const isEmpty = trimmed.length === 0;
	const overLimit = text.length > MAX_INPUT_LENGTH;
	const busy = status === "loading";
	const canSubmit = !isEmpty && !overLimit && !busy;

	const handleSubmit = useCallback(async () => {
		if (isEmpty) {
			setStatus("error");
			setError("Paste or type some text before humanizing.");
			return;
		}
		if (overLimit) {
			setStatus("error");
			setError(
				`Your text is ${text.length.toLocaleString("en-US")} characters. The limit is ${MAX_INPUT_LENGTH.toLocaleString("en-US")} — trim it down and try again.`,
			);
			return;
		}
		if (busy) return; // no duplicate submissions

		setStatus("loading");
		setError(null);
		setCopied(false);

		const controller = new AbortController();
		abortRef.current = controller;

		try {
			const rewritten = await humanizeText(
				{ text: trimmed, style: tone },
				controller.signal,
			);
			setResult(rewritten);
			setStatus("success");
		} catch (err) {
			// Preserve input and tone; surface a readable message.
			if (err instanceof ApiError) {
				setError(err.message);
			} else {
				setError("Something went wrong. Please try again.");
			}
			setStatus("error");
		} finally {
			abortRef.current = null;
		}
	}, [trimmed, tone, isEmpty, overLimit, busy, text.length]);

	const handleCopy = useCallback(async () => {
		if (result === "") return;
		try {
			await navigator.clipboard.writeText(result);
			setCopied(true);
			if (copyResetTimer.current !== null) {
				window.clearTimeout(copyResetTimer.current);
			}
			copyResetTimer.current = window.setTimeout(() => {
				setCopied(false);
			}, 2000);
		} catch {
			setStatus("error");
			setError("Copying failed. Your browser blocked clipboard access.");
		}
	}, [result]);

	const handleClear = useCallback(() => {
		setText("");
		setResult("");
		setError(null);
		setCopied(false);
		if (status !== "loading") setStatus("idle");
	}, [status]);

	return (
		<div className="min-h-dvh bg-canvas">
			<a
				href="#workspace"
				className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-card focus:bg-violet focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
			>
				Skip to the editor
			</a>

			<Navbar />

			<main>
				<Hero />

				<section id="workspace" className="px-4 pb-20 sm:px-6">
					<div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
						{/* Input panel */}
						<div className="rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
							<TextEditor
								value={text}
								onChange={setText}
								onClear={handleClear}
								disabled={busy}
							/>
							<ToneSelector
								value={tone}
								onChange={setTone}
								disabled={busy}
							/>
							<HumanizeButton
								loading={busy}
								disabled={!canSubmit}
								onClick={handleSubmit}
							/>
						</div>

						{/* Output panel */}
						<ResultPanel
							status={status}
							result={result}
							error={error}
							copied={copied}
							onCopy={handleCopy}
						/>
					</div>
				</section>

				<HowItWorks />
			</main>

			<Footer />
		</div>
	);
}

export default App;
