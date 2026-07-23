export function ForSchoolsBlock() {
  return (
    <section className="py-8 px-4 sm:px-6">
      <style>{`
        .fsb * { box-sizing: border-box; }
        .fsb-inner {
          max-width: 620px; margin: 0 auto;
          background: #1e3a8a; color: #f4efe6;
          border-radius: 16px;
          padding: 1rem 1.25rem;
          display: flex; align-items: center; justify-content: space-between;
          gap: 1rem; flex-wrap: wrap;
        }
        .fsb-inner p {
          font-family: 'Fredoka', system-ui, sans-serif;
          margin: 0; font-size: 1rem; font-weight: 500; line-height: 1.3;
        }
        .fsb-btn {
          font-family: 'Poppins', sans-serif;
          flex: 0 0 auto;
          display: inline-block; text-decoration: none;
          background: #e8a33d; color: #0b0b0d;
          font-weight: 600; font-size: 0.85rem;
          padding: 0.55rem 1.2rem; border-radius: 999px;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .fsb-btn:hover { background: #f0b357; }

        @media (max-width: 560px) {
          .fsb-btn { width: 100%; text-align: center; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fsb * { transition: none !important; }
        }
      `}</style>

      <div className="fsb-inner">
        <p>Hiring for a school or program?</p>
        <a className="fsb-btn" href="/music-education">
          See My Education Work
        </a>
      </div>
    </section>
  );
}
