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
    ?access=l2s    — Learn 2 Sing book + Video 1 (the free lesson), rest locked.
                     This is where the L2S PayPal button (TC8PM4Y4NQJ36 — see
                     the Frequency page's Books section) should send buyers.
    ?access=vme    — Vocal Mastery for Entrepreneurs book + Video 1, rest
                     locked. Where the VME PayPal button (EBUP3BC8GZM8A)
                     should send buyers.
    ?access=books  — both books, no video bonus (all videos locked). Not
                     currently tied to a purchase — a bundle tier for
                     manual/future use.
    ?access=all    — same as the password: everything unlocked
    (no param)     — default: Video 1 free, everything else locked
  Point a PayPal hosted button's "return to website" URL at the matching
  one of these (e.g. https://omegabone.com/frequency/vault?access=l2s) to
  skip the password step for that buyer entirely.
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
    id: "l2s" as const,
    title: "Learn 2 Sing",
    subtitle: "The complete method, from first breath to full performance.",
    href: "/resources/learn-2-sing.pdf",
  },
  {
    id: "vme" as const,
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

const COURSE_BUY_HREF = "https://www.paypal.com/ncp/payment/WB7JGER2N3BTU";

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
            <a
              href={COURSE_BUY_HREF}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...cinzel,
                marginTop: "0.5rem",
                background: `linear-gradient(135deg, ${GOLD_DIM}, ${GOLD})`,
                color: "#0f0d09",
                borderRadius: 99,
                padding: "0.65rem 1.25rem",
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textDecoration: "none",
              }}
            >
              UNLOCK THE FREQUENCY SERIES — $500
            </a>
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
          VIDEO {n}{locked ? " — LOCKED" : n === 1 ? " — FREE LESSON" : ""}
        </div>
        <div style={{ ...garamond, fontSize: "1.25rem", color: locked ? "#5a5a5a" : CREAM }}>{title}</div>
      </div>
    </div>
  );
}

function BookCard({
  title,
  subtitle,
  href,
  locked,
  buyHref,
}: {
  title: string;
  subtitle: string;
  href: string;
  locked: boolean;
  buyHref?: string;
}) {
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
        buyHref ? (
          <a
            href={buyHref}
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
            🔒 UNLOCK THIS BOOK
          </a>
        ) : (
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
        )
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
  const [passwordUnlocked, setPasswordUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [tier] = useState<AccessTier>(readAccessTier);

  useEffect(() => {
    if (sessionStorage.getItem("vault-unlocked") === "1") setPasswordUnlocked(true);
    setChecked(true);
  }, []);

  if (!checked) return null;

  const unlocked = passwordUnlocked || tier === "all";
  const bookUnlocked = (id: "l2s" | "vme") =>
    unlocked || tier === "books" || tier === id;
  // Buying a single book (l2s / vme) also unlocks Video 1, same as the
  // default no-purchase view. The "books" bundle tier is books only — no
  // video bonus attached.
  const videoUnlocked = (n: number) =>
    unlocked || ((tier === "free" || tier === "l2s" || tier === "vme") && n === 1);
  const showInlineUnlock = !unlocked;

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

      {tier === "l2s" && (
        <section style={{ padding: "0 1.5rem 3rem", maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <div style={{ background: "#131313", border: `1px solid ${GOLD_DIM}55`, borderRadius: 20, padding: "2.5rem 2rem" }}>
            <div style={{ ...garamond, fontSize: "1.05rem", color: "#d8d0bd", lineHeight: 1.7, textAlign: "left" }}>
              <p style={{ margin: "0 0 1rem" }}>Thank you for getting Learn 2 Sing.</p>
              <p style={{ margin: "0 0 1rem" }}>Open it today. Not someday.</p>
              <p style={{ margin: "0 0 1rem" }}>
                What you do with the exercises over the next few weeks will matter far more than the book itself. The method only works when you work it, and the change does not happen in the reading. It happens in the sound you make in the room, alone, before anyone claps.
              </p>
              <p style={{ margin: "0 0 1rem" }}>Your voice is not the thing you use to be heard. It is the thing you are.</p>
              <p style={{ margin: "0 0 1rem" }}>
                When you are ready to go further, I want to hear where you are starting from. Book a free call with me here:{" "}
                <a href="https://calendar.app.google/Y83p7Rf5idJkdzKc6" target="_blank" rel="noopener noreferrer" style={{ color: GOLD }}>
                  https://calendar.app.google/Y83p7Rf5idJkdzKc6
                </a>
              </p>
              <p style={{ margin: 0 }}>Musically Yours,<br />Omega</p>
            </div>
          </div>
        </section>
      )}

      {tier === "vme" && (
        <section style={{ padding: "0 1.5rem 3rem", maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <div style={{ background: "#131313", border: `1px solid ${GOLD_DIM}55`, borderRadius: 20, padding: "2.5rem 2rem" }}>
            <div style={{ ...garamond, fontSize: "1.05rem", color: "#d8d0bd", lineHeight: 1.7, textAlign: "left" }}>
              <p style={{ margin: "0 0 1rem" }}>Thank you for getting Vocal Mastery for Entrepreneurs.</p>
              <p style={{ margin: "0 0 1rem" }}>
                You did not buy a book about singing. You bought the operating manual for the instrument you already use every single day, in every pitch, every room, and every conversation that decides something.
              </p>
              <p style={{ margin: "0 0 1rem" }}>Most people work on the message. Almost nobody works on the transmission.</p>
              <p style={{ margin: "0 0 1rem" }}>
                So read it, then use it. What you practice in the next few weeks will matter more than what you underline. Your presence changes when your signal gets clear, and people feel that long before they can explain it.
              </p>
              <p style={{ margin: "0 0 1rem" }}>
                I would love to hear where you are starting from and what you are building. Book a free call with me here:{" "}
                <a href="https://calendar.app.google/Y83p7Rf5idJkdzKc6" target="_blank" rel="noopener noreferrer" style={{ color: GOLD }}>
                  https://calendar.app.google/Y83p7Rf5idJkdzKc6
                </a>
              </p>
              <p style={{ margin: 0 }}>Musically Yours,<br />Omega</p>
            </div>
          </div>
        </section>
      )}

      <section style={{ padding: "0 1.5rem 6rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ ...cinzel, fontSize: "0.75rem", letterSpacing: "0.18em", color: GOLD_DIM, textAlign: "center", marginBottom: "0.75rem" }}>
          THE BOOKS
        </div>
        {tier === "books" && (
          <p style={{ ...garamond, fontSize: "0.95rem", color: "#a89f8f", textAlign: "center", maxWidth: 480, margin: "0 auto 2rem" }}>
            Both, as a gift from Omega — buying either book unlocks both.
          </p>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.75rem",
            marginTop: tier === "books" ? 0 : "2rem",
          }}
        >
          {BOOKS.map((b) => (
            <BookCard key={b.title} {...b} locked={!bookUnlocked(b.id)} buyHref="/frequency#books" />
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
            <VideoCard key={v.n} n={v.n} title={v.title} youtubeId={v.youtubeId} locked={!videoUnlocked(v.n)} />
          ))}
        </div>
        {showInlineUnlock && <InlineUnlock onUnlock={() => setPasswordUnlocked(true)} />}
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
