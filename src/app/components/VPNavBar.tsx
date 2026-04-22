import image_c203af8148e96bab0b430f3321aa301dbae6cef3 from 'figma:asset/c203af8148e96bab0b430f3321aa301dbae6cef3.png'
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Blog", href: "/learn2sing/blog" },
  { label: "About", href: "/about" },
  { label: "Album Release", href: "/come-with-me" },
  { label: "Contact", href: "/contact" },
];

export function VPNavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => { setScrolled(window.scrollY > 20); ticking = false; });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Scarcity Banner */}
      {bannerVisible && (
        <div className="bg-[#554274] text-white text-center py-2 px-4 flex items-center justify-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-purple-200 animate-pulse shrink-0" />
          <p className="text-xs sm:text-sm" style={{ fontWeight: 500 }}>
            <span style={{ fontWeight: 700 }}>Only 2 spots left</span> for 1-on-1 coaching this month &mdash;{" "}
            <a
              href="https://calendar.app.google/Y83p7Rf5idJkdzKc6"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-purple-200 transition-colors"
              style={{ fontWeight: 700 }}
            >
              Book a free lesson
            </a>
          </p>
          <button
            onClick={() => setBannerVisible(false)}
            className="absolute right-4 text-purple-200 hover:text-white transition-colors text-lg leading-none"
            aria-label="Dismiss"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Nav Bar */}
      <header
        className={`transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-24 flex items-center justify-between">

          {/* Logo */}
          <a href="/about" className="shrink-0">
            <img src={image_c203af8148e96bab0b430f3321aa301dbae6cef3} alt="Omega Bone" className="h-20 w-auto object-contain" />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm transition-colors ${
                  link.label === "Album Release"
                    ? "text-[#554274] hover:text-[#432f5c]"
                    : "text-gray-700 hover:text-[#554274]"
                }`}
                style={{ fontWeight: 600 }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <a
            href="https://calendar.app.google/Y83p7Rf5idJkdzKc6"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 bg-[#554274] hover:bg-[#432f5c] text-white px-5 py-2.5 rounded-full text-sm transition-colors"
            style={{ fontWeight: 700 }}
          >
            Book a free lesson
          </a>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-[#554274] transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-5 space-y-4 shadow-lg">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block text-sm transition-colors ${
                  link.label === "Album Release"
                    ? "text-[#554274]"
                    : "text-gray-700 hover:text-[#554274]"
                }`}
                style={{ fontWeight: 600 }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://calendar.app.google/Y83p7Rf5idJkdzKc6"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-[#554274] hover:bg-[#432f5c] text-white text-center px-5 py-3 rounded-full text-sm transition-colors"
              style={{ fontWeight: 700 }}
            >
              Book a free lesson
            </a>
          </div>
        )}
      </header>
    </div>
  );
}
