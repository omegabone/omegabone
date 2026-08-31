import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";

/*
  Access-gated vault for "Vocal Mastery for Entrepreneurs: The Frequency Series".
  Casual gate only (client-side) — matches the rest of this Vite SPA, no backend.

  TO CHANGE THE PASSWORD: edit VAULT_PASSWORD below.
  TO ADD THE 5 COURSE VIDEOS: once each is uploaded to YouTube as "Unlisted",
  paste its video ID into the matching entry in VIDEOS below (the id is the
  part after "v=" or after "youtu.be/" in the share URL).

  ACCESS TIERS: besides the "unlock all 5" password, the vault reads a
  `?access=` query param so a purchase can land someone straight on the
  right unlocked view with no password at all:
    ?access=l2s    — Learn 2 Sing book only, everything else locked
    ?access=vme    — Vocal Mastery for Entrepreneurs book only, everything else locked
    ?access=books  — both books, all videos still locked (buying either book
                     is a bundle — see PayPalBookButton — so this is the
                     normal post-purchase landing tier)
    ?access=all    — same as the password: everything unlocked
    (no param)     — default: Video 1 free, everything else locked
  Point a PayPal hosted button's "return to website" URL at one of these
  (e.g. https://omegabone.com/frequency/vault?access=books) to skip the
  password step for buyers entirely.
*/

const VAULT_PASSWORD = "frequency5";

type AccessTier = "free" | "l2s" | "vme" | "books" | "all";

function readAccessTier(): AccessTier {
  const raw = new URLSearchParams(window.location.search).get("access");
  if (raw === "l2s" || raw === "vme" || raw === "books" || raw === "all") return raw;
  return "free";
}

const cinzel = { fontFamily: "'Cinzel', serif" };
const cinzelDec = { fontFamily: "'Cinzel Decorative', serif" };
const garamond = { fontFamily: "'EB Garamond', serif" };

const GOLD = "#d4aa3a";
const GOLD_DIM = "#b8922a";
const CREAM = "#f0ead8";

const VIDEOS = [
  { n: 1, title: "The Warmup", youtubeId: "9mUzYjbEd_E" },
  { n: 2, title: "The Speaking Voice", youtubeId: "" },
  { n: 3, title: "Diction", youtubeId: "" },
  { n: 4, title: "Emotional Delivery", youtubeId: "" },
  { n: 5, title: "The Stage", youtubeId: "" },
];

const BOOKS = [
  {
    title: "Learn 2 Sing",
    subtitle: "The complete method, from first breath to full performance.",
    href: "/resources/learn-2-sing.pdf",
  },
  {
    title: "Vocal Mastery for Entrepreneurs",
    subtitle: "The companion text to The Frequency Series.",
    href: "/resources/vocal-mastery-for-entrepreneurs.pdf",
  },
];

function InlineUnlock({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim().toLowerCase() === VAULT_PASSWORD.toLowerCase()) {
      sessionStorage.setItem("vault-unlocked", "1");
      onUnlock();
    } else {
      setError(true);
    }
  }

  return (
    <form
      onSubmit={submit}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        justifyContent: "center",
        marginTop: "1.25rem",
      }}
    >
      <input
        type="password"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setError(false);
        }}
        placeholder="Have the password? Unlock all 5"
        style={{
          flex: "1 1 220px",
          minWidth: 0,
          boxSizing: "border-box",
          background: "#0f0f0f",
          border: `1px solid ${error ? "#ef4444" : "#2a2a2a"}`,
          borderRadius: 10,
          padding: "0.85rem 1rem",
          color: CREAM,
          fontSize: "1rem",
          ...garamond,
        }}
      />
      <button
        type="submit"
        style={{
          ...cinzel,
          background: `linear-gradient(135deg, ${GOLD_DIM}, ${GOLD})`,
          color: "#0f0d09",
          border: "none",
          borderRadius: 99,
          padding: "0.9rem 1.5rem",
          fontSize: "0.78rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          cursor: "pointer",
        }}
      >
        UNLOCK
      </button>
      {error && (
        <div style={{ width: "100%", color: "#ef4444", fontSize: "0.85rem", ...garamond }}>
          That password isn't right — try again.
        </div>
      )}
    </form>
  );
}

function VideoCard({ n, title, youtubeId, locked }: { n: number; title: string; youtubeId: string; locked: boolean }) {
  return (
    <div
      style={{
        background: "#131313",
        border: "1px solid #2a2a2a",
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", width: "100%", aspectRatio: "1920 / 1246", background: "#000" }}>
        {locked ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              color: GOLD_DIM,
            }}
          >
            <div style={{ fontSize: "1.5rem" }}>🔒</div>
            <div style={{ ...cinzel, fontSize: "0.72rem", letterSpacing: "0.14em" }}>LOCKED</div>
          </div>
        ) : youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={`Video ${n} — ${title}`}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#4a4a4a",
              ...garamond,
              fontSize: "0.9rem",
              textAlign: "center",
              padding: "1rem",
            }}
          >
            Video not yet linked
          </div>
        )}
      </div>
      <div style={{ padding: "1.25rem 1.5rem" }}>
        <div style={{ ...cinzel, fontSize: "0.68rem", letterSpacing: "0.14em", color: GOLD_DIM, marginBottom: "0.35rem" }}>
          VIDEO {n}{locked ? " — LOCKED" : ""}
        </div>
        <div style={{ ...garamond, fontSize: "1.25rem", color: locked ? "#5a5a5a" : CREAM }}>{title}</div>
      </div>
    </div>
  );
}

function BookCard({ title, subtitle, href, locked }: { title: string; subtitle: string; href: string; locked: boolean }) {
  return (
    <div
      style={{
        background: "#131313",
        border: "1px solid #2a2a2a",
        borderRadius: 20,
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div style={{ ...cinzel, fontSize: "0.68rem", letterSpacing: "0.14em", color: GOLD_DIM }}>
        BOOK{locked ? " — LOCKED" : ""}
      </div>
      <div style={{ ...garamond, fontSize: "1.4rem", color: locked ? "#5a5a5a" : CREAM }}>{title}</div>
      <div style={{ ...garamond, fontSize: "0.95rem", color: "#a89f8f", flex: 1 }}>{subtitle}</div>
      {locked ? (
        <div
          style={{
            ...cinzel,
            background: "#0f0f0f",
            border: "1px solid #2a2a2a",
            color: GOLD_DIM,
            borderRadius: 99,
            padding: "0.85rem 1.5rem",
            textAlign: "center",
            fontSize: "0.78rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          🔒 LOCKED
        </div>
      ) : (
        <a
          href={href}
          download
          style={{
            ...cinzel,
            background: `linear-gradient(135deg, ${GOLD_DIM}, ${GOLD})`,
            color: "#0f0d09",
            borderRadius: 99,
            padding: "0.85rem 1.5rem",
            textAlign: "center",
            fontSize: "0.78rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textDecoration: "none",
          }}
        >
          DOWNLOAD PDF
        </a>
      )}
    </div>
  );
}

export function CourseVaultPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("vault-unlocked") === "1") setUnlocked(true);
    setChecked(true);
  }, []);

  if (!checked) return null;

  return (
    <div style={{ background: "#0c0c0c", minHeight: "100vh", color: CREAM }}>
      <section style={{ padding: "5rem 1.5rem 3rem", textAlign: "center" }}>
        <div style={{ ...cinzel, fontSize: "0.75rem", letterSpacing: "0.18em", color: GOLD_DIM, marginBottom: "0.75rem" }}>
          VOCAL MASTERY FOR ENTREPRENEURS
        </div>
        <h1 style={{ ...cinzelDec, fontSize: "clamp(2rem, 5vw, 3rem)", margin: "0 0 1rem", color: CREAM }}>
          The Frequency Series
        </h1>
        <p style={{ ...garamond, fontSize: "1.1rem", color: "#a89f8f", maxWidth: 560, margin: "0 auto" }}>
          Five videos, two books. Everything you need, in order.
        </p>
      </section>

      <section style={{ padding: "0 1.5rem 6rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ ...cinzel, fontSize: "0.75rem", letterSpacing: "0.18em", color: GOLD_DIM, textAlign: "center", marginBottom: "2rem" }}>
          THE BOOKS
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.75rem",
          }}
        >
          {BOOKS.map((b) => (
            <BookCard key={b.title} {...b} locked={!unlocked} />
          ))}
        </div>
      </section>

      <section style={{ padding: "0 1.5rem 5rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ ...cinzel, fontSize: "0.75rem", letterSpacing: "0.18em", color: GOLD_DIM, textAlign: "center", marginBottom: "2rem" }}>
          THE VIDEOS
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.75rem",
          }}
        >
          {VIDEOS.map((v) => (
            <VideoCard key={v.n} n={v.n} title={v.title} youtubeId={v.youtubeId} locked={!unlocked && v.n !== 1} />
          ))}
        </div>
        {!unlocked && <InlineUnlock onUnlock={() => setUnlocked(true)} />}
      </section>

      <section style={{ padding: "1rem 1.5rem 6rem", textAlign: "center" }}>
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            background: "#131313",
            border: `1px solid ${GOLD_DIM}55`,
            borderRadius: 20,
            padding: "3rem 2rem",
          }}
        >
          <p style={{ ...garamond, fontSize: "1.05rem", color: "#a89f8f", maxWidth: 480, margin: "0 auto 2rem" }}>
            Once you've watched all five videos, book your free 30-minute lesson with Omega and let's take the next step together.
          </p>
          <a
            href="https://calendar.app.google/Y83p7Rf5idJkdzKc6"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...cinzel,
              display: "inline-block",
              background: `linear-gradient(135deg, ${GOLD_DIM}, ${GOLD})`,
              color: "#0f0d09",
              borderRadius: 99,
              padding: "0.9rem 2rem",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textDecoration: "none",
            }}
          >
            BOOK YOUR FREE 30-MIN LESSON
          </a>
        </div>
      </section>

      <footer style={{ padding: "2rem 1.5rem 4rem", textAlign: "center" }}>
        <a href="/" style={{ ...garamond, color: "#6a6a6a", fontSize: "0.9rem", textDecoration: "none" }}>
          ← Back to omegabone.com
        </a>
      </footer>
      <Footer />
    </div>
  );
}
