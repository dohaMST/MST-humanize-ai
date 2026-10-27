import { TONES, TONE_LABELS } from "../types";
import type { Tone } from "../types";

interface ToneSelectorProps {
	value: Tone;
	onChange: (tone: Tone) => void;
	disabled: boolean;
}

function ToneSelector({ value, onChange, disabled }: ToneSelectorProps) {
	return (
		<fieldset disabled={disabled} className="mt-6">
			<legend className="text-sm font-semibold text-ink">Tone</legend>
			<div className="mt-3 flex flex-wrap gap-2">
				{TONES.map((tone) => {
					const selected = value === tone;
					return (
						<label
							key={tone}
							className={`inline-flex h-10 cursor-pointer items-center rounded-card border px-4 text-sm font-medium transition-colors duration-fast has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-violet ${
								selected
									? "border-violet bg-violet-soft text-violet"
									: "border-line bg-surface text-ink-soft hover:border-line-strong hover:text-ink"
							} ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
						>
							<input
								type="radio"
								name="tone"
								value={tone}
								checked={selected}
								onChange={() => onChange(tone)}
								className="sr-only"
							/>
							{TONE_LABELS[tone]}
						</label>
					);
				})}
			</div>
		</fieldset>
	);
}

export default ToneSelector;
