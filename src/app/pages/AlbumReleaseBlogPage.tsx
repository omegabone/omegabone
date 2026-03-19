import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useBlogspotFeed } from "../hooks/useBlogspotFeed";

const cinzel = { fontFamily: "'Cinzel', serif" };
const garamond = { fontFamily: "'EB Garamond', serif" };

const BG       = "#0c0c0c";
const SURFACE  = "#111111";
const BORDER   = "#1e1e1e";
const CREAM    = "#f0ead8";
const MUTED    = "#a89880";
const RED      = "#c0392b";
const RED_DARK = "#8b1a1a";

const filters = [
  { id: "all",     label: "All Updates" },
  { id: "press",   label: "Press" },
  { id: "release", label: "Release Notes" },
  { id: "behind",  label: "Behind the Work" },
  { id: "story",   label: "The Story" },
];

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "0.5rem 0" }}>
      <div style={{ flex: 1, height: "1px", background: BORDER }} />
      <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: RED_DARK }} />
      <div style={{ flex: 1, height: "1px", background: BORDER }} />
    </div>
  );
}

export function AlbumReleaseBlogPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const { posts, isLoading } = useBlogspotFeed(
    "https://comewithmeseries.blogspot.com"
  );

  const displayed = posts;

  return (
    <div style={{ background: BG, minHeight: "100vh", color: CREAM, overflowX: "hidden" }}>
      <Navbar />

      {/* ── PAGE HEADER ── */}
      <header style={{ paddingTop: "9rem", paddingBottom: "3rem", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}>
          <p style={{ ...cinzel, color: RED_DARK, fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: "1rem" }}>
            Come With Me &nbsp;/&nbsp; Updates
          </p>
          <h1 style={{ ...cinzel, fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 700, color: CREAM, letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: "1rem" }}>
            The Dispatch
          </h1>
          <p style={{ ...garamond, color: MUTED, fontSize: "clamp(1rem, 2vw, 1.2rem)", fontStyle: "italic", maxWidth: "560px", lineHeight: 1.8 }}>
            Press releases, release notes, and dispatches from behind the work.
            Everything you need to follow the triptych from conception to completion.
          </p>
        </div>
      </header>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem", display: "flex", gap: "3rem", alignItems: "flex-start", paddingTop: "3rem", paddingBottom: "6rem" }}>

        {/* ── LEFT SIDEBAR ── */}
        

        {/* ── MAIN CONTENT ── */}
        <main style={{ flex: 1, minWidth: 0 }}>

          {/* Mobile filter */}
          <div className="lg:hidden flex gap-2 overflow-x-auto no-scrollbar mb-8">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                style={{
                  ...cinzel,
                  background: activeFilter === f.id ? RED : SURFACE,
                  color: activeFilter === f.id ? "#fff" : MUTED,
                  border: `1px solid ${activeFilter === f.id ? RED : BORDER}`,
                  borderRadius: "4px",
                  padding: "0.45rem 1rem",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Results meta */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <p style={{ ...cinzel, color: MUTED, fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              {isLoading ? "Loading…" : `${displayed.length} dispatch${displayed.length !== 1 ? "es" : ""}`}
            </p>
            <div style={{ height: "1px", flex: 1, background: BORDER, marginLeft: "1.5rem" }} />
          </div>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: "6rem 0" }}>
              <p style={{ ...garamond, color: MUTED, fontStyle: "italic" }}>Loading dispatches…</p>
            </div>
          ) : displayed.length === 0 ? (
            <div style={{ textAlign: "center", padding: "6rem 0" }}>
              <p style={{ ...garamond, color: MUTED, fontStyle: "italic" }}>No dispatches found.</p>
            </div>
          ) : (
            <div>
              {displayed.map((post, idx) => {
                const isExpanded = expandedSlug === post.slug;
                return (
                  <div key={post.slug}>
                    <div
                      style={{
                        padding: "1.75rem 0",
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                    >
                      {/* Row: meta + title */}
                      <div
                        onClick={() => setExpandedSlug(isExpanded ? null : post.slug)}
                        style={{ display: "grid", gridTemplateColumns: "140px 1fr auto", gap: "1.5rem", alignItems: "start" }}
                      >
                        {/* Date / meta column */}
                        <div style={{ paddingTop: "2px" }}>
                          <p style={{ ...cinzel, color: RED_DARK, fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                            {post.date}
                          </p>
                          
                        </div>

                        {/* Title + excerpt */}
                        <div>
                          <h2
                            style={{
                              ...cinzel,
                              color: CREAM,
                              fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
                              fontWeight: 700,
                              lineHeight: 1.4,
                              letterSpacing: "0.01em",
                              marginBottom: "0.5rem",
                            }}
                          >
                            {post.title}
                          </h2>
                          <p
                            style={{
                              ...garamond,
                              color: MUTED,
                              fontSize: "0.97rem",
                              lineHeight: 1.75,
                              fontStyle: "italic",
                              display: isExpanded ? "none" : "block",
                            }}
                          >
                            {post.excerpt}
                          </p>
                        </div>

                        {/* Expand / link */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem", paddingTop: "2px" }}>
                          <span
                            style={{
                              ...cinzel,
                              color: isExpanded ? MUTED : RED,
                              fontSize: "0.6rem",
                              letterSpacing: "0.15em",
                              textTransform: "uppercase",
                              transition: "color 0.2s",
                            }}
                          >
                            {isExpanded ? "Collapse" : "Read"}
                          </span>
                          <span style={{ ...cinzel, color: BORDER, fontSize: "0.7rem" }}>{post.readTime}</span>
                        </div>
                      </div>

                      {/* Expanded content */}
                      {isExpanded && (
                        <div style={{ marginTop: "1.5rem", paddingLeft: "calc(140px + 1.5rem)" }}>
                          {post.image && (
                            <div style={{ marginBottom: "1.5rem", borderRadius: "8px", overflow: "hidden", border: `1px solid ${BORDER}` }}>
                              <img
                                src={post.image}
                                alt={post.title}
                                style={{ width: "100%", height: "auto", display: "block", maxHeight: "400px", objectFit: "cover" }}
                              />
                            </div>
                          )}
                          <div
                            className="cwm-blog-content"
                            style={{ ...garamond, color: MUTED, fontSize: "1.05rem", lineHeight: 1.85 }}
                            dangerouslySetInnerHTML={{ __html: post.content }}
                          />
                          <style>{`
                            .cwm-blog-content p { margin-bottom: 1.25rem; }
                            .cwm-blog-content h1, .cwm-blog-content h2, .cwm-blog-content h3 {
                              font-family: 'Cinzel', serif;
                              color: ${CREAM};
                              margin-top: 2rem;
                              margin-bottom: 1rem;
                              font-weight: 700;
                            }
                            .cwm-blog-content h2 { font-size: 1.3rem; }
                            .cwm-blog-content h3 { font-size: 1.1rem; }
                            .cwm-blog-content a { color: ${RED}; text-decoration: underline; text-underline-offset: 3px; }
                            .cwm-blog-content a:hover { color: #e74c3c; }
                            .cwm-blog-content img {
                              max-width: 100%;
                              height: auto;
                              border-radius: 8px;
                              border: 1px solid ${BORDER};
                              margin: 1.5rem 0;
                            }
                            .cwm-blog-content ul, .cwm-blog-content ol {
                              padding-left: 1.5rem;
                              margin-bottom: 1.25rem;
                            }
                            .cwm-blog-content li { margin-bottom: 0.5rem; }
                            .cwm-blog-content blockquote {
                              border-left: 3px solid ${RED_DARK};
                              padding-left: 1.25rem;
                              margin: 1.5rem 0;
                              font-style: italic;
                              color: ${CREAM};
                            }
                          `}</style>
                          <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: `1px solid ${BORDER}` }}>
                            <button
                              onClick={() => setExpandedSlug(null)}
                              style={{
                                ...cinzel,
                                color: MUTED,
                                fontSize: "0.65rem",
                                letterSpacing: "0.2em",
                                textTransform: "uppercase",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                              }}
                            >
                              Collapse &uarr;
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {idx < displayed.length - 1 && <Divider />}
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom CTA */}
          <div style={{ marginTop: "4rem", borderTop: `1px solid ${BORDER}`, paddingTop: "3rem", textAlign: "center" }}>
            <p style={{ ...cinzel, color: RED_DARK, fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "1rem" }}>
              Follow the Journey
            </p>
            <h3 style={{ ...cinzel, color: CREAM, fontSize: "clamp(1.2rem, 3vw, 1.8rem)", fontWeight: 700, marginBottom: "1rem", letterSpacing: "0.02em" }}>
              Come With Me is coming.
            </h3>
            <p style={{ ...garamond, color: MUTED, fontStyle: "italic", fontSize: "1.1rem", marginBottom: "2rem", lineHeight: 1.7 }}>
              The album. The novel. The comic. One story. Three objects. No compromises.
            </p>
            <a
              href="/come-with-me"
              style={{
                ...cinzel,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: RED,
                color: CREAM,
                padding: "0.85rem 2rem",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              See the Triptych &rarr;
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}