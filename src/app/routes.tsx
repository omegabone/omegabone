import { createBrowserRouter, Navigate } from "react-router";
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

function wrap(Comp: ComponentType) {
  return function Wrapped() {
    return (
      <Suspense fallback={null}>
        <Comp />
      </Suspense>
    );
  };
}

function NotFound() {
  return <Navigate to="/" replace />;
}

export const router = createBrowserRouter([
  { path: "/",                                  Component: wrap(AboutPage) },
  { path: "/about",                             Component: wrap(AboutPage) },
  { path: "/music-room-33",                     Component: wrap(Music33Page) },
  { path: "/learn-to-communicate",              Component: wrap(Learn2SingPage) },
  { path: "/come-with-me",                      Component: wrap(ComeWithMePage) },
  { path: "/contact",                           Component: wrap(ContactPage) },
  { path: "/learn2sing",                        Component: wrap(VocalPresencePage) },
  { path: "/learn2sing/blog",                   Component: wrap(BlogPage) },
  { path: "/learn2sing/blog/:slug",             Component: wrap(BlogPostPage) },
  { path: "/blogspot/:slug",                    Component: wrap(BlogspotPostPage) },
  { path: "/learn-to-communicate/blog",         Component: wrap(L2SBlogPage) },
  { path: "/learn-to-communicate/blog/:slug",   Component: wrap(L2SBlogPostPage) },
  { path: "/music-room-33/blog",                Component: wrap(Music33BlogPage) },
  { path: "/music-room-33/blog/:slug",          Component: wrap(Music33BlogPostPage) },
  { path: "/come-with-me/blog",                 Component: wrap(AlbumReleaseBlogPage) },
  { path: "/privacy",                           Component: wrap(PrivacyPolicyPage) },
  { path: "/terms",                             Component: wrap(TermsOfServicePage) },
  { path: "/cookies",                           Component: wrap(CookiePolicyPage) },
  { path: "/disclaimer",                        Component: wrap(DisclaimerPage) },
  { path: "*",                                  Component: NotFound },
]);
