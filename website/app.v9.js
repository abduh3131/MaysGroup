// Reveal Animation
const reveal = () => {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    const elementVisible = 150;
    for (let i = 0; i < reveals.length; i++) {
        const elementTop = reveals[i].getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
}
window.addEventListener('scroll', reveal);
reveal();

// Mobile Menu
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle('active');
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });
}

// Carousel Logic
const initCarousel = (containerId, images) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear existing
    container.innerHTML = '';

    // Create DOM structure
    const track = document.createElement('div');
    track.className = 'carousel-container';

    images.forEach((src, index) => {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        // Add click to fullscreen
        item.onclick = () => openLightbox(index, images);

        const img = document.createElement('img');
        img.src = src;
        item.appendChild(img);
        track.appendChild(item);
    });

    // Controls
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

    // Logic
    let currentIndex = 0;
    const items = track.querySelectorAll('.carousel-item');

    const updateCarousel = () => {
        items.forEach((item, i) => {
            item.className = 'carousel-item'; // Reset
            item.classList.add('hidden'); // Default hide

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

    // Touch Support
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

// Lightbox Logic (Global)
const openLightbox = (index, images) => {
    // Create lightbox overlay
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.95)', zIndex: 10000, display: 'flex',
        alignItems: 'center', justifyContent: 'center'
    });

    const img = document.createElement('img');
    img.src = images[index];
    Object.assign(img.style, { maxHeight: '90vh', maxWidth: '90vw', borderRadius: '10px' });

    // Close on click
    overlay.onclick = () => document.body.removeChild(overlay);

    // Swipe in lightbox? user said "cycle through" in fullscreen
    // For simplicity, just close for now. User can click next in carousel.

    overlay.appendChild(img);
    document.body.appendChild(overlay);
};

// Masonry Grid Logic
const initMasonryGrid = (containerId, images) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    container.className = 'masonry-grid'; // Ensure class is set

    images.forEach(src => {
        const item = document.createElement('div');
        item.className = 'masonry-item';

        const img = document.createElement('img');
        img.src = src;
        img.loading = 'lazy'; // Improve performance

        item.appendChild(img);
        container.appendChild(item);
    });
};

// Initialize Main Gallery
// Initialize Home Gallery
const homeGallery = document.getElementById('home-gallery');
if (homeGallery) {
    const images = [];
    // 001 to 012
    for (let i = 1; i <= 12; i++) {
        images.push(`images/home/MaysGroup_Small_${i.toString().padStart(3, '0')}.jpg`);
    }
    initCarousel('home-gallery', images);
}

// Initialize Services Gallery
const servicesGallery = document.getElementById('services-gallery');
if (servicesGallery) {
    const images = [];
    // 013 to 022
    for (let i = 13; i <= 22; i++) {
        images.push(`images/services/MaysGroup_Small_${i.toString().padStart(3, '0')}.jpg`);
    }
    initCarousel('services-gallery', images);
    console.log('Services Carousel initialized');
} else {
    console.log('Services Gallery element not found');
}
