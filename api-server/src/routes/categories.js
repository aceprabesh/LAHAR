const express = require('express');
const router = express.Router();

const categories = [
  { id: 1, name: 'Kurtha', slug: 'kurtha', product_count: 6 },
  { id: 2, name: 'Dresses', slug: 'dresses', product_count: 0 },
  { id: 3, name: 'Tops', slug: 'tops', product_count: 0 },
  { id: 4, name: 'Bottoms', slug: 'bottoms', product_count: 0 },
  { id: 5, name: 'Sets', slug: 'sets', product_count: 0 },
  { id: 6, name: 'Accessories', slug: 'accessories', product_count: 0 }
];

router.get('/', (req, res) => {
  res.json({ success: true, data: categories });
});

module.exports = router;
