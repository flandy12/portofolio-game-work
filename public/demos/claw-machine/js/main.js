(function () {
  "use strict";
  function byId(id){ return document.getElementById(id); }
  var ids=["welcomeScreen","gameScreen","startButton","howToButton","resetDataButton","timerCard","timerValue","attemptsValue","soundButton","machine","clawAssembly","claw","prizeField","messageBubble","leftButton","dropButton","rightButton","modeValue","howToDialog","resultDialog","confettiCanvas","resultIcon","resultEyebrow","resultTitle","resultText","wonPrize","wonPrizeIcon","wonPrizeName","resultActionButton","backHomeButton","toast"];
  var nodes={}; ids.forEach(function(id){nodes[id]=byId(id);}); ClawGame.init(nodes);
  nodes.startButton.addEventListener("click",function(){ClawGame.start();});
  nodes.howToButton.addEventListener("click",function(){nodes.howToDialog.showModal();});
  document.querySelectorAll("[data-close-dialog]").forEach(function(button){button.addEventListener("click",function(){nodes.howToDialog.close();});});
  nodes.soundButton.addEventListener("click",function(){ClawGame.toggleSound();});
  nodes.resultActionButton.addEventListener("click",function(){if(this.dataset.action==="retry")ClawGame.retry();else ClawGame.start();});
  nodes.backHomeButton.addEventListener("click",function(){clearInterval(ClawGame.timerId);nodes.resultDialog.close();nodes.gameScreen.hidden=true;nodes.welcomeScreen.hidden=false;ClawGame.state=GAME_STATE.WELCOME;});
  nodes.resetDataButton.addEventListener("click",function(){GameStorage.reset();ClawGame.data=GameStorage.load();ClawGame.syncSound();nodes.toast.textContent="Data demo berhasil direset";nodes.toast.classList.add("visible");setTimeout(function(){nodes.toast.classList.remove("visible");},2200);});
  [nodes.howToDialog,nodes.resultDialog].forEach(function(dialog){dialog.addEventListener("cancel",function(event){if(dialog===nodes.resultDialog){event.preventDefault();}});});
}());
