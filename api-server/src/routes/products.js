const express = require('express');
const router = express.Router();

// Demo products data
const products = [
  {
    id: 1,
    name: 'AABHA KURTHA',
    slug: 'aabha-kurtha',
    price: 14500,
    category: 'kurtha',
    category_name: 'Kurtha',
    images: ['/assets/images/products/3f38a848f1e62ee785a55ad35d2e88e6.jpg'],
    colors: [{ name: 'Sand', hex: '#D8C7AD' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 10,
    featured: true,
    new_arrival: true,
    status: 'active'
  },
  {
    id: 2,
    name: 'JUNELI KURTHA',
    slug: 'juneli-kurtha',
    price: 18900,
    category: 'kurtha',
    category_name: 'Kurtha',
    images: ['/assets/images/products/645a90d1567d6312acb70281133a5466.jpg'],
    colors: [{ name: 'Terracotta', hex: '#A65D45' }],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 8,
    featured: true,
    new_arrival: true,
    status: 'active'
  },
  {
    id: 3,
    name: 'LAHAR KURTHA',
    slug: 'lahar-kurtha',
    price: 7500,
    category: 'kurtha',
    category_name: 'Kurtha',
    images: ['/assets/images/products/85438a6504903e627f5421cd395e4eee.jpg'],
    colors: [{ name: 'Charcoal', hex: '#1C1C1A' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 15,
    featured: true,
    new_arrival: true,
    status: 'active'
  },
  {
    id: 4,
    name: 'RITU KURTHA',
    slug: 'ritu-kurtha',
    price: 9800,
    category: 'kurtha',
    category_name: 'Kurtha',
    images: ['/assets/images/products/7fb7dd8f8fb89955fb3095e49f97808a.jpg'],
    colors: [{ name: 'Sage', hex: '#7B8068' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 12,
    featured: true,
    new_arrival: true,
    status: 'active'
  },
  {
    id: 5,
    name: 'SIRA KURTHA',
    slug: 'sira-kurtha',
    price: 12500,
    category: 'kurtha',
    category_name: 'Kurtha',
    images: ['/assets/images/products/df1638734489d337f34d15df02b2262e.jpg'],
    colors: [{ name: 'Ivory', hex: '#F5F0E8' }],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 9,
    featured: true,
    new_arrival: true,
    status: 'active'
  },
  {
    id: 6,
    name: 'NAMUNA KURTHA',
    slug: 'namuna-kurtha',
    price: 15500,
    category: 'kurtha',
    category_name: 'Kurtha',
    images: ['/assets/images/products/f346d98c4755de715775d330f93edbec.jpg'],
    colors: [{ name: 'Sand', hex: '#D8C7AD' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 7,
    featured: true,
    new_arrival: true,
    status: 'active'
  }
];

// GET /api/products - List all products
router.get('/', (req, res) => {
  let result = [...products];

  // Filter by category
  if (req.query.category) {
    result = result.filter(p => p.category === req.query.category);
  }

  // Filter by featured
  if (req.query.featured === 'true') {
    result = result.filter(p => p.featured);
  }

  // Filter by new arrival
  if (req.query.new === 'true') {
    result = result.filter(p => p.new_arrival);
  }

  // Sort
  if (req.query.sort === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (req.query.sort === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  }

  res.json({ success: true, data: result, count: result.length });
});

// GET /api/products/:slug - Get single product
router.get('/:slug', (req, res) => {
  const product = products.find(p => p.slug === req.params.slug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

module.exports = router;
