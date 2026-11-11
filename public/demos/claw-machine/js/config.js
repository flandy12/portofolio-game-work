(function () {
  "use strict";
  window.GAME_CONFIG = Object.freeze({
    gameTitle: "Claw Machine Digital",
    duration: 60,
    maxAttempts: 3,
    claw: {
      speed: 250,
      dropSpeed: 350,
      liftSpeed: 300,
      grabRadius: 35,

      // 0.0 = sangat lemah, 1.0 = sangat kuat.
      gripStrength: 0.58,

      // Semakin besar nilainya, semakin sulit seluruh hadiah ditangkap.
      difficultyMultiplier: 1.15,

      // Bonus peluang saat capit tepat berada di tengah hadiah.
      perfectGrabBonus: 0.22,

      // Batas peluang agar hasil tetap dapat dikontrol dan dites.
      minWinChance: 0.04,
      maxWinChance: 0.88
    },
    prizes: { quantity: 10, randomPosition: true },
    winMode: "skill",
    winProbability: 0.5,
    soundEnabled: true,
    showTimer: true,
    theme: { primary: "#FF4DA6", secondary: "#7C4DFF", background: "#17112D" }
  });

  window.GAME_STATE = Object.freeze({
    WELCOME: "welcome", READY: "ready", MOVING: "moving", DROPPING: "dropping",
    GRABBING: "grabbing", LIFTING: "lifting", DELIVERING: "delivering",
    RELEASING: "releasing", WIN: "win", LOSE: "lose", GAME_OVER: "game_over"
  });
}());
