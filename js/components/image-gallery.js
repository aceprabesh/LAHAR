/**
 * LAHAR - Image Gallery Component
 *
 * Handles product image gallery with thumbnails and mobile swipe
 */

const ImageGallery = {
  currentIndex: 0,
  images: [],

  init(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return this;

    this.mainImage = this.container.querySelector('.gallery-main-image');
    this.thumbnails = this.container.querySelectorAll('.gallery-thumbnail');
    this.images = Array.from(this.thumbnails).map(thumb => thumb.dataset.full);

    if (this.images.length === 0 && this.mainImage) {
      this.images = [this.mainImage.dataset.full || this.mainImage.src];
    }

    this.bindEvents();
    this.initMobileSwipe();

    return this;
  },

  bindEvents() {
    // Thumbnail clicks
    this.thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        this.setActiveImage(index);
      });
    });

    // Arrow navigation
    const prevBtn = this.container.querySelector('.gallery-prev');
    const nextBtn = this.container.querySelector('.gallery-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prev());
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.next());
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.container.closest('.product-page')) return;

      if (e.key === 'ArrowLeft') {
        this.prev();
      } else if (e.key === 'ArrowRight') {
        this.next();
      }
    });
  },

  initMobileSwipe() {
    if (!this.container) return;

    let startX = 0;
    let endX = 0;

    this.container.addEventListener('touchstart', (e) => {
      startX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].screenX;
      this.handleSwipe(startX, endX);
    }, { passive: true });
  },

  handleSwipe(startX, endX) {
    const threshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  },

  setActiveImage(index) {
    this.currentIndex = index;

    // Update main image
    if (this.mainImage) {
      this.mainImage.style.opacity = '0';

      setTimeout(() => {
        this.mainImage.src = this.images[index];
        this.mainImage.style.opacity = '1';
      }, 150);
    }

    // Update thumbnails
    this.thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });
  },

  next() {
    const newIndex = (this.currentIndex + 1) % this.images.length;
    this.setActiveImage(newIndex);
  },

  prev() {
    const newIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.setActiveImage(newIndex);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Initialize gallery on product page
  ImageGallery.init('.product-gallery');
});

export { ImageGallery };
