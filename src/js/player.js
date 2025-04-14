const video = document.getElementById('video');
const playPauseBtn = document.getElementById('play-pause');
const volumeBtn = document.getElementById('volume-mute');
const timeRemaining = document.getElementById('timeReaming');

const playIcon = playPauseBtn.querySelector('.fa-play');
const pauseIcon = playPauseBtn.querySelector('.fa-pause');
const volumeIcon = volumeBtn.querySelector('.fa-volume-high');
const muteIcon = volumeBtn.querySelector('.fa-volume-xmark');

// Esconder o ícone de pause no início
pauseIcon.style.display = 'none';

// Alternar entre Play/Pause
playPauseBtn.addEventListener('click', () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
});

//Pause meio do video
video.addEventListener('click', (e) => {
  if (e.target === video) {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }
});

// Alternar ícones com base no estado do vídeo
video.addEventListener('play', () => {
  playIcon.style.display = 'none';
  pauseIcon.style.display = 'inline';
});

video.addEventListener('pause', () => {
  playIcon.style.display = 'inline';
  pauseIcon.style.display = 'none';
});

// Atualizar tempo restante
video.addEventListener('timeupdate', () => {
  const remaining = video.duration - video.currentTime;
  const minutes = Math.floor(remaining / 60);
  const seconds = Math.floor(remaining % 60).toString().padStart(2, '0');
  timeRemaining.textContent = `-${minutes}:${seconds}`;
});

// Volume - Mute
muteIcon.style.display = 'none';
volumeBtn.addEventListener('click', () => {
  video.muted = !video.muted

  if (video.muted){
    volumeIcon.style.display = 'none';
    muteIcon.style.display = 'inline';
  } else {
    volumeIcon.style.display = 'inline';
    muteIcon.style.display = 'none';
  }
});

//Fullscreen
const fullscreenBtn = document.getElementById('fullscreen');
const expandIcon = fullscreenBtn.querySelector('.fa-expand');
const compressIcon = fullscreenBtn.querySelector('.fa-compress');

compressIcon.style.display = 'none';

fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    video.requestFullscreen();
    expandIcon.style.display = 'none';
    compressIcon.style.display = 'inline';
  } else {
    document.exitFullscreen();
    expandIcon.style.display = 'inline';
    compressIcon.style.display = 'none';
  }
});

document.addEventListener('fullscreenchange', () => {
  const isFullscreen = !!document.fullscreenElement;
  expandIcon.style.display = isFullscreen ? 'none' : 'inline';
  compressIcon.style.display = isFullscreen ? 'inline' : 'none';
});