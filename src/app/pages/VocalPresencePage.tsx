import image_37f32b5f0128cc9c891380f41f83a029fa5ec26d from 'figma:asset/37f32b5f0128cc9c891380f41f83a029fa5ec26d.png'
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
import { L2SingNavbar } from "../components/L2SingNavbar";
import { Footer } from "../components/Footer";
import { LogoCarousel } from "../components/LogoCarousel";
import { Testimonials } from "../components/Testimonials";
import { ResourceDownloadModal } from "../components/ResourceDownloadModal";

import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import jacreamImg from "figma:asset/9a56e731aa7826852c6a808b767815b32665288b.png";
import amirahImg from "figma:asset/fced2b75511a20633c2209c9d6fe6e6a657aa5a1.png";
import richieImg from "figma:asset/b83f479654f431a8c7e6ebb892c9028ad17d4a2f.png";
import sreynannImg from "figma:asset/6d2db891878a87edbb32f0b61bcd05ea15237f3b.png";
import studentPhoto from "figma:asset/21f3eaee986f5854b456e4b5534adf6dce578a57.png";
import videoThumbImg from "figma:asset/d0e85cf59d269d1eae80bc43bb42139e08c63d3e.png";
import omegaImg from "figma:asset/a5c44fa231ece841b7c75f3487148d5d4d53f216.png";
import image_4de58a02f605261925990ba9260bdfdaefdad934 from "figma:asset/4de58a02f605261925990ba9260bdfdaefdad934.png";

import { l2sBlogPosts } from "../data/l2sBlogPosts";
import { vpBlogPosts } from "../data/vpBlogPosts";
import { useBlogspot } from "../context/BlogspotContext";

/* ─────────────── HERO ─────────────── */
const heroImage = "https://images.unsplash.com/photo-1765278249103-3ae1cce4eb9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW5nZXIlMjBtaWNyb3Bob25lJTIwc3BvdGxpZ2h0JTIwc3RhZ2UlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NzE5NTYzNDl8MA&ixlib=rb-4.1.0&q=80&w=1080";

function VPHero() {
  return (
    <section className="relative min-h-screen bg-white pt-24 overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#f5f0ff] hidden lg:block" style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" }} />
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[#554274]/5 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-56 h-56 rounded-full bg-[#554274]/8 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 min-h-[calc(100vh-5rem)] py-16">
          {/* Left */}
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#ede8f5] text-[#554274] px-4 py-2 rounded-full text-sm mb-6" style={{ fontWeight: 600 }}>
              <span className="w-2 h-2 rounded-full bg-[#554274] animate-pulse" />
              For your inner child who always knew they could sing
            </div>

            <h1 className="text-black mb-6" style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em" }}>You have a powerful voice. You felt it as a child. This is the moment you <span style={{ color: "#554274" }}>finally</span> start <span style={{ color: "#554274" }}>singing</span>.</h1>

            <p className="text-gray-600 mb-8 text-lg" style={{ lineHeight: 1.7 }}>This is not a coincidence. You were drawn here for a reason. Omega works with people exactly like you, ready to finally use the voice they have carried their whole life.</p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a
                href="https://calendar.app.google/Y83p7Rf5idJkdzKc6"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#554274] text-white px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-[#432f5c] transition-all hover:shadow-lg hover:shadow-[#554274]/30 group"
                style={{ fontWeight: 700, fontSize: "1rem" }}
              >
                Book a Free 30-Min. Roadmap Session
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <button className="flex items-center justify-center gap-3 text-black hover:text-[#554274] transition-colors group">
                
                
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
                  src={image_37f32b5f0128cc9c891380f41f83a029fa5ec26d}
                  alt="Musician student transformation"
                  className="w-full h-[300px] sm:h-[420px] lg:h-[520px] object-cover transition-transform group-hover:scale-105 duration-700"
                />
              </div>

              <div className="hidden lg:flex absolute -left-6 top-16 bg-white rounded-2xl shadow-xl px-5 py-4 items-center gap-3 border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-[#ede8f5] flex items-center justify-center text-[#554274]">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-black text-sm" style={{ fontWeight: 700 }}>Built for dreamers</p>
                  <p className="text-gray-500 text-xs">It's never too late</p>
                </div>
              </div>

              <div className="hidden lg:block absolute -right-4 bottom-20 bg-[#554274] rounded-2xl shadow-xl px-5 py-4 text-white">
                <p className="text-[24px]" style={{ fontWeight: 800 }}>90 Days Away</p>
                <p className="text-purple-200 text-xs mt-0.5" style={{ fontWeight: 500 }}>from the performance of your life</p>
              </div>

              <div className="hidden lg:flex absolute -bottom-4 left-12 bg-white rounded-2xl shadow-xl px-5 py-3 items-center gap-3 border border-gray-100">
                <span className="text-2xl">🎤</span>
                <div>
                  <p className="text-black text-sm" style={{ fontWeight: 700 }}>7,400+ Students</p>
                  <p className="text-gray-500 text-xs">Finally sang their story with Omega</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────── STATS BAR ─────────────── */
function VPStatsBar() {
  const stats = [
    { value: "90 Days", label: "To your first concert" },
    { value: "25+", label: "Years of professional teaching experience" },
    { value: "98%", label: "Of students report a lasting change in confidence" },
    { value: "7,400+", label: "Students trained worldwide" },
  ];

  return (
    <section className="bg-[#554274] py-5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-white" style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                {stat.value}
              </p>
              <p className="text-purple-200 text-sm mt-1" style={{ fontWeight: 500 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── ABOUT ─────────────── */
function VPAbout() {
  const achievements = [
    "Performed alongside world-class performers, she knows exactly what it takes to step into your full voice",
    "IB-certified vocal specialist with students across 4 continents, all starting from exactly where you are",
    "She has performed alongside Michael Jackson and Prince, bringing that lineage to every lesson",
    "Author of 'Learn 2 Sing', a vocal technique guide written specifically for complete beginners",
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
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-[#ede8f5] rounded-3xl -z-10" />
              <div className="absolute -top-6 -right-6 w-36 h-36 bg-[#554274]/10 rounded-3xl -z-10" />
              <div className="absolute bottom-8 -right-8 bg-white rounded-2xl shadow-xl p-5 max-w-[210px] border border-gray-100 hidden sm:block">
                <p className="text-gray-600 text-sm italic" style={{ lineHeight: 1.6 }}>
                  "You didn't lose the ability to sing. You just never had someone show you how. That changes now."
                </p>
                <p className="text-[#554274] text-xs mt-2" style={{ fontWeight: 700 }}>Omega Bone</p>
              </div>
            </div>
          </div>

          <div className="flex-[2]">
            <p className="text-[#554274] text-sm mb-3 uppercase tracking-widest" style={{ fontWeight: 700 }}>
              She sees what you have always had
            </p>
            <h2
              className="text-black mb-6"
              style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}
            >You didn't miss your window.</h2>

            <p className="text-gray-600 mb-5" style={{ lineHeight: 1.8 }}>Most people who come to Omega weren't trained vocalist. They were people who grew up singing softly in empty rooms. Who got emotional at concerts for reasons they couldn't explain. Who carried a quiet belief, for years, that their voice was meant to do something but never had a single person show them how.</p>
            <p className="text-gray-600 mb-5" style={{ lineHeight: 1.8 }}>Omega's method doesn't start with scales. It starts with you; your specific voice, your specific blocks, the exact place where you stopped trusting yourself. From there, she builds something that isn't just about singing: it's about learning to take up space with your voice in every situation that matters.</p>
            <p className="text-gray-600 mb-8" style={{ lineHeight: 1.8 }}>In 90 days, most students don't just find a singing voice. They find a confidence that travels. Into daily conversations. Into presentations. Into sales calls and every room where they used to go quiet.</p>

            <ul className="space-y-3 mb-10">
              {achievements.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-[#554274] mt-0.5 shrink-0" />
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
const vpPrograms = [
  {
    icon: <Music size={28} />,
    tag: "Start Here",
    tagColor: "bg-[#ede8f5] text-[#554274]",
    title: "Sing Your First Full Song in 30 Days, Even If You've Never Had a Lesson",
    subtitle: "30-Day Programme",
    highlight: false,
    description:
      "You have been humming in the car for years. This is the month you stop hiding. 1.5 hours of private coaching every week, one song that means something to you, and the foundation to keep growing long after the 30 days are done.",
    features: [
      "1.5hrs of private coaching per week",
      "The Complete Song Breakdown System taught step by step",
      "1 song chosen by you, something that means something to you",
      "Breathing and diction coaching so your voice stops getting in its own way",
    ],
    bonuses: [],
    cta: "Book Discovery Session",
    urgency: null,
  },
  {
    icon: <Trophy size={28} />,
    tag: "Most Requested",
    tagColor: "bg-black text-white",
    title: "From First Note to Real Concert in 90 Days, Guaranteed",
    subtitle: "90-Day Programme · 24 Private Sessions",
    highlight: true,
    description:
      "Most people go their entire lives never hearing their own voice fill a room. You won't be one of them. Twenty-four sessions, six songs coached to performance level, and a real concert. Your night, your terms, your audience.",
    features: [
      "6 songs chosen by you, coached to performance level",
      "2.5 hrs per week (30 min daily), flexible depending on your schedule",
      "Instructional guidelines on what to improve after each session",
      "How to market your concert and build your audience",
      "How to select your venue and plan your performance night",
    ],
    bonuses: [
      {
        label: "OPTIONAL ADD-ON",
        title: "The Personal Milestone Album",
        desc: "6 songs, 6 hours of professional recording. Omega produces and mixes, sent to studio for mastering. A permanent record of the moment you stopped being afraid.",
      },
    ],
    cta: "Book Discovery Session",
    urgency: "Limited to 3 clients",
  },
  {
    icon: <Star size={28} />,
    tag: "Maximum Results",
    tagColor: "bg-[#ede8f5] text-[#554274]",
    title: "From Blank Page to Professional Album in 14 Weeks, Done With You",
    subtitle: "3.5-Month Programme · Write, Perform & Record",
    highlight: false,
    description:
      "You don't just have a voice. You have a story. This is the programme that turns one into the other, from your first note to a complete, professionally produced original album in under four months.",
    features: [
      "The Complete Song System foundation (weeks 1 to 2)",
      "6 private songwriting sessions: Omega helps you find the song inside the story",
      "12 performance sessions building confidence song by song",
      "A full day of professional recording: 6 hours, 1 song per hour",
      "Omega produces and sends to studio for professional mix and mastering",
      "Delivered as a complete, professional-quality original album",
    ],
    bonuses: [],
    cta: "Book Discovery Session",
    urgency: "Only 1 spot per month",
  },
];

/* ─────────────── PROGRAM CARD ─────────────── */
function VPProgramCard({ program }: { program: typeof vpPrograms[0] }) {
  const [bonusOpen, setBonusOpen] = useState(false);

  return (
    <div
      className={`relative rounded-3xl flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        program.highlight
          ? "bg-[#554274] text-white shadow-2xl shadow-[#554274]/40 scale-[1.03] z-10 mt-8 md:mt-0"
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

        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${program.highlight ? "bg-white/20 text-white" : "bg-[#ede8f5] text-[#554274]"}`}>
          {program.icon}
        </div>

        <h3 className={`mb-1 ${program.highlight ? "text-white" : "text-black"}`} style={{ fontSize: "1.25rem", fontWeight: 800 }}>
          {program.title}
        </h3>
        <p className={`text-sm mb-4 ${program.highlight ? "text-purple-200" : "text-[#554274]"}`} style={{ fontWeight: 600 }}>
          {program.subtitle}
        </p>

        <p className={`text-sm mb-6 ${program.highlight ? "text-purple-100" : "text-gray-600"}`} style={{ lineHeight: 1.7 }}>
          {program.description}
        </p>

        <ul className="space-y-2.5 mb-6">
          {program.features.map((f, fi) => (
            <li key={fi} className="flex items-start gap-2.5 text-sm">
              <CheckCircle size={15} className={`shrink-0 mt-0.5 ${program.highlight ? "text-yellow-300" : "text-[#554274]"}`} />
              <span className={program.highlight ? "text-purple-100" : "text-gray-700"}>{f}</span>
            </li>
          ))}
        </ul>

        {program.bonuses.length > 0 && (
          <>
            <button
              onClick={() => setBonusOpen(!bonusOpen)}
              className={`flex items-center justify-between w-full text-sm px-4 py-3 rounded-2xl mb-4 transition-colors ${
                program.highlight
                  ? "bg-white/15 text-white hover:bg-white/25"
                  : "bg-[#ede8f5] text-[#554274] hover:bg-[#ddd5ef]"
              }`}
              style={{ fontWeight: 700 }}
            >
              <span className="flex items-center gap-2">
                <Gift size={14} />
                {program.bonuses[0].label === "OPTIONAL ADD-ON"
                  ? "Optional Add-On Available"
                  : `${program.bonuses.length} Exclusive Bonuses Included`}
              </span>
              {bonusOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {bonusOpen && (
              <div className="space-y-3 mb-6">
                {program.bonuses.map((b, bi) => (
                  <div key={bi} className={`rounded-2xl p-4 ${program.highlight ? "bg-white/10" : "bg-white border border-gray-200"}`}>
                    <p className={`text-xs mb-0.5 ${program.highlight ? "text-yellow-300" : "text-[#554274]"}`} style={{ fontWeight: 800, letterSpacing: "0.06em" }}>
                      {b.label}
                    </p>
                    <p className={`text-sm mb-1 ${program.highlight ? "text-white" : "text-black"}`} style={{ fontWeight: 700 }}>
                      {b.title}
                    </p>
                    <p className={`text-xs ${program.highlight ? "text-purple-200" : "text-gray-500"}`} style={{ lineHeight: 1.6 }}>
                      {b.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

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
              ? "bg-white text-[#554274] hover:bg-purple-50"
              : "bg-[#554274] text-white hover:bg-[#432f5c]"
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

function VPPrograms() {
  return (
    <section id="programs" className="py-24 bg-[#f8f5fc]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-[#ede8f5] text-[#554274] text-xs px-4 py-2 rounded-full mb-5" style={{ fontWeight: 700, letterSpacing: "0.06em" }}>
            <Sparkles size={13} /> VOCAL PRESENCE · SINGING PROGRAMMES
          </div>
          <h2
            className="text-black mb-5"
            style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.03em" }}
          >
            Choose the programme
            <br />
            <span className="text-[#554274]">that fits where you are right now.</span>
          </h2>
          
        </div>

        {/* Program Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-20">
          {vpPrograms.map((program, i) => (
            <VPProgramCard key={i} program={program} />
          ))}
        </div>

        {/* Downsell - Group Workshop */}
        
      </div>
    </section>
  );
}

/* ─────────────── VIDEO SECTION ─────────────── */
function VPVideoSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 max-w-lg">
            <p className="text-[#554274] text-sm mb-3 uppercase tracking-widest" style={{ fontWeight: 700 }}>
              The Results Speak
            </p>
            <h2
              className="text-black mb-6"
              style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}
            >
              People who finally start singing don't just find a voice. They find themselves.
            </h2>
            <p className="text-gray-600 mb-8" style={{ lineHeight: 1.8 }}>Watch students go from "I could never do this" to performing with full presence and genuine ease. The moment everything clicks is different for every person, but it always comes. And when it does, it does not stay in the music. It moves into every other part of how they show up in the world.</p>

            <div className="grid grid-cols-2 gap-5 mb-10">
              {[
                { number: "21 days", desc: "Average time before students say 'I sound completely different'" },
                { number: "94%", desc: "Report a confidence that moves beyond singing into daily communication and relationships" },
                { number: "3×", desc: "Average improvement in communication presence reported by students at work and on camera after 60 days" },
                { number: "90 days", desc: "From your very first note to a voice that belongs to you, fully and without apology" },
              ].map((item, i) => (
                <div key={i} className="bg-[#f8f5fc] rounded-2xl p-5 border border-purple-50">
                  <p className="text-[#554274] mb-1" style={{ fontSize: "1.6rem", fontWeight: 800 }}>{item.number}</p>
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
                      <Play size={28} fill="#554274" className="text-[#554274] ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white text-sm" style={{ fontWeight: 600 }}>🎤 "I stopped apologising for my voice. In lessons. And in life."</p>
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
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-[#ede8f5] rounded-3xl -z-10" />
            <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full border-4 border-[#554274]/20 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── FREE RESOURCES ─────────────── */
function VPFreeResources() {
  const [activeResource, setActiveResource] = useState<{ label: string; file: string } | null>(null);

  const resources = [
    {
      icon: <Headphones size={22} />,
      title: "7-Day Vocal Warm-Up Series",
      badge: "Audio",
      badgeColor: "bg-orange-100 text-orange-700",
      desc: "Ten minutes a morning. These warm-ups are designed for complete beginners: gentle, progressive, and genuinely surprising after just one week.",
      download: { label: "7-Day Vocal Warm-Up Series", file: "vocal-warmup-series.zip" },
    },
    {
      icon: <BookOpen size={22} />,
      title: "The Singer's Technique Handbook",
      badge: "eBook",
      badgeColor: "bg-green-100 text-green-700",
      desc: "A free 100-page guide written for people who always wanted to sing and never knew where to start. Breath, tone, and trust in your own voice, explained simply.",
      download: { label: "The Singer's Technique Handbook", file: "singers-handbook.pdf" },
    },
  ];

  return (
    <>
      <ResourceDownloadModal resource={activeResource} onClose={() => setActiveResource(null)} />

    <section id="resources" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <p className="text-[#554274] text-sm mb-3 uppercase tracking-widest" style={{ fontWeight: 700 }}>
              Free Resources
            </p>
            <h2
              className="text-black mb-4"
              style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}
            >Start today for free.</h2>
            <p className="text-gray-600 mb-10" style={{ lineHeight: 1.8 }}>You don't need to be ready. You don't need to be good. These free tools will show you what your voice is already capable of and at your own pace, in your own time, with no pressure.</p>

            <div className="space-y-5">
              {resources.map((r, i) => (
                <div
                  key={i}
                  onClick={() => setActiveResource(r.download)}
                  className="flex items-start gap-5 p-5 rounded-2xl border border-gray-100 bg-[#f8f5fc] hover:border-[#554274]/30 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#ede8f5] text-[#554274] flex items-center justify-center shrink-0 group-hover:bg-[#554274] group-hover:text-white transition-colors">
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
                  <Download size={18} className="text-gray-300 group-hover:text-[#554274] transition-colors shrink-0 mt-1" />
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
            <div className="absolute -bottom-6 -right-6 w-44 h-44 bg-[#ede8f5] rounded-3xl -z-10" />
            <div className="absolute bottom-6 left-0 sm:-left-6 bg-white rounded-2xl shadow-xl px-5 py-4 border border-gray-100">
              <p className="text-[#554274] text-2xl" style={{ fontWeight: 800 }}>FREE</p>
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
function BlogPostImage({ src, alt }: { src: string; alt: string }) {
  const [visible, setVisible] = useState(true);
  if (!src || !visible) return null;
  return (
    <div className="overflow-hidden h-52">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        onError={() => setVisible(false)}
      />
    </div>
  );
}

function VPBlogSection() {
  const { posts: blogspotPosts, isLoading } = useBlogspot();
  const posts = blogspotPosts.slice(0, 3);
  return (
    <section id="blog" className="py-24 bg-[#f8f5fc]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-[#554274] text-sm mb-3 uppercase tracking-widest" style={{ fontWeight: 700 }}>The Blog</p>
            <h2 className="text-black" style={{ fontSize: "clamp(2rem, 4vw, 2.4rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
              For everyone who always knew they could sing
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl" style={{ lineHeight: 1.7 }}>
              The voice you've been holding back. The dream you quietly filed away. The ripple effect that follows when you finally set it free.
            </p>
          </div>
          <a href="/learn2sing/blog" className="flex items-center gap-2 text-[#554274] hover:text-[#432f5c] transition-colors whitespace-nowrap" style={{ fontWeight: 700 }}>
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
              <a key={post.slug} href={`/blogspot/${post.slug}`} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col">
                <BlogPostImage src={post.image} alt={post.title} />
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    
                    <span className="text-gray-400 text-xs">{post.readTime}</span>
                  </div>
                  <h3 className="text-black mb-3 group-hover:text-[#554274] transition-colors flex-1" style={{ fontSize: "1.05rem", fontWeight: 700, lineHeight: 1.4 }}>
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-5" style={{ lineHeight: 1.6 }}>{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-gray-400 text-xs">{post.date}</span>
                    <span className="text-[#554274] text-sm flex items-center gap-1 group-hover:gap-2 transition-all" style={{ fontWeight: 600 }}>
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
function VPCTASection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section id="get-started" className="py-24 bg-[#554274] relative overflow-hidden">
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
          You've waited long enough.{" "}
          <br className="hidden md:block" />
          Your voice is ready when you are.
        </h2>
        <p className="text-purple-100 mb-10 text-lg max-w-xl mx-auto" style={{ lineHeight: 1.7 }}>
          Book a free 30-minute singing lesson with Omega and take the first real step toward the voice you have always had inside you.
        </p>
        <a
          href="https://calendar.app.google/Y83p7Rf5idJkdzKc6"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-black text-white px-10 py-4 rounded-full hover:bg-gray-900 transition-colors group"
          style={{ fontWeight: 700 }}
        >
          Book Your Free 30-Min Lesson
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </section>
  );
}

/* ─────────────── PAGE ASSEMBLY ─────────────── */
export function VocalPresencePage() {
  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <L2SingNavbar />
      <VPHero />
      <VPStatsBar />
      <VPAbout />
      <LogoCarousel />
      <VPPrograms />
      <VPVideoSection />
      <Testimonials />
      <VPFreeResources />
      <VPBlogSection />
      <VPCTASection />
      <Footer />
    </div>
  );
}