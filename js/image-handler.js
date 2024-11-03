// Simple Image Handler
const ImageHandler = {
    init() {
        // Set up intersection observer
        if ('IntersectionObserver' in window) {
            this.setupLazyLoading();
        } else {
            this.loadAllImages();
        }
        
        // Set up error handling
        this.setupErrorHandling();
        
        // Set up resize handling
        this.setupResizeHandling();
    },

    setupLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src; // Trigger native lazy loading
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => observer.observe(img));
    },

    loadAllImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => img.src = img.src);
    },

    setupErrorHandling() {
        document.addEventListener('error', (e) => {
            if (e.target.tagName.toLowerCase() === 'img') {
                this.handleImageError(e.target);
            }
        }, true);
    },

    handleImageError(img) {
        console.error(`Failed to load image: ${img.src}`);
        img.style.display = 'none';
    },

    setupResizeHandling() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    },

    handleResize() {
        const images = document.querySelectorAll('.img-cover, .img-contain');
        images.forEach(img => {
            const wrapper = img.parentElement;
            if (wrapper && wrapper.hasAttribute('data-aspect-ratio')) {
                this.adjustImageSize(img, wrapper);
            }
        });
    },

    adjustImageSize(img, wrapper) {
        const rect = wrapper.getBoundingClientRect();
        img.style.width = rect.width + 'px';
        img.style.height = rect.height + 'px';
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ImageHandler.init();
}); 