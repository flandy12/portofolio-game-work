export class UI {
  constructor() { this.$=id=>document.getElementById(id); this.lastImpact=0; }
  bind(engine, handlers) {
    this.$('startBtn').addEventListener('click',handlers.cameraStart);
    this.$('mouseStartBtn').addEventListener('click',handlers.mouseStart);
    this.$('playAgainBtn').addEventListener('click',()=>{this.hideResult();handlers.restart()});
    this.$('pauseBtn').addEventListener('click',()=>engine.togglePause());
    this.$('restartBtn').addEventListener('click',handlers.restart);
    this.$('soundBtn').addEventListener('click',()=>{engine.soundEnabled=!engine.soundEnabled;this.$('soundBtn').querySelector('span').textContent=engine.soundEnabled?'ON':'OFF'});
    const speedControl=this.$('ballSpeed');
    let savedSpeed=NaN;
    try{savedSpeed=Number.parseInt(localStorage.getItem('gesturePaddle.ballSpeed')||'',10)}catch{}
    const initialSpeed=Number.isFinite(savedSpeed)?Math.max(80,Math.min(200,savedSpeed)):125;
    speedControl.value=String(initialSpeed);
    const applySpeed=()=>{const percent=Math.max(80,Math.min(200,Number.parseInt(speedControl.value,10)||125));speedControl.value=String(percent);this.$('ballSpeedValue').value=`${percent}%`;engine.setSpeedMultiplier(percent/100);try{localStorage.setItem('gesturePaddle.ballSpeed',String(percent))}catch{}};
    speedControl.addEventListener('input',applySpeed);
    applySpeed();
  }
  started(mouse=false){this.$('startOverlay').classList.remove('active');this.$('pauseBtn').disabled=false;this.$('restartBtn').disabled=false;if(mouse)this.cameraError('MOUSE CONTROL ACTIVE — gerakkan pointer di arena.')}
  state(s){this.$('levelValue').textContent=String(s.level).padStart(2,'0');this.$('pauseBadge').classList.toggle('show',s.state==='paused');this.$('pauseBtn').innerHTML=s.state==='paused'?'<span>▶</span> RESUME GAME':'<span>Ⅱ</span> PAUSE GAME'}
  score(value,delta=0){this.$('scoreValue').textContent=String(value).padStart(6,'0');this.$('scoreDelta').textContent=delta?`+${delta} GRID POINTS`:'RUN ACTIVE'}
  lives(n){this.$('livesValue').textContent=Array.from({length:3},(_,i)=>i<n?'●':'○').join(' ');this.$('livesValue').setAttribute('aria-label',`${n} nyawa`)}
  progress(value){this.$('progressBar').style.width=`${value}%`;this.$('progressValue').textContent=`${value}%`}
  gesture(data){const name=!data.detected?'NO HAND':data.gesture==='open'?'OPEN PALM':data.gesture==='fist'?'CLOSED FIST':'TRACKING';this.$('gestureName').textContent=name;this.$('gestureHint').textContent=!data.detected?'Posisikan tangan di dalam frame':data.gesture==='open'?'System active / resume':data.gesture==='fist'?'Pause command detected':'Reading hand position';this.$('confidenceValue').textContent=data.detected?`${data.confidence}%`:'—';this.$('gestureIcon').classList.toggle('fist',data.gesture==='fist');this.$('signalBars').classList.toggle('active',data.detected);this.$('cameraMessage').innerHTML=data.detected?`<span>OK</span><p><b>HAND LOCKED</b>${name} terdeteksi.</p>`:`<span>!</span><p><b>HAND NOT FOUND</b>Pastikan tangan terlihat dan pencahayaan cukup.</p>`}
  cameraOnline(){this.$('cameraOff').classList.add('hidden');this.$('cameraState').textContent='ONLINE';this.$('cameraState').classList.add('online')}
  cameraError(msg){this.$('cameraState').textContent='FALLBACK';this.$('cameraMessage').innerHTML=`<span>!</span><p><b>CAMERA UNAVAILABLE</b>${this.escape(msg)}</p>`}
  impact(){const now=performance.now();if(now-this.lastImpact<80)return;this.lastImpact=now;const f=this.$('canvasFrame');f.classList.remove('shake');void f.offsetWidth;f.classList.add('shake')}
  level(n){const b=this.$('levelBanner');b.querySelector('strong').textContent=`LEVEL ${String(n).padStart(2,'0')}`;b.style.visibility='visible';if(window.gsap){gsap.timeline().set(b,{opacity:0}).to(b,{opacity:1,duration:.35}).fromTo(b.querySelector('strong'),{y:25,opacity:0},{y:0,opacity:1,duration:.45}).to(b,{opacity:0,duration:.4,delay:.55}).set(b,{visibility:'hidden'})}else{b.style.opacity=1;setTimeout(()=>{b.style.opacity=0;b.style.visibility='hidden'},1500)}this.$('levelValue').textContent=String(n).padStart(2,'0')}
  end(type,s){const victory=type==='victory';this.$('resultCode').textContent=victory?'ALL SEQUENCES CLEARED':'ACTIVATION FAILED';this.$('resultTitle').innerHTML=victory?'GRID<br><em>CLEARED.</em>':'GAME<br><em>OVER.</em>';this.$('resultMessage').textContent=victory?`Skor akhir ${String(s.score).padStart(6,'0')}. Semua 5 level berhasil diselesaikan.`:`Skor akhir ${String(s.score).padStart(6,'0')}. Coba lagi dan jaga bola tetap aktif.`;this.$('resultOverlay').classList.add('active')}
  hideResult(){this.$('resultOverlay').classList.remove('active')}
  escape(value){const d=document.createElement('div');d.textContent=value;return d.innerHTML}
}
