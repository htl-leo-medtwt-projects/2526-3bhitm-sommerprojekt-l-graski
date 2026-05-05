<?php
require_once __DIR__ . '/api_helpers.php';
require_once __DIR__ . '/database.php';

$action = $_GET['action'] ?? '';
$conn = db();

function createOrderNumber(): string
{
    return 'ORN-' . strtoupper(bin2hex(random_bytes(3)));
}

switch ($action) {
    case 'create': {
            $userId = requireAuth();
            $data = getJsonInput();

            $stmt = $conn->prepare('SELECT COALESCE(SUM(unit_price * quantity), 0) AS total FROM cart_items WHERE user_id = ?');
            $stmt->bind_param('i', $userId);
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            $stmt->close();

            $total = (float) ($row['total'] ?? 0);
            if ($total <= 0) {
                jsonResponse(['error' => 'Warenkorb ist leer.'], 400);
            }

            $orderNumber = createOrderNumber();
            $shippingStreet = trim($data['shipping_street'] ?? '');
            $shippingZip = trim($data['shipping_zip'] ?? '');
            $shippingCity = trim($data['shipping_city'] ?? '');
            $shippingCountry = trim($data['shipping_country'] ?? 'Österreich');
            $paymentMethod = trim($data['payment_method'] ?? '');
            $notes = trim($data['notes'] ?? '');

            $stmt = $conn->prepare('INSERT INTO orders (user_id, order_number, total_price, shipping_street, shipping_zip, shipping_city, shipping_country, payment_method, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
            $stmt->bind_param('isdssssss', $userId, $orderNumber, $total, $shippingStreet, $shippingZip, $shippingCity, $shippingCountry, $paymentMethod, $notes);
            if (!$stmt->execute()) {
                $stmt->close();
                jsonResponse(['error' => 'Bestellung konnte nicht gespeichert werden.'], 500);
            }
            $stmt->close();

            $stmt = $conn->prepare('DELETE FROM cart_items WHERE user_id = ?');
            $stmt->bind_param('i', $userId);
            $stmt->execute();
            $stmt->close();

            jsonResponse(['order' => ['order_number' => $orderNumber, 'total_price' => $total]]);
        }

    case 'list': {
            $userId = requireAuth();
            $stmt = $conn->prepare('SELECT id, order_number, total_price, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC');
            $stmt->bind_param('i', $userId);
            $stmt->execute();
            $result = $stmt->get_result();

            $orders = [];
            while ($row = $result->fetch_assoc()) {
                $row['id'] = (int) $row['id'];
                $row['total_price'] = (float) $row['total_price'];
                $orders[] = $row;
            }

            $stmt->close();
            jsonResponse(['orders' => $orders]);
        }

    case 'detail': {
            $userId = requireAuth();
            $id = (int) ($_GET['id'] ?? 0);
            if ($id <= 0) {
                jsonResponse(['error' => 'ID fehlt'], 400);
            }

            $stmt = $conn->prepare('SELECT id, order_number, total_price, status, created_at, shipping_street, shipping_zip, shipping_city, shipping_country, payment_method, notes FROM orders WHERE id = ? AND user_id = ? LIMIT 1');
            $stmt->bind_param('ii', $id, $userId);
            $stmt->execute();
            $result = $stmt->get_result();
            $order = $result->fetch_assoc();
            $stmt->close();

            if ($order) {
                $order['id'] = (int) $order['id'];
                $order['total_price'] = (float) $order['total_price'];
            }

            jsonResponse(['order' => $order]);
        }

    default:
        jsonResponse(['error' => 'Unbekannte Aktion'], 400);
}
