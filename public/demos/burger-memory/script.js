"use strict";

const sizes = [
  { id: "single", name: "Single", note: "1 patty", patties: 1, icon: "●", iconSize: "18px" },
  { id: "double", name: "Double", note: "2 patty", patties: 2, icon: "●", iconSize: "23px" },
  { id: "triple", name: "Monster", note: "3 patty", patties: 3, icon: "●", iconSize: "28px" }
];

const ingredients = [
  { id: "cheese", name: "Keju cheddar", category: "premium", image: "slice3.png", width: 86 },
  { id: "egg", name: "Telur mata sapi", category: "premium", image: "slice4.png", width: 76 },
  { id: "bacon", name: "Smoky bacon", category: "premium", image: "slice5.png", width: 86 },
  { id: "lettuce", name: "Selada segar", category: "sayur", image: "slice6.png", width: 90 },
  { id: "pickle", name: "Acar timun", category: "sayur", image: "slice7.png", width: 67 },
  { id: "onion", name: "Bawang bombai", category: "sayur", image: "slice8.png", width: 75 },
  { id: "tomato", name: "Tomat merah", category: "sayur", image: "slice9.png", width: 77 },
  { id: "jalapeno", name: "Jalapeño", category: "sayur", image: "slice18.png", width: 70 },
  { id: "mushroom", name: "Jamur panggang", category: "sayur", image: "slice19.png", width: 76 },
  { id: "ketchup", name: "Ketchup", category: "saus", image: "slice10.png", width: 63 },
  { id: "mayo", name: "Mayones", category: "saus", image: "slice11.png", width: 63 },
  { id: "mustard", name: "Mustard", category: "saus", image: "slice12.png", width: 63 },
  { id: "bbq", name: "BBQ sauce", category: "saus", image: "slice13.png", width: 63 },
  { id: "blenger", name: "Blenger sauce", category: "saus", image: "slice14.png", width: 63 },
  { id: "ranch", name: "Ranch sauce", category: "saus", image: "slice15.png", width: 63 },
  { id: "chili", name: "Hot chili", category: "saus", image: "slice16.png", width: 63 },
  { id: "burger", name: "Burger sauce", category: "saus", image: "slice17.png", width: 63 }
];

const challenges = [
  { id: "sunny-cheese", name: "Sunny Cheese", difficulty: "easy", size: "single", toppings: { cheese: 1, egg: 1, lettuce: 1 } },
  { id: "fresh-classic", name: "Fresh Classic", difficulty: "easy", size: "single", toppings: { cheese: 1, tomato: 1, lettuce: 1, ketchup: 1 } },
  { id: "smoky-pickle", name: "Smoky Pickle", difficulty: "easy", size: "single", toppings: { bacon: 1, pickle: 1, bbq: 1 } },
  { id: "double-garden", name: "Double Garden", difficulty: "normal", size: "double", toppings: { cheese: 1, lettuce: 1, onion: 1, tomato: 1, mayo: 1 } },
  { id: "double-fire", name: "Double Fire", difficulty: "normal", size: "double", toppings: { cheese: 2, bacon: 1, jalapeno: 1, bbq: 1, chili: 1 } },
  { id: "mushroom-ranch", name: "Mushroom Ranch", difficulty: "normal", size: "double", toppings: { cheese: 1, egg: 1, mushroom: 2, onion: 1, ranch: 1 } },
  { id: "monster-blenger", name: "Monster Blenger", difficulty: "hard", size: "triple", toppings: { cheese: 2, egg: 1, bacon: 2, lettuce: 1, tomato: 1, onion: 1, blenger: 1 } },
  { id: "volcano-stack", name: "Volcano Stack", difficulty: "hard", size: "triple", toppings: { cheese: 2, bacon: 1, pickle: 1, jalapeno: 2, onion: 1, bbq: 1, chili: 2 } },
  { id: "ultimate-garden", name: "Ultimate Garden", difficulty: "hard", size: "triple", toppings: { egg: 1, lettuce: 2, tomato: 2, onion: 1, mushroom: 1, pickle: 1, ranch: 1, burger: 1 } }
];

const difficultyLabels = { easy: "Mudah", normal: "Normal", hard: "Sulit" };
const allowedTimes = new Set([15, 20, 25, 30]);
const tablePositions = {
  cheese: [88, 51], egg: [24, 73], bacon: [9, 73], lettuce: [9, 56], tomato: [24, 58],
  onion: [74, 57], pickle: [88, 59], jalapeno: [73, 73], mushroom: [88, 74], ketchup: [6, 89],
  mayo: [14, 89], mustard: [22, 89], chili: [30, 89], burger: [70, 89], blenger: [78, 89],
  bbq: [86, 89], ranch: [94, 89]
};

const state = {
  size: "single",
  category: "premium",
  selected: new Map(),
  baseParts: { buns: 0, patties: 0 },
  challenge: null,
  phase: "preview",
  timeLimit: 30,
  timeLeft: 30,
  deadline: 0,
  timerId: null,
  previousChallengeId: null
};

const els = {
  sizes: document.querySelector("#sizeOptions"), tabs: document.querySelector("#categoryTabs"),
  ingredients: document.querySelector("#ingredients"), stack: document.querySelector("#burgerStack"),
  burgerName: document.querySelector("#burgerNamePreview"), dropZone: document.querySelector("#dropZone"),
  ingredientTable: document.querySelector("#ingredientTable"), selectedToppings: document.querySelector("#selectedToppings"),
  toast: document.querySelector("#toast"), difficulty: document.querySelector("#difficultySelect"),
  time: document.querySelector("#timeSelect"), timerDisplay: document.querySelector("#timerDisplay"),
  timerPill: document.querySelector("#timerPill"), levelStatus: document.querySelector("#levelStatus"),
  bestScore: document.querySelector("#bestScore"), roundBanner: document.querySelector("#roundBanner"),
  roundMessage: document.querySelector("#roundMessage"), challengeModal: document.querySelector("#challengeModal"),
  targetStack: document.querySelector("#targetBurgerStack"), targetName: document.querySelector("#targetName"),
  targetTime: document.querySelector("#targetTime"), challengeDifficulty: document.querySelector("#challengeDifficulty"),
  startButton: document.querySelector("#startButton"), resultModal: document.querySelector("#resultModal"),
  resultIcon: document.querySelector("#resultIcon"), resultKicker: document.querySelector("#resultKicker"),
  resultTitle: document.querySelector("#resultTitle"), resultMessage: document.querySelector("#resultMessage"),
  resultScore: document.querySelector("#resultScore"), scoreBreakdown: document.querySelector("#scoreBreakdown"),
  resultFeedback: document.querySelector("#resultFeedback")
};

let suppressIngredientClickUntil = 0;
let toastTimer = null;

function getSize(id = state.size) {
  return sizes.find(item => item.id === id) || sizes[0];
}

function getIngredient(id) {
  return ingredients.find(item => item.id === id);
}

function readBestScore() {
  const value = Number.parseInt(localStorage.getItem("burgerBlengerBestScore") || "0", 10);
  return Number.isInteger(value) && value >= 0 && value <= 100 ? value : 0;
}

function saveBestScore(score) {
  const current = readBestScore();
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));
  if (safeScore > current) localStorage.setItem("burgerBlengerBestScore", String(safeScore));
  els.bestScore.textContent = String(Math.max(current, safeScore));
}

function setModal(modal, open) {
  modal.classList.toggle("open", open);
  modal.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("modal-open", open);
}

function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("show");
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2600);
}

function canBuild() {
  if (state.phase === "playing") return true;
  showToast("Tekan Mulai meracik untuk menjalankan timer.");
  return false;
}

function renderSizes() {
  els.sizes.replaceChildren(...sizes.map(size => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `size-card${state.size === size.id ? " active" : ""}`;
    button.setAttribute("aria-pressed", String(state.size === size.id));
    const icon = document.createElement("span");
    icon.className = "size-icon";
    icon.style.setProperty("--icon-size", size.iconSize);
    icon.textContent = size.icon;
    const name = document.createElement("b");
    name.textContent = size.name;
    const note = document.createElement("small");
    note.textContent = size.note;
    button.append(icon, name, note);
    button.addEventListener("click", () => {
      if (!canBuild()) return;
      state.size = size.id;
      state.baseParts.patties = Math.min(state.baseParts.patties, size.patties);
      renderAll();
    });
    return button;
  }));
}

function renderTabs() {
  const categories = [
    { id: "premium", name: "⭐ Premium" },
    { id: "sayur", name: "🥬 Sayuran" },
    { id: "saus", name: "🥣 Saus" }
  ];
  els.tabs.replaceChildren(...categories.map(category => {
    const button = document.createElement("button");
    button.type = "button";
    button.role = "tab";
    button.textContent = category.name;
    button.className = `category-tab${state.category === category.id ? " active" : ""}`;
    button.setAttribute("aria-selected", String(state.category === category.id));
    button.addEventListener("click", () => {
      state.category = category.id;
      renderTabs();
      renderIngredients();
    });
    return button;
  }));
}

function renderIngredients() {
  const visible = ingredients.filter(item => item.category === state.category);
  els.ingredients.replaceChildren(...visible.map(item => {
    const qty = state.selected.get(item.id) || 0;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `ingredient${qty ? " selected" : ""}`;
    button.draggable = true;
    button.setAttribute("aria-label", `${qty ? "Tambah lagi" : "Tambah"} ${item.name}`);
    const image = document.createElement("img");
    image.src = `asset/topping/${item.image}`;
    image.alt = "";
    const text = document.createElement("span");
    const name = document.createElement("b");
    name.textContent = item.name;
    const hint = document.createElement("small");
    hint.textContent = "Klik atau seret";
    text.append(name, hint);
    const add = document.createElement("span");
    add.className = "add";
    add.textContent = qty >= 2 ? "−" : "+";
    button.append(image, text, add);
    if (qty) {
      const badge = document.createElement("span");
      badge.className = "qty";
      badge.textContent = `${qty}×`;
      button.append(badge);
    }
    button.addEventListener("click", () => {
      if (Date.now() < suppressIngredientClickUntil || !canBuild()) return;
      if (qty >= 2) removeIngredient(item.id); else addIngredient(item.id);
    });
    attachDrag(button, item.id, item.image);
    return button;
  }));
}

function attachDrag(button, payload, imageName, accepted = () => addIngredient(payload)) {
  button.addEventListener("dragstart", event => {
    if (!canBuild()) { event.preventDefault(); return; }
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData("text/plain", payload);
    requestAnimationFrame(() => button.classList.add("dragging"));
    els.dropZone.classList.add("drop-active");
  });
  button.addEventListener("dragend", () => {
    button.classList.remove("dragging");
    els.dropZone.classList.remove("drop-active");
  });
  setupTouchDrag(button, imageName, accepted);
}

function renderTableIngredients() {
  const objects = ingredients.map(item => {
    const position = tablePositions[item.id];
    const qty = state.selected.get(item.id) || 0;
    const button = document.createElement("button");
    button.type = "button";
    button.draggable = true;
    button.className = `table-ingredient ${item.category === "saus" ? "sauce" : "food"}${qty ? " selected" : ""}`;
    button.style.setProperty("--x", `${position[0]}%`);
    button.style.setProperty("--y", `${position[1]}%`);
    button.setAttribute("aria-label", `Tambahkan ${item.name}`);
    const image = document.createElement("img");
    image.src = `asset/topping/${item.image}`;
    image.alt = "";
    const label = document.createElement("span");
    label.textContent = item.name;
    button.append(image, label);
    if (qty) {
      const badge = document.createElement("b");
      badge.textContent = `${qty}×`;
      button.append(badge);
    }
    button.addEventListener("click", () => {
      if (Date.now() < suppressIngredientClickUntil || !canBuild()) return;
      addIngredient(item.id);
    });
    attachDrag(button, item.id, item.image);
    return button;
  });
  els.ingredientTable.replaceChildren(
    createBaseObject("bun", "slice2.png", "Roti burger", state.baseParts.buns, 2),
    createBaseObject("patty", "slice1.png", "Patty sapi", state.baseParts.patties, getSize().patties),
    ...objects
  );
}

function createBaseObject(type, imageName, label, qty, max) {
  const button = document.createElement("button");
  button.type = "button";
  button.draggable = true;
  button.className = `table-base table-${type}${qty ? " selected" : ""}`;
  button.setAttribute("aria-label", `Tambahkan ${label}, ${qty} dari ${max}`);
  const image = document.createElement("img");
  image.src = `asset/topping/${imageName}`;
  image.alt = "";
  button.append(image);
  if (qty) {
    const badge = document.createElement("b");
    badge.textContent = `${qty}×`;
    button.append(badge);
  }
  const payload = `base:${type}`;
  button.addEventListener("click", () => {
    if (Date.now() < suppressIngredientClickUntil || !canBuild()) return;
    addBasePart(type);
  });
  attachDrag(button, payload, imageName, () => addBasePart(type));
  return button;
}

function pointInsideDropZone(x, y) {
  const rect = els.dropZone.getBoundingClientRect();
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function setupTouchDrag(button, imageName, onAccepted) {
  let session = null;
  button.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse" || state.phase !== "playing") return;
    session = { id: event.pointerId, startX: event.clientX, startY: event.clientY, dragging: false, ghost: null };
    button.setPointerCapture(event.pointerId);
  });
  button.addEventListener("pointermove", event => {
    if (!session || session.id !== event.pointerId) return;
    const distance = Math.hypot(event.clientX - session.startX, event.clientY - session.startY);
    if (!session.dragging && distance > 10) {
      session.dragging = true;
      button.classList.add("dragging");
      const ghost = document.createElement("div");
      ghost.className = "drag-ghost";
      const image = document.createElement("img");
      image.src = `asset/topping/${imageName}`;
      image.alt = "";
      ghost.append(image);
      document.body.append(ghost);
      session.ghost = ghost;
    }
    if (session.dragging) {
      event.preventDefault();
      session.ghost.style.left = `${event.clientX}px`;
      session.ghost.style.top = `${event.clientY}px`;
      els.dropZone.classList.toggle("drop-active", pointInsideDropZone(event.clientX, event.clientY));
    }
  });
  const finish = event => {
    if (!session || session.id !== event.pointerId) return;
    if (session.dragging) {
      suppressIngredientClickUntil = Date.now() + 500;
      const accepted = pointInsideDropZone(event.clientX, event.clientY);
      session.ghost?.remove();
      button.classList.remove("dragging");
      els.dropZone.classList.remove("drop-active");
      if (accepted) onAccepted();
    }
    session = null;
  };
  button.addEventListener("pointerup", finish);
  button.addEventListener("pointercancel", finish);
}

function addIngredient(id) {
  if (state.phase !== "playing") return;
  const item = getIngredient(id);
  if (!item) return;
  const qty = state.selected.get(id) || 0;
  if (qty >= 2) { showToast(`${item.name} maksimal 2 porsi.`); return; }
  state.selected.set(id, qty + 1);
  refreshBuild();
  flashDropSuccess();
}

function removeIngredient(id) {
  if (state.phase !== "playing") return;
  const qty = state.selected.get(id) || 0;
  if (!qty) return;
  if (qty === 1) state.selected.delete(id); else state.selected.set(id, qty - 1);
  refreshBuild();
}

function addBasePart(type) {
  if (state.phase !== "playing") return;
  if (type === "bun") {
    if (state.baseParts.buns >= 2) { showToast("Roti atas dan bawah sudah lengkap."); return; }
    state.baseParts.buns += 1;
  } else if (type === "patty") {
    const max = getSize().patties;
    if (state.baseParts.patties >= max) { showToast(`Ukuran ${getSize().name} maksimal ${max} patty.`); return; }
    state.baseParts.patties += 1;
  } else return;
  refreshBuild();
  flashDropSuccess();
}

function flashDropSuccess() {
  els.dropZone.classList.add("drop-success");
  setTimeout(() => els.dropZone.classList.remove("drop-success"), 350);
}

function renderSelectedToppings() {
  const chips = [];
  for (const [id, qty] of state.selected) {
    const item = getIngredient(id);
    if (!item) continue;
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "selected-chip";
    chip.setAttribute("aria-label", `Kurangi ${item.name}`);
    const text = document.createElement("span");
    text.textContent = `${item.name} ${qty}×`;
    const remove = document.createElement("b");
    remove.textContent = "×";
    chip.append(text, remove);
    chip.addEventListener("click", () => removeIngredient(id));
    chips.push(chip);
  }
  if (!chips.length) {
    const empty = document.createElement("small");
    empty.textContent = "Bahan pilihanmu akan muncul di sini.";
    chips.push(empty);
  }
  els.selectedToppings.replaceChildren(...chips);
}

function createLayer(image, y, width, label) {
  const img = document.createElement("img");
  img.src = `asset/topping/${image}`;
  img.alt = label || "";
  img.className = "burger-layer enter";
  img.style.setProperty("--y", `${y}%`);
  img.style.setProperty("--w", `${width}%`);
  return img;
}

function createBun(side, y) {
  const layer = document.createElement("div");
  layer.className = `burger-layer bun-layer ${side} enter`;
  layer.style.setProperty("--y", `${y}%`);
  layer.style.setProperty("--w", "88%");
  const image = document.createElement("img");
  image.src = "asset/topping/slice2.png";
  image.alt = side === "top" ? "Roti burger bagian atas" : "Roti burger bagian bawah";
  layer.append(image);
  return layer;
}

function buildVisualLayers(sizeId, toppingSource, buns = 2, pattyCount = getSize(sizeId).patties) {
  const layers = [];
  let y = 1;
  const entries = toppingSource instanceof Map ? toppingSource : new Map(Object.entries(toppingSource || {}));
  const toppingHeight = ingredients.reduce((total, item) => {
    const quantity = Number(entries.get(item.id)) || 0;
    return total + quantity * (item.category === "saus" ? 3 : 6);
  }, 0);
  const rawHeight = (buns >= 1 ? 10 : 0) + pattyCount * 9 + toppingHeight + (buns >= 2 ? 2 : 0);
  const scale = Math.min(1, 43 / Math.max(1, rawHeight));
  if (buns >= 1) { layers.push(createBun("bottom", y)); y += 10 * scale; }
  const addToppings = () => {
    ingredients.filter(item => entries.has(item.id)).forEach(item => {
      const qty = Number(entries.get(item.id)) || 0;
      for (let index = 0; index < qty; index += 1) {
        layers.push(createLayer(item.image, y, item.width, item.name));
        y += (item.category === "saus" ? 3 : 6) * scale;
      }
    });
  };
  if (pattyCount === 0) addToppings();
  for (let index = 0; index < pattyCount; index += 1) {
    layers.push(createLayer("slice1.png", y, 80, "Patty sapi"));
    y += 9 * scale;
    if (index === 0) addToppings();
  }
  if (buns >= 2) layers.push(createBun("top", y + 2 * scale));
  return layers;
}

function renderBurger() {
  els.stack.replaceChildren(...buildVisualLayers(state.size, state.selected, state.baseParts.buns, state.baseParts.patties));
}

function updateSummary() {
  const toppingCount = [...state.selected.values()].reduce((sum, qty) => sum + qty, 0);
  const totalParts = toppingCount + state.baseParts.buns + state.baseParts.patties;
  els.burgerName.textContent = totalParts ? `${getSize().name} • ${totalParts} bagian` : "Belum diracik";
}

function refreshBuild() {
  renderIngredients();
  renderTableIngredients();
  renderSelectedToppings();
  renderBurger();
  updateSummary();
}

function renderAll() {
  renderSizes();
  renderTabs();
  refreshBuild();
}

function resetBuild() {
  state.size = "single";
  state.category = "premium";
  state.selected.clear();
  state.baseParts = { buns: 0, patties: 0 };
  renderAll();
}

function pickChallenge() {
  const difficulty = ["easy", "normal", "hard"].includes(els.difficulty.value) ? els.difficulty.value : "easy";
  const available = challenges.filter(item => item.difficulty === difficulty && item.id !== state.previousChallengeId);
  const fallback = challenges.filter(item => item.difficulty === difficulty);
  const pool = available.length ? available : fallback;
  return pool[Math.floor(Math.random() * pool.length)];
}

function prepareChallenge(useSame = false) {
  stopTimer();
  setModal(els.resultModal, false);
  if (!useSame || !state.challenge) state.challenge = pickChallenge();
  state.previousChallengeId = state.challenge.id;
  const selectedTime = Number.parseInt(els.time.value, 10);
  state.timeLimit = allowedTimes.has(selectedTime) ? selectedTime : 30;
  state.timeLeft = state.timeLimit;
  state.phase = "preview";
  resetBuild();
  els.levelStatus.textContent = difficultyLabels[state.challenge.difficulty];
  els.timerDisplay.textContent = String(state.timeLimit);
  els.timerPill.classList.remove("urgent");
  els.roundBanner.className = "round-banner waiting";
  els.roundMessage.textContent = "Hafalkan pesanan, lalu mulai tantangan.";
  els.targetStack.replaceChildren(...buildVisualLayers(state.challenge.size, state.challenge.toppings));
  els.targetName.textContent = state.challenge.name;
  els.targetTime.textContent = String(state.timeLimit);
  els.challengeDifficulty.textContent = `LEVEL ${difficultyLabels[state.challenge.difficulty].toUpperCase()}`;
  els.startButton.querySelector("span").textContent = "Mulai meracik";
  setModal(els.challengeModal, true);
  setTimeout(() => els.startButton.focus(), 50);
}

function startChallenge() {
  if (state.phase === "playing") {
    setModal(els.challengeModal, false);
    return;
  }
  state.phase = "playing";
  state.deadline = Date.now() + state.timeLimit * 1000;
  els.roundBanner.className = "round-banner playing";
  els.roundMessage.textContent = `Racik ${state.challenge.name} sebelum waktu habis!`;
  els.startButton.querySelector("span").textContent = "Kembali meracik";
  setModal(els.challengeModal, false);
  updateTimer();
  state.timerId = window.setInterval(updateTimer, 200);
}

function updateTimer() {
  const milliseconds = Math.max(0, state.deadline - Date.now());
  state.timeLeft = Math.ceil(milliseconds / 1000);
  els.timerDisplay.textContent = String(state.timeLeft);
  els.timerPill.classList.toggle("urgent", state.timeLeft <= 5);
  if (milliseconds <= 0 && state.phase === "playing") finishChallenge(true);
}

function stopTimer() {
  if (state.timerId !== null) window.clearInterval(state.timerId);
  state.timerId = null;
}

function compareToppings() {
  const differences = [];
  let matched = 0;
  let extra = 0;
  let targetUnits = 0;
  ingredients.forEach(item => {
    const expected = Number(state.challenge.toppings[item.id] || 0);
    const actual = state.selected.get(item.id) || 0;
    targetUnits += expected;
    matched += Math.min(expected, actual);
    extra += Math.max(0, actual - expected);
    if (actual < expected) differences.push(`Kurang ${expected - actual}× ${item.name}`);
    if (actual > expected) differences.push(`Berlebih ${actual - expected}× ${item.name}`);
  });
  const accuracy = Math.max(0, (matched - extra) / Math.max(1, targetUnits));
  return { differences, score: Math.round(60 * accuracy), exact: differences.length === 0 };
}

function calculateResult(timedOut) {
  const targetSize = getSize(state.challenge.size);
  const sizeCorrect = state.size === state.challenge.size;
  const bunsCorrect = state.baseParts.buns === 2;
  const pattiesCorrect = state.baseParts.patties === targetSize.patties;
  const toppingResult = compareToppings();
  const sizeScore = sizeCorrect ? 15 : 0;
  const bunScore = Math.round(6 * Math.min(state.baseParts.buns, 2) / 2);
  const pattyScore = Math.round(9 * Math.min(state.baseParts.patties, targetSize.patties) / targetSize.patties);
  const baseScore = bunScore + pattyScore;
  const success = !timedOut && sizeCorrect && bunsCorrect && pattiesCorrect && toppingResult.exact;
  const timeScore = success ? Math.max(1, Math.ceil(10 * state.timeLeft / state.timeLimit)) : 0;
  const total = Math.min(100, sizeScore + baseScore + toppingResult.score + timeScore);
  const feedback = [...toppingResult.differences];
  if (!sizeCorrect) feedback.unshift(`Ukuran seharusnya ${targetSize.name}, bukan ${getSize().name}.`);
  if (!bunsCorrect) feedback.push(`Roti harus 2 buah; kamu memasukkan ${state.baseParts.buns}.`);
  if (!pattiesCorrect) feedback.push(`Patty harus ${targetSize.patties}; kamu memasukkan ${state.baseParts.patties}.`);
  if (timedOut) feedback.unshift("Waktu habis sebelum burger disajikan.");
  return { success, total, sizeScore, baseScore, toppingScore: toppingResult.score, timeScore, feedback };
}

function finishChallenge(timedOut = false) {
  if (state.phase !== "playing") return;
  stopTimer();
  state.phase = "finished";
  setModal(els.challengeModal, false);
  const result = calculateResult(timedOut);
  saveBestScore(result.total);
  els.timerPill.classList.remove("urgent");
  els.roundBanner.className = `round-banner ${result.success ? "success" : "failed"}`;
  els.roundMessage.textContent = result.success ? "Pesanan berhasil dibuat dengan tepat!" : "Pesanan belum sesuai. Lihat hasil penilaian.";
  els.resultIcon.textContent = result.success ? "🎉" : timedOut ? "⏰" : "🍔";
  els.resultKicker.textContent = result.success ? "PESANAN BERHASIL" : "COBA LAGI";
  els.resultTitle.textContent = result.success ? "Burger sempurna!" : timedOut ? "Waktu habis!" : "Burger belum sesuai";
  els.resultMessage.textContent = result.success
    ? `Kamu berhasil membuat ${state.challenge.name} dengan sisa waktu ${state.timeLeft} detik.`
    : `Skormu tetap dihitung. Periksa petunjuk berikut agar percobaan selanjutnya lebih tepat.`;
  els.resultScore.textContent = String(result.total);
  const scoreParts = [
    ["Ukuran", result.sizeScore, 15], ["Roti & patty", result.baseScore, 15],
    ["Topping", result.toppingScore, 60], ["Bonus waktu", result.timeScore, 10]
  ];
  els.scoreBreakdown.replaceChildren(...scoreParts.map(([label, score, max]) => {
    const row = document.createElement("div");
    const name = document.createElement("span");
    name.textContent = label;
    const value = document.createElement("b");
    value.textContent = `${score}/${max}`;
    row.append(name, value);
    return row;
  }));
  const feedbackItems = result.feedback.length ? result.feedback : ["Semua bahan dan jumlahnya sudah tepat."];
  const title = document.createElement("b");
  title.textContent = result.success ? "Hasil pemeriksaan" : "Yang perlu diperbaiki";
  const list = document.createElement("ul");
  list.replaceChildren(...feedbackItems.map(message => {
    const item = document.createElement("li");
    item.textContent = message;
    return item;
  }));
  els.resultFeedback.replaceChildren(title, list);
  setModal(els.resultModal, true);
  setTimeout(() => document.querySelector("#nextButton").focus(), 50);
}

document.querySelector("#newChallengeButton").addEventListener("click", () => prepareChallenge(false));
document.querySelector("#submitButton").addEventListener("click", () => {
  if (!canBuild()) return;
  finishChallenge(false);
});
document.querySelector("#peekButton").addEventListener("click", () => {
  if (!state.challenge) return;
  els.startButton.querySelector("span").textContent = state.phase === "playing" ? "Kembali meracik" : "Mulai meracik";
  setModal(els.challengeModal, true);
});
els.startButton.addEventListener("click", startChallenge);
document.querySelector("#retryButton").addEventListener("click", () => prepareChallenge(true));
document.querySelector("#nextButton").addEventListener("click", () => prepareChallenge(false));

els.dropZone.addEventListener("dragover", event => {
  if (state.phase !== "playing") return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
  els.dropZone.classList.add("drop-active");
});
els.dropZone.addEventListener("dragleave", event => {
  if (!els.dropZone.contains(event.relatedTarget)) els.dropZone.classList.remove("drop-active");
});
els.dropZone.addEventListener("drop", event => {
  event.preventDefault();
  els.dropZone.classList.remove("drop-active");
  if (state.phase !== "playing") return;
  const payload = event.dataTransfer.getData("text/plain");
  if (payload === "base:bun") addBasePart("bun");
  else if (payload === "base:patty") addBasePart("patty");
  else if (getIngredient(payload)) addIngredient(payload);
});

document.addEventListener("keydown", event => {
  if (event.key === "Enter" && state.phase === "playing" && !els.challengeModal.classList.contains("open")) finishChallenge(false);
});

els.bestScore.textContent = String(readBestScore());
renderAll();
prepareChallenge(false);
