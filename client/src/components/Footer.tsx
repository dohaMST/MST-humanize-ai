function Footer() {
  return (
    <footer id="about" className="border-t border-line px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-base font-semibold tracking-tight">
            Humanize <span className="text-violet">AI</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            A focused tool for rewriting text into natural, clear writing that
            fits your voice. Built for writers, students, and anyone who wants
            their drafts to sound human.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="space-y-2.5 text-sm">
            <li>
              <a
                href="#workspace"
                className="font-medium text-ink-soft transition-colors duration-fast hover:text-ink"
              >
                Try it free
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className="font-medium text-ink-soft transition-colors duration-fast hover:text-ink"
              >
                How it works
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-line pt-6">
        <p className="text-xs text-ink-mute">
          © {new Date().getFullYear()} Humanize AI by MST Builds. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
