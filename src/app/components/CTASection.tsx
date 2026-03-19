import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section id="get-started" className="py-24 bg-[#1a56db] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/5 translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          <path d="M0,200 Q200,50 400,200 T800,200" stroke="white" strokeWidth="2" fill="none" />
          <path d="M0,230 Q200,80 400,230 T800,230" stroke="white" strokeWidth="2" fill="none" />
          <path d="M0,170 Q200,20 400,170 T800,170" stroke="white" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <h2
          className="text-white mb-6"
          style={{ fontSize: "clamp(2.2rem, 5vw, 3.2rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em" }}
        >
          Your child is waiting to be seen.{" "}
          <br className="hidden md:block" />
          Let's unlock his/her voice together.
        </h2>

        <p
          className="text-blue-100 mb-10 text-lg max-w-xl mx-auto"
          style={{ lineHeight: 1.7 }}
        >
          Join thousands of parents getting weekly insights on raising confident
          children who express themselves freely on stage, in class, and in life.
        </p>

        <div className="flex flex-col gap-3 max-w-lg mx-auto">
          <button
            type="button"
            onClick={() => window.open("https://calendar.app.google/Y83p7Rf5idJkdzKc6", "_blank")}
            className="w-full bg-black text-white px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors whitespace-nowrap group"
            style={{ fontWeight: 700 }}
          >
            Book a Free 30-Min Consultation with Omega
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <p
            className="text-blue-200 text-center text-[14px]"
            style={{ lineHeight: 1.6 }}
          >
            Get a personalized roadmap for unlocking your child's voice. No commitment required.
          </p>
        </div>
      </div>
    </section>
  );
}
