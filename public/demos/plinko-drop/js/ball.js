export function createBall(x, y, radius, profile, random) {
  return {
    x, y, radius,
    vx: random.vx,
    vy: 20,
    rotation: 0,
    angularVelocity: random.angularVelocity,
    restitution: random.restitution,
    frictionAir: random.frictionAir,
    trail: [],
    resolved: false,
    lastPegId: null,
    lastCollisionAt: 0,
    createdAt: performance.now(),
    stuckFor: 0,
    profile
  };
}

export function recordTrail(ball) {
  ball.trail.push({ x: ball.x, y: ball.y, alpha: 1 });
  if (ball.trail.length > 18) ball.trail.shift();
  ball.trail.forEach((point, index) => { point.alpha = (index + 1) / ball.trail.length * 0.38; });
}
