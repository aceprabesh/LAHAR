/**
 * LAHAR - Standalone App Initialization
 * Works without a server - just open HTML files directly
 *
 * This version bundles essential functionality for the prototype.
 * The modular version (main.js) should be used when serving from a web server.
 */

// ============================================
// PRODUCTS DATA (inline for prototype)
// ============================================

const PRODUCTS = [
  {
    id: 1,
    name: "AABHA KURTHA",
    slug: "aabha-kurtha",
    price: 14500,
    category: "kurtha",
    images: ["/assets/images/products/3f38a848f1e62ee785a55ad35d2e88e6.jpg"],
    colors: [{ name: "Sand", hex: "#D8C7AD" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    featured: true,
    newArrival: true
  },
  {
    id: 2,
    name: "JUNELI KURTHA",
    slug: "juneli-kurtha",
    price: 18900,
    category: "kurtha",
    images: ["/assets/images/products/645a90d1567d6312acb70281133a5466.jpg"],
    colors: [{ name: "Terracotta", hex: "#A65D45" }],
    sizes: ["XS", "S", "M", "L"],
    featured: true,
    newArrival: true
  },
  {
    id: 3,
    name: "LAHAR KURTHA",
    slug: "lahar-kurtha",
    price: 7500,
    category: "kurtha",
    images: ["/assets/images/products/85438a6504903e627f5421cd395e4eee.jpg"],
    colors: [{ name: "Charcoal", hex: "#1C1C1A" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    featured: true,
    newArrival: true
  },
  {
    id: 4,
    name: "RITU KURTHA",
    slug: "ritu-kurtha",
    price: 9800,
    category: "kurtha",
    images: ["/assets/images/products/7fb7dd8f8fb89955fb3095e49f97808a.jpg"],
    colors: [{ name: "Sage", hex: "#7B8068" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    featured: true,
    newArrival: true
  },
  {
    id: 5,
    name: "SIRA KURTHA",
    slug: "sira-kurtha",
    price: 12500,
    category: "kurtha",
    images: ["/assets/images/products/df1638734489d337f34d15df02b2262e.jpg"],
    colors: [{ name: "Ivory", hex: "#F5F0E8" }],
    sizes: ["XS", "S", "M", "L"],
    featured: true,
    newArrival: true
  },
  {
    id: 6,
    name: "NAMUNA KURTHA",
    slug: "namuna-kurtha",
    price: 15500,
    category: "kurtha",
    images: ["/assets/images/products/f346d98c4755de715775d330f93edbec.jpg"],
    colors: [{ name: "Sand", hex: "#D8C7AD" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    featured: true,
    newArrival: true
  }
];

const ProductService = {
  getAll: (filters = {}) => {
    let results = [...PRODUCTS];
    if (filters.category) results = results.filter(p => p.category === filters.category);
    if (filters.sort === 'price-asc') results.sort((a, b) => a.price - b.price);
    if (filters.sort === 'price-desc') results.sort((a, b) => b.price - a.price);
    return results;
  },
  getBySlug: (slug) => PRODUCTS.find(p => p.slug === slug),
  getFeatured: () => PRODUCTS.filter(p => p.featured),
  getNewArrivals: () => PRODUCTS.filter(p => p.newArrival)
};

// ============================================
// CART MODULE
// ============================================

const Cart = {
  STORAGE_KEY: 'lahar_cart',
  items: [],

  init() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try { this.items = JSON.parse(stored); } catch (e) { this.items = []; }
    }
    this.updateUI();
    return this;
  },

  add(product, size, color, quantity = 1) {
    const existingIndex = this.items.findIndex(
      item => item.productId === product.id && item.size === size && item.color === color.name
    );
    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        id: Date.now(),
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
    return this;
  },

  remove(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.save();
    this.updateUI();
    return this;
  },

  updateQuantity(itemId, quantity) {
    if (quantity <= 0) return this.remove(itemId);
    const item = this.items.find(item => item.id === itemId);
    if (item) { item.quantity = quantity; this.save(); this.updateUI(); }
    return this;
  },

  getItems() { return this.items; },
  getCount() { return this.items.reduce((sum, item) => sum + item.quantity, 0); },
  getSubtotal() { return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0); },
  getFormattedSubtotal() { return `NPR ${this.getSubtotal().toLocaleString()}`; },
  isEmpty() { return this.items.length === 0; },
  clear() { this.items = []; this.save(); this.updateUI(); },

  save() { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items)); },

  updateUI() {
    const count = this.getCount();
    document.querySelectorAll('.bag-count').forEach(el => {
      el.textContent = count;
      el.classList.toggle('active', count > 0);
    });
  },

  renderCartDrawer() {
    const drawerBody = document.querySelector('.cart-drawer-body');
    if (!drawerBody) return;
    if (this.isEmpty()) {
      drawerBody.innerHTML = '<div class="cart-empty"><p class="text-center text-muted">Your bag is empty</p></div>';
      return;
    }
    drawerBody.innerHTML = `
      <div class="cart-items">
        ${this.items.map(item => `
          <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image"><img src="${item.image}" alt="${item.name}"></div>
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
            <button class="cart-item-remove" data-id="${item.id}">✕</button>
          </div>
        `).join('')}
      </div>
      <div class="cart-subtotal"><span>Subtotal</span><span>${this.getFormattedSubtotal()}</span></div>
    `;
    this.attachDrawerListeners();
  },

  attachDrawerListeners() {
    const body = document.querySelector('.cart-drawer-body');
    if (!body) return;
    body.querySelectorAll('.quantity-btn').forEach(btn => {
      btn.onclick = () => {
        const id = parseInt(btn.dataset.id);
        const item = this.items.find(i => i.id === id);
        if (item) this.updateQuantity(id, item.quantity + (btn.dataset.action === 'increase' ? 1 : -1));
      };
    });
    body.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.onclick = () => this.remove(parseInt(btn.dataset.id));
    });
  },

  formatPrice(price) { return `NPR ${price.toLocaleString()}`; }
};

// ============================================
// WISHLIST MODULE
// ============================================

const Wishlist = {
  STORAGE_KEY: 'lahar_wishlist',
  items: [],

  init() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try { this.items = JSON.parse(stored); } catch (e) { this.items = []; }
    }
    return this;
  },

  toggle(productId) {
    if (this.items.includes(productId)) {
      this.items = this.items.filter(id => id !== productId);
    } else {
      this.items.push(productId);
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
  },

  has(productId) { return this.items.includes(productId); }
};

// ============================================
// UI UTILITIES
// ============================================

const UI = {
  showToast(message, type = 'default') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('active'));
    setTimeout(() => { toast.classList.remove('active'); setTimeout(() => toast.remove(), 300); }, 3000);
  },

  openDrawer() {
    document.querySelector('.cart-drawer')?.classList.add('active');
    document.querySelector('.drawer-overlay')?.classList.add('active');
    Cart.renderCartDrawer();
  },

  closeDrawer() {
    document.querySelector('.cart-drawer')?.classList.remove('active');
    document.querySelector('.drawer-overlay')?.classList.remove('active');
  }
};

// ============================================
// NAVBAR
// ============================================

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.navbar-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const bagIcon = document.querySelector('.navbar-icon-bag');
  const searchIcon = document.querySelector('.navbar-icon-search');
  const drawerOverlay = document.querySelector('.drawer-overlay');
  const searchOverlay = document.querySelector('.search-overlay');

  // Scroll behavior
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Mobile menu toggle
  menuToggle?.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu?.classList.toggle('active');
    document.body.classList.toggle('nav-open');
  });

  // Close mobile menu on link click
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle?.classList.remove('active');
      mobileMenu?.classList.remove('active');
      document.body.classList.remove('nav-open');
    });
  });

  // Cart drawer
  bagIcon?.addEventListener('click', (e) => {
    e.preventDefault();
    UI.openDrawer();
  });

  // Close drawer
  document.querySelector('.drawer-close')?.addEventListener('click', UI.closeDrawer);
  drawerOverlay?.addEventListener('click', UI.closeDrawer);

  // Search overlay
  searchIcon?.addEventListener('click', () => {
    searchOverlay?.classList.add('active');
    document.body.classList.add('search-open');
    searchOverlay?.querySelector('.search-input')?.focus();
  });

  searchOverlay?.querySelector('.search-close')?.addEventListener('click', () => {
    searchOverlay.classList.remove('active');
    document.body.classList.remove('search-open');
  });

  // Escape key closes drawers
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      UI.closeDrawer();
      mobileMenu?.classList.remove('active');
      menuToggle?.classList.remove('active');
      document.body.classList.remove('nav-open');
      searchOverlay?.classList.remove('active');
    }
  });
}

// ============================================
// PRODUCT CARD RENDERER
// ============================================

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="product-card-image">
      <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
      ${product.images[1] ? `<img src="${product.images[1]}" alt="${product.name}" loading="lazy">` : ''}
      <button class="product-card-wishlist wishlist-icon ${Wishlist.has(product.id) ? 'active' : ''}" data-product-id="${product.id}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="${Wishlist.has(product.id) ? '#A65D45' : 'none'}" stroke="${Wishlist.has(product.id) ? '#A65D45' : 'currentColor'}" stroke-width="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </button>
      ${product.newArrival ? '<span class="badge badge-terracotta" style="position: absolute; top: 16px; left: 16px;">New</span>' : ''}
      <div class="product-card-quick-add"><span>Quick Add</span></div>
    </div>
    <div class="product-card-info">
      <h3 class="product-card-name">${product.name}</h3>
      <p class="product-card-price">${Cart.formatPrice ? Cart.formatPrice(product.price) : `NPR ${product.price.toLocaleString()}`}</p>
    </div>
  `;

  // Wishlist toggle
  card.querySelector('.wishlist-icon')?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    Wishlist.toggle(product.id);
    const icon = card.querySelector('.wishlist-icon');
    const svg = icon?.querySelector('svg');
    if (Wishlist.has(product.id)) {
      icon?.classList.add('active');
      svg?.setAttribute('fill', '#A65D45');
      svg?.setAttribute('stroke', '#A65D45');
    } else {
      icon?.classList.remove('active');
      svg?.setAttribute('fill', 'none');
      svg?.setAttribute('stroke', 'currentColor');
    }
  });

  // Quick add
  card.querySelector('.product-card-quick-add')?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    Cart.add(product, product.sizes[0], product.colors[0], 1);
    UI.showToast(`${product.name} added to bag`, 'success');
  });

  // Click to product page
  card.addEventListener('click', () => {
    window.location.href = `/product.html?slug=${product.slug}`;
  });

  return card;
}

function renderProductGrid(products, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.innerHTML = '';
  products.forEach(product => container.appendChild(createProductCard(product)));
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ============================================
// EXPANDABLE SECTIONS
// ============================================

function initExpandables() {
  document.querySelectorAll('.expandable-header').forEach(header => {
    header.addEventListener('click', () => {
      const expandable = header.closest('.expandable');
      expandable?.classList.toggle('active');
    });
  });
}

// ============================================
// PRODUCT CARD SIZE FIX
// ============================================
// Fix Cart.formatPrice if it doesn't exist
if (!Cart.formatPrice) {
  Cart.formatPrice = function(price) { return `NPR ${price.toLocaleString()}`; };
}

// ============================================
// INITIALIZE APP
// ============================================

function initApp() {
  Cart.init();
  Wishlist.init();
  initNavbar();
  initScrollAnimations();
  initExpandables();

  // Render product grids
  const featuredGrid = document.querySelector('.featured-products-grid, .products-grid');
  if (featuredGrid) {
    renderProductGrid(ProductService.getFeatured(), '.featured-products-grid, .products-grid');
  }

  const newArrivalsGrid = document.querySelector('.new-arrivals-grid');
  if (newArrivalsGrid) {
    renderProductGrid(ProductService.getNewArrivals(), '.new-arrivals-grid');
  }

  const shopGrid = document.querySelector('.shop-products-grid');
  if (shopGrid) {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    const filters = category ? { category } : {};
    renderProductGrid(ProductService.getAll(filters), '.shop-products-grid');
    document.querySelector('.shop-count').textContent = `${ProductService.getAll(filters).length} products`;
  }

  // Filter handling for shop page
  document.querySelectorAll('.filter-option input').forEach(input => {
    input.addEventListener('change', () => {
      const filters = {};
      document.querySelectorAll('.filter-option input:checked').forEach(checked => {
        if (checked.value !== 'all') {
          filters[checked.dataset.filter] = checked.value;
        }
      });
      const grid = document.querySelector('.shop-products-grid');
      if (grid) {
        renderProductGrid(ProductService.getAll(filters), '.shop-products-grid');
        document.querySelector('.shop-count').textContent = `${ProductService.getAll(filters).length} products`;
      }
    });
  });

  // Newsletter form
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value;
      if (email) {
        UI.showToast('Thank you for joining the LAHAR world!', 'success');
        form.reset();
      }
    });
  });

  // Cart drawer footer visibility
  const drawerFooter = document.querySelector('.cart-drawer-footer');
  if (drawerFooter) {
    drawerFooter.style.display = Cart.isEmpty() ? 'none' : 'block';
  }

  document.body.classList.add('page-loaded');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
