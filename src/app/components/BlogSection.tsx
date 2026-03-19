import { ArrowRight, Clock, Calendar } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useBlogspotFeed } from "../hooks/useBlogspotFeed";

export function BlogSection() {
  const { posts: livePosts, isLoading } = useBlogspotFeed("https://musicroom33.blogspot.com");
  const posts = isLoading ? [] : livePosts.slice(0, 3);

  return (
    <section id="blog" className="py-24 bg-[#f7f9ff]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-[#1a56db] text-sm mb-3 uppercase tracking-widest" style={{ fontWeight: 700 }}>
              The Blog
            </p>
            <h2
              className="text-black"
              style={{ fontSize: "clamp(2rem, 4vw, 2.4rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}
            >Insights for parents raising confident young singers</h2>
          </div>
          <a
            href="/music-room-33/blog"
            className="flex items-center gap-2 text-[#1a56db] hover:text-[#1649c0] transition-colors whitespace-nowrap"
            style={{ fontWeight: 700 }}
          >
            Read all articles <ArrowRight size={18} />
          </a>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-7 flex flex-col gap-4">
                  <div className="flex gap-3">
                    <div className="h-5 w-20 bg-gray-200 rounded-full" />
                    <div className="h-5 w-16 bg-gray-100 rounded-full" />
                  </div>
                  <div className="h-5 w-full bg-gray-200 rounded" />
                  <div className="h-5 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-full bg-gray-100 rounded" />
                  <div className="h-4 w-2/3 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? null : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <a
                key={post.slug}
                href={`/music-room-33/blog/${post.slug}`}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col"
              >
                {post.image && (
                  <div className="overflow-hidden h-52">
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
                  <h3
                    className="text-black mb-3 group-hover:text-[#1a56db] transition-colors flex-1"
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
                    <span className="text-[#1a56db] text-sm flex items-center gap-1 group-hover:gap-2 transition-all" style={{ fontWeight: 600 }}>
                      Read more <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}