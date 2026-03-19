import { AboutNavbar } from "../components/AboutNavbar";
import { Footer } from "../components/Footer";

export function TermsOfServicePage() {
  return (
    <>
      <AboutNavbar />
      <main className="min-h-screen bg-white pt-40 pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#1a56db] text-sm uppercase tracking-widest mb-3" style={{ fontWeight: 700 }}>Legal</p>
          <h1 className="text-black mb-2" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em" }}>
            Terms of Service
          </h1>
          <p className="text-gray-400 text-sm mb-10">Last updated: March 2026</p>

          <div className="space-y-8 text-gray-600" style={{ lineHeight: 1.8 }}>
            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>1. Acceptance of Terms</h2>
              <p>By accessing or using the Omega Bone Vocal Coaching website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
            </section>

            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>2. Services</h2>
              <p>We offer vocal coaching, workshops, and related educational content. All sessions are subject to availability and must be booked in advance. We reserve the right to cancel or reschedule sessions with reasonable notice.</p>
            </section>

            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>3. Payments & Refunds</h2>
              <p>Payment terms are outlined at the time of booking. Refunds are assessed on a case-by-case basis. Please contact us at least 48 hours before a session to discuss rescheduling or cancellation.</p>
            </section>

            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>4. Intellectual Property</h2>
              <p>All content on this website, including text, images, videos, and course materials, is the property of Omega Bone Vocal Coaching and may not be reproduced or distributed without prior written consent.</p>
            </section>

            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>5. Limitation of Liability</h2>
              <p>We make no guarantees of specific vocal improvements or outcomes. Results vary by individual. Omega Bone Vocal Coaching shall not be liable for any indirect or consequential damages arising from use of our services.</p>
            </section>

            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>6. Governing Law</h2>
              <p>These terms are governed by the laws of the jurisdiction in which Omega Bone Vocal Coaching operates. Disputes shall be resolved in the appropriate courts of that jurisdiction.</p>
            </section>

            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>7. Contact</h2>
              <p>Questions about these terms? Email us at <a href="mailto:singer@omegabone.com" className="text-[#1a56db] underline">singer@omegabone.com</a>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}