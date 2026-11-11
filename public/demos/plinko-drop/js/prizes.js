import { LIMIT_CONFIG, PRIZE_CONFIG } from './config.js';
import { weightedRandom } from './randomizer.js';

export function availablePrizes(stats) {
  return PRIZE_CONFIG.filter((prize) => {
    if (prize.category === 'legendary') return (stats.legendaryWins || 0) < LIMIT_CONFIG.maxLegendaryWinsPerDemo;
    if (prize.category === 'epic') return (stats.epicWins || 0) < LIMIT_CONFIG.maxEpicWinsPerDemo;
    return true;
  });
}

export function selectWeightedPrize(stats) { return weightedRandom(availablePrizes(stats)); }
export function prizeForSlot(slot) { return PRIZE_CONFIG[Math.max(0, Math.min(PRIZE_CONFIG.length - 1, slot))]; }
export function rarityLabel(category) {
  return ({ common: 'COMMON', uncommon: 'UNCOMMON', rare: 'RARE', epic: 'EPIC', legendary: 'LEGENDARY' })[category] || 'PRIZE';
}
