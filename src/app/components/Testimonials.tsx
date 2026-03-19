import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import jacreamImg from "figma:asset/9a56e731aa7826852c6a808b767815b32665288b.png";
import amirahImg from "figma:asset/fced2b75511a20633c2209c9d6fe6e6a657aa5a1.png";
import richieImg from "figma:asset/b83f479654f431a8c7e6ebb892c9028ad17d4a2f.png";
import sreynannImg from "figma:asset/6d2db891878a87edbb32f0b61bcd05ea15237f3b.png";

const testimonials = [
  {
    name: "Jacream Hammond",
    role: "Student",
    avatar: jacreamImg,
    text: "I just asked the universe for an opportunity to grow as a performer. And then I just happen to be in the right place that night in Sara and me into the group. And she was like, does anyone want to learn to sing?\n\nI don't think I could be any more than happy and ecstatic just to have someone willing to work and teach me.",
    stars: 5,
  },
  {
    name: "Amirah Mustaffa",
    role: "Student",
    avatar: amirahImg,
    text: "I liked that the class has a very positive energy. Miss Bone is encouraging supportive, thoughtful, hardworking, and a fun person. Classmates are also very encouraging and supportive towards each other. I also like that we must actively participate in class by singing a song and like keeping the camera on.",
    stars: 5,
  },
  {
    name: "Richie Chong",
    role: "Student",
    avatar: richieImg,
    text: "The significant changes in my singing would be how to control the top voices, the mouth shape that actually changes the voices coming up, the breath, controlling the diction, and also the emotion to be accurate and projected on the face.\n\nMs. Bone actually put every single effort, the passion, and the motivations. She's devoted, to teach every single one and is very, very, very generous with her teachings.",
    stars: 5,
  },
  {
    name: "Sreynann Pheap",
    role: "Student",
    avatar: sreynannImg,
    text: "Before joining LEARN 2 SING in 6 weeks, I cannot find my own voice and I'm nervous and shy; trembling with no confidence. I don't have confidence in myself. I never finished my song. I don't like that I stop the middle of the song.\n\nI can say that it changed me so much. Yes. It changed me so much. I have more confidence. I'm not nervous.",
    stars: 5,
  },
  {
    name: "Vice Principal",
    role: "School Administrator",
    avatar: null,
    text: "Miss Bone is a remarkable person who worked with over 100 students [in choir]. She is well respected by students, peers and parents alike. Her musical talents exceeded our expectations. I recommend her with enthusiasm.",
    stars: 5,
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const t = testimonials[current];

  return (
    <section id="testimonials" className="py-12 sm:py-16 lg:py-20 bg-[#f7f9ff]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[#1a56db] text-sm mb-3 uppercase tracking-widest" style={{ fontWeight: 700 }}>
            Student Stories
          </p>
          <h2
            className="text-black"
            style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}
          >
            Real students, real transformations
          </h2>
        </div>

        {/* Main Testimonial */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 md:p-14 relative overflow-hidden border border-gray-100">
            {/* Quote mark */}
            <Quote size={48} className="text-[#e8f0fe] absolute top-6 right-6 sm:top-8 sm:right-10" strokeWidth={1} />

            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Text */}
            <div className="mb-8 relative z-10">
              {t.text.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  className="text-gray-800 mb-4 last:mb-0"
                  style={{ fontSize: "clamp(1.05rem, 2vw, 1.2rem)", lineHeight: 1.8, fontStyle: "italic" }}
                >
                  {i === 0 ? `"${para}` : para}{i === t.text.split("\n\n").length - 1 ? '"' : ""}
                </p>
              ))}
            </div>

            {/* Author */}
            <div className="flex items-center gap-4">
              {t.avatar ? (
                <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#1a56db]/20" loading="lazy" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#e8f0fe] border-2 border-[#1a56db]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#1a56db] text-lg" style={{ fontWeight: 700 }}>VP</span>
                </div>
              )}
              <div>
                <p className="text-black" style={{ fontWeight: 700 }}>{t.name}</p>
                <p className="text-gray-500 text-sm">{t.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? "bg-[#1a56db] w-8" : "bg-gray-200 w-2 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#1a56db] hover:text-[#1a56db] transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                className="w-12 h-12 rounded-full bg-[#1a56db] text-white flex items-center justify-center hover:bg-[#1649c0] transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}