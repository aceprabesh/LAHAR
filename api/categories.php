<?php
/**
 * Categories API
 * GET /api/categories - List all categories
 */

if ($method !== 'GET') {
    error('Method not allowed', 405);
}

$db = getDB();

$stmt = $db->query("SELECT * FROM categories ORDER BY sort_order, name");
$categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get product count for each category
foreach ($categories as &$cat) {
    $stmt = $db->prepare("SELECT COUNT(*) FROM products WHERE category_id = ? AND status = 'active'");
    $stmt->execute([$cat['id']]);
    $cat['product_count'] = $stmt->fetchColumn();
}

json(['success' => true, 'data' => $categories]);
