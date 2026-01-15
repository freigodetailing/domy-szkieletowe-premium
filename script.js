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
    const animatedElements = document.querySelectorAll('section:not(.hero):not(.portfolio-preview), h2, .benefit-card, .review-card, .team-member, footer, .advantage-item');

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
});

