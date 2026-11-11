export class GameUI {
  constructor() {
    this.welcome = document.querySelector('#welcome-screen'); this.game = document.querySelector('#game-screen');
    this.balls = document.querySelector('#balls-value'); this.score = document.querySelector('#score-value'); this.best = document.querySelector('#best-value');
    this.drops = document.querySelector('#drops-value'); this.difficulty = document.querySelector('#difficulty-value'); this.modeBadge = document.querySelector('#mode-badge');
    this.dropButton = document.querySelector('#drop-button'); this.resultFloat = document.querySelector('#result-float'); this.guide = document.querySelector('#drop-guide');
    this.positionFill = document.querySelector('#position-meter-fill');
  }
  showGame() { this.welcome.classList.remove('is-active'); this.game.classList.add('is-active'); }
  showWelcome() { this.game.classList.remove('is-active'); this.welcome.classList.add('is-active'); }
  updateHud({ balls, score, highScore, drops, difficulty, mode }) {
    this.balls.textContent = balls; this.score.textContent = String(score).padStart(4, '0'); this.best.textContent = String(highScore).padStart(4, '0');
    this.drops.textContent = drops; this.difficulty.textContent = difficulty.toUpperCase(); this.modeBadge.textContent = mode === 'physics' ? 'PURE PHYSICS' : 'WEIGHTED PRIZE';
    this.modeBadge.classList.toggle('weighted', mode === 'weighted');
  }
  updatePosition(percent) { this.positionFill.style.width = `${Math.round(percent * 100)}%`; }
  setDroppable(enabled) { this.dropButton.disabled = !enabled; this.guide.classList.toggle('is-hidden', !enabled); }
  showResult(prize, rarity) {
    this.resultFloat.innerHTML = `<small>${rarity}</small><strong>+${prize.points}</strong><span>POINTS</span>`;
    this.resultFloat.style.setProperty('--prize-color', prize.color); this.resultFloat.classList.remove('show'); void this.resultFloat.offsetWidth; this.resultFloat.classList.add('show');
  }
  hideResult() { this.resultFloat.classList.remove('show'); }
  showGameOver({ score, bestDrop, difficulty, isNewBest }) {
    document.querySelector('#final-score').textContent = score.toLocaleString('id-ID');
    document.querySelector('#best-drop').textContent = bestDrop.toLocaleString('id-ID');
    document.querySelector('#final-difficulty').textContent = difficulty[0].toUpperCase() + difficulty.slice(1);
    document.querySelector('#new-best').hidden = !isNewBest;
    const modal = document.querySelector('#game-over-modal'); modal.hidden = false; requestAnimationFrame(() => modal.classList.add('is-open'));
  }
  closeGameOver() { const modal = document.querySelector('#game-over-modal'); modal.classList.remove('is-open'); setTimeout(() => { modal.hidden = true; }, 250); }
}
