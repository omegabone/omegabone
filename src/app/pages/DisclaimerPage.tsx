import { AboutNavbar } from "../components/AboutNavbar";
import { Footer } from "../components/Footer";

export function DisclaimerPage() {
  return (
    <>
      <AboutNavbar />
      <main className="min-h-screen bg-white pt-40 pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#1a56db] text-sm uppercase tracking-widest mb-3" style={{ fontWeight: 700 }}>Legal</p>
          <h1 className="text-black mb-2" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em" }}>
            Disclaimer
          </h1>
          <p className="text-gray-400 text-sm mb-10">Last updated: March 2026</p>

          <div className="space-y-8 text-gray-600" style={{ lineHeight: 1.8 }}>
            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>1. No Guarantee of Results</h2>
              <p>The information and coaching services provided by Omega Bone Vocal Coaching are for educational purposes only. Individual results will vary. We make no guarantee of specific vocal improvements, career outcomes, or any other results.</p>
            </section>

            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>2. Testimonials</h2>
              <p>Testimonials featured on this website reflect the personal experiences of individual students and are not representative of typical results. They are provided for illustrative purposes only.</p>
            </section>

            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>3. Professional Advice</h2>
              <p>Nothing on this website constitutes medical, therapeutic, or professional health advice. If you have concerns about your voice, throat, or respiratory health, please consult a qualified medical professional before beginning vocal training.</p>
            </section>

            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>4. External Links</h2>
              <p>Our website may contain links to third-party websites. We are not responsible for the content, accuracy, or privacy practices of those sites. Links are provided for convenience only.</p>
            </section>

            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>5. Accuracy of Information</h2>
              <p>While we strive to keep all content accurate and up to date, we make no warranties regarding the completeness or reliability of any information on this website. Content is subject to change without notice.</p>
            </section>

            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>6. Contact</h2>
              <p>Questions about this disclaimer? Email us at <a href="mailto:singer@omegabone.com" className="text-[#1a56db] underline">singer@omegabone.com</a>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}