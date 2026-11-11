import { DIFFICULTIES, GAME } from './config.js';
import { GameEngine, STATES } from './gameEngine.js';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const screens = { attract: $('#attract-screen'), setup: $('#setup-screen'), game: $('#game-screen'), result: $('#result-screen') };
const els = {
  start: $('#start-button'), how: $('#how-button'), dialog: $('#how-dialog'), ready: $('#ready-button'),
  arena: $('#arena'), product: $('#moving-product'), countdown: $('#countdown'), timer: $('#timer'), timerValue: $('#timer-value'),
  level: $('#level-label'), target: $('#target-zone'), attempt: $('#attempt-value'), attemptDots: $$('#attempt-dots i'), best: $('#best-score'),
  resultTitle: $('#result-title'), resultKicker: $('#result-kicker'), resultScore: $('#result-score'), resultError: $('#result-error'),
  resultPrecision: $('#result-precision'), resultAttempt: $('#result-attempt'), resultBest: $('#result-best'), reward: $('#reward-name'),
  rewardCard: $('#reward-card'), scoreRing: $('#score-ring'), retry: $('#retry-button'), finish: $('#finish-button'),
};

let selectedDifficulty = 'medium';

const engine = new GameEngine({
  onRender: (x) => { els.product.style.transform = `translate3d(${x}px, -50%, 0)`; },
  onStateChange: (state) => document.body.dataset.gameState = state,
  onTick: ({ countdown, remaining }) => {
    els.timerValue.textContent = remaining.toFixed(1);
    els.timer.classList.toggle('timer--urgent', remaining <= 3);
    if (countdown !== null) {
      els.countdown.textContent = countdown === 0 ? 'DROP!' : countdown;
      els.countdown.classList.toggle('countdown--show', countdown >= 0);
      if (countdown === 0) setTimeout(() => els.countdown.classList.remove('countdown--show'), 500);
    }
  },
  onResult: (result) => {
    navigator.vibrate?.(result.score >= 80 ? [40, 50, 80] : 50);
    setTimeout(() => showResult(result), 550);
  },
});

function showScreen(name) {
  Object.entries(screens).forEach(([key, screen]) => screen.classList.toggle('screen--active', key === name));
}

function updateRoundHud() {
  const difficulty = DIFFICULTIES[selectedDifficulty];
  els.level.textContent = difficulty.label.toUpperCase();
  els.target.style.setProperty('--target-width', `${difficulty.targetWidth}%`);
  els.attempt.textContent = `${engine.attempt} / ${GAME.attempts}`;
  els.best.textContent = String(engine.scores.length ? Math.max(...engine.scores) : 0).padStart(3, '0');
  els.attemptDots.forEach((dot, index) => {
    dot.classList.toggle('done', index < engine.attempt - 1);
    dot.classList.toggle('active', index === engine.attempt - 1);
  });
}

function beginRound() {
  showScreen('game');
  updateRoundHud();
  requestAnimationFrame(() => engine.startRound(els.arena.clientWidth));
}

function stopGame(source) {
  if (engine.stop(source)) {
    els.product.classList.add('moving-product--stopped');
    setTimeout(() => els.product.classList.remove('moving-product--stopped'), 700);
  }
}

function showResult(result) {
  els.resultTitle.textContent = result.name;
  els.resultTitle.style.color = result.color;
  els.resultKicker.textContent = result.source === 'timeout' ? 'TIME IS UP' : result.score >= 80 ? 'TARGET ACQUIRED' : 'PRECISION RECORDED';
  els.resultScore.textContent = result.score;
  els.resultError.textContent = result.source === 'timeout' ? 'waktu habis' : `${result.errorPercentage.toFixed(2)}%`;
  els.resultPrecision.textContent = `${result.precision.toFixed(1)}%`;
  els.resultAttempt.textContent = `${result.attempt} dari ${GAME.attempts}`;
  els.resultBest.textContent = String(result.bestScore).padStart(3, '0');
  els.reward.textContent = result.reward;
  els.rewardCard.classList.toggle('reward-card--miss', result.score === 0);
  els.scoreRing.style.setProperty('--score-color', result.color);
  els.scoreRing.style.setProperty('--score-angle', `${result.score * 3.6}deg`);
  els.retry.textContent = result.hasNextAttempt ? 'Percobaan Berikutnya →' : 'Main Lagi →';
  showScreen('result');
}

els.start.addEventListener('click', () => showScreen('setup'));
els.how.addEventListener('click', () => els.dialog.showModal());
$('.dialog-close').addEventListener('click', () => els.dialog.close());
els.dialog.addEventListener('click', (event) => { if (event.target === els.dialog) els.dialog.close(); });
$$('[data-back]').forEach((button) => button.addEventListener('click', () => {
  showScreen('attract');
}));
$('#difficulty-picker').addEventListener('click', (event) => {
  const button = event.target.closest('[data-difficulty]');
  if (!button) return;
  selectedDifficulty = button.dataset.difficulty;
  $$('#difficulty-picker button').forEach((item) => item.classList.toggle('selected', item === button));
});
els.ready.addEventListener('click', () => { engine.resetSession(); engine.configure(selectedDifficulty); beginRound(); });
els.arena.addEventListener('pointerdown', () => stopGame('tap'));
els.retry.addEventListener('click', () => {
  if (!engine.nextAttempt()) { engine.resetSession(); engine.configure(selectedDifficulty); }
  beginRound();
});
els.finish.addEventListener('click', () => { engine.resetSession(); showScreen('attract'); });

window.addEventListener('keydown', (event) => {
  if (event.code === 'Escape' && els.dialog.open) els.dialog.close();
});
window.addEventListener('resize', () => {
  if (engine.state === STATES.MOVING) engine.resizeArena(els.arena.clientWidth);
});

