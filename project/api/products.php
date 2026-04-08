<?php
require_once __DIR__ . '/api_helper.php';
require_once __DIR__ . '/catalog.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'list': {
            $categorySlug = trim($_GET['category'] ?? '');
            $products = productsWithCategory($categorySlug !== '' ? $categorySlug : null);
            jsonResponse(['products' => $products]);
        }

    case 'detail': {
            $slug = trim($_GET['slug'] ?? '');
            if ($slug === '') {
                jsonResponse(['error' => 'Produkt-Slug fehlt'], 400);
            }

            $product = productBySlug($slug);
            if (!$product) {
                jsonResponse(['error' => 'Produkt nicht gefunden'], 404);
            }

            $cat = categoryById((int)$product['category_id']);
            if (!$cat) {
                jsonResponse(['error' => 'Produkt nicht gefunden'], 404);
            }

            $productOut = array_merge($product, [
                'category_name' => $cat['name'],
                'category_slug' => $cat['slug'],
                'cat_id' => $cat['id']
            ]);

            jsonResponse(['product' => $productOut]);
        }

    case 'categories': {
            jsonResponse(['categories' => catalogCategories()]);
        }

    case 'options': {
            $categoryId = (int)($_GET['category_id'] ?? 0);
            if (!$categoryId) {
                jsonResponse(['error' => 'Kategorie-ID fehlt'], 400);
            }

            $opts = catalogOptions();
            jsonResponse([
                'types' => $opts['types'][$categoryId] ?? [],
                'materials' => $opts['materials'],
                'sizes' => $opts['sizes'][$categoryId] ?? [],
                'shapes' => $opts['shapes'][$categoryId] ?? [],
                'engravings' => $opts['engravings']
            ]);
        }

    default:
        jsonResponse(['error' => 'Unbekannte Aktion'], 400);
}
