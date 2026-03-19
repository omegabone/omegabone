import { useParams } from "react-router";
import { ArrowLeft, ArrowRight, Clock, Calendar } from "lucide-react";
import { L2SingNavbar } from "../components/L2SingNavbar";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { blogPosts, type ContentBlock } from "../data/blogPosts";

function ContentRenderer({ block, accent }: { block: ContentBlock; accent: string }) {
  switch (block.type) {
    case "heading":
      return (
        <h2
          className="text-black mt-10 mb-4"
          style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.55rem)", fontWeight: 800, lineHeight: 1.3, letterSpacing: "-0.015em" }}
        >
          {block.text}
        </h2>
      );
    case "paragraph":
      return (
        <p className="text-gray-700 mb-5" style={{ lineHeight: 1.85, fontSize: "1.05rem" }}>
          {block.text}
        </p>
      );
    case "list":
      return (
        <ul className="space-y-3 mb-6">
          {block.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-700" style={{ lineHeight: 1.7, fontSize: "1.05rem" }}>
              <span
                className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: accent }}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote
          className="my-10 pl-6 py-1"
          style={{ borderLeft: `4px solid ${accent}` }}
        >
          <p className="text-black italic" style={{ fontSize: "clamp(1.1rem, 2vw, 1.3rem)", lineHeight: 1.7, fontWeight: 500 }}>
            {block.text}
          </p>
        </blockquote>
      );
    case "tip":
      return (
        <div className="my-8 rounded-2xl p-6" style={{ backgroundColor: `${accent}12`, border: `1px solid ${accent}30` }}>
          <p className="text-sm mb-2 uppercase tracking-widest" style={{ fontWeight: 700, color: accent }}>
            💡 Try This
          </p>
          <p className="text-gray-700" style={{ lineHeight: 1.75, fontSize: "1rem" }}>
            {block.text}
          </p>
        </div>
      );
    default:
      return null;
  }
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);
  const accent = "#1a56db";

  if (!post) {
    return (
      <div className="bg-white min-h-screen">
        <L2SingNavbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <h1 className="text-black" style={{ fontSize: "2rem", fontWeight: 800 }}>Article not found</h1>
          <a href="/learn2sing/blog" className="text-[#1a56db] flex items-center gap-2" style={{ fontWeight: 700 }}>
            <ArrowLeft size={18} /> Back to Blog
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  const related = blogPosts.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 2);
  const otherRelated = blogPosts.filter((p) => p.slug !== slug && p.category !== post.category).slice(0, 2 - related.length);
  const relatedPosts = [...related, ...otherRelated].slice(0, 2);

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <L2SingNavbar />

      {/* ── HERO IMAGE ── */}
      <div className="w-full pt-20 sm:pt-28 overflow-hidden">
        <ImageWithFallback
          src={post.image}
          alt={post.title}
          className="w-full object-cover h-48 sm:h-72 md:h-[480px]"
          style={{ objectPosition: "center" }}
          loading="eager"
        />
      </div>

      {/* ── ARTICLE HEADER ── */}
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-2">
        <a
          href="/learn2sing/blog"
          className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:opacity-70"
          style={{ color: accent, fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to Blog
        </a>

        <div className="flex items-center gap-3 mb-5">
          <span
            className="text-xs px-3 py-1 rounded-full"
            style={{ backgroundColor: `${accent}18`, color: accent, fontWeight: 700 }}
          >
            {post.category}
          </span>
          <span className="text-gray-400 text-xs flex items-center gap-1">
            <Clock size={12} /> {post.readTime}
          </span>
          <span className="text-gray-400 text-xs flex items-center gap-1">
            <Calendar size={12} /> {post.date}
          </span>
        </div>

        <h1
          className="text-black mb-6"
          style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.03em" }}
        >
          {post.title}
        </h1>

        <p className="text-gray-600 mb-8" style={{ fontSize: "1.15rem", lineHeight: 1.7 }}>
          {post.excerpt}
        </p>

        {/* Author bar */}
        <div className="flex items-center gap-4 py-6 border-t border-b border-gray-100 mb-10">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0"
            style={{ background: `linear-gradient(135deg, ${accent}, #3b82f6)` }}
          >
            <span style={{ fontWeight: 800, fontSize: "1rem" }}>OB</span>
          </div>
          <div>
            <p className="text-black" style={{ fontWeight: 700 }}>{post.author}</p>
            <p className="text-gray-500 text-sm">{post.authorRole}</p>
          </div>
        </div>
      </div>

      {/* ── ARTICLE BODY ── */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        {post.content.map((block, i) => (
          <ContentRenderer key={i} block={block} accent={accent} />
        ))}
      </div>

      {/* ── RELATED POSTS ── */}
      {relatedPosts.length > 0 && (
        <section className="bg-[#f7f9ff] py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-black mb-8" style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Keep Reading
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map((rp) => (
                <a
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row"
                >
                  <div className="w-full h-40 sm:w-36 sm:h-auto shrink-0 overflow-hidden">
                    <ImageWithFallback
                      src={rp.image}
                      alt={rp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-center">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full mb-2 inline-block w-fit"
                      style={{ backgroundColor: `${accent}15`, color: accent, fontWeight: 600 }}
                    >
                      {rp.category}
                    </span>
                    <h3 className="text-black group-hover:text-[#1a56db] transition-colors mb-2" style={{ fontWeight: 700, lineHeight: 1.4, fontSize: "0.95rem" }}>
                      {rp.title}
                    </h3>
                    <span className="text-[#1a56db] text-sm flex items-center gap-1 group-hover:gap-2 transition-all" style={{ fontWeight: 600 }}>
                      Read <ArrowRight size={13} />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-16 bg-[#1a56db]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-white mb-4" style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)", fontWeight: 800 }}>
            Put this into practice with Omega.
          </h2>
          <p className="text-blue-100 mb-8" style={{ lineHeight: 1.7 }}>
            Reading about vocal technique is the first step. The transformation happens in the work.
          </p>
          <a
            href="/#get-started"
            className="inline-flex items-center gap-2 bg-white text-[#1a56db] px-8 py-4 rounded-full hover:bg-blue-50 transition-all hover:shadow-xl group"
            style={{ fontWeight: 700 }}
          >
            Work With Omega <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}