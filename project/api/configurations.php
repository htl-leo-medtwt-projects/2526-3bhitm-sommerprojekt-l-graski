<?php
require_once __DIR__ . '/api_helpers.php';
require_once __DIR__ . '/database.php';

$action = $_GET['action'] ?? '';
$conn = db();

function fetchConfigurations(mysqli $conn, int $userId, ?int $id = null): array
{
    $sql = 'SELECT cfg.id, cfg.user_id, cfg.product_id, cfg.name, cfg.type_id, cfg.material_id, cfg.size_id, cfg.shape_id, cfg.engraving_id, cfg.engraving_text, cfg.total_price, cfg.created_at,
            p.name AS product_name, p.base_price, c.slug AS category_slug,
            ot.name AS type_name, om.name AS material_name, os.label AS size_label, osh.name AS shape_name, oe.name AS engraving_name
            FROM configurations cfg
            JOIN products p ON p.id = cfg.product_id
            JOIN categories c ON c.id = p.category_id
            LEFT JOIN option_types ot ON ot.id = cfg.type_id
            LEFT JOIN option_materials om ON om.id = cfg.material_id
            LEFT JOIN option_sizes os ON os.id = cfg.size_id
            LEFT JOIN option_shapes osh ON osh.id = cfg.shape_id
            LEFT JOIN option_engravings oe ON oe.id = cfg.engraving_id
            WHERE cfg.user_id = ?';

    $params = [$userId];
    $types = 'i';

    if ($id !== null) {
        $sql .= ' AND cfg.id = ?';
        $params[] = $id;
        $types .= 'i';
    }

    $sql .= ' ORDER BY cfg.created_at DESC';

    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();

    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $row['id'] = (int) $row['id'];
        $row['product_id'] = (int) $row['product_id'];
        $row['type_id'] = $row['type_id'] !== null ? (int) $row['type_id'] : null;
        $row['material_id'] = $row['material_id'] !== null ? (int) $row['material_id'] : null;
        $row['size_id'] = $row['size_id'] !== null ? (int) $row['size_id'] : null;
        $row['shape_id'] = $row['shape_id'] !== null ? (int) $row['shape_id'] : null;
        $row['engraving_id'] = $row['engraving_id'] !== null ? (int) $row['engraving_id'] : null;
        $row['total_price'] = $row['total_price'] !== null ? (float) $row['total_price'] : null;
        $rows[] = $row;
    }

    $stmt->close();
    return $rows;
}

switch ($action) {
    case 'save': {
            $userId = requireAuth();
            $data = getJsonInput();

            $productId = (int) ($data['product_id'] ?? 0);
            if ($productId <= 0) {
                jsonResponse(['error' => 'Produkt fehlt'], 400);
            }

            $name = trim($data['name'] ?? 'Meine Konfiguration');
            $typeId = $data['type_id'] !== null ? (int) $data['type_id'] : null;
            $materialId = $data['material_id'] !== null ? (int) $data['material_id'] : null;
            $sizeId = $data['size_id'] !== null ? (int) $data['size_id'] : null;
            $shapeId = $data['shape_id'] !== null ? (int) $data['shape_id'] : null;
            $engravingId = $data['engraving_id'] !== null ? (int) $data['engraving_id'] : null;
            $engravingText = trim($data['engraving_text'] ?? '');
            $totalPrice = $data['total_price'] !== null ? (float) $data['total_price'] : null;

            $stmt = $conn->prepare('INSERT INTO configurations (user_id, product_id, name, type_id, material_id, size_id, shape_id, engraving_id, engraving_text, total_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            $stmt->bind_param('iisiiiiisd', $userId, $productId, $name, $typeId, $materialId, $sizeId, $shapeId, $engravingId, $engravingText, $totalPrice);

            if (!$stmt->execute()) {
                $stmt->close();
                jsonResponse(['error' => 'Konfiguration speichern fehlgeschlagen.'], 500);
            }

            $configId = $conn->insert_id;
            $stmt->close();

            $rows = fetchConfigurations($conn, $userId, (int) $configId);
            jsonResponse(['configuration' => $rows[0] ?? null]);
        }

    case 'list': {
            $userId = requireAuth();
            $configs = fetchConfigurations($conn, $userId);
            jsonResponse(['configurations' => $configs]);
        }

    case 'detail': {
            $userId = requireAuth();
            $id = (int) ($_GET['id'] ?? 0);
            if ($id <= 0) {
                jsonResponse(['error' => 'ID fehlt'], 400);
            }
            $configs = fetchConfigurations($conn, $userId, $id);
            jsonResponse(['configuration' => $configs[0] ?? null]);
        }

    case 'delete': {
            $userId = requireAuth();
            $data = getJsonInput();
            $id = (int) ($data['id'] ?? 0);
            if ($id <= 0) {
                jsonResponse(['error' => 'ID fehlt'], 400);
            }

            $stmt = $conn->prepare('DELETE FROM configurations WHERE id = ? AND user_id = ?');
            $stmt->bind_param('ii', $id, $userId);
            if (!$stmt->execute()) {
                $stmt->close();
                jsonResponse(['error' => 'Konfiguration löschen fehlgeschlagen.'], 500);
            }
            $stmt->close();

            jsonResponse(['success' => true]);
        }

    default:
        jsonResponse(['error' => 'Unbekannte Aktion'], 400);
}
