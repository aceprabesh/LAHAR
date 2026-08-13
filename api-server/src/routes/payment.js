const express = require('express');
const router = express.Router();

// POST /api/payment/esewa
router.post('/esewa', (req, res) => {
  const { order_id, amount } = req.body;
  // Demo response
  res.json({
    success: true,
    data: {
      payment_url: 'https://uat.esewa.com.np/epay/main',
      order_number: 'LAH-' + Date.now()
    }
  });
});

// POST /api/payment/khalti
router.post('/khalti', (req, res) => {
  const { order_id, amount } = req.body;
  // Demo response
  res.json({
    success: true,
    data: {
      payment_url: 'https://khalti.com/pay',
      token: 'demo_token_' + Date.now()
    }
  });
});

// POST /api/payment/verify
router.post('/verify', (req, res) => {
  res.json({ success: true, data: { status: 'verified' } });
});

module.exports = router;
