import { ArrowRight, Star, Mic, Trophy, Sparkles, Gift, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const programs = [
  {
    icon: <Mic size={28} />,
    tag: "Start Here",
    tagColor: "bg-[#e8f0fe] text-[#1a56db]",
    title: "The Prodigy Foundation",
    subtitle: "30-Day Programme · 6 Private Sessions",
    highlight: false,
    description:
      "The college admissions office doesn't just want grades. They want a story. This is where it starts. Six sessions with an IB-trained, internationally certified vocal coach, building a serious, documentable performing arts skill from the very first lesson.",
    features: [
      "6 private 30-minute sessions with Omega, IB-school trained and internationally certified",
      "The Complete Song Breakdown System adapted for your child's level and learning style",
      "1 fully mastered performance-ready song",
      "Vocal technique, diction, breathing, and expressive storytelling",
      "Written progress notes documenting skill development, useful for portfolios",
    ],
    bonuses: [
      {
        label: "BONUS #1",
        title: "\"From Quiet to Confident\" Parent Playbook",
        desc: "What to say and not say at home to build your child's expressive confidence every day, not just during lessons.",
      },
      {
        label: "BONUS #2",
        title: "3 Custom Daily Vocal Exercises",
        desc: "Designed specifically for your child's voice and learning profile. A daily 5-minute routine that builds visible momentum from week one.",
      },
    ],
    cta: "Book a Free 30-Min Vocal Analysis",
    urgency: null,
  },
  {
    icon: <Trophy size={28} />,
    tag: "Most Requested",
    tagColor: "bg-[#e8f0fe] text-[#1a56db]",
    title: "The Prodigy Stage",
    subtitle: "90-Day College Portfolio Concert Program · 24 Sessions",
    highlight: true,
    description:
      "When every other applicant lists piano lessons, your child will have a professionally documented live concert performance and a produced album. That's not a hobby. That's a portfolio.",
    features: [
      "24 private 30-minute sessions with Omega over 3 months",
      "4 songs mastered to performance level using the full vocal system",
      "Month 3: stage presence, physical movement, and professional performer coaching",
      "Omega's Concert Production Blueprint: venue, program, invitations, staging",
      "A real live concert performance your child can list, describe, and submit as evidence of sustained artistic achievement",
    ],
    bonuses: [
      {
        label: "BONUS #1",
        title: "Vocal Portfolio Package",
        desc: "A curated collection of professional performance recordings, concert footage, and a written progress record, ready to submit to university applications, scholarship panels, and conservatory auditions.",
      },
      {
        label: "BONUS #2",
        title: "College Application Differentiator Guide",
        desc: "How to present your child's vocal and performance journey as a leadership and character asset in applications to top universities. Written specifically for competitive admissions.",
      },
      {
        label: "OPTIONAL UPSELL",
        title: "The College Application Album",
        desc: "4 professionally recorded and produced songs, studio-quality mix and master, delivered as digital and physical copies. A rare, tangible differentiator submitted as supplementary media with applications to top universities.",
      },
    ],
    cta: "Book a Free 30-Min Vocal Analysis",
    urgency: "Limited to 6 families per semester",
  },
  {
    icon: <Star size={28} />,
    tag: "Maximum Results",
    tagColor: "bg-black text-white",
    title: "The Prodigy Album",
    subtitle: "3.5-Month Programme · Write, Perform & Record",
    highlight: false,
    description:
      "Top universities aren't looking for students who took lessons. They're looking for students who created something. Here is a 3.5-month path to an original recorded album your child wrote themselves.",
    features: [
      "Foundation vocal training in weeks 1 and 2",
      "6 private songwriting sessions, Omega guides your child through writing 6 original songs",
      "12 performance sessions progressively building stage confidence and vocal authority",
      "A full professional recording day: 6 songs, 6 hours, fully produced by Omega",
      "Sent to a professional studio for final mix and master",
      "Delivered as a complete original album, a creative artifact that belongs entirely to your child",
    ],
    bonuses: [
      {
        label: "BONUS #1",
        title: "\"Sing With Emotion\" Framework",
        desc: "How to stop holding back and let real feeling into the notes. The shift that makes a voice go from technically correct to genuinely impossible to ignore on stage and on the page.",
      },
      {
        label: "BONUS #2",
        title: "College Application Impact Brief",
        desc: "A formatted document presenting the album as evidence of original creative work across writing, composition, and performance, ready to submit as a music supplement to any university application.",
      },
    ],
    cta: "Book a Free 30-Min Vocal Analysis",
    urgency: "Only 4 spots open per month",
  },
];

function ProgramCard({ program, index }: { program: typeof programs[0]; index: number }) {
  const [bonusOpen, setBonusOpen] = useState(false);

  return (
    <div
      className={`relative rounded-3xl flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        program.highlight
          ? "bg-[#1a56db] text-white shadow-2xl shadow-[#1a56db]/40 md:scale-[1.03] z-10 mt-8 md:mt-0"
          : "bg-white border border-gray-100 shadow-md"
      }`}
    >
      {program.highlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs px-5 py-1.5 rounded-full whitespace-nowrap" style={{ fontWeight: 800, letterSpacing: "0.04em" }}>
          ★ MOST REQUESTED
        </div>
      )}

      <div className="p-8 flex flex-col flex-1">
        <span
          className={`inline-block text-xs px-3 py-1 rounded-full mb-6 w-fit ${
            program.highlight ? "bg-white/20 text-white" : program.tagColor
          }`}
          style={{ fontWeight: 700 }}
        >
          {program.highlight ? "Popular" : program.tag}
        </span>

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
            program.highlight ? "bg-white/20 text-white" : "bg-[#e8f0fe] text-[#1a56db]"
          }`}
        >
          {program.icon}
        </div>

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

        <p
          className={`text-sm mb-6 ${program.highlight ? "text-blue-100" : "text-gray-600"}`}
          style={{ lineHeight: 1.7 }}
        >
          {program.description}
        </p>

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
            {program.bonuses.length} Exclusive Bonuses Included
          </span>
          {bonusOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {bonusOpen && (
          <div className="space-y-3 mb-6">
            {program.bonuses.map((b, bi) => (
              <div
                key={bi}
                className={`rounded-2xl p-4 ${
                  program.highlight ? "bg-white/10" : "bg-[#f7f9ff] border border-[#dae6fd]"
                }`}
              >
                <p
                  className={`text-xs mb-0.5 ${program.highlight ? "text-yellow-300" : "text-[#1a56db]"}`}
                  style={{ fontWeight: 800, letterSpacing: "0.06em" }}
                >
                  {b.label}
                </p>
                <p
                  className={`text-sm mb-1 ${program.highlight ? "text-white" : "text-black"}`}
                  style={{ fontWeight: 700 }}
                >
                  {b.title}
                </p>
                <p
                  className={`text-xs ${program.highlight ? "text-blue-200" : "text-gray-500"}`}
                  style={{ lineHeight: 1.6 }}
                >
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {program.urgency && (
          <p
            className={`text-xs text-center mb-4 ${program.highlight ? "text-yellow-300" : "text-orange-500"}`}
            style={{ fontWeight: 700 }}
          >
            ⚡ {program.urgency}
          </p>
        )}

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

export function HomeM33Programs() {
  return (
    <section id="home-m33-programs" className="py-28 bg-[#f7f9ff]">
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