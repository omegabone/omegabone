import image_13026caaaf590ac7061b93b7b4718ed646527428 from 'figma:asset/13026caaaf590ac7061b93b7b4718ed646527428.png'
import image_a9a652c3e0330bbb1c454e816f2acea11ab265d6 from 'figma:asset/a9a652c3e0330bbb1c454e816f2acea11ab265d6.png'
import image_eebcaaaf2403c872a7116fce442f39e116b7412d from 'figma:asset/eebcaaaf2403c872a7116fce442f39e116b7412d.png'

import image_5b140351674d35d73c4e6606adbfb46a982fa05d from 'figma:asset/5b140351674d35d73c4e6606adbfb46a982fa05d.png'
import { useState } from "react";
import {
  ArrowRight, Play, CheckCircle, Download, BookOpen,
  Headphones, Video, Star, Mic, Music, Guitar, Users,
  ChevronLeft, ChevronRight, Quote, Trophy, Gift, ChevronDown, ChevronUp, Sparkles,
} from "lucide-react";
import { L2CNavbar } from "../components/L2CNavbar";
import { Footer } from "../components/Footer";
import { LogoCarousel } from "../components/LogoCarousel";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ResourceDownloadModal } from "../components/ResourceDownloadModal";
import jacreamImg from "figma:asset/9a56e731aa7826852c6a808b767815b32665288b.png";
import amirahImg from "figma:asset/fced2b75511a20633c2209c9d6fe6e6a657aa5a1.png";
import richieImg from "figma:asset/b83f479654f431a8c7e6ebb892c9028ad17d4a2f.png";
import sreynannImg from "figma:asset/6d2db891878a87edbb32f0b61bcd05ea15237f3b.png";
import studentPhoto from "figma:asset/21f3eaee986f5854b456e4b5534adf6dce578a57.png";
import videoThumbImg from "figma:asset/d0e85cf59d269d1eae80bc43bb42139e08c63d3e.png";
import omegaImg from "figma:asset/a5c44fa231ece841b7c75f3487148d5d4d53f216.png";
import image_4de58a02f605261925990ba9260bdfdaefdad934 from "figma:asset/4de58a02f605261925990ba9260bdfdaefdad934.png";

import { l2sBlogPosts } from "../data/l2sBlogPosts";
import { useBlogspotFeed } from "../hooks/useBlogspotFeed";

/* ─────────────── HERO ─────────────── */
const heroImage = "https://images.unsplash.com/photo-1765278249103-3ae1cce4eb9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW5nZXIlMjBtaWNyb3Bob25lJTIwc3BvdGxpZ2h0JTIwc3RhZ2UlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NzE5NTYzNDl8MA&ixlib=rb-4.1.0&q=80&w=1080";

function L2SHero() {
  return (
    <section className="relative min-h-screen bg-white pt-24 overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#f0fdf4] hidden lg:block" style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" }} />
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[#166534]/5 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-56 h-56 rounded-full bg-[#166534]/8 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 min-h-[calc(100vh-5rem)] py-16">
          {/* Left */}
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#dcfce7] text-[#166534] px-4 py-2 rounded-full text-sm mb-6" style={{ fontWeight: 600 }}>
              <span className="w-2 h-2 rounded-full bg-[#166534] animate-pulse" />
              For Entrepreneurs, Coaches &amp; Content Creators
            </div>

            <h1 className="text-black mb-6" style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em" }}>You have a <span style={{ color: "#166534" }}>voice</span> worth hearing and a <span style={{ color: "#166534" }}>vision</span> worth sharing.</h1>

            <p className="text-gray-600 mb-8 text-lg" style={{ lineHeight: 1.7 }}>The only thing missing is the presence to make others feel it. Omega closes that gap in 90 days.</p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a
                href="https://calendar.app.google/Y83p7Rf5idJkdzKc6"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#166534] text-white px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-[#14532d] transition-all hover:shadow-lg hover:shadow-[#166534]/30 group"
                style={{ fontWeight: 700, fontSize: "1rem" }}
              >
                Book a Free 30-Min. Vocal Analysis
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <button className="flex items-center justify-center gap-3 text-black hover:text-[#166534] transition-colors group">
                
                
              </button>
            </div>

            <div className="flex items-center gap-6 pt-6 border-t border-gray-100">
              <div className="flex -space-x-3">
                {[
                  "https://images.unsplash.com/photo-1581741113761-103c67847edc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbGUlMjBlbnRyZXByZW5ldXIlMjBzdGFydHVwJTIwMzBzJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcyNDc1MDI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
                  "https://images.unsplash.com/photo-1631127875592-f71dac3fb582?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGZlbWFsZSUyMGVudHJlcHJlbmV1ciUyMHN0YXJ0dXAlMjAzMHMlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzI0NzUwMjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
                  "https://images.unsplash.com/photo-1660598352845-bcaf174ede59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMG1hbGUlMjBlbnRyZXByZW5ldXIlMjBwcm9mZXNzaW9uYWwlMjAzMHMlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzI0NzUwMjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
                  "https://images.unsplash.com/photo-1732677682906-bb6fb0582045?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZlbWFsZSUyMGVudHJlcHJlbmV1ciUyMHN0YXJ0dXAlMjAzMHMlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzI0NzUwMjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
                ].map((src, i) => (
                  <img key={i} src={src} alt="Student" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-sm mt-0.5"><span className="text-black" style={{ fontWeight: 700 }}>More than 7,400 students</span> trained worldwide</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden lg:flex flex-1 relative justify-center lg:justify-end">
            <div className="relative">
              <div className="w-full max-w-md lg:max-w-lg rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src={image_5b140351674d35d73c4e6606adbfb46a982fa05d}
                  alt="Musician student transformation"
                  className="w-full h-[300px] sm:h-[420px] lg:h-[520px] object-cover transition-transform group-hover:scale-105 duration-700"
                />
              </div>

              <div className="hidden lg:flex absolute -left-6 top-16 bg-white rounded-2xl shadow-xl px-5 py-4 items-center gap-3 border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#166534]">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-black text-sm" style={{ fontWeight: 700 }}>Built for Entrepreneurs</p>
                  <p className="text-gray-500 text-xs">People with something to say</p>
                </div>
              </div>

              <div className="hidden lg:block absolute -right-4 bottom-20 bg-[#166534] rounded-2xl shadow-xl px-5 py-4 text-white">
                <p className="text-3xl" style={{ fontWeight: 800 }}>90 Days</p>
                <p className="text-green-200 text-xs mt-0.5" style={{ fontWeight: 500 }}>To your first confident performance</p>
              </div>

              <div className="hidden lg:flex absolute -bottom-4 left-12 bg-white rounded-2xl shadow-xl px-5 py-3 items-center gap-3 border border-gray-100">
                <span className="text-2xl">🎤</span>
                <div>
                  <p className="text-black text-sm" style={{ fontWeight: 700 }}>7,400+ Students</p>
                  <p className="text-gray-500 text-xs">Improved their communication</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── STATS BAR ─────────────── */
function L2SStatsBar() {
  const stats = [
    { value: "90 Days", label: "To your first confident on-stage delivery" },
    { value: "25+", label: "Years of teaching experience" },
    { value: "98%", label: "Of clients report stronger executive presence" },
    { value: "7,400+", label: "Students who found their voice" },
  ];

  return (
    <section className="bg-[#166534] py-5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-white" style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                {stat.value}
              </p>
              <p className="text-green-200 text-sm mt-1" style={{ fontWeight: 500 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── ABOUT ─────────────── */
function L2SAbout() {
  const achievements = [
    "Trained alongside world-class performers; she knows what commanding presence looks like",
    "IB-certified vocal specialist who has coached entrepreneurs and speakers across 4 continents",
    "Professional vocalists who have performed with Michael Jackson and Prince",
    "Author of 'Learn 2 Sing', a vocal technique book",
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="hidden lg:flex flex-1 relative">
            <div className="relative max-w-md mx-auto">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src={omegaImg}
                  alt="Omega Bone, Vocal Coach"
                  className="w-full h-[580px] object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-[#dcfce7] rounded-3xl -z-10" />
              <div className="absolute -top-6 -right-6 w-36 h-36 bg-[#166534]/10 rounded-3xl -z-10" />
              <div className="absolute bottom-8 -right-8 bg-white rounded-2xl shadow-xl p-5 max-w-[210px] border border-gray-100 hidden sm:block">
                <p className="text-gray-600 text-sm italic" style={{ lineHeight: 1.6 }}>
                  "Your voice is your brand. When it commands attention, everything else gets easier."
                </p>
                <p className="text-[#166534] text-xs mt-2" style={{ fontWeight: 700 }}>Omega Bone</p>
              </div>
            </div>
          </div>

          <div className="flex-[2]">
            <p className="text-[#166534] text-sm mb-3 uppercase tracking-widest" style={{ fontWeight: 700 }}>
              For Entrepreneurs, Coaches &amp; Creators
            </p>
            <h2
              className="text-black mb-6"
              style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}
            >You have the ideas, the expertise, and the audience. Omega gives you the voice to communicate it.</h2>

            <p className="text-gray-600 mb-5" style={{ lineHeight: 1.8 }}>Here's what most communication coaches won't tell you: the difference between someone who <em>informs</em> and someone who <em>moves people</em> isn't what they say, it's how their voice carries it. Pitch, tone, breath, and presence are the invisible forces behind every great speaker, coach, and creator.</p>
            <p className="text-gray-600 mb-5" style={{ lineHeight: 1.8 }}>Omega's method isn't about singing for fun. It's about unlocking the full range of your voice so that when you speak on a podcast, lead a webinar, or pitch in a room, people lean in and they remember you.</p>
            <p className="text-gray-600 mb-8" style={{ lineHeight: 1.8 }}>In 90 days, you'll have a voice that matches the size of your vision, one that commands authority, builds trust, and makes your message impossible to ignore.</p>

            <ul className="space-y-3 mb-10">
              {achievements.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-[#166534] mt-0.5 shrink-0" />
                  <span className="text-gray-700 text-sm" style={{ lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>

            
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── PROGRAMS DATA ─────────────── */
const l2sPrograms = [
  {
    icon: <Mic size={28} />,
    tag: "Start Here",
    tagColor: "bg-[#dcfce7] text-[#166534]",
    title: "The 30-Day Founder Voice Intensive",
    subtitle: "30-Day Programme · 6 Private Sessions",
    highlight: false,
    description:
      "Song is the fastest way to unlock the voice you already have. In 30 days, you learn to breathe into your words, land your pauses, and carry real conviction in your tone. One coached song. One transformed voice. Skills that travel straight into your next pitch, podcast, or presentation.",
    features: [
      "1.5 hrs per week built around your schedule",
      "Song chosen by you as the training vehicle for breath, tone, and emotional delivery",
      "The Complete Song Breakdown System: breath control, diction, resonance, and dynamics",
      "Direct application exercises mapping each singing skill to speaking on camera or on stage",
    ],
    cta: "Book a Free 30-Min Vocal Analysis",
    urgency: null,
  },
  {
    icon: <Trophy size={28} />,
    tag: "Most Requested",
    tagColor: "bg-[#dcfce7] text-[#166534]",
    title: "The 90-Day Keynote Authority Blueprint",
    subtitle: "90-Day Programme · 60 Sessions + Live Performance",
    highlight: true,
    description:
      "Most communication training tells you what to say. This programme changes how your voice carries it. Over 90 days, song is your training ground. By the end, you perform live in front of a real audience and walk away with vocal authority that no workshop, course, or keynote training can replicate.",
    features: [
      "2.5 hrs per week (30 min daily), flexible depending on your schedule",
      "Detailed instruction practice guide after each session",
      "6 songs coached to performance level, each targeting a different communication skill",
      "Month 3 dedicated to physical presence, movement, and holding a room without effort",
      "Omega's full Concert Execution Blueprint so every logistical detail is handled for you",
      "A live performance in front of a real audience you choose: colleagues, clients, community",
    ],
    cta: "Book a Free 30-Min Vocal Analysis",
    urgency: "Limited to 3 clients per semester",
  },
];

/* ─────────────── PROGRAM CARD ─────────────── */
function L2SProgramCard({ program }: { program: typeof l2sPrograms[0] }) {
  return (
    <div
      className={`relative rounded-3xl flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        program.highlight
          ? "bg-[#166534] text-white shadow-2xl shadow-[#166534]/40 scale-[1.03] z-10 mt-8 md:mt-0"
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

        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${program.highlight ? "bg-white/20 text-white" : "bg-[#dcfce7] text-[#166534]"}`}>
          {program.icon}
        </div>

        <h3 className={`mb-1 ${program.highlight ? "text-white" : "text-black"}`} style={{ fontSize: "1.25rem", fontWeight: 800 }}>
          {program.title}
        </h3>
        <p className={`text-sm mb-4 ${program.highlight ? "text-green-200" : "text-[#166534]"}`} style={{ fontWeight: 600 }}>
          {program.subtitle}
        </p>

        <p className={`text-sm mb-6 ${program.highlight ? "text-green-100" : "text-gray-600"}`} style={{ lineHeight: 1.7 }}>
          {program.description}
        </p>

        <ul className="space-y-2.5 mb-6">
          {program.features.map((f, fi) => (
            <li key={fi} className="flex items-start gap-2.5 text-sm">
              <CheckCircle size={15} className={`shrink-0 mt-0.5 ${program.highlight ? "text-yellow-300" : "text-[#166534]"}`} />
              <span className={program.highlight ? "text-green-100" : "text-gray-700"}>{f}</span>
            </li>
          ))}
        </ul>

        {program.urgency && (
          <p className={`text-xs text-center mb-4 ${program.highlight ? "text-yellow-300" : "text-orange-500"}`} style={{ fontWeight: 700 }}>
            ⚡ {program.urgency}
          </p>
        )}

        <a
          href="https://calendar.app.google/Y83p7Rf5idJkdzKc6"
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-auto w-full py-3.5 rounded-full text-sm flex items-center justify-center gap-2 group transition-all ${
            program.highlight
              ? "bg-white text-[#166534] hover:bg-green-50"
              : "bg-[#166534] text-white hover:bg-[#14532d]"
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

function L2SPrograms() {
  return (
    <section id="programs" className="py-24 bg-[#f0fdf4]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-[#dcfce7] text-[#166534] text-xs px-4 py-2 rounded-full mb-5" style={{ fontWeight: 700, letterSpacing: "0.06em" }}>
            <Sparkles size={13} /> LEARN 2 SING · COMMUNICATION PROGRAMMES
          </div>
          <h2
            className="text-black mb-5"
            style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.03em" }}
          >
            Same message. Trained voice.
            <br />
            <span className="text-[#166534]">Completely different result.</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto" style={{ lineHeight: 1.7 }}>
            Every programme below is designed for one outcome: a voice that commands attention, builds trust, and makes your message impossible to ignore. Choose the level that fits where you are today.
          </p>
        </div>

        {/* Program Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-20">
          {l2sPrograms.map((program, i) => (
            <L2SProgramCard key={i} program={program} />
          ))}
        </div>

        {/* Downsell: Group Workshop */}
        <div className="bg-white rounded-3xl border border-[#bbf7d0] shadow-sm overflow-hidden">
          
        </div>
      </div>
    </section>
  );
}

/* ─────────────── VIDEO SECTION ─────────────── */
function L2SVideoSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 max-w-lg">
            <p className="text-[#166534] text-sm mb-3 uppercase tracking-widest" style={{ fontWeight: 700 }}>
              The Results Speak
            </p>
            <h2
              className="text-black mb-6"
              style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}
            >Entrepreneurs who train their voice don't just speak better, they lead rooms</h2>
            <p className="text-gray-600 mb-8" style={{ lineHeight: 1.8 }}>Watch coaches, creators, and founders go from hesitant speakers to voices that command instant attention. The moment a client says "you sound completely different", that's exactly what Omega trains you for. It happens faster than you think.</p>

            <div className="grid grid-cols-2 gap-5 mb-10">
              {[
                { number: "21 days", desc: "Average time to notice a measurable shift in vocal confidence and presence" },
                { number: "94%", desc: "Report their audiences, clients, or teams respond more positively after training" },
                { number: "3×", desc: "Average increase in audience engagement reported by content creators after 60 days" },
                { number: "90 days", desc: "From first lesson to a voice that owns every room, stage, or screen" },
              ].map((item, i) => (
                <div key={i} className="bg-[#f0fdf4] rounded-2xl p-5 border border-green-50">
                  <p className="text-[#166534] mb-1" style={{ fontSize: "1.6rem", fontWeight: 800 }}>{item.number}</p>
                  <p className="text-gray-600 text-sm" style={{ lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              ))}
            </div>

            
          </div>

          <div className="flex-1 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer group" onClick={() => setPlaying(true)}>
              <img
                src={videoThumbImg}
                alt="Student performing on stage"
                className="w-full h-[420px] object-cover transition-transform group-hover:scale-105 duration-700"
              />
              {!playing && (
                <>
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play size={28} fill="#166534" className="text-[#166534] ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white text-sm" style={{ fontWeight: 600 }}>🎙️ "I finally learned how to express myself. People actually feel what I'm saying now."</p>
                  </div>
                </>
              )}
              {playing && (
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/cgKQi6yW5w4?autoplay=1&start=1402"
                    title="Student transformation"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-[#dcfce7] rounded-3xl -z-10" />
            <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full border-4 border-[#166534]/20 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── TESTIMONIALS ─────────────── */
const testimonials = [
  {
    name: "Marcus Webb",
    role: "Business Coach & Keynote Speaker",
    avatar: "https://images.unsplash.com/photo-1758599543154-76ec1c4257df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwZW50cmVwcmVuZXVyJTIwY29uZmlkZW50JTIwaGVhZHNob3QlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzI0Nzk4OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    text: "I've been on stages speaking to hundreds of people for years, but I always felt like my voice was working against me: thin, strained, forgettable. Three months with Omega changed everything.\n\nNow when I deliver a keynote, people stop scrolling. I had a client tell me after a workshop: 'I don't know what you did, but you sound like you actually believe every word.' That's exactly what vocal coaching unlocked. My message didn't change. The way it landed did.",
    stars: 5,
  },
  {
    name: "Priya Anand",
    role: "Online Course Creator  40K+ Students",
    avatar: "https://images.unsplash.com/photo-1758600436770-821223436cdc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBvbmxpbmUlMjBjb2FjaCUyMHNtaWxpbmclMjBwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzI0Nzk4OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    text: "I was getting great feedback on my course content but my video completion rates were terrible. Students were dropping off in the first five minutes. I knew the problem: I sounded like I was reading from a script.\n\nOmega didn't just teach me to sing. She taught me to breathe into my words, to pause with intention, to let emotion carry meaning. My latest course launch had a 78% completion rate. The content is the same. My voice is completely different.",
    stars: 5,
  },
  {
    name: "DeShawn Carter",
    role: "Startup Founder & Angel Pitch Coach",
    avatar: "https://images.unsplash.com/photo-1613695357101-af6c898bb2aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMG1hbGUlMjBzdGFydHVwJTIwZm91bmRlciUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjQ3OTg5MXww&ixlib=rb-4.1.0&q=80&w=1080",
    text: "I was pitching investors with a deck that was solid and a voice that was not. I'd feel my throat tighten, my pace speed up, and all the work I put into the idea would get lost in the delivery.\n\nWhat Omega teaches isn't really about music; it's about control. Breath control. Emotional control. Presence under pressure. My last pitch round, three out of four investors commented on how compelling my delivery was. We closed the round. I credit the coaching.",
    stars: 5,
  },
  {
    name: "Lena Hoffmann",
    role: "Brand Strategist & Content Creator",
    avatar: "https://images.unsplash.com/photo-1687575635557-a3f3ed535b56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBjb250ZW50JTIwY3JlYXRvciUyMHN0dWRpbyUyMGhlYWRzaG90fGVufDF8fHx8MTc3MjQ3OTg5Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    text: "I had a message I believed in deeply but every time I recorded a reel or a podcast episode, something felt off. Flat. Like the version of me that showed up on camera was a watered-down copy of the one who had the idea.\n\nOmega helped me find the resonance. That's the only word for it. My voice started carrying my actual conviction instead of hiding it. Within six weeks of working with her, my Instagram saves doubled and a podcast host reached out to interview me. I wasn't doing anything different, except sounding like I meant it.",
    stars: 5,
  },
  {
    name: "Kenji Mori",
    role: "Leadership Coach & Corporate Trainer",
    avatar: "https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbGUlMjBidXNpbmVzcyUyMGNvYWNoJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcyNDc5ODkyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    text: "My clients lead teams of 50 to 500 people. I teach communication for a living. And yet, after my first session with Omega, I realised I had been communicating at maybe 60% of my potential: tight jaw, shallow breath, no real command in my tone.\n\nThe singing exercises felt strange at first for a leadership trainer. But within a month I noticed my clients leaning forward in their chairs. My voice had weight behind it. One CEO told me: 'When you speak, people listen differently.' That's the transformation Omega delivers.",
    stars: 5,
  },
];

function L2STestimonials() {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));
  const t = testimonials[current];

  return (
    <section id="testimonials" className="py-24 bg-[#f0fdf4]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[#166534] text-sm mb-3 uppercase tracking-widest" style={{ fontWeight: 700 }}>
            Student Stories
          </p>
          <h2
            className="text-black"
            style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}
          >
            What happens when your voice
            <br />
            <span className="text-[#166534]">finally matches your message</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 md:p-14 relative overflow-hidden border border-gray-100">
            <Quote size={60} className="text-[#dcfce7] absolute top-8 right-10" strokeWidth={1} />
            <div className="flex gap-1 mb-6">
              {[1,2,3,4,5].map((s) => (
                <svg key={s} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <div className="mb-8 relative z-10">
              {t.text.split("\n\n").map((para, i) => (
                <p key={i} className="text-gray-800 mb-4 last:mb-0"
                  style={{ fontSize: "clamp(1.05rem, 2vw, 1.2rem)", lineHeight: 1.8, fontStyle: "italic" }}>
                  {i === 0 ? `"${para}` : para}{i === t.text.split("\n\n").length - 1 ? '"' : ""}
                </p>
              ))}
            </div>
            <div className="flex items-center gap-4">
              {t.avatar ? (
                <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#166534]/20" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#dcfce7] border-2 border-[#166534]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#166534] text-lg" style={{ fontWeight: 700 }}>VP</span>
                </div>
              )}
              <div>
                <p className="text-black" style={{ fontWeight: 700 }}>{t.name}</p>
                <p className="text-gray-500 text-sm">{t.role}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === current ? "bg-[#166534] w-8" : "bg-gray-200 w-2 hover:bg-gray-400"}`} />
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={prev} className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#166534] hover:text-[#166534] transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={next} className="w-12 h-12 rounded-full bg-[#166534] text-white flex items-center justify-center hover:bg-[#14532d] transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16">
          {testimonials.slice(0, 3).map((testimonial, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4 italic" style={{ lineHeight: 1.7 }}>
                "{testimonial.text.slice(0, 120)}..."
              </p>
              <div className="flex items-center gap-3">
                {testimonial.avatar ? (
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#dcfce7] border-2 border-[#166534]/20 flex items-center justify-center shrink-0">
                    <span className="text-[#166534] text-lg" style={{ fontWeight: 700 }}>VP</span>
                  </div>
                )}
                <div>
                  <p className="text-black text-sm" style={{ fontWeight: 700 }}>{testimonial.name}</p>
                  <p className="text-gray-500 text-xs">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── FREE RESOURCES ─────────────── */
function L2SFreeResources() {
  const [activeResource, setActiveResource] = useState<{ label: string; file: string } | null>(null);

  function openPopup(label: string, file: string) {
    setActiveResource({ label, file });
  }

  function closePopup() {
    setActiveResource(null);
  }

  return (
    <>
      <ResourceDownloadModal resource={activeResource} onClose={closePopup} />

    <section id="resources" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <p className="text-[#166534] text-sm mb-3 uppercase tracking-widest" style={{ fontWeight: 700 }}>
              Free Resources
            </p>
            <h2
              className="text-black mb-4"
              style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}
            >Start improving your voice today, for free</h2>
            <p className="text-gray-600 mb-10" style={{ lineHeight: 1.8 }}>
              I believe everyone deserves access to quality vocal training. That's why I've created these free tools to get you started right now, no credit card required.
            </p>

            <div className="space-y-5">
              {[
                {
                  icon: <Headphones size={22} />,
                  title: "7-Day Vocal Warm-Up Series",
                  file: "vocal-warmup-series.zip",
                  badge: "Audio",
                  badgeColor: "bg-orange-100 text-orange-700",
                  desc: "Start every morning with these 10-minute audio warm-ups designed to protect and strengthen your voice.",
                },
                {
                  icon: <BookOpen size={22} />,
                  title: "The Singer's Technique Handbook",
                  file: "singers-handbook.pdf",
                  badge: "eBook",
                  badgeColor: "bg-green-100 text-green-700",
                  desc: "A free 100-page PDF covering breath support, resonance, and stage confidence basics.",
                },
              ].map((r, i) => (
                <div
                  key={i}
                  onClick={() => openPopup(r.title, r.file)}
                  className="flex items-start gap-5 p-5 rounded-2xl border border-gray-100 bg-[#f0fdf4] hover:border-[#166534]/30 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#dcfce7] text-[#166534] flex items-center justify-center shrink-0 group-hover:bg-[#166534] group-hover:text-white transition-colors">
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
                  <Download size={18} className="text-gray-300 group-hover:text-[#166534] transition-colors shrink-0 mt-1" onClick={(e) => { e.stopPropagation(); openPopup(r.title, r.file); }} />
                </div>
              ))}
            </div>

            
          </div>

          <div className="flex-1 relative max-w-md">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src={image_13026caaaf590ac7061b93b7b4718ed646527428}
                alt="Vocal training resources for musicians"
                className="w-full h-[460px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-44 h-44 bg-[#dcfce7] rounded-3xl -z-10" />
            <div className="absolute bottom-6 left-0 sm:-left-6 bg-white rounded-2xl shadow-xl px-5 py-4 border border-gray-100">
              <p className="text-[#166534] text-2xl" style={{ fontWeight: 800 }}>FREE</p>
              <p className="text-gray-600 text-xs" style={{ fontWeight: 600 }}>No credit card needed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

/* ─────────────── BLOG SECTION ─────────────── */
function L2SBlogSection() {
  const { posts: livePosts, isLoading } = useBlogspotFeed("https://learn2communicatewithsong.blogspot.com");
  const posts = isLoading ? [] : livePosts.slice(0, 3);
  return (
    <section id="blog" className="py-24 bg-[#f0fdf4]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-[#166534] text-sm mb-3 uppercase tracking-widest" style={{ fontWeight: 700 }}>The Blog</p>
            <h2 className="text-black" style={{ fontSize: "clamp(2rem, 4vw, 2.4rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
              Vocal strategies for entrepreneurs, coaches &amp; creators
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl" style={{ lineHeight: 1.7 }}>
              No music theory. No stage fright clichés. Just practical voice training insight for people who communicate for a living.
            </p>
          </div>
          <a href="/learn-to-communicate/blog" className="flex items-center gap-2 text-[#166534] hover:text-[#14532d] transition-colors whitespace-nowrap" style={{ fontWeight: 700 }}>
            Read all articles <ArrowRight size={18} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                <div className="h-52 bg-gray-100" />
                <div className="p-7 space-y-3">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))
          ) : (
            posts.map((post) => (
            <a key={post.slug} href={`/learn-to-communicate/blog/${post.slug}`} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col">
              {post.image && (
              <div className="overflow-hidden h-52">
                <ImageWithFallback src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              )}
              <div className="p-7 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4">
                  
                  <span className="text-gray-400 text-xs">{post.readTime}</span>
                </div>
                <h3 className="text-black mb-3 group-hover:text-[#166534] transition-colors flex-1" style={{ fontSize: "1.05rem", fontWeight: 700, lineHeight: 1.4 }}>
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm mb-5" style={{ lineHeight: 1.6 }}>{post.excerpt}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-gray-400 text-xs">{post.date}</span>
                  <span className="text-[#166534] text-sm flex items-center gap-1 group-hover:gap-2 transition-all" style={{ fontWeight: 600 }}>
                    Read more <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </a>
          ))
          )}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── CTA SECTION ─────────────── */
function L2SCTASection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section id="get-started" className="py-24 bg-[#166534] relative overflow-hidden">
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
          Your ideas are powerful.{" "}
          <br className="hidden md:block" />
          Your voice should be too.
        </h2>
        <p className="text-green-100 mb-10 text-lg max-w-xl mx-auto" style={{ lineHeight: 1.7 }}>Book your free vocal analysis and get a personalized breakdown of your voice's strengths, blind spots, and the exact steps to sing with more power, clarity, and confidence.</p>

        

        <a
          href="https://calendar.app.google/Y83p7Rf5idJkdzKc6"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-white text-[#166534] px-10 py-4 rounded-full hover:bg-green-50 transition-colors group"
          style={{ fontWeight: 700, fontSize: "1rem" }}
        >
          Book a Free 30-Min Vocal Analysis
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </section>
  );
}

/* ─────────────── PAGE ASSEMBLY ─────────────── */
export function Learn2SingPage() {
  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <L2CNavbar />
      <L2SHero />
      <L2SStatsBar />
      <L2SAbout />
      <LogoCarousel />
      <L2SPrograms />
      <L2SVideoSection />
      <L2STestimonials />
      <L2SFreeResources />
      <L2SBlogSection />
      <L2SCTASection />
      <Footer />
    </div>
  );
}