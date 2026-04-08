<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function jsonResponse($data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

function getJsonInput(): array
{
    $input = file_get_contents('php://input');
    $data = json_decode($input ?: '', true);
    return is_array($data) ? $data : [];
}

function ensureSessionStarted(): void
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
}

function requireAuth(): int
{
    ensureSessionStarted();
    if (!isset($_SESSION['user_id'])) {
        jsonResponse(['error' => 'Nicht angemeldet'], 401);
    }
    return (int) $_SESSION['user_id'];
}
