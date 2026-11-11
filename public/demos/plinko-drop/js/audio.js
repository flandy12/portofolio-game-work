export class GameAudio {
  constructor(enabled = true) { this.enabled = enabled; this.context = null; this.lastPeg = 0; }
  setEnabled(value) { this.enabled = Boolean(value); }
  async unlock() {
    if (!this.context) this.context = new (window.AudioContext || window.webkitAudioContext)();
    if (this.context.state === 'suspended') await this.context.resume();
  }
  tone(frequency, duration = 0.08, type = 'sine', volume = 0.05, delay = 0) {
    if (!this.enabled || !this.context) return;
    const start = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(this.context.destination);
    oscillator.start(start); oscillator.stop(start + duration);
  }
  peg() { const now = performance.now(); if (now - this.lastPeg > 42) { this.tone(420 + (now % 180), 0.045, 'sine', 0.025); this.lastPeg = now; } }
  drop() { this.tone(210, 0.12, 'triangle', 0.06); }
  prize(points) {
    const base = points >= 500 ? 520 : points >= 100 ? 420 : 330;
    [0, 4, 7, 12].forEach((offset, index) => this.tone(base * Math.pow(2, offset / 12), 0.22, 'sine', 0.055, index * 0.075));
  }
}
