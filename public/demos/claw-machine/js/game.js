(function () {
  "use strict";
  window.ClawGame = {
    state: GAME_STATE.WELCOME, data: GameStorage.load(), attempts: GAME_CONFIG.maxAttempts,
    timeLeft: GAME_CONFIG.duration, prizes: [], timerId: null, nodes: {}, claw: null, controls: null,

    init: function (nodes) {
      this.nodes=nodes; this.claw=new ClawController({assembly:nodes.clawAssembly,claw:nodes.claw,machine:nodes.machine});
      this.controls=new ControlManager(this,nodes); this.controls.disable(true); this.syncSound();
      document.documentElement.style.setProperty("--primary", GAME_CONFIG.theme.primary);
      document.documentElement.style.setProperty("--secondary", GAME_CONFIG.theme.secondary);
      nodes.timerCard.hidden=!GAME_CONFIG.showTimer; nodes.modeValue.textContent=GAME_CONFIG.winMode.toUpperCase()+" MODE";
    },
    start: function () {
      clearInterval(this.timerId); this.state=GAME_STATE.READY; this.attempts=GAME_CONFIG.maxAttempts; this.timeLeft=GAME_CONFIG.duration;
      this.data.stats.games+=1; this.prizes=PrizeSystem.populate(this.nodes.prizeField,this.data); GameStorage.save(this.data);
      this.nodes.welcomeScreen.hidden=true; this.nodes.gameScreen.hidden=false; this.nodes.resultDialog.close && this.nodes.resultDialog.open && this.nodes.resultDialog.close();
      this.claw.reset(); this.controls.disable(false); this.updateStatus(); this.message("Pilih posisi yang tepat!");
      var self=this; this.timerId=setInterval(function(){ if ([GAME_STATE.READY,GAME_STATE.MOVING].includes(self.state)){ self.timeLeft-=1; self.updateStatus(); if(self.timeLeft<=0) self.finish(false,true); } },1000);
      this.nodes.machine.focus({preventScroll:true});
    },
    canControl: function () { return this.state===GAME_STATE.READY || this.state===GAME_STATE.MOVING; },
    move: function (direction,delta) { if(!this.canControl())return; this.state=GAME_STATE.MOVING; this.claw.move(direction,delta); if(Math.random()<.05)GameAudio.move(); },
    drop: async function () {
      if(!this.canControl())return; this.state=GAME_STATE.DROPPING; this.controls.disable(true); this.claw.nodes.assembly.classList.remove("idle"); this.claw.open(); this.message("Capit turun..."); GameAudio.drop();
      await this.claw.dropDown(); this.state=GAME_STATE.GRABBING; this.claw.close(); await GameAnimations.wait(330);
      var match=Collision.closestPrize(this.claw.x,this.prizes); var grabResult=Collision.evaluateGrab(match); var success=grabResult.success;
      // Hadiah yang berada dalam jangkauan sempat terangkat. Jika grip gagal,
      // hadiah akan terlepas di tengah jalan agar tingkat kesulitan terasa nyata.
      var caughtPrize=match&&grabResult.reason==="grip_check"?match.prize:null;
      if(caughtPrize){ this.claw.heldPrize=caughtPrize; caughtPrize.element.classList.add("attached"); }
      this.state=GAME_STATE.LIFTING;
      if(caughtPrize&&!success){
        var partialLift=Math.max(80,this.claw.drop*.56); var self=this;
        await GameAnimations.tween(this.claw.drop,partialLift,420,function(v){self.claw.drop=v;self.claw.render();},GameAnimations.ease);
        this.message("Hadiah terlepas! Grip capit kurang kuat."); this.claw.open(); caughtPrize.element.classList.remove("attached"); this.claw.heldPrize=null;
        caughtPrize.element.style.left=caughtPrize.x+"%"; caughtPrize.element.style.top=caughtPrize.y+"%";
        if(typeof caughtPrize.element.animate==="function") caughtPrize.element.animate([{transform:"translate(-50%, -180%) rotate("+caughtPrize.rotation+"deg)"},{transform:"translate(-50%, -50%) rotate("+caughtPrize.rotation+"deg)"}],{duration:480,easing:"cubic-bezier(.2,.8,.35,1)"});
        await GameAnimations.wait(260); this.claw.close();
      }
      await this.claw.lift(); this.data.stats.attempts+=1;
      if(success){ GameAudio.grab(); this.message("Dapat! Bawa ke chute!"); this.state=GAME_STATE.DELIVERING; await this.claw.deliver(); this.state=GAME_STATE.RELEASING; this.claw.open(); match.prize.element.classList.remove("attached"); match.prize.element.classList.add("falling"); await GameAnimations.wait(560); match.prize.element.remove(); this.claw.heldPrize=null; PrizeSystem.decrement(this.data,match.prize); this.data.stats.wins+=1; GameStorage.save(this.data); this.finish(true,false,match.prize); }
      else { this.attempts-=1; GameAudio.fail(); this.nodes.machine.classList.add("shake"); setTimeout(()=>this.nodes.machine.classList.remove("shake"),300); this.updateStatus(); await this.failAttempt(); }
    },
    failAttempt: async function () {
      if(this.attempts<=0){ this.finish(false,true); return; }
      this.state=GAME_STATE.LOSE; this.showResult(false,false); this.message("Hampir! Coba sekali lagi.");
    },
    retry: function () { this.nodes.resultDialog.close(); this.claw.reset(); this.state=GAME_STATE.READY; this.controls.disable(false); this.nodes.machine.focus({preventScroll:true}); },
    finish: function (won,gameOver,prize) { clearInterval(this.timerId); this.state=won?GAME_STATE.WIN:GAME_STATE.GAME_OVER; this.controls.disable(true); GameStorage.save(this.data); this.showResult(won,gameOver,prize); },
    showResult: function (won,gameOver,prize) {
      var n=this.nodes; n.resultEyebrow.textContent=won?"KAMU MENANG!":(gameOver?"GAME OVER":"BELUM BERHASIL"); n.resultTitle.textContent=won?"Luar biasa!":(gameOver?"Coba lagi, ya!":"Sedikit lagi!");
      n.resultText.textContent=won?"Hadiah berhasil masuk ke prize chute.":(gameOver?"Kesempatan atau waktumu sudah habis.":"Posisikan capit lebih dekat ke tengah hadiah.");
      n.resultIcon.textContent=won?"✨":"🕹️"; n.wonPrize.hidden=!won;
      if(won&&prize){ n.wonPrizeIcon.textContent=prize.icon; n.wonPrizeName.textContent=prize.name; }
      n.resultActionButton.textContent=won||gameOver?"Main Lagi":"Coba Lagi"; n.resultActionButton.dataset.action=won||gameOver?"restart":"retry";
      if(!n.resultDialog.open)n.resultDialog.showModal(); if(won){GameAudio.win();GameAnimations.confetti(n.confettiCanvas);}
    },
    updateStatus: function () { this.nodes.timerValue.textContent=String(Math.max(0,this.timeLeft)).padStart(2,"0"); this.nodes.attemptsValue.textContent=this.attempts; this.nodes.timerCard.classList.toggle("danger",this.timeLeft<=10); },
    message: function (text) { this.nodes.messageBubble.textContent=text; },
    toggleSound: function () { this.data.soundEnabled=!this.data.soundEnabled; GameStorage.save(this.data); this.syncSound(); },
    syncSound: function () { var enabled=this.data.soundEnabled; this.nodes.soundButton.textContent=enabled?"♪":"×"; this.nodes.soundButton.setAttribute("aria-pressed",String(enabled)); this.nodes.soundButton.setAttribute("aria-label",enabled?"Matikan suara":"Nyalakan suara"); }
  };
}());
