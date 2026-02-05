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

/* Mobile Intro Text Toggle Logic */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.intro-toggle-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const introText = this.previousElementSibling;
            if (introText && introText.classList.contains('section-intro')) {
                // Ensure transition is active and covers all properties
                introText.style.transition = 'max-height 0.5s ease-in-out, opacity 0.5s ease-in-out, margin 0.5s ease';

                if (introText.classList.contains('text-expanded')) {
                    // --- COLLAPSE ANIMATION ---

                    // 1. Lock height to current pixel value (start state)
                    introText.style.maxHeight = introText.scrollHeight + 'px';
                    introText.style.opacity = '1';

                    // 2. Wait for next frame to ensure the start state is applied
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            // 3. Trigger transition to end state
                            introText.classList.remove('text-expanded');
                            introText.style.maxHeight = '0px';
                            introText.style.opacity = '0';
                            introText.style.marginTop = '0';
                            introText.style.marginBottom = '0';
                        });
                    });

                    this.innerHTML = 'Poka\u017C opis <i class="fas fa-chevron-down"></i>';
                } else {
                    // --- EXPAND ANIMATION ---
                    introText.classList.add('text-expanded');

                    // Set height to scrollHeight (target state)
                    introText.style.maxHeight = introText.scrollHeight + 'px';
                    introText.style.opacity = '1';
                    introText.style.marginTop = ''; // Restore default if needed
                    introText.style.marginBottom = '';

                    this.innerHTML = 'Ukryj opis <i class="fas fa-chevron-up"></i>';
                }
            }
        });

        // Initialize state
        const introText = btn.previousElementSibling;
        if (introText && introText.classList.contains('section-intro')) {
            // Ensure fully collapsed initially
            introText.style.maxHeight = '0px';
            introText.style.opacity = '0';
            introText.style.marginTop = '0';
            introText.style.marginBottom = '0';
        }
    });
});

/* Splash Screen Animation Logic */
document.addEventListener('DOMContentLoaded', () => {
    const splashOverlay = document.getElementById('splash-overlay');
    const hiddenElements = document.querySelectorAll('.splash-hidden');
    const header = document.querySelector('header');

    // Check if first visit in this session
    // Use 'visited' key in sessionStorage (clears when browser closed)
    // Or localStorage if you want it to persist longer

    // For testing purposes, we can uncomment this line to force animation every time:
    sessionStorage.removeItem('siteVisited');

    if (!sessionStorage.getItem('siteVisited')) {
        // First visit
        if (splashOverlay) {
            splashOverlay.style.display = 'block';
            document.body.classList.add('splash-active'); // Prevent scrolling

            // Animation Sequence
            setTimeout(() => {
                // 1. Slide up Overlay
                splashOverlay.classList.add('splash-animate-up');

                // 2. Reveal Content (Header & Hero)
                // Timings matched with CSS delays
                hiddenElements.forEach(el => {
                    el.classList.add('splash-reveal');
                });

                // 3. Cleanup after animation
                setTimeout(() => {
                    splashOverlay.style.display = 'none';
                    document.body.classList.remove('splash-active');
                    if (header) {
                        header.classList.remove('splash-mask');
                    }
                    // Remove classes to reset state (optional, but cleaner)
                    // hiddenElements.forEach(el => {
                    //    el.classList.remove('splash-hidden', 'splash-reveal');
                    // });
                }, 1800); // 1s animation + delays

                // Mark as visited
                sessionStorage.setItem('siteVisited', 'true');

            }, 500); // Short delay before starting (white screen prevention)
        } else {
            // Failsafe: Overlay not found, just show content
            hiddenElements.forEach(el => {
                el.classList.remove('splash-hidden');
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }
    } else {
        // Not first visit - show content immediately
        if (splashOverlay) {
            splashOverlay.style.display = 'none';
        }
        hiddenElements.forEach(el => {
            el.classList.remove('splash-hidden');
            el.classList.add('splash-reveal'); // Ensure visible
            // Actually better to just remove splash-hidden so defaults take over
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }

    // Contact Modal Logic (Automated)
    const initContactModal = () => {
        const modal = document.getElementById('contact-modal');
        const closeBtn = document.getElementById('close-modal');
        const contactSection = document.getElementById('kontakt');
        let hasTriggered = false;
        let autoHideTimer;

        // Validation
        if (!modal || !contactSection) return;

        const showModal = () => {
            if (hasTriggered) return;
            hasTriggered = true;

            // 3 seconds delay before showing
            setTimeout(() => {
                modal.classList.add('active');

                // Auto hide after 10 seconds (total 13s from trigger)
                autoHideTimer = setTimeout(() => {
                    hideModal();
                }, 10000);

            }, 3000);
        };

        const hideModal = () => {
            modal.classList.remove('active');
            if (autoHideTimer) clearTimeout(autoHideTimer);
        };

        // Close button event
        if (closeBtn) {
            closeBtn.addEventListener('click', hideModal);
        }

        // Observer for Contact Section
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    showModal();
                    observer.unobserve(entry.target); // Only trigger once
                }
            });
        }, {
            threshold: 0.3 // Trigger when 30% of section is visible
        });

        observer.observe(contactSection);
    };

    initContactModal();

    /* --- Project Detail Modal Logic --- */
    const projectModal = document.getElementById('project-modal');

    // Project Data Configuration
    const projectsData = [
        {
            title: 'Rezydencja "Tatry"',
            area: '145 m²',
            location: 'Zakopane',
            images: [
                'https://placehold.co/800x600/1e1e1e/FFC125?text=Rezydencja+Tatry+Ext',
                'https://placehold.co/800x600/1e1e1e/FFC125?text=Rezydencja+Tatry+Int',
                'https://placehold.co/800x600/1e1e1e/FFC125?text=Rezydencja+Tatry+Det'
            ],
            description: `
                <p class="modal-intro"><strong>Rezydencja "Tatry"</strong> to nasz flagowy projekt łączący tradycyjną architekturę podhalańską z nowoczesnym minimalizmem. Stworzyliśmy dom, który szanuje krajobraz, jednocześnie oferując bezkompromisowy komfort.</p>
                
                <h3>KONCEPCJA ARCHITEKTONICZNA</h3>
                <p>Bryła budynku nawiązuje do klasycznej "nowoczesnej stodoły". Dwuspadowy dach bez okapów, pokryty blachą na rąbek stojący w kolorze grafitowym, nadaje budynkowi surowego, eleganckiego charakteru. Elewacja wykonana z modrzewia syberyjskiego, opalanego metodą Shou Sugi Ban, zapewnia trwałość i unikalną estetykę.</p>
                
                <h3>PROCES REALIZACJI</h3>
                <p>Budowa trwała zaledwie 4 miesiące dzięki zastosowaniu technologii prefabrykowanego szkieletu drewnianego premium. Ściany zostały przygotowane w naszej fabryce z dokładnością do 1mm.</p>

                <h3>WNĘTRZE</h3>
                <p>Wnętrze zostało zaprojektowane z myślą o otwartej przestrzeni. Salon z aneksem kuchennym ma wysokość aż 6 metrów w kalenicy. Antresola pełni rolę biblioteki i domowego biura.</p>
            `
        },
        {
            title: 'Willa "Jeziorna"',
            area: '110 m²',
            location: 'Giżycko',
            images: [
                'https://placehold.co/800x600/1e1e1e/FFC125?text=Willa+Jeziorna+Widok',
                'https://placehold.co/800x600/1e1e1e/FFC125?text=Taras+Widokowy',
                'https://placehold.co/800x600/1e1e1e/FFC125?text=Salon'
            ],
            description: `
                <p class="modal-intro"><strong>Willa "Jeziorna"</strong> to projekt stworzony dla miłośników wody i przestrzeni. Usytuowana na skarpie, oferuje panoramiczny widok na jezioro z niemal każdego pomieszczenia.</p>
                
                <h3>KONCEPCJA ARCHITEKTONICZNA</h3>
                <p>Bryła budynku jest rozłożysta i niska, aby nie dominować nad linią brzegową. Wielkoformatowe przeszklenia zacierają granicę między wnętrzem a naturą. Taras o powierzchni 40m² stanowi naturalne przedłużenie strefy dziennej.</p>
                
                <h3>TECNOLOGIA</h3>
                <p>Zastosowano pakiety trzyszybowe o podwyższonym współczynniku izolacji akustycznej, zapewniając ciszę nawet w szczycie sezonu turystycznego. Ogrzewanie podłogowe zasilane pompą ciepła gwarantuje komfort termiczny przez cały rok.</p>
            `
        },
        {
            title: 'Dom "Leśny"',
            area: '95 m²',
            location: 'Bory Tuch.',
            images: [
                'https://placehold.co/800x600/1e1e1e/FFC125?text=Dom+Lesny+Front',
                'https://placehold.co/800x600/1e1e1e/FFC125?text=Las+Otoczenie'
            ],
            description: `
                <p class="modal-intro"><strong>Dom "Leśny"</strong> to azyl ukryty w sercu Borów Tucholskich. Projekt zakładał minimalną ingerencję w otoczenie – dom został wpasowany między istniejące drzewa.</p>
                
                <h3>MATERIAŁY</h3>
                <p>Elewacja z naturalnego, nieimpregnowanego modrzewia z czasem pokryje się szlachetną patyną, sprawiając, że dom "zniknie" w lesie. Dach pokryty dachówką płaską w odcieniu leśnej ściółki.</p>

                <h3>EKOLOGIA</h3>
                <p>Dom jest w pełni samowystarczalny energetycznie dzięki panelom fotowoltaicznym i magazynowi energii. System odzysku wody deszczowej służy do podlewania ogrodu.</p>
            `
        },
        {
            title: 'Dom "Północ"',
            area: '120 m²',
            location: 'Gdańsk',
            images: [
                'https://placehold.co/800x600/1e1e1e/FFC125?text=Skandynawia+Styl',
                'https://placehold.co/800x600/1e1e1e/FFC125?text=Wnetrze+Biel'
            ],
            description: `
                <p class="modal-intro"><strong>Dom "Północ"</strong> to esencja skandynawskiego designu. Biel, jasne drewno i funkcjonalność to główne cechy tego projektu.</p>
                
                <h3>DESIGN</h3>
                <p>Prosta bryła na planie prostokąta, dwuspadowy dach i brak zbędnych detali architektonicznych. To dom dla osób ceniących porządek i harmonię.</p>
                
                <h3>FUNKCJONALNOŚĆ</h3>
                <p>Na 120m² zmieściliśmy 4 sypialnie, dwie łazienki i przestronną strefę dzienną. Idealny dom dla rodziny 2+2.</p>
            `
        },
        {
            title: 'Letniskowy Premium',
            area: '35 m²',
            location: 'Mielno',
            images: [
                'https://placehold.co/800x600/1e1e1e/FFC125?text=Letniskowy+Bryla',
                'https://placehold.co/800x600/1e1e1e/FFC125?text=Wnetrze+Kompakt'
            ],
            description: `
                <p class="modal-intro"><strong>Letniskowy Premium</strong> to dowód na to, że mały metraż nie oznacza kompromisów. 35m² zabudowy pozwala na budowę na zgłoszenie.</p>
                
                <h3>UKŁAD</h3>
                <p>Pełnowymiarowa kuchnia, łazienka z prysznicem, salon i sypialnia na antresoli. Każdy centymetr przestrzeni został przemyślany i wykorzystany.</p>
            `
        },
        {
            title: 'Nowoczesna Kostka',
            area: '160 m²',
            location: 'Wrocław',
            images: [
                'https://placehold.co/800x600/1e1e1e/FFC125?text=Kostka+Modern',
                'https://placehold.co/800x600/1e1e1e/FFC125?text=Dach+Plaski'
            ],
            description: `
                <p class="modal-intro"><strong>Nowoczesna Kostka</strong> to reinterpretacja domu z lat 70., dostosowana do współczesnych standardów energooszczędności.</p>
                
                <h3>ARCHITEKTURA</h3>
                <p>Pełne piętro bez skosów gwarantuje ustawność pomieszczeń. Płaski dach umożliwia montaż dużej instalacji fotowoltaicznej niewidocznej z poziomu ulicy.</p>
            `
        },
        {
            title: 'Dom na Skarpie',
            area: '180 m²',
            location: 'Karpacz',
            images: [
                'https://placehold.co/800x600/1e1e1e/FFC125?text=Skarpa+Widok',
                'https://placehold.co/800x600/1e1e1e/FFC125?text=Podpiwniczenie'
            ],
            description: `
               <p class="modal-intro"><strong>Dom na Skarpie</strong> to wyzwanie inżynieryjne, które zamieniliśmy w atut. Dom "zawieszony" nad zboczem oferuje niesamowite widoki.</p>
               
               <h3>KONSTRUKCJA</h3>
               <p>Specjalnie wzmocniony fundament i konstrukcja szkieletowa zapewniają stabilność na trudnym terenie. Tarasy kaskadowe łączą dom z ogrodem na różnych poziomach.</p>
            `
        },
        {
            title: 'Oaza Spokoju',
            area: '130 m²',
            location: 'Mazury',
            images: [
                'https://placehold.co/800x600/1e1e1e/FFC125?text=Oaza+Spokoju',
                'https://placehold.co/800x600/1e1e1e/FFC125?text=Kominek'
            ],
            description: `
               <p class="modal-intro"><strong>Oaza Spokoju</strong> to dom parterowy, rozłożysty, idealny dla osób starszych lub rodzin z małymi dziećmi. Brak schodów to wygoda i bezpieczeństwo.</p>
               
               <h3>UKŁAD</h3>
               <p>Wyraźny podział na strefę dzienną i nocną. Sypialnia rodziców z prywatną łazienką i garderobą.</p>
            `
        },
        {
            title: 'Szklana Pułapka',
            area: '200 m²',
            location: 'Warszawa',
            images: [
                'https://placehold.co/800x600/1e1e1e/FFC125?text=Szklo+Fasada',
                'https://placehold.co/800x600/1e1e1e/FFC125?text=Atrium'
            ],
            description: `
               <p class="modal-intro"><strong>Szklana Pułapka</strong> (nazwa robocza) to projekt ultra-nowoczesny. 70% elewacji stanowi szkło.</p>
               
               <h3>PRYWATNOŚĆ</h3>
               <p>Mimo przeszkleń, zastosowanie szkła weneckiego i odpowiednie usytuowanie budynku zapewnia domownikom 100% prywatności.</p>
            `
        },
        {
            title: 'Drewniana Przystań',
            area: '85 m²',
            location: 'Sopot',
            images: [
                'https://placehold.co/800x600/1e1e1e/FFC125?text=Przystan+Drewno',
                'https://placehold.co/800x600/1e1e1e/FFC125?text=Marine+Style'
            ],
            description: `
               <p class="modal-intro"><strong>Drewniana Przystań</strong> nawiązuje stylem do nadmorskich kurortów. Bielone drewno, błękitne dodatki i dużo światła.</p>
               
               <h3>LOKALIZACJA</h3>
               <p>Dom zaprojektowany na wąską działkę miejską, wykorzystujący każdy metr kwadratowy powierzchni.</p>
            `
        }
    ];

    // Only proceed if modal exists on the page
    if (projectModal) {
        const modalTitle = projectModal.querySelector('.modal-title');
        const modalArea = projectModal.querySelector('.modal-mini-stats span:nth-child(1)'); // Assumes 1st span is area
        const modalLocation = projectModal.querySelector('.modal-mini-stats span:nth-child(2)'); // Assumes 2nd span is location
        const modalDescContainer = projectModal.querySelector('.modal-description-scroll');
        const modalSlidesContainer = projectModal.querySelector('.modal-slides-container');
        const modalDotsContainer = projectModal.querySelector('.modal-dots');

        const modalCloseBtn = projectModal.querySelector('.project-modal-close');
        const prevBtn = projectModal.querySelector('.modal-prev');
        const nextBtn = projectModal.querySelector('.modal-next');

        let currentSlide = 0;
        let totalSlides = 0;

        // Function to populate modal
        const populateModal = (index) => {
            const data = projectsData[index];
            if (!data) return;

            // Text Data
            modalTitle.textContent = data.title;
            // Keep Icons, update text. 
            // We need to preserve the SVG inside the span.
            // Helper to update text node only:
            const updateTextWithIcon = (element, newText) => {
                const svg = element.querySelector('svg');
                element.innerHTML = ''; // Clear
                if (svg) element.appendChild(svg); // Put SVG back
                element.append(' ' + newText); // Add text
            };

            updateTextWithIcon(modalArea, data.area);
            updateTextWithIcon(modalLocation, data.location);

            // Description - preserving the CTA box if it exists in HTML or re-adding it?
            // The HTML has a placeholder CTA box. We can append it or include it in content.
            // Use existing CTA box if present
            const ctaBox = modalDescContainer.querySelector('.modal-cta-box');
            modalDescContainer.innerHTML = data.description; // Overwrite content
            if (ctaBox) modalDescContainer.appendChild(ctaBox); // Re-append CTA if we want to keep it
            else {
                // Determine if we need to add CTA manually
                const newCta = document.createElement('div');
                newCta.className = 'modal-cta-box';
                newCta.innerHTML = '<p>Zainteresowany podobnym projektem?</p><a href="kontakt.html" class="btn btn-project" style="display:inline-block; margin-top:10px;">Skontaktuj się z nami</a>';
                modalDescContainer.appendChild(newCta);
            }

            // Images
            modalSlidesContainer.innerHTML = '';
            modalDotsContainer.innerHTML = '';
            totalSlides = data.images.length;
            currentSlide = 0;

            data.images.forEach((src, i) => {
                // Slide
                const slide = document.createElement('img');
                slide.src = src;
                slide.className = 'modal-slide';
                if (i === 0) slide.classList.add('active');
                modalSlidesContainer.appendChild(slide);

                // Dot
                const dot = document.createElement('span');
                dot.className = 'modal-dot';
                dot.setAttribute('data-index', i);
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => showSlide(i));
                modalDotsContainer.appendChild(dot);
            });
        };

        // Attach listeners to ALL project buttons
        const projectButtons = document.querySelectorAll('.project-card .btn-project');
        projectButtons.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Check if index exists in data, else default to 0 or safe fallback
                const dataIndex = index < projectsData.length ? index : 0;
                populateModal(dataIndex);
                projectModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        // Close Logic
        const closeModal = () => {
            projectModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) closeModal();
        });

        // Carousel Logic
        const showSlide = (n) => {
            const slides = projectModal.querySelectorAll('.modal-slide');
            const dots = projectModal.querySelectorAll('.modal-dot');

            if (n >= totalSlides) currentSlide = 0;
            else if (n < 0) currentSlide = totalSlides - 1;
            else currentSlide = n;

            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));

            if (slides[currentSlide]) slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
        };

        if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
        if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
    }

});
