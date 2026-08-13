<?php
/**
 * LAHAR API - Main Entry Point
 * Handles all API requests for LAHAR E-Commerce
 *
 * Base URL: /api/index.php
 *
 * Endpoints:
 * GET  /api/products           - List all products
 * GET  /api/products/:slug     - Get single product
 * POST /api/cart                - Create/update cart
 * POST /api/orders             - Create order
 * GET  /api/orders/:id          - Get order
 * POST /api/auth/login         - Login
 * POST /api/auth/register      - Register
 * POST /api/payment/esewa      - eSewa payment
 * POST /api/payment/khalti     - Khalti payment
 */

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database configuration - UPDATE THESE FOR YOUR SERVER
define('DB_HOST', 'localhost');
define('DB_NAME', 'lahar_db');
define('DB_USER', 'root');
define('DB_PASS', '');

// Get JSON body
$body = json_decode(file_get_contents('php://input'), true);

// Parse request URI
$request = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/api/');
$method = $_SERVER['REQUEST_METHOD'];

// Simple router
$segments = explode('/', $request);
$resource = $segments[0] ?? '';
$id = $segments[1] ?? null;

// Database connection
function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $pdo = new PDO(
                'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
                DB_USER,
                DB_PASS,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database connection failed']);
            exit;
        }
    }
    return $pdo;
}

// Response helpers
function json($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function error($message, $code = 400) {
    json(['error' => $message, 'status' => $code], $code);
}

// Route handling
try {
    switch ($resource) {
        case 'products':
            require_once 'products.php';
            break;

        case 'categories':
            require_once 'categories.php';
            break;

        case 'orders':
            require_once 'orders.php';
            break;

        case 'auth':
            require_once 'auth.php';
            break;

        case 'payment':
            require_once 'payment.php';
            break;

        case 'cart':
            require_once 'cart.php';
            break;

        case 'newsletter':
            require_once 'newsletter.php';
            break;

        case 'health':
            json(['status' => 'ok', 'service' => 'LAHAR API']);
            break;

        default:
            error('Endpoint not found', 404);
    }
} catch (Exception $e) {
    error($e->getMessage(), 500);
}
