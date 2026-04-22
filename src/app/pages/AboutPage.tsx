import image_9d9516714a0f914f017cac9870685e072bb76b58 from 'figma:asset/9d9516714a0f914f017cac9870685e072bb76b58.png'
import image_0bcb9da9735cf66a758b7ce4ae31570be5209361 from 'figma:asset/0bcb9da9735cf66a758b7ce4ae31570be5209361.png';
import image_682797a1dac3bc8d3a5c4caabc58549c4003b3b8 from 'figma:asset/682797a1dac3bc8d3a5c4caabc58549c4003b3b8.png';
import omegaHeroImg from 'figma:asset/5e8e73fd5996bb6bc6f67f6447d37f2f85256a26.png';
import image_922e7979a32204c6013dd16962845b795b055d34 from 'figma:asset/922e7979a32204c6013dd16962845b795b055d34.png';
import image_c481a4885c02af25ad9e39fce6e23bb2385a9f7d from 'figma:asset/c481a4885c02af25ad9e39fce6e23bb2385a9f7d.png';
import image_1c57b253b147937aa36d4f7dbedaba9e269c9d51 from 'figma:asset/1c57b253b147937aa36d4f7dbedaba9e269c9d51.png';
import { ArrowRight, MapPin, Music, Globe, Mic2, MessageSquare } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { AboutNavbar } from "../components/AboutNavbar";
import { Footer } from "../components/Footer";
import { LogoCarousel } from "../components/LogoCarousel";

const careerHighlights = [
  {
    icon: <Music size={20} />,
    title: "Final Fantasy XIV: Heavensward",
    description: "Lead voice to the trailer of one of the world's most beloved gaming franchises."  },
  {
    icon: <Globe size={20} />,
    title: "Rolling in the Deep",
    description: "Accoustic cover of her favorite Adele's song.",  },
  {
    icon: <Mic2 size={20} />,
    title: "DARIUSBURST Chronicle Saviours",
    description: "Lead vocalist and lyrics writter for one of Japan's most famous games.",
  },
];

const teachingRoles = [
  {
    location: "Los Angeles, USA",
    role: "Music Education Specialist",
    org: "Hillcrest Drive Elementary Music Magnet — LAUSD",
    detail: "The only elementary music magnet program in all of the Los Angeles Unified School District.",
  },
  {
    location: "Kyoto, Japan",
    role: "IB Music Specialist",
    org: "Doshisha International Academy",
    detail: "Delivered IB-framework music instruction in English to Japanese students, Grades 1–6.",
  },
  {
    location: "Tokyo, Japan",
    role: "Music Specialist & Drama Teacher",
    org: "Canadian International School",
    detail: "Directed concerts, choreographed performances, and ran a weekly Lunch Time Performance Café.",
  },
  {
    location: "Wiesbaden, Germany",
    role: "Music Specialist",
    org: "Frankfurt International School",
    detail: "Led composition projects and integrated music technology across the curriculum.",
  },
];

export function AboutPage() {
  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <AboutNavbar />

      {/* ── HERO ── */}
      <section
        className="mt-28 sm:mt-36 lg:mt-40 pb-0 relative bg-black"
        style={{ minHeight: "380px" }}
      >
        <img
          src={omegaHeroImg}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        {/* Dark overlay on the right side for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/55 to-black/85 pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 flex justify-end">
          <div className="w-full lg:w-1/2 flex flex-col justify-center py-16 lg:py-24">
            <h1
              className="text-white mb-6"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em" }}
            >
              You have a <span style={{ color: "#60a5fa" }}>voice</span> worth hearing and a vision worth sharing.
            </h1>
            <p className="text-white/80 mb-6" style={{ lineHeight: 1.85 }}>
              Omega knows the distance between what you feel inside and what the world actually hears. She has lived on both sides of that gap and spent 30 years helping others close it for good.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#1a56db] text-white px-8 py-4 rounded-full hover:bg-[#1544b5] transition-all hover:shadow-lg hover:shadow-[#1a56db]/30 group self-center sm:self-start"
              style={{ fontWeight: 700 }}
            >
              Get in touch <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        {/* Full-width divider */}
        <div className="w-full mt-0">
          <div className="h-px bg-gradient-to-r from-transparent via-[#1a56db]/30 to-transparent" />
          <div className="h-px mt-[2px] bg-gradient-to-r from-transparent via-[#1a56db]/10 to-transparent" />
        </div>
      </section>

      <LogoCarousel />

      {/* ── PROGRAMS CTA ── */}
      <section id="programs" className="py-12 sm:py-16 lg:py-20 bg-[#f0f5ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-[#1a56db] text-sm mb-3 uppercase tracking-widest" style={{ fontWeight: 700 }}>
              Work With Omega
            </p>
            <h2
              className="text-black"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}
            >
              Three ways to find your voice
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl p-7 sm:p-10 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-[#e8f0fe] text-[#1a56db] flex items-center justify-center mb-6">
                <Music size={26} />
              </div>
              <p className="text-[#1a56db] text-xs uppercase tracking-widest mb-2" style={{ fontWeight: 700 }}>For ambitious Families & Children</p>
              <h3 className="text-black mb-4" style={{ fontSize: "1.5rem", fontWeight: 800, lineHeight: 1.2 }}>Music Room 33</h3>
              <p className="text-gray-600 mb-4 flex-1" style={{ lineHeight: 1.8 }}>The most important stage a child will ever stand on is inside their own home. Music Room 33 helps parents and children unlock their musical potential together, building confidence, connection, and creativity in the everyday moments that matter most.</p>
              <p className="text-gray-500 text-sm italic mb-8" style={{ lineHeight: 1.6 }}>A child who grows up singing grows up knowing they have something to say.</p>
              <Link
                to="/music-room-33"
                className="inline-flex items-center justify-center gap-2 bg-[#1a56db] text-white px-8 py-4 rounded-full hover:bg-[#1649c0] transition-all hover:shadow-lg group mt-auto text-[14px]"
                style={{ fontWeight: 700 }}
                onClick={() => window.scrollTo(0, 0)}
              >
                Explore Music Room 33
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl p-7 sm:p-10 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-[#ede9f6] text-[#554274] flex items-center justify-center mb-6">
                <Mic2 size={26} />
              </div>
              <p className="text-[#554274] text-xs uppercase tracking-widest mb-2" style={{ fontWeight: 700 }}>For entrepreneurs, coaches & creators</p>
              <h3 className="text-black mb-4" style={{ fontSize: "1.5rem", fontWeight: 800, lineHeight: 1.2 }}>Learn 2 Sing</h3>
              <p className="text-gray-600 mb-4 flex-1" style={{ lineHeight: 1.8 }}>You already have the message. What's missing is a voice that makes people stop, lean in, and feel it. Learn 2 Sing is for entrepreneurs, coaches, and creators who know their ideas are worth hearing and are done letting a flat, forgettable delivery get in the way.</p>
              <p className="text-gray-500 text-sm italic mb-8" style={{ lineHeight: 1.6 }}>When your voice carries authority, your words carry weight.</p>
              <a
                href="/learn2sing#top"
                className="inline-flex items-center justify-center gap-2 bg-[#554274] text-white px-8 py-4 rounded-full hover:bg-[#443360] transition-all hover:shadow-lg group mt-auto text-[14px]"
                style={{ fontWeight: 700 }}
              >
                Explore Learn 2 Sing
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl p-7 sm:p-10 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-[#dcfce7] text-[#166534] flex items-center justify-center mb-6">
                <MessageSquare size={26} />
              </div>
              <p className="text-[#166534] text-xs uppercase tracking-widest mb-2" style={{ fontWeight: 700 }}>For professionals & public speakers</p>
              <h3 className="text-black mb-4" style={{ fontSize: "1.5rem", fontWeight: 800, lineHeight: 1.2 }}>Learn to Communicate</h3>
              <p className="text-gray-600 mb-4 flex-1" style={{ lineHeight: 1.8 }}>Communication is not just what you say, it is how your voice makes people feel. Learn to Communicate trains you to speak with clarity, resonance, and conviction, so every room you walk into already knows you mean it.</p>
              <p className="text-gray-500 text-sm italic mb-8" style={{ lineHeight: 1.6 }}>The voice is the instrument. The message is the music.</p>
              <Link
                to="/learn-to-communicate"
                className="inline-flex items-center justify-center gap-2 bg-[#166534] text-white px-8 py-4 rounded-full hover:bg-[#14532d] transition-all hover:shadow-lg group mt-auto text-[14px]"
                style={{ fontWeight: 700 }}
                onClick={() => window.scrollTo(0, 0)}
              >
                Explore Learn to Communicate
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── ORIGIN STORY ── */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Image */}
            <div className="flex-1 relative w-full">
              <div className="relative max-w-md mx-auto">
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <ImageWithFallback
                    src={image_682797a1dac3bc8d3a5c4caabc58549c4003b3b8}
                    alt="The journey that changed everything"
                    className="w-full h-48 sm:h-[300px] lg:h-[400px] object-cover"
                    loading="lazy"
                  />
                </div>
                {/* Pull quote overlay — bottom left */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-4 sm:px-6 sm:py-5 shadow-lg">
                  <p className="text-black italic text-xs sm:text-sm" style={{ lineHeight: 1.7 }}>
                    "With every trip, I learned: I am okay. And I want every single one of my students to learn the same thing."
                  </p>
                  <p className="text-[#1a56db] text-xs mt-2 sm:mt-3" style={{ fontWeight: 700 }}>— Omega Bone</p>
                </div>
                <div className="hidden sm:block absolute -bottom-6 -right-6 w-48 h-48 bg-[#e8f0fe] rounded-3xl -z-10" />
                <div className="hidden sm:block absolute -top-6 -left-6 w-32 h-32 bg-[#1a56db]/10 rounded-3xl -z-10" />
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 max-w-xl w-full">
              <p className="text-[#1a56db] text-sm mb-3 uppercase tracking-widest" style={{ fontWeight: 700 }}>
                The Start of a Bigger Story.
              </p>
              <h2
                className="text-black mb-6"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}
              >No one is born belonging on stage. It is earned.</h2>
              <p className="text-gray-600 mb-5" style={{ lineHeight: 1.85 }}>Omega was raised in Los Angeles, a city that runs on image. Everywhere she looked, the message was the same. And quietly, consistently, it told her she wasn't enough.</p>
              <p className="text-gray-600 mb-5" style={{ lineHeight: 1.85 }}>
                So she stopped listening to the city.
              </p>
              <p className="text-gray-600" style={{ lineHeight: 1.85 }}>At 16, she boarded a plane to South Africa to join a youth theatre project. And for the first time in her life, she was seen fully, honestly, as she was. She came home knowing something she hadn't known before: that identity isn't assigned to you by your environment. It's built, trip by trip, song by song, one brave moment at a time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAREER / THE VOICE ── */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Text */}
            <div className="flex-1 max-w-xl order-2 lg:order-1 w-full">
              <p className="text-[#1a56db] text-sm mb-3 uppercase tracking-widest" style={{ fontWeight: 700 }}>A RAPID START IN THE EARLY BEGINNINGS</p>
              <h2
                className="text-black mb-6"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}
              >The stages before the classrooms.</h2>
              <p className="text-gray-600 mb-5" style={{ lineHeight: 1.85 }}>Early on, she performed alongside her idols, sharing the stage with Michael Jackson at Super Bowl XXVII. She performed alongside Prince. She toured Brazil with the Albert McNeil Jubilee Singers and co-writing and performing in South African stage productions.</p>
              <p className="text-gray-600 mb-5" style={{ lineHeight: 1.85 }}>She then moved to Germany to start a family and kept working. She became a certified International Baccalaureate (IB) Music Specialist, first in Frankfurt, then in Kyoto, Japan, where she taught English-language music to Japanese students in a bilingual school.</p>
              <p className="text-gray-600 mb-5" style={{ lineHeight: 1.85 }}>From Japan she built a parallel career as a commercial session singer in Tokyo, recording and composing video game theme songs for popular franchises like Final Fantasy and large multinal brands.</p>
              <p className="text-gray-600" style={{ lineHeight: 1.85 }}>
                Throughout it all she directed full musicals, choreographed concerts, and taught Jazz, Musical Theatre, Gospel, Soul, and Classical music to students from preschool through professional level.
              </p>
            </div>

            {/* Image */}
            <div className="flex-1 relative order-1 lg:order-2 w-full">
              <div className="relative max-w-md mx-auto">
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <ImageWithFallback
                    src={image_922e7979a32204c6013dd16962845b795b055d34}
                    alt="Omega Bone — Recording Studio"
                    className="w-full h-48 sm:h-[300px] lg:h-[400px] object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="hidden sm:block absolute -top-6 -right-6 w-48 h-48 bg-[#e8f0fe] rounded-3xl -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUPER BOWL XXVII ── */}
      <section className="relative w-full overflow-hidden bg-black">
        {/* Full-bleed image */}
        <img
          src={image_c481a4885c02af25ad9e39fce6e23bb2385a9f7d}
          alt="Omega Bone performing at Super Bowl XXVII halftime show with Michael Jackson, January 31 1993"
          className="w-full object-cover object-center"
          style={{ display: "block" }}
          loading="lazy"
        />
        {/* Bottom gradient + caption bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent px-5 py-6 sm:px-8 sm:py-10 md:px-16">
          <div className="max-w-7xl mx-auto flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
            <div>
              
              <h2 className="text-white mb-2 sm:mb-3" style={{ fontSize: "clamp(1.1rem, 3vw, 2.2rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                Super Bowl XXVII Halftime Show
              </h2>
              <p className="text-gray-300 max-w-2xl text-xs sm:text-sm" style={{ lineHeight: 1.7 }}>Omega performed alongside her idol Michael Jackson during his iconic 12-minute halftime performance watched by <span className="text-white" style={{ fontWeight: 700 }}>133.4 million U.S. viewers</span> and credited with transforming the Super Bowl halftime show into the global spectacle it is today.</p>
            </div>
            <div className="shrink-0 md:text-right">
              <p className="text-white" style={{ fontSize: "clamp(2rem, 6vw, 2.8rem)", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em" }}>133.4M</p>
              <p className="text-gray-400 text-sm mt-1" style={{ fontWeight: 500 }}>U.S. viewers</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAREER HIGHLIGHTS GRID ── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#f8faff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-[#1a56db] text-sm mb-3 uppercase tracking-widest" style={{ fontWeight: 700 }}>
              Covers & Work Performed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {careerHighlights.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-[#e8f0fe] text-[#1a56db] flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="text-black mb-2" style={{ fontWeight: 700, fontSize: "1rem" }}>
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm" style={{ lineHeight: 1.7 }}>
                  {item.description}
                </p>
                {item.title.includes("Final Fantasy") && (
                  <div className="mt-5 rounded-xl overflow-hidden">
                    <iframe
                      width="100%"
                      height="120"
                      scrolling="no"
                      frameBorder="no"
                      allow="autoplay"
                      loading="lazy"
                      src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/helghast-trooper/final-fantasy-xiv-heavensward-trailer-song&color=%231a56db&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false"
                    />
                  </div>
                )}
                {item.title.includes("Rolling in the Deep") && (
                  <div className="mt-5 rounded-xl overflow-hidden aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/X23C4tYOpD8"
                      title="Rolling in the Deep"
                      frameBorder="0"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                {item.title.includes("DARIUSBURST") && (
                  <div className="mt-5 rounded-xl overflow-hidden">
                    <iframe
                      width="100%"
                      height="120"
                      scrolling="no"
                      frameBorder="no"
                      allow="autoplay"
                      loading="lazy"
                      src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/law-mathis/dariusburst-cs-freedom%3Fin%3Ddac-c%2Fsets%2Fgc&color=%231a56db&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEACHING / MISSION ── */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Image */}
            <div className="flex-1 relative w-full">
              <div className="relative max-w-md mx-auto">
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <ImageWithFallback
                    src={image_1c57b253b147937aa36d4f7dbedaba9e269c9d51}
                    alt="Omega teaching children music"
                    className="w-full h-48 sm:h-[300px] lg:h-[400px] object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="hidden sm:block absolute -bottom-6 -left-6 w-48 h-48 bg-[#e8f0fe] rounded-3xl -z-10" />
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 max-w-xl w-full">
              <p className="text-[#1a56db] text-sm mb-3 uppercase tracking-widest" style={{ fontWeight: 700 }}>
                A Life Dedicated to a Greater Purpose.
              </p>
              <h2
                className="text-black mb-6"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}
              >
                Giving back to the community.
              </h2>
              <p className="text-gray-600 mb-5" style={{ lineHeight: 1.85 }}>She knows what it costs a child to grow up believing their voice doesn't count. And she has spent her career making sure as few people as possible carry that cost into adulthood.</p>
              <p className="text-gray-600 mb-5" style={{ lineHeight: 1.85 }}>When COVID shut the world down, she didn’t. While others paused, she opened her doors wider by running free music lessons for children in communities that needed it most. In a time of isolation, she gave them connection. In a season of uncertainty, she gave them expression.</p>
              <p className="text-gray-600 mb-8" style={{ lineHeight: 1.85 }}>Omega have taught over 7,400+ students across 25+ years. And she's not done yet.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CLOSING ── */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#1a56db] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 70%, #ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2
            className="text-white mb-6 sm:mb-8"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, lineHeight: 1.3, letterSpacing: "-0.02em" }}
          >
            Every great song starts with someone who decided they were worth hearing.
          </h2>
          <p className="text-blue-100 mb-8 sm:mb-10" style={{ lineHeight: 1.8, fontSize: "1.1rem" }}>
            Omega Bone is that reminder.
          </p>
          <a
            href="https://calendar.app.google/Y83p7Rf5idJkdzKc6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-white text-[#1a56db] px-10 py-4 rounded-full hover:bg-blue-50 transition-all hover:shadow-xl group"
            style={{ fontWeight: 700, fontSize: "1rem" }}
          >
            Book a free consultation
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}