document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Scroll Animation (Fog/Mist effect)
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "50px" // Pre-load slightly before element comes into view
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Elements to animate
    const animatedElements = document.querySelectorAll('section:not(.hero):not(.portfolio-preview):not(.faq-parallax-section), h2, .benefit-card, .review-card, .team-member, footer, .advantage-item, .text-content, .image-content, .contact-layout > div');

    animatedElements.forEach(el => {
        // Skip staggered elements on mobile so they are handled by the specific mobile observer
        if (window.innerWidth <= 768 && (el.classList.contains('benefit-card') || el.classList.contains('advantage-item'))) {
            return;
        }
        el.classList.add('fade-on-scroll');
        observer.observe(el);
    });


    // Mobile Simple Border Highlight (Performance Optimized)
    if (window.innerWidth <= 768) {
        const benefitCards = document.querySelectorAll('.benefit-card');

        const mobileObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('mobile-highlight');
                    mobileObserver.unobserve(entry.target); // Trigger only once
                }
            });
        }, {
            threshold: 0.5 // Trigger when 50% visible (middle of the screen roughly)
        });

        benefitCards.forEach(card => {
            mobileObserver.observe(card);
        });
    }

    // Parallax Effect for .section-shade-3


    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            // Close other open questions
            const currentlyActive = document.querySelector('.faq-question.active');
            if (currentlyActive && currentlyActive !== question) {
                currentlyActive.classList.remove('active');
                currentlyActive.nextElementSibling.style.maxHeight = null;
            }

            // Toggle current
            question.classList.toggle('active');
            const answer = question.nextElementSibling;

            if (question.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });

    // Testimonial Slider Logic
    const initTestimonialSlider = () => {
        const track = document.querySelector('.testimonial-track');
        if (!track) return;

        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');
        const dotsNav = document.querySelector('.slider-dots');

        if (!slides.length) return;

        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                moveToSlide(index);
                stopAutoSlide(); // Pause interacting
                startAutoSlide(); // Resume
            });
            dotsNav.appendChild(dot);
        });

        const dots = Array.from(dotsNav.children);
        let currentSlideIndex = 0;
        let autoSlideInterval;

        const updateDots = (index) => {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
        };

        const updateSlidesState = (index) => {
            // Optional: visual active state for cards if visible
            slides.forEach(slide => slide.classList.remove('active-slide'));
            slides[index].classList.add('active-slide');
        };

        const moveToSlide = (index) => {
            track.style.transform = 'translateX(-' + (index * 100) + '%)';
            currentSlideIndex = index;
            updateDots(index);
            updateSlidesState(index);
        };

        const nextSlide = () => {
            let nextIndex = currentSlideIndex + 1;
            if (nextIndex >= slides.length) {
                nextIndex = 0;
            }
            moveToSlide(nextIndex);
        };

        const prevSlide = () => {
            let prevIndex = currentSlideIndex - 1;
            if (prevIndex < 0) {
                prevIndex = slides.length - 1;
            }
            moveToSlide(prevIndex);
        };

        // Event Listeners
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                nextSlide();
                stopAutoSlide();
                startAutoSlide();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                prevSlide();
                stopAutoSlide();
                startAutoSlide();
            });
        }

        const startAutoSlide = () => {
            stopAutoSlide();
            autoSlideInterval = setInterval(nextSlide, 5000); // 5 seconds
        };

        const stopAutoSlide = () => {
            clearInterval(autoSlideInterval);
        };

        // Initialize
        moveToSlide(0);
        startAutoSlide();

        // Touch support (Simple swipe)
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoSlide();
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoSlide();
        }, { passive: true });

        const handleSwipe = () => {
            if (touchEndX < touchStartX - 50) nextSlide();
            if (touchEndX > touchStartX + 50) prevSlide();
        };
    };

    initTestimonialSlider();

    // Cookie Consent Logic
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const closeBtn = document.getElementById('close-cookies');

    if (cookieBanner) {
        // Check if user has already accepted/closed
        const consent = localStorage.getItem('cookieConsent');

        if (!consent) {
            // Show banner after a short delay
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }

        const hideBanner = () => {
            cookieBanner.classList.remove('show');
            localStorage.setItem('cookieConsent', 'true');
        };

        if (acceptBtn) {
            acceptBtn.addEventListener('click', hideBanner);
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', hideBanner);
        }
    }

    // Realizacje Carousel Logic
    const initRealizacjeCarousel = () => {
        const track = document.querySelector('.realizacje-carousel-track');
        if (!track) return;

        const items = Array.from(track.children);
        const prevButton = document.querySelector('.carousel-prev-btn');
        const nextButton = document.querySelector('.carousel-next-btn');
        const dotsContainer = document.querySelector('.carousel-dots');

        if (!items.length) return;

        let currentIndex = 0;
        let autoScrollInterval;
        const itemWidth = items[0].offsetWidth + 20; // item width + gap
        const scrollAmount = itemWidth; // scroll by one item width

        // Get dots
        const dots = dotsContainer ? Array.from(dotsContainer.children) : [];

        const updateDots = (index) => {
            // Reset all dots first
            dots.forEach(dot => {
                dot.classList.remove('active');
                dot.style.filter = ''; // Reset brightness/filter
                dot.style.opacity = ''; // Reset opacity if used
                dot.style.backgroundColor = ''; // Reset background color
            });

            // Calculate which dot to activate (0-3)
            const dotIndex = index % dots.length;

            // Calculate which cycle we are in (0 = items 0-3, 1 = items 4-7, etc.)
            const cycle = Math.floor(index / dots.length);

            if (dots[dotIndex]) {
                const dot = dots[dotIndex];
                dot.classList.add('active');

                // Apply specific colors based on cycle
                // Cycle 0: Default (Yellow/Gold defined in CSS)
                // Cycle 1: Strong Orange
                // Cycle 2: Red
                if (cycle === 1) {
                    dot.style.backgroundColor = '#FF6600'; // Strong Orange
                } else if (cycle >= 2) {
                    dot.style.backgroundColor = '#FF0000'; // Red
                }
            }
        };

        const moveCarousel = (direction) => {
            if (direction === 'next') {
                currentIndex++;
                // Reset to start if we've scrolled past the last item
                if (currentIndex >= items.length - 1) {
                    currentIndex = 0;
                }
            } else {
                currentIndex--;
                if (currentIndex < 0) {
                    currentIndex = items.length - 2; // Show last two items
                }
            }

            const translateX = -(currentIndex * scrollAmount);
            track.style.transform = `translateX(${translateX}px)`;
            updateDots(currentIndex);
        };

        // Navigation button event listeners
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                moveCarousel('next');
                stopAutoScroll();
                startAutoScroll();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                moveCarousel('prev');
                stopAutoScroll();
                startAutoScroll();
            });
        }

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const diff = index - currentIndex;
                currentIndex = index;
                const translateX = -(currentIndex * scrollAmount);
                track.style.transform = `translateX(${translateX}px)`;
                updateDots(currentIndex);
                stopAutoScroll();
                startAutoScroll();
            });
        });

        // Auto-scroll functionality
        const startAutoScroll = () => {
            stopAutoScroll();
            autoScrollInterval = setInterval(() => {
                moveCarousel('next');
            }, 4000); // Auto-scroll every 4 seconds
        };

        const stopAutoScroll = () => {
            clearInterval(autoScrollInterval);
        };

        // Touch support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoScroll();
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoScroll();
        }, { passive: true });

        const handleSwipe = () => {
            if (touchEndX < touchStartX - 50) moveCarousel('next');
            if (touchEndX > touchStartX + 50) moveCarousel('prev');
        };

        // Initialize
        updateDots(0);
        startAutoScroll();

        // Pause auto-scroll when hovering over carousel
        const carouselWrapper = document.querySelector('.realizacje-carousel-wrapper');
        if (carouselWrapper) {
            carouselWrapper.addEventListener('mouseenter', stopAutoScroll);
            carouselWrapper.addEventListener('mouseleave', startAutoScroll);
        }
    };

    initRealizacjeCarousel();

    // Construction Process Timeline Animation
    const processRows = document.querySelectorAll('.process-row');

    if (processRows.length > 0) {
        const processObserverOptions = {
            threshold: 0.5, // Trigger when 50% of the row is visible (center of screen)
            rootMargin: "-10% 0px -10% 0px" // Narrow the "active" zone
        };

        const processObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Remove active from all others? Or just add to current?
                    // User said: "zjezdzajac zgasnie i zapali sie kolejny" -> implies only one active at a time.

                    // Option 1: Exclusive active state (more strict)
                    processRows.forEach(row => row.classList.remove('active'));
                    entry.target.classList.add('active');
                } else {
                    // Optional: remove active when leaving?
                    // entry.target.classList.remove('active'); 
                    // Using exclusive remove above makes this redundant if we only care about the one in center.
                }
            });
        }, processObserverOptions);

        processRows.forEach(row => {
            processObserver.observe(row);
        });
    }
});
