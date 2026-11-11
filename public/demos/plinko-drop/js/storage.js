const KEY = 'plinkoDropDataV1';
const DEFAULTS = Object.freeze({ sound: true, difficulty: 'normal', totalGames: 0, totalDrops: 0, totalWins: 0, highScore: 0, legendaryWins: 0, epicWins: 0 });

function sanitize(data) {
  const safe = { ...DEFAULTS };
  if (!data || typeof data !== 'object') return safe;
  safe.sound = data.sound !== false;
  safe.difficulty = ['easy', 'normal', 'hard'].includes(data.difficulty) ? data.difficulty : 'normal';
  for (const key of ['totalGames', 'totalDrops', 'totalWins', 'highScore', 'legendaryWins', 'epicWins']) {
    safe[key] = Number.isFinite(data[key]) ? Math.max(0, Math.floor(data[key])) : 0;
  }
  return safe;
}

export function loadData() {
  try { return sanitize(JSON.parse(localStorage.getItem(KEY))); } catch { return { ...DEFAULTS }; }
}
export function saveData(data) {
  const safe = sanitize(data);
  try { localStorage.setItem(KEY, JSON.stringify(safe)); } catch { /* storage may be disabled */ }
  return safe;
}
export function resetData() { try { localStorage.removeItem(KEY); } catch {} return { ...DEFAULTS }; }
