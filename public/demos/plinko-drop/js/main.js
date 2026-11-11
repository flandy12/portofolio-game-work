import { BoardRenderer } from './board.js';
import { GAME_CONFIG } from './config.js';
import { setupControls } from './controls.js';
import { GameAudio } from './audio.js';
import { PlinkoGame } from './game.js';
import { loadData, saveData, resetData } from './storage.js';
import { GameUI } from './ui.js';

let data = loadData();
const ui = new GameUI();
const board = new BoardRenderer(document.querySelector('#game-canvas'), GAME_CONFIG.board);
const audio = new GameAudio(data.sound);
const game = new PlinkoGame({ board, ui, audio, data, onDataChange: (next) => { data = saveData(next); game.data = data; } });
setupControls(game); board.resize(); window.addEventListener('resize', () => board.resize(), { passive: true });

let selectedDifficulty = data.difficulty;
let selectedMode = 'physics';
function selectInGroup(containerId, value) {
  document.querySelectorAll(`#${containerId} button`).forEach((button) => button.classList.toggle('is-selected', button.dataset.value === value));
}
selectInGroup('difficulty-picker', selectedDifficulty);

document.querySelector('#difficulty-picker').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-value]'); if (!button) return;
  selectedDifficulty = button.dataset.value; selectInGroup('difficulty-picker', selectedDifficulty);
});
document.querySelector('#mode-picker').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-value]'); if (!button) return;
  selectedMode = button.dataset.value; selectInGroup('mode-picker', selectedMode);
  document.querySelector('#mode-description').textContent = selectedMode === 'physics' ? 'Hasil murni ditentukan oleh slot yang dimasuki bola.' : 'Hadiah dipilih satu kali sebelum drop berdasarkan bobot yang transparan.';
});

document.querySelector('#start-button').addEventListener('click', () => game.start({ difficulty: selectedDifficulty, mode: selectedMode }));
document.querySelector('#reset-stats-button').addEventListener('click', () => {
  if (!window.confirm('Reset seluruh statistik demo dan pengaturan lokal?')) return;
  data = resetData(); game.data = data; selectedDifficulty = data.difficulty; selectInGroup('difficulty-picker', selectedDifficulty); syncSound();
  window.alert('Statistik demo berhasil direset.');
});
document.querySelector('#restart-button').addEventListener('click', () => game.restart());
document.querySelector('#play-again-button').addEventListener('click', () => { ui.closeGameOver(); game.restart(); });
document.querySelector('#back-home-button').addEventListener('click', () => { ui.closeGameOver(); game.home(); });

const howModal = document.querySelector('#how-to-modal');
function openHowTo() { howModal.hidden = false; requestAnimationFrame(() => howModal.classList.add('is-open')); }
function closeHowTo() { howModal.classList.remove('is-open'); setTimeout(() => { howModal.hidden = true; }, 250); }
document.querySelector('#how-to-button').addEventListener('click', openHowTo);
howModal.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', closeHowTo));
howModal.addEventListener('click', (event) => { if (event.target === howModal) closeHowTo(); });

const soundButton = document.querySelector('#sound-button');
function syncSound() { soundButton.setAttribute('aria-pressed', String(data.sound)); soundButton.setAttribute('aria-label', data.sound ? 'Matikan suara' : 'Nyalakan suara'); soundButton.textContent = data.sound ? '◖' : '×'; audio.setEnabled(data.sound); }
syncSound();
soundButton.addEventListener('click', () => { data.sound = !data.sound; data = saveData(data); game.data = data; syncSound(); if (data.sound) audio.unlock().catch(() => {}); });

document.querySelector('#fullscreen-button').addEventListener('click', async () => {
  try { if (!document.fullscreenElement) await document.documentElement.requestFullscreen(); else await document.exitFullscreen(); } catch { /* kiosk/browser may block fullscreen */ }
});
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !howModal.hidden) closeHowTo(); });

const miniBoard = document.querySelector('#mini-board');
for (let row = 0; row < 8; row += 1) for (let col = 0; col < 8 + row % 2; col += 1) {
  const peg = document.createElement('i'); peg.style.setProperty('--row', row); peg.style.setProperty('--col', col); peg.style.setProperty('--offset', row % 2 ? 0 : 0.5); miniBoard.appendChild(peg);
}
