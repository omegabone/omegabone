export function StatsBar() {
  const stats = [
    { value: "7,400+", label: "Students Trained" },
    { value: "25+", label: "Years of Teaching Experience" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "7", label: "Countries Taught In" },
  ];

  return (
    <section className="bg-[#1a56db] py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p
                className="text-white"
                style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 800, letterSpacing: "-0.02em" }}
              >
                {stat.value}
              </p>
              <p className="text-blue-200 text-sm mt-1" style={{ fontWeight: 500 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}