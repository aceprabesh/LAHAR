/**
 * LAHAR Admin Panel JavaScript
 */

// API Base URL - Update this to your backend
const API_URL = 'https://your-api-domain.com/api';

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const section = item.dataset.section;

    // Update nav active
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');

    // Update sections
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.getElementById(section)?.classList.add('active');

    // Load data for section
    if (section === 'dashboard') loadDashboard();
    if (section === 'products') loadProducts();
    if (section === 'orders') loadOrders();
  });
});

// Dashboard
async function loadDashboard() {
  try {
    const res = await fetch(`${API_URL}/dashboard/stats`);
    const data = await res.json();

    document.getElementById('totalOrders').textContent = data.orders || 0;
    document.getElementById('totalRevenue').textContent = `NPR ${(data.revenue || 0).toLocaleString()}`;
    document.getElementById('totalProducts').textContent = data.products || 0;
    document.getElementById('totalCustomers').textContent = data.customers || 0;

    // Recent orders
    if (data.recentOrders?.length) {
      const tbody = document.getElementById('recentOrdersTable');
      tbody.innerHTML = data.recentOrders.map(order => `
        <tr>
          <td>${order.order_number}</td>
          <td>${order.customer_name}</td>
          <td>NPR ${order.total.toLocaleString()}</td>
          <td><span class="status ${order.status}">${order.status}</span></td>
          <td>${new Date(order.created_at).toLocaleDateString()}</td>
        </tr>
      `).join('');
    }
  } catch (err) {
    console.log('API not connected yet - showing demo data');
    // Demo data
    document.getElementById('totalOrders').textContent = '12';
    document.getElementById('totalRevenue').textContent = 'NPR 245,000';
    document.getElementById('totalProducts').textContent = '6';
    document.getElementById('totalCustomers').textContent = '8';
  }
}

// Products
async function loadProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();

    if (data.success && data.data.length) {
      const tbody = document.getElementById('productsTable');
      tbody.innerHTML = data.data.map(p => `
        <tr>
          <td><img src="${p.primary_image || '/assets/images/product-1.jpg'}" alt="${p.name}" style="width:50px;height:50px;object-fit:cover;border-radius:4px;"></td>
          <td>${p.name}</td>
          <td>${p.category_name || 'Uncategorized'}</td>
          <td>NPR ${p.price.toLocaleString()}</td>
          <td>${p.stock || 0}</td>
          <td><span class="status ${p.status}">${p.status || 'active'}</span></td>
          <td>
            <button class="btn btn-secondary" onclick="editProduct(${p.id})">Edit</button>
          </td>
        </tr>
      `).join('');
    }
  } catch (err) {
    document.getElementById('productsTable').innerHTML = `
      <tr><td colspan="7" class="empty-state">Connect your backend API to load products</td></tr>
    `;
  }
}

// Orders
async function loadOrders() {
  try {
    const res = await fetch(`${API_URL}/orders`);
    const data = await res.json();

    if (data.success && data.data.length) {
      const tbody = document.getElementById('ordersTable');
      tbody.innerHTML = data.data.map(o => `
        <tr>
          <td>${o.order_number}</td>
          <td>${o.customer_name}<br><small>${o.customer_email}</small></td>
          <td>${o.items?.length || 0} items</td>
          <td>NPR ${o.total.toLocaleString()}</td>
          <td><span class="status ${o.payment_status}">${o.payment_status}</span></td>
          <td><span class="status ${o.status}">${o.status}</span></td>
          <td>${new Date(o.created_at).toLocaleDateString()}</td>
        </tr>
      `).join('');
    }
  } catch (err) {
    document.getElementById('ordersTable').innerHTML = `
      <tr><td colspan="7" class="empty-state">Connect your backend API to load orders</td></tr>
    `;
  }
}

// Product Modal
function showProductModal() {
  document.getElementById('productModal').classList.add('active');
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
}

// Form submission
document.querySelector('.modal-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const product = Object.fromEntries(formData.entries());

  // Convert checkbox values
  product.featured = e.target.querySelector('[name="featured"]').checked;
  product.new_arrival = e.target.querySelector('[name="new_arrival"]').checked;

  try {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });

    if (res.ok) {
      alert('Product saved!');
      closeProductModal();
      loadProducts();
    }
  } catch (err) {
    alert('Product saved (demo mode - connect API for real save)');
    closeProductModal();
  }
});

// Edit product
function editProduct(id) {
  alert(`Edit product ${id} - Connect API for full functionality`);
}

// Initialize
loadDashboard();
