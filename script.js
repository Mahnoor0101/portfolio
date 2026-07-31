document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================
       MOBILE NAVIGATION TOGGLE
       ========================================== */
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show-menu');
            
            // Toggle hamburger icon animation
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('show-menu')) {
                icon.classList.remove('fa-bars-staggered');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars-staggered');
            }
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('show-menu');
            }
            if (navToggle) {
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars-staggered');
            }
        });
    });

    /* ==========================================
       STICKY HEADER SCROLL EFFECT
       ========================================== */
    const header = document.getElementById('header');
    
    function checkHeaderScroll() {
        if (window.scrollY >= 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', checkHeaderScroll);
    checkHeaderScroll(); // Run once on load in case page is refreshed scrolled down

    /* ==========================================
       ACTIVE LINK ON SCROLL
       ========================================== */
    const sections = document.querySelectorAll('section[id]');
    
    function highlightActiveLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // offset for sticky nav
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*='${sectionId}']`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active-link');
                } else {
                    navLink.classList.remove('active-link');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightActiveLink);
    highlightActiveLink();

    /* ==========================================
       SCROLL-TRIGGERED REVEAL ANIMATIONS
       ========================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve if we only want animation once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* ==========================================
       PORTFOLIO CATEGORY FILTERS
       ========================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('active-filter')) return;
            
            // Remove active class from other buttons
            filterButtons.forEach(button => button.classList.remove('active-filter'));
            btn.classList.add('active-filter');
            
            const filterValue = btn.getAttribute('data-filter');
            const grid = document.querySelector('.portfolio-grid');
            
            if (grid) {
                // Step 1: Fade out the grid
                grid.classList.add('fade-out');
                
                // Step 2: Swap visibility of items after grid fades out (300ms)
                setTimeout(() => {
                    portfolioItems.forEach(item => {
                        const category = item.getAttribute('data-category');
                        if (filterValue === 'all' || category === filterValue) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                    
                    // Step 3: Fade in the grid
                    grid.classList.remove('fade-out');
                }, 300);
            }
        });
    });

    /* ==========================================
       PORTFOLIO LIGHTBOX MODAL
       ========================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    // Select all items that can be opened in the lightbox
    const openableItems = document.querySelectorAll('.portfolio-item, .showcase-card');
    
    // We map only the portfolio items for sequential navigation
    const galleryData = Array.from(document.querySelectorAll('.portfolio-item')).map(item => {
        const img = item.querySelector('img');
        const title = item.querySelector('.item-title').textContent;
        const category = item.querySelector('.item-category').textContent;
        return {
            src: img.getAttribute('src'),
            title: title,
            category: category
        };
    });

    let currentItemIndex = 0;

    function openLightbox(index) {
        currentItemIndex = parseInt(index, 10);
        const data = galleryData[currentItemIndex];
        
        if (data) {
            lightboxImg.src = data.src;
            lightboxCategory.textContent = data.category;
            lightboxTitle.textContent = data.title;
            
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Disable page scrolling
        }
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Re-enable page scrolling
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300);
    }

    function navigateLightbox(direction) {
        let newIndex = currentItemIndex + direction;
        
        if (newIndex >= galleryData.length) {
            newIndex = 0; // Wrap around to first
        } else if (newIndex < 0) {
            newIndex = galleryData.length - 1; // Wrap around to last
        }
        
        // Add a quick fade out/in effect
        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            currentItemIndex = newIndex;
            const data = galleryData[currentItemIndex];
            
            if (data) {
                lightboxImg.src = data.src;
                lightboxCategory.textContent = data.category;
                lightboxTitle.textContent = data.title;
            }
            
            // Allow layout/source change to register, then transition opacity/scale back in
            setTimeout(() => {
                lightboxImg.style.opacity = '1';
                lightboxImg.style.transform = 'scale(1)';
            }, 50);
        }, 250);
    }

    // Attach click listeners to gallery portfolio items
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = item.getAttribute('data-index');
            openLightbox(index);
        });
    });

    // Connect Hero Angled Cards to Lightbox
    document.querySelectorAll('.showcase-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const projectIndex = card.getAttribute('data-project-index');
            // Scroll to portfolio section smoothly first, then open lightbox
            const portfolioSection = document.getElementById('portfolio');
            if (portfolioSection) {
                portfolioSection.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    openLightbox(projectIndex);
                }, 800);
            }
        });
    });

    // Lightbox control buttons
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));

    // Close lightbox on click outside the image
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard support for Lightbox
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        }
    });

    /* ==========================================
       TESTIMONIALS CAROUSEL SLIDER
       ========================================== */
    const track = document.getElementById('testimonial-track');
    const dotsContainer = document.getElementById('carousel-dots');
    
    if (track && dotsContainer) {
        const slides = Array.from(track.children);
        const dots = Array.from(dotsContainer.children);
        
        let activeSlideIndex = 0;
        let autoplayInterval;

        function updateSlide(index) {
            activeSlideIndex = index;
            const amountToMove = -index * 100;
            track.style.transform = `translateX(${amountToMove}%)`;
            
            // Update dots
            dots.forEach(dot => dot.classList.remove('active-dot'));
            dots[index].classList.add('active-dot');
        }

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                updateSlide(index);
                resetAutoplay();
            });
        });

        // Autoplay
        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                let nextIndex = activeSlideIndex + 1;
                if (nextIndex >= slides.length) {
                    nextIndex = 0;
                }
                updateSlide(nextIndex);
            }, 6000); // change slide every 6 seconds
        }

        function resetAutoplay() {
            clearInterval(autoplayInterval);
            startAutoplay();
        }

        startAutoplay();
    }

    /* ==========================================
       CONTACT FORM VALIDATION & SUBMISSION
       ========================================== */
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalBtnHTML = submitBtn.innerHTML;
            
            // Set loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
            formFeedback.style.display = 'none';
            formFeedback.className = 'form-feedback';
            
            // Simulate form submission
            setTimeout(() => {
                const name = document.getElementById('form-name').value;
                
                // Mock success response
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
                
                formFeedback.textContent = `Thank you, ${name}! Your message has been sent successfully. I will get back to you shortly.`;
                formFeedback.classList.add('success');
                
                // Clear fields
                contactForm.reset();
            }, 1500);
        });
    }
});
