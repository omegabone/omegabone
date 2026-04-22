import image_c203af8148e96bab0b430f3321aa301dbae6cef3 from 'figma:asset/c203af8148e96bab0b430f3321aa301dbae6cef3.png'
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const homeDropdown = [
  { label: "For Artists",        href: "/learn2sing" },
  { label: "For Entrepreneurs",  href: "/learn-to-communicate" },
  { label: "For Families",       href: "/music-room-33" },
];

export function AboutNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { label: "About",   href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const bannerTop = bannerVisible ? "top-[36px]" : "top-0";

  return (
    <>
      {/* Scarcity Banner */}
      {bannerVisible && (
        <div className="fixed top-0 left-0 right-0 z-[60] text-gray-700 text-center py-2 px-4 flex items-center justify-center gap-3 bg-gray-100">
          <span className="inline-block w-2 h-2 rounded-full bg-red-400 animate-pulse shrink-0" />
          <p className="text-xs sm:text-sm" style={{ fontWeight: 500 }}>
            <span style={{ fontWeight: 700 }}>Only 2 spots left</span> for 1-on-1 coaching this month -{" "}
            <a
              href="https://calendar.app.google/Y83p7Rf5idJkdzKc6"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-blue-700 transition-colors"
              style={{ fontWeight: 700 }}
            >
              Book a free lesson
            </a>
          </p>
          <button
            onClick={() => setBannerVisible(false)}
            className="absolute right-4 text-gray-400 hover:text-gray-700 transition-colors text-lg leading-none"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Nav Bar */}
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${bannerTop} ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-24 flex items-center justify-between">

          {/* Logo */}
          <a href="/about" className="shrink-0">
            <img
              src={image_c203af8148e96bab0b430f3321aa301dbae6cef3}
              alt="Omega Bone"
              className="h-20 w-auto object-contain"
            />
          </a>

          {/* Desktop: links + CTA */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              {/* About */}
              <a
                href="/about"
                className="text-sm text-gray-700 hover:text-[#1a56db] transition-colors"
                style={{ fontWeight: 600 }}
              >
                About
              </a>

              {/* Home dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-1 text-sm text-gray-700 hover:text-[#1a56db] transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  Home
                  <ChevronDown
                    size={14}
                    className="transition-transform duration-200"
                    style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>
                {dropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-lg py-2 z-50">
                    {homeDropdown.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-5 py-2.5 text-sm text-gray-700 hover:text-[#1a56db] hover:bg-[#f0f5ff] transition-colors"
                        style={{ fontWeight: 600 }}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact */}
              <a
                href="/contact"
                className="text-sm text-gray-700 hover:text-[#1a56db] transition-colors"
                style={{ fontWeight: 600 }}
              >
                Contact
              </a>
            </nav>

            {/* Desktop CTA */}
            <a
              href="https://calendar.app.google/Y83p7Rf5idJkdzKc6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1a56db] hover:bg-[#1649c0] text-white px-5 py-2.5 rounded-full text-sm transition-colors"
              style={{ fontWeight: 700 }}
            >
              Get in touch
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-[#1a56db] transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-5 space-y-4 shadow-lg">
            <a
              href="/about"
              onClick={() => setIsOpen(false)}
              className="block text-sm text-gray-700 hover:text-[#1a56db] transition-colors"
              style={{ fontWeight: 600 }}
            >
              About
            </a>
            {/* Home sub-items always visible on mobile */}
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 px-0" style={{ fontWeight: 700 }}>Home</p>
              {homeDropdown.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-sm text-gray-700 hover:text-[#1a56db] transition-colors py-1"
                  style={{ fontWeight: 600 }}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <a
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block text-sm text-gray-700 hover:text-[#1a56db] transition-colors"
              style={{ fontWeight: 600 }}
            >
              Contact
            </a>
            <a
              href="https://calendar.app.google/Y83p7Rf5idJkdzKc6"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-[#1a56db] text-white text-center px-5 py-3 rounded-full text-sm"
              style={{ fontWeight: 700 }}
            >
              Get in touch
            </a>
          </div>
        )}
      </header>
    </>
  );
}
