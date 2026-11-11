export class QuestionTimer {
  constructor(onTick, onComplete) {
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.intervalId = null;
    this.startedAt = 0;
    this.duration = 0;
    this.remaining = 0;
  }

  start(duration) {
    this.stop();
    this.duration = duration;
    this.remaining = duration;
    this.startedAt = performance.now();
    this.onTick(this.remaining, 1);
    this.intervalId = window.setInterval(() => {
      const elapsed = (performance.now() - this.startedAt) / 1000;
      this.remaining = Math.max(0, this.duration - elapsed);
      this.onTick(this.remaining, this.remaining / this.duration);
      if (this.remaining <= 0) {
        this.stop();
        this.onComplete();
      }
    }, 100);
  }

  stop() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    return this.remaining;
  }
}
