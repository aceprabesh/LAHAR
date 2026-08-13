const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Demo users (replace with database in production)
const users = [
  { id: 1, name: 'Admin', email: 'admin@lahar.com', password: '$2a$10$abcdefghijklmnopqrstuv', role: 'admin' }
];

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Demo mode - accept any login
  req.session.user = { email, name: email.split('@')[0], role: 'admin' };
  res.json({
    success: true,
    data: { id: 1, name: email.split('@')[0], email }
  });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  // Demo mode - just create session
  req.session.user = { name, email, role: 'customer' };
  res.json({
    success: true,
    data: { id: Date.now(), name, email }
  });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: 'Logged out' });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ success: true, data: req.session.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

module.exports = router;
