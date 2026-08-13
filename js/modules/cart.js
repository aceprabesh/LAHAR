/**
 * LAHAR - Cart Module
 *
 * Shopping cart management with localStorage persistence.
 * Structured for easy backend integration when PHP/MySQL is connected.
 *
 * TO CONNECT BACKEND:
 * 1. When user logs in, sync cart with server via api.post('/cart', cartData)
 * 2. On page load, fetch cart from server if user is authenticated
 * 3. For guest users, continue using localStorage
 */

const Cart = {
  // Storage key
  STORAGE_KEY: 'lahar_cart',

  // Cart items array
  items: [],

  /**
   * Initialize cart from localStorage or API
   */
  init() {
    // Load from localStorage
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.items = JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing cart data:', e);
        this.items = [];
      }
    }

    // Update UI
    this.updateUI();

    // Listen for storage changes (for multi-tab sync)
    window.addEventListener('storage', (e) => {
      if (e.key === this.STORAGE_KEY) {
        this.items = JSON.parse(e.newValue || '[]');
        this.updateUI();
      }
    });

    return this;
  },

  /**
   * Add item to cart
   * @param {object} product - Product object
   * @param {string} size - Selected size
   * @param {string} color - Selected color
   * @param {number} quantity - Quantity (default 1)
   */
  add(product, size, color, quantity = 1) {
    // Check if item already exists in cart
    const existingIndex = this.items.findIndex(
      item => item.productId === product.id &&
              item.size === size &&
              item.color === color.name
    );

    if (existingIndex > -1) {
      // Update quantity
      this.items[existingIndex].quantity += quantity;
    } else {
      // Add new item
      this.items.push({
        id: Date.now(), // Temporary ID
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        size: size,
        color: color.name,
        colorHex: color.hex,
        image: product.images[0],
        quantity: quantity
      });
    }

    this.save();
    this.updateUI();

    // Show toast notification
    if (typeof UI !== 'undefined') {
      UI.showToast(`${product.name} added to bag`, 'success');
    }

    // Sync to backend if user is logged in
    this.syncToBackend();

    return this;
  },

  /**
   * Remove item from cart
   * @param {number} itemId - Cart item ID
   */
  remove(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.save();
    this.updateUI();
    this.syncToBackend();
    return this;
  },

  /**
   * Update item quantity
   * @param {number} itemId - Cart item ID
   * @param {number} quantity - New quantity
   */
  updateQuantity(itemId, quantity) {
    if (quantity <= 0) {
      return this.remove(itemId);
    }

    const item = this.items.find(item => item.id === itemId);
    if (item) {
      item.quantity = quantity;
      this.save();
      this.updateUI();
      this.syncToBackend();
    }

    return this;
  },

  /**
   * Get cart items
   */
  getItems() {
    return this.items;
  },

  /**
   * Get item count
   */
  getCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  /**
   * Get subtotal
   */
  getSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  /**
   * Get formatted subtotal
   */
  getFormattedSubtotal() {
    return this.formatPrice(this.getSubtotal());
  },

  /**
   * Check if cart is empty
   */
  isEmpty() {
    return this.items.length === 0;
  },

  /**
   * Clear cart
   */
  clear() {
    this.items = [];
    this.save();
    this.updateUI();
    this.syncToBackend();
    return this;
  },

  /**
   * Save cart to localStorage
   */
  save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
  },

  /**
   * Format price in NPR
   */
  formatPrice(price) {
    return `NPR ${price.toLocaleString()}`;
  },

  /**
   * Update all UI elements
   */
  updateUI() {
    // Update bag count in navbar
    const bagCounts = document.querySelectorAll('.bag-count');
    const count = this.getCount();
    bagCounts.forEach(el => {
      el.textContent = count;
      el.classList.toggle('active', count > 0);
    });

    // Update cart drawer if open
    const cartDrawer = document.querySelector('.cart-drawer');
    if (cartDrawer && cartDrawer.classList.contains('active')) {
      this.renderCartDrawer();
    }

    // Update cart page
    this.updateCartPage();
  },

  /**
   * Render cart drawer content
   */
  renderCartDrawer() {
    const drawerBody = document.querySelector('.cart-drawer-body');
    if (!drawerBody) return;

    if (this.isEmpty()) {
      drawerBody.innerHTML = `
        <div class="cart-empty">
          <p class="text-center text-muted">Your bag is empty</p>
          <a href="/shop.html" class="btn btn-secondary btn-full mt-6">Continue Shopping</a>
        </div>
      `;
      return;
    }

    drawerBody.innerHTML = `
      <div class="cart-items">
        ${this.items.map(item => `
          <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
              <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
              <h4 class="cart-item-name">${item.name}</h4>
              <p class="cart-item-variant text-muted">${item.color} / ${item.size}</p>
              <div class="cart-item-bottom">
                <div class="quantity-selector">
                  <button class="quantity-btn" data-action="decrease" data-id="${item.id}">−</button>
                  <span class="quantity-input">${item.quantity}</span>
                  <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
                </div>
                <p class="cart-item-price">${this.formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        `).join('')}
      </div>
      <div class="cart-subtotal">
        <span>Subtotal</span>
        <span>${this.getFormattedSubtotal()}</span>
      </div>
      <p class="cart-shipping-note text-muted text-center">Shipping calculated at checkout</p>
    `;

    // Attach event listeners
    this.attachDrawerListeners();
  },

  /**
   * Attach event listeners to cart drawer
   */
  attachDrawerListeners() {
    const drawerBody = document.querySelector('.cart-drawer-body');
    if (!drawerBody) return;

    // Quantity buttons
    drawerBody.querySelectorAll('.quantity-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(btn.dataset.id);
        const action = btn.dataset.action;
        const item = this.items.find(i => i.id === id);

        if (item) {
          if (action === 'increase') {
            this.updateQuantity(id, item.quantity + 1);
          } else if (action === 'decrease') {
            this.updateQuantity(id, item.quantity - 1);
          }
        }
      });
    });

    // Remove buttons
    drawerBody.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        this.remove(id);
      });
    });
  },

  /**
   * Update cart page
   */
  updateCartPage() {
    const cartPage = document.querySelector('.cart-page-content');
    if (!cartPage) return;

    if (this.isEmpty()) {
      cartPage.innerHTML = `
        <div class="cart-empty-state">
          <h2 class="heading-md mb-4">Your bag is empty</h2>
          <p class="text-muted mb-8">Looks like you haven't added anything to your bag yet.</p>
          <a href="/shop.html" class="btn btn-primary">Continue Shopping</a>
        </div>
      `;
      return;
    }

    // For cart page, we'll let the HTML render initially and just update totals
    const subtotalEl = document.querySelector('.cart-subtotal-total');
    if (subtotalEl) {
      subtotalEl.textContent = this.getFormattedSubtotal();
    }
  },

  /**
   * Sync cart to backend
   * Called after any cart modification
   */
  async syncToBackend() {
    // TODO: When backend is connected, POST to /api/cart
    // if (Auth.isLoggedIn()) {
    //   try {
    //     await api.post('/cart', { items: this.items });
    //   } catch (error) {
    //     console.error('Failed to sync cart:', error);
    //   }
    // }
  },

  /**
   * Load cart from backend (when user logs in)
   */
  async loadFromBackend() {
    // TODO: When backend is connected, fetch from /api/cart
    // try {
    //   const response = await api.get('/cart');
    //   this.items = response.data;
    //   this.save();
    //   this.updateUI();
    // } catch (error) {
    //   console.error('Failed to load cart:', error);
    // }
  }
};

// Initialize cart on load
document.addEventListener('DOMContentLoaded', () => {
  Cart.init();
});

// Export for module use
export { Cart };
