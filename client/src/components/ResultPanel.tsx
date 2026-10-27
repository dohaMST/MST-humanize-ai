import { Check, CircleAlert, Copy, TextQuote } from "lucide-react";

type PanelStatus = "idle" | "loading" | "success" | "error";

interface ResultPanelProps {
	status: PanelStatus;
	result: string;
	error: string | null;
	copied: boolean;
	onCopy: () => void;
}

function ResultPanel({ status, result, error, copied, onCopy }: ResultPanelProps) {
	return (
		<div className="flex h-full min-h-80 flex-col rounded-card border border-line bg-surface shadow-card">
			<div className="flex items-center justify-between border-b border-line px-5 py-4">
				<h2 className="text-sm font-semibold text-ink">Humanized result</h2>
				{status === "success" && (
					<button
						type="button"
						onClick={onCopy}
						className="inline-flex h-9 items-center gap-1.5 rounded-card border border-line bg-surface px-3 text-xs font-medium text-ink-soft transition-colors duration-fast hover:border-line-strong hover:text-ink active:scale-[0.98]"
					>
						{copied ? (
							<>
								<Check aria-hidden="true" size={13} className="text-success" />
								Copied
							</>
						) : (
							<>
								<Copy aria-hidden="true" size={13} />
								Copy text
							</>
						)}
					</button>
				)}
			</div>

			{/* Pre-existing polite live region — only its text changes */}
			<p aria-live="polite" className="sr-only">
				{status === "loading" && "Humanizing your text, please wait."}
				{status === "success" && "Your humanized text is ready."}
				{status === "error" && (error ?? "Something went wrong.")}
			</p>

			<div className="flex-1 p-5">
				{status === "idle" && (
					<div className="flex h-full flex-col items-center justify-center py-10 text-center">
						<TextQuote
							aria-hidden="true"
							size={28}
							className="text-line-strong"
						/>
						<p className="mt-3 max-w-60 text-sm leading-relaxed text-ink-mute">
							Your rewritten text will appear here. Paste something on the
							left and pick a tone to get started.
						</p>
					</div>
				)}

				{status === "loading" && (
					<div role="status" className="space-y-3">
						<div className="skeleton h-4 w-11/12" />
						<div className="skeleton h-4 w-full" />
						<div className="skeleton h-4 w-10/12" />
						<div className="skeleton h-4 w-9/12" />
					</div>
				)}

				{status === "error" && (
					<div role="alert" className="flex items-start gap-3 rounded-card border border-danger/20 bg-danger-soft p-4">
						<CircleAlert
							aria-hidden="true"
							size={18}
							className="mt-0.5 shrink-0 text-danger"
						/>
						<p className="text-sm leading-relaxed text-danger">{error}</p>
					</div>
				)}

				{status === "success" && (
					<p className="whitespace-pre-wrap text-base leading-relaxed text-ink">
						{result}
					</p>
				)}
			</div>
		</div>
	);
}

export default ResultPanel;
