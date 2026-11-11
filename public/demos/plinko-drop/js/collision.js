import { randomBetween } from './randomizer.js';

export function resolveCircleCollision(ball, peg, jitterStrength = 0) {
  const dx = ball.x - peg.x;
  const dy = ball.y - peg.y;
  const minDistance = ball.radius + peg.radius;
  const distanceSq = dx * dx + dy * dy;
  if (distanceSq >= minDistance * minDistance) return false;

  const distance = Math.sqrt(distanceSq) || 0.001;
  const nx = dx / distance;
  const ny = dy / distance;
  const overlap = minDistance - distance + 0.25;
  ball.x += nx * overlap;
  ball.y += ny * overlap;

  const alongNormal = ball.vx * nx + ball.vy * ny;
  if (alongNormal < 0) {
    const impulse = -(1 + ball.restitution) * alongNormal;
    const jitter = jitterStrength > 0 ? randomBetween(-jitterStrength, jitterStrength) : 0;
    ball.vx += impulse * nx + jitter;
    ball.vy += impulse * ny;
  }
  return true;
}

export function clampBallToWalls(ball, left, right) {
  if (ball.x - ball.radius < left) {
    ball.x = left + ball.radius;
    ball.vx = Math.abs(ball.vx) * ball.restitution;
  } else if (ball.x + ball.radius > right) {
    ball.x = right - ball.radius;
    ball.vx = -Math.abs(ball.vx) * ball.restitution;
  }
}
