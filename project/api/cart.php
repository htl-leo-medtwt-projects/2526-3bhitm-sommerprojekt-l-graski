<?php
require_once __DIR__ . '/api_helpers.php';
require_once __DIR__ . '/database.php';

$action = $_GET['action'] ?? '';
$conn = db();

function fetchCart(mysqli $conn, int $userId): array
{
    $sql = 'SELECT ci.id, ci.product_id, ci.configuration_id, ci.unit_price, ci.configuration_snapshot, ci.quantity,
            p.name AS product_name, p.base_price, p.image_url, c.slug AS category_slug,
            oj.name AS jewel_name, ot.name AS type_name, om.name AS material_name, os.label AS size_label, osh.name AS shape_name
            FROM cart_items ci
            JOIN products p ON p.id = ci.product_id
            JOIN categories c ON c.id = p.category_id
            LEFT JOIN configurations cfg ON cfg.id = ci.configuration_id
            LEFT JOIN option_types ot ON ot.id = cfg.type_id
            LEFT JOIN option_materials om ON om.id = cfg.material_id
            LEFT JOIN option_sizes os ON os.id = cfg.size_id
            LEFT JOIN option_shapes osh ON osh.id = cfg.shape_id
            LEFT JOIN option_jewels oj ON oj.id = cfg.jewel_id
            WHERE ci.user_id = ?
            ORDER BY ci.id DESC';

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    $items = [];
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
            'configuration_id' => $row['configuration_id'] !== null ? (int) $row['configuration_id'] : null,
            'unit_price' => $row['unit_price'] !== null ? (float) $row['unit_price'] : null,
            'quantity' => (int) $row['quantity'],
            'product_name' => $row['product_name'],
            'category_slug' => $row['category_slug'],
            'base_price' => (float) $row['base_price'],
            'image_url' => $row['image_url'],
            'type_name' => $row['type_name'],
            'material_name' => $row['material_name'],
            'size_label' => $row['size_label'],
            'shape_name' => $row['shape_name'],
            'jewel_name' => $row['jewel_name'],
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
    return $items;
}

switch ($action) {
    case 'add': {
            $userId = requireAuth();
            $data = getJsonInput();

            $productId = (int) ($data['product_id'] ?? 0);
            if ($productId <= 0) {
                jsonResponse(['error' => 'Produkt fehlt'], 400);
            }

            $configurationId = $data['configuration_id'] !== null ? (int) $data['configuration_id'] : null;
            $quantity = (int) ($data['quantity'] ?? 1);
            $quantity = max(1, $quantity);

            $unitPrice = $data['unit_price'] !== null ? (float) $data['unit_price'] : null;
            if ($unitPrice === null) {
                $stmt = $conn->prepare('SELECT base_price FROM products WHERE id = ? LIMIT 1');
                $stmt->bind_param('i', $productId);
                $stmt->execute();
                $result = $stmt->get_result();
                $row = $result->fetch_assoc();
                $stmt->close();
                $unitPrice = $row ? (float) $row['base_price'] : 0.0;
            }

            $snapshot = $data['configuration_snapshot'] ?? null;
            $snapshotJson = $snapshot !== null ? json_encode($snapshot, JSON_UNESCAPED_UNICODE) : null;

            $stmt = $conn->prepare('INSERT INTO cart_items (user_id, product_id, configuration_id, unit_price, configuration_snapshot, quantity) VALUES (?, ?, ?, ?, ?, ?)');
            $stmt->bind_param('iiidsi', $userId, $productId, $configurationId, $unitPrice, $snapshotJson, $quantity);
            if (!$stmt->execute()) {
                $stmt->close();
                jsonResponse(['error' => 'Warenkorb speichern fehlgeschlagen.'], 500);
            }
            $stmt->close();

            $items = fetchCart($conn, $userId);
            jsonResponse(['cart' => $items]);
        }

    case 'list': {
            $userId = requireAuth();
            $items = fetchCart($conn, $userId);
            jsonResponse(['cart' => $items]);
        }

    case 'update': {
            $userId = requireAuth();
            $data = getJsonInput();
            $id = (int) ($data['id'] ?? 0);
            $quantity = (int) ($data['quantity'] ?? 1);
            $quantity = max(1, $quantity);

            if ($id <= 0) {
                jsonResponse(['error' => 'ID fehlt'], 400);
            }

            $stmt = $conn->prepare('UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?');
            $stmt->bind_param('iii', $quantity, $id, $userId);
            if (!$stmt->execute()) {
                $stmt->close();
                jsonResponse(['error' => 'Menge aktualisieren fehlgeschlagen.'], 500);
            }
            $stmt->close();

            $items = fetchCart($conn, $userId);
            jsonResponse(['cart' => $items]);
        }

    case 'remove': {
            $userId = requireAuth();
            $data = getJsonInput();
            $id = (int) ($data['id'] ?? 0);
            if ($id <= 0) {
                jsonResponse(['error' => 'ID fehlt'], 400);
            }

            $stmt = $conn->prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?');
            $stmt->bind_param('ii', $id, $userId);
            if (!$stmt->execute()) {
                $stmt->close();
                jsonResponse(['error' => 'Warenkorb-Eintrag löschen fehlgeschlagen.'], 500);
            }
            $stmt->close();

            $items = fetchCart($conn, $userId);
            jsonResponse(['cart' => $items]);
        }

    case 'count': {
            $userId = requireAuth();
            $stmt = $conn->prepare('SELECT COALESCE(SUM(quantity), 0) AS total FROM cart_items WHERE user_id = ?');
            $stmt->bind_param('i', $userId);
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            $stmt->close();
            jsonResponse(['count' => (int) ($row['total'] ?? 0)]);
        }

    default:
        jsonResponse(['error' => 'Unbekannte Aktion'], 400);
}
