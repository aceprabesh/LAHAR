/**
 * LAHAR - Wishlist Module
 *
 * Wishlist management with localStorage persistence.
 */

const Wishlist = {
  STORAGE_KEY: 'lahar_wishlist',
  items: [],

  init() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.items = JSON.parse(stored);
      } catch (e) {
        this.items = [];
      }
    }
    this.updateUI();
    return this;
  },

  add(productId) {
    if (!this.items.includes(productId)) {
      this.items.push(productId);
      this.save();
      this.updateUI();

      if (typeof UI !== 'undefined') {
        UI.showToast('Added to wishlist', 'success');
      }
    }
    return this;
  },

  remove(productId) {
    this.items = this.items.filter(id => id !== productId);
    this.save();
    this.updateUI();
    return this;
  },

  toggle(productId) {
    if (this.has(productId)) {
      this.remove(productId);
    } else {
      this.add(productId);
    }
    return this;
  },

  has(productId) {
    return this.items.includes(productId);
  },

  getItems() {
    return this.items;
  },

  getCount() {
    return this.items.length;
  },

  isEmpty() {
    return this.items.length === 0;
  },

  clear() {
    this.items = [];
    this.save();
    this.updateUI();
    return this;
  },

  save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
  },

  updateUI() {
    // Update all wishlist icons
    document.querySelectorAll('.wishlist-icon').forEach(icon => {
      const productId = parseInt(icon.dataset.productId);
      if (this.has(productId)) {
        icon.classList.add('active');
        icon.querySelector('svg').setAttribute('fill', '#A65D45');
        icon.querySelector('svg').setAttribute('stroke', '#A65D45');
      } else {
        icon.classList.remove('active');
        icon.querySelector('svg').setAttribute('fill', 'none');
        icon.querySelector('svg').setAttribute('stroke', 'currentColor');
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Wishlist.init();
});

export { Wishlist };
