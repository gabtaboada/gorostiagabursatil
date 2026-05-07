const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const closeMenuBtn = document.querySelector('.close-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav-list a');

function toggleMenu() {
    mobileMenu.classList.toggle('active');
}

mobileMenuBtn.addEventListener('click', toggleMenu);
closeMenuBtn.addEventListener('click', toggleMenu);

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});

// Helper for smooth scrolling adjustment
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// Inject WhatsApp Button
document.addEventListener('DOMContentLoaded', function () {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    let waLink;
    if (isMobile) {
        waLink = 'https://wa.me/5491131388504';
    } else {
        waLink = 'https://web.whatsapp.com/send?phone=5491131388504';
    }

    const waButton = document.createElement('a');
    waButton.href = waLink;
    waButton.className = 'whatsapp-float';
    waButton.target = '_blank';
    waButton.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';

    document.body.appendChild(waButton);
});
// RosVal dropdown – también se puede abrir con click en mobile
const dropdown = document.getElementById('rosvalDropdown');
if (dropdown) {
    dropdown.addEventListener('click', function (e) {
        this.classList.toggle('open');
        e.stopPropagation();
    });
    document.addEventListener('click', function () {
        dropdown.classList.remove('open');
    });
}
// ─── YouTube: último video de la playlist ───
document.addEventListener('DOMContentLoaded', function () {
    const wrap = document.getElementById('yt-player-wrap');
    if (!wrap) return;
 
    const playlistId = 'PLk6WZTxCpjQsVbgDrU7frAhqjimy4CuuD';
    const channelUrl = 'https://www.youtube.com/playlist?list=' + playlistId;
 
    // Intentamos obtener el último video via RSS (no requiere API key)
    // YouTube expone un feed público por canal, buscamos el channel ID del canal
    // Como la playlist es del canal, usamos el primer video de la lista via oembed
    const rssUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' +
        encodeURIComponent('https://www.youtube.com/feeds/videos.xml?playlist_id=' + playlistId);
 
    fetch(rssUrl)
        .then(r => r.json())
        .then(data => {
            if (data.status === 'ok' && data.items && data.items.length > 0) {
                const latest = data.items[0];
                // Extraer video ID del link
                const match = latest.link.match(/v=([^&]+)/);
                const videoId = match ? match[1] : null;
 
                if (videoId) {
                    buildPlayer(wrap, videoId, latest.title, channelUrl);
                } else {
                    buildFallback(wrap, channelUrl);
                }
            } else {
                buildFallback(wrap, channelUrl);
            }
        })
        .catch(() => buildFallback(wrap, channelUrl));
 
    function buildPlayer(wrap, videoId, title, channelUrl) {
        // Usamos thumbnail clicable que carga el iframe al hacer click (mejor performance)
        const thumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        wrap.innerHTML = `
            <div class="yt-facade" data-video-id="${videoId}" data-channel="${channelUrl}">
                <img src="${thumb}" alt="${title || 'Ver video'}" class="yt-thumb"
                     onerror="this.src='https://img.youtube.com/vi/${videoId}/hqdefault.jpg'">
                <div class="yt-play-btn" aria-label="Reproducir video">
                    <i class="fa-solid fa-play"></i>
                </div>
                <div class="yt-video-title">${title || ''}</div>
            </div>`;
 
        wrap.querySelector('.yt-facade').addEventListener('click', function () {
            const id = this.dataset.videoId;
            wrap.innerHTML = `<iframe
                src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1"
                title="Video de Gorostiaga Bursátil"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen loading="lazy"></iframe>`;
        });
    }
 
    function buildFallback(wrap, channelUrl) {
        wrap.innerHTML = `
            <a href="${channelUrl}" target="_blank" class="yt-fallback-link">
                <i class="fa-brands fa-youtube"></i>
                <span>Ver videos en YouTube</span>
            </a>`;
    }
});
 