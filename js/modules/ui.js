/**
 * LAHAR - UI Utilities Module
 *
 * Shared UI functionality: modals, drawers, toasts, etc.
 */

const UI = {
  /**
   * Show toast notification
   */
  showToast(message, type = 'default') {
    // Create toast container if it doesn't exist
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('active');
    });

    // Remove after delay
    setTimeout(() => {
      toast.classList.remove('active');
      setTimeout(() => toast.remove(), 300);
    }, 3000);

    return this;
  },

  /**
   * Open drawer
   */
  openDrawer(drawerId) {
    const drawer = document.getElementById(drawerId) || document.querySelector(`.${drawerId}`);
    const overlay = document.querySelector('.drawer-overlay');

    if (drawer) {
      drawer.classList.add('active');
      document.body.classList.add('drawer-open');
    }

    if (overlay) {
      overlay.classList.add('active');
    }

    return this;
  },

  /**
   * Close drawer
   */
  closeDrawer(drawerId) {
    const drawer = document.getElementById(drawerId) || document.querySelector(`.${drawerId}`);
    const overlay = document.querySelector('.drawer-overlay');

    if (drawer) {
      drawer.classList.remove('active');
    }

    if (overlay) {
      overlay.classList.remove('active');
    }

    document.body.classList.remove('drawer-open');

    return this;
  },

  /**
   * Toggle drawer
   */
  toggleDrawer(drawerId) {
    const drawer = document.getElementById(drawerId) || document.querySelector(`.${drawerId}`);
    if (drawer && drawer.classList.contains('active')) {
      this.closeDrawer(drawerId);
    } else {
      this.openDrawer(drawerId);
    }
    return this;
  },

  /**
   * Open mobile menu
   */
  openMobileMenu() {
    const menuToggle = document.querySelector('.navbar-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuToggle && mobileMenu) {
      menuToggle.classList.add('active');
      mobileMenu.classList.add('active');
      document.body.classList.add('nav-open');
    }

    return this;
  },

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    const menuToggle = document.querySelector('.navbar-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuToggle && mobileMenu) {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('nav-open');
    }

    return this;
  },

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    const menuToggle = document.querySelector('.navbar-menu-toggle');
    if (menuToggle && menuToggle.classList.contains('active')) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
    return this;
  },

  /**
   * Open search overlay
   */
  openSearch() {
    const searchOverlay = document.querySelector('.search-overlay');
    if (searchOverlay) {
      searchOverlay.classList.add('active');
      document.body.classList.add('search-open');
      const input = searchOverlay.querySelector('.search-input');
      if (input) input.focus();
    }
    return this;
  },

  /**
   * Close search overlay
   */
  closeSearch() {
    const searchOverlay = document.querySelector('.search-overlay');
    if (searchOverlay) {
      searchOverlay.classList.remove('active');
      document.body.classList.remove('search-open');
    }
    return this;
  },

  /**
   * Initialize scroll animations
   */
  initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));

    // Also observe parent containers for stagger effects
    const staggerContainers = document.querySelectorAll('[data-animate-stagger]');
    staggerContainers.forEach(el => observer.observe(el));

    return this;
  },

  /**
   * Initialize expandable sections (accordion)
   */
  initExpandables() {
    document.querySelectorAll('.expandable-header').forEach(header => {
      header.addEventListener('click', () => {
        const expandable = header.closest('.expandable');
        const isActive = expandable.classList.contains('active');

        // Close all others (optional - for accordion behavior)
        // document.querySelectorAll('.expandable').forEach(el => el.classList.remove('active'));

        if (isActive) {
          expandable.classList.remove('active');
        } else {
          expandable.classList.add('active');
        }
      });
    });

    return this;
  },

  /**
   * Initialize parallax effects
   */
  initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (parallaxElements.length === 0) return this;

    const handleScroll = () => {
      const scrollY = window.scrollY;

      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const offset = scrollY * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return this;
  },

  /**
   * Initialize lazy loading for images
   */
  initLazyLoading() {
    const lazyImages = document.querySelectorAll('.img-lazy');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      lazyImages.forEach(img => {
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
      });
    }

    return this;
  },

  /**
   * Format price for Nepal (NPR)
   */
  formatPrice(price) {
    return `NPR ${price.toLocaleString()}`;
  },

  /**
   * Debounce function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

// Export for module use
export { UI };
