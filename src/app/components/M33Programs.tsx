import { ArrowRight, Star, Mic, Trophy, Sparkles, Gift, CheckCircle, Users, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const bonusColor = "#1a56db";

const programs = [
  {
    icon: <Mic size={28} />,
    tag: "Start Here",
    tagColor: "bg-[#e8f0fe] text-[#1a56db]",
    title: "The 30-Day Voice Foundation",
    subtitle: "30-Day Programme · 6 Private Sessions",
    highlight: false,
    description:
      "The college admissions office doesn't just want grades. They want a story. This is where it starts. Six sessions with an IB-trained, internationally certified vocal coach, building a serious, documentable performing arts skill from the very first lesson.",
    features: [
      "6 private 30-minute sessions with Omega, IB-school trained and internationally certified",
      "The Complete Song Breakdown System adapted for your child's level and learning style",
      "1 fully mastered performance-ready song",
      "Vocal technique, diction, breathing, and expressive storytelling",
    ],
    bonuses: [
      {
        label: "BONUS #1",
        title: "The Between-Lesson Momentum Kit",
        desc: "The exact 5-minute daily protocol your child runs between sessions. Students who use this arrive to each lesson 3 steps ahead of where they left off. No piano, no theory, no setup. Just compound progress.",
      },
      {
        label: "BONUS #2",
        title: "The Parent Confidence Script",
        desc: "Word-for-word guidance on what to say and never say after every lesson to multiply your child's motivation. Most parents accidentally kill practice momentum with one wrong sentence. This eliminates that.",
      },
      {
        label: "BONUS #3",
        title: "WhatsApp Progress Check-Ins",
        desc: "Between lessons, Omega reviews a quick voice note to maintain momentum and reinforce the habits that build lasting confidence.",
      },
    ],
    cta: "Book a Free 30-Min Consultation",
    urgency: null,
  },
  {
    icon: <Trophy size={28} />,
    tag: "Most Requested",
    tagColor: "bg-[#e8f0fe] text-[#1a56db]",
    title: "The College Audition Stage",
    subtitle: "90-Day College Portfolio Concert Program · 24 Sessions",
    highlight: true,
    description:
      "When every other applicant lists piano lessons, your child will have a professionally documented live concert performance and a produced portfolio. That's not a hobby. That's a portfolio.",
    features: [
      "24 private 30-minute sessions with Omega over 3 months",
      "6 songs mastered to performance level using the full vocal system",
      "Month 3: stage presence, physical movement, and professional performer coaching",
      "Omega's Concert Production Blueprint: venue, program, invitations, staging",
      "A real live concert performance your child can list, describe, and submit as evidence of sustained artistic achievement",
    ],
    bonuses: [
      {
        label: "BONUS #1",
        title: "The University Submission Portfolio Pack",
        desc: "A fully formatted, ready-to-submit collection: professional recordings, concert footage, and a written achievement record built to the exact standard expected by university admissions offices and conservatory panels. You don't hire a consultant to build this. It's done.",
      },
      {
        label: "BONUS #2",
        title: "College Application Differentiator Guide",
        desc: "How to present your child's vocal and performance journey as a leadership and character asset in applications to top universities. Written specifically for competitive admissions.",
      },
      {
        label: "OPTIONAL ADD-ON",
        title: "The College Application Portfolio",
        desc: "6 professionally recorded and produced songs, studio-quality mix and master, delivered as digital and physical copies. A rare, tangible differentiator submitted as supplementary media with applications to top universities.",
      },
      {
        label: "BONUS #3",
        title: "WhatsApp Progress Check-Ins",
        desc: "Between lessons, Omega reviews a quick voice note to maintain momentum and reinforce the habits that build lasting confidence.",
      },
    ],
    cta: "Book a Free 30-Min Consultation",
    urgency: "Limited to 6 families per semester",
  },
  {
    icon: <Star size={28} />,
    tag: "Maximum Results",
    tagColor: "bg-black text-white",
    title: "The Original Artist Portfolio",
    subtitle: "3.5-Month Programme · Write, Perform & Record",
    highlight: false,
    description:
      "Top universities aren't looking for students who took lessons. They're looking for students who created something. Here is a 3.5-month path to an original recorded portfolio your child wrote themselves.",
    features: [
      "Foundation vocal training using the Complete Song Breakdown System",
      "6 private songwriting sessions, Omega guides your child through writing 6 original songs",
      "12 performance sessions progressively building stage confidence and vocal authority",
      "A full professional recording day: 6 songs, 6 hours, fully produced by Omega",
      "Sent to a professional studio for final mix and master",
      "Delivered as a complete original portfolio, a creative artifact that belongs entirely to your child",
    ],
    bonuses: [
      {
        label: "BONUS #1",
        title: "The Emotional Performance Unlock",
        desc: "The technique that stops students from performing correctly and starts them performing truthfully. One session. Changes everything. The shift that takes a voice from technically sound to impossible to ignore.",
      },
      {
        label: "BONUS #2",
        title: "The Songwriter's Confidence Blueprint",
        desc: "A step-by-step system for writing original songs that actually sound finished. Eliminates the fear every first-time songwriter has: what if my songs aren't good enough? They will be. This makes sure of it.",
      },
      {
        label: "BONUS #3",
        title: "College Application Differentiator Guide",
        desc: "How to position your child's original portfolio as a leadership and creative achievement asset in university applications. Most students submit grades. Yours submits proof of sustained creative excellence.",
      },
      {
        label: "BONUS #4",
        title: "WhatsApp Progress Check-Ins",
        desc: "Between lessons, Omega reviews a quick voice note to maintain momentum and reinforce the habits that build lasting confidence.",
      },
    ],
    cta: "Book a Free 30-Min Consultation",
    urgency: "Only 4 spots open per month",
  },
];

function ProgramCard({ program, index }: { program: typeof programs[0]; index: number }) {
  const [bonusOpen, setBonusOpen] = useState(false);

  return (
    <div
      className={`relative rounded-3xl flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        program.highlight
          ? "bg-[#1a56db] text-white shadow-2xl shadow-[#1a56db]/40 scale-[1.03] z-10 mt-8 md:mt-0"
          : "bg-white border border-gray-100 shadow-md"
      }`}
    >
      {/* Top accent bar */}
      {program.highlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs px-5 py-1.5 rounded-full whitespace-nowrap" style={{ fontWeight: 800, letterSpacing: "0.04em" }}>
          ★ MOST REQUESTED
        </div>
      )}

      <div className="p-8 flex flex-col flex-1">
        {/* Tag */}
        <span
          className={`inline-block text-xs px-3 py-1 rounded-full mb-6 w-fit ${
            program.highlight ? "bg-white/20 text-white" : program.tagColor
          }`}
          style={{ fontWeight: 700 }}
        >
          {program.highlight ? "Popular" : program.tag}
        </span>

        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
            program.highlight ? "bg-white/20 text-white" : "bg-[#e8f0fe] text-[#1a56db]"
          }`}
        >
          {program.icon}
        </div>

        {/* Title */}
        <h3
          className={`mb-1 ${program.highlight ? "text-white" : "text-black"}`}
          style={{ fontSize: "1.25rem", fontWeight: 800 }}
        >
          {program.title}
        </h3>
        <p
          className={`text-sm mb-4 ${program.highlight ? "text-blue-200" : "text-[#1a56db]"}`}
          style={{ fontWeight: 600 }}
        >
          {program.subtitle}
        </p>

        {/* Description */}
        <p
          className={`text-sm mb-6 ${program.highlight ? "text-blue-100" : "text-gray-600"}`}
          style={{ lineHeight: 1.7 }}
        >
          {program.description}
        </p>

        {/* Features */}
        <ul className="space-y-2.5 mb-6">
          {program.features.map((f, fi) => (
            <li key={fi} className="flex items-start gap-2.5 text-sm">
              <CheckCircle
                size={15}
                className={`shrink-0 mt-0.5 ${program.highlight ? "text-yellow-300" : "text-[#1a56db]"}`}
              />
              <span className={program.highlight ? "text-blue-100" : "text-gray-700"}>{f}</span>
            </li>
          ))}
        </ul>

        {/* Bonuses toggle */}
        <button
          onClick={() => setBonusOpen(!bonusOpen)}
          className={`flex items-center justify-between w-full text-sm px-4 py-3 rounded-2xl mb-4 transition-colors ${
            program.highlight
              ? "bg-white/15 text-white hover:bg-white/25"
              : "bg-[#e8f0fe] text-[#1a56db] hover:bg-[#dae6fd]"
          }`}
          style={{ fontWeight: 700 }}
        >
          <span className="flex items-center gap-2">
            <Gift size={14} />
            {program.bonuses.filter(b => b.label !== "OPTIONAL ADD-ON").length} Exclusive Bonuses Included
          </span>
          {bonusOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {bonusOpen && (
          <div className="space-y-3 mb-6">
            {program.bonuses.map((b, bi) => {
              const isOptional = b.label === "OPTIONAL ADD-ON";
              return (
              <div
                key={bi}
                className={`rounded-2xl p-4 ${
                  isOptional
                    ? "bg-amber-50 border border-amber-200"
                    : program.highlight ? "bg-white/10" : "bg-[#f7f9ff] border border-[#dae6fd]"
                }`}
              >
                <p
                  className={`text-xs mb-0.5 ${isOptional ? "text-amber-600" : program.highlight ? "text-yellow-300" : "text-[#1a56db]"}`}
                  style={{ fontWeight: 800, letterSpacing: "0.06em" }}
                >
                  {b.label}
                </p>
                <p
                  className={`text-sm mb-1 ${isOptional ? "text-amber-900" : program.highlight ? "text-white" : "text-black"}`}
                  style={{ fontWeight: 700 }}
                >
                  {b.title}
                </p>
                <p
                  className={`text-xs ${isOptional ? "text-amber-700" : program.highlight ? "text-blue-200" : "text-gray-500"}`}
                  style={{ lineHeight: 1.6 }}
                >
                  {b.desc}
                </p>
              </div>
              );
            })}
          </div>
        )}

        {/* Urgency */}
        {program.urgency && (
          <p
            className={`text-xs text-center mb-4 ${program.highlight ? "text-yellow-300" : "text-orange-500"}`}
            style={{ fontWeight: 700 }}
          >
            ⚡ {program.urgency}
          </p>
        )}

        {/* CTA */}
        <a
          href="https://calendar.app.google/Y83p7Rf5idJkdzKc6"
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-auto w-full py-3.5 rounded-full text-sm flex items-center justify-center gap-2 group transition-all ${
            program.highlight
              ? "bg-white text-[#1a56db] hover:bg-yellow-50"
              : "bg-[#1a56db] text-white hover:bg-[#1649c0]"
          }`}
          style={{ fontWeight: 700 }}
        >
          {program.cta}
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
}

export function M33Programs() {
  return (
    <section id="programs" className="py-28 bg-[#f7f9ff]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-[#e8f0fe] text-[#1a56db] text-xs px-4 py-2 rounded-full mb-5" style={{ fontWeight: 700, letterSpacing: "0.06em" }}>
            <Sparkles size={13} /> MUSIC ROOM 33 · CHILDREN'S VOCAL PROGRAMMES
          </div>
          <h2
            className="text-black mb-5"
            style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.03em" }}
          >
            The children who speak up
            <br />
            <span className="text-[#1a56db]">get chosen first.</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto" style={{ lineHeight: 1.7 }}>
            Every programme below is designed for one outcome: a child who performs with the kind of confidence most adults spend decades trying to find. Choose the level that fits where your child is today.
          </p>
        </div>

        {/* Program Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-20">
          {programs.map((program, i) => (
            <ProgramCard key={i} program={program} index={i} />
          ))}
        </div>

        {/* Downsell — Group Workshop */}
        

      </div>
    </section>
  );
}