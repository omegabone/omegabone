import { useState } from "react";
import { ArrowRight, Clock, Calendar, Search, ChevronRight } from "lucide-react";
import { L2CNavbar } from "../components/L2CNavbar";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useBlogspotFeed } from "../hooks/useBlogspotFeed";

const accent = "#166534";
const accentLight = "#f0fdf4";
const accentMid = "#dcfce7";
const accentText = "#14532d";

export function L2SBlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { posts: blogspotPosts, isLoading } = useBlogspotFeed(
    "https://learn2communicatewithsong.blogspot.com"
  );

  const filtered = blogspotPosts.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q);
    return matchQ;
  });

  const [featured, ...rest] = filtered;

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <L2CNavbar />

      {/* HERO */}
      <section style={{ background: accentLight, paddingTop: "11rem", paddingBottom: "4rem" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs mb-5"
              style={{ backgroundColor: accentMid, color: accent, fontWeight: 700, letterSpacing: "0.08em" }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
              Learn to Communicate | The Blog
            </div>
            <h1
              className="text-black mb-5"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 800, lineHeight: 1.12, letterSpacing: "-0.03em" }}
            >
              Make your vision<br className="hidden md:block" />
              <span style={{ color: accent }}> impossible to ignore.</span>
            </h1>
            <p className="text-gray-600 mb-8 max-w-lg" style={{ lineHeight: 1.75 }}>
              Insights on executive presence, vocal authority, and the communication skills every entrepreneur needs to lead, sell, and inspire.
            </p>

            {/* Search */}
            <div className="relative max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-5 py-3.5 rounded-full bg-white border border-green-200 text-black placeholder-gray-400 outline-none transition-all"
                style={{ boxShadow: "0 0 0 0px transparent" }}
                onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}30`)}
                onBlur={(e) => (e.currentTarget.style.boxShadow = "0 0 0 0px transparent")}
              />
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
            {/* FEATURED */}
            {featured && (
              <a href={`/learn-to-communicate/blog/${featured.slug}`} className="group block mb-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border hover:shadow-2xl transition-all duration-500" style={{ borderColor: accentMid }}>
                  {featured.image && (
                    <div className="overflow-hidden h-72 lg:h-auto relative">
                      <ImageWithFallback
                        src={featured.image}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <span className="absolute top-4 left-4 text-xs px-3 py-1.5 rounded-full text-white" style={{ background: accent, fontWeight: 700 }}>
                        Featured
                      </span>
                    </div>
                  )}
                  <div className="bg-white p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-5">
                      
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <Clock size={12} /> {featured.readTime}
                      </span>
                    </div>
                    <h2 className="text-black mb-4 group-hover:text-[#166534] transition-colors" style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800, lineHeight: 1.25, letterSpacing: "-0.02em" }}>
                      {featured.title}
                    </h2>
                    <p className="text-gray-600 mb-6" style={{ lineHeight: 1.7 }}>{featured.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Calendar size={14} /> {featured.date}
                      </div>
                      <span className="text-sm flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: accent, fontWeight: 700 }}>
                        Read article <ArrowRight size={15} />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            )}

            {/* GRID */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rest.map((post) => (
                  <a
                    key={post.slug}
                    href={`/learn-to-communicate/blog/${post.slug}`}
                    className="group bg-white rounded-3xl overflow-hidden border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                    style={{ borderColor: "#e7f5ee" }}
                  >
                    {post.image && (
                      <div className="overflow-hidden h-52 relative">
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
                      <h3 className="text-black mb-3 flex-1 group-hover:text-[#166534] transition-colors" style={{ fontSize: "1.05rem", fontWeight: 700, lineHeight: 1.4 }}>
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

      {/* CTA STRIP */}
      <section className="py-16" style={{ background: accentLight }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-black mb-4" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Ready to make your voice<br /> the most powerful tool you have?
          </h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto" style={{ lineHeight: 1.75 }}>
            The Learn to Communicate program is built for entrepreneurs whose ideas deserve to be heard. Work 1-on-1 with Omega Bone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/learn-to-communicate"
              className="inline-flex items-center justify-center gap-2 text-white px-8 py-4 rounded-full hover:opacity-90 transition-all group"
              style={{ background: accent, fontWeight: 700 }}
            >
              See the Program <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="https://calendar.app.google/Y83p7Rf5idJkdzKc6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white px-8 py-4 rounded-full border hover:shadow-md transition-all group"
              style={{ color: accent, fontWeight: 700, borderColor: accentMid }}
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