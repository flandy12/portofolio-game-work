export const GAME_CONFIG = Object.freeze({
  gameTitle: "Price Rush",
  countdownDuration: 3,
  answerFeedbackDuration: 1350,
  optionsPerQuestion: 4,
  baseScore: 100,
  maxSpeedBonus: 100,
  enableSound: true,
  enableAnimations: true,
  autoNextQuestion: true,
  allowReplay: true,
  storageKeys: {
    bestScore: "priceRushBestScore",
    sound: "priceRushSoundEnabled",
    lastResult: "priceRushLastResult"
  },
  difficulty: {
    easy: { label: "Easy", questions: 5, duration: 15, variation: [0.25, 0.5] },
    medium: { label: "Medium", questions: 10, duration: 10, variation: [0.1, 0.3] },
    hard: { label: "Hard", questions: 10, duration: 7, variation: [0.05, 0.15] }
  }
});
