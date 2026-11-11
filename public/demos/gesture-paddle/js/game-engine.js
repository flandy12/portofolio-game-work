import { LEVELS, createBricks } from './levels.js';
import { circleRectCollision, resolveBrickBounce, paddleBounce } from './collision.js';

export class GameEngine {
  constructor(canvas, callbacks = {}) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d'); this.callbacks = callbacks;
    this.state = 'idle'; this.score = 0; this.lives = 3; this.level = 0; this.particles = []; this.lastTime = 0;
    this.targetPaddleX = canvas.width / 2; this.mouseEnabled = false; this.soundEnabled = true; this.speedMultiplier = 1.25;
    this.paddle = { x: 400, y: 548, width: 145, height: 13 };
    this.ball = { x: 480, y: 510, radius: 8, vx: 0, vy: 0, trail: [] };
    this.resizeObserver = new ResizeObserver(() => this.fit()); this.resizeObserver.observe(canvas);
    this.bindPointer(); this.resetLevel(); requestAnimationFrame(t => this.loop(t));
  }

  fit() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const oldW = this.canvas.width || 960, oldH = this.canvas.height || 600;
    this.canvas.width = Math.round(rect.width * dpr); this.canvas.height = Math.round(rect.height * dpr);
    const sx = this.canvas.width / oldW, sy = this.canvas.height / oldH;
    this.paddle.x *= sx; this.paddle.y = this.canvas.height * .91; this.paddle.width = this.canvas.width * .15; this.paddle.height = Math.max(10, this.canvas.height * .022);
    this.ball.x *= sx; this.ball.y *= sy; this.ball.radius = Math.max(6, this.canvas.width * .008);
    this.targetPaddleX = this.canvas.width / 2; this.bricks = createBricks(this.level, this.canvas.width);
  }

  bindPointer() {
    const move = e => { if (!this.mouseEnabled) return; const r=this.canvas.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width; this.setPaddleNormalized(x); };
    this.canvas.addEventListener('pointermove', move);
    this.canvas.addEventListener('pointerdown', move);
  }

  start(mouse = false) {
    this.mouseEnabled = mouse; this.score = 0; this.lives = 3; this.level = 0; this.state = 'running'; this.resetLevel(); this.callbacks.onState?.(this.snapshot());
  }

  resetLevel() {
    this.bricks = createBricks(this.level, this.canvas.width);
    this.paddle.x = (this.canvas.width - this.paddle.width) / 2;
    this.targetPaddleX = this.canvas.width / 2;
    this.resetBall(); this.callbacks.onProgress?.(0);
  }

  resetBall() {
    const speed = LEVELS[this.level].speed * this.speedMultiplier * (this.canvas.width / 960);
    this.ball.x = this.canvas.width / 2; this.ball.y = this.paddle.y - 30; this.ball.vx = speed * .62 * (Math.random()>.5?1:-1); this.ball.vy = -speed * .78; this.ball.trail=[];
  }

  setPaddleNormalized(x) { this.targetPaddleX = Math.max(0,Math.min(1,x)) * this.canvas.width; }
  setSpeedMultiplier(value) {
    const next = Math.max(.8, Math.min(2, Number(value) || 1.25));
    const previous = this.speedMultiplier;
    this.speedMultiplier = next;
    if (previous > 0 && Math.hypot(this.ball.vx, this.ball.vy) > 0) {
      const ratio = next / previous;
      this.ball.vx *= ratio;
      this.ball.vy *= ratio;
    }
    return this.speedMultiplier;
  }
  pause() { if(this.state==='running'){this.state='paused';this.callbacks.onState?.(this.snapshot())} }
  resume() { if(this.state==='paused'){this.state='running';this.lastTime=performance.now();this.callbacks.onState?.(this.snapshot())} }
  togglePause() { this.state==='paused'?this.resume():this.pause(); }
  restart() { this.start(this.mouseEnabled); }
  snapshot() { return { state:this.state, score:this.score, lives:this.lives, level:this.level+1, speedMultiplier:this.speedMultiplier }; }

  loop(time) {
    const dt = Math.min((time - this.lastTime) / 1000 || 0, .025); this.lastTime = time;
    if (this.state === 'running') this.update(dt);
    this.draw(); requestAnimationFrame(t => this.loop(t));
  }

  update(dt) {
    const desired = this.targetPaddleX - this.paddle.width / 2;
    this.paddle.x += (desired - this.paddle.x) * (1 - Math.pow(.0001, dt));
    this.paddle.x = Math.max(0,Math.min(this.canvas.width-this.paddle.width,this.paddle.x));
    const b=this.ball; b.x+=b.vx*dt; b.y+=b.vy*dt; b.trail.unshift({x:b.x,y:b.y}); if(b.trail.length>12)b.trail.pop();
    if(b.x-b.radius<=0){b.x=b.radius;b.vx=Math.abs(b.vx);this.hit()}
    if(b.x+b.radius>=this.canvas.width){b.x=this.canvas.width-b.radius;b.vx=-Math.abs(b.vx);this.hit()}
    if(b.y-b.radius<=0){b.y=b.radius;b.vy=Math.abs(b.vy);this.hit()}
    if(b.vy>0 && circleRectCollision(b,this.paddle)){paddleBounce(b,this.paddle);this.hit()}
    for(const brick of this.bricks){ if(!brick.alive||!circleRectCollision(b,brick))continue; resolveBrickBounce(b,brick); brick.hp--; this.hit(); if(brick.hp<=0){brick.alive=false;this.score+=100*(this.level+1);this.spawnParticles(brick);this.callbacks.onScore?.(this.score,100*(this.level+1));} break; }
    const alive=this.bricks.filter(x=>x.alive).length,total=this.bricks.length; this.callbacks.onProgress?.(Math.round((1-alive/total)*100));
    if(!alive)this.completeLevel();
    if(b.y-b.radius>this.canvas.height){this.lives--;this.callbacks.onLife?.(this.lives);if(this.lives<=0){this.state='gameover';this.callbacks.onEnd?.('gameover',this.snapshot())}else this.resetBall()}
    this.particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=350*dt;p.life-=dt});this.particles=this.particles.filter(p=>p.life>0);
  }

  completeLevel() {
    if(this.level >= LEVELS.length-1){this.state='victory';this.score+=this.lives*1000;this.callbacks.onEnd?.('victory',this.snapshot());return}
    this.state='transition';this.level++;this.callbacks.onLevel?.(this.level+1);
    setTimeout(()=>{this.resetLevel();this.state='running';this.lastTime=performance.now();this.callbacks.onState?.(this.snapshot())},1800);
  }

  spawnParticles(brick){for(let i=0;i<14;i++)this.particles.push({x:brick.x+brick.width/2,y:brick.y+brick.height/2,vx:(Math.random()-.5)*260,vy:(Math.random()-.7)*260,life:.45+Math.random()*.35,color:brick.color,size:2+Math.random()*4})}
  hit(){this.callbacks.onImpact?.();if(this.soundEnabled)this.beep()}
  beep(){try{this.audio??=new AudioContext();const o=this.audio.createOscillator(),g=this.audio.createGain();o.frequency.value=180+Math.random()*90;g.gain.setValueAtTime(.025,this.audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,this.audio.currentTime+.05);o.connect(g).connect(this.audio.destination);o.start();o.stop(this.audio.currentTime+.05)}catch{}}

  draw() {
    const c=this.ctx,w=this.canvas.width,h=this.canvas.height;c.clearRect(0,0,w,h);
    const grad=c.createRadialGradient(w*.5,h*.45,10,w*.5,h*.45,w*.7);grad.addColorStop(0,'#101535');grad.addColorStop(1,'#030510');c.fillStyle=grad;c.fillRect(0,0,w,h);
    c.strokeStyle='rgba(119,245,220,.055)';c.lineWidth=1;const grid=w/20;for(let x=0;x<w;x+=grid){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke()}for(let y=0;y<h;y+=grid){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke()}
    for(const brick of this.bricks||[]){if(!brick.alive)continue;c.save();c.shadowColor=brick.color;c.shadowBlur=brick.hp<brick.maxHp?5:12;c.fillStyle=brick.color;c.globalAlpha=.28+.22*(brick.hp/brick.maxHp);c.fillRect(brick.x,brick.y,brick.width,brick.height);c.globalAlpha=1;c.strokeStyle=brick.color;c.lineWidth=1.5;c.strokeRect(brick.x+.5,brick.y+.5,brick.width-1,brick.height-1);c.fillStyle=brick.color;c.fillRect(brick.x+4,brick.y+4,Math.max(0,(brick.width-8)*(brick.hp/brick.maxHp)),2);c.restore()}
    for(const p of this.particles){c.globalAlpha=Math.max(0,p.life*1.5);c.fillStyle=p.color;c.fillRect(p.x,p.y,p.size,p.size)}c.globalAlpha=1;
    c.save();c.shadowColor='#77f5dc';c.shadowBlur=25;c.fillStyle='#77f5dc';c.fillRect(this.paddle.x,this.paddle.y,this.paddle.width,this.paddle.height);c.fillStyle='#e8ff62';c.fillRect(this.paddle.x+this.paddle.width*.35,this.paddle.y-2,this.paddle.width*.3,2);c.restore();
    this.ball.trail.forEach((p,i)=>{c.beginPath();c.globalAlpha=(1-i/this.ball.trail.length)*.25;c.fillStyle='#77f5dc';c.arc(p.x,p.y,this.ball.radius*(1-i/this.ball.trail.length),0,Math.PI*2);c.fill()});c.globalAlpha=1;c.save();c.shadowColor='#e8ff62';c.shadowBlur=22;c.fillStyle='#f7ffd0';c.beginPath();c.arc(this.ball.x,this.ball.y,this.ball.radius,0,Math.PI*2);c.fill();c.restore();
  }
}
