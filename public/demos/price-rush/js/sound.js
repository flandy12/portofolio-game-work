export class SoundManager {
  constructor(enabled = true) {
    this.enabled = enabled;
    this.context = null;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  async unlock() {
    if (!this.enabled) return;
    this.context ??= new (window.AudioContext || window.webkitAudioContext)();
    if (this.context.state === "suspended") await this.context.resume();
  }

  tone(frequency, duration = 0.1, type = "sine", delay = 0) {
    if (!this.enabled || !this.context) return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const start = this.context.currentTime + delay;
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.12, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(this.context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  play(name) {
    const patterns = {
      click: [[330, 0.06, "sine", 0]],
      countdown: [[460, 0.12, "square", 0]],
      start: [[520, 0.1, "sine", 0], [660, 0.1, "sine", 0.11], [880, 0.18, "sine", 0.22]],
      correct: [[660, 0.1, "sine", 0], [880, 0.2, "sine", 0.1]],
      wrong: [[190, 0.14, "sawtooth", 0], [150, 0.18, "sawtooth", 0.12]],
      timeout: [[240, 0.12, "square", 0], [180, 0.2, "square", 0.14]],
      complete: [[523, 0.12, "sine", 0], [659, 0.12, "sine", 0.13], [784, 0.25, "sine", 0.26]]
    };
    (patterns[name] || []).forEach((args) => this.tone(...args));
  }
}
