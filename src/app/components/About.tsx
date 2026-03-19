import image_a5c44fa231ece841b7c75f3487148d5d4d53f216 from 'figma:asset/a5c44fa231ece841b7c75f3487148d5d4d53f216.png'
import { CheckCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const coachImage = "https://images.unsplash.com/photo-1720874129553-1d2e66076b16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25maWRlbnQlMjB3b21hbiUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsJTIwc3BlYWtlcnxlbnwxfHx8fDE3NzE3MzUyODh8MA&ixlib=rb-4.1.0&q=80&w=1080";

export function About() {
  const achievements = [
    "Trained vocalists who have performed with Michael Jackson and Prince",
    "Certified International Baccalaureate (IB) Music Education Specialist by Frankfurt International School",
    "Author of 'Learn 2 Sing', a vocal technique book",
    "Taught in 7 countries including 5 in Asia",
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Image Column */}
          <div className="hidden lg:flex flex-1 relative">
            <div className="relative max-w-md mx-auto">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src={image_a5c44fa231ece841b7c75f3487148d5d4d53f216}
                  alt="Omega Bone - Vocal Coach"
                  className="w-full h-[300px] sm:h-[420px] lg:h-[580px] object-cover object-top"
                />
              </div>

              {/* Accent stripe */}
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-[#e8f0fe] rounded-3xl -z-10" />
              <div className="absolute -top-6 -right-6 w-36 h-36 bg-[#1a56db]/10 rounded-3xl -z-10" />

              {/* Quote card */}
              <div className="absolute bottom-8 -right-8 bg-white rounded-2xl shadow-xl p-5 max-w-[200px] border border-gray-100 hidden sm:block">
                <p className="text-gray-600 text-sm italic" style={{ lineHeight: 1.6 }}>
                  "The secret to singing is the same as the secret to living. You have to believe you are worth hearing."
                </p>
                <p className="text-[#1a56db] text-xs mt-2" style={{ fontWeight: 700 }}>Omega Bone</p>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="flex-[2]">
            <p className="text-[#1a56db] text-sm mb-3 uppercase tracking-widest" style={{ fontWeight: 700 }}>
              Meet Your Coach
            </p>
            <h2
              className="text-black mb-6"
              style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}
            >I'm Omega Bone and I've dedicated my life to helping children find their voice</h2>

            
            <p className="text-gray-600 mb-8" style={{ lineHeight: 1.8 }}>While other music classes keep your child staring at sheet music, quietly hoping confidence will somehow develop on its own. Omega's curriculum builds what 3 years of traditional lessons rarely achieves.<br /><span style={{ display: "block", marginBottom: "0.5em" }} />
              In 25 years, Omega has taken thousands of hesitant children and put every single one of them on a real stage, performing with real confidence, in front of a real audience.<br /><span style={{ display: "block", marginBottom: "0.5em" }} />
              Every session has a specific outcome. Every week produces visible progress. By Day 90, your child stands on a professional stage and proves it.<br /><span style={{ display: "block", marginBottom: "0.5em" }} />
              She doesn't just teach singing. She gives your child the voice, the presence, and the courage to be seen and gives you the moment you will replay in your mind for the rest of your life.</p>

            {/* Achievements */}
            <ul className="space-y-3 mb-10">
              {achievements.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-[#1a56db] mt-0.5 shrink-0" />
                  <span className="text-gray-700 text-sm" style={{ lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href="#programs"
              className="inline-flex items-center gap-2 bg-[#1a56db] text-white px-8 py-4 rounded-full hover:bg-[#1649c0] transition-all hover:shadow-lg"
              style={{ fontWeight: 700 }}
            >
              Explore My Programs
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}