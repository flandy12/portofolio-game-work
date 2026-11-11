function secureRandom() {
  if (globalThis.crypto?.getRandomValues) {
    const value = new Uint32Array(1);
    globalThis.crypto.getRandomValues(value);
    return value[0] / 4294967296;
  }
  return Math.random();
}

export function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(secureRandom() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function generatePriceOptions(price, variation, count = 4) {
  const values = new Set([price]);
  const [minimum, maximum] = variation;
  const rounding = price >= 100000 ? 5000 : price >= 50000 ? 2500 : 500;
  let attempts = 0;

  while (values.size < count && attempts < 100) {
    attempts += 1;
    const percentage = minimum + secureRandom() * (maximum - minimum);
    const direction = secureRandom() > 0.5 ? 1 : -1;
    const candidate = Math.max(rounding, Math.round((price * (1 + direction * percentage)) / rounding) * rounding);
    if (candidate !== price) values.add(candidate);
  }

  let fallback = 1;
  while (values.size < count) {
    const candidate = price + rounding * fallback;
    if (candidate > 0 && candidate !== price) values.add(candidate);
    fallback += 1;
  }
  return shuffle([...values]);
}

export function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}
