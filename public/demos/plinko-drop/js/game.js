import { DIFFICULTY_PROFILES, GAME_CONFIG, GAME_STATE } from './config.js';
import { createBall, recordTrail } from './ball.js';
import { createPegs } from './pegs.js';
import { stepPhysics, getSlotIndex } from './physics.js';
import { randomBetween } from './randomizer.js';
import { prizeForSlot, rarityLabel, selectWeightedPrize } from './prizes.js';

export class PlinkoGame {
  constructor({ board, ui, audio, data, onDataChange, onFinish }) {
    this.board = board; this.ui = ui; this.audio = audio; this.data = data; this.onDataChange = onDataChange; this.onFinish = onFinish;
    this.config = GAME_CONFIG.board; this.pegs = createPegs(this.config); this.launcherX = this.config.width / 2;
    this.state = GAME_STATE.WELCOME; this.ball = null; this.mode = 'physics'; this.difficulty = data.difficulty; this.balls = GAME_CONFIG.game.maxBalls;
    this.score = 0; this.drops = 0; this.bestDrop = 0; this.targetPrize = null; this.accumulator = 0; this.lastTime = 0; this.resultTimer = null;
    this.loop = this.loop.bind(this); requestAnimationFrame(this.loop);
  }
  start({ difficulty, mode }) {
    this.difficulty = DIFFICULTY_PROFILES[difficulty] ? difficulty : 'normal'; this.mode = mode === 'weighted' ? 'weighted' : 'physics';
    this.data.difficulty = this.difficulty; this.data.totalGames += 1; this.onDataChange(this.data);
    this.resetSession(); this.ui.showGame(); requestAnimationFrame(() => this.board.resize()); this.audio.unlock().catch(() => {});
  }
  resetSession() {
    clearTimeout(this.resultTimer); this.state = GAME_STATE.READY; this.ball = null; this.balls = GAME_CONFIG.game.maxBalls; this.score = 0; this.drops = 0; this.bestDrop = 0; this.targetPrize = null;
    this.board.activeSlot = -1; this.board.particles = []; this.ui.hideResult(); this.syncUI(); this.ui.setDroppable(true);
  }
  restart() { if (this.state !== GAME_STATE.WELCOME) { this.data.totalGames += 1; this.onDataChange(this.data); this.resetSession(); } }
  home() { clearTimeout(this.resultTimer); this.state = GAME_STATE.WELCOME; this.ball = null; this.board.activeSlot = -1; this.ui.showWelcome(); }
  setLauncher(x) {
    if (![GAME_STATE.READY, GAME_STATE.AIMING].includes(this.state)) return;
    this.state = GAME_STATE.AIMING; this.launcherX = Math.max(55, Math.min(this.config.width - 55, x)); this.syncUI();
  }
  moveLauncher(direction, speed = 7) { this.setLauncher(this.launcherX + direction * speed); }
  drop() {
    if (![GAME_STATE.READY, GAME_STATE.AIMING].includes(this.state) || this.ball || this.balls <= 0) return;
    const profile = DIFFICULTY_PROFILES[this.difficulty];
    const random = {
      vx: randomBetween(-profile.initialVX, profile.initialVX), angularVelocity: randomBetween(-0.09, 0.09),
      restitution: randomBetween(...profile.restitution), frictionAir: randomBetween(...profile.frictionAir)
    };
    const x = Math.max(42, Math.min(this.config.width - 42, this.launcherX + randomBetween(-GAME_CONFIG.randomization.initialOffset, GAME_CONFIG.randomization.initialOffset)));
    this.targetPrize = this.mode === 'weighted' ? selectWeightedPrize(this.data) : null;
    this.ball = createBall(x, 70, this.config.ballRadius, profile, random); this.state = GAME_STATE.DROPPING; this.balls -= 1; this.drops += 1;
    this.data.totalDrops += 1; this.onDataChange(this.data); this.ui.setDroppable(false); this.ui.hideResult(); this.audio.drop(); this.syncUI();
  }
  resolveBall() {
    if (!this.ball || this.ball.resolved) return;
    this.ball.resolved = true;
    const slotWidth = this.config.width / this.config.slotCount;
    const physicalSlot = getSlotIndex(this.ball.x, 0, slotWidth, this.config.slotCount);
    const prize = this.mode === 'weighted' && this.targetPrize ? this.targetPrize : prizeForSlot(physicalSlot);
    const slot = this.mode === 'weighted' ? prize.slot : physicalSlot;
    this.board.activeSlot = slot; this.score += prize.points; this.bestDrop = Math.max(this.bestDrop, prize.points); this.data.totalWins += 1;
    if (prize.category === 'legendary') this.data.legendaryWins += 1;
    if (prize.category === 'epic') this.data.epicWins += 1;
    this.onDataChange(this.data); this.state = GAME_STATE.RESULT; this.ui.showResult(prize, rarityLabel(prize.category)); this.audio.prize(prize.points);
    this.board.burst((slot + .5) * slotWidth, 700, prize.color, prize.points >= 250 ? 24 : 12);
    if (prize.points >= 500) { this.board.confetti(prize.color); this.board.shake = prize.points >= 1000 ? 13 : 6; }
    this.syncUI();
    this.resultTimer = setTimeout(() => {
      this.ball = null; this.targetPrize = null; this.board.activeSlot = -1; this.ui.hideResult();
      if (this.balls > 0) { this.state = GAME_STATE.READY; this.ui.setDroppable(true); }
      else this.finish();
      this.syncUI();
    }, prize.points >= 500 ? 2500 : 1700);
  }
  finish() {
    this.state = GAME_STATE.FINISHED; const oldHigh = this.data.highScore; const isNewBest = this.score > oldHigh;
    if (isNewBest) this.data.highScore = this.score; this.onDataChange(this.data); this.syncUI();
    this.ui.showGameOver({ score: this.score, bestDrop: this.bestDrop, difficulty: this.difficulty, isNewBest }); this.onFinish?.();
  }
  syncUI() {
    this.ui.updateHud({ balls: this.balls, score: this.score, highScore: Math.max(this.data.highScore, this.score), drops: this.drops, difficulty: this.difficulty, mode: this.mode });
    this.ui.updatePosition((this.launcherX - 55) / (this.config.width - 110));
  }
  loop(timestamp) {
    const elapsed = Math.min(0.05, (timestamp - (this.lastTime || timestamp)) / 1000); this.lastTime = timestamp; this.accumulator += elapsed;
    const fixedStep = 1 / 120;
    while (this.accumulator >= fixedStep) {
      if (this.ball && !this.ball.resolved) {
        const collision = stepPhysics(this.ball, this.pegs, fixedStep, this.config, this.targetPrize?.slot ?? null);
        if (collision) { this.audio.peg(); if (GAME_CONFIG.animation.particles && Math.random() < .45) this.board.burst(collision.x, collision.y, '#61eaff', 3); }
        if (GAME_CONFIG.animation.showTrail) recordTrail(this.ball);
        if (this.ball.y >= 681 || timestamp - this.ball.createdAt > 13000) this.resolveBall();
        else if (this.state === GAME_STATE.DROPPING && this.ball.y > 100) this.state = GAME_STATE.BOUNCING;
      }
      this.board.updateParticles(fixedStep); this.accumulator -= fixedStep;
    }
    this.board.draw(this.pegs, this.ball, this.launcherX, this.state); requestAnimationFrame(this.loop);
  }
}
