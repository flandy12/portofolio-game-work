"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { projectCounts, projects, type ProjectYear } from "./projects";

type ProjectFilter = "all" | ProjectYear;

const disciplines = [
  {
    number: "01",
    title: "Gameplay System",
    body: "Merancang state permainan, scoring, timer, level, combo, dan feedback agar aturan mudah dipahami sejak interaksi pertama.",
  },
  {
    number: "02",
    title: "Creative Frontend",
    body: "Membangun pengalaman visual kaya animasi dengan JavaScript, Canvas, WebGL, computer vision, dan aset brand.",
  },
  {
    number: "03",
    title: "Event Ready",
    body: "Mengutamakan kontrol sederhana, tampilan layar besar, sesi singkat, reset cepat, dan alur yang aman untuk kebutuhan booth.",
  },
];

const clientLogos = [
  { name: "UNIQUIP", image: "/clients/logo-uniquip.png" },
  { name: "HEXOS", image: "/clients/logo-hexos.jpg" },
  { name: "INTERBAT", image: "/clients/logo-interbat.jpeg" },
  { name: "KEMENPERIN", image: "/clients/logo-kemenperin.svg" },
  { name: "MONASH UNIVERSITY", image: "/clients/logo-monash-univ.png" },
  { name: "HOME CREDIT", image: "/clients/logo-home-credit.png" },
  { name: "DKI JAKARTA", image: "/clients/jakarta.png" },
];

const filters: { value: ProjectFilter; label: string; count: number }[] = [
  { value: "all", label: "Semua karya", count: projectCounts.all },
  { value: 2026, label: "2026", count: projectCounts[2026] },
  { value: 2025, label: "2025", count: projectCounts[2025] },
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("all");
  const visibleProjects = useMemo(
    () =>
      activeFilter === "all"
        ? projects
        : projects.filter((project) => project.year === activeFilter),
    [activeFilter],
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Game Portfolio — Flandy Rockyliano Mamun",
    description: "Koleksi 21 browser game dan interactive experience produksi 2025–2026.",
    author: {
      "@type": "Person",
      name: "Flandy Rockyliano Mamun",
      jobTitle: "Creative Web Developer",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
      })),
    },
  };

  const safeStructuredData = JSON.stringify(structuredData).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeStructuredData }}
      />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Kembali ke bagian atas">
          <span className="brand-mark">FR</span>
          <span>Game Portfolio</span>
        </a>
        <nav aria-label="Navigasi utama">
          <a href="#work">Karya</a>
          <a href="#expertise">Keahlian</a>
          <a className="nav-cta" href="mailto:flandydev@gmail.com">Hubungi saya</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-two" aria-hidden="true" />

          <div className="hero-copy">
            <p className="eyebrow"><span /> Creative web developer · Indonesia</p>
            <h1 id="hero-title">
              I build games<br />
              <span>people want</span><br />
              to play again.
            </h1>
            <p className="hero-intro">
              Portofolio game 2025–2026 yang memadukan gameplay sederhana, visual kuat,
              computer vision, dan teknologi web. Sebanyak {projectCounts.playable} demo dapat
              langsung dimainkan di browser.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">Jelajahi 21 karya</a>
              <a className="text-link" href="mailto:flandydev@gmail.com">
                flandydev@gmail.com <span>↗</span>
              </a>
            </div>
          </div>

          <div className="hero-console" aria-label="Ringkasan portofolio">
            <div className="console-top">
              <span>PROJECT ARCHIVE</span>
              <span className="status"><i /> 2025—2026</span>
            </div>
            <div className="console-main">
              <p className="console-label">PRODUCTION BUILDS</p>
              <strong>{projectCounts.all}</strong>
              <p>Browser games, prize mechanics & live installations</p>
            </div>
            <div className="console-stats">
              <div><span>2026</span><strong>{projectCounts[2026]} builds</strong></div>
              <div><span>2025</span><strong>{projectCounts[2025]} builds</strong></div>
              <div><span>PLAYABLE</span><strong>{projectCounts.playable} demos</strong></div>
            </div>
          </div>

          <a className="scroll-cue" href="#work">
            <span>Scroll to explore</span>
            <i aria-hidden="true" />
          </a>
        </section>

        <section className="work-section" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><span /> Production archive</p>
              <h2 id="work-title">Built to play.<br />Organized by year.</h2>
            </div>
            <p>
              Seluruh karya di bawah diselaraskan langsung dengan proyek dalam folder produksi
              2025 dan 2026—dari arcade physics hingga hand tracking realtime.
            </p>
          </div>

          <div className="project-filters" role="group" aria-label="Filter proyek berdasarkan tahun">
            {filters.map((filter) => (
              <button
                className={activeFilter === filter.value ? "is-active" : ""}
                type="button"
                aria-pressed={activeFilter === filter.value}
                onClick={() => setActiveFilter(filter.value)}
                key={filter.value}
              >
                <span>{filter.label}</span>
                <strong>{String(filter.count).padStart(2, "0")}</strong>
              </button>
            ))}
          </div>

          <p className="filter-result" aria-live="polite">
            Menampilkan {visibleProjects.length} proyek
            {activeFilter === "all" ? " dari dua tahun produksi" : ` produksi ${activeFilter}`}.
          </p>

          <div className="project-list">
            {visibleProjects.map((project, index) => (
              <article className={`project-card project-${project.tone}`} id={project.id} key={project.id}>
                <div className="project-visual">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    sizes="(max-width: 800px) 100vw, 58vw"
                  />
                  <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
                  <div className="visual-caption">
                    <span>{project.year}</span>
                    <span>Production build</span>
                  </div>
                </div>

                <div className="project-content">
                  <p className="project-category">{project.category}</p>
                  <h3>{project.title}</h3>
                  <p className="project-description">{project.description}</p>

                  <div className="project-block">
                    <span>Design challenge</span>
                    <p>{project.challenge}</p>
                  </div>

                  <ul className="feature-list" aria-label={`Fitur ${project.title}`}>
                    {project.features.map((feature) => <li key={feature}>{feature}</li>)}
                  </ul>

                  <div className="stack-list" aria-label={`Teknologi ${project.title}`}>
                    {project.stack.map((item) => <span key={item}>{item}</span>)}
                  </div>

                  <div className="demo-actions">
                    {project.demo ? (
                      <a
                        className="demo-button"
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Mainkan demo ${project.title} di tab baru`}
                      >
                        <span>Mainkan demo</span>
                        <strong aria-hidden="true">↗</strong>
                      </a>
                    ) : (
                      <p className="demo-unavailable">
                        <span aria-hidden="true">◇</span>
                        {project.demoNote ?? "Demo belum tersedia"}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <section className="client-strip" aria-labelledby="client-strip-title">
            <div className="client-strip-heading">
              <span id="client-strip-title">Selected clients</span>
              <p>Brand yang telah menggunakan interactive experience.</p>
            </div>

            <div className="client-marquee">
              <div className="client-marquee-track">
                {[0, 1].map((copy) => (
                  <ul className="client-logo-group" aria-hidden={copy === 1} key={copy}>
                    {clientLogos.map((client) => (
                      <li className="client-logo" key={`${copy}-${client.name}`}>
                        <Image
                          src={client.image}
                          alt={`${client.name} logo`}
                          width={260}
                          height={80}
                          sizes="(max-width: 760px) 190px, 240px"
                        />
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </section>
        </section>

        <section className="expertise-section" id="expertise" aria-labelledby="expertise-title">
          <div className="section-heading section-heading-light">
            <div>
              <p className="eyebrow"><span /> What I bring</p>
              <h2 id="expertise-title">From idea to<br />playable experience.</h2>
            </div>
            <p>
              Saya menggabungkan logika permainan, interface, motion, dan integrasi server
              menjadi pengalaman yang bisa langsung dimainkan di browser.
            </p>
          </div>

          <div className="discipline-grid">
            {disciplines.map((item) => (
              <article key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>

          <div className="toolbelt">
            <span>HTML5</span><i />
            <span>CSS3</span><i />
            <span>JavaScript</span><i />
            <span>PHP</span><i />
            <span>Laravel</span><i />
            <span>Three.js</span><i />
            <span>MediaPipe</span>
          </div>
        </section>

        <section className="contact-section" aria-labelledby="contact-title">
          <p className="eyebrow"><span /> Start a project</p>
          <h2 id="contact-title">Punya ide game<br />untuk event berikutnya?</h2>
          <p>
            Mari ubah konsep brand, campaign, atau exhibition menjadi pengalaman interaktif
            yang sederhana untuk dimainkan dan mudah diingat.
          </p>
          <a className="button button-primary" href="mailto:flandydev@gmail.com">Diskusikan project</a>
          <span className="contact-note">Open for collaboration · Tangerang, Indonesia</span>
        </section>
      </main>

      <footer>
        <a className="brand" href="#top">
          <span className="brand-mark">FR</span>
          <span>Game Portfolio</span>
        </a>
        <p>© 2026 Flandy Rockyliano Mamun</p>
        <a href="#top">Kembali ke atas ↑</a>
      </footer>
    </>
  );
}
