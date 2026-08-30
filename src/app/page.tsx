const capabilities = [
  "Next.js App Router",
  "Strict TypeScript",
  "Environment validation",
  "Security headers",
  "Health API",
  "Automated CI",
];

export default function HomePage() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Production-oriented starter</p>
        <h1>Build enterprise web applications from a safer baseline.</h1>
        <p className="lede">
          A focused Next.js and TypeScript foundation for SaaS products, internal platforms,
          secure APIs, and modern business applications.
        </p>
        <div className="actions">
          <a href="/api/health">Check API health</a>
          <a className="secondary" href="https://github.com/Zedrider9t/nextjs-enterprise-starter">
            View repository
          </a>
        </div>
      </section>

      <section className="grid" aria-label="Starter capabilities">
        {capabilities.map((capability) => (
          <article className="card" key={capability}>
            <span>✓</span>
            <h2>{capability}</h2>
          </article>
        ))}
      </section>
    </main>
  );
}
