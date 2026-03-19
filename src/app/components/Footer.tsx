import { Link } from "react-router";
import image_1b40ce6fad932976877e479dbe3357976c3937d6 from 'figma:asset/1b40ce6fad932976877e479dbe3357976c3937d6.png'
import { Linkedin, Youtube, Facebook } from "lucide-react";
import { useState } from "react";
import { ResourceDownloadModal } from "./ResourceDownloadModal";

const downloadableResources: Record<string, { label: string; file: string }> = {
  "Vocal Warm-Up Series": { label: "7-Day Vocal Warm-Up Series", file: "vocal-warmup-series.zip" },
  "Singer's Handbook": { label: "The Singer's Technique Handbook", file: "singers-handbook.pdf" },
};

export function Footer() {
  const [activeResource, setActiveResource] = useState<{ label: string; file: string } | null>(null);

  const links: Record<string, { label: string; href: string }[]> = {
    Programs: [
      { label: "Learn to Communicate", href: "/learn-to-communicate" },
      { label: "Learn to Sing", href: "/learn2sing" },
      { label: "Music Room 33", href: "/music-room-33" },
      { label: "Private Sessions", href: "/contact" },
      { label: "Group Workshops", href: "/contact" },
      { label: "Corporate Workshops", href: "/contact" },
    ],
    Resources: [
      { label: "Vocal Warm-Up Series", href: "/learn-to-communicate#resources" },
      { label: "Singer's Handbook", href: "/learn-to-communicate#resources" },
    ],
    Company: [
      { label: "About Omega Bone", href: "/about" },
      { label: "Album Release", href: "/come-with-me" },
      { label: "Contact", href: "/contact" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  };

  const socials = [
    { icon: <Youtube size={20} />, label: "YouTube", href: "https://www.youtube.com/omegabone" },
    { icon: <Facebook size={20} />, label: "Facebook", href: "https://www.facebook.com/groups/266096668213824/about" },
    { icon: <Linkedin size={20} />, label: "LinkedIn", href: "https://www.linkedin.com/in/omegabone/" },
  ];

  return (
    <footer className="bg-black text-white">
      <ResourceDownloadModal resource={activeResource} onClose={() => setActiveResource(null)} />
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-32 h-32 flex items-center justify-center">
                <img src={image_1b40ce6fad932976877e479dbe3357976c3937d6} alt="Omega Bone" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="block text-gray-400 text-xs" style={{ fontWeight: 500, letterSpacing: "0.1em" }}>VOCAL COACH</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6" style={{ lineHeight: 1.7 }}>Empowering you to unlock your full vocal potential through techniques, proven over 25+ years of coaching experience, and heartfelt guidance.</p>
            {/* Socials */}
            <div className="flex gap-3">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-[#1a56db] hover:text-white transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-white text-sm mb-5 uppercase tracking-wider" style={{ fontWeight: 700 }}>
                {category}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => {
                  const downloadable = downloadableResources[item.label];
                  return (
                    <li key={item.label}>
                      {downloadable ? (
                        <button
                          onClick={() => setActiveResource(downloadable)}
                          className="text-gray-400 text-sm hover:text-white transition-colors text-left"
                        >
                          {item.label}
                        </button>
                      ) : (
                        <Link
                          to={item.href.split("#")[0]}
                          className="text-gray-400 text-sm hover:text-white transition-colors"
                          onClick={() => requestAnimationFrame(() => window.scrollTo(0, 0))}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 Omega Bone Vocal Coaching. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Results may vary. Testimonials are real student experiences and not a guarantee of specific results.
          </p>
        </div>
      </div>
    </footer>
  );
}