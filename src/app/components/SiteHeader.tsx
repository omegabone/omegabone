import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logoImage from "figma:asset/c203af8148e96bab0b430f3321aa301dbae6cef3.png";

const NAV_LINKS = [
  { label: "About",                  href: "/about" },
  { label: "Professional Experience", href: "/Professional_Experience" },
  { label: "Vocal Mastery",          href: "/Vocal_Mastery" },
  { label: "Learn 2 Sing",           href: "/Learn_2_Sing" },
  { label: "Music Room 33",          href: "/Music_Room_33" },
  { label: "Come with Me",           href: "/Come_with_Me" },
];

type Theme = "light" | "dark" | "vintage" | "cwm";

/*
  SiteHeader — the single, consistent header used across every page on the
  site. Deliberately minimal: a small logo (links home) and a hamburger
  menu, both floating with no background bar, revealing every other page.
  Replaces the old set of per-page bespoke navbars (AboutNavbar,
  Music33Navbar, L2CNavbar, L2SingNavbar, Navbar).

  `theme` picks icon/logo coloring so the header reads correctly against
  each page's own palette: "light" (default) for light-background pages —
  dark logo/icon; "dark" for dark-background pages (e.g. the warmup
  portals) — white logo/icon on a subtle glass button; "vintage" for the
  Frequency page's Vintage Charm brand (oxblood/gold) — bright red button,
  gold icon, matching its own bold plate/button styling; "cwm" for Come
  with Me's brand (black/red/cream) — same red-on-cream pill used by its
  own CTA buttons, same size/spacing as the standard "dark"/"light" button.

  `hideLogo` drops the floating logo for the rare page that already shows
  its own wordmark in a top bar (e.g. Professional Experience's in-page
  section nav) — showing two logos would be redundant.

  `topOffsetPx` shifts the whole floating header down, for the same kind
  of page: it has its own sticky top bar for in-page section links, so our
  hamburger is pushed below it instead of overlapping those links.
*/
export function SiteHeader({
  theme = "light",
  hideLogo = false,
  topOffsetPx = 0,
}: {
  theme?: Theme;
  hideLogo?: boolean;
  topOffsetPx?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isDark = theme === "dark";
  const isVintage = theme === "vintage";
  const isCwm = theme === "cwm";

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
      <div
        className="fixed left-0 right-0 z-[100] pointer-events-none"
        style={{ top: topOffsetPx }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-end">
          {!hideLogo && (
            <a href="/" aria-label="Omega Bone home" className="shrink-0 pointer-events-auto mr-auto">
              <img
                src={logoImage}
                alt="Omega Bone"
                className="h-7 sm:h-9 w-auto object-contain"
                style={isDark || isCwm ? { filter: "invert(1) brightness(2)" } : undefined}
              />
            </a>
          )}

          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            className={`pointer-events-auto rounded-full backdrop-blur-md transition-colors ${
              isVintage
                ? "p-3 bg-[#C42A40] text-[#D5BF86] border border-[#D5BF86] hover:bg-[#A71D31]"
                : isCwm
                ? "p-2 bg-[#ef4444] text-[#f0ead8] hover:bg-[#dc2626]"
                : isDark
                ? "p-2 bg-white/10 text-white hover:bg-white/20"
                : "p-2 bg-black/5 text-gray-800 hover:bg-black/10"
            }`}
          >
            {isOpen ? <X size={isVintage ? 24 : 20} /> : <Menu size={isVintage ? 24 : 20} />}
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
          <div
            className={`fixed right-0 z-[100] w-full sm:w-80 shadow-xl sm:rounded-bl-lg overflow-hidden ${
              isCwm ? "bg-[#ef4444]" : "bg-white"
            }`}
            style={{ top: topOffsetPx + 56 }}
          >
            <nav aria-label="Site navigation">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={
                    isCwm
                      ? "block px-6 py-4 text-sm text-[#D5BF86] hover:bg-black/10 transition-colors border-b border-black/15 last:border-0"
                      : "block px-6 py-4 text-sm text-gray-800 hover:bg-gray-50 hover:text-[#1a56db] transition-colors border-b border-gray-100 last:border-0"
                  }
                  style={isCwm ? { fontWeight: 600, fontFamily: "'Cinzel', serif", letterSpacing: "0.04em" } : { fontWeight: 600 }}
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
