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
        rootMargin: "0px"
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
    const animatedElements = document.querySelectorAll('section:not(.hero), h2, .benefit-card, .review-card, .team-member, footer, .advantage-item');

    animatedElements.forEach(el => {
        // Skip staggered elements on mobile so they are handled by the specific mobile observer
        if (window.innerWidth <= 768 && (el.classList.contains('benefit-card') || el.classList.contains('advantage-item'))) {
            return;
        }
        el.classList.add('fade-on-scroll');
        observer.observe(el);
    });

    // Mobile Scroll Animation for Benefit Cards
    if (window.innerWidth <= 768) {
        const benefitCards = Array.from(document.querySelectorAll('.benefit-card, .advantage-item'));
        let lastAnimationTime = 0;

        const mobileObserver = new IntersectionObserver((entries) => {
            // Filter intersecting entries and sort them by DOM order
            const visibleEntries = entries
                .filter(entry => entry.isIntersecting)
                .sort((a, b) => benefitCards.indexOf(a.target) - benefitCards.indexOf(b.target));

            visibleEntries.forEach(entry => {
                const now = Date.now();
                // Ensure at least 1000ms gap from the last scheduled animation
                const delay = Math.max(0, (lastAnimationTime + 1000) - now);
                const targetTime = now + delay;

                lastAnimationTime = targetTime;

                setTimeout(() => {
                    entry.target.classList.add('active-card');
                }, delay);

                mobileObserver.unobserve(entry.target); // Trigger only once
            });
        }, {
            threshold: 0.5 // Trigger when 50% visible
        });

        benefitCards.forEach(card => {
            mobileObserver.observe(card);
        });
    }

    // Parallax Effect for .section-shade-3


});

