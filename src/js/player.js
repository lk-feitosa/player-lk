// ===================================================
// 1. REFERÊNCIAS DOM
// ===================================================

// Container Principal e Vídeo
const video = document.getElementById('video');
const videoContainer = document.getElementById('video-container');
const player = document.getElementById('player');

// Botões de Controle de Mídia
const playPauseBtn = document.getElementById('play-pause');
const playIcon = playPauseBtn.querySelector('.fa-play');
const pauseIcon = playPauseBtn.querySelector('.fa-pause');

// Controles de Áudio
const volumeBtn = document.getElementById('volume-mute');
const volumeIcon = volumeBtn.querySelector('.fa-volume-high');
const muteIcon = volumeBtn.querySelector('.fa-volume-xmark');
const volumeSlider = document.getElementById('volume-slider');

// Controles de Visualização
const fullscreenBtn = document.getElementById('fullscreen');
const expandIcon = fullscreenBtn.querySelector('.fa-expand');
const compressIcon = fullscreenBtn.querySelector('.fa-compress');
const pipButton = document.getElementById('pip');

// Sistema de Progresso
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const timeRemaining = document.getElementById('timeRemaining');

// Display de Tempo ao Hover
const hoverTimeDisplay = document.createElement('div');
hoverTimeDisplay.className = 'absolute bottom-[45px] bg-gray-800 text-white px-2 py-1 rounded text-sm hidden transform -translate-x-1/2';
videoContainer.appendChild(hoverTimeDisplay);

// Sistema de Menus
const settingsBtn = document.getElementById('menu-settings');
const settingsMenu = document.getElementById('settings-menu');
const controles = document.getElementById('controles');

// Submenus de Configurações
const openSpeed = document.getElementById('open-speed');
const openQuality = document.getElementById('open-quality');
const submenuSpeed = document.getElementById('submenu-speed');
const submenuQuality = document.getElementById('submenu-quality');

// Verificação de elementos obrigatórios
if (!video || !videoContainer || !player) {
  console.error('Elementos essenciais do player não encontrados');
  throw new Error('Player não pode ser inicializado');
}

// ===================================================
// 2. CONFIGURAÇÃO INICIAL
// ===================================================

// Estado inicial dos ícones
pauseIcon.classList.add('hidden');
muteIcon.classList.add('hidden');
compressIcon.classList.add('hidden');

// ===================================================
// 3. ATALHOS DE TECLADO
// ===================================================

document.addEventListener('keydown', (e) => {
  if (document.activeElement.tagName === 'INPUT') return;
  
  switch(e.key.toLowerCase()) {
      // Play/Pause (Espaço ou K)
      case ' ':
      case 'k':
          e.preventDefault();
          video.paused ? video.play() : video.pause();
          break;
      // Tela Cheia (F)    
      case 'f':
          e.preventDefault();
          fullscreenBtn.click();
          break;
      // Mudo (M)    
      case 'm':
          e.preventDefault();
          volumeBtn.click();
          break;
      // Retroceder 5s    
      case 'arrowleft':
          e.preventDefault();
          video.currentTime = Math.max(video.currentTime - 5, 0);
          break;
      // Avançar 5s    
      case 'arrowright':
          e.preventDefault();
          video.currentTime = Math.min(video.currentTime + 5, video.duration);
          break;
      // Aumentar Volume    
      case 'arrowup':
          e.preventDefault();
          video.volume = Math.min(video.volume + 0.1, 1);
          volumeSlider.value = video.volume;
          updateVolumeIcon();
          break;
      // Diminuir Volume    
      case 'arrowdown':
          e.preventDefault();
          video.volume = Math.max(video.volume - 0.1, 0);
          volumeSlider.value = video.volume;
          updateVolumeIcon();
          break;
  }
});

// ===================================================
// 4. CONTROLES DE REPRODUÇÃO
// ===================================================

// Play/Pause ao clicar no botão
playPauseBtn.addEventListener('click', () => {
  video.paused ? video.play() : video.pause();
});

// Play/Pause ao clicar no vídeo
video.addEventListener('click', (e) => {
  if (e.target === video) {
      video.paused ? video.play() : video.pause();
  }
});

// Atualiza ícone de play/pause
video.addEventListener('play', () => {
  playIcon.style.display = 'none';
  pauseIcon.style.display = 'inline';
});

video.addEventListener('pause', () => {
  playIcon.style.display = 'inline';
  pauseIcon.style.display = 'none';
});

// ===================================================
// 5. CONTROLES DE VOLUME
// ===================================================

// Toggle Mudo
volumeBtn.addEventListener('click', () => {
  video.muted = !video.muted;
  updateVolumeIcon();
});

// Ajuste do Volume
volumeSlider.addEventListener('input', () => {
  video.volume = volumeSlider.value;
  video.muted = video.volume === 0;
  updateVolumeIcon();
});

// Atualiza ícone do volume
function updateVolumeIcon() {
  const isMuted = video.volume === 0 || video.muted;
  volumeIcon.style.display = isMuted ? 'none' : 'inline';
  muteIcon.style.display = isMuted ? 'inline' : 'none';
}

// ===================================================
// 6. CONTROLES DE TELA CHEIA
// ===================================================

// Toggle Tela Cheia
fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
      videoContainer.requestFullscreen().catch(err => {
          console.error("Erro ao tentar entrar em fullscreen:", err);
      });
  } else {
      document.exitFullscreen();
  }
});

// Atualiza estado da tela cheia
document.addEventListener('fullscreenchange', () => {
  const isFullscreen = !!document.fullscreenElement;
  expandIcon.style.display = isFullscreen ? 'none' : 'inline';
  compressIcon.style.display = isFullscreen ? 'inline' : 'none';
  player.classList.toggle('rounded-xl', !isFullscreen);
  player.classList.toggle('p-1', !isFullscreen);
});

// Duplo clique para tela cheia
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

// ===================================================
// 7. SISTEMA DE PROGRESSO
// ===================================================

// Atualização da barra de progresso
function updateProgressBar() {
  const progressPercentage = (video.currentTime / video.duration) * 100;
  progress.style.width = `${progressPercentage}%`;
  requestAnimationFrame(updateProgressBar);
}

// Inicia atualização quando o vídeo começa
video.addEventListener('play', () => {
  requestAnimationFrame(updateProgressBar);
});

// Atualiza tempo restante
video.addEventListener('timeupdate', () => {
  if (!video.duration) return; // Proteção contra NaN
  const remaining = video.duration - video.currentTime;
  const minutes = Math.floor(remaining / 60);
  const seconds = Math.floor(remaining % 60).toString().padStart(2, '0');
  timeRemaining.textContent = `-${minutes}:${seconds}`;
});

// Formatação do tempo para exibição
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Preview de tempo ao passar o mouse
progressBar.addEventListener('mousemove', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const percent = Math.min(Math.max(0, e.clientX - rect.left), rect.width) / rect.width;
  const time = video.duration * percent;
  
  hoverTimeDisplay.style.left = `${e.clientX}px`;
  hoverTimeDisplay.textContent = formatTime(time);
  hoverTimeDisplay.classList.remove('hidden');
});

progressBar.addEventListener('mouseleave', () => {
  hoverTimeDisplay.classList.add('hidden');
});

// ===================================================
// 8. SISTEMA DE DRAG AND SEEK
// ===================================================

let isDragging = false;

// Função principal de busca no vídeo
function seek(e) {
  const rect = progressBar.getBoundingClientRect();
  const x = e.touches ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
  let percent = Math.max(0, Math.min(1, x / rect.width));
  video.currentTime = video.duration * percent;
}

// Eventos de Mouse
progressBar.addEventListener('mousedown', (e) => {
  isDragging = true;
  seek(e);
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
      seek(e);
      // Atualiza preview durante o arrasto
      const rect = progressBar.getBoundingClientRect();
      const percent = Math.min(Math.max(0, e.clientX - rect.left), rect.width) / rect.width;
      const time = video.duration * percent;
      
      hoverTimeDisplay.style.left = `${e.clientX}px`;
      hoverTimeDisplay.textContent = formatTime(time);
      hoverTimeDisplay.classList.remove('hidden');
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

// Eventos de Touch
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

// ===================================================
// 9. SISTEMA DE AUTO-HIDE
// ===================================================

let hideControlsTimeout = null;
let mouseOverControls = false;
let mouseOverProgressBar = false;

// Exibe os controles
function showControls() {
  controles.classList.replace('opacity-0', 'opacity-100');
  progressBar.classList.replace('opacity-0', 'opacity-100');
  resetHideControlsTimer();
}

// Esconde os controles
function hideControls() {
  if (!mouseOverControls && !mouseOverProgressBar) {
      controles.classList.replace('opacity-100', 'opacity-0');
      progressBar.classList.replace('opacity-100', 'opacity-0');
  }
}

// Reinicia o timer de ocultação
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

// Reset do timer em eventos do vídeo
video.addEventListener('play', resetHideControlsTimer);
video.addEventListener('pause', resetHideControlsTimer);
videoContainer.addEventListener('click', showControls);

// ===================================================
// 10. SISTEMA DE MENUS
// ===================================================

// Fecha todos os menus
function closeAllMenus() {
  settingsMenu.classList.remove('opacity-100');
  settingsMenu.classList.add('opacity-0', 'pointer-events-none');
  submenuSpeed.classList.add('hidden');
  submenuQuality.classList.add('hidden');
}

// Previne propagação de cliques nos menus
[settingsMenu, submenuSpeed, submenuQuality].forEach(menu => {
  if (menu) menu.addEventListener('click', e => e.stopPropagation());
});

// Controle do menu principal
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

// Fecha menus ao clicar fora
document.addEventListener('click', (e) => {
  if (!settingsMenu.contains(e.target) && !settingsBtn.contains(e.target)) {
      closeAllMenus();
  }
});

// ===================================================
// 11. CONTROLE DE VELOCIDADE
// ===================================================

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

// Gerenciamento das opções de velocidade
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

// ===================================================
// 12. CONTROLE DE QUALIDADE
// ===================================================

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

// Gerenciamento das opções de qualidade
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

// ===================================================
// 13. PICTURE-IN-PICTURE
// ===================================================

if ('pictureInPictureEnabled' in document) {
  pipButton.style.display = 'flex';

  pipButton.addEventListener('click', async () => {
      try {
          if (document.pictureInPictureElement) {
              await document.exitPictureInPicture();
          } else {
              await video.requestPictureInPicture();
          }
      } catch (err) {
          console.error('Erro ao alternar Picture-in-Picture:', err);
      }
  });

  video.addEventListener('enterpictureinpicture', () => {
      pipButton.classList.add('text-[#A8C738]');
  });

  video.addEventListener('leavepictureinpicture', () => {
      pipButton.classList.remove('text-[#A8C738]');
  });
} else {
  pipButton.style.display = 'none';
}

// ===================================================
// 14. INICIALIZAÇÃO E CONFIGURAÇÃO HLS
// ===================================================

// Inicialização dos controles
updateSpeedOptions(1);
updateQualityOptions('auto');

// Configuração HLS (se disponível)
if (typeof Hls !== 'undefined' && Hls.isSupported() && video.dataset.hlsSource) {
  const hls = new Hls();
  hls.loadSource(video.dataset.hlsSource);
  hls.attachMedia(video);

  hls.on(Hls.Events.MANIFEST_PARSED, function() {
      console.log('HLS manifest carregado');
  });
}

// Garantir visibilidade do botão de qualidade
document.addEventListener('DOMContentLoaded', () => {
  const qualityButton = document.getElementById('open-quality');
  if (qualityButton) {
      qualityButton.style.display = 'block';
  }
  showControls(); // Mostra controles inicialmente
});

// Tratamento de erro PiP
video.addEventListener('loadedmetadata', () => {
  if (!document.pictureInPictureEnabled || video.disablePictureInPicture) {
      pipButton.style.display = 'none';
  }
});

// Limpeza ao desmontar
window.addEventListener('unload', () => {
  clearTimeout(hideControlsTimeout);
  video.removeAttribute('src');
  video.load();
});