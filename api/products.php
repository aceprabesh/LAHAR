<?php
/**
 * Products API
 * GET /api/products - List all products
 * GET /api/products/:slug - Get single product
 */

$db = getDB();

if ($method === 'GET') {
    // Check if requesting single product by slug
    $slug = $segments[1] ?? null;

    if ($slug) {
        // Get single product
        $stmt = $db->prepare("
            SELECT p.*, c.name as category_name, c.slug as category_slug
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.slug = ? AND p.status = 'active'
        ");
        $stmt->execute([$slug]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$product) {
            error('Product not found', 404);
        }

        // Get product images
        $stmt = $db->prepare("SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order");
        $stmt->execute([$product['id']]);
        $product['images'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get colors
        $stmt = $db->prepare("SELECT * FROM product_colors WHERE product_id = ?");
        $stmt->execute([$product['id']]);
        $product['colors'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get sizes with stock
        $stmt = $db->prepare("SELECT * FROM product_sizes WHERE product_id = ?");
        $stmt->execute([$product['id']]);
        $product['sizes'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        json(['success' => true, 'data' => $product]);
    }

    // Get all products with filters
    $category = $_GET['category'] ?? null;
    $featured = isset($_GET['featured']) ? (bool)$_GET['featured'] : null;
    $newArrival = isset($_GET['new']) ? (bool)$_GET['new'] : null;

    $sql = "
        SELECT p.*, c.name as category_name, c.slug as category_slug,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active'
    ";
    $params = [];

    if ($category) {
        $sql .= " AND c.slug = ?";
        $params[] = $category;
    }

    if ($featured !== null) {
        $sql .= " AND p.featured = ?";
        $params[] = $featured ? 1 : 0;
    }

    if ($newArrival !== null) {
        $sql .= " AND p.new_arrival = ?";
        $params[] = $newArrival ? 1 : 0;
    }

    // Sorting
    $sort = $_GET['sort'] ?? 'featured';
    switch ($sort) {
        case 'price-asc': $sql .= " ORDER BY p.price ASC"; break;
        case 'price-desc': $sql .= " ORDER BY p.price DESC"; break;
        case 'newest': $sql .= " ORDER BY p.created_at DESC"; break;
        default: $sql .= " ORDER BY p.featured DESC, p.created_at DESC";
    }

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get colors for each product
    foreach ($products as &$product) {
        $stmt = $db->prepare("SELECT name, hex_code FROM product_colors WHERE product_id = ?");
        $stmt->execute([$product['id']]);
        $product['colors'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    json(['success' => true, 'data' => $products, 'count' => count($products)]);
}

error('Method not allowed', 405);
