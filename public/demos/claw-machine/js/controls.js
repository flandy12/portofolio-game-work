(function () {
  "use strict";
  window.ControlManager = function (game, nodes) {
    var held = { left: false, right: false }; var last = performance.now();
    function set(direction, value) { held[direction] = value; nodes[direction + "Button"].classList.toggle("is-pressed", value); }
    function bindHold(button, direction) {
      button.addEventListener("pointerdown", function(e){ e.preventDefault(); button.setPointerCapture(e.pointerId); set(direction, true); });
      ["pointerup","pointercancel","lostpointercapture"].forEach(function(type){ button.addEventListener(type, function(){ set(direction, false); }); });
    }
    bindHold(nodes.leftButton, "left"); bindHold(nodes.rightButton, "right");
    nodes.dropButton.addEventListener("click", function(){ game.drop(); });
    window.addEventListener("keydown", function(e){
      if (["ArrowLeft","ArrowRight","Space"].includes(e.code)) e.preventDefault();
      if (e.repeat && e.code === "Space") return;
      if (e.code === "ArrowLeft" || e.code === "KeyA") set("left", true);
      if (e.code === "ArrowRight" || e.code === "KeyD") set("right", true);
      if (e.code === "Space") game.drop();
    });
    window.addEventListener("keyup", function(e){ if (e.code === "ArrowLeft" || e.code === "KeyA") set("left", false); if (e.code === "ArrowRight" || e.code === "KeyD") set("right", false); });
    function loop(now) {
      var delta = Math.min(.04, (now-last)/1000); last=now;
      if (game.canControl()) { if (held.left) game.move(-1,delta); if (held.right) game.move(1,delta); }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    this.disable = function(value){ nodes.leftButton.disabled=value; nodes.rightButton.disabled=value; nodes.dropButton.disabled=value; if(value){set("left",false);set("right",false);} };
  };
}());
