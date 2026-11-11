(() => {
  'use strict';
  const STORAGE_KEY = 'luckypop_booth_v2';
  const MAX_HISTORY = 500;
  const COLORS = ['#ff5f9f','#ffd63e','#73d9ed','#9a74f0','#ff9163','#62d68d','#ff7fca','#7594f5'];
  const BALL_COUNT = 24;
  const MIN_SELECTION = 5;
  const DEFAULT_PRIZES = [
    {id:'grand',name:'Grand Prize',icon:'🏆',stock:2,weight:2,color:'#fff0ad'},
    {id:'merch',name:'Exclusive Merch',icon:'🧸',stock:8,weight:8,color:'#f1dcff'},
    {id:'voucher',name:'Voucher Spesial',icon:'🎟️',stock:15,weight:15,color:'#d9f5ff'},
    {id:'snack',name:'Sweet Treat',icon:'🍭',stock:25,weight:25,color:'#ffe0ed'},
    {id:'try',name:'Better Luck!',icon:'✨',stock:999,weight:50,color:'#e8f8e9'}
  ];
  const $ = id => document.getElementById(id);
  const el = {
    form:$('playerForm'),name:$('playerName'),error:$('nameError'),idle:$('idleState'),stage:$('capsuleStage'),
    grid:$('capsuleGrid'),drawStage:$('drawStage'),drawCapsule:$('drawCapsule'),drawMessage:$('drawMessage'),
    result:$('resultStage'),prizeIcon:$('prizeIcon'),prizeName:$('prizeName'),prizeMessage:$('prizeMessage'),
    claimCode:$('claimCode'),lever:$('leverControls'),resultControls:$('resultControls'),drawBtn:$('drawBtn'),
    selectedLabel:$('selectedLabel'),selectionHint:$('selectionHint'),winner:$('winnerName'),next:$('nextBtn'),publicPrizes:$('publicPrizeList'),
    sessionCount:$('sessionCount'),dialog:$('operatorDialog'),editor:$('prizeEditor'),history:$('historyBody'),
    statPlayers:$('statPlayers'),statWins:$('statWins'),statStock:$('statStock'),confetti:$('confetti'),toast:$('toast')
  };
  let store = loadStore();
  let game = {phase:'name',player:'',selected:[],busy:false};
  let soundEnabled = true;
  let toastTimer = 0;

  function clampInt(value,min,max,fallback){const n=Number(value);return Number.isInteger(n)?Math.min(max,Math.max(min,n)):fallback}
  function todayKey(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jakarta'}).format(new Date())}
  function validEntry(item){return item&&['player','prize','code','time'].every(key=>typeof item[key]==='string')}
  function safeStore(value){
    if(!value||typeof value!=='object')return null;
    const saved=Array.isArray(value.prizes)?value.prizes:[];
    const prizes=DEFAULT_PRIZES.map(base=>{const found=saved.find(item=>item&&item.id===base.id)||{};return{...base,stock:clampInt(found.stock,0,9999,base.stock),weight:clampInt(found.weight,0,10000,base.weight)}});
    const history=Array.isArray(value.history)?value.history.slice(0,MAX_HISTORY).filter(validEntry):[];
    return{prizes,history,date:typeof value.date==='string'?value.date:todayKey()};
  }
  function loadStore(){try{const safe=safeStore(JSON.parse(localStorage.getItem(STORAGE_KEY)));if(safe)return safe}catch(_){/* fallback */}return{prizes:DEFAULT_PRIZES.map(item=>({...item})),history:[],date:todayKey()}}
  function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(store))}catch(_){showToast('Penyimpanan browser tidak tersedia.')}}
  function dailyReset(){const today=todayKey();if(store.date!==today){store.date=today;store.history=[];persist()}}
  function normalizedName(raw){return raw.trim().replace(/\s+/g,' ').slice(0,24)}
  function nameError(name){if(name.length<2)return'Nama minimal 2 karakter.';if(!/^[\p{L}\p{N} .'-]+$/u.test(name))return'Gunakan huruf, angka, spasi, titik, apostrof, atau tanda hubung.';return''}
  function setStep(step){document.querySelectorAll('.steps li').forEach(item=>{const n=Number(item.dataset.step);item.classList.toggle('active',n===step);item.classList.toggle('done',n<step)})}

  function renderCapsules(){
    el.grid.replaceChildren();
    for(let index=0;index<BALL_COUNT;index+=1){const button=document.createElement('button');button.type='button';button.className='capsule';button.dataset.number=String(index+1).padStart(2,'0');button.style.setProperty('--cap',COLORS[index%COLORS.length]);button.style.setProperty('--tilt',`${(index%5)-2}deg`);button.setAttribute('aria-label',`Pilih bola nomor ${index+1}`);button.setAttribute('aria-pressed','false');button.addEventListener('click',()=>selectCapsule(index));el.grid.appendChild(button)}
  }
  function startGame(event){
    event.preventDefault();if(game.busy)return;
    const player=normalizedName(el.name.value);const error=nameError(player);el.error.textContent=error;el.name.setAttribute('aria-invalid',String(Boolean(error)));
    if(error){el.name.focus();tone(150,.08);return}
    game={phase:'select',player,selected:[],busy:false};el.idle.hidden=true;el.stage.hidden=false;el.form.hidden=true;el.lever.hidden=false;el.resultControls.hidden=true;el.drawBtn.disabled=true;setStep(2);renderCapsules();updateSelection();tone(520,.08);
  }
  function selectCapsule(index){
    if(game.phase!=='select'||game.busy)return;const position=game.selected.indexOf(index);if(position>=0)game.selected.splice(position,1);else game.selected.push(index);
    const selected=position<0;const button=el.grid.children[index];button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));updateSelection();tone(selected?680:420,.07);
  }
  function updateSelection(){const count=game.selected.length;const ready=count>=MIN_SELECTION;el.selectedLabel.textContent=`${count} bola dipilih`;el.selectionHint.textContent=ready?`${count} bola dipilih. Tuas siap ditarik!`:`${count} dari minimal ${MIN_SELECTION} bola dipilih`;el.drawBtn.disabled=!ready;const helper=el.drawBtn.querySelector('small');if(helper)helper.textContent=ready?'TEKAN UNTUK GACHA':`PILIH ${MIN_SELECTION-count} BOLA LAGI`;setStep(ready?3:2)}
  function random(){if(globalThis.crypto?.getRandomValues){const values=new Uint32Array(1);crypto.getRandomValues(values);return values[0]/4294967296}return Math.random()}
  function choosePrize(){const available=store.prizes.filter(item=>item.stock>0&&item.weight>0);if(!available.length)return null;let roll=random()*available.reduce((sum,item)=>sum+item.weight,0);for(const prize of available){roll-=prize.weight;if(roll<0)return prize}return available.at(-1)}
  async function drawPrize(){
    if(game.phase!=='select'||game.busy)return;if(game.selected.length<MIN_SELECTION){showToast(`Pilih minimal ${MIN_SELECTION} bola terlebih dahulu.`);return}const prize=choosePrize();if(!prize){showToast('Prize pool kosong. Minta operator mengatur stok.');return}
    const chosenBall=game.selected[Math.floor(random()*game.selected.length)];game.busy=true;game.phase='draw';el.stage.hidden=true;el.drawStage.hidden=false;el.lever.hidden=true;el.drawCapsule.style.setProperty('--cap',COLORS[chosenBall%COLORS.length]);el.drawCapsule.classList.add('spinning');tone(220,.12);
    await wait(650);el.drawMessage.textContent='Hampir terbuka...';tone(320,.12);await wait(700);revealPrize(prize);
  }
  function claimToken(){const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let token='';for(let i=0;i<4;i++)token+=chars[Math.floor(random()*chars.length)];return`LP-${token}`}
  function revealPrize(prize){
    const code=claimToken();prize.stock=Math.max(0,prize.stock-1);
    store.history.unshift({time:new Date().toLocaleString('id-ID',{timeZone:'Asia/Jakarta',hour:'2-digit',minute:'2-digit'}),player:game.player,prize:prize.name,code});store.history=store.history.slice(0,MAX_HISTORY);persist();
    game.phase='result';game.busy=false;el.drawStage.hidden=true;el.result.hidden=false;el.resultControls.hidden=false;el.drawCapsule.classList.remove('spinning');el.prizeIcon.textContent=prize.icon;el.prizeName.textContent=prize.name;el.prizeMessage.textContent=prize.id==='try'?'Terima kasih sudah ikut seru-seruan bersama kami!':'Tunjukkan layar ini kepada penjaga booth untuk klaim.';el.claimCode.textContent=`KODE: ${code}`;el.winner.textContent=game.player;setStep(4);updateDashboard();renderPublicPrizes();celebrate(prize.id!=='try');
  }
  function nextPlayer(){game={phase:'name',player:'',selected:[],busy:false};el.result.hidden=true;el.idle.hidden=false;el.resultControls.hidden=true;el.form.hidden=false;el.name.value='';el.error.textContent='';el.name.removeAttribute('aria-invalid');setStep(1);el.name.focus()}

  function renderPublicPrizes(){
    el.publicPrizes.replaceChildren();store.prizes.filter(prize=>prize.id!=='try').forEach(prize=>{const row=document.createElement('div');row.className='public-prize';row.style.setProperty('--soft',prize.color);const icon=document.createElement('span');icon.textContent=prize.icon;const copy=document.createElement('div');const title=document.createElement('b');title.textContent=prize.name;const stock=document.createElement('small');stock.textContent=prize.stock>0?`${prize.stock} tersedia`:'Stok habis';copy.append(title,stock);row.append(icon,copy);el.publicPrizes.appendChild(row)});
  }
  function numberInput(text,value,max,field,id){const label=document.createElement('label');label.className='prize-input';label.append(document.createTextNode(text));const input=document.createElement('input');input.type='number';input.min='0';input.max=String(max);input.step='1';input.value=String(value);input.dataset.field=field;input.dataset.id=id;input.setAttribute('aria-label',`${text} ${id}`);label.appendChild(input);return label}
  function renderOperator(){
    el.editor.replaceChildren();store.prizes.forEach(prize=>{const row=document.createElement('div');row.className='prize-row';const label=document.createElement('label');const icon=document.createElement('span');icon.textContent=prize.icon;label.append(icon,document.createTextNode(prize.name));row.append(label,numberInput('Stok',prize.stock,9999,'stock',prize.id),numberInput('Bobot',prize.weight,10000,'weight',prize.id));el.editor.appendChild(row)});renderHistory();updateDashboard();
  }
  function saveSettings(){
    const next=store.prizes.map(item=>({...item}));for(const input of el.editor.querySelectorAll('input')){const prize=next.find(item=>item.id===input.dataset.id);const value=Number(input.value);if(!prize||!Number.isInteger(value)||value<0||value>Number(input.max)){showToast('Stok dan bobot harus berupa angka bulat yang valid.');input.focus();return}prize[input.dataset.field]=value}
    if(!next.some(prize=>prize.stock>0&&prize.weight>0)){showToast('Aktifkan minimal satu hadiah.');return}store.prizes=next;persist();renderPublicPrizes();updateDashboard();showToast('Pengaturan hadiah disimpan.');
  }
  function renderHistory(){
    el.history.replaceChildren();if(!store.history.length){const row=document.createElement('tr');const cell=document.createElement('td');cell.colSpan=4;cell.className='empty-cell';cell.textContent='Belum ada peserta pada sesi ini.';row.appendChild(cell);el.history.appendChild(row);return}
    store.history.forEach(entry=>{const row=document.createElement('tr');[entry.time,entry.player,entry.prize,entry.code].forEach(value=>{const cell=document.createElement('td');cell.textContent=value;row.appendChild(cell)});el.history.appendChild(row)});
  }
  function updateDashboard(){const wins=store.history.filter(entry=>entry.prize!=='Better Luck!').length;const stock=store.prizes.filter(prize=>prize.id!=='try').reduce((sum,prize)=>sum+prize.stock,0);el.sessionCount.textContent=String(store.history.length);el.statPlayers.textContent=String(store.history.length);el.statWins.textContent=String(wins);el.statStock.textContent=String(stock)}
  function exportCsv(){
    if(!store.history.length){showToast('Belum ada data untuk diekspor.');return}const escape=value=>`"${String(value).replaceAll('"','""')}"`;const rows=[['Waktu','Peserta','Hadiah','Kode'],...store.history.map(item=>[item.time,item.player,item.prize,item.code])];const csv='\uFEFF'+rows.map(row=>row.map(escape).join(',')).join('\r\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=`luckypop-${todayKey()}.csv`;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);
  }
  function resetSession(){if(!confirm('Hapus seluruh riwayat peserta hari ini? Stok hadiah tidak akan berubah.'))return;store.history=[];persist();renderHistory();updateDashboard();showToast('Riwayat sesi sudah direset.')}
  function celebrate(winner){
    tone(winner?880:520,.16);if(!winner)return;const colors=['#ff4f9d','#ffd63e','#6d43e5','#55d6e8','#62d68d'];for(let i=0;i<70;i++){const piece=document.createElement('i');piece.style.left=`${random()*100}%`;piece.style.setProperty('--c',colors[Math.floor(random()*colors.length)]);piece.style.setProperty('--d',`${2.2+random()*2}s`);piece.style.setProperty('--x',`${-100+random()*200}px`);piece.style.animationDelay=`${random()*.7}s`;el.confetti.appendChild(piece);setTimeout(()=>piece.remove(),5000)}
  }
  function tone(frequency,duration){if(!soundEnabled)return;try{const context=new(window.AudioContext||window.webkitAudioContext)();const oscillator=context.createOscillator();const gain=context.createGain();oscillator.frequency.value=frequency;gain.gain.setValueAtTime(.05,context.currentTime);gain.gain.exponentialRampToValueAtTime(.001,context.currentTime+duration);oscillator.connect(gain);gain.connect(context.destination);oscillator.start();oscillator.stop(context.currentTime+duration);oscillator.addEventListener('ended',()=>context.close())}catch(_){/* optional audio */}}
  function showToast(message){clearTimeout(toastTimer);el.toast.textContent=message;el.toast.classList.add('show');toastTimer=setTimeout(()=>el.toast.classList.remove('show'),2300)}
  function wait(ms){return new Promise(resolve=>setTimeout(resolve,ms))}

  el.form.addEventListener('submit',startGame);el.drawBtn.addEventListener('click',drawPrize);el.next.addEventListener('click',nextPlayer);
  $('soundBtn').addEventListener('click',()=>{soundEnabled=!soundEnabled;$('soundBtn').textContent=soundEnabled?'♪':'×';$('soundBtn').setAttribute('aria-label',soundEnabled?'Matikan suara':'Nyalakan suara')});
  $('fullscreenBtn').addEventListener('click',async()=>{try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen()}catch(_){showToast('Mode layar penuh tidak didukung browser ini.')}});
  $('operatorBtn').addEventListener('click',()=>{renderOperator();el.dialog.showModal()});$('saveSettingsBtn').addEventListener('click',saveSettings);$('exportBtn').addEventListener('click',exportCsv);$('resetSessionBtn').addEventListener('click',resetSession);
  el.dialog.addEventListener('click',event=>{const rect=el.dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)el.dialog.close()});
  dailyReset();renderPublicPrizes();renderCapsules();updateDashboard();
})();
