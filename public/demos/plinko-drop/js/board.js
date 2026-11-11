import { PRIZE_CONFIG } from './config.js';

function roundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath(); ctx.roundRect(x, y, w, h, radius); ctx.closePath();
}

export class BoardRenderer {
  constructor(canvas, config) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d', { alpha: false }); this.config = config;
    this.particles = []; this.activeSlot = -1; this.shake = 0;
  }
  resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.max(1, Math.round(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.round(rect.height * dpr));
    this.ctx.setTransform(this.canvas.width / this.config.width, 0, 0, this.canvas.height / this.config.height, 0, 0);
  }
  pointerToBoard(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    return { x: (clientX - rect.left) / rect.width * this.config.width, y: (clientY - rect.top) / rect.height * this.config.height };
  }
  burst(x, y, color, amount = 10) {
    for (let i = 0; i < amount; i += 1) {
      const angle = Math.PI * 2 * i / amount + Math.random() * 0.3;
      const speed = 35 + Math.random() * 100;
      this.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, color, size: 1.5 + Math.random() * 3 });
    }
  }
  confetti(color) {
    for (let i = 0; i < 80; i += 1) this.particles.push({ x: Math.random() * this.config.width, y: -Math.random() * 180, vx: -60 + Math.random() * 120, vy: 80 + Math.random() * 150, life: 2.4, color: i % 2 ? color : '#fff36b', size: 3 + Math.random() * 5, confetti: true });
  }
  updateParticles(dt) {
    for (const p of this.particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += (p.confetti ? 70 : 150) * dt; p.life -= dt * (p.confetti ? 0.45 : 1.7); }
    this.particles = this.particles.filter((p) => p.life > 0);
  }
  draw(pegs, ball, launcherX, state) {
    const ctx = this.ctx, { width, height, slotCount } = this.config;
    ctx.save();
    if (this.shake > 0) { ctx.translate((Math.random() - .5) * this.shake, (Math.random() - .5) * this.shake); this.shake *= .88; if (this.shake < .3) this.shake = 0; }
    const bg = ctx.createLinearGradient(0, 0, 0, height); bg.addColorStop(0, '#10152d'); bg.addColorStop(.6, '#080b1d'); bg.addColorStop(1, '#050713'); ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(97, 220, 255, .07)'; ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
    for (let y = 0; y < height; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }

    ctx.strokeStyle = 'rgba(95,232,255,.4)'; ctx.lineWidth = 2; ctx.shadowColor = '#35dcff'; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.moveTo(22, 108); ctx.lineTo(22, 690); ctx.moveTo(width - 22, 108); ctx.lineTo(width - 22, 690); ctx.stroke(); ctx.shadowBlur = 0;

    if (!ball) {
      ctx.setLineDash([4, 8]); ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.beginPath(); ctx.moveTo(launcherX, 44); ctx.lineTo(launcherX, 116); ctx.stroke(); ctx.setLineDash([]);
      this.drawBall(launcherX, 55, 13, 0, true);
    }

    for (const peg of pegs) {
      const glow = 8 + peg.pulse * 16; peg.pulse *= .86;
      ctx.shadowColor = '#50e6ff'; ctx.shadowBlur = glow; ctx.fillStyle = peg.pulse > .15 ? '#f1fdff' : '#72ecff';
      ctx.beginPath(); ctx.arc(peg.x, peg.y, peg.radius + peg.pulse * 2, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    }

    const slotWidth = width / slotCount;
    for (let i = 0; i < slotCount; i += 1) {
      const prize = PRIZE_CONFIG[i], x = i * slotWidth;
      ctx.strokeStyle = i === this.activeSlot ? prize.color : 'rgba(255,255,255,.14)'; ctx.lineWidth = i === this.activeSlot ? 3 : 1;
      ctx.beginPath(); ctx.moveTo(x, 665); ctx.lineTo(x, 735); ctx.stroke();
      ctx.fillStyle = i === this.activeSlot ? `${prize.color}38` : 'rgba(255,255,255,.035)'; roundedRect(ctx, x + 5, 688, slotWidth - 10, 54, 8); ctx.fill();
      ctx.font = '700 18px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = prize.color; ctx.shadowColor = i === this.activeSlot ? prize.color : 'transparent'; ctx.shadowBlur = 12; ctx.fillText(prize.label, x + slotWidth / 2, 721); ctx.shadowBlur = 0;
    }
    ctx.beginPath(); ctx.moveTo(width, 665); ctx.lineTo(width, 735); ctx.stroke();

    if (ball) {
      for (const point of ball.trail) { ctx.fillStyle = `rgba(255,97,185,${point.alpha})`; ctx.beginPath(); ctx.arc(point.x, point.y, ball.radius * point.alpha, 0, Math.PI * 2); ctx.fill(); }
      this.drawBall(ball.x, ball.y, ball.radius, ball.rotation, false);
    }
    for (const p of this.particles) { ctx.globalAlpha = Math.min(1, p.life); ctx.fillStyle = p.color; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.x * .02); ctx.fillRect(-p.size / 2, -p.size / 2, p.confetti ? p.size * 2 : p.size, p.size); ctx.restore(); }
    ctx.globalAlpha = 1; ctx.restore();
  }
  drawBall(x, y, radius, rotation, idle) {
    const ctx = this.ctx; ctx.save(); ctx.translate(x, y); ctx.rotate(rotation);
    ctx.shadowColor = '#ff45b7'; ctx.shadowBlur = idle ? 22 : 15;
    const grad = ctx.createRadialGradient(-radius * .35, -radius * .42, 1, 0, 0, radius * 1.2); grad.addColorStop(0, '#fff'); grad.addColorStop(.18, '#ffb8e6'); grad.addColorStop(.56, '#ff43b5'); grad.addColorStop(1, '#861154');
    ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1; ctx.stroke(); ctx.shadowBlur = 0; ctx.restore();
  }
}
