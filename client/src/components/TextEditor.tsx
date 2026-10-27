import { useId } from "react";
import { X } from "lucide-react";
import { MAX_INPUT_LENGTH } from "../services/api";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  disabled: boolean;
}

function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function TextEditor({ value, onChange, onClear, disabled }: TextEditorProps) {
  const id = useId();
  const words = countWords(value);
  const chars = value.length;
  const nearLimit = chars >= MAX_INPUT_LENGTH * 0.9;

  return (
    <div className="flex min-h-0 flex-col">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          Your text
        </label>
        {value.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            disabled={disabled}
            className="inline-flex items-center gap-1 rounded-card px-2 py-1 text-xs font-medium text-ink-mute transition-colors duration-fast hover:bg-sunken hover:text-ink disabled:opacity-50"
          >
            <X aria-hidden="true" size={13} />
            Clear text
          </button>
        )}
      </div>

      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={MAX_INPUT_LENGTH}
        disabled={disabled}
        spellCheck={false}
        placeholder="Paste the text you want to refine - an email, an essay, a report, anything that sounds a little too robotic."
        className="mt-3 h-72 w-full resize-none rounded-card border border-line bg-surface p-4 font-sans text-base leading-relaxed text-ink placeholder:text-ink-mute/80 transition-colors duration-fast hover:border-line-strong focus:border-violet focus:outline-none disabled:opacity-60 sm:h-80"
      />

      <div className="mt-2.5 flex items-center justify-between text-xs">
        <span className="text-ink-mute" aria-hidden="true">
          {formatNumber(words)} {words === 1 ? "word" : "words"} ·{" "}
          {formatNumber(chars)} characters
        </span>
        <span
          className={nearLimit ? "font-medium text-danger" : "text-ink-mute"}
        >
          {formatNumber(chars)} / {formatNumber(MAX_INPUT_LENGTH)} max
        </span>
      </div>
    </div>
  );
}

export default TextEditor;
