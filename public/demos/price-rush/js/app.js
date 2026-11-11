import { GAME_CONFIG } from "./config.js";
import { PriceGuessGame } from "./game.js";
import { SoundManager } from "./sound.js";

const byId = (id) => document.getElementById(id);
const elements = {
  screens: { start: byId("start-screen"), game: byId("game-screen"), result: byId("result-screen") },
  bestScore: byId("best-score"), currentScore: byId("current-score"), roundLabel: byId("round-label"),
  streakLabel: byId("streak-label"), timerPill: byId("timer-pill"), timerText: byId("timer-text"),
  questionProgress: byId("question-progress"), productCard: byId("product-card"), productCategory: byId("product-category"),
  productNumber: byId("product-number"), productName: byId("product-name"), productDescription: byId("product-description"),
  productArt: byId("product-art"), productEmoji: byId("product-emoji"), answerGrid: byId("answer-grid"),
  answerPanel: document.querySelector(".answer-panel"), feedback: byId("feedback"), countdownOverlay: byId("countdown-overlay"),
  countdownNumber: byId("countdown-number"), countdownLabel: byId("countdown-label"), finalScore: byId("final-score"),
  correctResult: byId("correct-result"), accuracyResult: byId("accuracy-result"), timeResult: byId("time-result"),
  timeoutResult: byId("timeout-result"), resultTitle: byId("result-title"), resultMessage: byId("result-message"),
  newRecord: byId("new-record"), confetti: byId("confetti")
};

const storedSound = localStorage.getItem(GAME_CONFIG.storageKeys.sound);
const sound = new SoundManager(storedSound === null ? GAME_CONFIG.enableSound : storedSound === "true");
const game = new PriceGuessGame(elements, sound);
const soundButton = byId("sound-toggle");
const soundIcon = byId("sound-icon");

function renderSoundState() {
  soundButton.setAttribute("aria-pressed", String(sound.enabled));
  soundButton.setAttribute("aria-label", sound.enabled ? "Matikan suara" : "Nyalakan suara");
  soundIcon.textContent = sound.enabled ? "♪" : "×";
}

elements.bestScore.textContent = game.getBestScore().toLocaleString("id-ID");
renderSoundState();

document.querySelectorAll("[data-difficulty]").forEach((button) => {
  button.addEventListener("click", () => {
    const difficulty = button.dataset.difficulty;
    game.setDifficulty(difficulty);
    sound.play("click");
    document.querySelectorAll("[data-difficulty]").forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-checked", String(selected));
    });
  });
});

byId("start-button").addEventListener("click", async () => {
  await sound.unlock();
  sound.play("click");
  game.start();
});

byId("replay-button").addEventListener("click", async () => {
  await sound.unlock();
  sound.play("click");
  game.replay();
});

byId("home-button").addEventListener("click", () => {
  sound.play("click");
  game.goHome();
});

soundButton.addEventListener("click", async () => {
  sound.setEnabled(!sound.enabled);
  localStorage.setItem(GAME_CONFIG.storageKeys.sound, String(sound.enabled));
  if (sound.enabled) {
    await sound.unlock();
    sound.play("click");
  }
  renderSoundState();
});

window.addEventListener("pagehide", () => game.clearPending());
