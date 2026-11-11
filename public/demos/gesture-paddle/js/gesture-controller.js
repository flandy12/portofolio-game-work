export class GestureController {
  constructor({ video, overlayCanvas, onUpdate, onError }) {
    this.video = video;
    this.canvas = overlayCanvas;
    this.ctx = overlayCanvas.getContext('2d');
    this.onUpdate = onUpdate;
    this.onError = onError;
    this.hands = null;
    this.camera = null;
    this.lastX = .5;
    this.lastGesture = 'none';
    this.stableFrames = 0;
  }

  async start() {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('Webcam tidak didukung browser ini.');
    if (!window.Hands || !window.Camera) throw new Error('Model hand tracking gagal dimuat. Periksa koneksi internet.');
    this.hands = new window.Hands({ locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
    this.hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: .65, minTrackingConfidence: .6 });
    this.hands.onResults(results => this.process(results));
    this.camera = new window.Camera(this.video, {
      onFrame: async () => { if (this.hands) await this.hands.send({ image: this.video }); },
      width: 640, height: 480
    });
    try { await this.camera.start(); }
    catch (error) { this.onError?.(this.friendlyError(error)); throw error; }
  }

  friendlyError(error) {
    if (error?.name === 'NotAllowedError') return 'Izin kamera ditolak. Gunakan fallback mouse atau ubah izin browser.';
    if (error?.name === 'NotFoundError') return 'Kamera tidak ditemukan. Gunakan fallback mouse.';
    if (error?.name === 'NotReadableError') return 'Kamera sedang dipakai aplikasi lain.';
    return error?.message || 'Kamera tidak dapat diaktifkan.';
  }

  process(results) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const landmarks = results.multiHandLandmarks?.[0];
    if (!landmarks) { this.onUpdate?.({ detected:false, gesture:'none', x:this.lastX, confidence:0 }); return; }
    this.drawHand(landmarks);
    const rawX = 1 - landmarks[9].x;
    this.lastX += (rawX - this.lastX) * .32;
    const extended = [8,12,16,20].filter(tip => landmarks[tip].y < landmarks[tip - 2].y).length;
    const thumbOpen = Math.abs(landmarks[4].x - landmarks[2].x) > .055;
    const next = extended >= 3 && thumbOpen ? 'open' : extended <= 1 ? 'fist' : 'tracking';
    if (next === this.lastGesture) this.stableFrames++; else { this.lastGesture = next; this.stableFrames = 0; }
    const gesture = this.stableFrames >= 3 ? next : 'tracking';
    const confidence = Math.min(99, Math.round(72 + this.stableFrames * 2.5));
    this.onUpdate?.({ detected:true, gesture, x:this.lastX, confidence });
  }

  drawHand(points) {
    const links = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]];
    const sx = p => (1 - p.x) * this.canvas.width, sy = p => p.y * this.canvas.height;
    this.ctx.strokeStyle = '#77f5dc'; this.ctx.lineWidth = 2; this.ctx.shadowColor = '#77f5dc'; this.ctx.shadowBlur = 8;
    for (const [a,b] of links) { this.ctx.beginPath(); this.ctx.moveTo(sx(points[a]),sy(points[a])); this.ctx.lineTo(sx(points[b]),sy(points[b])); this.ctx.stroke(); }
    this.ctx.fillStyle = '#e8ff62'; this.ctx.shadowBlur = 5;
    for (const p of points) { this.ctx.beginPath(); this.ctx.arc(sx(p),sy(p),2.4,0,Math.PI*2); this.ctx.fill(); }
  }

  stop() {
    this.video.srcObject?.getTracks().forEach(track => track.stop());
    this.hands?.close?.(); this.hands = null; this.camera = null;
  }
}
