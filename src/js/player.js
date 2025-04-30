// ============================
// Referências aos elementos do DOM
// ============================

// Player e Vídeo
const video = document.getElementById('video');
const videoContainer = document.getElementById('video-container');
const player = document.getElementById('player');

// Controles de Reprodução
const playPauseBtn = document.getElementById('play-pause');
const playIcon = playPauseBtn.querySelector('.fa-play');
const pauseIcon = playPauseBtn.querySelector('.fa-pause');

// Controles de Volume
const volumeBtn = document.getElementById('volume-mute');
const volumeIcon = volumeBtn.querySelector('.fa-volume-high');
const muteIcon = volumeBtn.querySelector('.fa-volume-xmark');
const volumeSlider = document.getElementById('volume-slider');

// Controles de Tela Cheia
const fullscreenBtn = document.getElementById('fullscreen');
const expandIcon = fullscreenBtn.querySelector('.fa-expand');
const compressIcon = fullscreenBtn.querySelector('.fa-compress');

// Picture in Picture
const pipButton = document.getElementById('pip');

// Barra de Progresso
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const hoverTimer = document.getElementById('hover-time');
const timeRemaining = document.getElementById('timeRemaining');

const hoverTimeDisplay = document.createElement('div');
hoverTimeDisplay.className = 'absolute bottom-[50px] bg-gray-800 text-white px-2 py-1 rounded text-sm hidden transform -translate-x-1/2';
videoContainer.appendChild(hoverTimeDisplay);

// Menu de Configurações
const settingsBtn = document.getElementById('menu-settings');
const settingsMenu = document.getElementById('settings-menu');
const controles = document.getElementById('controles');

// Submenus
const openSpeed = document.getElementById('open-speed');
const openQuality = document.getElementById('open-quality');
const submenuSpeed = document.getElementById('submenu-speed');
const submenuQuality = document.getElementById('submenu-quality');

// ============================
// Configuração inicial
// ============================
pauseIcon.classList.add('hidden');
muteIcon.classList.add('hidden');
compressIcon.classList.add('hidden');

// Atalhos de teclado
document.addEventListener('keydown', (e) => {
  if (document.activeElement.tagName === 'INPUT') return;
  
  switch(e.key.toLowerCase()) {
      case ' ':
      case 'k':
          e.preventDefault();
          video.paused ? video.play() : video.pause();
          break;
      case 'f':
          e.preventDefault();
          fullscreenBtn.click();
          break;
      case 'm':
          e.preventDefault();
          volumeBtn.click();
          break;
      case 'arrowleft':
          e.preventDefault();
          video.currentTime = Math.max(video.currentTime - 5, 0);
          break;
      case 'arrowright':
          e.preventDefault();
          video.currentTime = Math.min(video.currentTime + 5, video.duration);
          break;
      case 'arrowup':
          e.preventDefault();
          video.volume = Math.min(video.volume + 0.1, 1);
          volumeSlider.value = video.volume;
          updateVolumeIcon();
          break;
      case 'arrowdown':
          e.preventDefault();
          video.volume = Math.max(video.volume - 0.1, 0);
          volumeSlider.value = video.volume;
          updateVolumeIcon();
          break;
  }
});

// ============================
// Controles de Reprodução (Play/Pause)
// ============================
playPauseBtn.addEventListener('click', () => {
  video.paused ? video.play() : video.pause();
});

video.addEventListener('click', (e) => {
  if (e.target === video) {
    video.paused ? video.play() : video.pause();
  }
});

video.addEventListener('play', () => {
  playIcon.style.display = 'none';
  pauseIcon.style.display = 'inline';
});

video.addEventListener('pause', () => {
  playIcon.style.display = 'inline';
  pauseIcon.style.display = 'none';
});

// ============================
// Controles de Volume
// ============================
volumeBtn.addEventListener('click', () => {
  video.muted = !video.muted;
  updateVolumeIcon();
});

volumeSlider.addEventListener('input', () => {
  video.volume = volumeSlider.value;
  video.muted = video.volume === 0;
  updateVolumeIcon();
});

function updateVolumeIcon() {
  const isMuted = video.volume === 0 || video.muted;
  volumeIcon.style.display = isMuted ? 'none' : 'inline';
  muteIcon.style.display = isMuted ? 'inline' : 'none';
}

// ============================
// Controles de Tela Cheia
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
  expandIcon.style.display = isFullscreen ? 'none' : 'inline';
  compressIcon.style.display = isFullscreen ? 'inline' : 'none';
  player.classList.toggle('rounded-xl', !isFullscreen);
  player.classList.toggle('p-1', !isFullscreen);
});

// Double Click para Fullscreen
let lastClick = 0;
video.addEventListener('click', (e) => {
    const now = Date.now();
    if (now - lastClick < 300) { // Double click
        if (!document.fullscreenElement) {
            videoContainer.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    lastClick = now;
});

// ============================
// Barra de Progresso e Tempo
// ============================
function updateProgressBar() {
  const progressPercentage = (video.currentTime / video.duration) * 100;
  progress.style.width = `${progressPercentage}%`;
  requestAnimationFrame(updateProgressBar);
}

video.addEventListener('play', () => {
  requestAnimationFrame(updateProgressBar);
});

video.addEventListener('timeupdate', () => {
  const remaining = video.duration - video.currentTime;
  const minutes = Math.floor(remaining / 60);
  const seconds = Math.floor(remaining % 60).toString().padStart(2, '0');
  timeRemaining.textContent = `-${minutes}:${seconds}`;
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

progressBar.addEventListener('mousemove', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const percent = Math.min(Math.max(0, e.clientX - rect.left), rect.width) / rect.width;
  const time = video.duration * percent;
  
  // Posiciona o display de tempo
  hoverTimeDisplay.style.left = `${e.clientX}px`;
  hoverTimeDisplay.textContent = formatTime(time);
  hoverTimeDisplay.classList.remove('hidden');
});

progressBar.addEventListener('mouseleave', () => {
  hoverTimeDisplay.classList.add('hidden');
});

// Atualiza a posição do hover time durante o arrasto
document.addEventListener('mousemove', (e) => {
  if (isDragging) {
      const rect = progressBar.getBoundingClientRect();
      const percent = Math.min(Math.max(0, e.clientX - rect.left), rect.width) / rect.width;
      const time = video.duration * percent;
      
      hoverTimeDisplay.style.left = `${e.clientX}px`;
      hoverTimeDisplay.textContent = formatTime(time);
      hoverTimeDisplay.classList.remove('hidden');
  }
});

// ============================
// Drag and Seek
// ============================
let isDragging = false;

function seek(e) {
  const rect = progressBar.getBoundingClientRect();
  const x = e.touches ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
  let percent = Math.max(0, Math.min(1, x / rect.width));
  video.currentTime = video.duration * percent;
}

// Mouse Events
progressBar.addEventListener('mousedown', (e) => {
  isDragging = true;
  seek(e);
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) seek(e);
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

// Touch Events
progressBar.addEventListener('touchstart', (e) => {
  isDragging = true;
  seek(e);
});

document.addEventListener('touchmove', (e) => {
  if (isDragging) seek(e);
});

document.addEventListener('touchend', () => {
  isDragging = false;
});

// ============================
// Auto-hide dos Controles
// ============================
let hideControlsTimeout = null;
let mouseOverControls = false;
let mouseOverProgressBar = false;

function showControls() {
  controles.classList.remove('opacity-0');
  controles.classList.add('opacity-100');
  progressBar.classList.remove('opacity-0');
  progressBar.classList.add('opacity-100');
  resetHideControlsTimer();
}

function hideControls() {
  if (!mouseOverControls && !mouseOverProgressBar) {
    controles.classList.remove('opacity-100');
    controles.classList.add('opacity-0');
    progressBar.classList.remove('opacity-100');
    progressBar.classList.add('opacity-0');
  }
}

function resetHideControlsTimer() {
  clearTimeout(hideControlsTimeout);
  hideControlsTimeout = setTimeout(hideControls, 1000);
}

// Event Listeners para Auto-hide
videoContainer.addEventListener('mousemove', showControls);
controles.addEventListener('mouseenter', () => {
  mouseOverControls = true;
  showControls();
  clearTimeout(hideControlsTimeout);
});

controles.addEventListener('mouseleave', () => {
  mouseOverControls = false;
  resetHideControlsTimer();
});

progressBar.addEventListener('mouseenter', () => {
  mouseOverProgressBar = true;
  showControls();
  clearTimeout(hideControlsTimeout);
});

progressBar.addEventListener('mouseleave', () => {
  mouseOverProgressBar = false;
  resetHideControlsTimer();
});

video.addEventListener('play', resetHideControlsTimer);
video.addEventListener('pause', resetHideControlsTimer);
videoContainer.addEventListener('click', showControls);

// Inicialmente, mostra os controles
showControls();

// ============================
// Menu de Configurações
// ============================
function closeAllMenus() {
  settingsMenu.classList.remove('opacity-100');
  settingsMenu.classList.add('opacity-0', 'pointer-events-none');
  submenuSpeed.classList.add('hidden');
  submenuQuality.classList.add('hidden');
}

// Previne propagação de cliques
[settingsMenu, submenuSpeed, submenuQuality].forEach(menu => {
  if (menu) menu.addEventListener('click', e => e.stopPropagation());
});

// Event Listeners do Menu Principal
settingsBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = settingsMenu.classList.contains('opacity-100');
  if (isOpen) {
    closeAllMenus();
  } else {
    settingsMenu.classList.remove('opacity-0', 'pointer-events-none');
    settingsMenu.classList.add('opacity-100');
  }
});

document.addEventListener('click', (e) => {
  if (!settingsMenu.contains(e.target) && !settingsBtn.contains(e.target)) {
    closeAllMenus();
  }
});

// ============================
// Controle de Velocidade
// ============================
openSpeed.addEventListener('click', (e) => {
  e.stopPropagation();
  submenuSpeed.classList.remove('hidden');
  settingsMenu.classList.add('opacity-0', 'pointer-events-none');
});

document.getElementById('back-speed').addEventListener('click', (e) => {
  e.stopPropagation();
  submenuSpeed.classList.add('hidden');
  settingsMenu.classList.remove('opacity-0', 'pointer-events-none');
});

document.querySelectorAll('.speed-option').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const value = parseFloat(btn.dataset.value);
    video.playbackRate = value;
    updateSpeedOptions(value);
    closeAllMenus();
  });
});

function updateSpeedOptions(selected) {
  document.querySelectorAll('.speed-option').forEach(btn => {
    const value = parseFloat(btn.dataset.value);
    if (value === selected) {
      btn.classList.add('bg-[#A8C738]');
      btn.innerHTML = `<span class="font-bold">&#10003;</span> ${value === 1 ? 'Normal' : value + 'x'}`;
    } else {
      btn.classList.remove('bg-[#A8C738]');
      btn.textContent = value === 1 ? 'Normal' : value + 'x';
    }
  });
}

// ============================
// Controle de Qualidade
// ============================
const videoQualities = {
  'auto': 'Automático',
  '1080p': '1080p',
  '720p': '720p',
  '480p': '480p'
};

openQuality.addEventListener('click', (e) => {
  e.stopPropagation();
  submenuQuality.classList.remove('hidden');
  settingsMenu.classList.add('opacity-0', 'pointer-events-none');
});

document.getElementById('back-quality').addEventListener('click', (e) => {
  e.stopPropagation();
  submenuQuality.classList.add('hidden');
  settingsMenu.classList.remove('opacity-0', 'pointer-events-none');
});

document.querySelectorAll('.quality-option').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const value = btn.dataset.value;
    updateQualityOptions(value);
    closeAllMenus();
  });
});

function updateQualityOptions(selected) {
  document.querySelectorAll('.quality-option').forEach(btn => {
    if (btn.dataset.value === selected) {
      btn.classList.add('bg-[#A8C738]');
      btn.innerHTML = `<span class="font-bold">&#10003;</span> ${videoQualities[btn.dataset.value]}`;
    } else {
      btn.classList.remove('bg-[#A8C738]');
      btn.textContent = videoQualities[btn.dataset.value];
    }
  });
}

// ============================
// Inicialização
// ============================
updateSpeedOptions(1);
updateQualityOptions('auto');

// ============================
// Configuração HLS (se disponível)
// ============================
if (typeof Hls !== 'undefined' && Hls.isSupported() && video.dataset.hlsSource) {
  const hls = new Hls();
  hls.loadSource(video.dataset.hlsSource);
  hls.attachMedia(video);

  hls.on(Hls.Events.MANIFEST_PARSED, function() {
    console.log('HLS manifest carregado');
  });
}

// Adicione este código para garantir que o botão de qualidade esteja visível
document.addEventListener('DOMContentLoaded', () => {
  const qualityButton = document.getElementById('open-quality');
  if (qualityButton) {
    qualityButton.style.display = 'block';
  }
});

// ============================
// Picture-in-Picture
// ============================

// Verifica se o navegador suporta PiP
if ('pictureInPictureEnabled' in document) {
  // Mostra o botão PiP apenas se suportado
  pipButton.style.display = 'flex';

  // Adiciona o evento de clique
  pipButton.addEventListener('click', async () => {
    try {
      if (document.pictureInPictureElement) {
        // Sai do modo PiP
        await document.exitPictureInPicture();
      } else {
        // Entra no modo PiP
        await video.requestPictureInPicture();
      }
    } catch (err) {
      console.error('Erro ao alternar Picture-in-Picture:', err);
    }
  });

  // Atualiza o estado do botão quando PiP é ativado/desativado
  video.addEventListener('enterpictureinpicture', () => {
    pipButton.classList.add('text-[#A8C738]');
  });

  video.addEventListener('leavepictureinpicture', () => {
    pipButton.classList.remove('text-[#A8C738]');
  });
} else {
  // Esconde o botão se PiP não for suportado
  pipButton.style.display = 'none';
}

// Trata o erro de PiP não disponível
video.addEventListener('loadedmetadata', () => {
  if (!document.pictureInPictureEnabled || video.disablePictureInPicture) {
    pipButton.style.display = 'none';
  }
});