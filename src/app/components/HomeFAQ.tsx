const faqs = [
  {
    q: "What age do you work with?",
    a: "Music Room 33 programmes are designed for children aged 5–16. The approach is adapted to each child's developmental stage: a 6-year-old and a 14-year-old get very different sessions.",
  },
  {
    q: "Does my child need prior experience?",
    a: "Not at all. The Voice Assessment is specifically designed to meet your child where they are, complete beginner to already performing. We start from their reality, not a template.",
  },
  {
    q: "How are sessions delivered?",
    a: "All sessions are conducted online via video call, making it easy to fit into your family's schedule without travel time. Recordings are sent to parents same-day.",
  },
  {
    q: "What if my child is shy?",
    a: "Shy children are Omega's speciality. The first session is designed to be pressure-free and playful. Most shy children open up within 15 minutes, sometimes to the surprise of their own parents.",
  },
  {
    q: "How quickly will we see results?",
    a: "Most parents notice a shift in confidence within the first 2–3 sessions. Measurable vocal improvement typically shows by the end of the first month.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border-b border-gray-100 last:border-0">
      <summary className="flex items-center justify-between py-5 cursor-pointer list-none gap-4">
        <span className="text-black" style={{ fontWeight: 700, fontSize: "1rem" }}>{q}</span>
        <span className="w-6 h-6 shrink-0 rounded-full bg-[#e8f0fe] text-[#1a56db] flex items-center justify-center text-sm transition-transform group-open:rotate-45" style={{ fontWeight: 700 }}>+</span>
      </summary>
      <p className="text-gray-600 pb-5 pr-10" style={{ lineHeight: 1.8, fontSize: "0.95rem" }}>{a}</p>
    </details>
  );
}

export function HomeFAQ() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-[#1a56db] text-sm mb-3 uppercase tracking-widest" style={{ fontWeight: 700 }}>Common Questions</p>
          <h2 className="text-black" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
            Everything you need to know.
          </h2>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-6 sm:px-8 divide-y divide-gray-100">
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}