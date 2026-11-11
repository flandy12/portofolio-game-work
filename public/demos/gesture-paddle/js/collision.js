export function circleRectCollision(ball, rect) {
  const closestX = Math.max(rect.x, Math.min(ball.x, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(ball.y, rect.y + rect.height));
  const dx = ball.x - closestX;
  const dy = ball.y - closestY;
  return dx * dx + dy * dy <= ball.radius * ball.radius;
}

export function resolveBrickBounce(ball, brick) {
  const overlapLeft = ball.x + ball.radius - brick.x;
  const overlapRight = brick.x + brick.width - (ball.x - ball.radius);
  const overlapTop = ball.y + ball.radius - brick.y;
  const overlapBottom = brick.y + brick.height - (ball.y - ball.radius);
  const minX = Math.min(overlapLeft, overlapRight);
  const minY = Math.min(overlapTop, overlapBottom);
  if (minX < minY) ball.vx *= -1;
  else ball.vy *= -1;
}

export function paddleBounce(ball, paddle) {
  const relative = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
  const speed = Math.hypot(ball.vx, ball.vy);
  const angle = relative * Math.PI * .38;
  ball.vx = speed * Math.sin(angle);
  ball.vy = -Math.abs(speed * Math.cos(angle));
  ball.y = paddle.y - ball.radius - 1;
}
