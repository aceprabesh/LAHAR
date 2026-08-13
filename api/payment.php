<?php
/**
 * Payment API
 * POST /api/payment/esewa - Initiate eSewa payment
 * POST /api/payment/khalti - Initiate Khalti payment
 * POST /api/payment/verify - Verify payment
 */

if ($method === 'POST' && ($segments[1] ?? '') === 'esewa') {
    // eSewa configuration - UPDATE WITH REAL CREDENTIALS
    $esewaConfig = [
        'merchant_id' => 'YOUR_ESEWA_MERCHANT_ID',
        'secret_key' => 'YOUR_ESEWA_SECRET_KEY',
        'base_url' => 'https://uat.esewa.com.np/epay/main'
    ];

    $db = getDB();

    // Get order
    $stmt = $db->prepare("SELECT * FROM orders WHERE id = ?");
    $stmt->execute([$body['order_id'] ?? 0]);
    $order = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$order) {
        error('Order not found');
    }

    // Build eSewa payment URL
    $params = [
        'amt' => $order['total'],
        'pid' => $order['order_number'],
        'psc' => 0,
        'pdc' => 0,
        'txAmt' => 0,
        'tAmt' => $order['total'],
        'pid' => $order['order_number'],
        'scd' => $esewaConfig['merchant_id'],
        'su' => 'http://yoursite.com/api/payment/verify?order=' . $order['order_number'],
        'fu' => 'http://yoursite.com/checkout?status=failed'
    ];

    $paymentUrl = $esewaConfig['base_url'] . '?' . http_build_query($params);

    json([
        'success' => true,
        'data' => [
            'payment_url' => $paymentUrl,
            'order_number' => $order['order_number']
        ]
    ]);
}

if ($method === 'POST' && ($segments[1] ?? '') === 'khalti') {
    // Khalti configuration - UPDATE WITH REAL CREDENTIALS
    $khaltiConfig = [
        'public_key' => 'YOUR_KHALTI_PUBLIC_KEY',
        'base_url' => 'https://khalti.com/api/v2/payment/initiate/'
    ];

    $db = getDB();

    // Get order
    $stmt = $db->prepare("SELECT * FROM orders WHERE id = ?");
    $stmt->execute([$body['order_id'] ?? 0]);
    $order = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$order) {
        error('Order not found');
    }

    // Build Khalti payment payload
    $payload = [
        'public_key' => $khaltiConfig['public_key'],
        'amount' => $order['total'] * 100, // Khalti uses paisa
        'product_identity' => $order['order_number'],
        'product_name' => 'LAHAR Order ' . $order['order_number'],
        'product_url' => 'https://lahar.com',
        'customer_info' => [
            'name' => $order['customer_name'],
            'email' => $order['customer_email']
        ]
    ];

    json([
        'success' => true,
        'data' => [
            'payment_url' => $khaltiConfig['base_url'],
            'payload' => $payload,
            'order_number' => $order['order_number']
        ]
    ]);
}

if ($method === 'POST' && ($segments[1] ?? '') === 'verify') {
    // Verify payment callback from eSewa/Khalti
    $db = getDB();

    $orderNumber = $_GET['order'] ?? $body['order_number'] ?? '';
    $status = $_GET['status'] ?? $body['status'] ?? '';

    $stmt = $db->prepare("SELECT * FROM orders WHERE order_number = ?");
    $stmt->execute([$orderNumber]);
    $order = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$order) {
        error('Order not found');
    }

    // Update payment status
    $newStatus = ($status === 'complete') ? 'paid' : 'failed';
    $stmt = $db->prepare("UPDATE orders SET payment_status = ? WHERE id = ?");
    $stmt->execute([$newStatus, $order['id']]);

    // If payment successful, update order status
    if ($newStatus === 'paid') {
        $stmt = $db->prepare("UPDATE orders SET status = 'processing' WHERE id = ?");
        $stmt->execute([$order['id']]);
    }

    json([
        'success' => true,
        'data' => [
            'order_number' => $orderNumber,
            'payment_status' => $newStatus
        ]
    ]);
}

error('Method not allowed', 405);
