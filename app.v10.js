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
// Carousel Logic
const initCarousel = (containerId, itemsData) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear existing
    container.innerHTML = '';

    // Create DOM structure
    const track = document.createElement('div');
    track.className = 'carousel-container';

    // Caption Container
    const captionContainer = document.createElement('div');
    captionContainer.className = 'carousel-caption-container';

    // Create static elements for title and description to be updated
    const captionTitle = document.createElement('h3');
    captionTitle.className = 'carousel-caption-title';

    const captionDesc = document.createElement('p');
    captionDesc.className = 'carousel-caption-desc';

    captionContainer.appendChild(captionTitle);
    captionContainer.appendChild(captionDesc);

    itemsData.forEach((itemData, index) => {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        // Add click to fullscreen
        const allSrcs = itemsData.map(d => d.src);
        item.onclick = () => openLightbox(index, allSrcs);

        const img = document.createElement('img');
        img.src = itemData.src;
        // Use title as alt if available
        img.alt = itemData.title ? `${itemData.title} - ${itemData.location}` : 'Project Image';
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
    container.appendChild(captionContainer);

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

        // Update Caption
        const currentData = itemsData[currentIndex];
        if (currentData) {
            // Set Title
            if (currentData.title) {
                captionTitle.innerText = `${currentData.title} - ${currentData.location}`;
                captionTitle.style.display = 'block';
            } else if (currentData.caption) {
                // Fallback for simple caption
                captionTitle.innerText = currentData.caption;
                captionTitle.style.display = 'block';
            } else {
                captionTitle.style.display = 'none';
            }

            // Set Description
            if (currentData.description) {
                captionDesc.innerText = currentData.description;
                captionDesc.style.display = 'block';
            } else {
                captionDesc.style.display = 'none';
            }

            captionContainer.style.opacity = 1;
        } else {
            captionContainer.style.opacity = 0;
        }

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

// Featured Projects Images
const featuredProjects = [
    // 180-Q-18 MCKAY ART CENTRE
    {
        src: 'images/FeatProjects/180-Q-18 - McKay Art Centre Maintenance/20190605_121108.jpg',
        title: '180-Q-18 MCKAY ART CENTRE',
        location: 'Markham',
        description: 'We were entrusted by the City of Markham to preserve and revitalize the historic 180-year-old McKay Art Centre in Unionville. Our team carefully restored the exterior of this heritage landmark, meticulously preparing, painting, and refurbishing all façades, trim, shutters, pillars, railings, decks, and fences to protect and enhance its historic character. Inside, we repaired and repainted walls, ceilings, baseboards, window and door trim, ensuring every detail was handled with care and precision. This project showcased our commitment to heritage conservation and craftsmanship, delivering a refreshed, long-lasting finish while maintaining the building’s historic charm and integrity.'
    },
    {
        src: 'images/FeatProjects/180-Q-18 - McKay Art Centre Maintenance/20190611_140913.jpg',
        title: '180-Q-18 MCKAY ART CENTRE',
        location: 'Markham',
        description: 'We were entrusted by the City of Markham to preserve and revitalize the historic 180-year-old McKay Art Centre in Unionville. Our team carefully restored the exterior of this heritage landmark, meticulously preparing, painting, and refurbishing all façades, trim, shutters, pillars, railings, decks, and fences to protect and enhance its historic character. Inside, we repaired and repainted walls, ceilings, baseboards, window and door trim, ensuring every detail was handled with care and precision. This project showcased our commitment to heritage conservation and craftsmanship, delivering a refreshed, long-lasting finish while maintaining the building’s historic charm and integrity.'
    },
    {
        src: 'images/FeatProjects/180-Q-18 - McKay Art Centre Maintenance/IMG-20190524-WA0005.jpg',
        title: '180-Q-18 MCKAY ART CENTRE',
        location: 'Markham',
        description: 'We were entrusted by the City of Markham to preserve and revitalize the historic 180-year-old McKay Art Centre in Unionville. Our team carefully restored the exterior of this heritage landmark, meticulously preparing, painting, and refurbishing all façades, trim, shutters, pillars, railings, decks, and fences to protect and enhance its historic character. Inside, we repaired and repainted walls, ceilings, baseboards, window and door trim, ensuring every detail was handled with care and precision. This project showcased our commitment to heritage conservation and craftsmanship, delivering a refreshed, long-lasting finish while maintaining the building’s historic charm and integrity.'
    },
    {
        src: 'images/FeatProjects/180-Q-18 - McKay Art Centre Maintenance/last.webp',
        title: '180-Q-18 MCKAY ART CENTRE',
        location: 'Markham',
        description: 'We were entrusted by the City of Markham to preserve and revitalize the historic 180-year-old McKay Art Centre in Unionville. Our team carefully restored the exterior of this heritage landmark, meticulously preparing, painting, and refurbishing all façades, trim, shutters, pillars, railings, decks, and fences to protect and enhance its historic character. Inside, we repaired and repainted walls, ceilings, baseboards, window and door trim, ensuring every detail was handled with care and precision. This project showcased our commitment to heritage conservation and craftsmanship, delivering a refreshed, long-lasting finish while maintaining the building’s historic charm and integrity.'
    },

    // Peter Misersky Dog Park
    {
        src: 'images/FeatProjects/19-133 Peter Misersky Dog Park/20190905_173058.jpg',
        title: 'Peter Misersky Dog Park',
        location: 'Guelph',
        description: 'We proudly delivered the first dedicated dog park in the City of Guelph, the Peter Misersky Dog Park. This project transformed a vacant site into a fully functional community space by performing extensive rough and finish grading, topsoil placement, and grass planting to create a safe and level surface. We installed a long, heavy-duty chain-link fence in multiple layers to form two separate secure zones for small and large dogs, built a durable armour stone retaining wall, and constructed a new asphalt driveway complete with professional line painting. The park was enhanced with modern in-ground waste collection units, multiple benches, and high-quality park equipment, creating a clean, organized, and welcoming space for the community.'
    },
    {
        src: 'images/FeatProjects/19-133 Peter Misersky Dog Park/20190919_083631.jpg',
        title: 'Peter Misersky Dog Park',
        location: 'Guelph',
        description: 'We proudly delivered the first dedicated dog park in the City of Guelph, the Peter Misersky Dog Park. This project transformed a vacant site into a fully functional community space by performing extensive rough and finish grading, topsoil placement, and grass planting to create a safe and level surface. We installed a long, heavy-duty chain-link fence in multiple layers to form two separate secure zones for small and large dogs, built a durable armour stone retaining wall, and constructed a new asphalt driveway complete with professional line painting. The park was enhanced with modern in-ground waste collection units, multiple benches, and high-quality park equipment, creating a clean, organized, and welcoming space for the community.'
    },
    {
        src: 'images/FeatProjects/19-133 Peter Misersky Dog Park/20191019_173702.jpg',
        title: 'Peter Misersky Dog Park',
        location: 'Guelph',
        description: 'We proudly delivered the first dedicated dog park in the City of Guelph, the Peter Misersky Dog Park. This project transformed a vacant site into a fully functional community space by performing extensive rough and finish grading, topsoil placement, and grass planting to create a safe and level surface. We installed a long, heavy-duty chain-link fence in multiple layers to form two separate secure zones for small and large dogs, built a durable armour stone retaining wall, and constructed a new asphalt driveway complete with professional line painting. The park was enhanced with modern in-ground waste collection units, multiple benches, and high-quality park equipment, creating a clean, organized, and welcoming space for the community.'
    },
    {
        src: 'images/FeatProjects/19-133 Peter Misersky Dog Park/IMG-20190821-WA0020.jpg',
        title: 'Peter Misersky Dog Park',
        location: 'Guelph',
        description: 'We proudly delivered the first dedicated dog park in the City of Guelph, the Peter Misersky Dog Park. This project transformed a vacant site into a fully functional community space by performing extensive rough and finish grading, topsoil placement, and grass planting to create a safe and level surface. We installed a long, heavy-duty chain-link fence in multiple layers to form two separate secure zones for small and large dogs, built a durable armour stone retaining wall, and constructed a new asphalt driveway complete with professional line painting. The park was enhanced with modern in-ground waste collection units, multiple benches, and high-quality park equipment, creating a clean, organized, and welcoming space for the community.'
    },

    // Archadeck
    {
        src: 'images/FeatProjects/Archadeck of South west GTA/IMG-20160721-WA0013.jpg',
        caption: 'Archadeck of South West GTA'
    },
    {
        src: 'images/FeatProjects/Archadeck of South west GTA/IMG-20160908-WA0021.jpg',
        caption: 'Archadeck of South West GTA'
    },

    // Copenhagen Park
    {
        src: 'images/FeatProjects/Copenhagen Park/IMG-20200915-WA0014.jpg',
        title: 'Copenhagen playground',
        location: 'Mississauga',
        description: 'We built and installed a complete playground park in a private residential community, featuring high-end, safety-certified playground equipment coated with non-toxic, child-safe paint. The park was constructed on a splinter-free mulch surface, and includes a sand play box, swing sets, interlock sidewalks, and over 12,000 sq. ft. of lush grass, creating a safe and welcoming space for children and families.'
    },
    {
        src: 'images/FeatProjects/Copenhagen Park/IMG-20200925-WA0014.jpg',
        title: 'Copenhagen playground',
        location: 'Mississauga',
        description: 'We built and installed a complete playground park in a private residential community, featuring high-end, safety-certified playground equipment coated with non-toxic, child-safe paint. The park was constructed on a splinter-free mulch surface, and includes a sand play box, swing sets, interlock sidewalks, and over 12,000 sq. ft. of lush grass, creating a safe and welcoming space for children and families.'
    },

    // Decks Replacement
    {
        src: 'images/FeatProjects/Deck Replacments - Burlington/20181203_113411.jpg',
        title: 'Decks Replacement & Railings',
        location: 'Burlington',
        description: 'Completed a full deck and guardrail replacement project in Burlington, including ground-level entry platforms and elevated balcony decks. Scope included demolition, protection of adjacent brick and pavers, framing repairs/reinforcement as required, installation of new deck boards with clean, uniform layout and new fascia, and supply/installation of black picket-style guardrails securely anchored and aligned to meet applicable safety/code requirements. The work was completed in an occupied building with strict focus on resident safety, controlled access, daily cleanup, and noise-minimization to reduce disruption, followed by final detailing and turnover of durable, low-maintenance finishes.'
    },
    {
        src: 'images/FeatProjects/Deck Replacments - Burlington/20181203_113541.jpg',
        title: 'Decks Replacement & Railings',
        location: 'Burlington',
        description: 'Completed a full deck and guardrail replacement project in Burlington, including ground-level entry platforms and elevated balcony decks. Scope included demolition, protection of adjacent brick and pavers, framing repairs/reinforcement as required, installation of new deck boards with clean, uniform layout and new fascia, and supply/installation of black picket-style guardrails securely anchored and aligned to meet applicable safety/code requirements. The work was completed in an occupied building with strict focus on resident safety, controlled access, daily cleanup, and noise-minimization to reduce disruption, followed by final detailing and turnover of durable, low-maintenance finishes.'
    },

    // Kenota Health
    {
        src: 'images/FeatProjects/Kenota Health/20200413_174700.jpg',
        title: 'Kenota Health',
        location: 'Waterloo',
        description: 'Delivered a fast-track Kenota Health lab build-out of over 10,000 sq. ft., including construction of two specialized laboratory rooms with static-free flooring, positive-pressure environments, a clean room, and a dedicated dark room. Scope included permits and design coordination, secure-access requirements, and full execution of specialty finishes and services to meet operational and compliance needs. The project was completed in record time under three months, passed inspections, and included critical logistics such as coordinating and switching over multiple -80°C freezers to maintain continuity of lab operations.'
    },
    {
        src: 'images/FeatProjects/Kenota Health/IMG-20200529-WA0003.jpg',
        title: 'Kenota Health',
        location: 'Waterloo',
        description: 'Delivered a fast-track Kenota Health lab build-out of over 10,000 sq. ft., including construction of two specialized laboratory rooms with static-free flooring, positive-pressure environments, a clean room, and a dedicated dark room. Scope included permits and design coordination, secure-access requirements, and full execution of specialty finishes and services to meet operational and compliance needs. The project was completed in record time under three months, passed inspections, and included critical logistics such as coordinating and switching over multiple -80°C freezers to maintain continuity of lab operations.'
    },

    // Tansley Woods - RFQ-108-18
    {
        src: 'images/FeatProjects/RFQ-108-18 Patio replacement at Tansley Woods Community Centre/20180911_120059.jpg',
        title: 'RFQ-108-18 Patio Replacement Tansley woods community center',
        location: 'Burlington',
        description: 'This project involved fully removing the old patio and constructing a brand-new, durable concrete patio within a tight timeline. Because the work area was located in a space where access for heavy equipment was not possible, all work had to be carefully planned and executed using compact tools and manual methods. Our scope included site preparation, safe demolition and removal, grading, forming, concrete placement, finishing, and restoration of surrounding areas, all performed with careful attention to safety, accessibility, and minimal disruption to the busy community centre. In addition, we constructed a new pergola and refurbished a massive existing one, enhancing the functionality and appearance of the outdoor space. Completed on schedule and to specification, this project highlights our ability to deliver high-quality exterior hardscape work for public facilities under challenging site conditions.'
    },
    {
        src: 'images/FeatProjects/RFQ-108-18 Patio replacement at Tansley Woods Community Centre/20180927_173930.jpg',
        title: 'RFQ-108-18 Patio Replacement Tansley woods community center',
        location: 'Burlington',
        description: 'This project involved fully removing the old patio and constructing a brand-new, durable concrete patio within a tight timeline. Because the work area was located in a space where access for heavy equipment was not possible, all work had to be carefully planned and executed using compact tools and manual methods. Our scope included site preparation, safe demolition and removal, grading, forming, concrete placement, finishing, and restoration of surrounding areas, all performed with careful attention to safety, accessibility, and minimal disruption to the busy community centre. In addition, we constructed a new pergola and refurbished a massive existing one, enhancing the functionality and appearance of the outdoor space. Completed on schedule and to specification, this project highlights our ability to deliver high-quality exterior hardscape work for public facilities under challenging site conditions.'
    },

    // M.A. Baran Park - RFT20114 
    // Wait, "RFT20114 Fork of Thames Park" (USER) vs "M.A. Baran Park Retaining Wall" (FOLDER).
    // The user's text "RFT20114 Fork of Thames Park - London" corresponds to Contract 20-127.
    // The folder name is "RFT20114 M.A. Baran Park...". It's possible the folder name is old or incorrect/different project.
    // I will use importance of the RFT match. I'll use the user's text for these images.
    {
        src: 'images/FeatProjects/RFT20114 M.A. Baran Park Retaining Wall/20201120_072808.jpg',
        title: 'RFT20114 Fork of Thames Park',
        location: 'London',
        description: 'May’s Group successfully completed the Riverside Drive / Dundas Street Landscape Improvement Project (Contract 20-127) along the Thames River in London, Ontario, transforming a high-profile public riverfront space. This complex project required securing multiple environmental permits and coordinating closely with water authorities to safely work within an active flood zone, where we built a temporary wall to divert part of the river around the construction zone. The scope included precise site preparation and grading, installation of over 80 massive armour stone pieces each weighing more than 4 tons to form a durable retaining structure and pouring a new reinforced concrete slab. We also installed a custom luxury laser-cut steel railing, custom-built benches, and fully refurbished seven large water jets that now push water more than 50 metres into the river, creating a dramatic visual feature. Completed under challenging environmental conditions, this project showcases our expertise in complex waterfront construction, precision heavy stonework, and high-end custom urban design'
    },
    {
        src: 'images/FeatProjects/RFT20114 M.A. Baran Park Retaining Wall/unnamed (3).webp',
        title: 'RFT20114 Fork of Thames Park',
        location: 'London',
        description: 'May’s Group successfully completed the Riverside Drive / Dundas Street Landscape Improvement Project (Contract 20-127) along the Thames River in London, Ontario, transforming a high-profile public riverfront space. This complex project required securing multiple environmental permits and coordinating closely with water authorities to safely work within an active flood zone, where we built a temporary wall to divert part of the river around the construction zone. The scope included precise site preparation and grading, installation of over 80 massive armour stone pieces each weighing more than 4 tons to form a durable retaining structure and pouring a new reinforced concrete slab. We also installed a custom luxury laser-cut steel railing, custom-built benches, and fully refurbished seven large water jets that now push water more than 50 metres into the river, creating a dramatic visual feature. Completed under challenging environmental conditions, this project showcases our expertise in complex waterfront construction, precision heavy stonework, and high-end custom urban design'
    },

    // T-512-2023 
    {
        src: 'images/FeatProjects/T-512-2023 Replacement and Installation of Wood Acoustic Fences/20230802_132429.jpg',
        title: 'T-512-2023 Replacement and Installation of Wood Acoustic Fences',
        location: 'Whitby',
        description: 'We successfully completed the Wood Acoustic Fence Replacement and Installation Project (T-512-2023) for the Town of Whitby, building high-quality noise barrier fences across multiple residential locations. The project involved removing and disposing of aging fences, including all concrete footings, and supplying and installing new brown pressure-treated wood acoustic fences ranging from 1.8 m to 3.6 m in height. We also restored all disturbed areas with new topsoil and sod, ensuring the finished sites were clean, safe, and visually appealing. We are proud to have completed all the Town of Whitby’s fence construction and maintenance work throughout 2023, demonstrating our ability to deliver large-scale municipal noise fence infrastructure to strict engineering, safety, and quality standards.'
    },
    {
        src: 'images/FeatProjects/T-512-2023 Replacement and Installation of Wood Acoustic Fences/20240809_102513.jpg',
        title: 'T-512-2023 Replacement and Installation of Wood Acoustic Fences',
        location: 'Whitby',
        description: 'We successfully completed the Wood Acoustic Fence Replacement and Installation Project (T-512-2023) for the Town of Whitby, building high-quality noise barrier fences across multiple residential locations. The project involved removing and disposing of aging fences, including all concrete footings, and supplying and installing new brown pressure-treated wood acoustic fences ranging from 1.8 m to 3.6 m in height. We also restored all disturbed areas with new topsoil and sod, ensuring the finished sites were clean, safe, and visually appealing. We are proud to have completed all the Town of Whitby’s fence construction and maintenance work throughout 2023, demonstrating our ability to deliver large-scale municipal noise fence infrastructure to strict engineering, safety, and quality standards.'
    },
    {
        src: 'images/FeatProjects/T-512-2023 Replacement and Installation of Wood Acoustic Fences/20240809_104532.jpg',
        title: 'T-512-2023 Replacement and Installation of Wood Acoustic Fences',
        location: 'Whitby',
        description: 'We successfully completed the Wood Acoustic Fence Replacement and Installation Project (T-512-2023) for the Town of Whitby, building high-quality noise barrier fences across multiple residential locations. The project involved removing and disposing of aging fences, including all concrete footings, and supplying and installing new brown pressure-treated wood acoustic fences ranging from 1.8 m to 3.6 m in height. We also restored all disturbed areas with new topsoil and sod, ensuring the finished sites were clean, safe, and visually appealing. We are proud to have completed all the Town of Whitby’s fence construction and maintenance work throughout 2023, demonstrating our ability to deliver large-scale municipal noise fence infrastructure to strict engineering, safety, and quality standards.'
    },

    // T-603-2021
    {
        src: 'images/FeatProjects/T-603-2021 Durham Region Transit Bus Stops/20211008_160653.jpg',
        title: 'T-603-2021 Durham Region Transit Bus Stops',
        location: 'Durham Region',
        description: 'May’s Group constructed new concrete surfaces and curbs at over 300 bus stop locations between 2021 and 2022 across six cities throughout the Region of Durham. This large-scale project involved precise installation of durable concrete pads and curbs, meticulous site preparation and grading, and strict adherence to OPSS and municipal specifications. The work required implementing a complex traffic management plan and obtaining road occupancy permits, often working on busy arterial streets with coordinated police involvement to manage traffic flow and ensure public safety. All work was delivered on schedule, meeting the region’s highest standards for safety, accessibility, and quality, demonstrating our proven ability to deliver complex, multi-site municipal infrastructure projects with excellence.'
    },
    {
        src: 'images/FeatProjects/T-603-2021 Durham Region Transit Bus Stops/20220922_000521.jpg',
        title: 'T-603-2021 Durham Region Transit Bus Stops',
        location: 'Durham Region',
        description: 'May’s Group constructed new concrete surfaces and curbs at over 300 bus stop locations between 2021 and 2022 across six cities throughout the Region of Durham. This large-scale project involved precise installation of durable concrete pads and curbs, meticulous site preparation and grading, and strict adherence to OPSS and municipal specifications. The work required implementing a complex traffic management plan and obtaining road occupancy permits, often working on busy arterial streets with coordinated police involvement to manage traffic flow and ensure public safety. All work was delivered on schedule, meeting the region’s highest standards for safety, accessibility, and quality, demonstrating our proven ability to deliver complex, multi-site municipal infrastructure projects with excellence.'
    },
    {
        src: 'images/FeatProjects/T-603-2021 Durham Region Transit Bus Stops/2pnw0qWO-6_14168206956.jpg',
        title: 'T-603-2021 Durham Region Transit Bus Stops',
        location: 'Durham Region',
        description: 'May’s Group constructed new concrete surfaces and curbs at over 300 bus stop locations between 2021 and 2022 across six cities throughout the Region of Durham. This large-scale project involved precise installation of durable concrete pads and curbs, meticulous site preparation and grading, and strict adherence to OPSS and municipal specifications. The work required implementing a complex traffic management plan and obtaining road occupancy permits, often working on busy arterial streets with coordinated police involvement to manage traffic flow and ensure public safety. All work was delivered on schedule, meeting the region’s highest standards for safety, accessibility, and quality, demonstrating our proven ability to deliver complex, multi-site municipal infrastructure projects with excellence.'
    },

    // Welland Grading
    {
        src: 'images/FeatProjects/Wellan Grading/MaysGroup_Small_001.jpg',
        title: 'Welland Grading',
        location: 'Welland',
        description: 'Completed large-scale site grading and earthworks for a new development in Welland, covering over 10 acres of Grade A and Grade B granular placement to prepare the site for upcoming asphalt paving and landscaping. The scope also included removal and disposal of debris from a partially collapsed structure and surplus excavation soils, requiring intensive hauling and site logistics. In total, more than 10,000 tons of material were safely moved in and out of the site across 500+ truckloads, with tight coordination among multiple crews and trades to maintain safe operations and continuous access in a high-traffic, active work environment.'
    },
    {
        src: 'images/FeatProjects/Wellan Grading/MaysGroup_Small_015.jpg',
        title: 'Welland Grading',
        location: 'Welland',
        description: 'Completed large-scale site grading and earthworks for a new development in Welland, covering over 10 acres of Grade A and Grade B granular placement to prepare the site for upcoming asphalt paving and landscaping. The scope also included removal and disposal of debris from a partially collapsed structure and surplus excavation soils, requiring intensive hauling and site logistics. In total, more than 10,000 tons of material were safely moved in and out of the site across 500+ truckloads, with tight coordination among multiple crews and trades to maintain safe operations and continuous access in a high-traffic, active work environment.'
    },
    {
        src: 'images/FeatProjects/Wellan Grading/MaysGroup_Small_017.jpg',
        title: 'Welland Grading',
        location: 'Welland',
        description: 'Completed large-scale site grading and earthworks for a new development in Welland, covering over 10 acres of Grade A and Grade B granular placement to prepare the site for upcoming asphalt paving and landscaping. The scope also included removal and disposal of debris from a partially collapsed structure and surplus excavation soils, requiring intensive hauling and site logistics. In total, more than 10,000 tons of material were safely moved in and out of the site across 500+ truckloads, with tight coordination among multiple crews and trades to maintain safe operations and continuous access in a high-traffic, active work environment.'
    },
    {
        src: 'images/FeatProjects/Wellan Grading/MaysGroup_Small_021.jpg',
        title: 'Welland Grading',
        location: 'Welland',
        description: 'Completed large-scale site grading and earthworks for a new development in Welland, covering over 10 acres of Grade A and Grade B granular placement to prepare the site for upcoming asphalt paving and landscaping. The scope also included removal and disposal of debris from a partially collapsed structure and surplus excavation soils, requiring intensive hauling and site logistics. In total, more than 10,000 tons of material were safely moved in and out of the site across 500+ truckloads, with tight coordination among multiple crews and trades to maintain safe operations and continuous access in a high-traffic, active work environment.'
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
