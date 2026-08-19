import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logoImage from "figma:asset/c203af8148e96bab0b430f3321aa301dbae6cef3.png";

const NAV_LINKS = [
  { label: "About",                  href: "/about" },
  { label: "Professional Experience", href: "/music-education" },
  { label: "Vocal Mastery",          href: "/vocalmastery" },
  { label: "Learn 2 Sing",           href: "/learn2sing" },
  { label: "Music Room 33",          href: "/music-room-33" },
  { label: "Come with Me",           href: "/comewithme" },
];

type Theme = "light" | "dark";

/*
  SiteHeader — the single, consistent header used across every page on the
  site. Deliberately minimal: a small logo (links home) and a hamburger
  menu, both floating with no background bar, revealing every other page.
  Replaces the old set of per-page bespoke navbars (AboutNavbar,
  Music33Navbar, L2CNavbar, L2SingNavbar, Navbar).

  `theme` picks icon/logo coloring so the header reads correctly against
  each page's own palette: "light" (default) for light-background pages —
  dark logo/icon; "dark" for dark-background pages (e.g. the oxblood
  Frequency/Vocal Mastery pages) — logo inverted to white, light icon.
*/
export function SiteHeader({ theme = "light" }: { theme?: Theme }) {
  const [isOpen, setIsOpen] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <a href="/" aria-label="Omega Bone home" className="shrink-0 pointer-events-auto">
            <img
              src={logoImage}
              alt="Omega Bone"
              className="h-7 sm:h-9 w-auto object-contain"
              style={isDark ? { filter: "invert(1) brightness(2)" } : undefined}
            />
          </a>

          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-colors ${
              isDark
                ? "bg-white/10 text-white hover:bg-white/20"
                : "bg-black/5 text-gray-800 hover:bg-black/10"
            }`}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[95] bg-black/30"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed top-14 sm:top-16 right-0 z-[100] w-full sm:w-80 bg-white shadow-xl sm:rounded-bl-lg overflow-hidden">
            <nav aria-label="Site navigation">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-6 py-4 text-sm text-gray-800 hover:bg-gray-50 hover:text-[#1a56db] transition-colors border-b border-gray-100 last:border-0"
                  style={{ fontWeight: 600 }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
