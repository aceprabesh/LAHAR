/**
 * LAHAR - Navbar Component
 */

import { UI } from '../modules/ui.js';

const Navbar = {
  init() {
    this.navbar = document.querySelector('.navbar');
    this.menuToggle = document.querySelector('.navbar-menu-toggle');
    this.searchIcon = document.querySelector('.navbar-icon-search');
    this.accountIcon = document.querySelector('.navbar-icon-account');
    this.bagIcon = document.querySelector('.navbar-icon-bag');
    this.searchOverlay = document.querySelector('.search-overlay');
    this.cartDrawer = document.querySelector('.cart-drawer');
    this.drawerOverlay = document.querySelector('.drawer-overlay');

    if (!this.navbar) return this;

    this.bindEvents();
    this.initScrollBehavior();
    return this;
  },

  bindEvents() {
    // Mobile menu toggle
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', () => {
        UI.toggleMobileMenu();
      });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-menu-nav a').forEach(link => {
      link.addEventListener('click', () => {
        UI.closeMobileMenu();
      });
    });

    // Search toggle
    if (this.searchIcon) {
      this.searchIcon.addEventListener('click', () => {
        UI.openSearch();
      });
    }

    // Close search on escape or click outside
    if (this.searchOverlay) {
      this.searchOverlay.addEventListener('click', (e) => {
        if (e.target === this.searchOverlay) {
          UI.closeSearch();
        }
      });

      const searchClose = this.searchOverlay.querySelector('.search-close');
      if (searchClose) {
        searchClose.addEventListener('click', () => {
          UI.closeSearch();
        });
      }
    }

    // Cart drawer toggle
    if (this.bagIcon) {
      this.bagIcon.addEventListener('click', () => {
        UI.openDrawer('cart-drawer');
      });
    }

    // Close drawer on overlay click
    if (this.drawerOverlay) {
      this.drawerOverlay.addEventListener('click', () => {
        UI.closeDrawer('cart-drawer');
      });
    }

    // Close drawer on close button click
    document.querySelectorAll('.drawer-close').forEach(btn => {
      btn.addEventListener('click', () => {
        UI.closeDrawer('cart-drawer');
      });
    });

    // Escape key closes drawers/menus
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        UI.closeDrawer('cart-drawer');
        UI.closeMobileMenu();
        UI.closeSearch();
      }
    });
  },

  initScrollBehavior() {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Add/remove scrolled class
          if (currentScrollY > 50) {
            this.navbar.classList.add('scrolled');
          } else {
            this.navbar.classList.remove('scrolled');
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Navbar.init();
});

export { Navbar };
