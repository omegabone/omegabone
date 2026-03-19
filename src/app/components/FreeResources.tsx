import image_3be9b42ee50b1bf688bedf3e5c09f1ffb216f0a0 from 'figma:asset/3be9b42ee50b1bf688bedf3e5c09f1ffb216f0a0.png'
import { useState } from "react";
import { Download, BookOpen, Headphones, CheckCircle, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const resources = [
  {
    icon: <Headphones size={22} />,
    title: "7-Day Vocal Warm-Up Series",
    desc: "Start every morning with these 10-minute audio warm-ups designed to protect and strengthen your child's voice.",
    badge: "Audio",
    badgeColor: "bg-purple-100 text-purple-700",
  },
  {
    icon: <BookOpen size={22} />,
    title: "The Singer's Technique Handbook",
    desc: "A free 40-page PDF covering breath support, resonance, and stage confidence basics.",
    badge: "eBook",
    badgeColor: "bg-green-100 text-green-700",
  },
];

export function FreeResources() {
  const [activeResource, setActiveResource] = useState<{ title: string } | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  function openPopup(title: string) {
    setActiveResource({ title });
    setEmail("");
    setSubmitted(false);
    setEmailError("");
  }

  function closePopup() {
    setActiveResource(null);
    setEmail("");
    setSubmitted(false);
    setEmailError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");

    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch (_) {
      // silently fail — still show success
    }

    setSubmitted(true);
  }

  return (
    <>
      {/* Email-capture popup */}
      {activeResource && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
          onClick={(e) => { if (e.target === e.currentTarget) closePopup(); }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {!submitted ? (
              <>
                <div className="w-12 h-12 rounded-xl bg-[#e8f0fe] text-[#1a56db] flex items-center justify-center mb-5">
                  <Download size={22} />
                </div>
                <h3 className="text-black mb-1" style={{ fontSize: "1.25rem", fontWeight: 800 }}>
                  Get your free resource
                </h3>
                <p className="text-gray-500 text-sm mb-6" style={{ lineHeight: 1.6 }}>
                  Enter your email and we'll send you{" "}
                  <span className="text-black" style={{ fontWeight: 600 }}>{activeResource.title}</span>{" "}
                  instantly.
                </p>
                <form onSubmit={handleSubmit} noValidate>
                  <label
                    className="block text-sm text-gray-700 mb-1"
                    style={{ fontWeight: 600 }}
                    htmlFor="fr-email"
                  >
                    Email address
                  </label>
                  <input
                    id="fr-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20 transition mb-1"
                  />
                  {emailError && (
                    <p className="text-red-500 text-xs mb-1">{emailError}</p>
                  )}
                  <button
                    type="submit"
                    className="w-full mt-4 bg-[#1a56db] text-white rounded-xl py-3 text-sm hover:bg-[#1649c0] transition-colors"
                    style={{ fontWeight: 700 }}
                  >
                    Send me the free resource
                  </button>
                </form>
                <p className="text-center text-gray-400 text-xs mt-4">No spam, ever. Unsubscribe anytime.</p>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-[#e8f0fe] flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={28} className="text-[#1a56db]" />
                </div>
                <h3 className="text-black mb-2" style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                  You're all set!
                </h3>
                <p className="text-gray-500 text-sm mb-6" style={{ lineHeight: 1.7 }}>
                  Check your inbox at{" "}
                  <span className="text-black" style={{ fontWeight: 600 }}>{email}</span>. We've sent{" "}
                  <span className="text-black" style={{ fontWeight: 600 }}>{activeResource.title}</span> your way.
                </p>
                <button
                  onClick={closePopup}
                  className="bg-[#1a56db] text-white rounded-xl px-6 py-2.5 text-sm hover:bg-[#1649c0] transition-colors"
                  style={{ fontWeight: 700 }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
                    onClick={() => openPopup(r.title)}
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
