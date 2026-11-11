(function () {
  "use strict";
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

  window.Collision = {
    closestPrize: function (clawX, prizes) {
      var best = null; var bestDistance = Infinity;
      prizes.forEach(function (prize) {
        if (!prize.element || !prize.element.isConnected) return;
        var distance = Math.abs(clawX - prize.x);
        if (distance < bestDistance) { bestDistance = distance; best = prize; }
      });
      return best ? { prize: best, distance: bestDistance } : null;
    },
    evaluateGrab: function (match) {
      if (!match) return { success: false, chance: 0, reason: "no_prize" };

      var config = GAME_CONFIG.claw;
      var radius = Math.max(5, config.grabRadius / 5);
      if (match.distance > radius) return { success: false, chance: 0, reason: "out_of_range" };

      // Akurasi bernilai 1 ketika capit tepat di tengah, lalu turun menuju 0
      // ketika posisi mendekati batas grabRadius.
      var accuracy = clamp(1 - (match.distance / radius), 0, 1);
      var difficulty = clamp(Number(match.prize.difficulty) || 0, 0, 1);
      var effectiveDifficulty = clamp(difficulty * config.difficultyMultiplier, 0, .98);
      var grip = clamp(config.gripStrength, 0, 1);
      var positionBonus = accuracy * config.perfectGrabBonus;
      var chance;

      if (GAME_CONFIG.winMode === "probability") {
        chance = GAME_CONFIG.winProbability * grip * (1 - effectiveDifficulty) + positionBonus;
      } else {
        // Skill mode tetap membutuhkan posisi tepat, namun bobot/tingkat
        // kesulitan hadiah menentukan apakah capit mampu mempertahankan grip.
        chance = grip * (1 - effectiveDifficulty) + positionBonus;
      }

      chance = clamp(chance, config.minWinChance, config.maxWinChance);
      return {
        success: Math.random() <= chance,
        chance: chance,
        accuracy: accuracy,
        difficulty: difficulty,
        reason: "grip_check"
      };
    },
    isSuccessful: function (match) {
      return this.evaluateGrab(match).success;
    }
  };
}());
