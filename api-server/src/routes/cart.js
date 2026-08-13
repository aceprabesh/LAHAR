const express = require('express');
const router = express.Router();

// GET /api/cart
router.get('/', (req, res) => {
  const cart = req.session.cart || [];
  res.json({ success: true, data: { items: cart, count: cart.length, subtotal: 0 } });
});

// POST /api/cart - Save cart
router.post('/', (req, res) => {
  req.session.cart = req.body.items || [];
  res.json({ success: true, message: 'Cart saved' });
});

// DELETE /api/cart - Clear cart
router.delete('/', (req, res) => {
  req.session.cart = [];
  res.json({ success: true, message: 'Cart cleared' });
});

module.exports = router;
