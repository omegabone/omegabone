import { useEffect, useState } from "react";

export function MusicEducationLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Omega Bone — Music Education Specialist";

    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const prevDesc = metaDesc?.content ?? "";
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content =
      "Ms Omega Bone can help your scholars promote their skills singing, playing and performing the music they create with websites, albums and videos they produce.";

    return () => {
      document.title = prevTitle;
      if (metaDesc) metaDesc.content = prevDesc;
    };
  }, []);

  useEffect(() => {
    const ids = ["featured-work", "skills", "experience", "references", "contact"];
    const onScroll = () => {
      const marker = window.scrollY + window.innerHeight * 0.35;
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= marker) current = id;
      }
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { label: "Featured Work", href: "#featured-work" },
    { label: "What I Bring", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "References", href: "#references" },
    { label: "Contact", href: "#contact" },
  ];

  const videos = [
    {
      title: "Christmas Time is Here",
      detail: "Vocal Leads",
      id: "wM3bSa7lx5U",
    },
    {
      title: "Do Re Mi",
      detail: "Orchestral Rehearsal",
      id: "GMrLQ_sqYn0",
    },
    {
      title: "Winter Concert",
      detail: "Rehearsal",
      id: "YXHxgUYMdzE",
    },
    {
      title: "Try Everything / We Wanna Be",
      detail: "PE Collaboration",
      id: "UQ4ldwol1jw",
    },
    {
      title: "Land of the Silver Birch",
      detail: "PYP Assembly",
      id: "2tBVwalFrjo",
    },
    {
      title: "Down Hill",
      detail: "Student Film",
      id: "izHTKB4DEXo",
    },
    {
      title: "Celebrating Music Excellence",
      detail: "Promotional Video",
      id: "aGtT4UyUprg",
    },
    {
      title: "Thinking Out Loud",
      detail: "Music Video",
      id: "_K_4PeLnCMU",
    },
    {
      title: "I'm Beautiful",
      detail: "Student Composition",
      id: "5RC2Zp6vOKc",
    },
  ];

  const skillGroups = [
    {
      title: "Elementary Music",
      summary:
        "Choir direction for programs of 100-plus voices, whole-school performance adaptations, and original sight word songs that build early literacy through music. Curriculum in music literacy, composition, ukulele, recorder, and Modern Band.",
      chips: ["Choir Direction", "School-Wide Performances", "Literacy Through Music", "Modern Band"],
    },
    {
      title: "Secondary Music",
      summary:
        "Songwriting integrated with social studies, student music portfolios, and music composed for commercials and webpages. Scholars use digital audio workstations to score video essays, record original songs in studio for music videos, and write, produce, and promote their own short films with commissioned poster art.",
      chips: [
        "Songwriting",
        "Student Portfolios",
        "Music for Media",
        "Digital Audio Workstations",
        "Studio Recording",
        "Film Production",
      ],
    },
  ];

  const experience = [
    {
      years: "2026 to Present",
      role: "Founder & Lead Instructor, Vocal Mastery for Entrepreneurs",
      org: "Network School · Forest City, Malaysia",
      note: "Built a vocal presence and executive communication program inside an international entrepreneurial community. Six cohorts in six months, with monthly live presentations as public performance benchmarks.",
    },
    {
      years: "2022 to 2025",
      role: "Music Teacher",
      org: "Hillcrest Drive Elementary Music Magnet · LAUSD",
      note: "General music in an inclusive SPED-integrated environment, with curriculum in music literacy, composition, choir, ukulele, recorder, and Modern Band.",
    },
    {
      years: "2020 to 2022",
      role: "Choir Teacher",
      org: "Dr. Julian Nava Learning Academy · LAUSD",
      note: "Built a fully virtual choir and music program during the pandemic, integrating literacy and academic vocabulary into music instruction.",
    },
    {
      years: "2017 to 2018",
      role: "PYP Music Teacher",
      org: "Doshisha International Academy · Kyoto, Japan",
      note: "Established three elementary choirs and instrumental ensembles within an English-language IB Primary Years Programme, with weekly Performance Club concerts.",
    },
    {
      years: "2013 to 2015",
      role: "Music & Drama Teacher",
      org: "Canadian International School · Tokyo, Japan",
      note: "Designed the IB PYP music curriculum, directed Winter and Spring Concerts, taught vocal performance and jazz, and created the school's weekly Performance Café.",
    },
    {
      years: "2011 to 2012",
      role: "PYP Music Teacher",
      org: "Frankfurt International School · Wiesbaden, Germany",
      note: "Integrated music throughout the IB curriculum and arranged multilingual repertoire for elementary performances.",
    },
    {
      years: "2008 to Present",
      role: "Private Voice Coach",
      org: "Independent Online Studio",
      note: "Coaches singers internationally in healthy vocal technique, with an online educational platform reaching thousands of subscribers.",
    },
    {
      years: "1999 to 2004",
      role: "Music Teacher",
      org: "Los Angeles Unified School District",
      note: "Delivered music instruction across five elementary schools serving more than 1,000 students, directed choirs totaling approximately 500 performers, and taught high school choir, theory, and vocal performance.",
    },
  ];

  const credentials = [
    "B.S. Music Education, North Carolina A&T State University",
    "California Clear Multiple Subject Teaching Credential, valid through 2030",
    "Orff-Schulwerk Level I Certification",
    "German, Professional Working Proficiency",
  ];

  return (
    <div className="ed">
      <style>{`
        .ed {
          --royal: #1e3a8a;
          --sky: #4c8df6;
          --amber: #e8a33d;
          --gold: #d4af37;
          --bronze: #8c6239;
          --obsidian: #0b0b0d;
          --bone: #f4efe6;
          --bone-deep: #ece5d6;
          --line: rgba(11, 11, 13, 0.12);
          font-family: 'Comfortaa', system-ui, sans-serif;
          color: var(--obsidian);
          background: var(--bone);
          line-height: 1.7;
          margin: 0;
        }
        .ed * { box-sizing: border-box; }
        .ed a { color: inherit; }
        .ed h1, .ed h2, .ed h3 {
          font-family: 'Fredoka', system-ui, sans-serif;
          line-height: 1.15;
          margin: 0;
        }

        /* ---------- Nav ---------- */
        .ed-nav {
          position: sticky; top: 0; z-index: 50;
          background: var(--bone);
          border-bottom: 1px solid var(--line);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.9rem 1.4rem;
        }
        .ed-wordmark {
          font-family: 'Fredoka', sans-serif; font-weight: 600;
          font-size: 1.15rem; color: var(--royal); text-decoration: none;
        }
        .ed-links { display: flex; gap: 1.5rem; }
        .ed-links a {
          font-family: 'Poppins', sans-serif;
          text-decoration: none; font-size: 0.82rem; font-weight: 600;
          letter-spacing: 0.04em;
          color: var(--obsidian); padding: 0.25rem 0;
          border-bottom: 2px solid transparent;
          transition: color 0.2s, border-color 0.2s;
        }
        .ed-links a:hover { color: var(--royal); border-bottom-color: var(--amber); }
        .ed-links a.active { color: var(--royal); border-bottom-color: var(--amber); }
        .ed { scroll-behavior: smooth; }
        html { scroll-behavior: smooth; }
        .ed-menu-btn {
          display: none;
          font-family: 'Poppins', sans-serif; font-weight: 600;
          background: none; border: 2px solid var(--royal);
          border-radius: 999px; color: var(--royal);
          padding: 0.3rem 0.9rem; cursor: pointer;
        }

        /* ---------- Hero ---------- */
        .ed-hero {
          position: relative;
          background: var(--royal);
          color: var(--bone);
          padding: 5.5rem 1.5rem 5rem;
          text-align: center;
          border-radius: 0 0 32px 32px;
          overflow: hidden;
        }
        .ed-hero::after {
          content: "";
          position: absolute; left: 50%; bottom: 0; transform: translateX(-50%);
          width: min(520px, 80%); height: 3px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          opacity: 0.9;
        }
        .ed-hero-inner { position: relative; max-width: 780px; margin: 0 auto; }
        .ed-eyebrow {
          display: inline-block;
          font-family: 'Poppins', sans-serif;
          font-size: 0.74rem; font-weight: 600; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--amber);
          margin-bottom: 1.3rem;
        }
        .ed-hero h1 {
          font-size: clamp(2.3rem, 6vw, 3.8rem);
          font-weight: 600;
        }
        .ed-hero h1 span { color: var(--amber); }
        .ed-hero p.tagline {
          margin: 1.3rem auto 0; max-width: 580px;
          font-size: 1rem; color: rgba(244, 239, 230, 0.9);
        }
        .ed-hero-ctas { margin-top: 2.2rem; display: flex; gap: 0.9rem; justify-content: center; flex-wrap: wrap; }

        .ed-btn {
          font-family: 'Poppins', sans-serif;
          display: inline-block;
          text-decoration: none; font-weight: 600; font-size: 0.92rem;
          padding: 0.8rem 1.8rem; border-radius: 999px;
          transition: background 0.2s, color 0.2s;
        }
        .ed-btn.primary { background: var(--amber); color: var(--obsidian); }
        .ed-btn.primary:hover { background: #f0b357; }
        .ed-btn.ghost { border: 2px solid var(--bone); color: var(--bone); }
        .ed-btn.ghost:hover { background: rgba(244, 239, 230, 0.12); }
        .ed-btn.royal { background: var(--royal); color: var(--bone); }
        .ed-btn.royal:hover { background: #27479f; }

        /* ---------- Sections ---------- */
        .ed-section { padding: 4.5rem 1.5rem; }
        .ed-section.deep { background: var(--bone-deep); }
        .ed-container { max-width: 1000px; margin: 0 auto; }
        .ed-kicker {
          font-family: 'Poppins', sans-serif;
          font-size: 0.74rem; font-weight: 600; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--sky); margin-bottom: 0.5rem;
        }
        .ed-section h2 {
          font-size: clamp(1.7rem, 4vw, 2.4rem); font-weight: 600;
          color: var(--royal); margin-bottom: 0.4rem;
        }
        .ed-rule {
          width: 72px; height: 3px; border: 0; margin: 0 0 1.2rem;
          background: linear-gradient(90deg, var(--gold), transparent);
        }
        .ed-section .lede {
          max-width: 660px; font-size: 0.98rem;
          color: rgba(11, 11, 13, 0.8);
        }

        /* ---------- Video grid ---------- */
        .ed-video-grid {
          display: grid; gap: 1.4rem; margin-top: 2.2rem;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }
        .ed-video-card {
          background: var(--bone);
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: 1.2rem 1.2rem 1.4rem;
          box-shadow: 0 2px 10px rgba(30, 58, 138, 0.06);
        }
        .ed-section.deep .ed-video-card { background: var(--bone); }
        .ed-video-card h3 {
          font-size: 1.12rem; font-weight: 600; color: var(--royal);
        }
        .ed-video-card p {
          font-family: 'Poppins', sans-serif;
          margin: 0.15rem 0 0.9rem; font-size: 0.8rem; font-weight: 500;
          color: var(--bronze);
        }
        .ed-video {
          display: block; width: 100%; aspect-ratio: 16 / 9;
          border: 0; border-radius: 12px;
          background: var(--obsidian);
        }

        /* ---------- Skills ---------- */
        .ed-skill-grid {
          display: grid; gap: 1.4rem; margin-top: 2.2rem;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }
        .ed-skill-card {
          background: var(--bone);
          border: 1px solid var(--line);
          border-top: 4px solid var(--royal);
          border-radius: 18px;
          padding: 1.5rem 1.5rem 1.6rem;
        }
        .ed-skill-card .range {
          font-family: 'Poppins', sans-serif;
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--sky);
        }
        .ed-skill-card h3 {
          font-size: 1.25rem; font-weight: 600; color: var(--royal);
          margin: 0.3rem 0 0.7rem;
        }
        .ed-skill-card p { margin: 0 0 1.1rem; font-size: 0.9rem; }
        .ed-chips { display: flex; flex-wrap: wrap; gap: 0.45rem; }
        .ed-chip {
          font-family: 'Poppins', sans-serif;
          font-size: 0.74rem; font-weight: 600;
          color: var(--royal); background: rgba(76, 141, 246, 0.12);
          border: 1px solid rgba(76, 141, 246, 0.4);
          border-radius: 999px; padding: 0.3rem 0.8rem;
        }

        /* ---------- Experience ---------- */
        .ed-timeline { margin-top: 2.2rem; display: grid; gap: 1rem; }
        .ed-job {
          background: var(--bone);
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: 1.3rem 1.5rem;
          display: grid; gap: 0.15rem;
          border-left: 4px solid var(--royal);
        }
        .ed-job .years {
          font-family: 'Poppins', sans-serif;
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.16em;
          text-transform: uppercase; color: var(--amber);
        }
        .ed-job h3 { font-size: 1.1rem; font-weight: 600; color: var(--royal); }
        .ed-job .org {
          font-family: 'Poppins', sans-serif;
          font-size: 0.8rem; font-weight: 500; color: var(--bronze);
        }
        .ed-job .note { margin: 0.5rem 0 0; font-size: 0.88rem; }
        .ed-creds {
          margin-top: 2rem; display: flex; flex-wrap: wrap; gap: 0.5rem;
        }
        .ed-cred {
          font-family: 'Poppins', sans-serif;
          font-size: 0.76rem; font-weight: 600;
          color: var(--obsidian); background: rgba(232, 163, 61, 0.16);
          border: 1px solid rgba(232, 163, 61, 0.55);
          border-radius: 999px; padding: 0.35rem 0.9rem;
        }

        /* ---------- References ---------- */
        .ed-quote-grid {
          display: grid; gap: 1.4rem; margin-top: 2.2rem;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }
        .ed-quote {
          background: var(--bone);
          border: 1px solid var(--line);
          border-left: 4px solid var(--amber);
          border-radius: 18px;
          padding: 1.5rem 1.6rem;
          margin: 0;
        }
        .ed-quote p { margin: 0 0 0.9rem; font-size: 0.92rem; }
        .ed-quote cite {
          font-family: 'Poppins', sans-serif;
          font-style: normal; font-weight: 600; font-size: 0.78rem;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--royal);
        }

        /* ---------- Contact ---------- */
        .ed-contact {
          background: var(--royal); color: var(--bone);
          text-align: center; border-radius: 32px;
          max-width: 1000px; margin: 0 auto 4rem;
          padding: 4rem 1.5rem;
          position: relative; overflow: hidden;
        }
        .ed-contact::before {
          content: "";
          position: absolute; left: 50%; top: 0; transform: translateX(-50%);
          width: min(420px, 70%); height: 3px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
        }
        .ed-contact h2 { color: var(--bone); }
        .ed-contact .ed-kicker { color: var(--amber); }
        .ed-contact a.detail {
          font-family: 'Poppins', sans-serif;
          display: block; margin-top: 0.5rem;
          color: var(--bone); font-size: 1rem; font-weight: 500;
          text-decoration: none;
        }
        .ed-contact a.detail:hover { color: var(--amber); }
        .ed-contact .ed-btn { margin-top: 1.8rem; }

        .ed-footer {
          color: rgba(11, 11, 13, 0.55);
          text-align: center; font-size: 0.78rem; padding: 0 1rem 2rem;
          font-family: 'Poppins', sans-serif;
        }

        @media (max-width: 720px) {
          .ed-links {
            display: none;
            position: absolute; top: 100%; left: 0; right: 0;
            background: var(--bone); border-bottom: 1px solid var(--line);
            flex-direction: column; gap: 0; padding: 0.5rem 0;
          }
          .ed-links.open { display: flex; }
          .ed-links a { padding: 0.75rem 1.4rem; border-bottom: none; }
          .ed-menu-btn { display: block; }
          .ed-hero { border-radius: 0 0 24px 24px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ed * { transition: none !important; }
        }
      `}</style>

      {/* Navigation */}
      <nav className="ed-nav">
        <a className="ed-wordmark" href="/music-education">Omega Bone</a>
        <button
          className="ed-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          Menu
        </button>
        <div className={`ed-links ${menuOpen ? "open" : ""}`}>
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={activeSection === item.href.slice(1) ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <header className="ed-hero" id="top">
        <div className="ed-hero-inner">
          <span className="ed-eyebrow">Music Education Specialist</span>
          <h1>
            Your scholars already have the music.<br /><span>I help them share it.</span>
          </h1>
          <p className="tagline">
            A third-generation educator with 25-plus years of teaching and
            curriculum leadership across the United States, Germany, Japan, and
            Malaysia. Scholars in my programs sing, play, and perform the music
            they create, then promote it through the websites, albums, and
            videos they produce.
          </p>
          <div className="ed-hero-ctas">
            <a className="ed-btn primary" href="#contact">Hire Me</a>
            <a className="ed-btn ghost" href="#featured-work">See the Work</a>
          </div>
        </div>
      </header>

      {/* Featured Work */}
      <section className="ed-section" id="featured-work">
        <div className="ed-container">
          <div className="ed-kicker">Featured Work</div>
          <h2>A few projects, from first note to final cut.</h2>
          <hr className="ed-rule" />
          <p className="lede">
            Singers learn their parts; an orchestra in rehearsal; a collaboration
            with physical education; a short film written, scored, and produced
            by scholars; students conduct, sing and dance; and behind the scenes
            at the Winter Concert.
          </p>
          <div className="ed-video-grid">
            {videos.map((v) => (
              <div className="ed-video-card" key={v.id}>
                <h3>{v.title}</h3>
                <p>{v.detail}</p>
                <iframe
                  className="ed-video"
                  src={`https://www.youtube.com/embed/${v.id}`}
                  title={`${v.title} (${v.detail})`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="ed-section deep" id="skills">
        <div className="ed-container">
          <div className="ed-kicker">What I Bring</div>
          <h2>Music that supports learning across every discipline.</h2>
          <hr className="ed-rule" />
          <p className="lede">
            Music is taught for aesthetic development and used to strengthen
            learning in every subject it touches. Here is the range of work I
            bring to a school or organization.
          </p>
          <div className="ed-skill-grid">
            {skillGroups.map((g) => (
              <div className="ed-skill-card" key={g.title}>
                <h3>{g.title}</h3>
                <p>{g.summary}</p>
                <div className="ed-chips">
                  {g.chips.map((c) => (
                    <span className="ed-chip" key={c}>{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="ed-section" id="experience">
        <div className="ed-container">
          <div className="ed-kicker">Experience</div>
          <h2>25-plus years across three continents.</h2>
          <hr className="ed-rule" />
          <p className="lede">
            International Baccalaureate PYP and American curriculum, elementary
            through high school, from Los Angeles to Wiesbaden to Kyoto to
            Forest City.
          </p>
          <a
            className="ed-btn royal"
            href="/Bone_Resume_2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginTop: "1.4rem" }}
          >
            Download Resume (PDF)
          </a>
          <div className="ed-timeline">
            {experience.map((job) => (
              <div className="ed-job" key={`${job.years}-${job.role}`}>
                <span className="years">{job.years}</span>
                <h3>{job.role}</h3>
                <span className="org">{job.org}</span>
                <p className="note">{job.note}</p>
              </div>
            ))}
          </div>
          <div className="ed-creds">
            {credentials.map((c) => (
              <span className="ed-cred" key={c}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* References */}
      <section className="ed-section deep" id="references">
        <div className="ed-container">
          <div className="ed-kicker">References</div>
          <h2>What school leaders say.</h2>
          <hr className="ed-rule" />
          <div className="ed-quote-grid">
            <blockquote className="ed-quote">
              <p>
                &ldquo;Miss Bone is a remarkable person who worked with over 100
                students in choir. She is well respected by students, peers, and
                parents alike. Her musical talents exceeded our expectations. I
                recommend her with enthusiasm.&rdquo;
              </p>
              <cite>Vice Principal</cite>
            </blockquote>
            <blockquote className="ed-quote">
              <p>
                &ldquo;You are an amazing teacher, and you were able to
                integrate reading, writing, listening, speaking, music, and
                social justice. Thank you for developing the consciousness of
                our students to the issues that impact their community.&rdquo;
              </p>
              <cite>Literacy Coach</cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="ed-section" id="contact" style={{ paddingTop: 0 }}>
        <div className="ed-contact">
          <div className="ed-kicker">Contact</div>
          <h2>Let&rsquo;s put music at the center of your program.</h2>
          <a className="detail" href="mailto:singer@omegabone.com">
            singer@omegabone.com
          </a>
          <a className="detail" href="tel:+13239614050">
            WhatsApp: +1.323.961.4050
          </a>
          <a className="ed-btn primary" href="mailto:singer@omegabone.com">
            Start the Conversation
          </a>
        </div>
      </section>

      <footer className="ed-footer">
        © QB1 Edutainment 2026
      </footer>
    </div>
  );
}
