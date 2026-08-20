import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "../components/SiteHeader";

/*
  THE FREQUENCY FUNNEL — VME Landing Page
  Ported from the standalone HTML/CSS mock exactly as authored (Vintage Charm
  palette: Oxblood / Crimson / Cream / Vintage Gold / Taupe, Cinzel Decorative
  + Cinzel + EB Garamond). This page is intentionally styled differently from
  the rest of the site — the same way /Professional_Experience (cream) and /Come_with_Me
  (black) are their own worlds. No shared Navbar/Footer here on purpose.

  CSS custom properties are prefixed --freq- so they don't collide with the
  shadcn/tailwind theme tokens defined globally in src/styles/theme.css.

  VIDEO FILES live in /public/videos and /public/images:
    /videos/testimonial-sreynan-learn2sing.mp4      — Sreynan Pheap, Learn 2 Sing
    /videos/testimonial-antoine-vme.mp4             — Antoine Riendeau, Vocal Mastery for Entrepreneurs
    /videos/testimonial-irina-concert-program.mp4   — Irina Sergeeva, Live Room Concert Program
    /images/omega-bw-portrait.png
  Primary CTA points to /apply (the live intake route). The fork CTA points
  to /practice (redirects to /Vocal_Mastery/practice).
*/

const FREQUENCY_CSS = `
  :root {
    --freq-obsidian: #3F0D12;
    --freq-obsidian-2: #4A1319;
    --freq-accent: #A71D31;
    --freq-accent-bright: #C42A40;
    --freq-gold: #D5BF86;
    --freq-bronze: #8D775F;
    --freq-amber: #D5BF86;
    --freq-bone: #F1F0CC;
    --freq-bone-dim: #BAB09A;
    --freq-jewel: #8D775F;

    --freq-ground: var(--freq-obsidian);
    --freq-font-plate: 'Cinzel Decorative', serif;
    --freq-font-caps: 'Cinzel', serif;
    --freq-font-head: 'EB Garamond', serif;
    --freq-font-body: 'EB Garamond', serif;

    --freq-maxw: 1080px;
    --freq-gutter: clamp(20px, 5vw, 64px);
  }

  .freq-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .freq-root { scroll-behavior: smooth; }
  @media (prefers-reduced-motion: reduce) {
    .freq-root { scroll-behavior: auto; }
    .freq-root * { animation: none !important; transition: none !important; }
  }

  .freq-root {
    background: var(--freq-ground);
    color: var(--freq-bone);
    font-family: var(--freq-font-body);
    font-size: 19px;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    overflow-x: hidden;
  }

  .freq-root .wrap { max-width: var(--freq-maxw); margin: 0 auto; padding: 0 var(--freq-gutter); }

  .freq-root .plate {
    font-family: var(--freq-font-plate);
    font-size: clamp(11px, 1.4vw, 14px);
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--freq-gold);
    font-weight: 700;
  }
  .freq-root .eyebrow {
    font-family: var(--freq-font-caps);
    font-size: 13px;
    letter-spacing: 0.34em;
    text-transform: uppercase;
    color: var(--freq-bronze);
  }
  .freq-root h1, .freq-root h2, .freq-root h3 { font-family: var(--freq-font-head); font-weight: 600; line-height: 1.08; letter-spacing: -0.01em; }
  .freq-root h1 { font-size: clamp(40px, 7vw, 76px); }
  .freq-root h2 { font-size: clamp(30px, 4.6vw, 52px); }
  .freq-root h3 { font-size: clamp(22px, 2.6vw, 30px); }
  .freq-root .subline { font-style: italic; color: var(--freq-bone-dim); font-size: clamp(18px, 2.1vw, 23px); line-height: 1.5; }

  .freq-root .divider {
    display: flex; align-items: center; justify-content: center; gap: 22px;
    color: var(--freq-accent); margin: 0 auto; width: min(520px, 80%);
    padding: 6px 0;
  }
  .freq-root .divider::before, .freq-root .divider::after {
    content: ""; height: 1px; flex: 1;
    background: linear-gradient(90deg, transparent, var(--freq-bronze), transparent);
  }
  .freq-root .divider .star { font-size: 18px; color: var(--freq-accent); }

  .freq-root .btn-primary {
    display: inline-block; font-family: var(--freq-font-caps); font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase; font-size: 15px;
    color: var(--freq-bone); background: var(--freq-accent);
    padding: 18px 40px; border: 1px solid var(--freq-accent);
    border-radius: 2px; text-decoration: none; cursor: pointer;
    box-shadow: 0 0 0 rgba(213,191,134,0); transition: all .35s ease;
  }
  .freq-root .btn-primary:hover, .freq-root .btn-primary:focus-visible {
    background: var(--freq-accent-bright); border-color: var(--freq-gold);
    box-shadow: 0 10px 40px rgba(167,29,49,0.45), 0 0 0 1px var(--freq-gold);
    transform: translateY(-2px);
  }
  .freq-root .btn-ghost {
    display: inline-block; font-family: var(--freq-font-caps); font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase; font-size: 14px;
    color: var(--freq-gold); background: transparent;
    padding: 15px 34px; border: 1px solid var(--freq-bronze);
    border-radius: 2px; text-decoration: none; transition: all .3s ease;
  }
  .freq-root .btn-ghost:hover, .freq-root .btn-ghost:focus-visible { border-color: var(--freq-gold); color: var(--freq-bone); }
  .freq-root a:focus-visible, .freq-root button:focus-visible { outline: 2px solid var(--freq-gold); outline-offset: 3px; }

  .freq-root .cta-trust { font-style: italic; color: var(--freq-bone-dim); font-size: 15px; margin-top: 16px; }

  .freq-root section { padding: clamp(72px, 10vw, 128px) 0; position: relative; }
  .freq-root .band-dark { background: var(--freq-obsidian); }
  .freq-root .band-deep { background: radial-gradient(120% 100% at 50% 0%, #4A1319 0%, var(--freq-obsidian) 60%); }
  .freq-root .band-bone { background: var(--freq-obsidian-2); color: var(--freq-bone); }
  .freq-root .band-bone .subline { color: var(--freq-bone-dim); }
  .freq-root .band-bone .plate { color: var(--freq-gold); }

  .freq-root .sticky-cta {
    position: fixed; left: 0; right: 0; bottom: 0; z-index: 60;
    background: rgba(63,13,18,0.92); backdrop-filter: blur(8px);
    border-top: 1px solid var(--freq-bronze);
    padding: 12px 16px; display: none; text-align: center;
    transform: translateY(100%); transition: transform .4s ease;
  }
  .freq-root .sticky-cta.show { transform: translateY(0); }
  .freq-root .sticky-cta .btn-primary { display: block; padding: 15px; }
  @media (max-width: 720px) { .freq-root .sticky-cta { display: block; } .freq-root footer { padding-bottom: 120px; } }

  .freq-root .hero {
    min-height: 92vh; display: flex; align-items: center;
    background:
      radial-gradient(80% 60% at 78% 30%, rgba(167,29,49,0.16), transparent 60%),
      radial-gradient(60% 50% at 20% 90%, rgba(213,191,134,0.10), transparent 60%),
      var(--freq-obsidian);
    border-bottom: 1px solid rgba(141,119,95,0.35);
  }
  .freq-root .hero-stack { display: flex; flex-direction: column; align-items: center; text-align: center; width: 100%; }
  .freq-root .hero h1 { margin: 18px 0 0; max-width: 22ch; }
  .freq-root .hero .accent-word { color: var(--freq-gold); font-style: italic; }
  .freq-root .hero .vsl { width: 100%; max-width: 900px; margin: 40px auto 0; }
  .freq-root .hero .subline { max-width: 680px; margin: 34px auto 0; }
  .freq-root .hero-cta-row { margin-top: 34px; display: flex; flex-direction: column; align-items: center; }
  @media (max-width: 860px) {
    .freq-root .hero { min-height: auto; padding-top: 96px; padding-bottom: 64px; }
  }

  .freq-root .vsl {
    position: relative; width: 100%; aspect-ratio: 16/9; border-radius: 4px;
    background: linear-gradient(160deg, #4A1319, #3F0D12);
    border: 1px solid var(--freq-bronze);
    box-shadow: 0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(213,191,134,0.12);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px;
    overflow: hidden;
  }
  .freq-root .vsl::after {
    content: ""; position: absolute; inset: 0;
    background: radial-gradient(60% 60% at 50% 45%, rgba(167,29,49,0.18), transparent 70%);
    pointer-events: none;
  }
  .freq-root .vsl .play {
    width: 74px; height: 74px; border-radius: 50%; border: 1px solid var(--freq-gold);
    display: flex; align-items: center; justify-content: center; position: relative; z-index: 1;
    background: rgba(167,29,49,0.25);
  }
  .freq-root .vsl .play::before {
    content: ""; border-left: 20px solid var(--freq-bone); border-top: 12px solid transparent;
    border-bottom: 12px solid transparent; margin-left: 5px;
  }
  .freq-root .vsl .vsl-label { position: relative; z-index: 1; text-align: center; }

  .freq-root .authority { text-align: center; }
  .freq-root .authority h2 { margin: 22px auto 20px; max-width: 20ch; }
  .freq-root .authority .big-mark { font-family: var(--freq-font-head); color: var(--freq-gold); font-size: clamp(30px, 4.6vw, 52px); font-weight: 600; }

  .freq-root .diptych { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border: 1px solid rgba(141,119,95,0.4); border-radius: 4px; overflow: hidden; margin-top: 40px; }
  .freq-root .col { padding: clamp(26px, 4vw, 46px); }
  .freq-root .col-gap { background: #33090E; }
  .freq-root .col-signal { background: linear-gradient(180deg, rgba(167,29,49,0.10), rgba(213,191,134,0.10)); border-left: 1px solid var(--freq-bronze); }
  .freq-root .col-head { display: flex; align-items: baseline; gap: 12px; margin-bottom: 24px; }
  .freq-root .col-gap .col-head .plate { color: var(--freq-bone-dim); }
  .freq-root .pair { padding: 16px 0; border-bottom: 1px solid rgba(141,119,95,0.18); }
  .freq-root .pair:last-child { border-bottom: none; }
  .freq-root .col-gap .pair { color: var(--freq-bone-dim); }
  .freq-root .col-signal .pair { color: var(--freq-bone); }
  .freq-root .col-signal .pair strong { color: var(--freq-gold); font-weight: 500; font-style: italic; }
  .freq-root .center-narrow { max-width: 34ch; }
  @media (max-width: 720px) {
    .freq-root .diptych { grid-template-columns: 1fr; }
    .freq-root .col-signal { border-left: none; border-top: 1px solid var(--freq-bronze); }
  }

  .freq-root .mech-head { text-align: center; max-width: 22ch; margin: 18px auto 8px; }
  .freq-root .mech-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 28px; margin-top: 54px; }
  .freq-root .mech-card { border-top: 1px solid var(--freq-accent); padding-top: 22px; }
  .freq-root .mech-card .num { font-family: var(--freq-font-plate); color: var(--freq-gold); font-size: 13px; letter-spacing: 0.2em; }
  .freq-root .mech-card p { margin-top: 12px; color: var(--freq-bone-dim); }
  @media (max-width: 720px) { .freq-root .mech-grid { grid-template-columns: 1fr; gap: 30px; } }

  .freq-root .proof-head { text-align: center; margin-bottom: 46px; }
  .freq-root .proof-video { max-width: 760px; margin: 0 auto 44px; }
  .freq-root .proof-videos { display: grid; grid-template-columns: repeat(3,1fr); gap: 26px; max-width: 900px; margin: 0 auto 44px; }
  .freq-root .proof-videos .videoframe { aspect-ratio: 9/16; }
  @media (max-width: 860px) { .freq-root .proof-videos { grid-template-columns: 1fr; max-width: 340px; } }
  .freq-root .videoframe {
    position: relative; width: 100%; aspect-ratio: 16/9; border-radius: 4px; overflow: hidden;
    border: 1px solid var(--freq-bronze); background: #33090E;
    box-shadow: 0 30px 80px rgba(0,0,0,0.55);
  }
  .freq-root .videoframe video { width: 100%; height: 100%; object-fit: cover; display: block; }
  .freq-root .video-fallback {
    position: absolute; inset: 0; display: none; flex-direction: column; align-items: center; justify-content: center;
    gap: 10px; text-align: center; padding: 20px; color: var(--freq-bone-dim);
    background: radial-gradient(60% 60% at 50% 45%, rgba(167,29,49,0.16), transparent 70%), #33090E;
  }
  .freq-root .videoframe.is-missing .video-fallback { display: flex; }
  .freq-root .videoframe.is-missing video { visibility: hidden; }
  .freq-root .video-caption { text-align: center; margin-top: 16px; }
  .freq-root .video-caption .name { font-family: var(--freq-font-caps); letter-spacing: 0.18em; text-transform: uppercase; color: var(--freq-gold); font-size: 14px; }

  .freq-root .quotes { display: grid; grid-template-columns: repeat(3,1fr); gap: 26px; max-width: 900px; margin: 0 auto; }
  .freq-root .qcard { background: #33090E; border-left: 2px solid var(--freq-accent); padding: 26px 24px; border-radius: 3px; }
  .freq-root .qcard p { font-style: italic; color: var(--freq-bone); font-size: 17px; line-height: 1.55; }
  .freq-root .qcard .name { font-family: var(--freq-font-caps); letter-spacing: 0.16em; text-transform: uppercase; color: var(--freq-gold); font-size: 13px; margin-top: 18px; display: block; }
  @media (max-width: 860px) { .freq-root .quotes { grid-template-columns: 1fr; } }

  .freq-root .offer-head { text-align: center; max-width: 40ch; margin: 0 auto; }
  .freq-root .offer-list { max-width: 720px; margin: 40px auto 0; }
  .freq-root .offer-item { display: flex; gap: 16px; padding: 15px 0; border-bottom: 1px solid rgba(141,119,95,0.2); align-items: baseline; }
  .freq-root .offer-item:last-child { border-bottom: none; }
  .freq-root .offer-item .star { color: var(--freq-accent); font-size: 14px; }
  .freq-root .offer-item strong { color: var(--freq-gold); font-weight: 500; font-style: italic; }

  .freq-root .tiers { display: grid; grid-template-columns: repeat(3,1fr); gap: 22px; margin-top: 64px; align-items: stretch; }
  .freq-root .tier {
    background: #33090E; border: 1px solid rgba(141,119,95,0.4); border-radius: 4px;
    padding: 34px 28px; display: flex; flex-direction: column;
  }
  .freq-root .tier.featured {
    border-color: var(--freq-gold);
    background: linear-gradient(180deg, rgba(167,29,49,0.10), #33090E 55%);
    box-shadow: 0 24px 70px rgba(0,0,0,0.5);
    transform: translateY(-10px);
  }
  .freq-root .tier .tier-plate { margin-bottom: 6px; }
  .freq-root .tier .rec { display: inline-block; font-family: var(--freq-font-caps); font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--freq-obsidian); background: var(--freq-gold); padding: 4px 12px; border-radius: 2px; margin-bottom: 14px; }
  .freq-root .tier h3 { margin-bottom: 10px; }
  .freq-root .tier .who { color: var(--freq-bone-dim); font-style: italic; font-size: 16px; min-height: 3em; }
  .freq-root .tier .price { font-family: var(--freq-font-head); color: var(--freq-gold); font-size: 30px; margin: 20px 0 6px; }
  .freq-root .tier .price .small { font-size: 15px; color: var(--freq-bone-dim); font-style: italic; }
  .freq-root .tier ul { list-style: none; margin: 14px 0 24px; }
  .freq-root .tier li { padding: 8px 0 8px 22px; position: relative; font-size: 16px; color: var(--freq-bone-dim); border-bottom: 1px solid rgba(141,119,95,0.12); }
  .freq-root .tier li::before { content: "✦"; position: absolute; left: 0; color: var(--freq-accent); font-size: 11px; top: 11px; }
  .freq-root .tier .tier-cta { margin-top: auto; }
  .freq-root .tier .tier-cta a { width: 100%; text-align: center; }
  @media (max-width: 860px) {
    .freq-root .tiers { grid-template-columns: 1fr; }
    .freq-root .tier.featured { transform: none; }
  }

  .freq-root .course-start { max-width: 460px; margin: 48px auto 0; }
  .freq-root .course-start .tier .who { min-height: 0; }

  .freq-root .centered { text-align: center; }
  .freq-root .risk h2 { max-width: 22ch; margin: 18px auto 22px; }
  .freq-root .risk p { max-width: 60ch; margin: 0 auto; color: var(--freq-bone-dim); }
  .freq-root .scarcity p { max-width: 58ch; margin: 0 auto; text-align: center; color: var(--freq-bone-dim); font-style: italic; }

  .freq-root .story-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: clamp(28px,5vw,60px); align-items: center; }
  .freq-root .portrait {
    aspect-ratio: 4/5; border-radius: 4px; border: 1px solid var(--freq-bronze);
    overflow: hidden; background: #2a0a0e;
    box-shadow: 0 30px 80px rgba(0,0,0,0.5);
  }
  .freq-root .portrait img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; display: block; }
  .freq-root .story-quote { font-size: clamp(21px, 2.6vw, 28px); line-height: 1.5; }
  .freq-root .story-quote .lead { color: var(--freq-gold); }
  @media (max-width: 780px) { .freq-root .story-grid { grid-template-columns: 1fr; } .freq-root .portrait { max-width: 320px; } }

  .freq-root .faq-head { text-align: center; margin-bottom: 40px; }
  .freq-root .faq { max-width: 760px; margin: 0 auto; }
  .freq-root .qa { border-bottom: 1px solid rgba(141,119,95,0.28); }
  .freq-root .qa button {
    width: 100%; text-align: left; background: none; border: none; color: var(--freq-bone);
    font-family: var(--freq-font-head); font-size: clamp(19px,2.2vw,23px); padding: 24px 40px 24px 0;
    cursor: pointer; position: relative; line-height: 1.3;
  }
  .freq-root .qa button::after { content: "+"; position: absolute; right: 4px; top: 22px; color: var(--freq-gold); font-size: 26px; transition: transform .3s ease; }
  .freq-root .qa.open button::after { content: "–"; }
  .freq-root .qa .ans { max-height: 0; overflow: hidden; transition: max-height .35s ease; }
  .freq-root .qa .ans p { padding: 0 0 24px; color: var(--freq-bone-dim); max-width: 62ch; }

  .freq-root .final { text-align: center; background: radial-gradient(90% 70% at 50% 20%, rgba(167,29,49,0.16), transparent 60%), var(--freq-obsidian); }
  .freq-root .final h2 { max-width: 20ch; margin: 20px auto 22px; }
  .freq-root .final .subline { max-width: 46ch; margin: 0 auto 40px; }

  .freq-root .fork { text-align: center; border-top: 1px solid rgba(141,119,95,0.35); }
  .freq-root .fork .plate { color: var(--freq-bronze); }
  .freq-root .fork p { color: var(--freq-bone-dim); font-style: italic; max-width: 50ch; margin: 14px auto 26px; }
  .freq-root .fork-video { max-width: 620px; margin: 34px auto 0; }

  .freq-root footer { padding: 46px 0 70px; text-align: center; color: var(--freq-bronze); border-top: 1px solid rgba(141,119,95,0.25); }
  .freq-root footer .plate { color: var(--freq-bronze); }
  .freq-root footer .fine { font-size: 14px; margin-top: 14px; font-style: italic; }

  .freq-root .fade { opacity: 0; transform: translateY(18px); transition: opacity .8s ease, transform .8s ease; }
  .freq-root .fade.in { opacity: 1; transform: none; }
`;

export function FrequencyPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleFreeLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Subscribe failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  // Title / meta, restored on unmount
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Vocal Mastery for Entrepreneurs · Omega Bone";

    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const prevDesc = metaDesc?.content ?? "";
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content =
      "Your voice is not the obstacle. It is the answer. Vocal Mastery for Entrepreneurs with Omega Bone.";

    return () => {
      document.title = prevTitle;
      if (metaDesc) metaDesc.content = prevDesc;
    };
  }, []);

  // Ported vanilla JS: FAQ accordion, sticky CTA reveal, scroll reveal, video fallback
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cleanups: Array<() => void> = [];

    // FAQ accordion
    root.querySelectorAll<HTMLButtonElement>(".qa button").forEach((btn) => {
      const handler = () => {
        const qa = btn.parentElement as HTMLElement;
        const ans = qa.querySelector(".ans") as HTMLElement;
        const open = qa.classList.toggle("open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        ans.style.maxHeight = open ? `${ans.scrollHeight}px` : "0";
      };
      btn.addEventListener("click", handler);
      cleanups.push(() => btn.removeEventListener("click", handler));
    });

    // Sticky CTA reveal after hero scrolls away
    const sticky = root.querySelector("#freq-sticky-cta");
    const hero = root.querySelector("#freq-top");
    if (sticky && hero && "IntersectionObserver" in window) {
      const stickyObserver = new IntersectionObserver(
        (entries) => sticky.classList.toggle("show", !entries[0].isIntersecting),
        { threshold: 0.1 }
      );
      stickyObserver.observe(hero);
      cleanups.push(() => stickyObserver.disconnect());
    }

    // Scroll reveal
    const fadeEls = root.querySelectorAll(".fade");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      fadeEls.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    } else {
      fadeEls.forEach((el) => el.classList.add("in"));
    }

    // Graceful video fallback if a source file is missing
    root.querySelectorAll<HTMLVideoElement>(".videoframe video").forEach((v) => {
      const errorHandler = () => v.closest(".videoframe")?.classList.add("is-missing");
      v.addEventListener("error", errorHandler);
      cleanups.push(() => v.removeEventListener("error", errorHandler));

      const src = v.querySelector("source");
      if (src) {
        const test = new XMLHttpRequest();
        try {
          test.open("HEAD", (src as HTMLSourceElement).src, true);
          test.onreadystatechange = () => {
            if (test.readyState === 4 && (test.status === 0 || test.status >= 400)) {
              v.closest(".videoframe")?.classList.add("is-missing");
            }
          };
          test.send();
        } catch {
          // local file protocol may block HEAD; error handler covers it
        }
      }
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div className="freq-root" ref={rootRef}>
      <style>{FREQUENCY_CSS}</style>
      <SiteHeader theme="cwm" />

      {/* ================= HERO / ANCHOR ================= */}
      <header className="hero" id="freq-top">
        <div className="wrap">
          <div className="hero-stack">
            <span className="plate">Vocal Mastery for Entrepreneurs</span>
            <h1>Your voice is not the obstacle. It is the <span className="accent-word">answer</span>.</h1>

            {/* THE TRANSMISSION — main VSL, hosted on YouTube (unlisted) */}
            <div className="vsl" style={{ aspectRatio: "1920 / 1246" }}>
              <iframe
                src="https://www.youtube.com/embed/nPGkC8zPkr4"
                title="The Transmission — Omega Bone"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, zIndex: 1 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <p className="subline">I am a singer from Los Angeles, with a team of musicians, engineers, and producers behind me. We take artists and messengers who carry something the world needs to hear, and clear everything between them and the sound they were born to make.</p>
            <div className="hero-cta-row">
              <a className="btn-primary" href="https://calendar.app.google/Y83p7Rf5idJkdzKc6" target="_blank" rel="noopener noreferrer">Book Your Frequency Call</a>
              <span className="cta-trust">Private. Twenty minutes. No pitch you have to sit through.</span>
            </div>
          </div>
        </div>
      </header>

      {/* ================= AUTHORITY ================= */}
      <section className="band-deep authority fade">
        <div className="wrap">
          <div className="big-mark">1993 &middot; The Rose Bowl &middot; Ninety thousand people</div>
          <h2>I was on that stage with Michael Jackson.</h2>
          <p className="subline center-narrow" style={{ margin: "0 auto" }}>I did not just hear his frequency. I felt it in my chest before I saw him. That is the state I have spent twenty-five years learning to build in other people.</p>
        </div>
      </section>

      <div className="divider" aria-hidden="true"><span className="star">✦</span></div>

      {/* ================= TRANSFORMATION ================= */}
      <section className="band-dark fade">
        <div className="wrap centered">
          <span className="plate">The distance you are buying</span>
          <h2 style={{ marginTop: 16 }}>From the gap to the signal.</h2>
        </div>
        <div className="wrap">
          <div className="diptych">
            <div className="col col-gap">
              <div className="col-head"><span className="plate">The gap</span></div>
              <div className="pair">You knew the idea was right. The room did not receive it the way it lived in you.</div>
              <div className="pair">You overexplain, because part of you is not sure you will be believed.</div>
              <div className="pair">Your voice tightens at the exact moment the stakes rise.</div>
              <div className="pair">You prepared everything except the instrument delivering it.</div>
              <div className="pair">The room hears hesitation where there is magnitude.</div>
            </div>
            <div className="col col-signal">
              <div className="col-head"><span className="plate" style={{ color: "var(--freq-gold)" }}>The signal</span></div>
              <div className="pair"><strong>The idea lands the first time, at the weight you feel it.</strong></div>
              <div className="pair"><strong>You say less. The room leans in.</strong></div>
              <div className="pair"><strong>Your voice steadies precisely when it matters most.</strong></div>
              <div className="pair"><strong>The instrument is prepared before you walk in.</strong></div>
              <div className="pair"><strong>The room hears authority, because that is now what you transmit.</strong></div>
            </div>
          </div>
          <div className="centered" style={{ marginTop: 44 }}>
            <a className="btn-primary" href="/apply">Close the gap</a>
          </div>
        </div>
      </section>

      <div className="divider" aria-hidden="true"><span className="star">✦</span></div>

      {/* ================= MECHANISM ================= */}
      <section className="band-deep fade">
        <div className="wrap">
          <div className="centered"><span className="plate">Why this is different</span></div>
          <h2 className="mech-head centered">Most coaching teaches technique. Technique is not the problem.</h2>
          <div className="mech-grid">
            <div className="mech-card">
              <p>Your voice stores everything. Every room where you made yourself small is still running as interference.</p>
            </div>
            <div className="mech-card">
              <p>You cannot breathe your way out of a belief. Technique on top of interference is a louder version of the same block.</p>
            </div>
            <div className="mech-card">
              <p>The work is not to build a new voice. It is to remove what is blocking the one you already are.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" aria-hidden="true"><span className="star">✦</span></div>

      {/* ================= PROOF ================= */}
      <section className="band-dark fade">
        <div className="wrap">
          <div className="proof-head">
            <span className="plate">The proof</span>
            <h2 style={{ marginTop: 16 }}>It changes people. In their own words.</h2>
          </div>

          {/* VIDEO TESTIMONIALS — /public/videos/testimonial-*.mp4 (vertical 9:16) */}
          <div className="proof-videos">
            <div className="proof-video-item">
              <div className="videoframe" data-name="Sreynan Pheap">
                <video controls playsInline preload="metadata">
                  <source src="/videos/testimonial-sreynan-learn2sing.mp4" type="video/mp4" />
                </video>
                <div className="video-fallback">
                  <div className="play" style={{ width: 60, height: 60, border: "1px solid var(--freq-gold)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(167,29,49,0.25)" }} />
                  <div className="plate" style={{ color: "var(--freq-gold)" }}>Sreynan Pheap, video testimonial</div>
                </div>
              </div>
              <div className="video-caption">
                <span className="name">Sreynan Pheap</span>
                <div className="subline" style={{ fontSize: 13, marginTop: 4 }}>Learn 2 Sing</div>
              </div>
            </div>

            <div className="proof-video-item">
              <div className="videoframe" data-name="Antoine Riendeau">
                <video controls playsInline preload="metadata">
                  <source src="/videos/testimonial-antoine-vme.mp4" type="video/mp4" />
                </video>
                <div className="video-fallback">
                  <div className="play" style={{ width: 60, height: 60, border: "1px solid var(--freq-gold)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(167,29,49,0.25)" }} />
                  <div className="plate" style={{ color: "var(--freq-gold)" }}>Antoine Riendeau, video testimonial</div>
                </div>
              </div>
              <div className="video-caption">
                <span className="name">Antoine Riendeau</span>
                <div className="subline" style={{ fontSize: 13, marginTop: 4 }}>Vocal Mastery for Entrepreneurs</div>
              </div>
            </div>

            <div className="proof-video-item">
              <div className="videoframe" data-name="Irina Sergeeva">
                <video controls playsInline preload="metadata">
                  <source src="/videos/testimonial-irina-concert-program.mp4" type="video/mp4" />
                </video>
                <div className="video-fallback">
                  <div className="play" style={{ width: 60, height: 60, border: "1px solid var(--freq-gold)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(167,29,49,0.25)" }} />
                  <div className="plate" style={{ color: "var(--freq-gold)" }}>Irina Sergeeva, video testimonial</div>
                </div>
              </div>
              <div className="video-caption">
                <span className="name">Irina Sergeeva</span>
                <div className="subline" style={{ fontSize: 13, marginTop: 4 }}>Live Room Concert Program</div>
              </div>
            </div>
          </div>

          <div className="quotes">
            <div className="qcard">
              <p>"Within this class, within the past six weeks, my voice has definitely improved. I'm more inspired to practice every single day."</p>
              <span className="name">Desiree Haussler</span>
            </div>
            <div className="qcard">
              <p>"The significant changes would be how to control the top voices, the breath, the diction, and the emotion, to be accurate and projected."</p>
              <span className="name">Richie Chong</span>
            </div>
            <div className="qcard">
              <p>"I am no longer camera shy and I am finally having the confidence to sing in front of my family and sharing video of me singing."</p>
              <span className="name">Amirah Mustaffa</span>
            </div>
          </div>

          <div className="centered" style={{ marginTop: 44 }}>
            <a className="btn-primary" href="https://calendar.app.google/Y83p7Rf5idJkdzKc6" target="_blank" rel="noopener noreferrer">Book Your Frequency Call</a>
          </div>
        </div>
      </section>

      <div className="divider" aria-hidden="true"><span className="star">✦</span></div>

      {/* ================= THE HOUSE (team) ================= */}
      <section className="band-dark fade">
        <div className="wrap">
          <div className="centered"><span className="plate">You are not doing this alone</span></div>
          <h2 className="mech-head centered" style={{ maxWidth: "26ch" }}>A singer from Los Angeles, and a house behind her.</h2>
          <p className="subline centered" style={{ maxWidth: "62ch", margin: "18px auto 0" }}>I came up as a singer in Los Angeles. Over the years I built something around the work: a team of musicians, engineers, and producers who know how to take a new artist and bring them to their highest potential. When you work with me, you are not hiring a coach. You are stepping into a house.</p>
          <div className="mech-grid">
            <div className="mech-card">
              <span className="num">Musicians</span>
              <p>Players who build the sound around your voice, so what you hear inside your head finally exists in the air.</p>
            </div>
            <div className="mech-card">
              <span className="num">Engineers</span>
              <p>The hands that capture the signal cleanly and hold back nothing of what you actually sound like.</p>
            </div>
            <div className="mech-card">
              <span className="num">Producers</span>
              <p>The vision that shapes a body of work, so a voice becomes a record, a show, a moment people remember.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" aria-hidden="true"><span className="star">✦</span></div>

      {/* ================= OFFER ================= */}
      <section className="band-deep fade">
        <div className="wrap">
          <div className="centered"><span className="plate">The mentorship</span></div>
          <h2 className="offer-head centered" style={{ marginTop: 16 }}>Four months. From the gap to the signal.</h2>
          <p className="subline offer-head centered" style={{ margin: "16px auto 0" }}>Built around your voice, your message, and the sound you are reaching for. With the house behind you the whole way.</p>

          <div className="offer-list">
            <div className="offer-item"><span className="star">✦</span><div>A <strong>warmup protocol built for your voice</strong> and your patterns of tension, not a generic scale.</div></div>
            <div className="offer-item"><span className="star">✦</span><div>The <strong>speaking-voice mechanics that hold under pressure</strong>, so your voice steadies when the stakes rise.</div></div>
            <div className="offer-item"><span className="star">✦</span><div><strong>Diction that makes you understood the first time</strong>, without repeating yourself.</div></div>
            <div className="offer-item"><span className="star">✦</span><div>A <strong>pre-performance state ritual</strong>, so you walk in already regulated.</div></div>
            <div className="offer-item"><span className="star">✦</span><div><strong>Stage and room presence</strong>, so your body tells the right story before you speak.</div></div>
            <div className="offer-item"><span className="star">✦</span><div>The <strong>Six-Song Standard</strong>, the culmination the entire method builds toward.</div></div>
          </div>

          <div className="course-start">
            <div className="tier">
              <span className="plate tier-plate">The Frequency Series</span>
              <h3>Self-Paced Video Course</h3>
              <p className="who">For the messenger who wants to start clearing the signal before they ever step into a room with me.</p>
              <div className="price">$500<span className="small"> one time</span></div>
              <div className="price small">Five modules, worked on your own time</div>
              <ul>
                <li>Five video modules: the warmup, the speaking voice, diction, emotional delivery, the stage</li>
                <li>The companion text, Vocal Mastery for Entrepreneurs, included</li>
                <li>Your first move toward the Live Room and the Inner Circle, at your own pace</li>
              </ul>
              <div className="tier-cta">
                <a
                  className="btn-primary"
                  href="https://www.paypal.com/ncp/payment/WB7JGER2N3BTU"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Begin the course
                </a>
              </div>
            </div>
          </div>

          <div className="divider" style={{ margin: "48px auto" }} aria-hidden="true"><span className="star">✦</span></div>

          <div className="tiers">
            <div className="tier">
              <h3>The Live Room</h3>
              <p className="who">For the artist who wants transformation with the momentum of a room.</p>
              <div className="price">$5,000</div>
              <div className="price small">Group cohort, capped at ten</div>
              <ul>
                <li>The full method across the cohort arc</li>
                <li>Weekly live work, every voice still heard</li>
                <li>The Six-Song Standard as the finish line</li>
              </ul>
              <div className="tier-cta"><a className="btn-ghost" href="/apply">Enter the room</a></div>
            </div>

            <div className="tier featured">
              <span className="rec">Recommended</span>
              <h3>The Inner Circle</h3>
              <p className="who">For the messenger whose calling is too important to be misheard.</p>
              <div className="price">$18,000<span className="small"> to $25,000</span></div>
              <div className="price small">Private, capped at five clients</div>
              <ul>
                <li>Built entirely around your voice and your rooms</li>
                <li>A warmup protocol that is yours alone</li>
                <li>Your pre-performance state ritual</li>
                <li>Direct access across four months</li>
              </ul>
              <div className="tier-cta"><a className="btn-primary" href="https://calendar.app.google/Y83p7Rf5idJkdzKc6" target="_blank" rel="noopener noreferrer">Book Your Frequency Call</a></div>
            </div>

            <div className="tier">
              <h3>The Frequency Tower</h3>
              <p className="who">For the artist building a body of work, and a life, around the sound.</p>
              <div className="price">By application</div>
              <div className="price small">The flagship, strictly limited</div>
              <ul>
                <li>The four-month intensive, voice and vision at once</li>
                <li>The full house behind you: musicians, engineers, producers</li>
                <li>Toward a record, a show, a moment that lasts a lifetime</li>
              </ul>
              <div className="tier-cta"><a className="btn-ghost" href="https://calendar.app.google/Y83p7Rf5idJkdzKc6" target="_blank" rel="noopener noreferrer">Request an application</a></div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" aria-hidden="true"><span className="star">✦</span></div>

      {/* ================= RISK REVERSAL ================= */}
      <section className="band-dark risk centered fade">
        <div className="wrap">
          <span className="plate">The promise</span>
          <h2>You will hear the difference, or we keep working.</h2>
          <p>Do the work in the first month, the exercises, the recordings, the sessions, and if you and I do not both hear your signal change, I continue with you at no additional cost until we do. I do not lose students to the work not landing. I lose them to the work not being done.</p>
        </div>
      </section>

      {/* ================= SCARCITY ================= */}
      <section className="band-deep scarcity fade" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="divider" style={{ marginBottom: 48 }} aria-hidden="true"><span className="star">✦</span></div>
          <p>The private tier holds a limited number of clients at a time, because the work is built for each voice individually. When it is full, it is full. The next opening is a genuine wait.</p>
        </div>
      </section>

      {/* ================= STORY ================= */}
      <section className="band-bone fade">
        <div className="wrap">
          <div className="story-grid">
            <div className="portrait">
              <img src="/images/omega-bw-portrait.png" alt="Omega Bone" />
            </div>
            <div>
              <span className="plate">The why beneath the work</span>
              <p className="story-quote" style={{ marginTop: 20 }}><span className="lead">"I spent years believing I taught singing.</span> Slowly, across five countries and thousands of hours, I understood I was teaching something else. I was teaching people to stop being afraid of being heard. Your frequency is real. My whole work is clearing the interference so it finally reaches the room."</p>
              <div style={{ marginTop: 34 }}><a className="btn-primary" href="https://calendar.app.google/Y83p7Rf5idJkdzKc6" target="_blank" rel="noopener noreferrer">Book Your Frequency Call</a></div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" aria-hidden="true"><span className="star">✦</span></div>

      {/* ================= FAQ ================= */}
      <section className="band-dark fade">
        <div className="wrap">
          <div className="faq-head">
            <span className="plate">Before you decide</span>
            <h2 style={{ marginTop: 16 }}>The questions that matter.</h2>
          </div>
          <div className="faq">
            <div className="qa">
              <button aria-expanded="false">I am not a singer. I have something to say.</button>
              <div className="ans"><p>Then this is for you. The method works on the voice itself, sung or spoken. Whether you are stepping to a microphone, a stage, or a room that needs to hear your message, the interference is the same and the work is the same.</p></div>
            </div>
            <div className="qa">
              <button aria-expanded="false">I have tried voice or presence coaching before.</button>
              <div className="ans"><p>Then you were likely taught technique on top of interference. This program clears the interference first. That is the difference you felt in the video.</p></div>
            </div>
            <div className="qa">
              <button aria-expanded="false">I do not have hours a day.</button>
              <div className="ans"><p>Five minutes daily beats one long session a week, and the math is not subtle. The protocol is built for a founder's calendar.</p></div>
            </div>
            <div className="qa">
              <button aria-expanded="false">What actually happens on the call.</button>
              <div className="ans"><p>Twenty minutes. You describe the rooms that matter to you. I tell you honestly whether this work will move them. If it will not, I say so.</p></div>
            </div>
            <div className="qa">
              <button aria-expanded="false">Is this remote or in person.</button>
              <div className="ans"><p>It's both. The first week in The Frequency Tower is in person. From there we schedule the rest of the meetings, online and in person. The week of the recordings or the concert is in person as well.</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL ANCHOR ================= */}
      <section className="final fade">
        <div className="wrap">
          <span className="plate">One last thing</span>
          <h2>Your voice is not broken. It is not behind. It is the thing you are.</h2>
          <p className="subline">When it is free, the right rooms and the right life find you. Let us free it.</p>
          <a className="btn-primary" href="https://calendar.app.google/Y83p7Rf5idJkdzKc6" target="_blank" rel="noopener noreferrer">Book Your Frequency Call</a>
        </div>
      </section>

      {/* ================= FORK (not ready) ================= */}
      <section className="band-deep fork fade">
        <div className="wrap">
          <span className="plate">Not ready to talk yet</span>
          <p>Start with one free lesson from the Frequency Series.</p>

          <div className="fork-video">
            {status === "success" ? (
              <p className="subline" style={{ color: "var(--freq-gold)" }}>
                Check your inbox — the lesson is on its way.
              </p>
            ) : (
              <form
                onSubmit={handleFreeLessonSubmit}
                style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}
              >
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: "1 1 260px",
                    minWidth: 0,
                    padding: "15px 20px",
                    fontFamily: "var(--freq-font-body)",
                    fontSize: 16,
                    color: "var(--freq-bone)",
                    background: "#33090E",
                    border: "1px solid var(--freq-bronze)",
                    borderRadius: 2,
                    outline: "none",
                  }}
                />
                <button type="submit" className="btn-primary" disabled={status === "submitting"}>
                  {status === "submitting" ? "Sending…" : "Send Me the Free Lesson"}
                </button>
                {status === "error" && (
                  <p className="subline" style={{ width: "100%", color: "var(--freq-gold)", fontSize: 14 }}>
                    Something went wrong — try again in a moment.
                  </p>
                )}
              </form>
            )}
          </div>

          <div style={{ marginTop: 28 }}>
            <a
              className="btn-ghost"
              href="https://www.paypal.com/ncp/payment/WB7JGER2N3BTU"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get the full course
            </a>
          </div>
        </div>
      </section>

      <footer>
        <span className="plate">Omega Bone &middot; Vocal Mastery for Entrepreneurs</span>
        <p className="fine">Your voice is not the obstacle. It is the answer.</p>
      </footer>

      {/* Sticky mobile CTA */}
      <div className="sticky-cta" id="freq-sticky-cta">
        <a className="btn-primary" href="https://calendar.app.google/Y83p7Rf5idJkdzKc6" target="_blank" rel="noopener noreferrer">Book Your Frequency Call</a>
      </div>
    </div>
  );
}
