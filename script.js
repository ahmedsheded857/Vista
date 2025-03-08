window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }
    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Activate SimpleLightbox plugin for portfolio items
    new SimpleLightbox({
        elements: '#portfolio a.portfolio-box'
    });

    // Lazy Loading للصور مع تأثيرات انتقالية
    const images = document.querySelectorAll("img[data-src]");
    const imgOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px 100px 0px"
    };
    const imgObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const img = entry.target;
            img.src = img.dataset.src;

            img.onload = () => {
                img.style.opacity = 1;
                img.style.transition = "opacity 0.5s ease";
            };

            img.removeAttribute("data-src");
            observer.unobserve(img);
        });
    }, imgOptions);

    images.forEach(img => {
        img.style.opacity = 0;
        imgObserver.observe(img);
    });

    // تحميل الخلفية بشكل متأخر مع تأثير انتقالي
    const backgroundImage = "./Image/IMG-20250206-WA0027-enhanced.png";
    const masthead = document.querySelector('.masthead');

    if (masthead) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    masthead.style.backgroundImage = `url(${backgroundImage})`;
                    masthead.style.opacity = 1;
                    masthead.style.transition = "opacity 0.5s ease";
                    observer.unobserve(masthead);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(masthead);
    }

    // Service Worker مع Workbox
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('Service Worker registered with scope:', registration.scope);

                    if ('workbox' in window) {
                        const { precaching, routing, strategies } = workbox;

                        precaching.precacheAndRoute([
                            { url: './Image/IMG-20250206-WA0027-enhanced.png', revision: '1' },
                        ]);

                        routing.registerRoute(
                            /\.(?:png|jpg|jpeg|svg|gif)$/,
                            new strategies.CacheFirst({
                                cacheName: 'images-cache',
                                plugins: [
                                    new workbox.expiration.ExpirationPlugin({
                                        maxEntries: 50,
                                        maxAgeSeconds: 30 * 24 * 60 * 60,
                                    }),
                                ],
                            })
                        );
                    }
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        });
    }

    // تأجيل تحميل بعض الأجزاء غير الضرورية
    setTimeout(() => {
        const scriptsToLoad = [
            'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/js/lightbox.min.js',
            'https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.umd.js',
            'https://unpkg.com/swiper/swiper-bundle.min.js',
        ];

        scriptsToLoad.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            document.body.appendChild(script);
        });
    }, 1000);
});