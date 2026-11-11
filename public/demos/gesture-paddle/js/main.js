import { GameEngine } from './game-engine.js';
import { GestureController } from './gesture-controller.js';
import { UI } from './ui.js';

const ui = new UI();
const engine = new GameEngine(document.getElementById('gameCanvas'), {
  onState: s => ui.state(s), onScore: (s,d) => ui.score(s,d), onLife: n => ui.lives(n),
  onProgress: p => ui.progress(p), onLevel: n => ui.level(n), onImpact: () => ui.impact(), onEnd: (t,s) => ui.end(t,s)
});
let gesture = null;
let fistLatch = false;

async function startCamera() {
  const button=document.getElementById('startBtn');button.disabled=true;button.querySelector('span').textContent='CONNECTING CAMERA...';
  gesture ??= new GestureController({
    video:document.getElementById('webcam'), overlayCanvas:document.getElementById('handCanvas'),
    onUpdate:data=>{ui.gesture(data);if(data.detected)engine.setPaddleNormalized(data.x);if(data.gesture==='fist'&&!fistLatch){engine.pause();fistLatch=true}else if(data.gesture==='open'){if(engine.state==='paused')engine.resume();fistLatch=false}},
    onError:message=>ui.cameraError(message)
  });
  try { await gesture.start(); ui.cameraOnline(); engine.start(false); ui.started(false); ui.state(engine.snapshot()); }
  catch(error){ui.cameraError(gesture.friendlyError(error));button.disabled=false;button.querySelector('span').textContent='TRY CAMERA AGAIN'}
}

function startMouse(){engine.start(true);ui.started(true);ui.score(0);ui.lives(3);ui.state(engine.snapshot())}
function restart(){engine.restart();ui.score(0);ui.lives(3);ui.progress(0);ui.state(engine.snapshot())}
ui.bind(engine,{cameraStart:startCamera,mouseStart:startMouse,restart});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&engine.state==='running')engine.pause()});
