# LAHAR E-Commerce Backend Setup

## Quick Start

### 1. Database Setup

Import `api/database.sql` into MySQL:

```bash
mysql -u root -p < api/database.sql
```

Or via phpMyAdmin:
1. Open phpMyAdmin
2. Create database `lahar_db`
3. Import `api/database.sql`

### 2. Configure Database Connection

Edit `api/index.php` and update:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'lahar_db');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
```

### 3. Payment Setup

#### eSewa (Live)
Update `api/payment.php`:
```php
'merchant_id' => 'YOUR_ESEWA_MERCHANT_ID',
'secret_key' => 'YOUR_ESEWA_SECRET_KEY',
```

Get credentials from: https://developer.esewa.com.np

#### Khalti (Live)
Update `api/payment.php`:
```php
'public_key' => 'YOUR_KHALTI_PUBLIC_KEY',
```

Get credentials from: https://dashboard.khalti.com

### 4. Upload to Server

Upload the `api/` folder to your PHP hosting (Apache/Nginx)

**Requirements:**
- PHP 7.4+
- MySQL 5.7+
- mod_rewrite enabled (for clean URLs)
- SSL certificate (required for payment gateways)

## API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/:slug` - Get single product
- Query params: `?category=kurtha&featured=true&new=true&sort=price-asc`

### Categories
- `GET /api/categories` - List all categories

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order by ID or order number

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Payment
- `POST /api/payment/esewa` - Initiate eSewa payment
- `POST /api/payment/khalti` - Initiate Khalti payment
- `POST /api/payment/verify` - Verify payment callback

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart` - Save cart
- `DELETE /api/cart` - Clear cart

### Newsletter
- `POST /api/newsletter` - Subscribe
- `DELETE /api/newsletter` - Unsubscribe

## Frontend Integration

Update `js/config/api.js` with your backend URL:

```javascript
const API_CONFIG = {
  BASE_URL: 'https://your-domain.com/api'
};
```

## Production Checklist

- [ ] Update database credentials
- [ ] Configure eSewa merchant ID and secret
- [ ] Configure Khalti public key
- [ ] Enable HTTPS/SSL
- [ ] Set up email notifications
- [ ] Configure error logging
- [ ] Set up cron for order status updates
- [ ] Enable PHP OPcache for performance

## Support

For API documentation, see: https://docs.lahar.com
