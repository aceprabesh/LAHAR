/**
 * LAHAR - Main JavaScript Entry Point
 *
 * Initializes all modules and components on page load.
 */

// Import all modules
import { api, API_CONFIG } from './config/api.js';
import { PRODUCTS, ProductService, CATEGORIES, JOURNAL_ARTICLES } from './data/products.js';
import { Cart } from './modules/cart.js';
import { Wishlist } from './modules/wishlist.js';
import { Auth } from './modules/auth.js';
import { UI } from './modules/ui.js';
import { waveGenerator, initWaveAnimations } from './modules/waves.js';
import { Navbar } from './components/navbar.js';
import { Newsletter } from './components/newsletter.js';

/**
 * Initialize all components and modules
 */
function initApp() {
  // Initialize core modules
  Cart.init();
  Wishlist.init();
  Auth.init();

  // Initialize UI features
  UI.initScrollAnimations();
  UI.initExpandables();
  UI.initLazyLoading();

  // Initialize components
  Navbar.init();
  Newsletter.init();

  // Initialize wave animations
  initWaveAnimations();

  // Initialize parallax if present
  UI.initParallax();

  // Initialize product grids if present
  if (typeof initProductGrids === 'function') {
    initProductGrids();
  }

  // Initialize cart drawer if present
  initCartDrawer();

  // Mark page as loaded
  document.body.classList.add('page-loaded');

  console.log('LAHAR initialized');
}

/**
 * Initialize cart drawer
 */
function initCartDrawer() {
  const cartDrawer = document.querySelector('.cart-drawer');
  const drawerOverlay = document.querySelector('.drawer-overlay');

  if (cartDrawer) {
    // Render initial cart content
    Cart.renderCartDrawer();
  }
}

/**
 * Initialize product grids based on page
 */
function initProductGrids() {
  const featuredGrid = document.querySelector('.featured-products-grid');
  const newArrivalsGrid = document.querySelector('.new-arrivals-grid');
  const shopGrid = document.querySelector('.shop-products-grid');

  if (featuredGrid) {
    const featured = ProductService.getFeatured();
    renderProductGrid(featured, featuredGrid, { size: 'default' });
  }

  if (newArrivalsGrid) {
    const newArrivals = ProductService.getNewArrivals();
    renderProductGrid(newArrivals, newArrivalsGrid, { size: 'default' });
  }

  if (shopGrid) {
    // Get filters from URL params if present
    const params = new URLSearchParams(window.location.search);
    const filters = {
      category: params.get('category') || '',
      sort: params.get('sort') || 'featured'
    };

    const products = ProductService.getAll(filters);
    renderProductGrid(products, shopGrid, { size: 'default' });
  }
}

/**
 * Render product grid (imported from product-card.js)
 */
function renderProductGrid(products, container, options = {}) {
  if (!container || !products.length) return;

  const { size = 'default' } = options;

  products.forEach(product => {
    const card = createProductCard(product, size);
    container.appendChild(card);
  });
}

// Import createProductCard for grid rendering
import { createProductCard } from './components/product-card.js';

/**
 * Handle page-specific initializations
 */
function initPageSpecific() {
  const page = document.body.dataset.page;

  switch (page) {
    case 'home':
      initHomePage();
      break;
    case 'shop':
      initShopPage();
      break;
    case 'product':
      initProductPage();
      break;
    case 'cart':
      initCartPage();
      break;
    case 'checkout':
      initCheckoutPage();
      break;
  }
}

/**
 * Initialize home page specific features
 */
function initHomePage() {
  // Add parallax to hero if present
  const hero = document.querySelector('.hero');
  if (hero) {
    const heroImage = hero.querySelector('.hero-image');
    if (heroImage) {
      heroImage.dataset.parallax = '0.3';
    }
  }

  // Initialize scroll-triggered animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-animate]').forEach(el => {
    animateOnScroll.observe(el);
  });
}

/**
 * Initialize shop page specific features
 */
function initShopPage() {
  // Initialize filters
  initShopFilters();

  // Initialize sort dropdown
  initShopSort();
}

/**
 * Initialize shop filters
 */
function initShopFilters() {
  const filterInputs = document.querySelectorAll('.filter-input');
  const shopGrid = document.querySelector('.shop-products-grid');
  const activeFilters = {};

  filterInputs.forEach(input => {
    input.addEventListener('change', () => {
      const filterType = input.dataset.filter;
      const value = input.value;

      if (value === 'all') {
        delete activeFilters[filterType];
      } else {
        activeFilters[filterType] = value;
      }

      applyFilters(activeFilters, shopGrid);
    });
  });
}

/**
 * Apply filters and re-render grid
 */
function applyFilters(filters, container) {
  const products = ProductService.getAll(filters);

  container.innerHTML = '';
  container.classList.add('filtering');

  // Simulate brief delay for smooth transition
  setTimeout(() => {
    products.forEach(product => {
      const card = createProductCard(product);
      container.appendChild(card);
    });
    container.classList.remove('filtering');
  }, 200);
}

/**
 * Initialize shop sort
 */
function initShopSort() {
  const sortSelect = document.querySelector('.shop-sort select');
  const shopGrid = document.querySelector('.shop-products-grid');

  if (sortSelect && shopGrid) {
    sortSelect.addEventListener('change', () => {
      const sortValue = sortSelect.value;
      const params = new URLSearchParams(window.location.search);
      params.set('sort', sortValue);

      // Update URL without reload
      window.history.replaceState({}, '', `?${params.toString()}`);

      // Re-filter with new sort
      const filters = { sort: sortValue };
      applyFilters(filters, shopGrid);
    });
  }
}

/**
 * Initialize product page specific features
 */
function initProductPage() {
  // Initialize image gallery
  if (typeof ImageGallery !== 'undefined') {
    ImageGallery.init('.product-gallery');
  }

  // Initialize size selector
  initSizeSelector();

  // Initialize color selector
  initColorSelector();

  // Initialize add to cart button
  initAddToCart();
}

/**
 * Initialize size selector
 */
function initSizeSelector() {
  const sizeOptions = document.querySelectorAll('.size-option');

  sizeOptions.forEach(option => {
    option.addEventListener('click', () => {
      if (option.classList.contains('disabled')) return;

      sizeOptions.forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
    });
  });
}

/**
 * Initialize color selector
 */
function initColorSelector() {
  const colorOptions = document.querySelectorAll('.color-option');

  colorOptions.forEach(option => {
    option.addEventListener('click', () => {
      colorOptions.forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
    });
  });
}

/**
 * Initialize add to cart functionality
 */
function initAddToCart() {
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  const buyNowBtn = document.querySelector('.buy-now-btn');

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const product = getProductData();
      const selectedSize = document.querySelector('.size-option.active');
      const selectedColor = document.querySelector('.color-option.active');
      const quantity = parseInt(document.querySelector('.quantity-input')?.value || 1);

      if (!selectedSize) {
        UI.showToast('Please select a size', 'error');
        return;
      }

      if (!selectedColor) {
        UI.showToast('Please select a color', 'error');
        return;
      }

      Cart.add(
        product,
        selectedSize.textContent.trim(),
        { name: selectedColor.dataset.colorName, hex: selectedColor.style.backgroundColor },
        quantity
      );
    });
  }

  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      const product = getProductData();
      const selectedSize = document.querySelector('.size-option.active');
      const selectedColor = document.querySelector('.color-option.active');
      const quantity = parseInt(document.querySelector('.quantity-input')?.value || 1);

      if (!selectedSize || !selectedColor) {
        UI.showToast('Please select size and color', 'error');
        return;
      }

      Cart.add(
        product,
        selectedSize.textContent.trim(),
        { name: selectedColor.dataset.colorName, hex: selectedColor.style.backgroundColor },
        quantity
      );

      window.location.href = '/checkout.html';
    });
  }
}

/**
 * Get product data from page
 */
function getProductData() {
  const productName = document.querySelector('.product-title')?.textContent;
  const productPrice = parseInt(document.querySelector('.product-price')?.textContent?.replace(/[^\d]/g, '') || 0);
  const productSlug = new URLSearchParams(window.location.search).get('slug');
  const product = ProductService.getBySlug(productSlug);

  return product || {
    id: 0,
    name: productName,
    slug: productSlug,
    price: productPrice,
    images: [document.querySelector('.gallery-main-image')?.src || ''],
    colors: [{ name: 'Default', hex: '#D8C7AD' }],
    sizes: ['S', 'M', 'L']
  };
}

/**
 * Initialize cart page
 */
function initCartPage() {
  Cart.renderCartDrawer();
}

/**
 * Initialize checkout page
 */
function initCheckoutPage() {
  initCheckoutForm();
}

/**
 * Initialize checkout form
 */
function initCheckoutForm() {
  const checkoutForm = document.querySelector('.checkout-form');
  const paymentOptions = document.querySelectorAll('.payment-option');

  if (paymentOptions.length > 0) {
    paymentOptions.forEach(option => {
      option.addEventListener('click', () => {
        paymentOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        // Show/hide payment specific content
        const paymentType = option.dataset.payment;
        document.querySelectorAll('.payment-content').forEach(content => {
          content.classList.toggle('hidden', content.dataset.payment !== paymentType);
        });
      });
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleCheckout();
    });
  }
}

/**
 * Handle checkout submission
 */
async function handleCheckout() {
  const placeOrderBtn = document.querySelector('.place-order-btn');
  if (placeOrderBtn) {
    placeOrderBtn.textContent = 'Processing...';
    placeOrderBtn.disabled = true;
  }

  // Simulate processing
  await new Promise(resolve => setTimeout(resolve, 1500));

  // TODO: When backend is connected:
  // 1. Validate all fields
  // 2. Create order via api.post('/orders', orderData)
  // 3. Process payment based on selected method
  // 4. Redirect to confirmation page

  // For prototype, just show success
  UI.showToast('Order placed successfully!', 'success');

  // Clear cart
  Cart.clear();

  // Redirect to thank you page (for prototype)
  // window.location.href = '/order-confirmation.html';

  if (placeOrderBtn) {
    placeOrderBtn.textContent = 'Place Order';
    placeOrderBtn.disabled = false;
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Initialize page-specific code after main init
document.addEventListener('DOMContentLoaded', initPageSpecific);

// Export for module use
export {
  api,
  API_CONFIG,
  ProductService,
  Cart,
  Wishlist,
  Auth,
  UI,
  waveGenerator,
  Newsletter
};
