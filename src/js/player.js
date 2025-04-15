const video = document.getElementById('video');
const playPauseBtn = document.getElementById('play-pause');
const volumeBtn = document.getElementById('volume-mute');
const timeRemaining = document.getElementById('timeReaming');

const playIcon = playPauseBtn.querySelector('.fa-play');
const pauseIcon = playPauseBtn.querySelector('.fa-pause');
const volumeIcon = volumeBtn.querySelector('.fa-volume-high');
const muteIcon = volumeBtn.querySelector('.fa-volume-xmark');

// Esconder o ícone de pause no início
pauseIcon.classList.add('hidden');

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
  playIcon.classList.add('hidden');
  pauseIcon.classList.remove('hidden');
});

video.addEventListener('pause', () => {
  playIcon.classList.remove('hidden');
  pauseIcon.classList.add('hidden');
});

// Atualizar tempo restante
video.addEventListener('timeupdate', () => {
  const remaining = video.duration - video.currentTime;
  const minutes = Math.floor(remaining / 60);
  const seconds = Math.floor(remaining % 60).toString().padStart(2, '0');
  timeRemaining.textContent = `-${minutes}:${seconds}`;
});

// Volume - Mute
muteIcon.classList.add('hidden');

volumeBtn.addEventListener('click', () => {
  video.muted = !video.muted;

  if (video.muted) {
    volumeIcon.classList.add('hidden');
    muteIcon.classList.remove('hidden');
  } else {
    volumeIcon.classList.remove('hidden');
    muteIcon.classList.add('hidden');
  }
});


//Fullscreen
const fullscreenBtn = document.getElementById('fullscreen');
const expandIcon = fullscreenBtn.querySelector('.fa-expand');
const compressIcon = fullscreenBtn.querySelector('.fa-compress');
const videoContainer = document.getElementById('video-container');

compressIcon.classList.add('hidden');

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
  expandIcon.classList.toggle('hidden', isFullscreen);
  compressIcon.classList.toggle('hidden', !isFullscreen);

  const player = document.getElementById('player');
  if (isFullscreen) {
    player.classList.remove('rounded-xl', 'p-6');
  } else {
    player.classList.add('rounded-xl', 'p-6');
  }
});


