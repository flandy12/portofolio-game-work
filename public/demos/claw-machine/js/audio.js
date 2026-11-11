(function () {
  "use strict";
  var context = null;
  function tone(frequency, duration, type, volume) {
    if (!window.ClawGame || !ClawGame.data.soundEnabled) return;
    try {
      context = context || new (window.AudioContext || window.webkitAudioContext)();
      var oscillator = context.createOscillator();
      var gain = context.createGain();
      oscillator.type = type || "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(volume || .035, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(); oscillator.stop(context.currentTime + duration);
    } catch (error) { /* Audio is optional. */ }
  }
  window.GameAudio = {
    move: function () { tone(170, .05, "square", .015); },
    drop: function () { tone(280, .16, "sawtooth", .025); },
    grab: function () { tone(430, .2, "triangle", .035); },
    fail: function () { tone(115, .35, "sawtooth", .025); },
    win: function () { [523,659,784,1047].forEach(function (f, i) { setTimeout(function(){ tone(f, .28, "triangle", .04); }, i * 100); }); }
  };
}());
