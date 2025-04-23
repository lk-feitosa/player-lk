// ============================
// Referências aos elementos do DOM
// ============================
const video = document.getElementById('video'); // Elemento de vídeo
const playPauseBtn = document.getElementById('play-pause'); // Botão de play/pause
const volumeBtn = document.getElementById('volume-mute'); // Botão de volume/mute
const timeRemaining = document.getElementById('timeReaming'); // Elemento para exibir o tempo restante do vídeo

// Ícones para alternância de estado
const playIcon = playPauseBtn.querySelector('.fa-play'); // Ícone de play
const pauseIcon = playPauseBtn.querySelector('.fa-pause'); // Ícone de pause
const volumeIcon = volumeBtn.querySelector('.fa-volume-high'); // Ícone de volume alto
const muteIcon = volumeBtn.querySelector('.fa-volume-xmark'); // Ícone de mute

const fullscreenBtn = document.getElementById('fullscreen'); // Botão de fullscreen
const expandIcon = fullscreenBtn.querySelector('.fa-expand'); // Ícone de expandir fullscreen
const compressIcon = fullscreenBtn.querySelector('.fa-compress'); // Ícone de sair do fullscreen
const videoContainer = document.getElementById('video-container'); // Contêiner do vídeo
const player = document.getElementById('player'); // Contêiner principal do player

const progressBar = document.getElementById('progress-bar'); // Barra de progresso
const progress = document.getElementById('progress'); // Indicador de progresso dentro da barra
const hoverTimer = document.getElementById('hover-time'); // Elemento para exibir o tempo ao passar o mouse na barra

// ============================
// Estado inicial dos ícones
// ============================
// Define quais ícones devem estar ocultos inicialmente
pauseIcon.classList.add('hidden'); // Oculta o ícone de pause
muteIcon.classList.add('hidden'); // Oculta o ícone de mute
compressIcon.classList.add('hidden'); // Oculta o ícone de sair do fullscreen

// ============================
// Play/Pause por botão
// ============================
// Alterna entre play e pause ao clicar no botão
playPauseBtn.addEventListener('click', () => {
  video.paused ? video.play() : video.pause();
});

// ============================
// Play/Pause clicando no vídeo
// ============================
// Alterna entre play e pause ao clicar diretamente no vídeo
video.addEventListener('click', (e) => {
  if (e.target === video) {
    video.paused ? video.play() : video.pause();
  }
});

// ============================
// Alternância de ícones Play/Pause
// ============================
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
// Tempo restante
// ============================
// Atualiza o tempo restante do vídeo durante a reprodução
video.addEventListener('timeupdate', () => {
  const remaining = video.duration - video.currentTime; // Calcula o tempo restante
  const minutes = Math.floor(remaining / 60); // Minutos restantes
  const seconds = Math.floor(remaining % 60).toString().padStart(2, '0'); // Segundos restantes
  timeRemaining.textContent = `-${minutes}:${seconds}`; // Exibe o tempo restante no formato -MM:SS
});

// ============================
// Volume / Mute
// ============================
// Alterna entre mudo e som ao clicar no botão de volume
volumeBtn.addEventListener('click', () => {
  video.muted = !video.muted; // Alterna o estado de mute

  // Atualiza os ícones de volume com base no estado de mute
  volumeIcon.style.display = video.muted ? 'none' : 'inline'; // Exibe ou oculta o ícone de volume
  muteIcon.style.display = video.muted ? 'inline' : 'none'; // Exibe ou oculta o ícone de mute
});

// ============================
// Fullscreen
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
  player.classList.toggle('p-6', !isFullscreen);
});

// ============================
// Progress bar
// ============================
// Atualiza a barra de progresso com base no tempo atual do vídeo
video.addEventListener('timeupdate', () => {
  const progressPercentage = (video.currentTime / video.duration) * 100; // Calcula o progresso em porcentagem
  progress.style.width = `${progressPercentage}%`; // Atualiza a largura da barra de progresso
});

// Permite avançar ou retroceder no vídeo ao clicar na barra de progresso
progressBar.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect(); // Obtém as dimensões da barra de progresso
  const x = e.clientX - rect.left; // Calcula a posição do clique em relação à barra
  const percent = x / rect.width; // Calcula a porcentagem correspondente ao clique
  video.currentTime = video.duration * percent; // Atualiza o tempo do vídeo com base na porcentagem
});