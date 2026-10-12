"use client";

import Image from "next/image";

const projects = [
  {
    id: "beauty-timing",
    index: "01",
    title: "Catch the Falling Product",
    category: "Timing Game · Brand Activation",
    image: "/projects/beauty-timing.png",
    imageAlt: "Arena permainan Stop Produk Beauty berwarna merah muda dengan zona hadiah",
    description:
      "Permainan presisi bertema beauty yang menantang pemain menghentikan produk tepat di zona hadiah sebelum waktu habis.",
    challenge:
      "Mengubah interaksi satu tombol menjadi pengalaman booth yang terasa cepat, jelas, dan tetap menarik untuk dimainkan berulang kali.",
    features: ["Physics berbasis frame", "Timer 30 detik", "Perfect / Good / Miss", "Visual brand-ready"],
    stack: ["HTML5", "CSS3", "JavaScript", "Animation Frame"],
    tone: "rose",
  },
  {
    id: "find-difference",
    index: "02",
    title: "Find the Differences",
    category: "Puzzle Game · Visual Challenge",
    image: "/projects/find-difference-2.png",
    imageAlt: "Antarmuka game Find the Differences dengan dua gambar dan sistem bantuan",
    description:
      "Konsep puzzle observasi dengan dua gambar, target lima perbedaan, sistem nyawa, progress, bantuan, dan status hasil permainan.",
    challenge:
      "Menyusun banyak informasi permainan dalam satu layar tanpa menghilangkan fokus utama pemain pada pasangan gambar.",
    features: ["Target 5 perbedaan", "Nyawa & progress", "Hint dan bonus waktu", "State success / timeout"],
    stack: ["HTML5", "Tailwind CSS", "JavaScript", "Local Assets"],
    tone: "blue",
  },
  {
    id: "memory",
    index: "03",
    title: "Memory",
    category: "Memory Game · Multi-level",
    image: "/projects/memory-game.png",
    imageAlt: "Papan Memory Game dengan kartu alat berat, skor, timer, dan combo",
    description:
      "Game mencocokkan kartu bertema alat berat dengan lima tingkat kesulitan, perhitungan combo, skor, dan progres lokal.",
    challenge:
      "Menjaga permainan tetap responsif saat jumlah pasangan bertambah, sekaligus memberi feedback yang jelas pada setiap aksi pemain.",
    features: ["5 level kesulitan", "Combo scoring", "Best score lokal", "Board responsif"],
    stack: ["HTML5", "CSS3", "JavaScript", "LocalStorage"],
    tone: "navy",
  },
  {
    id: "fruit-slice",
    index: "04",
    title: "Fruit Slice 3D",
    category: "Arcade Game · WebGL",
    image: "/projects/fruit-slice.png",
    imageAlt: "Arena Fruit Slice bernuansa taman Asia dengan buah-buahan di sisi layar",
    description:
      "Eksperimen arcade berbasis browser dengan buah 3D, bom, nyawa, combo, challenge, partikel, dan tingkat spawn dinamis.",
    challenge:
      "Menggabungkan rendering realtime dan deteksi input yang tetap responsif pada mouse maupun layar sentuh.",
    features: ["Three.js realtime", "Mouse & touch input", "Particle effects", "Dynamic difficulty"],
    stack: ["Three.js", "WebGL", "JavaScript", "Canvas"],
    tone: "cyan",
  },
  {
    id: "drop-precision",
    index: "05",
    title: "Tantangan Drop Presisi",
    category: "Timing Game · Industrial Experience",
    image: "/projects/drop-precision.png",
    imageAlt: "Arena tambang UNIQUIP dengan hadiah tergantung dan target presisi",
    description:
      "Game presisi bertema industri dengan tiga kesempatan, sepuluh tingkat kesulitan, stok hadiah, dan scoring berdasarkan titik jatuh.",
    challenge:
      "Menerjemahkan identitas industri menjadi mekanik sederhana yang cocok untuk pameran, booth, dan layar interaktif.",
    features: ["Level 1–10", "3 kesempatan", "Precision scoring", "Audio feedback"],
    stack: ["HTML5", "CSS3", "JavaScript", "Web Audio"],
    tone: "amber",
  },
  {
    id: "voice-activation-campaigns",
    index: "06",
    title: "Voice Activation Campaigns",
    category: "Voice Game · Brand Activation",
    image: "/projects/hexos-game.png",
    imageAlt: "Game aktivasi suara HEXOS dengan indikator volume dan target teriakan",
    description:
      "Kampanye interaktif berbasis suara yang mengajak pengunjung berteriak sekuatnya untuk mengisi indikator hingga 100% dan memenangkan hadiah.",
    challenge:
      "Mengubah intensitas suara dari mikrofon menjadi progres visual real-time yang responsif, mudah dipahami, dan tetap stabil di tengah keramaian acara.",
    features: ["Microphone input", "Live volume meter", "Timed challenge", "Player registration"],
    stack: ["HTML5", "CSS3", "JavaScript", "Web Audio API"],
    tone: "amber",
  },
  {
    id: "comment-wall-realtime",
    index: "07",
    title: "Comment Wall Realtime",
    category: "Realtime Experience · Event Engagement",
    image: "/projects/comment-wall-realtime.png",
    imageAlt: "Pengunjung memindai QR code untuk mengirim pesan ke comment wall pada layar videotron",
    description:
      "Pengalaman interaktif yang memungkinkan pengunjung memindai QR code, menulis pesan dari ponsel, lalu melihat pesan terpilih tampil secara real-time di layar videotron.",
    challenge:
      "Menjaga pengiriman pesan tetap cepat saat trafik tinggi sekaligus melindungi layar publik melalui sanitasi input, rate limiting, dan moderasi sebelum pesan ditayangkan.",
    features: ["QR-based access", "Realtime message sync", "Admin moderation", "Live videotron display"],
    stack: ["Next.js", "Node.js", "Socket.IO", "PostgreSQL"],
    tone: "cyan",
  },
  {
    id: "interactive-quiz-game",
    index: "08",
    title: "Interactive Quiz Game",
    category: "Realtime Quiz · Audience Engagement",
    image: "/projects/interactive-quiz-game.png",
    imageAlt: "Peserta menjawab kuis dari ponsel dengan pertanyaan dan leaderboard pada layar videotron",
    description:
      "Kuis multiplayer untuk event yang memungkinkan peserta bergabung melalui QR code atau room code, menjawab dari ponsel, dan mengikuti perubahan skor secara real-time di videotron.",
    challenge:
      "Menyinkronkan pertanyaan, timer, jawaban, dan leaderboard untuk banyak peserta sekaligus dengan validasi server, pembatasan satu jawaban per ronde, serta rate limiting untuk mencegah spam.",
    features: ["QR & room-code join", "Timed questions", "Realtime leaderboard", "Host control panel"],
    stack: ["Next.js", "Node.js", "Socket.IO", "PostgreSQL"],
    tone: "blue",
  },
  {
    id: "luxury-spin-wheel",
    index: "09",
    title: "Spin the Wheel",
    category: "Prize Game · Premium Brand Activation",
    image: "/projects/luxury-spin-wheel.png",
    imageAlt: "Game spin the wheel mewah bernuansa hitam, emerald, dan emas pada acara premium",
    description:
      "Game roda hadiah berdesain premium untuk event eksklusif, dengan animasi putaran yang halus, konfigurasi peluang hadiah, dan tampilan pemenang yang dramatis.",
    challenge:
      "Menjaga animasi roda tetap selaras dengan hasil hadiah dari server, membatasi satu putaran per sesi, dan mencatat klaim secara idempoten agar stok hadiah tidak terpotong ganda.",
    features: ["Weighted prize setup", "Premium spin animation", "One-spin session", "Winner history"],
    stack: ["Next.js", "Node.js", "PostgreSQL", "Web Animations API"],
    tone: "amber",
  },
  {
    id: "interactive-puzzle-game",
    index: "10",
    title: "Interactive Puzzle Challenge",
    category: "Puzzle Game · Touchscreen Experience",
    image: "/projects/interactive-puzzle-game-2.png",
    imageAlt: "Papan puzzle jigsaw interaktif dengan timer, skor, level, progress, dan tombol hint",
    description:
      "Game interaktif yang menantang pemain menyusun potongan gambar sebelum waktu habis, lengkap dengan level bertahap, hint, progress, dan perhitungan skor.",
    challenge:
      "Menyamakan perilaku drag-and-drop pada mouse dan layar sentuh, menjaga koordinat potongan tetap akurat saat ukuran layar berubah, serta memvalidasi posisi tanpa snap yang terasa membingungkan.",
    features: ["Drag & drop pieces", "Progressive levels", "Timer & scoring", "Hint system"],
    stack: ["HTML5", "CSS3", "JavaScript", "Pointer Events"],
    tone: "cyan",
  },
  {
    id: "tebak-kata-game",
    index: "11",
    title: "Tebak Kata Interaktif",
    category: "Word Game · Event Challenge",
    image: "/projects/tebak-kata-game.png",
    imageAlt: "Game Tebak Kata dengan petunjuk gambar kucing, tile huruf, timer, skor, combo, dan hint",
    description:
      "Permainan tebak kata berbasis petunjuk visual yang mengajak pemain menyusun tile huruf sebelum waktu habis sambil membangun combo dan mengejar skor tertinggi.",
    challenge:
      "Mengacak pilihan huruf tanpa membuat soal mustahil, menormalisasi jawaban agar validasi tetap konsisten, serta menyeimbangkan timer, hint, dan penalti untuk sesi event yang singkat.",
    features: ["Visual word clues", "Letter-tile input", "Combo scoring", "Hint & skip system"],
    stack: ["HTML5", "CSS3", "JavaScript", "LocalStorage"],
    tone: "rose",
  },
];

const labProjects = [
  {
    index: "12",
    title: "Flappy Multiplayer",
    type: "Realtime multiplayer prototype",
    image: "/projects/flappy-multiplayer.png",
    imageAlt: "Tiga burung berwarna terbang bersama melewati gerbang neon dalam dunia arcade futuristis",
    description:
      "Eksperimen Flappy berbasis Canvas dengan controller terpisah, room code, dan sinkronisasi input lompat melalui WebSocket.",
    features: ["Room-based session", "Remote controller", "Realtime player sync"],
    stack: ["React", "Canvas", "Socket.IO", "Express"],
    accent: "violet",
  },
  {
    index: "13",
    title: "Hand Catch",
    type: "Computer vision browser game",
    image: "/projects/hand-catch.png",
    imageAlt: "Tangan dengan landmark computer vision mengendalikan paddle untuk menangkap objek bercahaya",
    description:
      "Game menangkap objek menggunakan posisi jari telunjuk sebagai pengendali paddle langsung dari kamera browser.",
    features: ["Fingertip tracking", "Progressive speed", "Camera input"],
    stack: ["MediaPipe Hands", "Canvas", "Camera API", "JavaScript"],
    accent: "green",
  },
  {
    index: "14",
    title: "Gesture Paddle",
    type: "Python vision experiment",
    image: "/projects/gesture-paddle.png",
    imageAlt: "Gerakan jari mengendalikan paddle digital dan memantulkan bola bercahaya",
    description:
      "Permainan paddle desktop yang menerjemahkan landmark tangan menjadi gerakan horizontal dan sudut pantulan bola.",
    features: ["Hand landmark control", "Physics collision", "Realtime score"],
    stack: ["Python", "OpenCV", "MediaPipe", "NumPy"],
    accent: "lime",
  },
  {
    index: "15",
    title: "Marimas Voice Chomp",
    type: "Voice-controlled brand game",
    image: "/projects/voice-chomp.png",
    imageAlt: "Karakter buah jeruk ceria menangkap potongan buah melalui gelombang suara",
    description:
      "Game karakter interaktif yang merespons volume suara untuk membuka mulut, menangkap produk, membangun combo, dan naik level.",
    features: ["Microphone control", "Combo & level", "Animated character states"],
    stack: ["Web Audio API", "JavaScript", "CSS Animation", "MediaDevices"],
    accent: "orange",
  },
  {
    index: "16",
    title: "Head Motion Flight",
    type: "Face-tracking 3D game",
    image: "/projects/head-motion-flight.png",
    imageAlt: "Pesawat terbang melewati ring neon dengan antarmuka pelacakan wajah",
    description:
      "Flight game 3D yang membaca pergerakan kepala untuk mengarahkan pesawat, melewati obstacle, dan mengejar skor.",
    features: ["Head pose input", "3D obstacle course", "Follow camera"],
    stack: ["Three.js", "MediaPipe Face Mesh", "GLTF", "WebGL"],
    accent: "cyan",
  },
  {
    index: "17",
    title: "Flight Catch Challenge",
    type: "Endless runner 3D",
    image: "/projects/flight-catch-2.png",
    imageAlt: "Karakter biru berlari di runway mengumpulkan tiket dan menghindari koper",
    description:
      "Permainan bertema penerbangan dengan lintasan runway, koleksi boarding pass, obstacle, timer, dan camera shake.",
    features: ["60-second challenge", "Collectible tickets", "Collision feedback"],
    stack: ["Three.js", "WebGL", "JavaScript", "Keyboard Input"],
    accent: "blue",
  }
];

const disciplines = [
  {
    number: "01",
    title: "Gameplay System",
    body: "Merancang state permainan, scoring, timer, level, combo, dan feedback agar aturan mudah dipahami sejak interaksi pertama.",
  },
  {
    number: "02",
    title: "Creative Frontend",
    body: "Membangun pengalaman visual kaya animasi dengan JavaScript, Canvas, WebGL, dan aset brand tanpa bergantung pada backend.",
  },
  {
    number: "03",
    title: "Event Ready",
    body: "Mengutamakan kontrol sederhana, tampilan layar besar, sesi singkat, dan reset cepat untuk kebutuhan booth serta activation.",
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

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Game Portfolio — Flandy Rockyliano Mamun",
    description: "Koleksi browser game dan interactive experience karya Flandy Rockyliano Mamun.",
    author: {
      "@type": "Person",
      name: "Flandy Rockyliano Mamun",
      jobTitle: "Creative Web Developer",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: projects.length + labProjects.length,
      itemListElement: [...projects, ...labProjects].map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
              Portofolio browser game dan interactive experience yang memadukan gameplay sederhana,
              visual kuat, serta teknologi web untuk event dan brand activation.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">Jelajahi karya</a>
              <a className="text-link" href="mailto:flandydev@gmail.com">flandydev@gmail.com <span>↗</span></a>
            </div>
          </div>

          <div className="hero-console" aria-label="Ringkasan portofolio">
            <div className="console-top">
              <span>PLAYER PROFILE</span>
              <span className="status"><i /> AVAILABLE</span>
            </div>
            <div className="console-main">
              <p className="console-label">SELECTED BUILDS</p>
              <strong>17</strong>
              <p>Playable concepts, brand games & live installations</p>
            </div>
            <div className="console-stats">
              <div><span>CORE</span><strong>JavaScript</strong></div>
              <div><span>RENDER</span><strong>DOM + WebGL</strong></div>
              <div><span>FORMAT</span><strong>Event-ready</strong></div>
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
              <p className="eyebrow"><span /> Selected work</p>
              <h2 id="work-title">Built to play.<br />Designed to engage.</h2>
            </div>
            <p>
              Setiap proyek dibangun dari mekanik yang berbeda—mulai dari timing dan observasi,
              hingga memori dan rendering 3D realtime.
            </p>
          </div>

          <div className="project-list">
            {projects.map((project) => (
              <article className={`project-card project-${project.tone}`} id={project.id} key={project.id}>
                <div className="project-visual">
                  <Image
                    src={`${project.image}`}
                    alt={project.imageAlt}
                    fill
                    sizes="(max-width: 800px) 100vw, 58vw"
                  />
                  <span className="project-number">{project.index}</span>
                  <div className="visual-caption">
                    <span>Browser game</span>
                    <span>Interactive experience</span>
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

          <div className="lab-heading">
            <div>
              <p className="eyebrow"><span /> Interaction lab</p>
              <h3>Experiments beyond<br />the usual controls.</h3>
            </div>
            <p>
              Prototype dan instalasi yang mengeksplorasi multiplayer realtime, computer vision,
              gesture, suara, serta pengalaman event berskala besar.
            </p>
          </div>

          <div className="lab-grid">
            {labProjects.map((project) => (
              <article className={`lab-card lab-${project.accent}`} key={project.index}>
                <div className="lab-card-top">
                  <span>{project.index}</span>
                  <i aria-hidden="true" />
                </div>
                <div className="lab-visual">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    sizes="(max-width: 760px) 100vw, (max-width: 1080px) 50vw, 33vw"
                  />
                </div>
                <p className="lab-type">{project.type}</p>
                <h3>{project.title}</h3>
                <p className="lab-description">{project.description}</p>
                <ul aria-label={`Fitur ${project.title}`}>
                  {project.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
                <div className="lab-stack" aria-label={`Teknologi ${project.title}`}>
                  {project.stack.map((item) => <span key={item}>{item}</span>)}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="expertise-section" id="expertise" aria-labelledby="expertise-title">
          <div className="section-heading section-heading-light">
            <div>
              <p className="eyebrow"><span /> What I bring</p>
              <h2 id="expertise-title">From idea to<br />playable experience.</h2>
            </div>
            <p>
              Saya menggabungkan logika permainan, interface, dan motion menjadi pengalaman web
              yang bisa langsung dimainkan di browser.
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
            <span>Three.js</span><i />
            <span>WebGL</span><i />
            <span>Canvas</span>
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
