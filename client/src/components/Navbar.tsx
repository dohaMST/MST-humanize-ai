import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "../assets/mst-logo-mark.png";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "About", href: "#about" },
] as const;

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-sm">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6"
      >
        {/* Logo: mark + wordmark */}
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-12 w-20 items-center justify-center overflow-hidden rounded-card bg-violet shadow-card">
            <img
              src={logo}
              alt=""
              aria-hidden="true"
              className="h-9 w-full object-contain"
            />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            Humanize <span className="text-violet">AI</span>
          </span>
        </a>

        {/* Desktop menu */}
        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors duration-fast hover:text-ink"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#workspace"
            className="inline-flex h-9 items-center justify-center rounded-card bg-violet px-4 text-sm font-semibold text-white transition-colors duration-fast hover:bg-violet-strong active:scale-[0.98]"
          >
            Try it free
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-card text-ink-soft transition-colors duration-fast hover:bg-sunken hover:text-ink md:hidden "
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? (
            <X aria-hidden="true" size={20} />
          ) : (
            <Menu aria-hidden="true" size={20} />
          )}
          <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
        </button>
      </nav>

      {/* Mobile dropdown */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="border-t border-line bg-canvas px-4 pb-4 pt-2 md:hidden animate-menu-slide"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block rounded-card px-3 py-3 text-sm font-medium text-ink-soft transition-colors duration-fast hover:bg-sunken hover:text-ink"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#workspace"
            onClick={() => setIsOpen(false)}
            className="mt-2 flex h-11 items-center justify-center rounded-card bg-violet px-4 text-sm font-semibold text-white transition-colors duration-fast hover:bg-violet-strong"
          >
            Try it free
          </a>
        </div>
      )}
    </header>
  );
}

export default Navbar;
