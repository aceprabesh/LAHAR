<?php
/**
 * Newsletter API
 * POST /api/newsletter - Subscribe email
 * DELETE /api/newsletter - Unsubscribe
 */

if ($method === 'POST') {
    $db = getDB();

    $email = filter_var($body['email'] ?? '', FILTER_VALIDATE_EMAIL);
    if (!$email) {
        error('Invalid email address');
    }

    // Check if exists
    $stmt = $db->prepare("SELECT id FROM subscribers WHERE email = ?");
    $stmt->execute([$email]);
    $existing = $stmt->fetch();

    if ($existing) {
        // Update status to active if was unsubscribed
        $stmt = $db->prepare("UPDATE subscribers SET status = 'active' WHERE email = ?");
        $stmt->execute([$email]);
    } else {
        // Insert new subscriber
        $stmt = $db->prepare("INSERT INTO subscribers (email) VALUES (?)");
        $stmt->execute([$email]);
    }

    json(['success' => true, 'message' => 'Subscribed successfully']);
}

if ($method === 'DELETE') {
    $db = getDB();

    $email = filter_var($body['email'] ?? '', FILTER_VALIDATE_EMAIL);
    if (!$email) {
        error('Invalid email address');
    }

    $stmt = $db->prepare("UPDATE subscribers SET status = 'unsubscribed' WHERE email = ?");
    $stmt->execute([$email]);

    json(['success' => true, 'message' => 'Unsubscribed successfully']);
}

error('Method not allowed', 405);
