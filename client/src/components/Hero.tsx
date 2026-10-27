import { ArrowDown } from "lucide-react";

function Hero() {
	return (
		<section id="top" className="px-4 pt-16 pb-12 sm:px-6 md:pt-24">
			<div className="mx-auto max-w-6xl">
				<p
					className="rise-in text-xs font-medium uppercase tracking-[0.18em] text-ink-mute"
					style={{ animationDelay: "0ms" }}
				>
					Your writing, refined
				</p>
				<h1
					className="rise-in mt-4 max-w-3xl font-display text-5xl font-semibold tracking-tight text-balance sm:text-6xl"
					style={{ animationDelay: "60ms" }}
				>
					Make every word sound like <span className="text-violet">you</span>.
				</h1>
				<p
					className="rise-in mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg"
					style={{ animationDelay: "120ms" }}
				>
					Rewrite text into natural, clear writing that fits your voice. Improve
					flow, readability, and tone in seconds.
				</p>
				<div
					className="rise-in mt-8"
					style={{ animationDelay: "180ms" }}
				>
					<a
						href="#workspace"
						className="inline-flex h-12 items-center justify-center gap-2 rounded-card bg-violet px-6 text-sm font-semibold text-white transition-colors duration-fast hover:bg-violet-strong active:scale-[0.98]"
					>
						Start writing
						<ArrowDown aria-hidden="true" size={16} />
					</a>
				</div>
			</div>
		</section>
	);
}

export default Hero;
