class Navigation {
    constructor() {
        this.nav = document.querySelector('.main-nav');
        this.menu = document.querySelector('.nav-menu');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.menuItems = document.querySelectorAll('.nav-menu a');
        this.isMenuOpen = false;
        this.currentFocus = -1;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupResizeHandler();
        this.setupScrollHandler();
        this.setupKeyboardNavigation();
    }

    setupEventListeners() {
        // Toggle menu on button click
        this.menuToggle?.addEventListener('click', () => this.toggleMenu());

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.nav?.contains(e.target) && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Handle menu item clicks
        this.menuItems.forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeMenu();
                }
            });
        });
    }

    setupKeyboardNavigation() {
        this.menu?.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'Escape':
                    this.closeMenu();
                    this.menuToggle?.focus();
                    break;
                case 'ArrowDown':
                case 'ArrowRight':
                    e.preventDefault();
                    this.focusNextItem();
                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    this.focusPreviousItem();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.focusFirstItem();
                    break;
                case 'End':
                    e.preventDefault();
                    this.focusLastItem();
                    break;
            }
        });

        // Add focus trap
        this.menuToggle?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleMenu();
            }
        });
    }

    setupResizeHandler() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768 && this.isMenuOpen) {
                    this.closeMenu();
                }
            }, 250);
        });
    }

    setupScrollHandler() {
        let lastScroll = 0;
        const header = document.querySelector('.site-header');
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                header?.classList.remove('scroll-up');
                return;
            }
            
            if (currentScroll > lastScroll && !header?.classList.contains('scroll-down')) {
                header?.classList.remove('scroll-up');
                header?.classList.add('scroll-down');
            } else if (currentScroll < lastScroll && header?.classList.contains('scroll-down')) {
                header?.classList.remove('scroll-down');
                header?.classList.add('scroll-up');
            }
            lastScroll = currentScroll;
        });
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.menuToggle?.setAttribute('aria-expanded', String(this.isMenuOpen));
        this.menuToggle?.classList.toggle('active');
        this.menu?.classList.toggle('active');
        
        // Announce menu state to screen readers
        const announcer = document.getElementById('announcer');
        if (announcer) {
            announcer.textContent = this.isMenuOpen ? 'התפריט נפתח' : 'התפריט נסגר';
        }

        if (this.isMenuOpen) {
            this.focusFirstItem();
        }
    }

    closeMenu() {
        this.isMenuOpen = false;
        this.menuToggle?.setAttribute('aria-expanded', 'false');
        this.menuToggle?.classList.remove('active');
        this.menu?.classList.remove('active');
    }

    focusNextItem() {
        const items = Array.from(this.menuItems);
        this.currentFocus = (this.currentFocus + 1) % items.length;
        items[this.currentFocus].focus();
    }

    focusPreviousItem() {
        const items = Array.from(this.menuItems);
        this.currentFocus = (this.currentFocus - 1 + items.length) % items.length;
        items[this.currentFocus].focus();
    }

    focusFirstItem() {
        this.currentFocus = 0;
        this.menuItems[0]?.focus();
    }

    focusLastItem() {
        this.currentFocus = this.menuItems.length - 1;
        this.menuItems[this.currentFocus]?.focus();
    }
}

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
});
