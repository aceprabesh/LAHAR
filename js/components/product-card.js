/**
 * LAHAR - Product Card Component
 */

import { Cart } from '../modules/cart.js';
import { Wishlist } from '../modules/wishlist.js';
import { UI } from '../modules/ui.js';

/**
 * Create a product card HTML element
 * @param {object} product - Product data
 * @param {string} size - Card size variant: 'default', 'large', 'small'
 */
function createProductCard(product, size = 'default') {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  const card = document.createElement('div');
  card.className = `product-card ${isLarge ? 'product-card-large' : ''} ${isSmall ? 'product-card-small' : ''}`;
  card.dataset.productId = product.id;

  const formattedPrice = Cart.formatPrice(product.price);
  const originalPrice = product.originalPrice ? Cart.formatPrice(product.originalPrice) : null;

  card.innerHTML = `
    <div class="product-card-image">
      <img
        src="${product.images[0]}"
        alt="${product.name}"
        loading="lazy"
        class="img-lazy"
      >
      ${product.images[1] ? `
        <img
          src="${product.images[1]}"
          alt="${product.name}"
          loading="lazy"
          class="img-lazy"
        >
      ` : ''}

      <button class="product-card-wishlist wishlist-icon ${Wishlist.has(product.id) ? 'active' : ''}"
              data-product-id="${product.id}"
              aria-label="Add to wishlist">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="${Wishlist.has(product.id) ? '#A65D45' : 'none'}" stroke="${Wishlist.has(product.id) ? '#A65D45' : 'currentColor'}" stroke-width="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </button>

      ${product.newArrival ? '<span class="badge badge-terracotta" style="position: absolute; top: 16px; left: 16px;">New</span>' : ''}

      <div class="product-card-quick-add">
        <span>Quick Add</span>
      </div>
    </div>

    <div class="product-card-info">
      <h3 class="product-card-name">${product.name}</h3>
      <div class="product-card-price-wrapper">
        <span class="product-card-price">${formattedPrice}</span>
        ${originalPrice ? `<span class="product-card-original-price">${originalPrice}</span>` : ''}
      </div>

      ${product.colors.length > 1 ? `
        <div class="product-card-colors">
          ${product.colors.map(color => `
            <span
              class="color-swatch"
              style="background-color: ${color.hex}"
              title="${color.name}"
            ></span>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;

  // Bind events
  bindProductCardEvents(card, product);

  return card;
}

/**
 * Bind events to a product card
 */
function bindProductCardEvents(card, product) {
  // Wishlist toggle
  const wishlistBtn = card.querySelector('.wishlist-icon');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      Wishlist.toggle(product.id);
      wishlistBtn.classList.toggle('active');
    });
  }

  // Quick add
  const quickAdd = card.querySelector('.product-card-quick-add');
  if (quickAdd) {
    quickAdd.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Add with default size and first color
      const defaultSize = product.sizes[0];
      const defaultColor = product.colors[0];

      Cart.add(product, defaultSize, defaultColor, 1);
    });
  }

  // Click to product page
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.wishlist-icon') && !e.target.closest('.product-card-quick-add')) {
      window.location.href = `/product.html?slug=${product.slug}`;
    }
  });
}

/**
 * Render product grid
 * @param {array} products - Array of product objects
 * @param {string} containerSelector - CSS selector for container
 * @param {object} options - Grid options
 */
function renderProductGrid(products, containerSelector, options = {}) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const {
    size = 'default',
    emptyMessage = 'No products found'
  } = options;

  container.innerHTML = '';

  if (products.length === 0) {
    container.innerHTML = `
      <div class="products-empty">
        <p class="text-center text-muted">${emptyMessage}</p>
      </div>
    `;
    return;
  }

  products.forEach(product => {
    const card = createProductCard(product, size);
    container.appendChild(card);
  });
}

/**
 * Initialize product card lazy loading after render
 */
function initProductCardLazyLoading() {
  const lazyImages = document.querySelectorAll('.product-card-image img');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }
}

export { createProductCard, renderProductGrid, initProductCardLazyLoading };
