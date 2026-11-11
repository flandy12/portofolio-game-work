export function createPegs(config) {
  const pegs = [];
  const { width, rows, pegSpacing, pegRadius } = config;
  const top = 142;
  const rowGap = 52;
  for (let row = 0; row < rows; row += 1) {
    const count = row % 2 === 0 ? 10 : 11;
    const totalWidth = (count - 1) * pegSpacing;
    const startX = (width - totalWidth) / 2;
    for (let col = 0; col < count; col += 1) {
      pegs.push({ id: `${row}-${col}`, x: startX + col * pegSpacing, y: top + row * rowGap, radius: pegRadius, pulse: 0 });
    }
  }
  return pegs;
}
