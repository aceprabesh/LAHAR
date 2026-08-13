const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Demo orders storage
const orders = [];

// POST /api/orders - Create order
router.post('/', (req, res) => {
  const { customer_name, customer_email, customer_phone, payment_method, items, shipping_address } = req.body;

  if (!customer_name || !customer_email || !payment_method || !items) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Calculate totals
  let subtotal = 0;
  items.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  const shipping = subtotal >= 5000 ? 0 : 200;
  const total = subtotal + shipping;

  // Generate order number
  const orderNumber = 'LAH-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();

  const order = {
    id: orders.length + 1,
    order_number: orderNumber,
    customer_name,
    customer_email,
    customer_phone,
    payment_method,
    items,
    subtotal,
    shipping,
    total,
    status: 'pending',
    payment_status: 'pending',
    shipping_address,
    created_at: new Date().toISOString()
  };

  orders.push(order);

  res.json({
    success: true,
    data: {
      order_id: order.id,
      order_number: order.order_number,
      total: order.total
    }
  });
});

// GET /api/orders/:id - Get order
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id == req.params.id || o.order_number === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ success: true, data: order });
});

module.exports = router;
