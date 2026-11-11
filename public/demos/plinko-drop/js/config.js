export const GAME_CONFIG = Object.freeze({
  title: 'Plinko Drop Digital',
  game: { maxBalls: 5, duration: 90, mode: 'physics', difficulty: 'normal' },
  board: { width: 840, height: 760, rows: 10, pegSpacing: 64, pegRadius: 7, ballRadius: 12, slotCount: 7 },
  animation: { targetFPS: 60, showTrail: true, particles: true, bounceEffect: true },
  randomization: { enabled: true, initialOffset: 8, randomImpulse: true, dynamicPhysics: true },
  audio: { enabled: true, backgroundMusic: false, pegCollision: true, winSound: true }
});

export const GAME_STATE = Object.freeze({
  WELCOME: 'welcome', READY: 'ready', AIMING: 'aiming', DROPPING: 'dropping',
  BOUNCING: 'bouncing', RESULT: 'result', FINISHED: 'finished'
});

export const DIFFICULTY_PROFILES = Object.freeze({
  easy:   { gravity: 900, restitution: [0.44, 0.53], frictionAir: [0.09, 0.12], initialVX: 24, collisionJitter: 6 },
  normal: { gravity: 980, restitution: [0.48, 0.61], frictionAir: [0.055, 0.085], initialVX: 45, collisionJitter: 12 },
  hard:   { gravity: 1040, restitution: [0.51, 0.67], frictionAir: [0.035, 0.065], initialVX: 72, collisionJitter: 20 }
});

export const PRIZE_CONFIG = Object.freeze([
  { slot: 0, label: '10', points: 10, weight: 25, category: 'common', color: '#20d9ff' },
  { slot: 1, label: '25', points: 25, weight: 25, category: 'common', color: '#49eea8' },
  { slot: 2, label: '50', points: 50, weight: 20, category: 'common', color: '#b5f354' },
  { slot: 3, label: '100', points: 100, weight: 15, category: 'uncommon', color: '#ffe45b' },
  { slot: 4, label: '250', points: 250, weight: 10, category: 'rare', color: '#ff9b4a' },
  { slot: 5, label: '500', points: 500, weight: 4, category: 'epic', color: '#ff5daf' },
  { slot: 6, label: '1000', points: 1000, weight: 1, category: 'legendary', color: '#ae73ff' }
]);

export const LIMIT_CONFIG = Object.freeze({ maxLegendaryWinsPerDemo: 1, maxEpicWinsPerDemo: 3, resetOnNewDemo: false });
