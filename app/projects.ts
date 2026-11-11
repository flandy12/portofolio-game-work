export type ProjectYear = 2025 | 2026;

export type Project = {
  id: string;
  year: ProjectYear;
  title: string;
  category: string;
  image: string;
  imageAlt: string;
  demo?: string;
  demoNote?: string;
  description: string;
  challenge: string;
  features: string[];
  stack: string[];
  tone: "rose" | "blue" | "navy" | "cyan" | "amber";
};

export const projects: Project[] = [
  {
    id: "gesture-hoop",
    year: 2026,
    title: "Gesture Hoop",
    category: "Hand Tracking · 3D Arcade",
    image: "/projects/basket-ball-tracking-hand.png",
    imageAlt: "Game basket 3D yang dikendalikan dengan gesture tangan melalui kamera",
    demo: "/demos/gesture-hoop/index.html",
    description:
      "Arcade basket berbasis webcam yang menerjemahkan arah telunjuk, pinch, dan pelepasan tangan menjadi bidikan, power, dan tembakan.",
    challenge:
      "Menjaga pembacaan 21 landmark tangan tetap halus dan responsif sambil menjalankan physics, collision, scoring, serta rendering arena 3D.",
    features: ["MediaPipe hand tracking", "Pinch-to-shoot", "45-second session", "Combo & achievement"],
    stack: ["Vite", "Three.js", "MediaPipe", "JavaScript"],
    tone: "blue",
  },
  {
    id: "burger-menu-memory",
    year: 2026,
    title: "Burger Menu Memory",
    category: "Memory Game · Food Experience",
    image: "/projects/hamburger.png",
    imageAlt: "Game memori susunan burger dengan bahan dan topping makanan",
    demo: "/demos/burger-memory/index.html",
    description:
      "Permainan mengingat urutan topping burger, lalu menyusun kembali pesanan dengan cepat dan tepat dalam sesi singkat.",
    challenge:
      "Membuat urutan visual mudah dibaca, input bahan nyaman di layar sentuh, dan tingkat kesulitan bertambah tanpa terasa acak.",
    features: ["Sequence memory", "20 topping assets", "Touch-friendly input", "Instant feedback"],
    stack: ["HTML5", "CSS3", "JavaScript", "Local Assets"],
    tone: "amber",
  },
  {
    id: "precision-drop",
    year: 2026,
    title: "Precision Drop",
    category: "Gesture Game · Brand Activation",
    image: "/projects/precision-challenge.png",
    imageAlt: "Game Precision Drop dengan produk bergerak dan zona target presisi",
    demo: "/demos/precision-drop/index.html",
    description:
      "Challenge presisi yang meminta pemain menghentikan produk tepat di pusat target untuk memperoleh skor dan hadiah terbaik.",
    challenge:
      "Menyeimbangkan toleransi target, progres kesulitan, dan feedback hasil agar kontrol sederhana tetap terasa kompetitif.",
    features: ["Precision scoring", "Progressive difficulty", "Reward state", "Config-driven gameplay"],
    stack: ["HTML5", "CSS3", "JavaScript", "Vitest"],
    tone: "rose",
  },
  {
    id: "gesture-paddle",
    year: 2026,
    title: "Gesture Paddle",
    category: "Computer Vision · Browser Game",
    image: "/projects/gesture-paddle.png",
    imageAlt: "Game paddle yang dikendalikan oleh posisi tangan dari kamera",
    demo: "/demos/gesture-paddle/index.html",
    description:
      "Game paddle browser yang menggunakan posisi tangan sebagai controller tanpa perangkat fisik tambahan.",
    challenge:
      "Menghaluskan koordinat kamera, menangani tangan yang hilang dari frame, dan mempertahankan collision yang konsisten pada berbagai resolusi.",
    features: ["Camera input", "Gesture smoothing", "Physics collision", "Progressive levels"],
    stack: ["MediaPipe", "Canvas", "JavaScript", "Camera API"],
    tone: "cyan",
  },
  {
    id: "beauty-timing",
    year: 2026,
    title: "Beauty Timing Challenge",
    category: "Timing Game · Brand Activation",
    image: "/projects/beauty-timing.png",
    imageAlt: "Arena permainan beauty timing dengan produk dan zona hadiah",
    demo: "/demos/beauty-timing/index.html",
    description:
      "Permainan timing bertema beauty yang menantang pemain menghentikan produk tepat di zona target sebelum waktu habis.",
    challenge:
      "Mengubah interaksi satu tombol menjadi pengalaman booth yang cepat, jelas, dan menarik untuk dimainkan berulang kali.",
    features: ["Timed challenge", "Perfect / Good / Miss", "Product variants", "Brand-ready visuals"],
    stack: ["HTML5", "CSS3", "JavaScript", "Animation Frame"],
    tone: "rose",
  },
  {
    id: "find-difference",
    year: 2026,
    title: "Find the Difference",
    category: "Puzzle Game · Visual Challenge",
    image: "/projects/find-difference-2.png",
    imageAlt: "Game mencari perbedaan dengan dua gambar, nyawa, timer, dan progress",
    demo: "/demos/find-difference/index.html",
    description:
      "Puzzle observasi dengan dua gambar, target perbedaan, sistem nyawa, progress, dan state hasil permainan.",
    challenge:
      "Menata banyak informasi dalam satu layar tanpa mengalihkan fokus pemain dari pasangan gambar utama.",
    features: ["Difference hotspots", "Lives & progress", "Timer", "Success / failed states"],
    stack: ["HTML5", "CSS3", "JavaScript", "Local Assets"],
    tone: "blue",
  },
  {
    id: "fruit-ninja",
    year: 2026,
    title: "Fruit Ninja",
    category: "Arcade Game · Canvas",
    image: "/projects/fruit-slice.png",
    imageAlt: "Arena game memotong buah dengan efek arcade",
    demo: "/demos/fruit-ninja/index.html",
    description:
      "Arcade slice berbasis browser dengan buah, skor, nyawa, combo, efek partikel, dan tingkat spawn yang dinamis.",
    challenge:
      "Menjaga deteksi swipe tetap presisi pada mouse dan layar sentuh sambil mempertahankan animasi yang mulus.",
    features: ["Swipe detection", "Combo scoring", "Particle effects", "Dynamic spawn"],
    stack: ["HTML5", "Canvas", "JavaScript", "Pointer Events"],
    tone: "cyan",
  },
  {
    id: "lucky-pop-gacha",
    year: 2026,
    title: "Lucky Pop! Gacha",
    category: "Prize Game · Booth Activation",
    image: "/projects/lucky-pop-gacha.png",
    imageAlt: "Mesin Lucky Pop Gacha dengan kapsul dan panel hadiah",
    demo: "/demos/lucky-pop-gacha/index.html",
    description:
      "Game gacha interaktif yang mengajak peserta menarik tuas, membuka kapsul, dan menerima hadiah beserta kode klaim unik.",
    challenge:
      "Mengelola bobot peluang, stok hadiah, validasi peserta, dan riwayat sesi tanpa membuat alur booth melambat.",
    features: ["Weighted prize pool", "Prize stock", "Unique claim code", "CSV history"],
    stack: ["HTML5", "CSS3", "JavaScript", "LocalStorage"],
    tone: "rose",
  },
  {
    id: "memory-2026",
    year: 2026,
    title: "Heavy Equipment Memory",
    category: "Memory Game · Multi-level",
    image: "/projects/memory-game.png",
    imageAlt: "Papan memory game alat berat dengan skor, timer, dan combo",
    demo: "/demos/memory-2026/index.html",
    description:
      "Game mencocokkan kartu alat berat dan perlengkapan keselamatan dengan level, combo, skor, dan progres lokal.",
    challenge:
      "Mempertahankan respons papan saat jumlah pasangan bertambah serta memberi feedback jelas untuk setiap kartu yang dipilih.",
    features: ["Progressive levels", "Combo scoring", "Best score", "Responsive board"],
    stack: ["HTML5", "CSS3", "JavaScript", "LocalStorage"],
    tone: "navy",
  },
  {
    id: "color-pop-puzzle",
    year: 2026,
    title: "Color Pop Puzzle",
    category: "Puzzle Game · Touchscreen",
    image: "/projects/interactive-puzzle-game-2.png",
    imageAlt: "Papan puzzle interaktif berwarna dengan timer dan progress",
    demo: "/demos/color-pop-puzzle/index.html",
    description:
      "Puzzle interaktif yang menantang pemain menyusun elemen visual sebelum waktu habis dalam antarmuka yang ramah layar sentuh.",
    challenge:
      "Menyamakan drag-and-drop pada mouse dan touch serta menjaga posisi potongan akurat ketika ukuran layar berubah.",
    features: ["Drag & drop", "Touch controls", "Timer & score", "Responsive layout"],
    stack: ["HTML5", "CSS3", "JavaScript", "Pointer Events"],
    tone: "cyan",
  },
  {
    id: "uniquip-timing",
    year: 2026,
    title: "UNIQUIP Timing Challenge",
    category: "Timing Game · Industrial Experience",
    image: "/projects/drop-precision.png",
    imageAlt: "Arena tambang UNIQUIP dengan objek bergerak dan target presisi",
    demo: "/demos/uniquip-timing/index.html",
    description:
      "Game timing bertema quarry yang meminta pemain menjatuhkan objek tepat di titik target untuk mengejar skor tertinggi.",
    challenge:
      "Menerjemahkan identitas industri menjadi mekanik sederhana yang cocok untuk booth, pameran, dan layar besar.",
    features: ["Precision target", "Timed movement", "Score feedback", "Event-ready reset"],
    stack: ["HTML5", "CSS3", "JavaScript", "Web Audio"],
    tone: "amber",
  },
  {
    id: "plinko-drop",
    year: 2025,
    title: "Plinko Drop Digital",
    category: "Physics Arcade · Prize Game",
    image: "/projects/plinko-drop.png",
    imageAlt: "Halaman pembuka game Plinko Drop dengan papan physics neon",
    demo: "/demos/plinko-drop/index.html",
    description:
      "Arcade physics yang mengajak pemain memilih posisi jatuh bola, melewati peg, lalu memperoleh poin dari slot tujuan.",
    challenge:
      "Membuat collision stabil dan variasi pantulan terasa natural sambil menjaga mode hadiah berbobot tetap transparan dan terkonfigurasi.",
    features: ["Custom 2D physics", "Pure / weighted mode", "Secure random", "Prize configuration"],
    stack: ["HTML5", "Canvas", "JavaScript", "LocalStorage"],
    tone: "cyan",
  },
  {
    id: "claw-machine",
    year: 2025,
    title: "Digital Claw Machine",
    category: "Arcade Prize · Touch Controls",
    image: "/projects/claw-machine.png",
    imageAlt: "Halaman pembuka game claw machine digital bernuansa ungu",
    demo: "/demos/claw-machine/index.html",
    description:
      "Mesin capit digital untuk event yang memberi pemain kontrol arah, waktu terbatas, dan kesempatan mengambil hadiah virtual.",
    challenge:
      "Menyelaraskan gerak capit, collision hadiah, dan aturan klaim agar hasil terasa jelas pada mouse maupun layar sentuh.",
    features: ["Directional controls", "Claw collision", "Prize inventory", "Session limit"],
    stack: ["HTML5", "CSS3", "JavaScript", "LocalStorage"],
    tone: "rose",
  },
  {
    id: "comment-wall",
    year: 2025,
    title: "Jakarta Music Festival Comment Wall",
    category: "Realtime Experience · Event Engagement",
    image: "/projects/comment-wall-realtime.png",
    imageAlt: "Pengunjung mengirim pesan ke comment wall pada layar acara",
    demoNote: "Instalasi event—demo publik belum tersedia",
    description:
      "Pengalaman festival yang memungkinkan pengunjung mengirim pesan dari ponsel untuk ditampilkan pada layar publik setelah moderasi.",
    challenge:
      "Menjaga pengiriman pesan cepat saat trafik tinggi sekaligus melindungi layar publik dari spam dan konten berbahaya.",
    features: ["Mobile submission", "Realtime display", "Admin moderation", "Videotron layout"],
    stack: ["HTML5", "JavaScript", "Realtime API", "Moderation"],
    tone: "cyan",
  },
  {
    id: "memory-2025",
    year: 2025,
    title: "Memory Challenge",
    category: "Memory Game · Score Attack",
    image: "/projects/memory-2025.png",
    imageAlt: "Papan Memory Challenge biru merah dengan timer, skor, dan combo",
    demoNote: "Folder berisi aset visual tanpa build executable",
    description:
      "Permainan mencocokkan pasangan kartu dengan timer, combo, level, bantuan, dan catatan skor terbaik.",
    challenge:
      "Mengatur progres jumlah kartu dan waktu bermain agar sesi tetap cepat tanpa mengorbankan keterbacaan di layar besar.",
    features: ["Card matching", "Combo multiplier", "Timed session", "Best score"],
    stack: ["HTML5", "CSS3", "JavaScript", "Local Assets"],
    tone: "navy",
  },
  {
    id: "price-rush",
    year: 2025,
    title: "Price Rush",
    category: "Quiz Game · Retail Challenge",
    image: "/projects/price-rush.png",
    imageAlt: "Halaman Price Rush dengan tantangan menebak harga produk",
    demo: "/demos/price-rush/index.html",
    description:
      "Game menebak harga produk dengan pilihan level, batas waktu, rangkaian soal, dan skor berdasarkan ketepatan jawaban.",
    challenge:
      "Menghasilkan opsi harga yang masuk akal dan memvalidasi jawaban dengan cepat tanpa membuat soal terlalu mudah ditebak.",
    features: ["Three difficulty levels", "Price generator", "Timed questions", "High score"],
    stack: ["HTML5", "CSS3", "JavaScript", "Web Audio"],
    tone: "amber",
  },
  {
    id: "trakindo-quiz",
    year: 2025,
    title: "TRAKINDO Interactive Quiz",
    category: "Team Quiz · Event Platform",
    image: "/projects/interactive-quiz-game.png",
    imageAlt: "Peserta kuis menjawab dari perangkat dengan leaderboard pada layar utama",
    demoNote: "Memerlukan Laravel, autentikasi, dan database",
    description:
      "Platform kuis tim untuk event dengan kategori, bank pertanyaan, jawaban peserta, kontrol host, dan rekap skor.",
    challenge:
      "Memvalidasi satu jawaban per ronde, menjaga sinkronisasi sesi, dan melindungi panel pengelolaan serta data peserta.",
    features: ["Team sessions", "Question categories", "Host control", "Score recap"],
    stack: ["Laravel", "PHP", "MySQL", "Vite"],
    tone: "blue",
  },
  {
    id: "search-word",
    year: 2025,
    title: "Search Word Challenge",
    category: "Word Game · Leaderboard",
    image: "/projects/tebak-kata-game.png",
    imageAlt: "Game kata interaktif dengan tile huruf, timer, dan skor",
    demoNote: "Memerlukan runtime PHP untuk penyimpanan skor",
    description:
      "Tantangan mencari dan menyusun kata dengan batas waktu, pencatatan nama pemain, skor, serta leaderboard lokal.",
    challenge:
      "Menormalisasi input kata dan menyimpan skor secara aman agar karakter khusus, spam, serta injeksi HTML tidak masuk ke leaderboard.",
    features: ["Timed word search", "Player registration", "Score storage", "Leaderboard"],
    stack: ["PHP", "HTML5", "CSS3", "JSON Storage"],
    tone: "rose",
  },
  {
    id: "speed-clicker",
    year: 2025,
    title: "Speed Clicker",
    category: "Reaction Game · Score Attack",
    image: "/projects/speed-clicker.png",
    imageAlt: "Game Speed Clicker dengan tombol besar, timer lima detik, dan panel skor",
    demo: "/demos/speed-clicker/index.html",
    description:
      "Reaction challenge lima detik yang mengukur kecepatan klik, membangun combo, dan mencatat skor pemain.",
    challenge:
      "Mencegah input ganda yang tidak valid, mempertahankan timer presisi, dan membuat kontrol setara untuk pointer maupun keyboard.",
    features: ["5-second challenge", "Combo multiplier", "Keyboard support", "Leaderboard"],
    stack: ["PHP", "HTML5", "CSS3", "JavaScript"],
    tone: "rose",
  },
  {
    id: "spin-wheel",
    year: 2025,
    title: "Spin the Wheel",
    category: "Prize Game · Event Activation",
    image: "/projects/spin-wheel-2025.png",
    imageAlt: "Game spin the wheel dengan segmen hadiah berwarna",
    demoNote: "Hasil hadiah memerlukan endpoint PHP server-side",
    description:
      "Roda hadiah digital dengan animasi putaran, pemilihan hasil di server, dan tampilan pemenang untuk kebutuhan event.",
    challenge:
      "Menyelaraskan animasi roda dengan hasil server, membatasi request berulang, dan menjaga konfigurasi peluang tidak terekspos ke klien.",
    features: ["Server-selected result", "Spin animation", "Prize segments", "Result validation"],
    stack: ["PHP", "JavaScript", "CSS3", "JSON"],
    tone: "amber",
  },
  {
    id: "hexos-voice",
    year: 2025,
    title: "HEXOS Voice Challenge",
    category: "Voice Game · Brand Activation",
    image: "/projects/hexos-game.png",
    imageAlt: "Game aktivasi suara HEXOS dengan indikator volume dan target suara",
    demo: "/demos/hexos-voice/index.html",
    description:
      "Aktivasi suara yang mengajak pengunjung meningkatkan volume mikrofon hingga target untuk memenangkan hadiah.",
    challenge:
      "Mengubah intensitas suara menjadi progres real-time yang stabil di lingkungan acara yang ramai sekaligus mengelola klaim peserta.",
    features: ["Microphone input", "Live volume meter", "Claim flow", "Jakarta & Bandung builds"],
    stack: ["PHP", "JavaScript", "Web Audio API", "PDO"],
    tone: "amber",
  },
];

export const projectCounts = {
  all: projects.length,
  playable: projects.filter((project) => Boolean(project.demo)).length,
  2026: projects.filter((project) => project.year === 2026).length,
  2025: projects.filter((project) => project.year === 2025).length,
};
