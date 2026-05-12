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

            $orderId = (int) $conn->insert_id;
            
            //=====KI=====
            $stmt = $conn->prepare('SELECT ci.product_id, ci.configuration_snapshot, ci.quantity, ci.unit_price, p.name AS product_name
                FROM cart_items ci
                JOIN products p ON p.id = ci.product_id
                WHERE ci.user_id = ?');
            $stmt->bind_param('i', $userId);
            $stmt->execute();
            $result = $stmt->get_result();
            $items = [];
            while ($row = $result->fetch_assoc()) {
                $items[] = $row;
            }
            $stmt->close();

            if (!empty($items)) {
                $stmt = $conn->prepare('INSERT INTO order_items (order_id, product_id, product_name, configuration_snapshot, quantity, unit_price) VALUES (?, ?, ?, ?, ?, ?)');
                foreach ($items as $item) {
                    $productId = (int) $item['product_id'];
                    $productName = $item['product_name'];
                    $quantity = (int) $item['quantity'];
                    $unitPrice = (float) $item['unit_price'];
                    $snapshot = $item['configuration_snapshot'];
                    $stmt->bind_param('iissid', $orderId, $productId, $productName, $snapshot, $quantity, $unitPrice);
                    if (!$stmt->execute()) {
                        $stmt->close();
                        jsonResponse(['error' => 'Bestellpositionen konnten nicht gespeichert werden.'], 500);
                    }
                }
                $stmt->close();
            }
            //============

            $stmt = $conn->prepare('DELETE FROM cart_items WHERE user_id = ?');
            $stmt->bind_param('i', $userId);
            $stmt->execute();
            $stmt->close();

            jsonResponse(['order' => ['order_number' => $orderNumber, 'total_price' => $total]]);
        }

    case 'list': {
            $userId = requireAuth();
            $stmt = $conn->prepare('SELECT o.id, o.order_number, o.total_price, o.status, o.created_at,
                COALESCE(SUM(oi.quantity), 0) AS items_count
                FROM orders o
                LEFT JOIN order_items oi ON oi.order_id = o.id
                WHERE o.user_id = ?
                GROUP BY o.id, o.order_number, o.total_price, o.status, o.created_at
                ORDER BY o.created_at DESC');
            $stmt->bind_param('i', $userId);
            $stmt->execute();
            $result = $stmt->get_result();

            $orders = [];
            while ($row = $result->fetch_assoc()) {
                $row['id'] = (int) $row['id'];
                $row['total_price'] = (float) $row['total_price'];
                $row['items_count'] = (int) $row['items_count'];
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

            $items = [];
            if ($order) {
                $stmt = $conn->prepare('SELECT oi.id, oi.product_id, oi.product_name, oi.configuration_snapshot, oi.quantity, oi.unit_price, p.image_url
                    FROM order_items oi
                    LEFT JOIN products p ON p.id = oi.product_id
                    WHERE oi.order_id = ?
                    ORDER BY oi.id ASC');
                $stmt->bind_param('i', $id);
                $stmt->execute();
                $result = $stmt->get_result();
                while ($row = $result->fetch_assoc()) {
                    $snapshot = null;
                    if (!empty($row['configuration_snapshot'])) {
                        $decoded = json_decode($row['configuration_snapshot'], true);
                        if (is_array($decoded)) {
                            $snapshot = $decoded;
                        }
                    }

                    $item = [
                        'id' => (int) $row['id'],
                        'product_id' => (int) $row['product_id'],
                        'product_name' => $row['product_name'],
                        'quantity' => (int) $row['quantity'],
                        'unit_price' => (float) $row['unit_price'],
                        'image_url' => $row['image_url'],
                        'configuration_snapshot' => $snapshot
                    ];

                    if ($snapshot) {
                        foreach ($snapshot as $key => $value) {
                            $item[$key] = $value;
                        }
                    }

                    $items[] = $item;
                }
                $stmt->close();
            }

            jsonResponse(['order' => $order, 'items' => $items]);
        }

    default:
        jsonResponse(['error' => 'Unbekannte Aktion'], 400);
}
