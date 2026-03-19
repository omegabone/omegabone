import { useParams } from "react-router";
import { ArrowLeft, Clock, Calendar, ExternalLink } from "lucide-react";
import { L2CNavbar } from "../components/L2CNavbar";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useBlogspotFeed } from "../hooks/useBlogspotFeed";
import omegaPhoto from "figma:asset/a5c44fa231ece841b7c75f3487148d5d4d53f216.png";

const accent = "#166534";
const accentMid = "#dcfce7";
const accentText = "#14532d";

export function L2SBlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { posts, isLoading } = useBlogspotFeed("https://learn2communicatewithsong.blogspot.com");
  const post = posts.find((p) => p.slug === slug);

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <L2CNavbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <div
            className="w-10 h-10 border-2 rounded-full animate-spin"
            style={{ borderColor: `${accent}30`, borderTopColor: accent }}
          />
          <p className="text-gray-400">Loading article...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-white min-h-screen">
        <L2CNavbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <h1 className="text-black" style={{ fontSize: "2rem", fontWeight: 800 }}>Article not found</h1>
          <a href="/learn-to-communicate/blog" className="flex items-center gap-2" style={{ color: accent, fontWeight: 700 }}>
            <ArrowLeft size={18} /> Back to Blog
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  const heroImage = (() => {
    const contentMatch = post.content?.match(/<img[^>]+src="([^"]+)"/i);
    const src = contentMatch
      ? contentMatch[1].replace(/\/s\d+(-c)?\//i, "/s1600/")
      : post.image && !post.image.includes("unsplash.com")
      ? post.image.replace(/\/s\d+(-c)?\//i, "/s1600/")
      : null;
    return src;
  })();

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <L2CNavbar />

      {/* HERO IMAGE */}
      <div className="w-full pt-28 sm:pt-32 overflow-hidden">
        {heroImage && (
          <ImageWithFallback
            src={heroImage}
            alt={post.title}
            className="w-full object-cover h-48 sm:h-72 md:h-[480px]"
            style={{ objectPosition: "center" }}
            loading="eager"
          />
        )}
      </div>

      {/* ARTICLE HEADER */}
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-2">
        <a
          href="/learn-to-communicate/blog"
          className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:opacity-70"
          style={{ color: accent, fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to Blog
        </a>

        <div className="flex items-center gap-3 mb-5">
          
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

        {/* Author bar */}
        <div className="flex items-center gap-4 py-6 border-t border-b border-gray-100 mb-10">
          <img
            src={omegaPhoto}
            alt="Omega Bone"
            className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-offset-2"
            style={{ "--tw-ring-color": accent } as any}
          />
          <div>
            <p className="text-black" style={{ fontWeight: 700 }}>Omega Bone</p>
            <p className="text-gray-500 text-sm">Vocal Coach</p>
          </div>
        </div>
      </div>

      {/* ARTICLE BODY */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div
          className="prose prose-lg max-w-none"
          style={{
            lineHeight: 1.85,
            fontSize: "1.05rem",
            color: "#374151",
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Link to original article */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 p-6 bg-gray-50 rounded-2xl">
            <img
              src={omegaPhoto}
              alt="Omega Bone"
              className="w-28 shrink-0 rounded-lg object-cover self-end"
            />
            <div>
              <h3 className="text-black mb-2 text-center sm:text-left" style={{ fontWeight: 800, fontSize: "1.15rem" }}>
                About Omega Bone
              </h3>
              <p className="text-gray-600 text-center sm:text-left" style={{ lineHeight: 1.75, fontSize: "0.95rem" }}>
                Omega Bone is a music educator, performer, and vocal coach with over 25 years of experience. She has taught non-native English speakers across international schools in Germany, South Korea, Japan, and the United States. As a performer, she has shared the stage with Michael Jackson, Stevie Wonder, and Prince, and lent her voice to commercial campaigns for McDonald's, Haagen-Dazs, and Mercedes-Benz, among many others.
              </p>
            </div>
          </div>

          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-70"
            style={{ color: accent, fontWeight: 600 }}
          >
            View original article on Blogspot <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* CTA */}
      <section className="py-16" style={{ backgroundColor: accent }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-white mb-4" style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)", fontWeight: 800 }}>
            Put this into practice with Omega.
          </h2>
          <p className="mb-8" style={{ lineHeight: 1.7, color: "#bbf7d0" }}>
            Reading about communication is the first step. The transformation happens in the work.
          </p>
          <a
            href="/learn-to-communicate"
            className="inline-flex items-center gap-2 bg-white px-8 py-4 rounded-full hover:bg-green-50 transition-all hover:shadow-xl group"
            style={{ fontWeight: 700, color: accent }}
          >
            Work With Omega <ArrowLeft size={18} className="rotate-180 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}