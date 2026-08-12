document.addEventListener("DOMContentLoaded", () => {

    /* ══════════════════════════════════════════════
       1. WORK - TAB SWITCHER
    ══════════════════════════════════════════════ */
    const tabBtns   = document.querySelectorAll('.work-tab-btn');
    const tabPanels = document.querySelectorAll('.work-tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;

            // Update button states
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            // Show/hide panels
            tabPanels.forEach(panel => {
                if (panel.id === `tab-${target}`) {
                    panel.classList.remove('d-none');
                    // Re-trigger reveal for any items in this panel
                    panel.querySelectorAll('.reveal:not(.is-visible)').forEach(el => {
                        // Small delay so the fade-in animation fires
                        requestAnimationFrame(() => revealObserver.observe(el));
                    });
                } else {
                    panel.classList.add('d-none');
                }
            });
        });
    });


    /* ══════════════════════════════════════════════
       2. HERO CLASSES
    ══════════════════════════════════════════════ */
    // Already applied via class names in HTML - just trigger the cursor blink
    const accentSpan = document.querySelector('main section:first-child h1 .text-primary');
    if (accentSpan) {
        setTimeout(() => {
            accentSpan.classList.add('cursor-blink');
            setTimeout(() => accentSpan.classList.remove('cursor-blink'), 3200);
        }, 1400);
    }


    /* ══════════════════════════════════════════════
       3. SCROLL-REVEAL
    ══════════════════════════════════════════════ */
    const prefersReducedMotion =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Expose revealObserver so tab switcher can use it
    let revealObserver;

    if (!prefersReducedMotion) {
        revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        // Observe all .reveal elements present at load
        document.querySelectorAll('.reveal').forEach((el, i) => {
            // Stagger timeline rows slightly
            if (el.classList.contains('reveal--left')) {
                const rows = [...document.querySelectorAll('.reveal.reveal--left')];
                el.style.transitionDelay = `${rows.indexOf(el) * 0.08}s`;
            }
            revealObserver.observe(el);
        });

        // Section title underline sweep
        const titleObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        titleObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );
        document.querySelectorAll('.section-title-line').forEach(el => titleObserver.observe(el));

    } else {
        // Reduced motion - show everything immediately
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
        document.querySelectorAll('.section-title-line').forEach(el => el.classList.add('is-visible'));
        // Fallback: create a no-op observer so the tab switcher doesn't crash
        revealObserver = { observe: () => {} };
    }


    /* ══════════════════════════════════════════════
       4. NAVBAR SCROLL TINT
    ══════════════════════════════════════════════ */
    const navbar = document.querySelector('.bg-navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.style.borderBottomColor = window.scrollY > 20
                ? 'rgba(37, 99, 235, 0.15)'
                : '';
        }, { passive: true });
    }


});
