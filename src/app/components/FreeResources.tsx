import image_3be9b42ee50b1bf688bedf3e5c09f1ffb216f0a0 from 'figma:asset/3be9b42ee50b1bf688bedf3e5c09f1ffb216f0a0.png'
import { useState } from "react";
import { Download, BookOpen, Headphones } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ResourceDownloadModal } from "./ResourceDownloadModal";

const resources = [
  {
    icon: <Headphones size={22} />,
    title: "7-Day Vocal Warm-Up Series",
    desc: "Start every morning with these 10-minute audio warm-ups designed to protect and strengthen your child's voice.",
    badge: "Audio",
    badgeColor: "bg-purple-100 text-purple-700",
    file: "vocal-warmup-series.zip",
  },
  {
    icon: <BookOpen size={22} />,
    title: "The Singer's Technique Handbook",
    desc: "A free 40-page PDF covering breath support, resonance, and stage confidence basics.",
    badge: "eBook",
    badgeColor: "bg-green-100 text-green-700",
    file: "singers-handbook.pdf",
  },
];

export function FreeResources() {
  const [activeResource, setActiveResource] = useState<{ label: string; file: string } | null>(null);

  return (
    <>
      <ResourceDownloadModal resource={activeResource} onClose={() => setActiveResource(null)} />

      <section id="resources" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Content */}
            <div className="flex-1">
              <p className="text-[#1a56db] text-sm mb-3 uppercase tracking-widest" style={{ fontWeight: 700 }}>
                Free Resources
              </p>
              <h2
                className="text-black mb-4"
                style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}
              >Start improving your child's voice today</h2>
              <p className="text-gray-600 mb-10" style={{ lineHeight: 1.8 }}>I believe everyone deserves access to quality vocal training. That's why I've created these free tools to get your child started right now, no credit card required.</p>

              <div className="space-y-5">
                {resources.map((r, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveResource({ label: r.title, file: r.file })}
                    className="flex items-start gap-5 p-5 rounded-2xl border border-gray-100 bg-[#f7f9ff] hover:border-[#1a56db]/30 hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#e8f0fe] text-[#1a56db] flex items-center justify-center shrink-0 group-hover:bg-[#1a56db] group-hover:text-white transition-colors">
                      {r.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-black" style={{ fontSize: "0.95rem", fontWeight: 700 }}>{r.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${r.badgeColor}`} style={{ fontWeight: 600 }}>
                          {r.badge}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm" style={{ lineHeight: 1.6 }}>{r.desc}</p>
                    </div>
                    <Download size={18} className="text-gray-300 group-hover:text-[#1a56db] transition-colors shrink-0 mt-1" />
                  </div>
                ))}
              </div>

              <button
                onClick={() => openPopup("all free resources")}
                className="inline-flex items-center gap-2 mt-8 bg-[#1a56db] text-white px-8 py-4 rounded-full hover:bg-[#1649c0] transition-all hover:shadow-lg"
                style={{ fontWeight: 700 }}
              >
                <Download size={18} />
                Get All Free Resources
              </button>
            </div>

            {/* Image */}
            <div className="flex-1 relative max-w-md">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src={image_3be9b42ee50b1bf688bedf3e5c09f1ffb216f0a0}
                  alt="Online learning platform"
                  className="w-full h-[460px] object-cover m-[0px]"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-44 h-44 bg-[#e8f0fe] rounded-3xl -z-10" />

              {/* Floating badge */}
              <div className="absolute bottom-6 left-0 sm:-left-6 bg-white rounded-2xl shadow-xl px-5 py-4 border border-gray-100">
                <p className="text-[#1a56db] text-2xl" style={{ fontWeight: 800 }}>FREE</p>
                <p className="text-gray-600 text-xs" style={{ fontWeight: 600 }}>No credit card needed</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
