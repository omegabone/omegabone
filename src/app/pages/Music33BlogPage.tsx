import { useState } from "react";
import { ArrowRight, Clock, Calendar, Search, Star, ChevronRight } from "lucide-react";
import { Music33Navbar } from "../components/Music33Navbar";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useBlogspotFeed } from "../hooks/useBlogspotFeed";

const accent = "#1a56db";
const accentLight = "#eff6ff";
const accentMid = "#dbeafe";
const accentText = "#1e40af";

export function Music33BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { posts: blogspotPosts, isLoading } = useBlogspotFeed(
    "https://musicroom33.blogspot.com"
  );

  const filtered = blogspotPosts.filter((p) => {
    const q = searchQuery.toLowerCase();
    return !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q);
  });

  const [featured, second, ...rest] = filtered;

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <Music33Navbar />

      {/* HERO */}
      <section style={{ background: accentLight, paddingTop: "11rem", paddingBottom: "5rem" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs mb-5" style={{ backgroundColor: accentMid, color: accent, fontWeight: 700, letterSpacing: "0.08em" }}>
                <Star size={12} fill={accent} />
                Music Room 33 | The Blog
              </div>
              <h1 className="text-black mb-5" style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 800, lineHeight: 1.12, letterSpacing: "-0.03em" }}>
                Your child's talent<br />
                <span style={{ color: accent }}>is waiting to shine.</span>
              </h1>
              <p className="text-gray-600 mb-8" style={{ lineHeight: 1.75, maxWidth: "480px" }}>
                Guides, techniques, and stories for parents who believe in structured excellence — because every exceptional child deserves an exceptional foundation.
              </p>
              <div className="relative max-w-md">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-5 py-3.5 rounded-full bg-white border text-black placeholder-gray-400 outline-none transition-all"
                  style={{ borderColor: accentMid }}
                  onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}25`)}
                  onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                />
              </div>
            </div>

            {/* Hero stat cards */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { value: "92%", label: "of students show measurable improvement within 90 days" },
                { value: "300+", label: "children trained to performance level" },
                { value: "30+", label: "years of vocal coaching expertise" },
                { value: "1-on-1", label: "personalized structured lessons every session" },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border" style={{ borderColor: accentMid }}>
                  <p className="mb-1" style={{ fontSize: "1.8rem", fontWeight: 800, color: accent, lineHeight: 1 }}>{s.value}</p>
                  <p className="text-gray-500 text-sm" style={{ lineHeight: 1.5 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {isLoading ? (
          <div className="text-center py-24">
            <div className="w-10 h-10 border-2 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: `${accent}30`, borderTopColor: accent }} />
            <p className="text-gray-400">Loading articles…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg">No articles found. Try a different search.</p>
          </div>
        ) : (
          <>
            {/* TOP TWO FEATURED */}
            {(featured || second) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                {[featured, second].filter(Boolean).map((post) => (
                  <a
                    key={post!.slug}
                    href={`/music-room-33/blog/${post!.slug}`}
                    className="group block rounded-3xl overflow-hidden border hover:shadow-2xl transition-all duration-500"
                    style={{ borderColor: accentMid }}
                  >
                    {post!.image && (
                      <div className="overflow-hidden h-56 relative">
                        <ImageWithFallback
                          src={post!.image}
                          alt={post!.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <span className="absolute top-4 left-4 text-xs px-3 py-1.5 rounded-full text-white" style={{ background: accent, fontWeight: 700 }}>
                          {post!.category}
                        </span>
                      </div>
                    )}
                    <div className="bg-white p-8">
                      <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                        <Clock size={12} /> {post!.readTime}
                        <span className="mx-1">·</span>
                        <Calendar size={12} /> {post!.date}
                      </div>
                      <h2 className="text-black mb-3 group-hover:text-[#1a56db] transition-colors" style={{ fontSize: "1.25rem", fontWeight: 800, lineHeight: 1.3, letterSpacing: "-0.02em" }}>
                        {post!.title}
                      </h2>
                      <p className="text-gray-500 mb-4 text-sm" style={{ lineHeight: 1.65 }}>{post!.excerpt}</p>
                      <span className="text-sm flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: accent, fontWeight: 700 }}>
                        Read article <ArrowRight size={14} />
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* REMAINING GRID */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rest.map((post) => (
                  <a
                    key={post.slug}
                    href={`/music-room-33/blog/${post.slug}`}
                    className="group bg-white rounded-3xl overflow-hidden border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                    style={{ borderColor: accentMid }}
                  >
                    {post.image && (
                      <div className="overflow-hidden h-48 relative">
                        <ImageWithFallback
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    )}
                    <div className="p-7 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        
                        <span className="text-gray-400 text-xs flex items-center gap-1">
                          <Clock size={12} /> {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-black mb-3 flex-1 group-hover:text-[#1a56db] transition-colors" style={{ fontSize: "1.05rem", fontWeight: 700, lineHeight: 1.4 }}>
                        {post.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-5" style={{ lineHeight: 1.6 }}>{post.excerpt}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-gray-400 text-xs flex items-center gap-1">
                          <Calendar size={12} /> {post.date}
                        </span>
                        <span className="text-sm flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: accent, fontWeight: 600 }}>
                          Read more <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA */}
      <section style={{ background: accentLight }} className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs mb-5" style={{ backgroundColor: accentMid, color: accentText, fontWeight: 700 }}>
            <Star size={12} fill={accentText} /> Limited spots available
          </div>
          <h2 className="text-black mb-4" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Your child deserves a teacher<br /> who expects excellence, too.
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto" style={{ lineHeight: 1.75 }}>
            You already invest in your child's future every single day. Music Room 33 matches that commitment with structured, results-driven vocal training designed to build real confidence and real skill.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://calendar.app.google/Y83p7Rf5idJkdzKc6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-white px-8 py-4 rounded-full hover:opacity-90 transition-all group"
              style={{ background: accent, fontWeight: 700 }}
            >
              Enroll Your Child <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-white px-8 py-4 rounded-full border hover:shadow-md transition-all group"
              style={{ color: accent, fontWeight: 700, borderColor: accentMid }}
            >
              See the Programs <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}