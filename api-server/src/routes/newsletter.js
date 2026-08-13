const express = require('express');
const router = express.Router();

// Subscribers (demo)
const subscribers = [];

// POST /api/newsletter - Subscribe
router.post('/', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }
  subscribers.push({ email, status: 'active', created_at: new Date().toISOString() });
  res.json({ success: true, message: 'Subscribed' });
});

// DELETE /api/newsletter - Unsubscribe
router.delete('/', (req, res) => {
  const { email } = req.body;
  const idx = subscribers.findIndex(s => s.email === email);
  if (idx > -1) {
    subscribers.splice(idx, 1);
  }
  res.json({ success: true, message: 'Unsubscribed' });
});

module.exports = router;
