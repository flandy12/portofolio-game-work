export const DIFFICULTIES = Object.freeze({
  easy: { label: 'Easy', speed: 320, timeLimit: 12, targetWidth: 10 },
  medium: { label: 'Medium', speed: 520, timeLimit: 10, targetWidth: 6 },
  hard: { label: 'Hard', speed: 760, timeLimit: 8, targetWidth: 4 },
  extreme: { label: 'Extreme', speed: 1000, timeLimit: 7, targetWidth: 2 },
});

export const RESULTS = Object.freeze([
  { max: 0.5, name: 'PERFECT', score: 100, reward: 'Main Product', color: '#78f9e3' },
  { max: 1.5, name: 'EXCELLENT', score: 80, reward: 'Merchandise Pack', color: '#83a7ff' },
  { max: 3, name: 'GREAT', score: 60, reward: 'Discount Voucher', color: '#b98cff' },
  { max: 5, name: 'GOOD', score: 40, reward: 'Consolation Prize', color: '#ffd36a' },
  { max: Infinity, name: 'MISS', score: 0, reward: 'Coba lagi di ronde berikutnya', color: '#ff6a8b' },
]);

export const GAME = Object.freeze({
  attempts: 3,
  productWidth: 108,
  countdownSeconds: 3,
  travelRatio: 0.56,
});

export function getPrecisionResult(errorPercentage) {
  const error = Number.isFinite(errorPercentage) ? Math.max(0, errorPercentage) : Infinity;
  return RESULTS.find((result) => error <= result.max) ?? RESULTS.at(-1);
}

