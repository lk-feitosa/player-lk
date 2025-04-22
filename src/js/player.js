// ============================
// Referências
// ============================
const video = document.getElementById('video');
const playPauseBtn = document.getElementById('play-pause');
const volumeBtn = document.getElementById('volume-mute');
const timeRemaining = document.getElementById('timeReaming');

const playIcon = playPauseBtn.querySelector('.fa-play');
const pauseIcon = playPauseBtn.querySelector('.fa-pause');
const volumeIcon = volumeBtn.querySelector('.fa-volume-high');
const muteIcon = volumeBtn.querySelector('.fa-volume-xmark');

const fullscreenBtn = document.getElementById('fullscreen');
const expandIcon = fullscreenBtn.querySelector('.fa-expand');
const compressIcon = fullscreenBtn.querySelector('.fa-compress');
const videoContainer = document.getElementById('video-container');
const player = document.getElementById('player');

const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');

// ============================
// Estado inicial dos ícones
// ============================
pauseIcon.classList.add('hidden');
muteIcon.classList.add('hidden');
compressIcon.classList.add('hidden');

// ============================
// Play/Pause por botão
// ============================
playPauseBtn.addEventListener('click', () => {
  video.paused ? video.play() : video.pause();
});

// ============================
// Play/Pause clicando no vídeo
// ============================
video.addEventListener('click', (e) => {
  if (e.target === video) {
    video.paused ? video.play() : video.pause();
  }
});

// ============================
// Alternância de ícones Play/Pause
// ============================
video.addEventListener('play', () => {
  playIcon.style.display = 'none'; // Hide play icon
  pauseIcon.style.display = 'inline'; // Show pause icon
});

video.addEventListener('pause', () => {
  playIcon.style.display = 'inline'; // Show play icon
  pauseIcon.style.display = 'none'; // Hide pause icon
});

// ============================
// Tempo restante
// ============================
video.addEventListener('timeupdate', () => {
  const remaining = video.duration - video.currentTime;
  const minutes = Math.floor(remaining / 60);
  const seconds = Math.floor(remaining % 60).toString().padStart(2, '0');
  timeRemaining.textContent = `-${minutes}:${seconds}`;
});

// ============================
// Volume / Mute
// ============================
volumeBtn.addEventListener('click', () => {
  video.muted = !video.muted;

  // Toggle volume icon visibility based on mute state
  volumeIcon.style.display = video.muted ? 'none' : 'inline';
  muteIcon.style.display = video.muted ? 'inline' : 'none';
});

// ============================
// Fullscreen
// ============================
fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    videoContainer.requestFullscreen().catch(err => {
      console.error("Erro ao tentar entrar em fullscreen:", err);
    });
  } else {
    document.exitFullscreen();
  }
});

document.addEventListener('fullscreenchange', () => {
  const isFullscreen = !!document.fullscreenElement;

  // Toggle fullscreen icons visibility
  expandIcon.style.display = isFullscreen ? 'none' : 'inline';
  compressIcon.style.display = isFullscreen ? 'inline' : 'none';

  // Remove padding and rounded corners in fullscreen mode
  player.classList.toggle('rounded-xl', !isFullscreen);
  player.classList.toggle('p-6', !isFullscreen);
});

// ============================
// Progress bar
// ============================
video.addEventListener('timeupdate', () => {
  // Calcular o progresso do vídeo
  const progressPercentage = (video.currentTime / video.duration) * 100;

  // Atualizar a largura da barra com base na %
  progress.style.width = `${progressPercentage}%`;
});