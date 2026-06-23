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
// Inject Chatbot Button
document.addEventListener('DOMContentLoaded', function () {

    const chatbotButton = document.createElement('a');

    chatbotButton.href = 'https://gorostiagabursatil.com/ia/index.html';
    chatbotButton.className = 'chatbot-float';
    const isInsidePages = window.location.pathname.includes('/pages/');
    const chatbotImage = isInsidePages
        ? '../assets/img/chatbot.png'
        : './assets/img/chatbot.png';
    chatbotButton.innerHTML = `
    <span class="chatbot-badge">IA</span>
    <img src="${chatbotImage}" alt="Chatbot">
`;

    document.body.appendChild(chatbotButton);

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
// ─── YouTube: último video de cada playlist ───
document.addEventListener('DOMContentLoaded', function () {

    const players = document.querySelectorAll('.yt-player-wrap');

    if (!players.length) return;

    players.forEach(wrap => {

        const playlistId = wrap.dataset.playlist;

        if (!playlistId) return;

        const channelUrl =
            'https://www.youtube.com/playlist?list=' + playlistId;

        const rssUrl =
            'https://api.rss2json.com/v1/api.json?rss_url=' +
            encodeURIComponent(
                'https://www.youtube.com/feeds/videos.xml?playlist_id=' + playlistId
            );

        fetch(rssUrl)
            .then(r => r.json())
            .then(data => {

                console.log(data);

                if (
                    data.status === 'ok' &&
                    data.items &&
                    data.items.length > 0
                ) {

                    const latest = data.items[0];

                    const match =
                        latest.link.match(/v=([^&]+)/);

                    const videoId =
                        match ? match[1] : null;

                    if (videoId) {

                        buildPlayer(
                            wrap,
                            videoId,
                            latest.title,
                            channelUrl
                        );

                    } else {

                        buildFallback(
                            wrap,
                            channelUrl
                        );

                    }

                } else {

                    buildFallback(
                        wrap,
                        channelUrl
                    );

                }

            })
            .catch(error => {

                console.error(error);

                buildFallback(
                    wrap,
                    channelUrl
                );

            });

    });

    function buildPlayer(wrap, videoId, title, channelUrl) {

        const thumb =
            `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

        wrap.innerHTML = `
            <div class="yt-facade"
                 data-video-id="${videoId}">

                <img
                    src="${thumb}"
                    alt="${title || 'Ver video'}"
                    class="yt-thumb"
                    onerror="this.src='https://img.youtube.com/vi/${videoId}/hqdefault.jpg'">

                <div class="yt-play-btn">
                    <i class="fa-solid fa-play"></i>
                </div>

                <div class="yt-video-title">
                    ${title || ''}
                </div>

            </div>
        `;

        wrap.querySelector('.yt-facade')
            .addEventListener('click', function () {

                const id = this.dataset.videoId;

                wrap.innerHTML = `
                    <iframe
                        src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1"
                        title="Video de Gorostiaga Bursátil"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                        loading="lazy">
                    </iframe>
                `;
            });
    }

    function buildFallback(wrap, channelUrl) {

        wrap.innerHTML = `
            <a href="${channelUrl}"
               target="_blank"
               class="yt-fallback-link">

                <i class="fa-brands fa-youtube"></i>
                <span>Ver videos en YouTube</span>

            </a>
        `;
    }

});
/* slider index carosuel*/
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
const container = document.querySelector(".our-work");
const list = document.querySelector(".carousel__nav");
const listItems = gsap.utils.toArray(".carousel__nav__item", list);
const slides = gsap.utils.toArray(".carousel__item");
const tl = gsap.timeline();
const myST = ScrollTrigger.create({
    animation: tl,
    id: "st",
    trigger: container,
    start: "top top",
    end: "+=" + container.clientHeight * (slides.length - 1),
    pin: container,
    scrub: true,
    snap: {
        snapTo: 1 / (slides.length - 1)
    },
    markers: false
})

gsap.set(slides, { xPercent: () => { return (window.innerWidth < 768 ? 125 : 0) }, yPercent: () => { return (window.innerWidth > 768 ? 125 : 0) }, scale: 0.5, opacity: 0 });
listItems.forEach((item, i) => {
    item.addEventListener("click", e => {
        e.preventDefault();
        const percent = tl.labels[e.target.getAttribute("data-target")] / tl.totalDuration();
        const scrollPos = myST.start + (myST.end - myST.start) * percent;
        gsap.to(window, { duration: 2, scrollTo: scrollPos });
    });

    const previousItem = listItems[i - 1];
    if (previousItem) {
        tl
            .to(item, { background: "rgb(114 186 255)", boxShadow: '0 0 16px #d96411' }, 0.5 * (i - 1))
            .to(
                slides[i],
                {
                    opacity: 1,
                    yPercent: 0,
                    xPercent: 0,
                    scale: 1,
                },
                '<'
            )
            .to(previousItem, { backgroundColor: '#424b58', boxShadow: '0 0 16px transparent' }, '<')
            .to(
                slides[i - 1],
                {
                    opacity: 0,
                    yPercent: () => { return (window.innerWidth > 768 ? -125 : 0) },
                    xPercent: () => { return (window.innerWidth < 768 ? -125 : 0) },
                    scale: 0.5,
                },
                '<'
            ).add("our-work-" + (++i))
    } else {
        gsap.set(item,  { background: "rgb(114 186 255)", boxShadow: '0 0 16px #d96411' });
        gsap.to(slides[i], { yPercent: 0, xPercent: 0, opacity: 1, scale: 1, duration: 0 }, 0);
        tl.add("our-work-" + (++i), "+=0")
    }
});

/* index prueba */

gsap.to(".floating-card-1",{
    y:-18,
    duration:2.5,
    repeat:-1,
    yoyo:true,
    ease:"sine.inOut"
});

gsap.to(".floating-card-2",{
    y:18,
    duration:3,
    repeat:-1,
    yoyo:true,
    ease:"sine.inOut"
});
/*
gsap.to(".floating-card-3",{
    y:-10,
    duration:2,
    repeat:-1,
    yoyo:true,
    ease:"sine.inOut"
});
*/
gsap.to(".phone-device",{
    rotateY:-8,
    duration:4,
    repeat:-1,
    yoyo:true,
    ease:"sine.inOut"
});
/* mensaje feedback suscribirse*/
console.log('FORMULARIO JS CARGADO');

const form = document.getElementById('form-captacion-reportes');

if (form) {

    form.addEventListener('submit', async function (e) {

        e.preventDefault();

        const feedback = document.getElementById('form-feedback');

        const formData = new FormData(form);

        try {

            const response = await fetch(form.action, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            feedback.style.display = 'block';

            if (data.success) {

                feedback.className = 'form-feedback success';

                feedback.innerHTML =
                    '✅ ' + data.message;

                form.reset();

            } else {

                feedback.className = 'form-feedback error';

                feedback.innerHTML =
                    '❌ ' + data.message;
            }

        } catch (error) {

            feedback.style.display = 'block';

            feedback.className = 'form-feedback error';

            feedback.innerHTML =
                '❌ No se pudo conectar con el servidor.';
        }

    });

}
