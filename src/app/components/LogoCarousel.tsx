import fifaLogo from "figma:asset/feb8a1ba58b3c4c836297ee1591d3c8d2a7a978d.png";
import porscheLogo from "figma:asset/ff8efcf322c00e05bc031f0908b057cc1d2a400c.png";
import allianzLogo from "figma:asset/cf5a86fe5337b92da6596816b75f157ac94bac92.png";
import mercedesLogo from "figma:asset/37335a04adf63c9fbb1f8e1f251549dbda4a51bb.png";
import mcdonaldsLogo from "figma:asset/0b8b0ec876fecacbb42f778dc6767c68fd5a67f7.png";
import mjLogo from "figma:asset/c1b415218306eb53993c1f397d8335b5fd9c645e.png";
import finalFantasyLogo from "figma:asset/28ac6a367e54af004c814fb1fcec33eec12022b3.png";
import princeLogo from "figma:asset/3216ea2ff4d1a1e8a36ee5ab8f4b04dd12e0fb88.png";

const logos = [
  { src: fifaLogo, alt: "FIFA", maxH: "3rem" },
  { src: porscheLogo, alt: "Porsche", maxH: "5rem" },
  { src: allianzLogo, alt: "Allianz", maxH: "3rem" },
  { src: mercedesLogo, alt: "Mercedes-Benz", maxH: "3rem" },
  { src: mcdonaldsLogo, alt: "McDonald's", maxH: "3.5rem" },
  { src: mjLogo, alt: "Michael Jackson", maxH: "3.5rem" },
  { src: finalFantasyLogo, alt: "Final Fantasy", maxH: "3.2rem" },
  { src: princeLogo, alt: "Prince", maxH: "3.5rem" },
];

export function LogoCarousel() {
  const track = [...logos, ...logos];

  return (
    <section className="bg-[#f3f4f6] py-6 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-4 px-6">
        <p className="text-gray-400 text-sm tracking-widest uppercase mb-1" style={{ fontWeight: 400, letterSpacing: "0.18em" }}>
          Performed &amp; worked with
        </p>
        
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #f3f4f6, transparent)" }} />
        <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #f3f4f6, transparent)" }} />

        <div className="flex" style={{ animation: "logocarousel-scroll 32s linear infinite", width: "max-content" }}>
          {track.map((logo, i) => (
            <div
              key={i}
              className="flex items-center justify-center mx-10 shrink-0"
              style={{ width: 160, height: 64 }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-w-full object-contain transition-transform duration-300 hover:scale-110"
                style={{ maxHeight: logo.maxH }}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes logocarousel-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}