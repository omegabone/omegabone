import { useEffect, useRef, useState } from "react";
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

/*
  SiteHeader — the single, consistent header used across every page on the
  site. Deliberately minimal: logo (links home) + a hamburger menu in the
  top right that reveals every other page. Replaces the old set of
  per-page bespoke navbars (AboutNavbar, Music33Navbar, L2CNavbar,
  L2SingNavbar, Navbar) so the chrome no longer changes shape page to page.
*/
export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <a href="/" className="shrink-0" aria-label="Omega Bone home">
            <img
              src={logoImage}
              alt="Omega Bone"
              className="h-8 sm:h-10 w-auto object-contain"
            />
          </a>

          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            className="p-2 -mr-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[95] bg-black/30"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={menuRef}
            className="fixed top-14 sm:top-16 right-0 z-[100] w-full sm:w-80 bg-white shadow-xl sm:rounded-bl-lg overflow-hidden"
          >
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
