// ============================
// Referências aos elementos do DOM
// ============================
// Elementos principais do player
const video = document.getElementById('video'); // Elemento de vídeo
const playPauseBtn = document.getElementById('play-pause'); // Botão de play/pause
const volumeBtn = document.getElementById('volume-mute'); // Botão de volume/mute
const timeRemaining = document.getElementById('timeRemaining'); // Exibe o tempo restante do vídeo

// Ícones para alternância de estado
const playIcon = playPauseBtn.querySelector('.fa-play'); // Ícone de play
const pauseIcon = playPauseBtn.querySelector('.fa-pause'); // Ícone de pause
const volumeIcon = volumeBtn.querySelector('.fa-volume-high'); // Ícone de volume alto
const muteIcon = volumeBtn.querySelector('.fa-volume-xmark'); // Ícone de mute
const volumeSlider = document.getElementById('volume-slider'); // Controle deslizante de volume

// Elementos relacionados ao fullscreen
const fullscreenBtn = document.getElementById('fullscreen'); // Botão de fullscreen
const expandIcon = fullscreenBtn.querySelector('.fa-expand'); // Ícone de expandir fullscreen
const compressIcon = fullscreenBtn.querySelector('.fa-compress'); // Ícone de sair do fullscreen
const videoContainer = document.getElementById('video-container'); // Contêiner do vídeo
const player = document.getElementById('player'); // Contêiner principal do player

// Elementos da barra de progresso
const progressBar = document.getElementById('progress-bar'); // Barra de progresso
const progress = document.getElementById('progress'); // Indicador de progresso dentro da barra
const hoverTimer = document.getElementById('hover-time'); // Exibe o tempo ao passar o mouse na barra

// ============================
// Configuração inicial dos ícones
// ============================
// Define quais ícones devem estar ocultos inicialmente
pauseIcon.classList.add('hidden'); // Oculta o ícone de pause
muteIcon.classList.add('hidden'); // Oculta o ícone de mute
compressIcon.classList.add('hidden'); // Oculta o ícone de sair do fullscreen

// ============================
// Controle de Play/Pause
// ============================
// Alterna entre play e pause ao clicar no botão
playPauseBtn.addEventListener('click', () => {
  video.paused ? video.play() : video.pause();
});

// Alterna entre play e pause ao clicar diretamente no vídeo
video.addEventListener('click', (e) => {
  if (e.target === video) {
    video.paused ? video.play() : video.pause();
  }
});

// Atualiza os ícones de play e pause com base no estado do vídeo
video.addEventListener('play', () => {
  playIcon.style.display = 'none'; // Oculta o ícone de play
  pauseIcon.style.display = 'inline'; // Exibe o ícone de pause
});

video.addEventListener('pause', () => {
  playIcon.style.display = 'inline'; // Exibe o ícone de play
  pauseIcon.style.display = 'none'; // Oculta o ícone de pause
});

// ============================
// Exibição do tempo restante
// ============================
// Atualiza o tempo restante do vídeo durante a reprodução
video.addEventListener('timeupdate', () => {
  const remaining = video.duration - video.currentTime; // Calcula o tempo restante
  const minutes = Math.floor(remaining / 60); // Minutos restantes
  const seconds = Math.floor(remaining % 60).toString().padStart(2, '0'); // Segundos restantes
  timeRemaining.textContent = `-${minutes}:${seconds}`; // Exibe o tempo restante no formato -MM:SS
});

// ============================
// Controle de Volume / Mute
// ============================
// Alterna entre mudo e som ao clicar no botão de volume
volumeBtn.addEventListener('click', () => {
  video.muted = !video.muted; // Alterna o estado de mute

  // Atualiza os ícones de volume com base no estado de mute
  volumeIcon.style.display = video.muted ? 'none' : 'inline'; // Exibe ou oculta o ícone de volume
  muteIcon.style.display = video.muted ? 'inline' : 'none'; // Exibe ou oculta o ícone de mute
});

// Atualiza o ícone de volume com base no estado atual
function updateVolumeIcon() {
  if (video.volume === 0 || video.muted) {
    volumeIcon.style.display = 'none'; // Oculta o ícone de volume alto
    muteIcon.style.display = 'inline'; // Exibe o ícone de mute
  } else {
    volumeIcon.style.display = 'inline'; // Exibe o ícone de volume alto
    muteIcon.style.display = 'none'; // Oculta o ícone de mute
  }
}

// Atualiza o volume ao mover o slider
volumeSlider.addEventListener('input', () => {
  video.volume = volumeSlider.value; // Define o volume com base no slider
  video.muted = video.volume === 0; // Muta o vídeo se o volume for 0
  updateVolumeIcon(); // Atualiza o ícone de volume
});

// ============================
// Controle de Fullscreen
// ============================
// Alterna entre entrar e sair do modo fullscreen
fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    videoContainer.requestFullscreen().catch(err => {
      console.error("Erro ao tentar entrar em fullscreen:", err); // Exibe erro no console, se houver
    });
  } else {
    document.exitFullscreen(); // Sai do modo fullscreen
  }
});

// Atualiza os ícones e estilos ao entrar ou sair do modo fullscreen
document.addEventListener('fullscreenchange', () => {
  const isFullscreen = !!document.fullscreenElement; // Verifica se está em fullscreen

  // Alterna os ícones de fullscreen
  expandIcon.style.display = isFullscreen ? 'none' : 'inline'; // Exibe o ícone de expandir
  compressIcon.style.display = isFullscreen ? 'inline' : 'none'; // Exibe o ícone de sair do fullscreen

  // Remove ou adiciona padding e bordas arredondadas no modo fullscreen
  player.classList.toggle('rounded-xl', !isFullscreen);
  player.classList.toggle('p-1', !isFullscreen);
});

// ============================
// Barra de Progresso
// ============================
// Atualiza a barra de progresso com base no tempo atual do vídeo
function updateProgressBar() {
  const progressPercentage = (video.currentTime / video.duration) * 100; // Calcula o progresso em porcentagem
  progress.style.width = `${progressPercentage}%`; // Atualiza a largura da barra de progresso
  requestAnimationFrame(updateProgressBar); // Chama a função novamente para animação contínua
}

// Inicia a atualização da barra de progresso ao reproduzir o vídeo
video.addEventListener('play', () => {
  requestAnimationFrame(updateProgressBar); // Inicia a animação da barra de progresso
});

// Permite avançar ou retroceder no vídeo ao clicar na barra de progresso
progressBar.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect(); // Obtém as dimensões da barra de progresso
  const x = e.clientX - rect.left; // Calcula a posição do clique em relação à barra
  const percent = x / rect.width; // Calcula a porcentagem correspondente ao clique
  video.currentTime = video.duration * percent; // Atualiza o tempo do vídeo com base na porcentagem
});

// ============================
// Barra de Progresso - Drag and Seek (Arrastar para buscar)
// ============================

// Variável para controlar se o usuário está arrastando a barra de progresso
let isDragging = false;

// Inicia o arraste ao pressionar o botão do mouse na barra de progresso
progressBar.addEventListener('mousedown', (e) => {
  isDragging = true; // Marca que está arrastando
  seek(e);           // Atualiza o tempo do vídeo imediatamente
});

// Atualiza o tempo do vídeo enquanto o mouse se move, se estiver arrastando
document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    seek(e);         // Atualiza o tempo do vídeo conforme a posição do mouse
  }
});

// Finaliza o arraste ao soltar o botão do mouse
document.addEventListener('mouseup', () => {
  isDragging = false; // Marca que parou de arrastar
});

// Função que calcula e define o tempo do vídeo com base na posição do mouse/touch na barra
function seek(e) {
  const rect = progressBar.getBoundingClientRect(); // Pega as dimensões da barra
  // Suporte a mouse e touch: calcula a posição X relativa à barra
  const x = e.touches ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
  let percent = x / rect.width;                      // Calcula a porcentagem da barra
  percent = Math.max(0, Math.min(1, percent));       // Garante que fique entre 0 e 1
  video.currentTime = video.duration * percent;      // Atualiza o tempo do vídeo
}

// ============================
// Suporte a dispositivos móveis (Touch)
// ============================

// Inicia o arraste ao tocar na barra de progresso
progressBar.addEventListener('touchstart', (e) => {
  isDragging = true; // Marca que está arrastando
  seek(e);           // Atualiza o tempo do vídeo imediatamente
});

// Atualiza o tempo do vídeo enquanto o dedo se move, se estiver arrastando
document.addEventListener('touchmove', (e) => {
  if (isDragging) seek(e); // Atualiza o tempo do vídeo conforme a posição do dedo
});

// Finaliza o arraste ao soltar o dedo
document.addEventListener('touchend', () => {
  isDragging = false; // Marca que parou de arrastar
});

// ============================
// Auto-hide dos controles do player (incluindo barra de progresso)
// ============================

// Referências aos controles e barra de progresso
const controles = document.getElementById('controles');
// progressBar já está definido acima

let hideControlsTimeout = null; // Timer para esconder os controles
let mouseOverControls = false;  // Flag para saber se o mouse está sobre os controles
let mouseOverProgressBar = false; // Flag para saber se o mouse está sobre a barra de progresso

// Função para mostrar os controles e a barra de progresso
function showControls() {
  controles.classList.remove('opacity-0');
  controles.classList.add('opacity-100');
  progressBar.classList.remove('opacity-0');
  progressBar.classList.add('opacity-100');
  resetHideControlsTimer();
}

// Função para esconder os controles e a barra de progresso
function hideControls() {
  // Só esconde se o mouse não estiver sobre os controles nem sobre a barra de progresso
  if (!mouseOverControls && !mouseOverProgressBar) {
    controles.classList.remove('opacity-100');
    controles.classList.add('opacity-0');
    progressBar.classList.remove('opacity-100');
    progressBar.classList.add('opacity-0');
  }
}

// Reinicia o timer para esconder os controles
function resetHideControlsTimer() {
  clearTimeout(hideControlsTimeout);
  hideControlsTimeout = setTimeout(hideControls, 1000); // 1 segundo
}

// Mostra controles ao mover o mouse sobre o vídeo
videoContainer.addEventListener('mousemove', showControls);

// Detecta quando o mouse entra/sai dos controles
controles.addEventListener('mouseenter', () => {
  mouseOverControls = true;
  showControls();
  clearTimeout(hideControlsTimeout);
});
controles.addEventListener('mouseleave', () => {
  mouseOverControls = false;
  resetHideControlsTimer();
});

// Detecta quando o mouse entra/sai da barra de progresso
progressBar.addEventListener('mouseenter', () => {
  mouseOverProgressBar = true;
  showControls();
  clearTimeout(hideControlsTimeout);
});
progressBar.addEventListener('mouseleave', () => {
  mouseOverProgressBar = false;
  resetHideControlsTimer();
});

// Esconde controles após play/pause, se não estiver sobre os controles ou barra
video.addEventListener('play', resetHideControlsTimer);
video.addEventListener('pause', resetHideControlsTimer);

// Mostra controles ao pausar/play manualmente
videoContainer.addEventListener('click', showControls);

// Inicialmente, mostra os controles
showControls();
