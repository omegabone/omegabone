import { useState } from "react";
import { ArrowRight, Clock, Calendar, Search, ChevronRight } from "lucide-react";
import { L2SingNavbar } from "../components/L2SingNavbar";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useBlogspot } from "../context/BlogspotContext";

const accentColor = "#554274";
const bgLight = "#ede8f5";

export function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { posts: blogspotPosts, isLoading: isLoadingBlogspot } = useBlogspot();

  const filtered = blogspotPosts.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const [featured, ...rest] = filtered;

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <L2SingNavbar />

      {/* ── HERO ── */}
      <section className="pt-44 pb-16 bg-[#f7f9ff]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[#554274] text-sm mb-3 uppercase tracking-widest" style={{ fontWeight: 700 }}>
            The Blog
          </p>
          <h1
            className="text-black mb-5"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em" }}
          >
            Tips, insights & techniques<br className="hidden md:block" /> for every singer
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto mb-10" style={{ lineHeight: 1.7 }}>
            Practical wisdom for singers, musicians and band members, from 30+ years on stage, in the studio, and in the classroom.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-5 py-3.5 rounded-full bg-white border border-gray-200 text-black placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#554274]/30 focus:border-[#554274] transition-all"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {isLoadingBlogspot ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg">Loading articles…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg">No articles found. Try a different search.</p>
          </div>
        ) : (
          <>
            {/* ── FEATURED POST ── */}
            {featured && (
              <a
                href={`/blogspot/${featured.slug}`}
                className="group block mb-16"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                  {featured.image && (
                    <div className="overflow-hidden h-72 lg:h-auto relative">
                      <ImageWithFallback
                        src={featured.image}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <span
                        className="absolute top-4 left-4 text-xs px-3 py-1 rounded-full text-white"
                        style={{ backgroundColor: accentColor, fontWeight: 700 }}
                      >
                        Blogspot
                      </span>
                    </div>
                  )}
                  <div className="bg-white p-6 sm:p-10 lg:p-14 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-5">
                      
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <Clock size={12} /> {featured.readTime}
                      </span>
                    </div>
                    <h2
                      className="text-black mb-4 transition-colors"
                      style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800, lineHeight: 1.25, letterSpacing: "-0.02em" }}
                    >
                      {featured.title}
                    </h2>
                    <p className="text-gray-600 mb-6" style={{ lineHeight: 1.7 }}>
                      {featured.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Calendar size={14} />
                        {featured.date}
                      </div>
                      <span
                        className="text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
                        style={{ color: accentColor, fontWeight: 700 }}
                      >
                        Read article <ArrowRight size={15} />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            )}

            {/* ── POST GRID ── */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rest.map((post) => (
                  <a
                    key={post.slug}
                    href={`/blogspot/${post.slug}`}
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    {post.image && (
                      <div className="overflow-hidden h-52 relative">
                        <ImageWithFallback
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <span
                          className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full text-white"
                          style={{ backgroundColor: accentColor, fontWeight: 600 }}
                        >
                          Blogspot
                        </span>
                      </div>
                    )}
                    <div className="p-7 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        
                        <span className="text-gray-400 text-xs flex items-center gap-1">
                          <Clock size={12} /> {post.readTime}
                        </span>
                      </div>
                      <h3
                        className="text-black mb-3 flex-1"
                        style={{ fontSize: "1.05rem", fontWeight: 700, lineHeight: 1.4 }}
                      >
                        {post.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-5" style={{ lineHeight: 1.6 }}>
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-gray-400 text-xs flex items-center gap-1">
                          <Calendar size={12} /> {post.date}
                        </span>
                        <span
                          className="text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
                          style={{ color: accentColor, fontWeight: 600 }}
                        >
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

      {/* ── CTA STRIP ── */}
      <section className="py-16" style={{ background: "#ede8f5" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-black mb-4" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Ready to unlock the singer<br /> you already are?
          </h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto" style={{ lineHeight: 1.75 }}>The Learn 2 Sing program is built for your inner child who always wanted to sing. Work 1-on-1 with Omega Bone.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/learn2sing"
              className="inline-flex items-center justify-center gap-2 text-white px-8 py-4 rounded-full hover:opacity-90 transition-all group"
              style={{ background: accentColor, fontWeight: 700 }}
            >
              See the Program <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="https://calendar.app.google/Y83p7Rf5idJkdzKc6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white px-8 py-4 rounded-full border hover:shadow-md transition-all group"
              style={{ color: accentColor, fontWeight: 700, borderColor: bgLight }}
            >
              Book a Free Vocal Analysis <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}