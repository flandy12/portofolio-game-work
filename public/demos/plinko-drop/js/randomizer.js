export function secureRandom() {
  const values = new Uint32Array(1);
  globalThis.crypto.getRandomValues(values);
  return values[0] / 4294967296;
}

export function randomBetween(min, max) {
  if (!Number.isFinite(min) || !Number.isFinite(max) || max < min) throw new TypeError('Rentang acak tidak valid.');
  return min + secureRandom() * (max - min);
}

export function randomSign() { return secureRandom() < 0.5 ? -1 : 1; }

export function weightedRandom(items) {
  if (!Array.isArray(items) || items.length === 0) throw new TypeError('Daftar hadiah kosong.');
  const total = items.reduce((sum, item) => sum + (Number.isFinite(item.weight) && item.weight > 0 ? item.weight : 0), 0);
  if (total <= 0) throw new Error('Bobot hadiah tidak valid.');
  const target = secureRandom() * total;
  let cumulative = 0;
  for (const item of items) {
    cumulative += Math.max(0, item.weight);
    if (target < cumulative) return item;
  }
  return items[items.length - 1];
}
