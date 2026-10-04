// Per-page title, description and canonical URL. Used twice:
// at build time (scripts/prerender.mjs writes these into each page's HTML so
// crawlers see them without running JS) and in the browser (App.tsx updates
// them on client-side navigation).
import { blogPosts } from "./data/blogPosts";

export const SITE_URL = "https://omegabone.com";
export const SITE_NAME = "Omega Bone";
const DEFAULT_IMAGE = `${SITE_URL}/images/omega-bw-portrait.png`;

export interface PageMeta {
  title: string;
  description: string;
  /** Canonical path. Defaults to the page's own path. */
  canonical?: string;
  /** Keep out of search results (paid areas, tools, forms). */
  noindex?: boolean;
  image?: string;
  type?: "website" | "article";
  /** Extra schema.org JSON-LD objects for this page. */
  jsonLd?: object[];
}

const person = {
  "@type": "Person",
  "@id": `${SITE_URL}/#omega-bone`,
  name: "Omega Bone",
  url: `${SITE_URL}/about`,
  image: DEFAULT_IMAGE,
  jobTitle: "Vocal Coach & Music Educator",
  email: "mailto:singer@omegabone.com",
  sameAs: [
    "https://www.instagram.com/omegabone",
    "https://www.tiktok.com/@vocal.mastery",
    "https://www.linkedin.com/in/omegabone/",
  ],
};

const course = (name: string, description: string, path: string) => ({
  "@type": "Course",
  name,
  description,
  url: `${SITE_URL}${path}`,
  provider: { "@id": `${SITE_URL}/#omega-bone` },
  author: { "@id": `${SITE_URL}/#omega-bone` },
});

const vmeDescription =
  "Your voice is not the obstacle. It is the answer. Vocal Mastery for Entrepreneurs is Omega Bone's voice training for founders and leaders, built around a daily protocol that fits a founder's calendar.";

// Public pages that belong in the sitemap and get prerendered.
export const PAGES: Record<string, PageMeta> = {
  "/": {
    title: "Vocal Mastery for Entrepreneurs · Omega Bone",
    description: vmeDescription,
    jsonLd: [
      { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
      person,
      course("Vocal Mastery for Entrepreneurs", vmeDescription, "/"),
    ],
  },
  "/about": {
    title: "About Omega Bone · Vocal Coach & Music Educator",
    description:
      "Omega Bone has spent 30+ years helping singers, students and entrepreneurs close the gap between what they feel inside and what the world actually hears.",
    jsonLd: [person, { "@type": "AboutPage", url: `${SITE_URL}/about`, mainEntity: { "@id": `${SITE_URL}/#omega-bone` } }],
  },
  "/Vocal_Mastery": {
    title: "Vocal Presence Coaching for Entrepreneurs · Omega Bone",
    description:
      "You have a voice worth hearing and a vision worth sharing. Omega Bone's 90-day coaching builds the vocal presence founders and leaders need to pitch, present and podcast with authority.",
    jsonLd: [
      course(
        "Vocal Presence Coaching for Entrepreneurs",
        "A 90-day vocal presence program for founders, coaches and leaders, taught by Omega Bone.",
        "/Vocal_Mastery",
      ),
    ],
  },
  "/Vocal_Mastery/blog": {
    title: "Vocal Presence Blog for Entrepreneurs · Omega Bone",
    description:
      "Insights on executive presence, vocal authority and the communication skills every entrepreneur needs to lead, sell and inspire.",
  },
  "/Learn_2_Sing": {
    title: "Learn to Sing with Omega Bone · Adult Singing Lessons",
    description:
      "Singing lessons for adults who always knew they could sing. Omega Bone teaches diction, emotional delivery and stage confidence, from first lesson to first performance.",
    jsonLd: [
      course(
        "Learn 2 Sing",
        "Singing lessons for adults covering technique, diction, emotional delivery and stage confidence, taught by Omega Bone.",
        "/Learn_2_Sing",
      ),
    ],
  },
  "/Learn_2_Sing/blog": {
    title: "Singing Tips & Vocal Technique Blog · Omega Bone",
    description:
      "Practical advice for singers, musicians and band members from 30+ years on stage, in the studio and in the classroom: warmups, high notes, stage confidence and more.",
  },
  "/Come_with_Me": {
    title: "Come With Me · Omega Bone",
    description:
      "Come With Me is a multinational divorce story told as a metaphysical journey, across borders, across formats and across the full range of human endurance. Only 1,000 will ever exist.",
  },
  "/Come_with_Me/blog": {
    title: "The Dispatch · Come With Me · Omega Bone",
    description: "News, stories and behind-the-scenes dispatches from Omega Bone's Come With Me project.",
  },
  "/Music_Room_33": {
    title: "Music Room 33 · Music Lessons & Programs with Omega Bone",
    description:
      "Your child has a voice worth hearing. Music Room 33 helps young singers find it through music, with bootcamps, courses, private sessions and live workshops led by Omega Bone.",
  },
  "/Music_Room_33/blog": {
    title: "Music Room 33 Blog · Music Education for Kids & Teens",
    description:
      "Articles for parents and educators on how music training builds confidence, discipline and a competitive edge for young performers.",
  },
  "/Professional_Experience": {
    title: "Omega Bone · Music Education Specialist",
    description:
      "Omega Bone helps schools' scholars share the music they create, singing, playing and performing, through the websites, albums and videos they produce.",
  },
  "/contact": {
    title: "Contact Omega Bone · Private Sessions, Workshops & Programs",
    description:
      "Enquire about private voice sessions, group workshops or corporate programs. Send a message and Omega Bone will get back to you personally.",
  },
  "/privacy": { title: "Privacy Policy · Omega Bone", description: "How omegabone.com collects, uses and protects your information." },
  "/terms": { title: "Terms of Service · Omega Bone", description: "Terms of service for omegabone.com and Omega Bone's programs." },
  "/cookies": { title: "Cookie Policy · Omega Bone", description: "How omegabone.com uses cookies." },
  "/disclaimer": { title: "Disclaimer · Omega Bone", description: "Disclaimer for content and programs on omegabone.com." },
};

// Reachable but kept out of search: duplicates, paid content, tools and forms.
export const UNLISTED: Record<string, PageMeta> = {
  "/frequency": { ...PAGES["/"], canonical: "/", jsonLd: undefined },
  "/frequency/vault": {
    title: "The Frequency Series · Omega Bone",
    description: "Course material for enrolled students.",
    noindex: true,
  },
  "/Vocal_Mastery/practice": { title: "Daily Warm-Up · Omega Bone", description: "Daily vocal warm-up for students.", noindex: true },
  "/Learn_2_Sing/practice": { title: "Daily Warm-Up · Omega Bone", description: "Daily vocal warm-up for students.", noindex: true },
  "/apply": { title: "Apply · Omega Bone", description: "Apply to work with Omega Bone.", noindex: true },
};

for (const post of blogPosts) {
  const path = `/Learn_2_Sing/blog/${post.slug}`;
  PAGES[path] = {
    title: `${post.title} · Omega Bone`,
    description: post.excerpt,
    image: post.image,
    type: "article",
    jsonLd: [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image: post.image,
        datePublished: new Date(post.date).toISOString().slice(0, 10),
        author: person,
        url: `${SITE_URL}${path}`,
      },
    ],
  };
}

const FALLBACK: PageMeta = {
  title: "Omega Bone · Vocal Coach & Music Educator",
  description: "Voice training with Omega Bone for entrepreneurs, singers and young performers.",
};

export function getPageMeta(pathname: string): PageMeta & { canonical: string; image: string } {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const meta = PAGES[path] ?? UNLISTED[path] ?? FALLBACK;
  return {
    type: "website",
    ...meta,
    canonical: `${SITE_URL}${meta.canonical ?? path}`,
    image: meta.image ?? DEFAULT_IMAGE,
  };
}

/** Builds the <head> tags for a page, as an HTML string (used at build time). */
export function renderHeadTags(pathname: string): string {
  const m = getPageMeta(pathname);
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const tags = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<link rel="canonical" href="${esc(m.canonical)}" />`,
    m.noindex ? `<meta name="robots" content="noindex" />` : "",
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:type" content="${m.type}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:url" content="${esc(m.canonical)}" />`,
    `<meta property="og:image" content="${esc(m.image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ];
  if (m.jsonLd?.length) {
    const json = JSON.stringify({ "@context": "https://schema.org", "@graph": m.jsonLd }).replace(/</g, "\\u003c");
    tags.push(`<script type="application/ld+json">${json}</script>`);
  }
  return tags.filter(Boolean).join("\n    ");
}

/** Applies title/description/canonical/robots in the browser after navigation. */
export function applyPageMeta(pathname: string) {
  const m = getPageMeta(pathname);
  document.title = m.title;
  const upsert = (selector: string, create: () => HTMLElement, attr: string, value: string) => {
    let el = document.head.querySelector(selector) as HTMLElement | null;
    if (!el) {
      el = create();
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  };
  const meta = (key: string, keyAttr = "name") => () => {
    const el = document.createElement("meta");
    el.setAttribute(keyAttr, key);
    return el;
  };
  upsert('meta[name="description"]', meta("description"), "content", m.description);
  upsert('link[rel="canonical"]', () => Object.assign(document.createElement("link"), { rel: "canonical" }), "href", m.canonical);
  upsert('meta[property="og:title"]', meta("og:title", "property"), "content", m.title);
  upsert('meta[property="og:description"]', meta("og:description", "property"), "content", m.description);
  upsert('meta[property="og:url"]', meta("og:url", "property"), "content", m.canonical);
  const robots = document.head.querySelector('meta[name="robots"]');
  if (m.noindex) upsert('meta[name="robots"]', meta("robots"), "content", "noindex");
  else robots?.remove();
}
