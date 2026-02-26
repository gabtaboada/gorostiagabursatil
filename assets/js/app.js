/* ══════════════════════════════════════════════
   GOROSTIAGA BURSÁTIL – app.js
   ══════════════════════════════════════════════ */

// ─── Año actual en footer ───────────────────────
document.getElementById('year').textContent = new Date().getFullYear();


// ─── Menú hamburguesa ───────────────────────────
const hamburger   = document.getElementById('hamburger');
const mainNav     = document.getElementById('main-nav');
const navOverlay  = document.getElementById('nav-overlay');

function openMenu() {
  hamburger.classList.add('open');
  mainNav.classList.add('open');
  navOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('open');
  mainNav.classList.remove('open');
  navOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  mainNav.classList.contains('open') ? closeMenu() : openMenu();
});
navOverlay.addEventListener('click', closeMenu);

// Cerrar al hacer click en un link del menú
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});


// ─── Header scroll shadow ───────────────────────
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 40
    ? '0 4px 24px rgba(0,0,0,0.4)'
    : 'none';
});


// ─── Último video de la playlist de YouTube ─────
// Usa la YouTube Data API v3 (no requiere auth para playlists públicas)
// IMPORTANTE: reemplazá YOUR_API_KEY con tu clave de la YouTube Data API.

const PLAYLIST_ID = 'PLk6WZTxCpjQsVbgDrU7frAhqjimy4CuuD';
const API_KEY     = 'YOUR_YOUTUBE_API_KEY'; // ← reemplazar con clave real

async function loadLastVideo() {
  const videoWrap = document.getElementById('video-wrap');

  // Si no hay clave, mostrar iframe estático al playlist
  if (!API_KEY || API_KEY === 'YOUR_YOUTUBE_API_KEY') {
    videoWrap.innerHTML = buildFallbackEmbed();
    return;
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems`
              + `?part=snippet&maxResults=1&playlistId=${PLAYLIST_ID}&key=${API_KEY}`;
    const res  = await fetch(url);
    const data = await res.json();

    if (data.items && data.items.length > 0) {
      const videoId = data.items[0].snippet.resourceId.videoId;
      videoWrap.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1"
          title="Gorostiaga Bursátil – Último video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>`;
    } else {
      videoWrap.innerHTML = buildFallbackEmbed();
    }
  } catch (err) {
    console.warn('YouTube API error, usando fallback embed:', err);
    videoWrap.innerHTML = buildFallbackEmbed();
  }
}

/**
 * Fallback: embed directo al primer video visible de la playlist.
 * Si la playlist es pública YouTube suele cargarlo correctamente.
 */
function buildFallbackEmbed() {
  return `
    <iframe
      src="https://www.youtube.com/embed?listType=playlist&list=${PLAYLIST_ID}&index=0&rel=0&modestbranding=1"
      title="Gorostiaga Bursátil – Playlist"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>`;
}

loadLastVideo();


// ─── Animación de aparición al scroll ────────────
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity  = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observar step cards
document.querySelectorAll('.step-card').forEach((card, i) => {
  card.style.opacity   = '0';
  card.style.transform = 'translateY(24px)';
  card.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
  observer.observe(card);
});


// ─── Modal PDF ───────────────────────────────────
function abrirPDF(src, titulo) {
  const modal    = document.getElementById('pdf-modal');
  const iframe   = document.getElementById('pdf-iframe');
  const titleEl  = document.getElementById('pdf-modal-title');
  const dlBtn    = document.getElementById('pdf-download-btn');

  titleEl.textContent = titulo;
  iframe.src          = src;
  dlBtn.href          = src;
  dlBtn.setAttribute('download', titulo + '.pdf');

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cerrarPDF() {
  const modal  = document.getElementById('pdf-modal');
  const iframe = document.getElementById('pdf-iframe');

  modal.classList.remove('open');
  document.body.style.overflow = '';
  // Pequeño delay para que la animación cierre antes de limpiar
  setTimeout(() => { iframe.src = ''; }, 300);
}

// Cerrar con Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') cerrarPDF();
});

// Cerrar al hacer click fuera del box
document.getElementById('pdf-modal').addEventListener('click', function(e) {
  if (e.target === this) cerrarPDF();
});