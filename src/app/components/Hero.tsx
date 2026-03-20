import { Play, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const heroImage = "https://images.unsplash.com/flagged/photo-1568777567165-aaaa23be84a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2NhbCUyMGNvYWNoJTIwc2luZ2luZyUyMGxlc3NvbiUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzE3MzUyODN8MA&ixlib=rb-4.1.0&q=80&w=1080";

export function Hero() {
  return (
    <section className="relative min-h-screen bg-white pt-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#f0f5ff] clip-right hidden lg:block" style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" }} />
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[#1a56db]/5 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-56 h-56 rounded-full bg-[#1a56db]/8 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 min-h-[calc(100vh-5rem)] py-16">
          {/* Left Content */}
          <div className="flex-1 max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#e8f0fe] text-[#1a56db] px-4 py-2 rounded-full text-sm mb-6" style={{ fontWeight: 600 }}>
              <span className="w-2 h-2 rounded-full bg-[#1a56db] animate-pulse" />
              Now Enrolling — Spring 2026 Cohort
            </div>

            {/* Headline */}
            <h1 className="text-black mb-6" style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em" }}>Your child has a  <span className="text-[#1a56db]">voice </span>worth hearing</h1>

            <p className="text-gray-600 mb-8 text-lg" style={{ lineHeight: 1.7 }}>Omega helps them find it through music and the courage to lead with it!</p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a
                href="https://calendar.app.google/Y83p7Rf5idJkdzKc6"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1a56db] text-white px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-[#1649c0] transition-all hover:shadow-lg hover:shadow-[#1a56db]/30 group"
                style={{ fontWeight: 700, fontSize: "1rem" }}
              >
                Book a Free 30-Min. Consultation
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <button className="flex items-center justify-center gap-3 text-black hover:text-[#1a56db] transition-colors group">
                
                
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-gray-100">
              <div className="flex -space-x-3">
                {[
                  "https://images.unsplash.com/photo-1591597807298-b7e575552882?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGNoaWxkJTIwa2lkJTIwZmFjZSUyMHBvcnRyYWl0JTIwc21pbGV8ZW58MXx8fHwxNzcxOTEwOTY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
                  "https://images.unsplash.com/photo-1734337449372-da266eb792be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwbGl0dGxlJTIwZ2lybCUyMHNtaWxpbmclMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzE5MTA5NjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
                  "https://images.unsplash.com/photo-1748200100427-52921dec8597?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGJveSUyMGxhdWdoaW5nJTIwcG9ydHJhaXQlMjBjbG9zZXVwfGVufDF8fHx8MTc3MTkxMDk2NHww&ixlib=rb-4.1.0&q=80&w=1080",
                  "https://images.unsplash.com/photo-1657880493946-f828074ceec3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZCUyMHNpbmdpbmclMjBoYXBweSUyMGpveWZ1bCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MTkxMDk2NXww&ixlib=rb-4.1.0&q=80&w=1080",
                ].map((src, i) => (
                  <img key={i} src={src} alt="Student" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-sm mt-0.5"><span className="text-black" style={{ fontWeight: 700 }}>7,400+ students</span> trained in-person around the world</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden lg:flex flex-1 relative justify-center lg:justify-end">
            <div className="relative">
              {/* Main image */}
              <div className="w-full max-w-md lg:max-w-lg rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src={heroImage}
                  alt="Omega Bone - Vocal Coach"
                  className="w-full h-[300px] sm:h-[420px] lg:h-[520px] object-cover"
                  fetchPriority="high"
                  loading="eager"
                />
              </div>

              {/* Floating card 1 */}
              

              {/* Floating card 2 */}
              <div className="hidden lg:block absolute -right-4 bottom-20 bg-[#1a56db] rounded-2xl shadow-xl px-5 py-4 text-white">
                <p className="text-3xl" style={{ fontWeight: 800 }}>98%</p>
                <p className="text-blue-200 text-xs mt-0.5" style={{ fontWeight: 500 }}>Student Satisfaction</p>
              </div>

              {/* Floating card 3 */}
              <div className="hidden lg:flex absolute -bottom-4 left-12 bg-white rounded-2xl shadow-xl px-5 py-3 items-center gap-3 border border-gray-100">
                <span className="text-2xl">🎤</span>
                <div>
                  <p className="text-black text-sm" style={{ fontWeight: 700 }}>25+ Years</p>
                  <p className="text-gray-500 text-xs">Professional coaching</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}