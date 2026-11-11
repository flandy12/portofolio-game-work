(function () {
  "use strict";
  var KEY = "clawMachineData.v1";
  var defaults = { soundEnabled: GAME_CONFIG.soundEnabled, inventory: {}, wins: [], stats: { games: 0, attempts: 0, wins: 0 } };

  function clean(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return structuredClone(defaults);
    var inventory = {};
    if (raw.inventory && typeof raw.inventory === "object") {
      Object.keys(raw.inventory).slice(0, 50).forEach(function (id) {
        var value = Number(raw.inventory[id]);
        if (/^[a-z0-9-]{1,40}$/i.test(id) && Number.isInteger(value) && value >= 0 && value <= 999) inventory[id] = value;
      });
    }
    var stats = raw.stats || {};
    return {
      soundEnabled: typeof raw.soundEnabled === "boolean" ? raw.soundEnabled : defaults.soundEnabled,
      inventory: inventory,
      wins: Array.isArray(raw.wins) ? raw.wins.slice(-30).filter(function (item) { return item && typeof item.prizeId === "string"; }) : [],
      stats: {
        games: Math.max(0, Number.parseInt(stats.games, 10) || 0),
        attempts: Math.max(0, Number.parseInt(stats.attempts, 10) || 0),
        wins: Math.max(0, Number.parseInt(stats.wins, 10) || 0)
      }
    };
  }

  window.GameStorage = {
    load: function () {
      try { return clean(JSON.parse(localStorage.getItem(KEY))); }
      catch (error) { return structuredClone(defaults); }
    },
    save: function (data) {
      try { localStorage.setItem(KEY, JSON.stringify(clean(data))); return true; }
      catch (error) { return false; }
    },
    reset: function () { try { localStorage.removeItem(KEY); return true; } catch (error) { return false; } }
  };
}());
