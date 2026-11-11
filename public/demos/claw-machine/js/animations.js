(function () {
  "use strict";
  function tween(from, to, duration, update, easing) {
    return new Promise(function (resolve) {
      var start = performance.now();
      function frame(now) {
        var progress = Math.min(1, (now - start) / Math.max(1, duration));
        var value = easing ? easing(progress) : progress;
        update(from + (to - from) * value);
        if (progress < 1) requestAnimationFrame(frame); else resolve();
      }
      requestAnimationFrame(frame);
    });
  }

  function confetti(canvas) {
    var ctx = canvas.getContext("2d"); if (!ctx) return;
    var rect = canvas.getBoundingClientRect(); var ratio = Math.min(2, devicePixelRatio || 1);
    canvas.width = rect.width * ratio; canvas.height = rect.height * ratio; ctx.scale(ratio, ratio);
    var colors = ["#ff4da6", "#ffd84d", "#4de9ff", "#7c4dff", "#ffffff"];
    var pieces = Array.from({ length: 75 }, function () { return { x: Math.random()*rect.width, y: -20-Math.random()*rect.height*.5, vx: Math.random()*2-1, vy: 2+Math.random()*3, r: 2+Math.random()*5, c: colors[Math.floor(Math.random()*colors.length)], a: Math.random()*6 }; });
    var start = performance.now();
    function draw(now) {
      ctx.clearRect(0,0,rect.width,rect.height);
      pieces.forEach(function(p){ p.x+=p.vx; p.y+=p.vy; p.a+=.1; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.a); ctx.fillStyle=p.c; ctx.fillRect(-p.r,-p.r,p.r*2,p.r); ctx.restore(); });
      if (now - start < 2600) requestAnimationFrame(draw); else ctx.clearRect(0,0,rect.width,rect.height);
    }
    requestAnimationFrame(draw);
  }

  window.GameAnimations = { tween: tween, ease: function (t) { return 1 - Math.pow(1 - t, 3); }, confetti: confetti, wait: function(ms){ return new Promise(function(r){ setTimeout(r, ms); }); } };
}());
