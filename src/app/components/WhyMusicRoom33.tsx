import image_357f6660ae58b175c8c749a45d9bb882e1fae8e8 from 'figma:asset/357f6660ae58b175c8c749a45d9bb882e1fae8e8.png'
import image_0c2a77794e59fe14a6fc50fb58a7f1674200ce28 from 'figma:asset/0c2a77794e59fe14a6fc50fb58a7f1674200ce28.png'
import { Music, Star, Award, Users } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const performImage =
  "https://images.unsplash.com/photo-1759503407457-3683579f080b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25maWRlbnQlMjBjaGlsZCUyMHBlcmZvcm1pbmclMjBvbiUyMHN0YWdlfGVufDF8fHx8MTc3MjQ4MzgwM3ww&ixlib=rb-4.1.0&q=80&w=1080";

const pillars = [
  {
    icon: <Music size={22} />,
    title: "Real Vocal Technique",
    desc: "Not just singing along to songs. Your child learns breath control, pitch accuracy, and tone - the foundations that last a lifetime.",
  },
  {
    icon: <Star size={22} />,
    title: "Stage Confidence",
    desc: "From their first lesson, children learn how to own a room. The kind of presence that carries into classrooms, auditions, and everyday life.",
  },
  {
    icon: <Award size={22} />,
    title: "Performance-Ready",
    desc: "Every programme ends with something to show for it — a polished recording, a mini-recital, or a competition-ready performance.",
  },
  {
    icon: <Users size={22} />,
    title: "Parent Partnership",
    desc: "You're part of the process. Omega keeps you informed, equipped, and confident at every step so progress continues at home too.",
  },
];

export function WhyMusicRoom33() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="flex-1 w-full">
            <div className="relative max-w-md mx-auto lg:mx-0">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src={image_357f6660ae58b175c8c749a45d9bb882e1fae8e8}
                  alt="Child performing confidently on stage"
                  className="w-full h-64 sm:h-[420px] object-cover"
                />
              </div>
              <div className="hidden sm:block absolute -bottom-6 -right-6 w-48 h-48 bg-[#e8f0fe] rounded-3xl -z-10" />
              <div className="hidden sm:block absolute -top-6 -left-6 w-32 h-32 bg-[#1a56db]/10 rounded-3xl -z-10" />
            </div>
          </div>

          <div className="flex-1 max-w-xl w-full">
            <p className="text-[#1a56db] text-sm mb-3 uppercase tracking-widest" style={{ fontWeight: 700 }}>
              Why Music Room 33
            </p>
            <h2
              className="text-black mb-6"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}
            >
              A child who learns to sing learns to lead.
            </h2>
            <p className="text-gray-600 mb-8" style={{ lineHeight: 1.85 }}>Most children's music lessons focus on notes. Music Room 33 focuses on the child. Omega has spent 25 years watching what happens when a child discovers their voice and the results go far beyond music.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {pillars.map((p, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-[#e8f0fe] text-[#1a56db] flex items-center justify-center">
                    {p.icon}
                  </div>
                  <div>
                    <p className="text-black mb-1" style={{ fontWeight: 700, fontSize: "0.95rem" }}>{p.title}</p>
                    <p className="text-gray-500 text-sm" style={{ lineHeight: 1.7 }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}