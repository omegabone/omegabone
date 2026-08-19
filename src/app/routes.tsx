import { createBrowserRouter, Navigate, useParams } from "react-router";
import { lazy, Suspense, ComponentType } from "react";

const Music33Page        = lazy(() => import("./pages/Music33Page").then(m => ({ default: m.Music33Page })));
const AboutPage          = lazy(() => import("./pages/AboutPage").then(m => ({ default: m.AboutPage })));
const Learn2SingPage     = lazy(() => import("./pages/Learn2SingPage").then(m => ({ default: m.Learn2SingPage })));
const ComeWithMePage     = lazy(() => import("./pages/ComeWithMePage").then(m => ({ default: m.ComeWithMePage })));
const BlogPage           = lazy(() => import("./pages/BlogPage").then(m => ({ default: m.BlogPage })));
const BlogPostPage       = lazy(() => import("./pages/BlogPostPage").then(m => ({ default: m.BlogPostPage })));
const BlogspotPostPage   = lazy(() => import("./pages/BlogspotPostPage").then(m => ({ default: m.BlogspotPostPage })));
const ContactPage        = lazy(() => import("./pages/ContactPage").then(m => ({ default: m.ContactPage })));
const PrivacyPolicyPage  = lazy(() => import("./pages/PrivacyPolicyPage").then(m => ({ default: m.PrivacyPolicyPage })));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage").then(m => ({ default: m.TermsOfServicePage })));
const CookiePolicyPage   = lazy(() => import("./pages/CookiePolicyPage").then(m => ({ default: m.CookiePolicyPage })));
const DisclaimerPage     = lazy(() => import("./pages/DisclaimerPage").then(m => ({ default: m.DisclaimerPage })));
const VocalPresencePage  = lazy(() => import("./pages/VocalPresencePage").then(m => ({ default: m.VocalPresencePage })));
const L2SBlogPage        = lazy(() => import("./pages/L2SBlogPage").then(m => ({ default: m.L2SBlogPage })));
const L2SBlogPostPage    = lazy(() => import("./pages/L2SBlogPostPage").then(m => ({ default: m.L2SBlogPostPage })));
const Music33BlogPage    = lazy(() => import("./pages/Music33BlogPage").then(m => ({ default: m.Music33BlogPage })));
const Music33BlogPostPage = lazy(() => import("./pages/Music33BlogPostPage").then(m => ({ default: m.Music33BlogPostPage })));
const AlbumReleaseBlogPage = lazy(() => import("./pages/AlbumReleaseBlogPage").then(m => ({ default: m.AlbumReleaseBlogPage })));
const ApplyPage            = lazy(() => import("./pages/ApplyPage").then(m => ({ default: m.ApplyPage })));
const PracticePage         = lazy(() => import("./pages/PracticePage").then(m => ({ default: m.PracticePage })));
const Learn2SingPracticePage = lazy(() => import("./pages/PracticePage").then(m => ({ default: m.Learn2SingPracticePage })));
const MusicEducationLandingPage = lazy(() => import("./pages/MusicEducationLandingPage").then(m => ({ default: m.MusicEducationLandingPage })));
const FrequencyPage        = lazy(() => import("./pages/FrequencyPage").then(m => ({ default: m.FrequencyPage })));
const CourseVaultPage      = lazy(() => import("./pages/CourseVaultPage").then(m => ({ default: m.CourseVaultPage })));

function PageLoader() {
  return <div className="page-loading" aria-label="Loading" />;
}

function wrap(Comp: ComponentType) {
  return function Wrapped() {
    return (
      <Suspense fallback={<PageLoader />}>
        <Comp />
      </Suspense>
    );
  };
}

function NotFound() {
  return <Navigate to="/" replace />;
}

// Old hyphenated blog URLs → new spelling, preserving the post slug
function VocalMasteryBlogPostRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/Vocal_Mastery/blog/${slug}`} replace />;
}

// Old lowercase page URLs (pre naming-convention pass) → new Title_Case
// paths, preserving any :slug param, so old bookmarks/indexed links keep working
function slugRedirect(base: string) {
  return function SlugRedirect() {
    const { slug } = useParams();
    return <Navigate to={`${base}/${slug}`} replace />;
  };
}

export const router = createBrowserRouter([
  { path: "/",                                  Component: wrap(FrequencyPage) },
  { path: "/about",                             Component: wrap(AboutPage) },
  { path: "/Music_Room_33",                     Component: wrap(Music33Page) },
  { path: "/Vocal_Mastery",              Component: wrap(Learn2SingPage) },
  { path: "/Come_with_Me",                         Component: wrap(ComeWithMePage) },
  { path: "/contact",                           Component: wrap(ContactPage) },
  { path: "/Learn_2_Sing",                        Component: wrap(VocalPresencePage) },
  { path: "/Learn_2_Sing/blog",                   Component: wrap(BlogPage) },
  { path: "/Learn_2_Sing/blog/:slug",             Component: wrap(BlogPostPage) },
  { path: "/blogspot/:slug",                    Component: wrap(BlogspotPostPage) },
  { path: "/Vocal_Mastery/blog",         Component: wrap(L2SBlogPage) },
  { path: "/Vocal_Mastery/blog/:slug",   Component: wrap(L2SBlogPostPage) },
  { path: "/Music_Room_33/blog",                Component: wrap(Music33BlogPage) },
  { path: "/Music_Room_33/blog/:slug",          Component: wrap(Music33BlogPostPage) },
  { path: "/Come_with_Me/blog",                    Component: wrap(AlbumReleaseBlogPage) },
  { path: "/privacy",                           Component: wrap(PrivacyPolicyPage) },
  { path: "/terms",                             Component: wrap(TermsOfServicePage) },
  { path: "/cookies",                           Component: wrap(CookiePolicyPage) },
  { path: "/disclaimer",                        Component: wrap(DisclaimerPage) },
  { path: "/apply",                             Component: wrap(ApplyPage) },
  { path: "/Professional_Experience",                   Component: wrap(MusicEducationLandingPage) },
  { path: "/frequency",                         Component: wrap(FrequencyPage) },
  { path: "/frequency/vault",                   Component: wrap(CourseVaultPage) },
  { path: "/Vocal_Mastery/practice",             Component: wrap(PracticePage) },
  { path: "/Learn_2_Sing/practice",               Component: wrap(Learn2SingPracticePage) },
  // Old addresses — keep shared links and indexed URLs working
  { path: "/practice",                          Component: () => <Navigate to="/Vocal_Mastery/practice" replace /> },
  { path: "/vocal-mastery",                     Component: () => <Navigate to="/Vocal_Mastery" replace /> },
  { path: "/vocal-mastery/blog",                Component: () => <Navigate to="/Vocal_Mastery/blog" replace /> },
  { path: "/vocal-mastery/blog/:slug",          Component: VocalMasteryBlogPostRedirect },
  // Old lowercase page URLs, from before the naming-convention pass
  { path: "/music-education",                   Component: () => <Navigate to="/Professional_Experience" replace /> },
  { path: "/vocalmastery",                      Component: () => <Navigate to="/Vocal_Mastery" replace /> },
  { path: "/vocalmastery/blog",                 Component: () => <Navigate to="/Vocal_Mastery/blog" replace /> },
  { path: "/vocalmastery/blog/:slug",           Component: slugRedirect("/Vocal_Mastery/blog") },
  { path: "/vocalmastery/practice",             Component: () => <Navigate to="/Vocal_Mastery/practice" replace /> },
  { path: "/learn2sing",                        Component: () => <Navigate to="/Learn_2_Sing" replace /> },
  { path: "/learn2sing/blog",                   Component: () => <Navigate to="/Learn_2_Sing/blog" replace /> },
  { path: "/learn2sing/blog/:slug",             Component: slugRedirect("/Learn_2_Sing/blog") },
  { path: "/learn2sing/practice",               Component: () => <Navigate to="/Learn_2_Sing/practice" replace /> },
  { path: "/music-room-33",                     Component: () => <Navigate to="/Music_Room_33" replace /> },
  { path: "/music-room-33/blog",                Component: () => <Navigate to="/Music_Room_33/blog" replace /> },
  { path: "/music-room-33/blog/:slug",          Component: slugRedirect("/Music_Room_33/blog") },
  { path: "/comewithme",                        Component: () => <Navigate to="/Come_with_Me" replace /> },
  { path: "/comewithme/blog",                   Component: () => <Navigate to="/Come_with_Me/blog" replace /> },
  { path: "*",                                  Component: NotFound },
]);
