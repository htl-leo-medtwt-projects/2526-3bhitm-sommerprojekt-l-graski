<?php
require_once __DIR__ . '/api_helpers.php';

function db(): mysqli
{
    static $conn = null;
    if ($conn instanceof mysqli) {
        return $conn;
    }

    $conn = new mysqli('db_server', 'root', 'rootpassword', 'oreon');
    if ($conn->connect_error) {
        jsonResponse(['error' => 'DB-Verbindung fehlgeschlagen'], 500);
    }

    $conn->set_charset('utf8mb4');
    return $conn;
}
