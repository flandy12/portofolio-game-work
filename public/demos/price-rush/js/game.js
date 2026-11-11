import { GAME_CONFIG } from "./config.js";
import { PRODUCTS } from "./products.js";
import { generatePriceOptions, formatRupiah, shuffle } from "./price-generator.js";
import { calculateAccuracy, calculateScore, getPerformance } from "./scoring.js";
import { QuestionTimer } from "./timer.js";

const initialState = () => ({
  status: "idle",
  difficulty: "medium",
  currentQuestion: 0,
  score: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  timeoutAnswers: 0,
  remainingTime: 0,
  selectedAnswer: null,
  questions: [],
  answers: [],
  isAnswerLocked: false,
  streak: 0,
  totalTimeUsed: 0
});

export class PriceGuessGame {
  constructor(elements, sound) {
    this.elements = elements;
    this.sound = sound;
    this.state = initialState();
    this.timer = new QuestionTimer(
      (remaining, ratio) => this.renderTimer(remaining, ratio),
      () => this.handleTimeout()
    );
    this.nextRoundTimeout = null;
  }

  setDifficulty(difficulty) {
    if (this.state.status !== "idle" || !GAME_CONFIG.difficulty[difficulty]) return;
    this.state.difficulty = difficulty;
  }

  async start() {
    if (this.state.status !== "idle" && this.state.status !== "finished") return;
    const difficulty = this.state.difficulty;
    this.reset(difficulty);
    const settings = GAME_CONFIG.difficulty[difficulty];
    this.state.questions = shuffle(PRODUCTS).slice(0, Math.min(settings.questions, PRODUCTS.length));
    this.state.status = "countdown";
    this.showScreen("game");
    await this.runCountdown();
    this.showQuestion();
  }

  async runCountdown() {
    const { countdownOverlay, countdownNumber, countdownLabel } = this.elements;
    countdownOverlay.hidden = false;
    countdownLabel.textContent = "BERSIAP";
    for (let value = GAME_CONFIG.countdownDuration; value >= 1; value -= 1) {
      countdownNumber.textContent = value;
      countdownNumber.classList.remove("countdown-pop");
      void countdownNumber.offsetWidth;
      countdownNumber.classList.add("countdown-pop");
      this.sound.play("countdown");
      await new Promise((resolve) => window.setTimeout(resolve, 700));
    }
    countdownLabel.textContent = "MULAI!";
    countdownNumber.textContent = "GO";
    this.sound.play("start");
    await new Promise((resolve) => window.setTimeout(resolve, 550));
    countdownOverlay.hidden = true;
  }

  showQuestion() {
    if (this.state.currentQuestion >= this.state.questions.length) {
      this.finish();
      return;
    }
    this.clearPending();
    this.state.status = "playing";
    this.state.isAnswerLocked = false;
    this.state.selectedAnswer = null;
    const product = this.state.questions[this.state.currentQuestion];
    const settings = GAME_CONFIG.difficulty[this.state.difficulty];
    const options = generatePriceOptions(product.price, settings.variation, GAME_CONFIG.optionsPerQuestion);
    this.renderQuestion(product, options);
    this.timer.start(settings.duration);
  }

  renderQuestion(product, options) {
    const { elements } = this;
    const current = this.state.currentQuestion + 1;
    const total = this.state.questions.length;
    elements.currentScore.textContent = this.state.score.toLocaleString("id-ID");
    elements.roundLabel.textContent = `SOAL ${current} DARI ${total}`;
    elements.questionProgress.style.width = `${((current - 1) / total) * 100}%`;
    elements.productNumber.textContent = String(current).padStart(2, "0");
    elements.productCategory.textContent = product.category;
    elements.productName.textContent = product.name;
    elements.productDescription.textContent = product.description;
    elements.productEmoji.textContent = product.emoji;
    elements.productArt.style.setProperty("--product-color", product.color);
    elements.productArt.setAttribute("aria-label", `Ilustrasi ${product.name}`);
    elements.productCard.classList.remove("card-enter");
    void elements.productCard.offsetWidth;
    elements.productCard.classList.add("card-enter");
    elements.feedback.textContent = "";
    elements.feedback.className = "feedback";
    elements.answerGrid.replaceChildren(...options.map((price, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-button";
      button.dataset.price = String(price);
      button.innerHTML = `<span>${String.fromCharCode(65 + index)}</span><strong>${formatRupiah(price)}</strong>`;
      button.addEventListener("click", () => this.selectAnswer(price, button), { once: true });
      return button;
    }));
    elements.streakLabel.textContent = this.state.streak >= 3 ? `${this.state.streak}× STREAK` : "";
  }

  selectAnswer(price, selectedButton) {
    if (this.state.status !== "playing" || this.state.isAnswerLocked) return;
    this.state.isAnswerLocked = true;
    this.state.status = "feedback";
    this.state.selectedAnswer = price;
    const remaining = this.timer.stop();
    const settings = GAME_CONFIG.difficulty[this.state.difficulty];
    this.state.totalTimeUsed += settings.duration - remaining;
    const product = this.state.questions[this.state.currentQuestion];
    const isCorrect = price === product.price;

    this.lockAnswers(product.price);
    if (isCorrect) {
      const earned = calculateScore(remaining, settings.duration, GAME_CONFIG.baseScore, GAME_CONFIG.maxSpeedBonus);
      this.state.score += earned.total;
      this.state.correctAnswers += 1;
      this.state.streak += 1;
      selectedButton.classList.add("is-correct");
      this.elements.feedback.className = "feedback is-correct";
      this.elements.feedback.textContent = `Tepat! +${earned.total} poin`;
      this.sound.play("correct");
      this.animateScore();
    } else {
      this.state.wrongAnswers += 1;
      this.state.streak = 0;
      selectedButton.classList.add("is-wrong");
      this.elements.feedback.className = "feedback is-wrong";
      this.elements.feedback.textContent = `Belum tepat — ${formatRupiah(product.price)}`;
      this.sound.play("wrong");
      this.elements.answerPanel.classList.add("shake");
      window.setTimeout(() => this.elements.answerPanel.classList.remove("shake"), 450);
    }
    this.recordAnswer(price, product.price, isCorrect, false);
    this.scheduleNextQuestion();
  }

  handleTimeout() {
    if (this.state.status !== "playing" || this.state.isAnswerLocked) return;
    this.state.isAnswerLocked = true;
    this.state.status = "feedback";
    this.state.timeoutAnswers += 1;
    this.state.streak = 0;
    const settings = GAME_CONFIG.difficulty[this.state.difficulty];
    this.state.totalTimeUsed += settings.duration;
    const product = this.state.questions[this.state.currentQuestion];
    this.lockAnswers(product.price);
    this.elements.feedback.className = "feedback is-wrong";
    this.elements.feedback.textContent = `Waktu habis — ${formatRupiah(product.price)}`;
    this.sound.play("timeout");
    this.recordAnswer(null, product.price, false, true);
    this.scheduleNextQuestion();
  }

  lockAnswers(correctPrice) {
    this.elements.answerGrid.querySelectorAll("button").forEach((button) => {
      button.disabled = true;
      if (Number(button.dataset.price) === correctPrice) button.classList.add("is-correct");
    });
  }

  recordAnswer(selected, correct, isCorrect, timeout) {
    this.state.answers.push({
      productId: this.state.questions[this.state.currentQuestion].id,
      selected,
      correct,
      isCorrect,
      timeout
    });
  }

  scheduleNextQuestion() {
    this.nextRoundTimeout = window.setTimeout(() => {
      this.state.currentQuestion += 1;
      this.showQuestion();
    }, GAME_CONFIG.answerFeedbackDuration);
  }

  finish() {
    this.clearPending();
    this.state.status = "finished";
    this.elements.questionProgress.style.width = "100%";
    const total = this.state.questions.length;
    const accuracy = calculateAccuracy(this.state.correctAnswers, total);
    const performance = getPerformance(accuracy);
    const priorBest = this.getBestScore();
    const isRecord = this.state.score > priorBest;
    if (isRecord) localStorage.setItem(GAME_CONFIG.storageKeys.bestScore, String(this.state.score));
    localStorage.setItem(GAME_CONFIG.storageKeys.lastResult, JSON.stringify({
      score: this.state.score,
      correct: this.state.correctAnswers,
      total,
      accuracy,
      playedAt: new Date().toISOString()
    }));
    this.elements.finalScore.textContent = this.state.score.toLocaleString("id-ID");
    this.elements.correctResult.textContent = `${this.state.correctAnswers}/${total}`;
    this.elements.accuracyResult.textContent = `${accuracy}%`;
    this.elements.timeResult.textContent = `${Math.round(this.state.totalTimeUsed)} dtk`;
    this.elements.timeoutResult.textContent = this.state.timeoutAnswers;
    this.elements.resultTitle.textContent = performance.title;
    this.elements.resultMessage.textContent = performance.message;
    this.elements.newRecord.hidden = !isRecord;
    this.elements.bestScore.textContent = Math.max(priorBest, this.state.score).toLocaleString("id-ID");
    this.showScreen("result");
    this.createConfetti();
    this.sound.play("complete");
  }

  createConfetti() {
    const colors = ["#f7c948", "#ff6b4a", "#5ce1e6", "#ffffff", "#8b7cff"];
    const pieces = Array.from({ length: 60 }, (_, index) => {
      const piece = document.createElement("i");
      piece.style.setProperty("--x", `${(index * 47) % 100}vw`);
      piece.style.setProperty("--delay", `${(index % 12) * 0.08}s`);
      piece.style.setProperty("--spin", `${180 + (index % 7) * 90}deg`);
      piece.style.background = colors[index % colors.length];
      return piece;
    });
    this.elements.confetti.replaceChildren(...pieces);
  }

  replay() {
    if (this.state.status !== "finished") return;
    this.start();
  }

  goHome() {
    const difficulty = this.state.difficulty;
    this.clearPending();
    this.timer.stop();
    this.state = initialState();
    this.state.difficulty = difficulty;
    this.showScreen("start");
  }

  reset(difficulty = "medium") {
    this.clearPending();
    this.timer.stop();
    this.state = initialState();
    this.state.difficulty = difficulty;
    this.elements.confetti.replaceChildren();
  }

  clearPending() {
    if (this.nextRoundTimeout !== null) {
      window.clearTimeout(this.nextRoundTimeout);
      this.nextRoundTimeout = null;
    }
  }

  renderTimer(remaining, ratio) {
    this.state.remainingTime = remaining;
    this.elements.timerText.textContent = Math.ceil(remaining);
    this.elements.timerPill.style.setProperty("--timer-ratio", ratio);
    this.elements.timerPill.classList.toggle("is-warning", ratio <= 0.3);
  }

  animateScore() {
    this.elements.currentScore.textContent = this.state.score.toLocaleString("id-ID");
    this.elements.currentScore.classList.remove("score-pop");
    void this.elements.currentScore.offsetWidth;
    this.elements.currentScore.classList.add("score-pop");
  }

  showScreen(name) {
    Object.entries(this.elements.screens).forEach(([key, screen]) => {
      screen.classList.toggle("is-active", key === name);
      screen.setAttribute("aria-hidden", String(key !== name));
    });
  }

  getBestScore() {
    const stored = Number.parseInt(localStorage.getItem(GAME_CONFIG.storageKeys.bestScore) || "0", 10);
    return Number.isFinite(stored) && stored >= 0 ? stored : 0;
  }
}
