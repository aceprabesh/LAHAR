<?php
/**
 * Orders API
 * POST /api/orders - Create order
 * GET /api/orders/:id - Get order
 */

if ($method === 'POST') {
    $db = getDB();

    // Validate required fields
    $required = ['customer_name', 'customer_email', 'customer_phone', 'payment_method', 'items', 'shipping_address'];
    foreach ($required as $field) {
        if (empty($body[$field])) {
            error("Missing required field: $field");
        }
    }

    // Calculate totals
    $items = $body['items'];
    $subtotal = 0;
    foreach ($items as $item) {
        $subtotal += $item['price'] * $item['quantity'];
    }
    $shipping = $subtotal >= 5000 ? 0 : 200; // Free shipping over NPR 5000
    $total = $subtotal + $shipping;

    // Generate order number
    $orderNumber = 'LAH-' . date('Y') . '-' . str_pad(mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);

    // Begin transaction
    $db->beginTransaction();

    try {
        // Insert order
        $stmt = $db->prepare("
            INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, subtotal, shipping, total,
                           payment_method, shipping_address, status, payment_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')
        ");
        $stmt->execute([
            $orderNumber,
            $body['customer_name'],
            $body['customer_email'],
            $body['customer_phone'],
            $subtotal,
            $shipping,
            $total,
            $body['payment_method'],
            is_array($body['shipping_address']) ? json_encode($body['shipping_address']) : $body['shipping_address']
        ]);

        $orderId = $db->lastInsertId();

        // Insert order items
        $stmt = $db->prepare("
            INSERT INTO order_items (order_id, product_id, product_name, variant_info, quantity, unit_price, total_price)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");

        foreach ($items as $item) {
            $stmt->execute([
                $orderId,
                $item['product_id'] ?? null,
                $item['name'],
                $item['variant'] ?? '',
                $item['quantity'],
                $item['price'],
                $item['price'] * $item['quantity']
            ]);

            // Update stock
            if (!empty($item['product_id'])) {
                $updateStock = $db->prepare("UPDATE product_sizes SET stock = stock - ? WHERE id = ?");
                $updateStock->execute([$item['quantity'], $item['size_id'] ?? null]);
            }
        }

        $db->commit();

        json([
            'success' => true,
            'data' => [
                'order_id' => $orderId,
                'order_number' => $orderNumber,
                'total' => $total,
                'payment_method' => $body['payment_method']
            ]
        ]);

    } catch (Exception $e) {
        $db->rollBack();
        error('Failed to create order: ' . $e->getMessage());
    }
}

if ($method === 'GET' && !empty($segments[1])) {
    $db = getDB();

    $stmt = $db->prepare("SELECT * FROM orders WHERE id = ? OR order_number = ?");
    $stmt->execute([$segments[1], $segments[1]]);
    $order = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$order) {
        error('Order not found', 404);
    }

    // Get order items
    $stmt = $db->prepare("SELECT * FROM order_items WHERE order_id = ?");
    $stmt->execute([$order['id']]);
    $order['items'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    json(['success' => true, 'data' => $order]);
}

error('Method not allowed', 405);
