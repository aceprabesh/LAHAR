<?php
/**
 * Auth API
 * POST /api/auth/register - Register
 * POST /api/auth/login - Login
 * POST /api/auth/logout - Logout
 * GET /api/auth/me - Get current user
 */

session_start();

if ($method === 'POST' && ($segments[1] ?? '') === 'register') {
    $db = getDB();

    // Validate
    if (empty($body['name']) || empty($body['email']) || empty($body['password'])) {
        error('Name, email and password are required');
    }

    // Check if email exists
    $stmt = $db->prepare("SELECT id FROM customers WHERE email = ?");
    $stmt->execute([$body['email']]);
    if ($stmt->fetch()) {
        error('Email already registered');
    }

    // Create user
    $passwordHash = password_hash($body['password'], PASSWORD_DEFAULT);
    $stmt = $db->prepare("
        INSERT INTO customers (name, email, password) VALUES (?, ?, ?)
    ");
    $stmt->execute([$body['name'], $body['email'], $passwordHash]);

    $customerId = $db->lastInsertId();

    // Set session
    $_SESSION['customer_id'] = $customerId;
    $_SESSION['customer_email'] = $body['email'];
    $_SESSION['customer_name'] = $body['name'];

    json([
        'success' => true,
        'data' => [
            'id' => $customerId,
            'name' => $body['name'],
            'email' => $body['email']
        ]
    ]);
}

if ($method === 'POST' && ($segments[1] ?? '') === 'login') {
    $db = getDB();

    if (empty($body['email']) || empty($body['password'])) {
        error('Email and password are required');
    }

    $stmt = $db->prepare("SELECT * FROM customers WHERE email = ?");
    $stmt->execute([$body['email']]);
    $customer = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$customer || !password_verify($body['password'], $customer['password'])) {
        error('Invalid email or password', 401);
    }

    // Set session
    $_SESSION['customer_id'] = $customer['id'];
    $_SESSION['customer_email'] = $customer['email'];
    $_SESSION['customer_name'] = $customer['name'];

    json([
        'success' => true,
        'data' => [
            'id' => $customer['id'],
            'name' => $customer['name'],
            'email' => $customer['email']
        ]
    ]);
}

if ($method === 'POST' && ($segments[1] ?? '') === 'logout') {
    session_destroy();
    json(['success' => true, 'message' => 'Logged out successfully']);
}

if ($method === 'GET' && ($segments[1] ?? '') === 'me') {
    session_start();

    if (empty($_SESSION['customer_id'])) {
        error('Not authenticated', 401);
    }

    json([
        'success' => true,
        'data' => [
            'id' => $_SESSION['customer_id'],
            'name' => $_SESSION['customer_name'],
            'email' => $_SESSION['customer_email']
        ]
    ]);
}

error('Method not allowed', 405);
