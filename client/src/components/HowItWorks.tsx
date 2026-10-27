const STEPS = [
	{
		number: "1",
		title: "Paste your text",
		description: "Start with text you want to improve.",
	},
	{
		number: "2",
		title: "Choose your tone",
		description: "Select the writing style that fits your purpose.",
	},
	{
		number: "3",
		title: "Get your rewrite",
		description: "Receive a clearer, more natural version.",
	},
] as const;

function HowItWorks() {
	return (
		<section id="how-it-works" className="px-4 py-20 sm:px-6 md:py-24">
			<div className="mx-auto max-w-6xl">
				<h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance">
					How it works
				</h2>
				<p className="mt-3 max-w-xl text-base leading-relaxed text-ink-soft">
					Three steps between stiff draft and natural writing.
				</p>

				<ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
					{STEPS.map((step) => (
						<li key={step.number}>
							<span
								aria-hidden="true"
								className="flex size-9 items-center justify-center rounded-card bg-violet-soft font-display text-sm font-semibold text-violet"
							>
								{step.number}
							</span>
							<h3 className="mt-4 text-base font-semibold text-ink">
								{step.title}
							</h3>
							<p className="mt-1.5 max-w-64 text-sm leading-relaxed text-ink-soft">
								{step.description}
							</p>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}

export default HowItWorks;
