<?php
/**
 * Cart API
 * GET /api/cart - Get cart
 * POST /api/cart - Save cart (for logged-in users)
 * DELETE /api/cart - Clear cart
 */

session_start();

if ($method === 'GET') {
    // Return current cart from session
    $cart = $_SESSION['cart'] ?? [];

    // Calculate totals
    $subtotal = 0;
    foreach ($cart as $item) {
        $subtotal += $item['price'] * $item['quantity'];
    }

    json([
        'success' => true,
        'data' => [
            'items' => $cart,
            'count' => count($cart),
            'subtotal' => $subtotal
        ]
    ]);
}

if ($method === 'POST') {
    // Save cart to session (for logged-in users)
    $cart = $body['items'] ?? [];
    $_SESSION['cart'] = $cart;

    // If logged in, also save to database
    if (!empty($_SESSION['customer_id'])) {
        $db = getDB();

        // Clear existing cart
        $stmt = $db->prepare("DELETE FROM cart_items WHERE customer_id = ?");
        $stmt->execute([$_SESSION['customer_id']]);

        // Insert new items
        $stmt = $db->prepare("
            INSERT INTO cart_items (customer_id, product_id, variant_info, quantity)
            VALUES (?, ?, ?, ?)
        ");

        foreach ($cart as $item) {
            $stmt->execute([
                $_SESSION['customer_id'],
                $item['product_id'],
                $item['variant'] ?? '',
                $item['quantity']
            ]);
        }
    }

    json(['success' => true, 'message' => 'Cart saved']);
}

if ($method === 'DELETE') {
    // Clear cart
    $_SESSION['cart'] = [];

    // If logged in, clear from database
    if (!empty($_SESSION['customer_id'])) {
        $db = getDB();
        $stmt = $db->prepare("DELETE FROM cart_items WHERE customer_id = ?");
        $stmt->execute([$_SESSION['customer_id']]);
    }

    json(['success' => true, 'message' => 'Cart cleared']);
}

error('Method not allowed', 405);
