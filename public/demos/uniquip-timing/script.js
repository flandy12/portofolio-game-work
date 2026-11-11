const STORAGE_KEY_PRODUCTS = "uniquip_products";
const STORAGE_KEY_SOUND = "uniquip_sound_enabled";
const STORAGE_KEY_DIFFICULTY = "uniquip_difficulty";
const MAX_ATTEMPTS = 3;
const FALL_START_Y = -150;
const BASE_STAGE_WIDTH = 480;
const COUNTDOWN_INTERVAL_MS = 900;
const DROP_READY_DELAY_MS = 700;
const PARTICLE_COUNT = 14;
const PARTICLE_CLEANUP_DELAY_MS = 1200;
const MIN_DIFFICULTY_LEVEL = 1;
const MAX_DIFFICULTY_LEVEL = 10;
const DEFAULT_DIFFICULTY_LEVEL = 5;
const HIGH_LEVEL_SPEED_BOOST = 80;

const DEFAULT_PRODUCTS = [
    {
        id: 1,
        name: "Ekskavator Mini",
        image: "assets/products/excavator.png",
        stock: 3,
        maxAppearance: 10,
        appearanceCount: 0,
        weight: 5,
        minSize: 104,
        maxSize: 126,
        accent: "#f7b500",
        shape: "excavator"
    },
    {
        id: 2,
        name: "Helm UNIQUIP",
        image: "assets/products/helmet.png",
        stock: 5,
        maxAppearance: 15,
        appearanceCount: 0,
        weight: 20,
        minSize: 82,
        maxSize: 98,
        accent: "#f7b500",
        shape: "helmet"
    },
    {
        id: 3,
        name: "UNIQUIP Tumbler",
        image: "assets/products/tumbler.png",
        stock: 10,
        maxAppearance: 30,
        appearanceCount: 0,
        weight: 40,
        minSize: 90,
        maxSize: 108,
        accent: "#ffffff",
        shape: "tumbler"
    },
    {
        id: 4,
        name: "Rompi Keselamatan",
        image: "assets/products/vest.png",
        stock: 7,
        maxAppearance: 20,
        appearanceCount: 0,
        weight: 18,
        minSize: 94,
        maxSize: 110,
        accent: "#f7b500",
        shape: "vest"
    },
    {
        id: 5,
        name: "Truk Dump Mini",
        image: "assets/products/miniature-truck.png",
        stock: 4,
        maxAppearance: 12,
        appearanceCount: 0,
        weight: 12,
        minSize: 96,
        maxSize: 118,
        accent: "#d8c3a5",
        shape: "truck"
    }
];

const SCORE_MAP = {
    PERFECT: 1000,
    GREAT: 750,
    GOOD: 500,
    HIT: 300,
    MISS: 0
};

const PRECISION_LABELS = {
    PERFECT: "SEMPURNA",
    GREAT: "HEBAT",
    GOOD: "BAGUS",
    HIT: "TEPAT",
    MISS: "MELESET"
};

const SUCCESS_PRECISIONS = new Set(["PERFECT", "GREAT", "GOOD", "HIT"]);

const elements = {
    body: document.body,
    gameStage: document.getElementById("gameStage"),
    targetZone: document.getElementById("targetZone"),
    fallingProduct: document.getElementById("fallingProduct"),
    productImage: document.getElementById("productImage"),
    productLabel: document.getElementById("productLabel"),
    landingScreen: document.getElementById("landingScreen"),
    countdownOverlay: document.getElementById("countdownOverlay"),
    resultBadge: document.getElementById("resultBadge"),
    particlesLayer: document.getElementById("particlesLayer"),
    attemptValue: document.getElementById("attemptValue"),
    stockValue: document.getElementById("stockValue"),
    scoreValue: document.getElementById("scoreValue"),
    mainActionBtn: document.getElementById("mainActionBtn"),
    resetDataBtn: document.getElementById("resetDataBtn"),
    howToPlayBtn: document.getElementById("howToPlayBtn"),
    soundToggleBtn: document.getElementById("soundToggleBtn"),
    difficultyLevelInput: document.getElementById("difficultyLevelInput"),
    modalBackdrop: document.getElementById("modalBackdrop"),
    modalBody: document.getElementById("modalBody"),
    modalCloseBtn: document.getElementById("modalCloseBtn")
};

const runtime = {
    gameState: "idle",
    products: loadProducts(),
    attemptsUsed: 0,
    totalScore: 0,
    currentProduct: null,
    currentProductSrc: "",
    currentProductY: FALL_START_Y,
    currentProductSize: 100,
    currentSpeed: 0,
    animationId: null,
    lastFrameTime: 0,
    countdownTimers: [],
    modalType: null,
    soundEnabled: loadSoundPreference(),
    difficultyLevel: loadDifficultyLevel(),
    audioContext: null
};

document.addEventListener("DOMContentLoaded", initGame);

function initGame() {
    enableDeveloperToolsWhenRequested();
    bindEvents();
    updateHud();
    updateSoundButton();
    updateDifficultyControl();
    updateActionButton();
    updateProductPosition();
}

function bindEvents() {
    elements.mainActionBtn.addEventListener("click", handlePrimaryAction);
    elements.howToPlayBtn.addEventListener("click", () => {
        unlockAudio();
        openHowToPlayModal();
    });

    elements.soundToggleBtn.addEventListener("click", () => {
        unlockAudio();
        runtime.soundEnabled = !runtime.soundEnabled;
        localStorage.setItem(STORAGE_KEY_SOUND, JSON.stringify(runtime.soundEnabled));
        updateSoundButton();

        if (runtime.soundEnabled) {
            playToneSequence([
                { frequency: 880, duration: 0.05, timeOffset: 0 },
                { frequency: 1120, duration: 0.08, timeOffset: 0.07 }
            ]);
        }
    });

    elements.difficultyLevelInput.addEventListener("change", (event) => {
        if (runtime.gameState !== "idle") {
            updateDifficultyControl();
            return;
        }

        setDifficultyLevel(event.target.value);
    });

    elements.modalCloseBtn.addEventListener("click", handleModalClose);
    elements.modalBody.addEventListener("click", handleModalAction);
    elements.resetDataBtn.addEventListener("click", resetStoredData);
}

function handlePrimaryAction() {
    unlockAudio();

    if (runtime.gameState === "idle") {
        startRound();
        return;
    }

    if (runtime.gameState === "dropping") {
        stopRound({ autoMiss: false });
    }
}

async function startRound() {
    if (runtime.gameState !== "idle") {
        return;
    }

    const selectedProduct = getWeightedRandomProduct();

    if (!selectedProduct) {
        openInfoModal({
            eyebrow: "HADIAH HABIS",
            title: "Tidak ada hadiah yang tersedia.",
            copy: "Semua hadiah telah habis atau mencapai batas kemunculannya.",
            primaryLabel: "KEMBALI KE BERANDA",
            primaryAction: "back-home"
        });
        return;
    }

    setGameState("countdown");
    resetRoundVisuals();
    showTarget();
    hideLandingScreen();

    runtime.currentProduct = selectedProduct;
    const stageScale = getStageScale();

    runtime.currentProductSize = randomBetween(
        selectedProduct.minSize,
        selectedProduct.maxSize
    ) * stageScale;
    runtime.currentProductY = FALL_START_Y * stageScale;
    const difficulty = getDifficultySetting();
    runtime.currentSpeed = randomBetween(difficulty.minSpeed, difficulty.maxSpeed) * stageScale;
    runtime.currentProductSrc = await preloadProductSource(selectedProduct);

    incrementAppearanceCount(selectedProduct.id);
    saveProducts();
    updateHud();

    setupCurrentProduct();
    beginCountdown();
}

function beginCountdown() {
    const sequence = [
        { label: "3", sound: () => playCountdownSound() },
        { label: "2", sound: () => playCountdownSound() },
        { label: "1", sound: () => playCountdownSound() },
        { label: "MULAI!", sound: () => playDropSound() }
    ];

    clearCountdownTimers();
    elements.countdownOverlay.classList.remove("hidden");

    sequence.forEach((item, index) => {
        const timerId = window.setTimeout(() => {
            elements.countdownOverlay.textContent = item.label;
            item.sound();

            if (index === sequence.length - 1) {
                const finishId = window.setTimeout(() => {
                    elements.countdownOverlay.classList.add("hidden");
                    startDropAnimation();
                }, DROP_READY_DELAY_MS);

                runtime.countdownTimers.push(finishId);
            }
        }, index * COUNTDOWN_INTERVAL_MS);

        runtime.countdownTimers.push(timerId);
    });
}

function startDropAnimation() {
    runtime.lastFrameTime = 0;
    setGameState("dropping");
    cancelAnimationLoop();
    runtime.animationId = window.requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
    if (runtime.gameState !== "dropping") {
        return;
    }

    if (runtime.lastFrameTime === 0) {
        runtime.lastFrameTime = timestamp;
        runtime.animationId = window.requestAnimationFrame(gameLoop);
        return;
    }

    const deltaTime = (timestamp - runtime.lastFrameTime) / 1000;
    runtime.lastFrameTime = timestamp;
    runtime.currentProductY += runtime.currentSpeed * deltaTime;
    updateProductPosition();

    if (hasPassedStageBottom()) {
        stopRound({ autoMiss: true });
        return;
    }

    runtime.animationId = window.requestAnimationFrame(gameLoop);
}

function stopRound({ autoMiss }) {
    if (runtime.gameState !== "dropping") {
        return;
    }

    cancelAnimationLoop();
    setGameState("stopped");
    playStopSound();

    const result = autoMiss
        ? {
            precision: "MISS",
            distance: getOverflowDistance(),
            score: SCORE_MAP.MISS,
            success: false
        }
        : evaluateDropResult();

    resolveRound(result);
}

function resolveRound(result) {
    showResultBadge(result.precision);
    applyTargetState(result.precision);

    if (result.success) {
        runtime.totalScore += result.score;
        decrementProductStock(runtime.currentProduct.id);
        saveProducts();
        updateHud();
        spawnSuccessParticles();
        playSuccessSound();
        setGameState("success");
        openSuccessModal(result);
        return;
    }

    runtime.attemptsUsed += 1;
    updateHud();
    playFailSound();
    setGameState("failed");

    if (runtime.attemptsUsed >= MAX_ATTEMPTS) {
        openChallengeCompleteModal(result);
        return;
    }

    openFailModal(result);
}

function evaluateDropResult() {
    const productRect = elements.fallingProduct.getBoundingClientRect();
    const targetRect = elements.targetZone.getBoundingClientRect();
    const productCenterX = productRect.left + (productRect.width / 2);
    const productCenterY = productRect.top + (productRect.height / 2);
    const targetCenterX = targetRect.left + (targetRect.width / 2);
    const targetCenterY = targetRect.top + (targetRect.height / 2);
    const targetRadiusX = targetRect.width / 2;
    const targetRadiusY = targetRect.height / 2;

    // Normalize the distance so scoring stays correct when the target size changes.
    const dx = (productCenterX - targetCenterX) / targetRadiusX;
    const dy = (productCenterY - targetCenterY) / targetRadiusY;
    const distance = Math.sqrt((dx * dx) + (dy * dy));

    let precision = "MISS";

    if (distance <= 0.25) {
        precision = "PERFECT";
    } else if (distance <= 0.5) {
        precision = "GREAT";
    } else if (distance <= 0.75) {
        precision = "GOOD";
    } else if (distance <= 1) {
        precision = "HIT";
    }

    return {
        precision,
        distance: distance * targetRadiusY,
        score: SCORE_MAP[precision],
        success: SUCCESS_PRECISIONS.has(precision)
    };
}

function resetGame(options = {}) {
    const { resetAttempts = false, resetScore = false, showLanding = true } = options;

    cancelAnimationLoop();
    clearCountdownTimers();

    if (resetAttempts) {
        runtime.attemptsUsed = 0;
    }

    if (resetScore) {
        runtime.totalScore = 0;
    }

    runtime.currentProduct = null;
    runtime.currentProductSrc = "";
    runtime.currentProductY = FALL_START_Y * getStageScale();
    runtime.currentSpeed = 0;
    runtime.currentProductSize = 100;
    runtime.lastFrameTime = 0;

    resetRoundVisuals();
    updateHud();
    setGameState("idle");

    if (showLanding) {
        showLandingScreen();
    }
}

function resetRoundVisuals() {
    elements.countdownOverlay.classList.add("hidden");
    elements.countdownOverlay.textContent = "";
    elements.fallingProduct.classList.add("hidden");
    elements.fallingProduct.style.removeProperty("width");
    elements.productImage.removeAttribute("src");
    elements.productImage.alt = "";
    elements.productLabel.textContent = "";
    elements.resultBadge.className = "result-badge hidden";
    elements.resultBadge.textContent = "";
    elements.particlesLayer.innerHTML = "";
    hideTarget();
    updateProductPosition();
}

function showTarget() {
    elements.targetZone.className = "target-zone";
}

function hideTarget() {
    elements.targetZone.className = "target-zone is-hidden";
}

function setupCurrentProduct() {
    elements.fallingProduct.classList.remove("hidden");
    elements.fallingProduct.style.width = `${runtime.currentProductSize}px`;
    elements.productImage.src = runtime.currentProductSrc;
    elements.productImage.alt = runtime.currentProduct.name;
    elements.productLabel.textContent = runtime.currentProduct.name.toUpperCase();
    updateProductPosition();
}

function updateProductPosition() {
    elements.fallingProduct.style.transform = `translate3d(-50%, ${runtime.currentProductY}px, 0)`;
}

function showResultBadge(precision) {
    elements.resultBadge.className = `result-badge ${precision.toLowerCase()}`;
    const label = getPrecisionLabel(precision);
    elements.resultBadge.textContent = precision === "MISS" ? label : `${label}!`;
}

function getPrecisionLabel(precision) {
    return PRECISION_LABELS[precision] || precision;
}

function applyTargetState(precision) {
    const targetClass =
        precision === "MISS"
            ? "is-miss"
            : `is-${precision.toLowerCase()} is-success`;

    elements.targetZone.className = `target-zone ${targetClass}`;
}

function spawnSuccessParticles() {
    elements.particlesLayer.innerHTML = "";
    const targetCenter = getTargetCenterInStage();

    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
        const particle = document.createElement("span");
        const angle = Math.random() * Math.PI * 2;
        const distance = 32 + (Math.random() * 62);
        const moveX = Math.cos(angle) * distance;
        const moveY = Math.sin(angle) * distance;

        particle.className = "particle";
        particle.style.left = `${targetCenter.x}%`;
        particle.style.top = `${targetCenter.y}%`;
        particle.style.setProperty("--move-x", `${moveX}px`);
        particle.style.setProperty("--move-y", `${moveY}px`);
        particle.style.animationDelay = `${index * 28}ms`;
        elements.particlesLayer.appendChild(particle);
    }

    window.setTimeout(() => {
        elements.particlesLayer.innerHTML = "";
    }, PARTICLE_CLEANUP_DELAY_MS);
}

function getTargetCenterInStage() {
    const targetRect = elements.targetZone.getBoundingClientRect();
    const stageRect = elements.gameStage.getBoundingClientRect();

    return {
        x: ((targetRect.left + (targetRect.width / 2) - stageRect.left) / stageRect.width) * 100,
        y: ((targetRect.top + (targetRect.height / 2) - stageRect.top) / stageRect.height) * 100
    };
}

function updateHud() {
    elements.attemptValue.textContent = `${getDisplayedAttempt()} / ${MAX_ATTEMPTS}`;
    elements.stockValue.textContent = `${getRemainingStock()} TERSISA`;
    elements.scoreValue.textContent = runtime.totalScore.toLocaleString("id-ID");
}

function getDisplayedAttempt() {
    return Math.min(runtime.attemptsUsed + 1, MAX_ATTEMPTS);
}

function getRemainingStock() {
    return runtime.products.reduce((sum, product) => sum + product.stock, 0);
}

function setGameState(nextState) {
    runtime.gameState = nextState;
    elements.gameStage.dataset.state = nextState;
    updateActionButton();
}

function updateActionButton() {
    const button = elements.mainActionBtn;
    const shouldLockHowTo =
        runtime.gameState === "countdown" || runtime.gameState === "dropping";

    elements.howToPlayBtn.disabled = shouldLockHowTo;
    elements.difficultyLevelInput.disabled = shouldLockHowTo;

    if (runtime.gameState === "idle") {
        button.textContent = "MULAI GAME";
        button.disabled = false;
        return;
    }

    if (runtime.gameState === "dropping") {
        button.textContent = "BERHENTI!";
        button.disabled = false;
        return;
    }

    if (runtime.gameState === "countdown") {
        button.textContent = "BERSIAP";
        button.disabled = true;
        return;
    }

    button.textContent = "TUNGGU";
    button.disabled = true;
}

function showLandingScreen() {
    elements.landingScreen.classList.remove("is-hidden");
}

function hideLandingScreen() {
    elements.landingScreen.classList.add("is-hidden");
}

function openHowToPlayModal() {
    runtime.modalType = "info";
    renderModal(`
        <span class="modal-eyebrow">CARA BERMAIN</span>
        <h2 id="modalTitle" class="modal-title">Drop presisi dalam lima langkah.</h2>
        <ol class="modal-list">
            <li>TEKAN MULAI GAME</li>
            <li>PERHATIKAN HADIAH TURUN</li>
            <li>TEKAN BERHENTI</li>
            <li>HENTIKAN HADIAH DI DALAM TARGET</li>
            <li>RAIH HADIAHNYA</li>
        </ol>
        <div class="modal-actions">
            <button class="modal-action primary" type="button" data-action="close-modal">
                TUTUP
            </button>
        </div>
    `);
}

function openSuccessModal(result) {
    runtime.modalType = "result";
    renderModal(`
        <span class="modal-eyebrow">SELAMAT!</span>
        <h2 id="modalTitle" class="modal-title">KAMU MENANG</h2>
        <div class="modal-prize">
            <img src="${runtime.currentProductSrc}" alt="${runtime.currentProduct.name}">
            <h3>${runtime.currentProduct.name.toUpperCase()}</h3>
            <p class="status-banner">${getPrecisionLabel(result.precision)}</p>
        </div>
        <div class="modal-stats">
            <div class="modal-stat">
                <span class="modal-stat-label">PRESISI</span>
                <span class="modal-stat-value">${getPrecisionLabel(result.precision)}</span>
            </div>
            <div class="modal-stat">
                <span class="modal-stat-label">SKOR</span>
                <span class="modal-stat-value">${result.score}</span>
            </div>
        </div>
        <p class="modal-copy">
            Kamu berhasil menghentikan hadiah di dalam target.
        </p>
        <div class="modal-actions">
            <button class="modal-action primary" type="button" data-action="claim-prize">
                AMBIL HADIAH
            </button>
            <button class="modal-action secondary" type="button" data-action="play-again">
                MAIN LAGI
            </button>
        </div>
    `);
}

function openFailModal(result) {
    runtime.modalType = "result";
    renderModal(`
        <span class="modal-eyebrow">HAMPIR!</span>
        <h2 id="modalTitle" class="modal-title">COBA LAGI</h2>
        <p class="modal-copy">
            Produk belum berhenti tepat di dalam target.
        </p>
        <div class="modal-stats">
            <div class="modal-stat">
                <span class="modal-stat-label">JARAK DARI TARGET</span>
                <span class="modal-stat-value">${Math.round(result.distance)}px</span>
            </div>
            <div class="modal-stat">
                <span class="modal-stat-label">PERCOBAAN BERIKUTNYA</span>
                <span class="modal-stat-value">${getDisplayedAttempt()} / ${MAX_ATTEMPTS}</span>
            </div>
        </div>
        <div class="modal-actions">
            <button class="modal-action primary" type="button" data-action="try-again">
                COBA LAGI
            </button>
        </div>
    `);
}

function openChallengeCompleteModal(result) {
    runtime.modalType = "result";
    renderModal(`
        <span class="modal-eyebrow">TANTANGAN SELESAI</span>
        <h2 id="modalTitle" class="modal-title">Semua percobaan telah digunakan.</h2>
        <p class="modal-copy">
            Percobaan terakhir belum tepat dan sesi tantangan ini berakhir.
        </p>
        <div class="modal-stats">
            <div class="modal-stat">
                <span class="modal-stat-label">SKOR AKHIR</span>
                <span class="modal-stat-value">${runtime.totalScore}</span>
            </div>
            <div class="modal-stat">
                <span class="modal-stat-label">JARAK TERAKHIR</span>
                <span class="modal-stat-value">${Math.round(result.distance)}px</span>
            </div>
        </div>
        <div class="modal-actions">
            <button class="modal-action primary" type="button" data-action="back-home">
                KEMBALI KE BERANDA
            </button>
        </div>
    `);
}

function openInfoModal({ eyebrow, title, copy, primaryLabel, primaryAction }) {
    runtime.modalType = "info";
    renderModal(`
        <span class="modal-eyebrow">${eyebrow}</span>
        <h2 id="modalTitle" class="modal-title">${title}</h2>
        <p class="modal-copy">${copy}</p>
        <div class="modal-actions">
            <button class="modal-action primary" type="button" data-action="${primaryAction}">
                ${primaryLabel}
            </button>
        </div>
    `);
}

function renderModal(content) {
    elements.modalBody.innerHTML = content;
    elements.modalBackdrop.classList.remove("hidden");
    elements.modalBackdrop.setAttribute("aria-hidden", "false");
}

function closeModal() {
    elements.modalBackdrop.classList.add("hidden");
    elements.modalBackdrop.setAttribute("aria-hidden", "true");
    elements.modalBody.innerHTML = "";
    runtime.modalType = null;
}

function handleModalClose() {
    const stateAtClose = runtime.gameState;
    closeModal();

    if (stateAtClose === "success" || stateAtClose === "failed") {
        if (runtime.attemptsUsed >= MAX_ATTEMPTS) {
            resetGame({ resetAttempts: true, resetScore: true, showLanding: true });
            return;
        }

        resetGame();
    }
}

function handleModalAction(event) {
    const action = event.target.dataset.action;

    if (!action) {
        return;
    }

    if (action === "close-modal") {
        closeModal();
        return;
    }

    if (action === "play-again" || action === "try-again") {
        closeModal();
        resetGame();
        return;
    }

    if (action === "claim-prize") {
        closeModal();
        resetGame();
        return;
    }

    if (action === "back-home") {
        closeModal();
        resetGame({ resetAttempts: true, resetScore: true, showLanding: true });
    }
}

function loadProducts() {
    const fallbackProducts = structuredClone(DEFAULT_PRODUCTS);
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);

    if (!raw) {
        return fallbackProducts;
    }

    try {
        const storedProducts = JSON.parse(raw);

        return fallbackProducts.map((defaultProduct) => {
            const matchedProduct = storedProducts.find(
                (storedProduct) => Number(storedProduct.id) === defaultProduct.id
            );

            if (!matchedProduct) {
                return defaultProduct;
            }

            // Sanitise persisted values so localStorage edits do not break gameplay.
            return {
                ...defaultProduct,
                stock: clampNumber(matchedProduct.stock, 0, defaultProduct.stock),
                appearanceCount: clampNumber(
                    matchedProduct.appearanceCount,
                    0,
                    defaultProduct.maxAppearance
                )
            };
        });
    } catch (error) {
        return fallbackProducts;
    }
}

function saveProducts() {
    const dataToStore = runtime.products.map((product) => ({
        id: product.id,
        stock: product.stock,
        appearanceCount: product.appearanceCount
    }));

    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(dataToStore));
}

function loadSoundPreference() {
    const raw = localStorage.getItem(STORAGE_KEY_SOUND);

    if (!raw) {
        return true;
    }

    try {
        return JSON.parse(raw) !== false;
    } catch (error) {
        return true;
    }
}

function loadDifficultyLevel() {
    const storedDifficulty = localStorage.getItem(STORAGE_KEY_DIFFICULTY);
    const legacyLevels = { easy: 3, normal: 5, hard: 8 };

    if (!storedDifficulty) {
        return DEFAULT_DIFFICULTY_LEVEL;
    }

    if (Object.prototype.hasOwnProperty.call(legacyLevels, storedDifficulty)) {
        return legacyLevels[storedDifficulty];
    }

    if (!Number.isFinite(Number(storedDifficulty))) {
        return DEFAULT_DIFFICULTY_LEVEL;
    }

    return clampNumber(
        storedDifficulty,
        MIN_DIFFICULTY_LEVEL,
        MAX_DIFFICULTY_LEVEL
    );
}

function getDifficultySetting() {
    const level = runtime.difficultyLevel;
    const highLevelBoost = Math.max(0, level - DEFAULT_DIFFICULTY_LEVEL)
        * HIGH_LEVEL_SPEED_BOOST;

    return {
        minSpeed: 160 + (level * 24) + highLevelBoost,
        maxSpeed: 220 + (level * 24) + highLevelBoost,
        targetSize: `${68 - (level * 3.2)}%`
    };
}

function setDifficultyLevel(value) {
    const level = Number(value);

    if (!Number.isFinite(level)) {
        updateDifficultyControl();
        return;
    }

    runtime.difficultyLevel = clampNumber(
        Math.round(level),
        MIN_DIFFICULTY_LEVEL,
        MAX_DIFFICULTY_LEVEL
    );
    localStorage.setItem(STORAGE_KEY_DIFFICULTY, runtime.difficultyLevel);
    updateDifficultyControl();
}

function getWeightedRandomProduct() {
    const availableProducts = runtime.products.filter(
        (product) => product.stock > 0 && product.appearanceCount < product.maxAppearance
    );

    if (availableProducts.length === 0) {
        return null;
    }

    const totalWeight = availableProducts.reduce(
        (sum, product) => sum + product.weight,
        0
    );

    let threshold = Math.random() * totalWeight;

    for (const product of availableProducts) {
        threshold -= product.weight;

        if (threshold <= 0) {
            return product;
        }
    }

    return availableProducts[availableProducts.length - 1];
}

function incrementAppearanceCount(productId) {
    const product = runtime.products.find((item) => item.id === productId);

    if (product) {
        product.appearanceCount = Math.min(
            product.appearanceCount + 1,
            product.maxAppearance
        );
    }
}

function decrementProductStock(productId) {
    const product = runtime.products.find((item) => item.id === productId);

    if (product) {
        product.stock = Math.max(product.stock - 1, 0);
    }
}

function hasPassedStageBottom() {
    const stageHeight = elements.gameStage.clientHeight;
    const productCenterY = runtime.currentProductY + (runtime.currentProductSize / 2);
    return productCenterY > stageHeight;
}

function getOverflowDistance() {
    const targetRect = elements.targetZone.getBoundingClientRect();
    const targetCenterY = targetRect.top + (targetRect.height / 2);
    const stageRect = elements.gameStage.getBoundingClientRect();
    const productCenterY = stageRect.top + runtime.currentProductY + (runtime.currentProductSize / 2);
    return Math.abs(productCenterY - targetCenterY);
}

function cancelAnimationLoop() {
    if (runtime.animationId) {
        window.cancelAnimationFrame(runtime.animationId);
        runtime.animationId = null;
    }
}

function clearCountdownTimers() {
    runtime.countdownTimers.forEach((timerId) => window.clearTimeout(timerId));
    runtime.countdownTimers = [];
}

function randomBetween(min, max) {
    return min + (Math.random() * (max - min));
}

function getStageScale() {
    // Product measurements were tuned for a 480px-wide stage.
    return elements.gameStage.clientWidth / BASE_STAGE_WIDTH;
}

function clampNumber(value, min, max) {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
        return min;
    }

    return Math.min(Math.max(numericValue, min), max);
}

async function preloadProductSource(product) {
    const fallbackSource = buildFallbackProductSvg(product);

    try {
        const loadedSource = await attemptImageLoad(product.image);
        return loadedSource;
    } catch (error) {
        return fallbackSource;
    }
}

function attemptImageLoad(source) {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = () => resolve(source);
        image.onerror = () => reject(new Error(`Failed to load ${source}`));
        image.src = source;
    });
}

function buildFallbackProductSvg(product) {
    const common = `
        <defs>
            <linearGradient id="metal" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#f9f9f9" />
                <stop offset="100%" stop-color="#c8ced3" />
            </linearGradient>
            <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${product.accent}" />
                <stop offset="100%" stop-color="#d59800" />
            </linearGradient>
        </defs>
    `;

    const svgMap = {
        excavator: `
            ${common}
            <rect x="22" y="88" width="76" height="16" rx="8" fill="#1a1d1f" />
            <circle cx="40" cy="108" r="11" fill="#1a1d1f" />
            <circle cx="84" cy="108" r="11" fill="#1a1d1f" />
            <rect x="34" y="58" width="40" height="28" rx="8" fill="url(#accent)" />
            <rect x="72" y="42" width="12" height="38" rx="5" fill="url(#metal)" />
            <path d="M84 45 L112 34 L116 42 L92 58 Z" fill="url(#metal)" />
            <path d="M110 34 L126 52 L118 58 L102 42 Z" fill="#6b7378" />
        `,
        helmet: `
            ${common}
            <path d="M26 76 C28 46, 54 28, 76 28 C100 28, 124 46, 126 76 L26 76 Z" fill="url(#accent)" />
            <rect x="20" y="74" width="112" height="16" rx="8" fill="#1e2427" />
            <path d="M52 76 C54 56, 66 46, 76 46 C88 46, 98 56, 100 76" fill="none" stroke="rgba(255,255,255,0.38)" stroke-width="6" stroke-linecap="round" />
        `,
        tumbler: `
            ${common}
            <path d="M44 18 H108 L98 118 C97 124, 92 128, 86 128 H64 C58 128, 53 124, 52 118 Z" fill="url(#metal)" />
            <path d="M48 26 H104 L97 112 C96 116, 92 120, 86 120 H66 C60 120, 56 116, 55 112 Z" fill="url(#accent)" />
            <rect x="56" y="48" width="40" height="11" rx="5" fill="rgba(255,255,255,0.44)" />
        `,
        vest: `
            ${common}
            <path d="M48 18 H104 L122 50 L100 126 H52 L30 50 Z" fill="url(#accent)" />
            <path d="M60 18 L76 40 L92 18" fill="none" stroke="#1c2226" stroke-width="12" stroke-linecap="round" />
            <rect x="54" y="58" width="44" height="10" rx="5" fill="#ffffff" opacity="0.72" />
            <rect x="54" y="80" width="44" height="10" rx="5" fill="#ffffff" opacity="0.72" />
        `,
        truck: `
            ${common}
            <rect x="18" y="78" width="74" height="26" rx="10" fill="#1d2225" />
            <path d="M86 60 H124 L114 88 H86 Z" fill="url(#accent)" />
            <rect x="42" y="56" width="30" height="24" rx="8" fill="url(#accent)" />
            <circle cx="42" cy="108" r="11" fill="#1a1d1f" />
            <circle cx="90" cy="108" r="11" fill="#1a1d1f" />
        `
    };

    const markup = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 152 152">
            <rect width="152" height="152" rx="28" fill="rgba(255,255,255,0)" />
            ${svgMap[product.shape]}
        </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(markup)}`;
}

function enableDeveloperToolsWhenRequested() {
    if (window.location.hash.toLowerCase().includes("dev")) {
        elements.body.classList.add("dev-mode");
        elements.resetDataBtn.hidden = false;
    }
}

function resetStoredData() {
    localStorage.removeItem(STORAGE_KEY_PRODUCTS);
    runtime.products = structuredClone(DEFAULT_PRODUCTS);
    resetGame({ resetAttempts: true, resetScore: true, showLanding: true });
    updateHud();
}

function updateSoundButton() {
    elements.soundToggleBtn.textContent = runtime.soundEnabled ? "SUARA AKTIF" : "SUARA MATI";
    elements.soundToggleBtn.setAttribute("aria-pressed", String(runtime.soundEnabled));
}

function updateDifficultyControl() {
    const setting = getDifficultySetting();

    elements.difficultyLevelInput.value = runtime.difficultyLevel;
    elements.gameStage.style.setProperty("--target-size", setting.targetSize);
}

function unlockAudio() {
    if (!runtime.audioContext) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) {
            return;
        }

        runtime.audioContext = new AudioContextClass();
    }

    if (runtime.audioContext.state === "suspended") {
        runtime.audioContext.resume().catch(() => {});
    }
}

function playToneSequence(sequence) {
    if (!runtime.soundEnabled || !runtime.audioContext) {
        return;
    }

    const now = runtime.audioContext.currentTime;

    sequence.forEach((tone) => {
        const oscillator = runtime.audioContext.createOscillator();
        const gainNode = runtime.audioContext.createGain();
        const startTime = now + tone.timeOffset;
        const endTime = startTime + tone.duration;

        oscillator.type = tone.type || "sine";
        oscillator.frequency.setValueAtTime(tone.frequency, startTime);
        gainNode.gain.setValueAtTime(0.0001, startTime);
        gainNode.gain.exponentialRampToValueAtTime(tone.volume || 0.06, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime);
        oscillator.connect(gainNode);
        gainNode.connect(runtime.audioContext.destination);
        oscillator.start(startTime);
        oscillator.stop(endTime);
    });
}

function playCountdownSound() {
    playToneSequence([
        { frequency: 820, duration: 0.08, timeOffset: 0, type: "triangle", volume: 0.035 }
    ]);
}

function playDropSound() {
    playToneSequence([
        { frequency: 220, duration: 0.1, timeOffset: 0, type: "sawtooth", volume: 0.03 },
        { frequency: 160, duration: 0.14, timeOffset: 0.08, type: "triangle", volume: 0.026 }
    ]);
}

function playStopSound() {
    playToneSequence([
        { frequency: 180, duration: 0.08, timeOffset: 0, type: "square", volume: 0.028 }
    ]);
}

function playSuccessSound() {
    playToneSequence([
        { frequency: 520, duration: 0.08, timeOffset: 0, type: "triangle", volume: 0.032 },
        { frequency: 660, duration: 0.1, timeOffset: 0.07, type: "triangle", volume: 0.032 },
        { frequency: 880, duration: 0.14, timeOffset: 0.16, type: "triangle", volume: 0.032 }
    ]);
}

function playFailSound() {
    playToneSequence([
        { frequency: 260, duration: 0.1, timeOffset: 0, type: "sawtooth", volume: 0.03 },
        { frequency: 200, duration: 0.14, timeOffset: 0.08, type: "sawtooth", volume: 0.026 }
    ]);
}
