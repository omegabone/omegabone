import { useState } from "react";
import { ArrowRight, CheckCircle, Mail, MessageSquare } from "lucide-react";
import { AboutNavbar } from "../components/AboutNavbar";
import { Footer } from "../components/Footer";
import omegaPhoto from "figma:asset/cefc03b51ff0f74449c11ed438e006c7c6c8e515.png";

type FormState = "idle" | "submitting" | "success";

export function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<FormState>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    // Sign up free at formspree.io, create a form pointed at singer@omegabone.com,
    // then replace YOUR_FORM_ID below with the ID from your form's endpoint.
    const FORMSPREE_ID = "xqeyerov";

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("idle");
        alert("Something went wrong. Please try again or email singer@omegabone.com directly.");
      }
    } catch {
      setStatus("idle");
      alert("Something went wrong. Please try again or email singer@omegabone.com directly.");
    }
  };

  return (
    <>
      <AboutNavbar />
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <section className="bg-[#f7f9ff] pt-44 pb-20 px-6">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12">

            {/* Text — left */}
            <div className="flex-1 text-center lg:text-left">
              <p className="text-[#1a56db] text-sm uppercase tracking-widest mb-4" style={{ fontWeight: 700 }}>
                Get in Touch
              </p>
              <h1
                className="text-black mb-5"
                style={{ fontSize: "clamp(2.2rem, 5vw, 3.2rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em" }}
              >
                Your voice has potential.
                <br />
                <span className="text-[#1a56db]">Let's unlock it together.</span>
              </h1>
              <p className="text-gray-600 text-lg max-w-xl mx-auto lg:mx-0" style={{ lineHeight: 1.7 }}>Whether you're enquiring about private sessions, group workshops, corporate programmes, or anything else, send a message and Omega will get back to you personally.</p>
            </div>

            {/* Photo — right, self-centered */}
            <div className="shrink-0 flex items-center justify-center self-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-[#1a56db]/20 blur-2xl scale-105" />
                <img
                  src={omegaPhoto}
                  alt="Omega Bone"
                  className="relative w-64 h-80 object-contain bg-white rounded-3xl shadow-2xl ring-4 ring-white"
                />
              </div>
            </div>

          </div>
        </section>

        {/* Contact layout */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-14">

            {/* Left — info */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-black mb-4" style={{ fontSize: "1.3rem", fontWeight: 800 }}>
                  What can we help with?
                </h2>
                <ul className="space-y-3">
                  {[
                    "1-on-1 private vocal sessions",
                    "Group workshops (adults & children)",
                    "Corporate voice & presence training",
                    "Music Room 33 children's programmes",
                    "Learn 2 Sing online coaching",
                    "Learn to Communicate coaching",
                    "Media, press & speaking enquiries",
                    "Anything else on your mind",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-gray-600 text-sm">
                      <CheckCircle size={14} className="text-[#1a56db] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <a
                  href="mailto:singer@omegabone.com"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#1a56db] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] text-[#1a56db] flex items-center justify-center shrink-0">
                    <Mail size={16} />
                  </div>
                  singer@omegabone.com
                </a>
                <a
                  href="https://wa.me/13239614050"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#1a56db] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] text-[#1a56db] flex items-center justify-center shrink-0">
                    <MessageSquare size={16} />
                  </div>
                  +1 (323) 961-4050
                </a>
              </div>

              {/* Photo + assurance card */}
              
              
            </div>

            {/* Right — form */}
            <div className="lg:col-span-3">
              {status === "success" ? (
                <div className="bg-[#f7f9ff] rounded-3xl p-12 text-center border border-[#dae6fd]">
                  <div className="w-16 h-16 rounded-full bg-[#e8f0fe] text-[#1a56db] flex items-center justify-center mx-auto mb-5">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-black mb-3" style={{ fontSize: "1.4rem", fontWeight: 800 }}>
                    Message received.
                  </h3>
                  <p className="text-gray-600" style={{ lineHeight: 1.7 }}>
                    Omega will read your message personally and get back to you within 24 hours. Talk soon.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8 md:p-10 space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-black text-sm mb-1.5" style={{ fontWeight: 600 }}>
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Jane Smith"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-black placeholder-gray-400 text-sm outline-none focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/10 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-black text-sm mb-1.5" style={{ fontWeight: 600 }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="jane@email.com"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-black placeholder-gray-400 text-sm outline-none focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/10 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-black text-sm mb-1.5" style={{ fontWeight: 600 }}>
                      How can I help?
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/10 transition-all bg-white text-black"
                    >
                      <option value="" disabled>Select a topic…</option>
                      <option>Private Sessions</option>
                      <option>Group Workshops</option>
                      <option>Corporate Workshops</option>
                      <option>Music Room 33 - Children's Programme</option>
                      <option>Learn 2 Sing</option>
                      <option>Learn to Communicate</option>
                      <option>Media / Press / Speaking</option>
                      <option>Something Else</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-black text-sm mb-1.5" style={{ fontWeight: 600 }}>
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell Omega a bit about yourself and what you're looking for…"
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-black placeholder-gray-400 text-sm outline-none focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/10 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full bg-[#1a56db] text-white py-4 rounded-full flex items-center justify-center gap-2 hover:bg-[#1649c0] transition-colors group disabled:opacity-60"
                    style={{ fontWeight: 700 }}
                  >
                    {status === "submitting" ? "Sending…" : "Send My Message"}
                    {status !== "submitting" && (
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    )}
                  </button>

                  <p className="text-gray-400 text-xs text-center">
                    Your details are never shared or sold. Ever.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}