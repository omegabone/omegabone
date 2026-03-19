import { AboutNavbar } from "../components/AboutNavbar";
import { Footer } from "../components/Footer";

export function PrivacyPolicyPage() {
  return (
    <>
      <AboutNavbar />
      <main className="min-h-screen bg-white pt-40 pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#1a56db] text-sm uppercase tracking-widest mb-3" style={{ fontWeight: 700 }}>Legal</p>
          <h1 className="text-black mb-2" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em" }}>
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-sm mb-10">Last updated: March 2026</p>

          <div className="prose-custom space-y-8 text-gray-600" style={{ lineHeight: 1.8 }}>
            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>1. Who We Are</h2>
              <p>Omega Bone Vocal Coaching ("we", "us", "our") operates the website at omegabone.com. This Privacy Policy explains how we collect, use, and protect your personal information when you interact with our website or services.</p>
            </section>

            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>2. Information We Collect</h2>
              <p>We may collect the following information:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Name and email address when you contact us or sign up for our newsletter</li>
                <li>Information you voluntarily provide via contact or enquiry forms</li>
                <li>Usage data collected automatically via cookies and analytics tools</li>
              </ul>
            </section>

            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>3. How We Use Your Information</h2>
              <p>Your information is used to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Respond to your enquiries and provide our services</li>
                <li>Send newsletters or updates you have opted into</li>
                <li>Improve our website and user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>4. Data Sharing</h2>
              <p>We do not sell, trade, or rent your personal information to third parties. We may share data with trusted service providers (e.g., email platforms) solely to operate our services, under strict confidentiality agreements.</p>
            </section>

            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>5. Data Retention</h2>
              <p>We retain your personal data only for as long as necessary to fulfil the purposes outlined in this policy or as required by law.</p>
            </section>

            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>6. Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at <a href="mailto:singer@omegabone.com" className="text-[#1a56db] underline">singer@omegabone.com</a>.</p>
            </section>

            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>7. Contact</h2>
              <p>Questions about this policy? Email us at <a href="mailto:singer@omegabone.com" className="text-[#1a56db] underline">singer@omegabone.com</a>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}