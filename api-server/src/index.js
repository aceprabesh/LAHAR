/**
 * LAHAR API Server
 * Express.js backend for LAHAR E-Commerce
 */

const express = require('express');
const cors = require('cors');
const session = require('express-session');

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');
const paymentRouter = require('./routes/payment');
const cartRouter = require('./routes/cart');
const newsletterRouter = require('./routes/newsletter');
const categoriesRouter = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'lahar-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/cart', cartRouter);
app.use('/api/newsletter', newsletterRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'LAHAR API' });
});

// Demo data endpoints (work without database)
app.get('/api/demo/stats', (req, res) => {
  res.json({
    orders: 24,
    revenue: 348000,
    products: 6,
    customers: 18,
    recentOrders: []
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(__dirname + '/../../'));
}

app.listen(PORT, () => {
  console.log(`LAHAR API running on port ${PORT}`);
});

module.exports = app;
