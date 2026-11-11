import { clampBallToWalls, resolveCircleCollision } from './collision.js';
import { randomBetween } from './randomizer.js';

export function stepPhysics(ball, pegs, dt, board, targetSlot = null) {
  const speedBefore = Math.hypot(ball.vx, ball.vy);
  ball.vy += ball.profile.gravity * dt;

  // Weighted mode is explicitly disclosed. A soft guide keeps the physical animation consistent
  // with the single prize selected before the drop; no result is rerolled during animation.
  if (Number.isInteger(targetSlot) && ball.y > 220) {
    const slotWidth = board.width / board.slotCount;
    const targetX = (targetSlot + 0.5) * slotWidth;
    const progress = Math.min(1, Math.max(0, (ball.y - 220) / 430));
    const desiredVX = Math.max(-1_250, Math.min(1_250, (targetX - ball.x) * (6 + progress * 18)));
    const correctionRate = 5 + progress * progress * 120;
    ball.vx += (desiredVX - ball.vx) * Math.min(1, correctionRate * dt);
    if (ball.y > 560 && Math.abs(targetX - ball.x) > slotWidth * .28) ball.vy = Math.min(ball.vy * .96, 140);
  }

  const damping = Math.exp(-ball.frictionAir * dt);
  ball.vx *= damping;
  ball.vy *= damping;
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;
  ball.rotation += ball.angularVelocity;
  clampBallToWalls(ball, 22, board.width - 22);

  let collision = null;
  const now = performance.now();
  for (const peg of pegs) {
    const canJitter = peg.id !== ball.lastPegId || now - ball.lastCollisionAt > 80;
    const jitterStrength = canJitter ? ball.profile.collisionJitter : 0;
    if (resolveCircleCollision(ball, peg, jitterStrength)) {
      peg.pulse = 1;
      collision = peg;
      ball.lastPegId = peg.id;
      ball.lastCollisionAt = now;
      break;
    }
  }

  const speedAfter = Math.hypot(ball.vx, ball.vy);
  if (ball.y < board.height - 100 && speedAfter < 24 && speedBefore < 24) ball.stuckFor += dt;
  else ball.stuckFor = 0;
  if (ball.stuckFor > 0.7) {
    ball.vx += randomBetween(-80, 80);
    ball.vy += 70;
    ball.stuckFor = 0;
  }
  return collision;
}

export function getSlotIndex(ballX, boardLeft, slotWidth, slotCount) {
  const index = Math.floor((ballX - boardLeft) / slotWidth);
  return Math.max(0, Math.min(index, slotCount - 1));
}
