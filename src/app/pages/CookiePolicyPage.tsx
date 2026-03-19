import { AboutNavbar } from "../components/AboutNavbar";
import { Footer } from "../components/Footer";

export function CookiePolicyPage() {
  return (
    <>
      <AboutNavbar />
      <main className="min-h-screen bg-white pt-40 pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#1a56db] text-sm uppercase tracking-widest mb-3" style={{ fontWeight: 700 }}>Legal</p>
          <h1 className="text-black mb-2" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em" }}>
            Cookie Policy
          </h1>
          <p className="text-gray-400 text-sm mb-10">Last updated: March 2026</p>

          <div className="space-y-8 text-gray-600" style={{ lineHeight: 1.8 }}>
            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>1. What Are Cookies?</h2>
              <p>Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and improve your browsing experience.</p>
            </section>

            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>2. How We Use Cookies</h2>
              <p>We use cookies to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Keep you logged in during your session</li>
                <li>Understand how visitors use our website (analytics)</li>
                <li>Remember your preferences and settings</li>
                <li>Improve website performance and functionality</li>
              </ul>
            </section>

            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>3. Types of Cookies We Use</h2>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li><strong className="text-black">Essential cookies</strong>: required for the website to function correctly</li>
                <li><strong className="text-black">Analytics cookies</strong>: help us understand visitor behaviour (e.g., Google Analytics)</li>
                <li><strong className="text-black">Preference cookies</strong>: remember your settings and choices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>4. Managing Cookies</h2>
              <p>You can control or disable cookies through your browser settings at any time. Note that disabling certain cookies may affect the functionality of our website.</p>
            </section>

            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>5. Third-Party Cookies</h2>
              <p>Some third-party services we use (such as analytics or embedded content providers) may also place cookies on your device. We do not control these cookies, so please refer to the respective third-party privacy policies.</p>
            </section>

            <section>
              <h2 className="text-black mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>6. Contact</h2>
              <p>Questions about our use of cookies? Email us at <a href="mailto:singer@omegabone.com" className="text-[#1a56db] underline">singer@omegabone.com</a>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}