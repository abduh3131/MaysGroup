// Mobile menu
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle('active');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.remove('active'));
    });

    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });
}

// Carousel (matches main site behavior)
const initCarousel = (containerId, images) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    const track = document.createElement('div');
    track.className = 'carousel-container';

    images.forEach((src, index) => {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        item.onclick = () => openLightbox(index, images);

        const img = document.createElement('img');
        img.src = src;
        img.loading = 'lazy';
        item.appendChild(img);
        track.appendChild(item);
    });

    const controls = document.createElement('div');
    controls.className = 'carousel-controls';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'control-btn';
    prevBtn.innerHTML = '<i data-lucide="chevron-left"></i>';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'control-btn';
    nextBtn.innerHTML = '<i data-lucide="chevron-right"></i>';

    controls.appendChild(prevBtn);
    controls.appendChild(nextBtn);

    container.appendChild(track);
    container.appendChild(controls);

    let currentIndex = 0;
    const items = track.querySelectorAll('.carousel-item');

    const updateCarousel = () => {
        items.forEach((item, i) => {
            item.className = 'carousel-item hidden';
            if (i === currentIndex) {
                item.classList.remove('hidden');
                item.classList.add('active');
            } else if (i === (currentIndex - 1 + items.length) % items.length) {
                item.classList.remove('hidden');
                item.classList.add('prev');
            } else if (i === (currentIndex + 1) % items.length) {
                item.classList.remove('hidden');
                item.classList.add('next');
            }
        });
        lucide.createIcons();
    };

    const next = () => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    };

    const prev = () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    };

    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);

    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) next();
        if (touchStartX - touchEndX < -50) prev();
    });

    updateCarousel();
};

const openLightbox = (index, images) => {
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.95)', zIndex: 10000, display: 'flex',
        alignItems: 'center', justifyContent: 'center'
    });

    const img = document.createElement('img');
    img.src = images[index];
    Object.assign(img.style, { maxHeight: '90vh', maxWidth: '90vw', borderRadius: '12px' });

    overlay.onclick = () => document.body.removeChild(overlay);
    overlay.appendChild(img);
    document.body.appendChild(overlay);
};

window.addEventListener('load', () => {
    const gallery = document.getElementById('pm-gallery');
    if (gallery) {
        const images = [13, 14, 15, 16, 17, 18].map(num =>
            `../images/services/MaysGroup_Small_${num.toString().padStart(3, '0')}.jpg`);
        initCarousel('pm-gallery', images);
    }
});
