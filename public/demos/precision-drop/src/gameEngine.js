import { DIFFICULTIES, GAME, getPrecisionResult } from './config.js';

export const STATES = Object.freeze({ IDLE: 'IDLE', COUNTDOWN: 'COUNTDOWN', MOVING: 'MOVING', RESULT: 'RESULT' });

export class GameEngine {
  constructor({ onRender, onStateChange, onTick, onResult }) {
    this.callbacks = { onRender, onStateChange, onTick, onResult };
    this.state = STATES.IDLE;
    this.difficultyKey = 'medium';
    this.attempt = 1;
    this.scores = [];
    this.x = 0;
    this.direction = 1;
    this.lastTime = 0;
    this.remainingTime = DIFFICULTIES.medium.timeLimit;
    this.rafId = null;
    this.countdownTimer = null;
  }

  configure(key) {
    if (!DIFFICULTIES[key]) return;
    this.difficultyKey = key;
    this.remainingTime = DIFFICULTIES[key].timeLimit;
  }

  resetSession() {
    this.cancel();
    this.attempt = 1;
    this.scores = [];
    this.state = STATES.IDLE;
  }

  startRound(arenaWidth) {
    this.cancel();
    this.resizeArena(arenaWidth);
    const startingRange = Math.max(1, (this.maxX - this.minX) * 0.18);
    this.x = this.minX + Math.random() * startingRange;
    this.direction = 1;
    this.remainingTime = DIFFICULTIES[this.difficultyKey].timeLimit;
    this.setState(STATES.COUNTDOWN);
    this.callbacks.onRender?.(this.x);
    let count = GAME.countdownSeconds;
    this.callbacks.onTick?.({ countdown: count, remaining: this.remainingTime });
    this.countdownTimer = window.setInterval(() => {
      count -= 1;
      this.callbacks.onTick?.({ countdown: count, remaining: this.remainingTime });
      if (count <= 0) {
        window.clearInterval(this.countdownTimer);
        this.countdownTimer = null;
        this.beginMovement();
      }
    }, 1000);
  }

  beginMovement() {
    this.setState(STATES.MOVING);
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame((time) => this.loop(time));
  }

  loop(time) {
    if (this.state !== STATES.MOVING) return;
    const delta = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;
    const difficulty = DIFFICULTIES[this.difficultyKey];
    this.x += difficulty.speed * this.direction * delta;
    if (this.x >= this.maxX) { this.x = this.maxX; this.direction = -1; }
    if (this.x <= this.minX) { this.x = this.minX; this.direction = 1; }
    this.remainingTime = Math.max(0, this.remainingTime - delta);

    this.callbacks.onRender?.(this.x);
    this.callbacks.onTick?.({ countdown: null, remaining: this.remainingTime });
    if (this.remainingTime <= 0) this.stop('timeout');
    else this.rafId = requestAnimationFrame((nextTime) => this.loop(nextTime));
  }

  stop(source = 'input') {
    if (this.state !== STATES.MOVING) return false;
    cancelAnimationFrame(this.rafId);
    this.rafId = null;
    const productCenter = this.x + GAME.productWidth / 2;
    const targetCenter = this.arenaWidth / 2;
    const errorPercentage = Math.abs(productCenter - targetCenter) / this.arenaWidth * 100;
    const result = source === 'timeout'
      ? { ...getPrecisionResult(Infinity), errorPercentage: 100, source }
      : { ...getPrecisionResult(errorPercentage), errorPercentage, source };
    this.scores.push(result.score);
    this.setState(STATES.RESULT);
    this.callbacks.onResult?.({
      ...result,
      precision: Math.max(0, 100 - result.errorPercentage),
      attempt: this.attempt,
      bestScore: Math.max(...this.scores),
      hasNextAttempt: this.attempt < GAME.attempts,
    });
    return true;
  }

  nextAttempt() {
    if (this.attempt >= GAME.attempts) return false;
    this.attempt += 1;
    return true;
  }

  resizeArena(arenaWidth) {
    this.arenaWidth = Math.max(arenaWidth, GAME.productWidth + 1);
    const travelWidth = Math.max(GAME.productWidth + 40, this.arenaWidth * GAME.travelRatio);
    this.minX = (this.arenaWidth - travelWidth) / 2;
    this.maxX = this.minX + travelWidth - GAME.productWidth;
    if (Number.isFinite(this.x)) this.x = Math.min(this.maxX, Math.max(this.minX, this.x));
  }

  setState(nextState) {
    this.state = nextState;
    this.callbacks.onStateChange?.(nextState);
  }

  cancel() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.countdownTimer) window.clearInterval(this.countdownTimer);
    this.rafId = null;
    this.countdownTimer = null;
  }
}

