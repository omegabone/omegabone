import { Music33Navbar } from "../components/Music33Navbar";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { StatsBar } from "../components/StatsBar";
import { About } from "../components/About";
import { LogoCarousel } from "../components/LogoCarousel";
import { Programs } from "../components/Programs";
import { WhyMusicRoom33 } from "../components/WhyMusicRoom33";
import { M33Programs } from "../components/M33Programs";
import { VideoSection } from "../components/VideoSection";
import { Testimonials } from "../components/Testimonials";
import { BlogSection } from "../components/BlogSection";
import { HomeFAQ } from "../components/HomeFAQ";
import { CTASection } from "../components/CTASection";

export function Music33Page() {
  return (
    <>
      <Music33Navbar />
      <Hero />
      <StatsBar />
      <About />
      <LogoCarousel />
      <Programs />
      <WhyMusicRoom33 />
      <M33Programs />
      <VideoSection />
      <Testimonials />
      <BlogSection />
      <HomeFAQ />
      <CTASection />
      <Footer />
    </>
  );
}