(function () {
  "use strict";
  window.ClawController = function (nodes) {
    this.nodes = nodes; this.x = 50; this.drop = 0; this.heldPrize = null;
  };
  ClawController.prototype.render = function () {
    this.nodes.assembly.style.setProperty("--x", this.x + "%");
    this.nodes.assembly.style.setProperty("--drop", this.drop + "px");
    if (this.heldPrize) {
      this.heldPrize.element.style.left = this.x + "%";
      this.heldPrize.element.style.top = Math.min(83, 14 + this.drop / Math.max(1, this.nodes.machine.clientHeight) * 100) + "%";
    }
  };
  ClawController.prototype.reset = function () { this.x = 50; this.drop = 0; this.heldPrize = null; this.nodes.claw.className = "claw"; this.nodes.assembly.classList.add("idle"); this.render(); };
  ClawController.prototype.move = function (direction, deltaSeconds) { this.x = Math.max(12, Math.min(91, this.x + direction * GAME_CONFIG.claw.speed * deltaSeconds / 7)); this.render(); };
  ClawController.prototype.open = function () { this.nodes.claw.className = "claw open"; };
  ClawController.prototype.close = function () { this.nodes.claw.className = "claw closed"; };
  ClawController.prototype.dropDown = function () { var target = Math.max(190, this.nodes.machine.clientHeight * .59); var self = this; return GameAnimations.tween(this.drop, target, target / GAME_CONFIG.claw.dropSpeed * 1000, function(v){ self.drop=v; self.render(); }, GameAnimations.ease); };
  ClawController.prototype.lift = function () { var self = this; return GameAnimations.tween(this.drop, 0, Math.max(350, this.drop / GAME_CONFIG.claw.liftSpeed * 1000), function(v){ self.drop=v; self.render(); }, GameAnimations.ease); };
  ClawController.prototype.deliver = function () { var self = this; return GameAnimations.tween(this.x, 12, 900, function(v){ self.x=v; self.render(); }, GameAnimations.ease); };
}());
