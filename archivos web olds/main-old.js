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
    const playlistId = 'PLk6WZTxCpjQsVbgDrU7frAhqjimy4CuuD';
    const wrap = document.getElementById('yt-player-wrap');
    if (!wrap) return;

    // El primer video de la playlist siempre es el más reciente
    // Usamos el embed directo de la playlist con index=1
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/videoseries?list=${playlistId}&index=1&rel=0&modestbranding=1`;
    iframe.title = 'Último video de Gorostiaga Bursátil';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';

    wrap.innerHTML = '';
    wrap.appendChild(iframe);
});