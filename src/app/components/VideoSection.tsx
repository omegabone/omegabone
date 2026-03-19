import { Play } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import studentPhoto from "figma:asset/21f3eaee986f5854b456e4b5534adf6dce578a57.png";

const concertImg = "https://images.unsplash.com/photo-1603190287605-e6ade32fa852?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwYXVkaWVuY2UlMjBjaGVlcmluZyUyMGxpdmUlMjBtdXNpY3xlbnwxfHx8fDE3NzE3MzUyODh8MA&ixlib=rb-4.1.0&q=80&w=1080";

export function VideoSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Content */}
          <div className="flex-1 max-w-lg">
            <p className="text-[#1a56db] text-sm mb-3 uppercase tracking-widest" style={{ fontWeight: 700 }}>
              The Results Speak
            </p>
            <h2
              className="text-black mb-6"
              style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}
            >My students don't just improve, they transform</h2>
            <p className="text-gray-600 mb-8" style={{ lineHeight: 1.8 }}>Watch your child go from hesitant and unsure to performing on stage with poise, presence, and a voice that commands attention in just weeks. My students don't just sing. They develop the confidence, discipline, and charisma that top colleges and future leaders are made of.</p>

            {/* Transformation Stats */}
            <div className="grid grid-cols-2 gap-5 mb-10">
              {[
                { number: "28 days", desc: "Average time to perform first song", ref: null },
                { number: "100%", desc: "of performing music arts students show growth in leadership skills", ref: null },
                { number: "92%", desc: "Report increased stage confidence", ref: null },
                { number: "5 out of 5", desc: "Core leadership skills: communication, confidence, responsibility, teamwork, and the ability to inspire", ref: null },
              ].map((item, i) => (
                <div key={i} className="bg-[#f7f9ff] rounded-2xl p-5 border border-blue-50">
                  <p className="text-[#1a56db] mb-1" style={{ fontSize: "1.6rem", fontWeight: 800 }}>
                    {item.number}
                  </p>
                  <p className="text-gray-600 text-sm" style={{ lineHeight: 1.5 }}>
                    {item.desc}
                    {item.ref && (
                      <a href={item.ref} target="_blank" rel="noopener noreferrer" className="text-[#1a56db] hover:underline align-super" style={{ fontSize: "0.6em", fontWeight: 700, marginLeft: "1px" }}>1</a>
                    )}
                  </p>
                </div>
              ))}
            </div>

            
          </div>

          {/* Video */}
          <div className="flex-1 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer group" onClick={() => setPlaying(true)}>
              <ImageWithFallback
                src={studentPhoto}
                alt="Student performance"
                className="w-full h-[420px] object-cover transition-transform group-hover:scale-105 duration-700"
              />
              {!playing && (
                <>
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play size={28} fill="#1a56db" className="text-[#1a56db] ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white text-sm" style={{ fontWeight: 600 }}>🎬 Watch Leyna, Jeong Ha and Yuuki record their first music video cover, recorded by Ayan</p>
                  </div>
                </>
              )}
              {playing && (
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  <iframe
                    className="w-full h-full bg-[#fffefe00]"
                    src="https://www.youtube.com/embed/_K_4PeLnCMU?autoplay=1"
                    title="Student transformation video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>

            {/* Decorative */}
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-[#e8f0fe] rounded-3xl -z-10" />
            <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full border-4 border-[#1a56db]/20 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}