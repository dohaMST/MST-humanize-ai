import { LoaderCircle, Sparkles } from "lucide-react";

interface HumanizeButtonProps {
	loading: boolean;
	disabled: boolean;
	onClick: () => void;
}

function HumanizeButton({ loading, disabled, onClick }: HumanizeButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-busy={loading}
			className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-card bg-violet px-6 text-sm font-semibold text-white transition-colors duration-fast hover:bg-violet-strong active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
		>
			{loading ? (
				<>
					<LoaderCircle
						aria-hidden="true"
						size={16}
						className="animate-spin"
					/>
					Humanizing…
				</>
			) : (
				<>
					<Sparkles aria-hidden="true" size={16} />
					Humanize text
				</>
			)}
		</button>
	);
}

export default HumanizeButton;
