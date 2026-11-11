export function setupControls(game) {
  const left = document.querySelector('#left-button'), right = document.querySelector('#right-button'), drop = document.querySelector('#drop-button');
  let holdTimer = null;
  const stop = () => { if (holdTimer) cancelAnimationFrame(holdTimer); holdTimer = null; };
  const move = (direction) => { game.moveLauncher(direction); holdTimer = requestAnimationFrame(() => move(direction)); };
  for (const [button, direction] of [[left, -1], [right, 1]]) {
    button.addEventListener('pointerdown', (event) => { event.preventDefault(); stop(); move(direction); });
    button.addEventListener('pointerup', stop); button.addEventListener('pointerleave', stop); button.addEventListener('pointercancel', stop);
  }
  drop.addEventListener('click', () => game.drop());
  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); game.moveLauncher(-1, 16); }
    if (event.key === 'ArrowRight') { event.preventDefault(); game.moveLauncher(1, 16); }
    if (event.code === 'Space' && !event.repeat) { event.preventDefault(); game.drop(); }
  });

  const canvas = document.querySelector('#game-canvas'); let dragging = false;
  const aim = (event) => { if (!dragging) return; const point = game.board.pointerToBoard(event.clientX, event.clientY); game.setLauncher(point.x); };
  canvas.addEventListener('pointerdown', (event) => { dragging = true; canvas.setPointerCapture(event.pointerId); aim(event); });
  canvas.addEventListener('pointermove', aim);
  canvas.addEventListener('pointerup', () => { dragging = false; });
  canvas.addEventListener('pointercancel', () => { dragging = false; });
}
