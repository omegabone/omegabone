import image_a0eeffc9468ec5035a41189dd7938469be13b972 from 'figma:asset/a0eeffc9468ec5035a41189dd7938469be13b972.png'
import mapBgImg from 'figma:asset/370ea4e042e7dfd9e5f162661996bb28c9955f59.png';
import { useState, useEffect, useRef } from "react";
import { Play, Pause, ArrowRight, ChevronDown } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useBlogspotFeed } from "../hooks/useBlogspotFeed";

// Uploaded artwork - only these, zero generics
import polyptychPacksImg   from "figma:asset/bf71ccf46e206af137a469fa3a9b57c222a4dffc.png";
import threeCardsImg      from "figma:asset/7f5d3a5713a89639f82b5788fa352b3f73562944.png";
import producerCardImg    from "figma:asset/924927eaadd65ad3d24993f78ffc96644c980205.png";
import execCardImg        from "figma:asset/1d0ebb10d4aafb207baa0afcf1a61829fe62c559.png";
import angelCardImg       from "figma:asset/8c35eae2484411ed4985a4d004d463baeb230376.png";
import frankfurtCardImg   from "figma:asset/176b6387eb9bdd010ca730a6393ad5fbdb9a7eeb.png";
import cardSpreadImg      from "figma:asset/529dbc6cb1e2871186ead6045c7a96a1870eb206.png";
import spread1Img         from "figma:asset/98096c9050ccf81038861ce552f7938d9229ee13.png";
import spread2Img         from "figma:asset/d832ae25cbbb41a8e569cbc95e39e59aa08579ef.png";
import spread3Img         from "figma:asset/a4c5d4b333bfe28561469d55270b66e3054dde61.png";
import spread4Img         from "figma:asset/5e14efa9f585b595967f965fa54875444bfd4141.png";
import spread5Img         from "figma:asset/a3e371e0e5b9c8eda38d5b01d5922e414a433c47.png";
import spread6Img         from "figma:asset/bd19d41536800b649be2569f307b4c4beca90e61.png";
import spread7Img         from "figma:asset/ff4258b0ebd60570e7f1ecedeb33e967850f38c7.png";
import spread8Img         from "figma:asset/ac02517a69659fac39117aac5375d2f5c536abfa.png";
import spread9Img         from "figma:asset/38c1bfd2b21c95b0393dd72f2453132428942d3b.png";
import spread10Img        from "figma:asset/b82d5cf2d66a05435a1648fe2fb60a458bed7a65.png";
import horsebackImg       from "figma:asset/5f0d0523859c65f2bd5946caf2ddccadf80b1842.png";
import havanaImg          from "figma:asset/6e4012baac0aad9262bfc98358daa6bd8e105d81.png";
import lasVegasImg        from "figma:asset/7928f24453260908d030314b5822cf28d62f0ae4.png";
import dusseldorfSingImg  from "figma:asset/6433989b8c9380f13c3207d62f43a1e3d0c504c3.png";
import frankfurtPortImg   from "figma:asset/7b00d3fe89568ef422ecfdfec14bfb786c444b6e.png";
import seoulImg           from "figma:asset/72c98691a2b1f98dbaec5f79b7f37df5322ec473.png";
import seoulNewImg        from "../../assets/seoul-card-new.jpg";
import seoul6Img           from "../../assets/seoul-card-6.jpg";
import frankfurtCardNewImg from "../../assets/frankfurt-card.jpg";
import tokyoImg           from "figma:asset/4375268fa3bca2a0d727c67cf57d7a30a12c5eb3.png";
import lombokImg          from "../../assets/lombok-kuta-card.jpg";
import theFutureImg       from "figma:asset/9885ebb609a23af38de444f9fba8ed25710c5182.png";

/* ── Countdown hook ─────────────────────────────────── */
function useCountdown(targetDate: Date) {
  const calc = () => {
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  });
  return time;
}

/* ── Divider glyph ─────────────────────────────────── */
function Divider() {
  return (
    <div className="flex items-center justify-center gap-4 py-2">
      <div className="h-px w-16 bg-[#ef4444]/60" />
      <span style={{ color: "#ef4444", fontSize: "1.2rem" }}>✦</span>
      <div className="h-px w-16 bg-[#ef4444]/60" />
    </div>
  );
}

/* ── Waveform animation (decorative) ───────────────── */
function Waveform({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-end gap-[3px] h-8">
      {[5,9,14,8,12,6,10,15,7,11,13,5,9].map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full"
          style={{
            height: playing ? `${h + Math.random() * 4}px` : `${Math.max(h - 4, 3)}px`,
            background: "#ef4444",
            transition: "height 0.15s ease",
            animation: playing ? `wave ${0.4 + i * 0.05}s ease-in-out infinite alternate` : "none",
          }}
        />
      ))}
      <style>{`
        @keyframes wave {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1.2); }
        }
      `}</style>
    </div>
  );
}

/* ── World Map ──────────────────────────────────────── */
function WorldMap() {
  const toX = (lon: number) => ((lon + 180) / 360) * 1000;
  const toY = (lat: number) => ((90 - lat) / 180) * 500;
  const pts = (coords: [number, number][]) =>
    coords.map(([lon, lat]) => `${toX(lon).toFixed(1)},${toY(lat).toFixed(1)}`).join(" ");

  const lf = "#232020";
  const ls = "#3e2e2e";
  const sw = "0.8";

  const locations = [
    { name: "Newark",     country: "USA",     lon: -74.17, lat: 40.74, anchor: "start" as const, dx:  13, dy: -5 },
    { name: "Düsseldorf", country: "Germany", lon:   6.78, lat: 51.22, anchor: "start" as const, dx:  13, dy: -5 },
    { name: "Tokyo",      country: "Japan",   lon: 139.69, lat: 35.69, anchor: "end"   as const, dx: -13, dy: -5 },
  ];

  return (
    <div style={{ width: "100%", position: "relative", overflow: "hidden" }}>
      <svg
        viewBox="0 0 1000 260"
        style={{ width: "100%", height: "auto", display: "block" }}
        aria-label="World map showing Newark, Düsseldorf and Tokyo"
      >
        <defs>
          <linearGradient id="ogrd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d1622" />
            <stop offset="100%" stopColor="#060b14" />
          </linearGradient>
          <filter id="pglow" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <style>{`
            @keyframes mpp { 0% { r:5; opacity:0.85; } 100% { r:24; opacity:0; } }
            .mpr1 { animation: mpp 2.6s ease-out infinite; }
            .mpr2 { animation: mpp 2.6s ease-out infinite 1.1s; }
          `}</style>
        </defs>

        {/* Ocean */}
        <image href={mapBgImg} x="0" y="0" width="1000" height="260" preserveAspectRatio="xMidYMid slice" />

      </svg>

      {/* Top fade */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "55px", pointerEvents: "none",
        background: "linear-gradient(to bottom, #0c0c0c 0%, transparent 100%)" }} />
      {/* Bottom fade */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55px", pointerEvents: "none",
        background: "linear-gradient(to top, #0c0c0c 0%, transparent 100%)" }} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════ */
export function ComeWithMePage() {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const countdown = useCountdown(new Date("2026-03-31T23:59:59-05:00"));
  const { posts: blogPosts, isLoading: isLoadingBlog } = useBlogspotFeed("https://comewithmeseries.blogspot.com");

  const cinzel   = { fontFamily: "'Cinzel', serif" };
  const cinzelDec = { fontFamily: "'Cinzel Decorative', serif" };
  const garamond = { fontFamily: "'EB Garamond', serif" };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div style={{ background: "#0c0c0c", minHeight: "100vh", color: "#f0ead8", overflowX: "hidden" }}>

      {/* ══ HERO ═══════════════════════════════════════════════ */}
      <section style={{ minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 1.5rem 4rem" }}>
        {/* Noise texture overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")", opacity: 0.5, pointerEvents: "none" }} />
        {/* Blood-red vignette top */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "300px", background: "radial-gradient(ellipse at top, #450a0a 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: "900px", width: "100%" }}>
          {/* Eyebrow */}
          <p style={{ ...cinzel, color: "#ef4444", fontSize: "0.75rem", letterSpacing: "0.35em", marginBottom: "1.5rem", textTransform: "uppercase" }}>
            A Multinational Divorce Story
          </p>

          {/* Main title */}
          <h1
            style={{
              ...cinzelDec,
              fontSize: "clamp(3rem, 10vw, 7rem)",
              fontWeight: 700,
              color: "#f0ead8",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              marginBottom: "0.5rem",
              textShadow: "0 0 60px rgba(239,68,68,0.4)",
            }}
          >
            Come With Me
          </h1>

          <p style={{ ...cinzel, color: "#ef4444", fontSize: "clamp(0.9rem, 2.5vw, 1.3rem)", letterSpacing: "0.2em", marginBottom: "2rem" }}>
            A &nbsp;P O L Y P T Y C H
          </p>

          <Divider />

          <p style={{ ...garamond, fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", color: "#c8bfb0", lineHeight: 1.8, maxWidth: "640px", margin: "2rem auto", fontStyle: "italic" }}>One Story. Multiple Formats. Zero Compromises.</p>

          {/* Three cards image */}
          <div style={{ margin: "3rem auto 0", maxWidth: "600px" }}>
            
          </div>

          {/* Scroll cue */}
          <div style={{ marginTop: "3rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", opacity: 0.5 }}>
            <p style={{ ...cinzel, fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>Scroll</p>
            <ChevronDown size={16} style={{ animation: "bounce 2s infinite" }} />
          </div>
        </div>
        <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}`}</style>
      </section>

      {/* ══ THE STORY ══════════════════════════════════════════ */}
      <section style={{ padding: "6rem 1.5rem", textAlign: "center", position: "relative" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <p style={{ ...cinzel, color: "#ef4444", fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "3rem" }}>The Story</p>

          {["A woman.", "A foreign country.", "A husband who won't let go.", "A legal system that won't protect her."].map((line, i) => (
            <p key={i} style={{ ...garamond, fontSize: "clamp(1.4rem, 4vw, 2rem)", color: "#f0ead8", lineHeight: 1.6, marginBottom: "0.25rem" }}>
              {line}
            </p>
          ))}

          <p style={{ ...cinzelDec, fontSize: "clamp(1.8rem, 5vw, 2.8rem)", color: "#ef4444", marginTop: "1.5rem", marginBottom: "2.5rem", fontWeight: 700 }}>
            So she runs.
          </p>

          <Divider />

          <p style={{ ...garamond, fontSize: "clamp(1rem, 2.5vw, 1.25rem)", color: "#a89880", lineHeight: 1.9, marginTop: "2.5rem", fontStyle: "italic" }}>
            Come With Me is a multinational divorce story told as a metaphysical journey -
            across borders, across formats, across the full range of human endurance.
          </p>
        </div>
      </section>

      {/* ══ THE POLYPTYCH ═══════════════════════════════════════ */}
      <section style={{ padding: "4rem 1.5rem 6rem", background: "#0f0f0f" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ ...cinzel, color: "#ef4444", fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "1rem" }}>The Multiple Formats</p>
            <h2 style={{ ...cinzel, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, color: "#f0ead8", letterSpacing: "0.02em" }}>The heroine's flight across multiple objects</h2>
          </div>

          {/* Diamond packs image */}
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            
          </div>

          {/* Three format descriptions */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem" }}>
            {[
              {
                label: "The Album",
                color: "#e0dcd4",
                accent: "#555",
                description: "10 original songs. Each one a chapter marker. Each one recorded raw - bedroom studios, late nights, no budget - and now being elevated to full professional standard.",
                detail: "The rawness is preserved in the DNA.",
              },
              {
                label: "The Novel",
                color: "#c8bfb0",
                accent: "#777",
                description: "A hardback novel that carries the full weight of the journey - every border crossed, every door that closed, every silence that stretched too long.",
                detail: "The story the songs cannot hold alone.",
              },
              {
                label: "The Comic",
                color: "#ef4444",
                accent: "#ef4444",
                description: "A full-color glossy comic book. The final chapter. Not merchandise - it is the ending. Professional hands, every panel drawn and colored.",
                detail: "The visual reckoning.",
              },
            ].map((f, i) => (
              <div key={i} style={{ background: "#161616", borderRadius: "16px", padding: "2rem", border: "1px solid #1e1e1e" }}>
                
                <h3 style={{ ...cinzel, fontSize: "1.3rem", fontWeight: 700, color: f.label === "The Comic" ? "#ef4444" : "#f0ead8", marginBottom: "1rem" }}>{f.label}</h3>
                <p style={{ ...garamond, color: "#9a9080", lineHeight: 1.8, marginBottom: "1rem" }}>{f.description}</p>
                <p style={{ ...garamond, color: f.label === "The Comic" ? "#ef4444" : "#555", fontStyle: "italic", fontSize: "0.95rem" }}>{f.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONCEIVED ACROSS THREE CONTINENTS ═════════════════ */}
      <section style={{ padding: "6rem 1.5rem", position: "relative", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, #2a0505 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 10 }}>
          <p style={{ ...cinzel, color: "#ef4444", fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "1rem" }}>Origin</p>
          <h2 style={{ ...cinzel, fontSize: "clamp(1.6rem, 4vw, 2.5rem)", fontWeight: 700, color: "#f0ead8", marginBottom: "2rem" }}>
            Conceived Across Three Continents
          </h2>

          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "3rem" }}>
            <WorldMap />
          </div>

          <p style={{ ...garamond, fontSize: "clamp(1rem, 2.5vw, 1.25rem)", color: "#a89880", lineHeight: 1.9, fontStyle: "italic", marginBottom: "1.5rem" }}>
            Every demo was recorded raw - bedroom studios, late nights, no budget.
            That rawness is preserved in the DNA of the work.
          </p>

          <p style={{ ...cinzel, color: "#ef4444", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, letterSpacing: "0.1em" }}>
            Raw. &nbsp;Real.
          </p>
        </div>
      </section>

      {/* ══ PRESS TO HEAR ══════════════════════════════════════ */}
      <section style={{ padding: "4rem 1.5rem 6rem", background: "#0a0a0a", textAlign: "center" }}>
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
          <p style={{ ...cinzel, color: "#ef4444", fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "1rem" }}>The Work</p>
          <h2 style={{ ...cinzel, fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: "#f0ead8", marginBottom: "0.75rem" }}>
            Press the illustration
          </h2>
          <p style={{ ...garamond, color: "#a89880", fontStyle: "italic", marginBottom: "3rem", fontSize: "1.1rem" }}>
            Hear "I Am" and you'll understand immediately.
          </p>

          {/* Hidden audio element */}
          <audio
            ref={audioRef}
            src="/audio/i-am.mp3"
            preload="auto"
            onEnded={() => setAudioPlaying(false)}
          />

          {/* Clickable Frankfurt illustration */}
          <div
            onClick={() => {
              const audio = audioRef.current;
              if (!audio) return;
              if (audioPlaying) {
                audio.pause();
                setAudioPlaying(false);
              } else {
                audio.play().catch(() => {});
                setAudioPlaying(true);
              }
            }}
            style={{
              cursor: "pointer",
              position: "relative",
              maxWidth: "340px",
              margin: "0 auto 2rem",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: audioPlaying
                ? "0 0 60px rgba(239,68,68,0.5), 0 0 120px rgba(239,68,68,0.2)"
                : "0 20px 60px rgba(0,0,0,0.8)",
              transition: "box-shadow 0.4s ease",
              border: audioPlaying ? "1px solid #ef4444" : "1px solid #222",
            }}
          >
            <ImageWithFallback
              src={frankfurtCardImg}
              alt="Frankfurt - Come With Me illustration"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                filter: audioPlaying ? "brightness(0.85)" : "brightness(0.7)",
                transition: "filter 0.4s ease",
              }}
            />
            {/* Play / Pause overlay */}
            <div style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              background: audioPlaying ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.35)",
              transition: "background 0.4s ease",
            }}>
              <div style={{
                width: "64px", height: "64px",
                borderRadius: "50%",
                background: audioPlaying ? "#ef4444" : "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                border: "2px solid rgba(255,255,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.3s ease",
                boxShadow: audioPlaying ? "0 0 30px rgba(239,68,68,0.8)" : "none",
              }}>
                {audioPlaying
                  ? <Pause size={24} fill="white" color="white" />
                  : <Play  size={24} fill="white" color="white" style={{ marginLeft: "3px" }} />
                }
              </div>
              {audioPlaying && <Waveform playing={audioPlaying} />}
            </div>
          </div>

          {/* Track info */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
            {audioPlaying && <Waveform playing={audioPlaying} />}
            <div style={{ textAlign: "left" }}>
              <p style={{ ...cinzel, color: "#f0ead8", fontSize: "0.85rem", fontWeight: 600 }}>I Am</p>
              <p style={{ ...garamond, color: "#6b6b6b", fontSize: "0.85rem", fontStyle: "italic" }}>Come With Me - Track 04</p>
            </div>
            {audioPlaying && <Waveform playing={audioPlaying} />}
          </div>
        </div>
      </section>

      {/* ══ ALL 10 CARDS ═══════════════════════════════════════ */}
      <section style={{ padding: "5rem 1.5rem", background: "#0f0f0f" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ ...cinzel, color: "#ef4444", fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "1rem" }}>The Journey</p>
            <h2 style={{ ...cinzel, fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)", fontWeight: 700, color: "#f0ead8" }}>
              10 Songs. 10 Cities. One Escape.
            </h2>
          </div>

          {/* Row 1 - Cards 1-5 */}
          {[
            [
              { src: havanaImg,         alt: "Havana - Card 1",              rotate: "-16deg", z: 1, tx: "18px"  },
              { src: spread1Img,        alt: "Los Angeles - Card 2",         rotate: "-8deg",  z: 2, tx: "9px"   },
              { src: lasVegasImg,       alt: "Las Vegas - Card 3",           rotate: "0deg",   z: 3, tx: "0px"   },
              { src: dusseldorfSingImg, alt: "Dusseldorf - Card 4",          rotate: "8deg",   z: 2, tx: "-9px"  },
              { src: spread4Img,        alt: "Nierstein am Rhein - Card 5",  rotate: "16deg",  z: 1, tx: "-18px" },
            ],
            [
              { src: seoul6Img,         alt: "Seoul - Card 6",               rotate: "-16deg", z: 1, tx: "18px"  },
              { src: frankfurtCardNewImg, alt: "Frankfurt - Card 7",         rotate: "-8deg",  z: 2, tx: "9px"   },
              { src: tokyoImg,          alt: "Tokyo - Card 8",               rotate: "0deg",   z: 3, tx: "0px"   },
              { src: lombokImg,         alt: "Lombok - Card 9",              rotate: "8deg",   z: 2, tx: "-9px"  },
              { src: theFutureImg,      alt: "The Future - Card 10",         rotate: "16deg",  z: 1, tx: "-18px" },
            ],
          ].map((row, rowIdx) => (
            <div
              key={rowIdx}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                paddingBottom: "3rem",
                paddingTop: rowIdx === 0 ? "1rem" : "0.5rem",
                marginBottom: rowIdx === 0 ? "1.5rem" : 0,
              }}
            >
              {row.map((card, i) => (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    zIndex: card.z,
                    transform: `rotate(${card.rotate}) translateX(${card.tx})`,
                    transformOrigin: "bottom center",
                    transition: "transform 0.3s ease",
                    width: "clamp(130px, 16vw, 200px)",
                    flexShrink: 0,
                    cursor: "pointer",
                    marginLeft: i === 0 ? 0 : "-clamp(16px, 2.5vw, 32px)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = `rotate(${card.rotate}) translateX(${card.tx}) translateY(-24px) scale(1.08)`;
                    (e.currentTarget as HTMLDivElement).style.zIndex = "10";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = `rotate(${card.rotate}) translateX(${card.tx})`;
                    (e.currentTarget as HTMLDivElement).style.zIndex = String(card.z);
                  }}
                >
                  <ImageWithFallback
                    src={card.src}
                    alt={card.alt}
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      borderRadius: "10px",
                      border: "2px solid #2a2a2a",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.85), 0 4px 12px rgba(0,0,0,0.6)",
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ══ NOT A PROMISE ══════════════════════════════════════ */}
      <section style={{ padding: "6rem 1.5rem", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, #2a0505 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "680px", margin: "0 auto", position: "relative", zIndex: 10 }}>
          <Divider />
          <p style={{ ...cinzel, color: "#ef4444", fontSize: "clamp(1.1rem, 3vw, 1.6rem)", fontWeight: 700, letterSpacing: "0.05em", margin: "2rem 0 1rem" }}>
            This is not a promise.
          </p>
          <p style={{ ...cinzel, color: "#f0ead8", fontSize: "clamp(1.1rem, 3vw, 1.6rem)", fontWeight: 700, letterSpacing: "0.05em", marginBottom: "2.5rem" }}>
            The creative work is done.
          </p>
          <p style={{ ...garamond, color: "#a89880", lineHeight: 1.9, fontSize: "1.1rem", fontStyle: "italic", marginBottom: "1.5rem" }}>
            The album, novel, and comic are in final draft. What you are funding is the finishing -
            and what you receive in return is the finished collector's edition.
          </p>
          <p style={{ ...garamond, color: "#a89880", lineHeight: 1.9, fontSize: "1.1rem", fontStyle: "italic", marginBottom: "2rem" }}>
            Now being elevated to professional standard - every track recorded and mastered,
            every page of the novel edited and typeset, every panel of the comic drawn and colored
            by professional hands.
          </p>
          <p style={{ ...garamond, color: "#6b6b6b", lineHeight: 1.9, fontSize: "1rem", fontStyle: "italic" }}>
            The music, the book, and the art are not merchandise for each other - they are each other.
            The 10 songs serve as chapter markers. The comic is the final chapter. Nothing is filler.
          </p>
          <Divider />
        </div>
      </section>

      {/* ══ SCARCITY + COUNTDOWN + CTA ═════════════════════════ */}
      <section id="get-started" style={{ padding: "6rem 1.5rem", background: "#0c0c0c", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at bottom, #2a0505 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "720px", margin: "0 auto", position: "relative", zIndex: 10 }}>

          {/* Scarcity */}
          <div style={{
            background: "linear-gradient(135deg, #1a0a0a 0%, #1e1010 50%, #160808 100%)",
            border: "1px solid rgba(239,68,68,0.35)",
            borderRadius: "16px",
            padding: "1.75rem 2.25rem",
            display: "inline-block",
            marginBottom: "3rem",
            boxShadow: "0 0 40px rgba(239,68,68,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
            maxWidth: "520px",
            width: "100%",
          }}>
            {/* Counts */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.9rem" }}>
              <span style={{ ...cinzel, color: "#f0ead8", fontSize: "clamp(1.6rem, 4vw, 2.1rem)", fontWeight: 700 }}>47</span>
              <span style={{ ...cinzel, color: "#a89880", fontSize: "0.85rem" }}>of</span>
              <span style={{ ...cinzel, color: "#f0ead8", fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)", fontWeight: 700 }}>200</span>
              <span style={{ ...cinzel, color: "#a89880", fontSize: "0.82rem" }}>Supporter packages claimed</span>
            </div>

            {/* Progress bar */}
            <div style={{ width: "100%", height: "5px", background: "rgba(255,255,255,0.07)", borderRadius: "999px", overflow: "hidden", marginBottom: "0.9rem" }}>
              <div style={{
                height: "100%",
                width: "23.5%",
                background: "linear-gradient(90deg, #ef4444, #f87171)",
                borderRadius: "999px",
                boxShadow: "0 0 8px rgba(239,68,68,0.6)",
              }} />
            </div>

            <p style={{ ...cinzel, color: "#6e5e50", fontSize: "0.72rem", margin: 0, letterSpacing: "0.05em" }}>
              Only <span style={{ color: "#ef4444" }}>200</span> will ever exist. This offer closes permanently when they are gone.
            </p>
          </div>
          <style>{`
            @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
            @keyframes pingOut {
              0%   { transform: scale(0.8); opacity: 0.7; }
              100% { transform: scale(2.4); opacity: 0; }
            }
          `}</style>

          <h2 style={{ ...cinzelDec, fontSize: "clamp(1.8rem, 5vw, 3.2rem)", fontWeight: 700, color: "#f0ead8", lineHeight: 1.15, marginBottom: "1.5rem" }}>
            The gates are open now.<br />They will not stay open.
          </h2>

          <p style={{ ...garamond, color: "#a89880", lineHeight: 1.9, fontSize: "1.1rem", fontStyle: "italic", marginBottom: "3rem" }}>
            In 10 years, when this artist has a catalog, a following, and a story -
            you were there at the beginning. Your name is already part of it.
          </p>

          {/* Countdown */}
          <div style={{ marginBottom: "3rem" }}>
            <p style={{ ...cinzel, color: "#ef4444", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
              Investor Gates Close -- March 31 at Midnight EST
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
              {[
                { value: countdown.days,    label: "Days" },
                { value: countdown.hours,   label: "Hours" },
                { value: countdown.minutes, label: "Minutes" },
                { value: countdown.seconds, label: "Seconds" },
              ].map((unit, i) => (
                <div key={i} style={{ background: "#0f0f0f", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "1.25rem 1.5rem", minWidth: "90px" }}>
                  <p style={{ ...cinzel, color: "#ef4444", fontSize: "2.2rem", fontWeight: 700, lineHeight: 1, margin: 0 }}>
                    {String(unit.value).padStart(2, "0")}
                  </p>
                  <p style={{ ...cinzel, color: "#4a4a4a", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "0.4rem" }}>
                    {unit.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Email form */}
          {!submitted ? (
            null
          ) : (
            <div style={{ background: "#161616", border: "1px solid rgba(239,68,68,0.27)", borderRadius: "16px", padding: "2rem", maxWidth: "420px", margin: "0 auto" }}>
              <p style={{ ...cinzel, color: "#ef4444", fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>✦ You're in.</p>
              <p style={{ ...garamond, color: "#a89880", fontStyle: "italic" }}>Full tier details are on their way to your inbox. The gates are still open - for now.</p>
            </div>
          )}

          {/* Final line */}
          <div style={{ marginTop: "4rem" }}>
            <Divider />
            <p style={{ ...garamond, color: "#4a4a4a", fontStyle: "italic", fontSize: "0.9rem", marginTop: "1.5rem" }}>
              Collector windows on first-run artistic projects do not reopen.
            </p>
          </div>
        </div>
      </section>

      {/* ══ INVESTMENT TIERS ══════════════════════════════════ */}
      <section style={{ padding: "4rem 1.5rem 6rem", background: "#0a0a0a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ ...cinzel, color: "#ef4444", fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "1rem" }}>Investor Gates Are Open</p>
            <h2 style={{ ...cinzel, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, color: "#f0ead8", marginBottom: "1rem" }}>
              Choose Your Role in This Story
            </h2>
            <p style={{ ...garamond, color: "#6b6b6b", fontStyle: "italic", fontSize: "1rem" }}>
              Once the production budget is locked, these tiers close permanently.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", alignItems: "start" }}>

            {/* ── Witness ─────────────────────────────── */}
            <div style={{ background: "#131313", border: "1px solid #2a2a2a", borderRadius: "20px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <p style={{ ...cinzel, color: "#6b6b6b", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Tier I</p>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.5rem" }}>
                  <h3 style={{ ...cinzel, color: "#f0ead8", fontSize: "1.3rem", fontWeight: 700 }}>Witness</h3>
                  <span style={{ ...cinzel, color: "#ef4444", fontSize: "1.2rem", fontWeight: 700 }}>$150</span>
                </div>
              </div>
              <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #2a2a2a" }}>
                <ImageWithFallback src={spread7Img} alt="Witness" style={{ width: "100%", height: "auto" }} />
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem", flex: 1 }}>
                {[
                  "10-track digital album",
                  "Vinyl record",
                  "Hardback novel",
                  "Full color glossy comic book",
                ].map((item, i) => (
                  <li key={i} style={{ ...garamond, color: "#a89880", fontSize: "0.95rem", display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                    <span style={{ color: "#ef4444", flexShrink: 0, marginTop: "2px" }}>✦</span>{item}
                  </li>
                ))}
              </ul>
              <a
                href="https://www.paypal.com/ncp/payment/CVQPN7RHR5PF4"
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...cinzel, background: "#ef4444", color: "#f0ead8", borderRadius: "99px", padding: "0.85rem 1.5rem", textAlign: "center", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", textDecoration: "none", display: "block", marginTop: "auto" }}
              >
                Choose Witness
              </a>
            </div>

            {/* ── Companion ───────────────────────────── */}
            <div style={{ background: "#131313", border: "1px solid #3a2a2a", borderRadius: "20px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem", position: "relative", overflow: "visible" }}>
              {/* Signed Set badge */}
              <div style={{
                position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
                background: "#2a1a1a", border: "1px solid #ef4444", color: "#ef4444",
                padding: "0.25rem 0.9rem", borderRadius: "99px",
                fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
                whiteSpace: "nowrap", ...cinzel,
              }}>
                Signed Set
              </div>
              <div>
                <p style={{ ...cinzel, color: "#6b6b6b", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Tier II</p>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.5rem" }}>
                  <h3 style={{ ...cinzel, color: "#f0ead8", fontSize: "1.3rem", fontWeight: 700 }}>Companion</h3>
                  <span style={{ ...cinzel, color: "#ef4444", fontSize: "1.2rem", fontWeight: 700 }}>$500</span>
                </div>
              </div>
              <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #2a2a2a" }}>
                <ImageWithFallback src={spread6Img} alt="Companion" style={{ width: "100%", height: "auto" }} />
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem", flex: 1 }}>
                {[
                  { text: "10-track digital album", signed: false },
                  { text: "Signed vinyl record", signed: true },
                  { text: "Signed hardback novel", signed: true },
                  { text: "Signed full color glossy comic book", signed: true },
                  { text: "T-shirt", signed: false },
                ].map((item, i) => (
                  <li key={i} style={{ ...garamond, color: item.signed ? "#f0ead8" : "#a89880", fontSize: "0.95rem", display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                    <span style={{ color: "#ef4444", flexShrink: 0, marginTop: "2px" }}>✦</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://www.paypal.com/ncp/payment/9EDMDHLFX5LS6"
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...cinzel, background: "#ef4444", color: "#f0ead8", borderRadius: "99px", padding: "0.85rem 1.5rem", textAlign: "center", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", textDecoration: "none", display: "block", marginTop: "auto" }}
              >
                Choose Companion
              </a>
            </div>

            {/* ── Patron ──────────────────────────────── */}
            <div style={{ background: "#180606", border: "2px solid #ef4444", borderRadius: "20px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem", boxShadow: "0 0 50px rgba(239,68,68,0.2), inset 0 0 30px rgba(239,68,68,0.04)", position: "relative", overflow: "visible" }}>
              <div style={{
                position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
                background: "#ef4444", color: "#fff",
                padding: "0.25rem 0.9rem", borderRadius: "99px",
                fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
                whiteSpace: "nowrap", boxShadow: "0 4px 16px rgba(239,68,68,0.5)", ...cinzel,
              }}>
                Most Coveted
              </div>
              <div>
                <p style={{ ...cinzel, color: "#ef4444", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Tier III</p>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.5rem" }}>
                  <h3 style={{ ...cinzel, color: "#f0ead8", fontSize: "1.3rem", fontWeight: 700 }}>Patron</h3>
                  <span style={{ ...cinzel, color: "#ef4444", fontSize: "1.2rem", fontWeight: 700 }}>$1,000</span>
                </div>
              </div>
              <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #7f1d1d" }}>
                <ImageWithFallback src={spread8Img} alt="Patron" style={{ width: "100%", height: "auto" }} />
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem", flex: 1 }}>
                <li style={{ ...garamond, color: "#a89880", fontSize: "0.95rem", display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <span style={{ color: "#ef4444", flexShrink: 0, marginTop: "2px" }}>✦</span>
                  <span>Everything in <span style={{ color: "#f0ead8", fontStyle: "normal" }}>Companion</span> +</span>
                </li>
                <li style={{ ...garamond, color: "#f0ead8", fontSize: "0.95rem", display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <span style={{ color: "#ef4444", flexShrink: 0, marginTop: "2px" }}>✦</span>
                  <span>1-hour private session</span>
                </li>
              </ul>
              <a
                href="https://www.paypal.com/ncp/payment/5LPM3ZLYW8PSJ"
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...cinzel, background: "#ef4444", color: "#f0ead8", borderRadius: "99px", padding: "0.85rem 1.5rem", textAlign: "center", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", textDecoration: "none", display: "block", boxShadow: "0 0 20px rgba(239,68,68,0.45)", marginTop: "auto" }}
              >
                Choose Patron
              </a>
            </div>

            {/* ── Angel ───────────────────────────────── */}
            <div style={{ background: "#0f0d09", border: "1px solid #5a4a2a", borderRadius: "20px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem", position: "relative", overflow: "visible", boxShadow: "0 0 60px rgba(180,140,60,0.1), inset 0 0 40px rgba(180,140,60,0.03)" }}>
              {/* Only One pin */}
              <div style={{
                position: "absolute", top: "-12px", right: "16px",
                background: "linear-gradient(135deg, #b8922a, #d4aa3a)",
                color: "#0f0d09",
                padding: "0.3rem 0.85rem", borderRadius: "99px",
                fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
                boxShadow: "0 4px 16px rgba(180,140,60,0.45)", zIndex: 10, ...cinzel,
              }}>
                Only One
              </div>
              <div>
                <p style={{ ...cinzel, color: "#b8922a", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Tier IV</p>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.5rem" }}>
                  <h3 style={{ ...cinzel, color: "#f0ead8", fontSize: "1.3rem", fontWeight: 700 }}>Angel</h3>
                  <span style={{ ...cinzel, color: "#d4aa3a", fontSize: "1.2rem", fontWeight: 700 }}>$15,000</span>
                </div>
              </div>
              <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #3a2e14" }}>
                <ImageWithFallback src={horsebackImg} alt="Angel Investor" style={{ width: "100%", height: "auto" }} />
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem", flex: 1 }}>
                <li style={{ ...garamond, color: "#a89880", fontSize: "0.95rem", display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <span style={{ color: "#b8922a", flexShrink: 0, marginTop: "2px" }}>✦</span>
                  <span>Everything in <span style={{ color: "#f0ead8", fontStyle: "normal" }}>Patron</span> +</span>
                </li>
                <li style={{ ...garamond, color: "#f0ead8", fontSize: "0.95rem", display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <span style={{ color: "#b8922a", flexShrink: 0, marginTop: "2px" }}>✦</span>
                  <span>Live performance within 1 year of investment</span>
                </li>
              </ul>
              <a
                href="https://www.paypal.com/ncp/payment/5925R33FLGUQG"
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...cinzel, background: "linear-gradient(135deg, #b8922a, #d4aa3a)", color: "#0f0d09", borderRadius: "99px", padding: "0.85rem 1.5rem", textAlign: "center", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", textDecoration: "none", display: "block", boxShadow: "0 0 24px rgba(180,140,60,0.35)", marginTop: "auto" }}
              >
                Choose Angel
              </a>
            </div>

          </div>

          <p style={{ ...garamond, color: "#4a4a4a", textAlign: "center", marginTop: "2.5rem", fontStyle: "italic", fontSize: "0.95rem" }}>
            This is not a crowdfund where you get a thank-you email. You are receiving finished, premium art objects,
            the kind that sit on shelves and get passed down.
          </p>
        </div>
      </section>

      {/* ══ BLOG / DISPATCHES ═════════════════════════════════ */}
      <section style={{ padding: "5rem 1.5rem", background: "#0c0c0c" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p style={{ ...cinzel, color: "#ef4444", fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "1rem" }}>Dispatches</p>
            <h2 style={{ ...cinzel, fontSize: "clamp(1.6rem, 4vw, 2.5rem)", fontWeight: 700, color: "#f0ead8", marginBottom: "1rem" }}>
              From Behind the Work
            </h2>
            
          </div>

          {isLoadingBlog ? (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <p style={{ ...garamond, color: "#6b6b6b", fontStyle: "italic" }}>Loading dispatches...</p>
            </div>
          ) : blogPosts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <p style={{ ...garamond, color: "#6b6b6b", fontStyle: "italic" }}>No dispatches yet. Check back soon.</p>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
                {blogPosts.slice(0, 6).map((post) => (
                  <a
                    key={post.slug}
                    href={`/come-with-me/blog`}
                    style={{
                      background: "#111111",
                      border: "1px solid #1e1e1e",
                      borderRadius: "16px",
                      overflow: "hidden",
                      textDecoration: "none",
                      display: "flex",
                      flexDirection: "column",
                      transition: "border-color 0.3s, box-shadow 0.3s",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "#ef4444";
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 30px rgba(239,68,68,0.1)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1e1e1e";
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                    }}
                  >
                    {post.image && (
                      <div style={{ height: "180px", overflow: "hidden" }}>
                        <ImageWithFallback
                          src={post.image}
                          alt={post.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    )}
                    <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                        <span style={{ ...cinzel, color: "#8b1a1a", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                          {post.date}
                        </span>
                        <span style={{ ...cinzel, color: "#3a3a3a", fontSize: "0.55rem" }}>{post.readTime}</span>
                      </div>
                      <h3 style={{ ...cinzel, color: "#f0ead8", fontSize: "1rem", fontWeight: 700, lineHeight: 1.4, marginBottom: "0.6rem" }}>
                        {post.title}
                      </h3>
                      <p style={{ ...garamond, color: "#6b6b6b", fontSize: "0.9rem", lineHeight: 1.7, fontStyle: "italic", flex: 1 }}>
                        {post.excerpt}
                      </p>
                      <span style={{ ...cinzel, color: "#ef4444", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        Read <ArrowRight size={12} />
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              {blogPosts.length > 6 && (
                <div style={{ textAlign: "center", marginTop: "3rem" }}>
                  <a
                    href="/come-with-me/blog"
                    style={{
                      ...cinzel,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "#f0ead8",
                      background: "transparent",
                      border: "1px solid #2a2a2a",
                      borderRadius: "99px",
                      padding: "0.75rem 2rem",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textDecoration: "none",
                      textTransform: "uppercase",
                      transition: "border-color 0.3s",
                    }}
                  >
                    View All Dispatches <ArrowRight size={14} />
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ══ LEARN TO SING CTA ═════════════════════════════════ */}
      <section style={{ padding: "5rem 1.5rem", background: "#0a0a0a", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, #2a0505 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "640px", margin: "0 auto", position: "relative", zIndex: 10 }}>
          <Divider />
          <h2 style={{ ...cinzel, fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)", fontWeight: 700, color: "#f0ead8", marginTop: "2rem", marginBottom: "1.25rem", lineHeight: 1.3 }}>
            Would you like to create an album yourself or learn to sing?
          </h2>
          <p style={{ ...garamond, color: "#a89880", fontStyle: "italic", fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "2.5rem" }}>
            Omega Bone teaches what he practices. Start your own vocal journey.
          </p>
          <a
            href="/learn2sing"
            style={{
              ...cinzel,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#ef4444",
              color: "#f0ead8",
              borderRadius: "99px",
              padding: "0.85rem 2.5rem",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textDecoration: "none",
              textTransform: "uppercase",
              boxShadow: "0 0 30px rgba(239,68,68,0.3)",
              transition: "opacity 0.3s",
            }}
          >
            Learn to Sing <ArrowRight size={15} />
          </a>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════ */}
      <footer style={{ background: "#080808", borderTop: "1px solid #1a1a1a", padding: "2.5rem 1.5rem", textAlign: "center" }}>
        <p style={{ ...cinzel, color: "#2a2a2a", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>
          Come With Me &nbsp;✦&nbsp; A Polyptych &nbsp;✦&nbsp; © 2026 Omega Bone
        </p>
      </footer>
    </div>
  );
}