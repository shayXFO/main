document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });

        // Close menu when pressing Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Improved skip link functionality
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.getElementById('main-content');

    if (skipLink && mainContent) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Set focus to main content
            mainContent.focus();
            
            // Scroll into view
            mainContent.scrollIntoView({ behavior: 'smooth' });
            
            // Find first heading or interactive element
            const firstFocusableElement = mainContent.querySelector('h1, a[href], button, input, select, textarea, [tabindex="0"]');
            
            if (firstFocusableElement) {
                // Small delay to ensure focus after scroll
                setTimeout(() => {
                    firstFocusableElement.focus();
                }, 100);
            }

            // Announce to screen readers
            const announcer = document.getElementById('announcer');
            if (announcer) {
                announcer.textContent = 'עברת לתוכן הראשי';
            }
        });
    }

    // Add keyboard navigation support
    const focusableElements = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    document.querySelectorAll(focusableElements).forEach(element => {
        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
    });

    // Enhanced keyboard navigation
    function initializeKeyboardNav() {
        const focusableElements = document.querySelectorAll(
            'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
        );
        
        document.addEventListener('keydown', function(e) {
            // Add keyboard shortcuts
            if (e.key === '/' && e.ctrlKey) {
                e.preventDefault();
                document.querySelector('.skip-link').focus();
            }
        });
    }

    initializeKeyboardNav();

    // Add keyboard navigation for menu items
    const menuItems = document.querySelectorAll('.nav-menu a');
    menuItems.forEach((item, index) => {
        item.addEventListener('keydown', function(e) {
            const isLastItem = index === menuItems.length - 1;
            const isFirstItem = index === 0;

            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const nextIndex = e.key === 'ArrowRight' ? index - 1 : index + 1;
                if (nextIndex >= 0 && nextIndex < menuItems.length) {
                    menuItems[nextIndex].focus();
                }
            }
        });
    });

    // Add ARIA live regions for dynamic content
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        // Check for saved theme preference or default to 'light'
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);

        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // Update theme
            document.documentElement.setAttribute('data-theme', newTheme);
            
            // Save preference
            localStorage.setItem('theme', newTheme);
            
            // Update announcement for screen readers
            const announcer = document.getElementById('announcer');
            if (announcer) {
                announcer.textContent = `מצב תצוגה שונה ל${newTheme === 'light' ? 'בהיר' : 'כהה'}`;
            }
        });
    }

    // Check system preference on load
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        const savedTheme = localStorage.getItem('theme');
        if (!savedTheme) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        const savedTheme = localStorage.getItem('theme');
        if (!savedTheme) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        }
    });

    // Add to your existing JavaScript
    function createFocusTrap(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    // Header scroll behavior
    let lastScrollTop = 0;
    let headerTimeout;
    const header = document.querySelector('.site-header');
    const SCROLL_THRESHOLD = 50; // Minimum scroll amount before hiding/showing

    function handleScroll() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // Don't do anything if we haven't scrolled enough
        if (Math.abs(lastScrollTop - currentScroll) <= SCROLL_THRESHOLD) return;
        
        // Scrolling down
        if (currentScroll > lastScrollTop && currentScroll > header.offsetHeight) {
            header.classList.add('header-hidden');
            header.classList.remove('header-visible');
        } 
        // Scrolling up
        else {
            header.classList.remove('header-hidden');
            header.classList.add('header-visible');
        }
        
        lastScrollTop = currentScroll;
    }

    // Debounced scroll handler
    function debouncedScroll() {
        clearTimeout(headerTimeout);
        headerTimeout = setTimeout(handleScroll, 10);
    }

    // Add scroll event listener
    window.addEventListener('scroll', debouncedScroll, { passive: true });

    // Handle touch events for mobile
    let touchStart = 0;
    let touchEnd = 0;

    document.addEventListener('touchstart', e => {
        touchStart = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchmove', e => {
        touchEnd = e.touches[0].clientY;
        
        const touchDiff = touchStart - touchEnd;
        
        if (Math.abs(touchDiff) > SCROLL_THRESHOLD) {
            if (touchDiff > 0) { // Scrolling up
                header.classList.add('header-hidden');
                header.classList.remove('header-visible');
            } else { // Scrolling down
                header.classList.remove('header-hidden');
                header.classList.add('header-visible');
            }
        }
    }, { passive: true });

    // Reset header visibility when touch ends
    document.addEventListener('touchend', () => {
        touchStart = 0;
        touchEnd = 0;
    }, { passive: true });

    // Show header when reaching top of page
    window.addEventListener('scroll', () => {
        if (window.scrollY === 0) {
            header.classList.remove('header-hidden');
            header.classList.add('header-visible');
        }
    }, { passive: true });
}); 