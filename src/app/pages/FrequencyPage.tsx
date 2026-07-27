import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle, Mail, Play, User } from "lucide-react";
import { L2CNavbar } from "../components/L2CNavbar";
import { Footer } from "../components/Footer";
import omegaPortrait from "/images/omega-bw-portrait.png";

/* ─────────────── SHARED OPT-IN FORM ─────────────── */
function FrequencyOptInForm({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitting(true);

    const apiKey = import.meta.env.VITE_KIT_API_KEY;
    const formId = import.meta.env.VITE_KIT_FORM_ID;

    try {
      const res = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey, email, first_name: firstName }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("Kit subscribe failed:", res.status, body);
      }
    } catch (err) {
      console.error("Kit subscribe error:", err);
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  const dark = variant === "dark";

  if (submitted) {
    return (
      <div
        className={`flex items-center gap-3 rounded-2xl px-6 py-5 ${
          dark ? "bg-white/10 text-white" : "bg-[#f0fdf4] text-black"
        }`}
      >
        <CheckCircle size={24} className={dark ? "text-white shrink-0" : "text-[#166534] shrink-0"} />
        <p style={{ lineHeight: 1.6 }}>
          You're in. Video one of the Frequency Series is on its way to your inbox right now.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <User
            size={16}
            className={`absolute left-4 top-1/2 -translate-y-1/2 ${dark ? "text-white/50" : "text-gray-400"}`}
          />
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            className={`w-full pl-10 pr-4 py-3.5 rounded-full text-sm outline-none transition-all ${
              dark
                ? "bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-white/50"
                : "border border-gray-200 text-black focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/20"
            }`}
          />
        </div>
        <div className="relative flex-1">
          <Mail
            size={16}
            className={`absolute left-4 top-1/2 -translate-y-1/2 ${dark ? "text-white/50" : "text-gray-400"}`}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            placeholder="your@email.com"
            className={`w-full pl-10 pr-4 py-3.5 rounded-full text-sm outline-none transition-all ${
              dark
                ? "bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-white/50"
                : "border border-gray-200 text-black focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/20"
            }`}
          />
        </div>
      </div>
      {error && <p className={`text-xs ${dark ? "text-red-200" : "text-red-500"}`}>{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className={`flex items-center justify-center gap-2 px-8 py-4 rounded-full transition-all group disabled:opacity-70 ${
          dark
            ? "bg-white text-[#166534] hover:bg-green-50"
            : "bg-[#166534] text-white hover:bg-[#14532d] hover:shadow-lg hover:shadow-[#166534]/30"
        }`}
        style={{ fontWeight: 700, fontSize: "1rem" }}
      >
        {submitting ? "Sending..." : "Send Me The Free Series"}
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>
      <p className={`text-xs ${dark ? "text-white/60" : "text-gray-500"}`}>
        Five free videos. No credit card, no spam, unsubscribe anytime.
      </p>
    </form>
  );
}

/* ─────────────── HERO ─────────────── */
function FrequencyHero() {
  return (
    <section className="relative bg-white pt-24 pb-20 overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#f0fdf4] hidden lg:block" style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" }} />
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[#166534]/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#dcfce7] text-[#166534] px-4 py-2 rounded-full text-sm mb-6" style={{ fontWeight: 600 }}>
              <span className="w-2 h-2 rounded-full bg-[#166534] animate-pulse" />
              Free 5-Part Video Series
            </div>

            <h1 className="text-black mb-6" style={{ fontSize: "clamp(2.2rem, 4.6vw, 3.4rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em" }}>
              Your voice is not the obstacle. It's the <span style={{ color: "#166534" }}>answer</span>.
            </h1>

            <p className="text-gray-600 mb-8 text-lg" style={{ lineHeight: 1.7 }}>
              The Frequency Series is five free videos, one pillar of the method at a time, so you can feel the difference before you ever book a call.
            </p>

            <FrequencyOptInForm />
          </div>

          <div className="flex-1 w-full max-w-lg">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={omegaPortrait}
                alt="Omega Bone"
                className="w-full h-[340px] sm:h-[440px] object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── WHAT'S INSIDE ─────────────── */
function FrequencyPillars() {
  const pillars = [
    {
      title: "The warm-up",
      desc: "A protocol built for your voice and your specific patterns of tension, not a generic scale.",
    },
    {
      title: "The mechanics",
      desc: "The speaking-voice fundamentals that hold under pressure, so your voice steadies when the stakes rise.",
    },
    {
      title: "The diction",
      desc: "How to be understood the first time, without repeating yourself.",
    },
    {
      title: "The state",
      desc: "A pre-performance ritual, so you walk into any room already regulated.",
    },
    {
      title: "The presence",
      desc: "Stage and room presence, so your body tells the right story before you speak.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[#166534] text-sm mb-3 uppercase tracking-widest" style={{ fontWeight: 700 }}>
            What's inside
          </p>
          <h2 className="text-black mb-4" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
            Five videos. Five pillars. One method.
          </h2>
          <p className="text-gray-600" style={{ lineHeight: 1.8 }}>
            Each video covers one part of the same method Omega uses with private clients, delivered one pillar at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {pillars.map((p, i) => (
            <div key={i} className="bg-[#f0fdf4] rounded-2xl p-6 border border-green-50">
              <p className="text-[#166534] mb-3" style={{ fontSize: "1.6rem", fontWeight: 800 }}>{`0${i + 1}`}</p>
              <p className="text-black mb-2" style={{ fontWeight: 700 }}>{p.title}</p>
              <p className="text-gray-600 text-sm" style={{ lineHeight: 1.6 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── PROOF (ANTOINE) ─────────────── */
function FrequencyProof() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="py-24 bg-[#f0fdf4]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[#166534] text-sm mb-3 uppercase tracking-widest" style={{ fontWeight: 700 }}>
            The proof
          </p>
          <h2 className="text-black mb-4" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
            It changes people. In their own words.
          </h2>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer group max-w-3xl mx-auto" onClick={() => setPlaying(true)}>
          {!playing ? (
            <>
              <img
                src="/videos/antoine-poster.jpg"
                alt="Antoine Riendeau, video testimonial"
                className="w-full h-[420px] object-cover transition-transform group-hover:scale-105 duration-700"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Play size={28} fill="#166534" className="text-[#166534] ml-1" />
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white text-sm" style={{ fontWeight: 600 }}>
                  "It took me a month to really discover that I had three levels of voice."
                </p>
              </div>
            </>
          ) : (
            <video
              className="w-full h-[420px] object-cover bg-black"
              src="/videos/antoine-testimonial.mp4"
              poster="/videos/antoine-poster.jpg"
              controls
              autoPlay
              playsInline
            />
          )}
        </div>
        <p className="text-center text-gray-500 text-sm mt-5 uppercase tracking-widest" style={{ fontWeight: 700 }}>
          Antoine Riendeau
        </p>
      </div>
    </section>
  );
}

/* ─────────────── STORY (OMEGA) ─────────────── */
function FrequencyStory() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 relative order-1 w-full">
            <div className="relative max-w-md mx-auto">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={omegaPortrait}
                  alt="Omega Bone"
                  className="w-full h-[420px] object-cover"
                />
              </div>
              <div className="hidden sm:block absolute -bottom-6 -left-6 w-40 h-40 bg-[#dcfce7] rounded-3xl -z-10" />
            </div>
          </div>

          <div className="flex-1 max-w-xl order-2">
            <p className="text-[#166534] text-sm mb-3 uppercase tracking-widest" style={{ fontWeight: 700 }}>
              The why beneath the work
            </p>
            <h2 className="text-black mb-6" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
              I spent years believing I taught singing.
            </h2>
            <p className="text-gray-600 mb-5" style={{ lineHeight: 1.85 }}>
              Slowly, across a career that took me from sharing the stage with Michael Jackson at Super Bowl XXVII to training more than 7,400 students worldwide, I understood I was teaching something else. I was teaching people to stop being afraid of being heard.
            </p>
            <p className="text-gray-600 mb-8" style={{ lineHeight: 1.85 }}>
              Your frequency is real. This free series is the first step in clearing the interference so it finally reaches the room.
            </p>
            <a
              href="#top"
              className="inline-flex items-center justify-center gap-2 bg-[#166534] text-white px-8 py-4 rounded-full hover:bg-[#14532d] transition-all hover:shadow-lg hover:shadow-[#166534]/30 group"
              style={{ fontWeight: 700, fontSize: "1rem" }}
            >
              Start With Video One
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── FINAL CTA ─────────────── */
function FrequencyFinalCTA() {
  return (
    <section className="relative py-24 bg-[#166534] overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 800 400" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0,300 Q200,150 400,300 T800,300" stroke="white" strokeWidth="2" fill="none" />
          <path d="M0,230 Q200,80 400,230 T800,230" stroke="white" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        <h2 className="text-white mb-6" style={{ fontSize: "clamp(2rem, 4.6vw, 3rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em" }}>
          Your voice is not broken. It is the thing you are.
        </h2>
        <p className="text-green-100 mb-10 text-lg max-w-xl" style={{ lineHeight: 1.7 }}>
          Get all five videos of the Frequency Series free, delivered one pillar at a time.
        </p>
        <FrequencyOptInForm variant="dark" />
      </div>
    </section>
  );
}

/* ─────────────── PAGE ASSEMBLY ─────────────── */
export function FrequencyPage() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "The Frequency Series — Free Video Training | Omega Bone";

    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const prevDesc = metaDesc?.content ?? "";
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content =
      "Five free videos on the warm-up, mechanics, diction, state, and presence behind Vocal Mastery for Entrepreneurs. No credit card required.";

    return () => {
      document.title = prevTitle;
      if (metaDesc) metaDesc.content = prevDesc;
    };
  }, []);

  return (
    <div id="top" className="bg-white min-h-screen overflow-x-hidden">
      <L2CNavbar />
      <FrequencyHero />
      <FrequencyPillars />
      <FrequencyProof />
      <FrequencyStory />
      <FrequencyFinalCTA />
      <Footer />
    </div>
  );
}
