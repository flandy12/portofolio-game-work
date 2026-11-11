export const LEVELS = [
  { rows: 3, cols: 7, speed: 320, hp: 1, pattern: 'classic', colors: ['#77f5dc','#805cff','#e8ff62'] },
  { rows: 4, cols: 8, speed: 355, hp: 1, pattern: 'stagger', colors: ['#66d8ff','#a875ff','#ff79b0','#e8ff62'] },
  { rows: 5, cols: 9, speed: 405, hp: 1, pattern: 'wave', colors: ['#77f5dc','#3f92ff','#805cff','#ff4f8a'] },
  { rows: 5, cols: 9, speed: 445, hp: 2, pattern: 'fortress', colors: ['#e8ff62','#ff8a4c','#ff4f8a','#805cff'] },
  { rows: 6, cols: 10, speed: 510, hp: 3, pattern: 'reactor', colors: ['#77f5dc','#e8ff62','#ff4f8a','#805cff','#3f92ff'] }
];

export function createBricks(levelIndex, width) {
  const config = LEVELS[levelIndex];
  const gap = Math.max(5, width * 0.007);
  const margin = width * 0.075;
  const brickWidth = (width - margin * 2 - gap * (config.cols - 1)) / config.cols;
  const brickHeight = Math.max(18, width * 0.027);
  const top = width * 0.105;
  const bricks = [];

  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.cols; col++) {
      let active = true;
      if (config.pattern === 'wave') active = !(row === 0 && (col < 2 || col > config.cols - 3));
      if (config.pattern === 'fortress') active = !(row === 2 && col > 2 && col < config.cols - 3);
      if (config.pattern === 'reactor') active = !((row + col) % 5 === 0 && row > 0);
      if (!active) continue;
      const stagger = config.pattern === 'stagger' && row % 2 ? brickWidth * .28 : 0;
      const hp = levelIndex >= 3 ? Math.min(config.hp, 1 + ((row + col) % config.hp)) : 1;
      bricks.push({
        x: margin + col * (brickWidth + gap) + stagger,
        y: top + row * (brickHeight + gap),
        width: brickWidth - (stagger ? brickWidth * .07 : 0), height: brickHeight,
        hp, maxHp: hp, color: config.colors[row % config.colors.length], alive: true
      });
    }
  }
  return bricks;
}
