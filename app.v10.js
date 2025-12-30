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
const initCarousel = (containerId, itemsData) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear existing
    container.innerHTML = '';

    // Create DOM structure
    const track = document.createElement('div');
    track.className = 'carousel-container';

    itemsData.forEach((itemData, index) => {
        const item = document.createElement('div');
        item.className = 'carousel-item';

        // Click to open Project Gallery
        item.onclick = () => openProjectGallery(itemData);
        item.style.cursor = 'pointer';

        const img = document.createElement('img');
        img.src = itemData.cover;
        img.alt = itemData.title ? `${itemData.title} - ${itemData.location}` : 'Project Cover';
        item.appendChild(img);

        // Corner Title
        if (itemData.title) {
            const titleOverlay = document.createElement('div');
            titleOverlay.className = 'slide-title-overlay';
            titleOverlay.innerHTML = `<div>${itemData.title}</div><div style="font-size: 0.8em; opacity: 0.9;">${itemData.location}</div>`;
            item.appendChild(titleOverlay);
        }

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

    const next = (e) => {
        if (e) e.stopPropagation();
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    };

    const prev = (e) => {
        if (e) e.stopPropagation();
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

// Global Gallery Cache
let cachedGlobalGallery = null;

// Helper to Get All Images from All Projects
const getGlobalGalleryItems = () => {
    if (cachedGlobalGallery) return cachedGlobalGallery;

    const allItems = [];
    // Ensure featuredProjects is available
    if (typeof featuredProjects !== 'undefined') {
        featuredProjects.forEach(project => {
            if (project.images) {
                project.images.forEach(imgSrc => {
                    allItems.push({
                        src: imgSrc,
                        project: project // Link back to parent project for metadata
                    });
                });
            } else if (project.cover) {
                // Fallback if no images array, use cover
                allItems.push({
                    src: project.cover,
                    project: project
                });
            }
        });
    }

    // Sort alphabetically by filename
    allItems.sort((a, b) => {
        // Extract filename from path (e.g. "images/folder/file.jpg" -> "file.jpg")
        const nameA = a.src.split('/').pop().toLowerCase();
        const nameB = b.src.split('/').pop().toLowerCase();
        return nameA.localeCompare(nameB);
    });

    cachedGlobalGallery = allItems;
    return allItems;
};


// Project Gallery Lightbox (Global Hybrid Layout)
const openProjectGallery = (startingProject) => {
    // 1. Get Global List
    const globalItems = getGlobalGalleryItems();

    // 2. Find Starting Index
    // We try to find the startingProject's cover image in our global list
    let currentIndex = globalItems.findIndex(item => item.src === startingProject.cover);

    // If cover not found (maybe logic mismatch), try finding ANY image from this project
    if (currentIndex === -1) {
        currentIndex = globalItems.findIndex(item => item.project === startingProject);
    }

    // Fallback
    if (currentIndex === -1) currentIndex = 0;


    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'project-lightbox-overlay';

    // Container (Scrollable Vertical)
    const content = document.createElement('div');
    content.className = 'project-lightbox-content vertical-scroll';

    // Wrapper (Centers content)
    const wrapper = document.createElement('div');
    wrapper.className = 'lightbox-hybrid-wrapper';

    // --- TOP SECTION (Image + Sidebar) ---
    const topSection = document.createElement('div');
    topSection.className = 'lightbox-top-section';

    // A. Main Image Column
    const mainCol = document.createElement('div');
    mainCol.className = 'lightbox-main-col';

    const imgContainer = document.createElement('div');
    imgContainer.className = 'lightbox-img-wrapper';

    const mainImg = document.createElement('img');
    mainImg.src = globalItems[currentIndex].src;
    mainImg.className = 'lightbox-main-img';

    imgContainer.appendChild(mainImg);

    // Navigation Arrows
    if (globalItems.length > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.className = 'lightbox-arrow prev';
        prevBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';

        const nextBtn = document.createElement('button');
        nextBtn.className = 'lightbox-arrow next';
        nextBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';

        const updateContent = () => {
            const currentItem = globalItems[currentIndex];
            mainImg.src = currentItem.src;

            // Update Bottom Text
            titleEl.innerText = currentItem.project.title;
            locEl.innerText = currentItem.project.location;
            descP.innerText = currentItem.project.description || '';

            updateActiveThumb();
        };

        prevBtn.onclick = (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + globalItems.length) % globalItems.length;
            updateContent();
        };

        nextBtn.onclick = (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % globalItems.length;
            updateContent();
        };

        imgContainer.appendChild(prevBtn);
        imgContainer.appendChild(nextBtn);
    }
    mainCol.appendChild(imgContainer);

    // B. Sidebar Column (Grid)
    const sideCol = document.createElement('div');
    sideCol.className = 'lightbox-side-col';

    const sideTitle = document.createElement('h4');
    sideTitle.innerText = "All Projects Gallery";
    sideCol.appendChild(sideTitle);

    const grid = document.createElement('div');
    grid.className = 'lightbox-side-grid';

    const thumbElements = [];

    // Create thumbnails for ALL images
    globalItems.forEach((item, idx) => {
        const thumb = document.createElement('img');
        thumb.src = item.src;
        thumb.className = 'lightbox-side-thumb';
        thumb.loading = "lazy"; // Important for performance with many images
        if (idx === currentIndex) thumb.classList.add('active');

        thumb.onclick = (e) => {
            e.stopPropagation();
            currentIndex = idx;
            // Update Main View using shared function logic
            const currentItem = globalItems[currentIndex];
            mainImg.src = currentItem.src;
            titleEl.innerText = currentItem.project.title;
            locEl.innerText = currentItem.project.location;
            descP.innerText = currentItem.project.description || '';
            updateActiveThumb();
        };

        grid.appendChild(thumb);
        thumbElements.push(thumb);
    });
    sideCol.appendChild(grid);

    const updateActiveThumb = () => {
        thumbElements.forEach((t, i) => {
            if (i === currentIndex) {
                t.classList.add('active');
                t.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                t.classList.remove('active');
            }
        });
    };

    topSection.appendChild(mainCol);
    topSection.appendChild(sideCol);
    wrapper.appendChild(topSection);

    // --- BOTTOM SECTION (Description) ---
    const bottomSection = document.createElement('div');
    bottomSection.className = 'lightbox-bottom-section';

    // Initial Text State
    const currentProject = globalItems[currentIndex].project;

    const titleEl = document.createElement('h2');
    titleEl.innerText = currentProject.title;

    const locEl = document.createElement('span');
    locEl.className = 'lightbox-location';
    locEl.innerText = currentProject.location;

    const descDiv = document.createElement('div');
    descDiv.className = 'lightbox-desc-text';
    const descP = document.createElement('p');
    descP.innerText = currentProject.description || '';
    descDiv.appendChild(descP);

    bottomSection.appendChild(titleEl);
    bottomSection.appendChild(locEl);
    bottomSection.appendChild(descDiv);

    wrapper.appendChild(bottomSection);

    content.appendChild(wrapper);

    // Close Button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    closeBtn.onclick = () => document.body.removeChild(overlay);

    overlay.appendChild(content);
    overlay.appendChild(closeBtn);

    // Close on background click
    overlay.onclick = (e) => {
        if (e.target === overlay || e.target === content) document.body.removeChild(overlay);
    };

    document.body.appendChild(overlay);

    // Scroll active thumb into view initially
    setTimeout(updateActiveThumb, 100);
};

// Featured Projects Data (Synced with FS)
const featuredProjects = [
    {
        title: '180-Q-18 MCKAY ART CENTRE',
        location: 'Markham',
        cover: 'images/FeatProjects/180-Q-18 - McKay Art Centre Maintenance/c.jpg',
        description: 'We were entrusted by the City of Markham to preserve and revitalize the historic 180-year-old McKay Art Centre in Unionville. Our team carefully restored the exterior of this heritage landmark, meticulously preparing, painting, and refurbishing all façades, trim, shutters, pillars, railings, decks, and fences to protect and enhance its historic character. Inside, we repaired and repainted walls, ceilings, baseboards, window and door trim, ensuring every detail was handled with care and precision. This project showcased our commitment to heritage conservation and craftsmanship, delivering a refreshed, long-lasting finish while maintaining the building’s historic charm and integrity.',
        images: [
            'images/FeatProjects/180-Q-18 - McKay Art Centre Maintenance/c.jpg',
            'images/FeatProjects/180-Q-18 - McKay Art Centre Maintenance/20190611_140913.jpg',
            'images/FeatProjects/180-Q-18 - McKay Art Centre Maintenance/IMG-20190524-WA0005.jpg',
            'images/FeatProjects/180-Q-18 - McKay Art Centre Maintenance/last.webp'
        ]
    },
    {
        title: 'Peter Misersky Dog Park',
        location: 'Guelph',
        cover: 'images/FeatProjects/19-133 Peter Misersky Dog Park/c.jpg',
        description: 'We proudly delivered the first dedicated dog park in the City of Guelph, the Peter Misersky Dog Park. This project transformed a vacant site into a fully functional community space by performing extensive rough and finish grading, topsoil placement, and grass planting to create a safe and level surface. We installed a long, heavy-duty chain-link fence in multiple layers to form two separate secure zones for small and large dogs, built a durable armour stone retaining wall, and constructed a new asphalt driveway complete with professional line painting. The park was enhanced with modern in-ground waste collection units, multiple benches, and high-quality park equipment, creating a clean, organized, and welcoming space for the community.',
        images: [
            'images/FeatProjects/19-133 Peter Misersky Dog Park/c.jpg',
            'images/FeatProjects/19-133 Peter Misersky Dog Park/20190919_083631.jpg',
            'images/FeatProjects/19-133 Peter Misersky Dog Park/20191019_173702.jpg',
            'images/FeatProjects/19-133 Peter Misersky Dog Park/IMG-20190821-WA0020.jpg'
        ]
    },
    {
        title: 'Archadeck of South West GTA',
        location: 'GTA',
        cover: 'images/FeatProjects/Archadeck of South west GTA/c.jpg',
        description: 'Archadeck of South West GTA project showcasing our custom outdoor living structures.',
        images: [
            'images/FeatProjects/Archadeck of South west GTA/c.jpg',
            'images/FeatProjects/Archadeck of South west GTA/IMG-20160908-WA0021.jpg'
        ]
    },
    {
        title: 'Copenhagen playground',
        location: 'Mississauga',
        cover: 'images/FeatProjects/Copenhagen Park/c.jpg',
        description: 'We built and installed a complete playground park in a private residential community, featuring high-end, safety-certified playground equipment coated with non-toxic, child-safe paint. The park was constructed on a splinter-free mulch surface, and includes a sand play box, swing sets, interlock sidewalks, and over 12,000 sq. ft. of lush grass, creating a safe and welcoming space for children and families.',
        images: [
            'images/FeatProjects/Copenhagen Park/c.jpg',
            'images/FeatProjects/Copenhagen Park/IMG-20200915-WA0014.jpg'
        ]
    },
    {
        title: 'Decks Replacement & Railings',
        location: 'Burlington',
        cover: 'images/FeatProjects/Deck Replacments - Burlington/c.jpg',
        description: 'Completed a full deck and guardrail replacement project in Burlington, including ground-level entry platforms and elevated balcony decks. Scope included demolition, protection of adjacent brick and pavers, framing repairs/reinforcement as required, installation of new deck boards with clean, uniform layout and new fascia, and supply/installation of black picket-style guardrails securely anchored and aligned to meet applicable safety/code requirements. The work was completed in an occupied building with strict focus on resident safety, controlled access, daily cleanup, and noise-minimization to reduce disruption, followed by final detailing and turnover of durable, low-maintenance finishes.',
        images: [
            'images/FeatProjects/Deck Replacments - Burlington/c.jpg',
            'images/FeatProjects/Deck Replacments - Burlington/20181203_113541.jpg'
        ]
    },
    {
        title: 'Kenota Health',
        location: 'Waterloo',
        cover: 'images/FeatProjects/Kenota Health/c.jpg',
        description: 'Delivered a fast-track Kenota Health lab build-out of over 10,000 sq. ft., including construction of two specialized laboratory rooms with static-free flooring, positive-pressure environments, a clean room, and a dedicated dark room. Scope included permits and design coordination, secure-access requirements, and full execution of specialty finishes and services to meet operational and compliance needs. The project was completed in record time under three months, passed inspections, and included critical logistics such as coordinating and switching over multiple -80°C freezers to maintain continuity of lab operations.',
        images: [
            'images/FeatProjects/Kenota Health/c.jpg',
            'images/FeatProjects/Kenota Health/20200413_174700.jpg'
        ]
    },
    {
        title: 'RFQ-108-18 Patio Replacement',
        location: 'Burlington',
        cover: 'images/FeatProjects/RFQ-108-18 Patio replacement at Tansley Woods Community Centre/c.jpg',
        description: 'This project involved fully removing the old patio and constructing a brand-new, durable concrete patio within a tight timeline. Because the work area was located in a space where access for heavy equipment was not possible, all work had to be carefully planned and executed using compact tools and manual methods. Our scope included site preparation, safe demolition and removal, grading, forming, concrete placement, finishing, and restoration of surrounding areas, all performed with careful attention to safety, accessibility, and minimal disruption to the busy community centre. In addition, we constructed a new pergola and refurbished a massive existing one, enhancing the functionality and appearance of the outdoor space. Completed on schedule and to specification, this project highlights our ability to deliver high-quality exterior hardscape work for public facilities under challenging site conditions.',
        images: [
            'images/FeatProjects/RFQ-108-18 Patio replacement at Tansley Woods Community Centre/c.jpg',
            'images/FeatProjects/RFQ-108-18 Patio replacement at Tansley Woods Community Centre/20180911_120059.jpg'
        ]
    },
    {
        title: 'RFT20114 Fork of Thames Park',
        location: 'London',
        cover: 'images/FeatProjects/RFT20114 M.A. Baran Park Retaining Wall/c.webp',
        description: 'May’s Group successfully completed the Riverside Drive / Dundas Street Landscape Improvement Project (Contract 20-127) along the Thames River in London, Ontario, transforming a high-profile public riverfront space. This complex project required securing multiple environmental permits and coordinating closely with water authorities to safely work within an active flood zone, where we built a temporary wall to divert part of the river around the construction zone. The scope included precise site preparation and grading, installation of over 80 massive armour stone pieces each weighing more than 4 tons to form a durable retaining structure and pouring a new reinforced concrete slab. We also installed a custom luxury laser-cut steel railing, custom-built benches, and fully refurbished seven large water jets that now push water more than 50 metres into the river, creating a dramatic visual feature. Completed under challenging environmental conditions, this project showcases our expertise in complex waterfront construction, precision heavy stonework, and high-end custom urban design',
        images: [
            'images/FeatProjects/RFT20114 M.A. Baran Park Retaining Wall/c.webp',
            'images/FeatProjects/RFT20114 M.A. Baran Park Retaining Wall/20201120_072808.jpg'
        ]
    },
    {
        title: 'T-512-2023 Acoustic Fences',
        location: 'Whitby',
        cover: 'images/FeatProjects/T-512-2023 Replacement and Installation of Wood Acoustic Fences/c.jpg',
        description: 'We successfully completed the Wood Acoustic Fence Replacement and Installation Project (T-512-2023) for the Town of Whitby, building high-quality noise barrier fences across multiple residential locations. The project involved removing and disposing of aging fences, including all concrete footings, and supplying and installing new brown pressure-treated wood acoustic fences ranging from 1.8 m to 3.6 m in height. We also restored all disturbed areas with new topsoil and sod, ensuring the finished sites were clean, safe, and visually appealing. We are proud to have completed all the Town of Whitby’s fence construction and maintenance work throughout 2023, demonstrating our ability to deliver large-scale municipal noise fence infrastructure to strict engineering, safety, and quality standards.',
        images: [
            'images/FeatProjects/T-512-2023 Replacement and Installation of Wood Acoustic Fences/c.jpg',
            'images/FeatProjects/T-512-2023 Replacement and Installation of Wood Acoustic Fences/20240809_102513.jpg',
            'images/FeatProjects/T-512-2023 Replacement and Installation of Wood Acoustic Fences/20240809_104532.jpg'
        ]
    },
    {
        title: 'T-603-2021 DRT Bus Stops',
        location: 'Durham Region',
        cover: 'images/FeatProjects/T-603-2021 Durham Region Transit Bus Stops/c.jpg',
        description: 'May’s Group constructed new concrete surfaces and curbs at over 300 bus stop locations between 2021 and 2022 across six cities throughout the Region of Durham. This large-scale project involved precise installation of durable concrete pads and curbs, meticulous site preparation and grading, and strict adherence to OPSS and municipal specifications. The work required implementing a complex traffic management plan and obtaining road occupancy permits, often working on busy arterial streets with coordinated police involvement to manage traffic flow and ensure public safety. All work was delivered on schedule, meeting the region’s highest standards for safety, accessibility, and quality, demonstrating our proven ability to deliver complex, multi-site municipal infrastructure projects with excellence.',
        images: [
            'images/FeatProjects/T-603-2021 Durham Region Transit Bus Stops/c.jpg',
            'images/FeatProjects/T-603-2021 Durham Region Transit Bus Stops/20211008_160653.jpg',
            'images/FeatProjects/T-603-2021 Durham Region Transit Bus Stops/20220922_000521.jpg'
        ]
    },
    {
        title: 'Welland Grading',
        location: 'Welland',
        cover: 'images/FeatProjects/Wellan Grading/c.jpg',
        description: 'Completed large-scale site grading and earthworks for a new development in Welland, covering over 10 acres of Grade A and Grade B granular placement to prepare the site for upcoming asphalt paving and landscaping. The scope also included removal and disposal of debris from a partially collapsed structure and surplus excavation soils, requiring intensive hauling and site logistics. In total, more than 10,000 tons of material were safely moved in and out of the site across 500+ truckloads, with tight coordination among multiple crews and trades to maintain safe operations and continuous access in a high-traffic, active work environment.',
        images: [
            'images/FeatProjects/Wellan Grading/c.jpg',
            'images/FeatProjects/Wellan Grading/MaysGroup_Small_001.jpg',
            'images/FeatProjects/Wellan Grading/MaysGroup_Small_015.jpg',
            'images/FeatProjects/Wellan Grading/MaysGroup_Small_017.jpg'
        ]
    }
];

// Initialize Home Gallery
const homeGallery = document.getElementById('home-gallery');
if (homeGallery) {
    initCarousel('home-gallery', featuredProjects);
}

// Initialize Services Gallery
const servicesGallery = document.getElementById('services-gallery');
if (servicesGallery) {
    initCarousel('services-gallery', featuredProjects);
    console.log('Services Carousel initialized');
} else {
    console.log('Services Gallery element not found');
}

// Simple Slideshow (About Us)
const initSimpleSlideshow = (containerId, images, interval = 5000) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    const imgElements = [];

    // Create images
    images.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = "About Us Image";
        img.className = 'about-slide-img';
        if (index === 0) img.classList.add('active');
        container.appendChild(img);
        imgElements.push(img);
    });

    let currentIndex = 0;

    setInterval(() => {
        // Remove active from current
        imgElements[currentIndex].classList.remove('active');

        // Next index
        currentIndex = (currentIndex + 1) % imgElements.length;

        // Add active to new
        imgElements[currentIndex].classList.add('active');
    }, interval);
};

// Founder Slideshow with Captions
const initFounderSlideshow = (containerId, slides, interval = 5000) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    const slideElements = [];

    slides.forEach((slide, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'founder-slide-wrapper';
        if (index === 0) wrapper.classList.add('active');

        const img = document.createElement('img');
        img.src = slide.src;
        img.alt = slide.caption;
        img.className = 'founder-slide-img';

        const caption = document.createElement('div');
        caption.className = 'founder-caption';
        caption.innerText = slide.caption;

        wrapper.appendChild(img);
        wrapper.appendChild(caption);
        container.appendChild(wrapper);
        slideElements.push(wrapper);
    });

    let currentIndex = 0;

    setInterval(() => {
        // Remove active
        slideElements[currentIndex].classList.remove('active');

        // Next
        currentIndex = (currentIndex + 1) % slideElements.length;

        // Add active
        slideElements[currentIndex].classList.add('active');
    }, interval);
};

// Init Founder Slideshow
initFounderSlideshow('founder-slideshow', [
    { src: 'images/au5.png', caption: 'Mustafa Tawfiq, Founder' },
    { src: 'images/mustafa20152.png', caption: 'Mustafa Tawfiq 2015' },
    { src: 'images/mustafa2025.png', caption: 'Mustafa Tawfiq 2025' }
], 5000);

// Init About Slideshow
initSimpleSlideshow('about-slideshow', [
    'images/AboutUs/aboutus.png',
    'images/AboutUs/au2.png',
    'images/AboutUs/IMG-20190523-WA0003.jpg',
    'images/AboutUs/IMG-20190822-WA0023.jpg',
    'images/AboutUs/IMG-20190822-WA0040.jpg',
    'images/AboutUs/IMG-20201201-WA0052.jpg',
    'images/AboutUs/IMG-20230820-WA0003.jpg'
], 4000);
