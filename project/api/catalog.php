<?php

function catalogCategories(): array
{
    return [
        ['id' => 1, 'name' => 'Ringe', 'slug' => 'ringe'],
        ['id' => 2, 'name' => 'Armbänder', 'slug' => 'armbaender'],
    ];
}

function catalogProducts(): array
{
    return [
        [
            'id' => 1,
            'category_id' => 1,
            'name' => 'Eternal Band',
            'slug' => 'eternal-band',
            'description' => 'Ein zeitloser Ring, der Eleganz und Schlichtheit vereint. Perfekt als Ehering oder als täglicher Begleiter.',
            'base_price' => 489.00,
            'image_url' => '',
            'is_active' => 1
        ],
        [
            'id' => 2,
            'category_id' => 1,
            'name' => 'Nova Solitaire',
            'slug' => 'nova-solitaire',
            'description' => 'Der Nova Solitaire besticht durch seine klare Linie und den einzelnen, brillant gefassten Stein.',
            'base_price' => 629.00,
            'image_url' => '',
            'is_active' => 1
        ],
        [
            'id' => 3,
            'category_id' => 1,
            'name' => 'Regalia Signet',
            'slug' => 'regalia-signet',
            'description' => 'Ein kraftvoller Siegelring mit individueller Gravur-Option. Statement und Tradition in einem.',
            'base_price' => 569.00,
            'image_url' => '',
            'is_active' => 1
        ],
        [
            'id' => 4,
            'category_id' => 1,
            'name' => 'Aura Twist',
            'slug' => 'aura-twist',
            'description' => 'Spielerisch verdrehtes Design – der Aura Twist ist modern, mutig und einzigartig.',
            'base_price' => 539.00,
            'image_url' => '',
            'is_active' => 1
        ],
        [
            'id' => 5,
            'category_id' => 2,
            'name' => 'Luxe Chain',
            'slug' => 'luxe-chain',
            'description' => 'Ein elegantes Gliederarmband, das sich perfekt an das Handgelenk schmiegt.',
            'base_price' => 589.00,
            'image_url' => '',
            'is_active' => 1
        ],
        [
            'id' => 6,
            'category_id' => 2,
            'name' => 'Celestia Bangle',
            'slug' => 'celestia-bangle',
            'description' => 'Ein schlanker Armreif mit fließender Form – minimalistisch und doch auffallend.',
            'base_price' => 529.00,
            'image_url' => '',
            'is_active' => 1
        ],
        [
            'id' => 7,
            'category_id' => 2,
            'name' => 'Vega Tennis',
            'slug' => 'vega-tennis',
            'description' => 'Das Vega Tennis-Armband glänzt mit einer durchgehenden Reihe funkelnder Steine.',
            'base_price' => 579.00,
            'image_url' => '',
            'is_active' => 1
        ],
        [
            'id' => 8,
            'category_id' => 2,
            'name' => 'Orion Cuff',
            'slug' => 'orion-cuff',
            'description' => 'Ein breiter, offener Armreif mit markanter Oberfläche. Bold und selbstbewusst.',
            'base_price' => 689.00,
            'image_url' => '',
            'is_active' => 1
        ]
    ];
}

//=======KI=======
function catalogOptions(): array
{
    return [
        'types' => [
            1 => [
                ['id' => 1, 'category_id' => 1, 'name' => 'Solitär', 'slug' => 'solitaer', 'price_modifier' => 420],
                ['id' => 2, 'category_id' => 1, 'name' => 'Ehering', 'slug' => 'ehering', 'price_modifier' => 520],
                ['id' => 3, 'category_id' => 1, 'name' => 'Verlobungsring', 'slug' => 'verlobungsring', 'price_modifier' => 500],
                ['id' => 4, 'category_id' => 1, 'name' => 'Statement-Ring', 'slug' => 'statement', 'price_modifier' => 370],
                ['id' => 5, 'category_id' => 1, 'name' => 'Siegelring', 'slug' => 'siegelring', 'price_modifier' => 360]
            ],
            2 => [
                ['id' => 6, 'category_id' => 2, 'name' => 'Armreif', 'slug' => 'armreif', 'price_modifier' => 240],
                ['id' => 7, 'category_id' => 2, 'name' => 'Gliederarmband', 'slug' => 'glieder', 'price_modifier' => 290],
                ['id' => 8, 'category_id' => 2, 'name' => 'Tennisarmband', 'slug' => 'tennis', 'price_modifier' => 460],
                ['id' => 9, 'category_id' => 2, 'name' => 'Panzerarmband', 'slug' => 'panzer', 'price_modifier' => 270],
                ['id' => 10, 'category_id' => 2, 'name' => 'Charm-Armband', 'slug' => 'charm', 'price_modifier' => 230]
            ]
        ],
        'materials' => [
            ['id' => 1, 'name' => '925er Silber', 'slug' => 'silber', 'price_modifier' => 0, 'color_hex' => '#C0C0C0'],
            ['id' => 2, 'name' => '750er Gelbgold', 'slug' => 'gelbgold', 'price_modifier' => 620, 'color_hex' => '#FFD700'],
            ['id' => 3, 'name' => '750er Roségold', 'slug' => 'rosegold', 'price_modifier' => 650, 'color_hex' => '#B76E79'],
            ['id' => 4, 'name' => '750er Weißgold', 'slug' => 'weissgold', 'price_modifier' => 640, 'color_hex' => '#E8E8E8'],
            ['id' => 5, 'name' => 'Platin 950', 'slug' => 'platin', 'price_modifier' => 980, 'color_hex' => '#E5E4E2'],
            ['id' => 6, 'name' => 'Titan', 'slug' => 'titan', 'price_modifier' => 340, 'color_hex' => '#878681']
        ],
        'sizes' => [
            1 => [
                ['id' => 1, 'category_id' => 1, 'label' => '48 (15.3mm)', 'value' => '48', 'price_modifier' => 0],
                ['id' => 2, 'category_id' => 1, 'label' => '50 (15.9mm)', 'value' => '50', 'price_modifier' => 10],
                ['id' => 3, 'category_id' => 1, 'label' => '52 (16.6mm)', 'value' => '52', 'price_modifier' => 20],
                ['id' => 4, 'category_id' => 1, 'label' => '54 (17.2mm)', 'value' => '54', 'price_modifier' => 30],
                ['id' => 5, 'category_id' => 1, 'label' => '56 (17.8mm)', 'value' => '56', 'price_modifier' => 40],
                ['id' => 6, 'category_id' => 1, 'label' => '58 (18.5mm)', 'value' => '58', 'price_modifier' => 50],
                ['id' => 7, 'category_id' => 1, 'label' => '60 (19.1mm)', 'value' => '60', 'price_modifier' => 60],
                ['id' => 8, 'category_id' => 1, 'label' => '62 (19.7mm)', 'value' => '62', 'price_modifier' => 90],
                ['id' => 9, 'category_id' => 1, 'label' => '64 (20.4mm)', 'value' => '64', 'price_modifier' => 110],
                ['id' => 10, 'category_id' => 1, 'label' => '66 (21.0mm)', 'value' => '66', 'price_modifier' => 140]
            ],
            2 => [
                ['id' => 11, 'category_id' => 2, 'label' => 'S (16cm)', 'value' => 'S', 'price_modifier' => 0],
                ['id' => 12, 'category_id' => 2, 'label' => 'M (18cm)', 'value' => 'M', 'price_modifier' => 20],
                ['id' => 13, 'category_id' => 2, 'label' => 'L (20cm)', 'value' => 'L', 'price_modifier' => 45],
                ['id' => 14, 'category_id' => 2, 'label' => 'XL (22cm)', 'value' => 'XL', 'price_modifier' => 80]
            ]
        ],
        'shapes' => [
            1 => [
                ['id' => 1, 'category_id' => 1, 'name' => 'Klassisch rund', 'slug' => 'klassisch', 'price_modifier' => 60],
                ['id' => 2, 'category_id' => 1, 'name' => 'Flach', 'slug' => 'flach', 'price_modifier' => 50],
                ['id' => 3, 'category_id' => 1, 'name' => 'Gewölbt', 'slug' => 'gewoelbt', 'price_modifier' => 110],
                ['id' => 4, 'category_id' => 1, 'name' => 'Twisted', 'slug' => 'twisted', 'price_modifier' => 200],
                ['id' => 5, 'category_id' => 1, 'name' => 'Hexagonal', 'slug' => 'hexagonal', 'price_modifier' => 240]
            ],
            2 => [
                ['id' => 6, 'category_id' => 2, 'name' => 'Rund', 'slug' => 'rund', 'price_modifier' => 55],
                ['id' => 7, 'category_id' => 2, 'name' => 'Flach', 'slug' => 'flach', 'price_modifier' => 45],
                ['id' => 8, 'category_id' => 2, 'name' => 'Oval', 'slug' => 'oval', 'price_modifier' => 100],
                ['id' => 9, 'category_id' => 2, 'name' => 'Eckig', 'slug' => 'eckig', 'price_modifier' => 140]
            ]
        ],
        'jewels' => [
            ['id' => 1, 'name' => 'Diamant', 'slug' => 'diamant', 'price_modifier' => 690, 'color_hex' => '#f5f9ff', 'is_special' => 0],
            ['id' => 2, 'name' => 'Saphir', 'slug' => 'saphir', 'price_modifier' => 420, 'color_hex' => '#2850d8', 'is_special' => 0],
            ['id' => 3, 'name' => 'Rubin', 'slug' => 'rubin', 'price_modifier' => 460, 'color_hex' => '#c32036', 'is_special' => 0],
            ['id' => 4, 'name' => 'Smaragd', 'slug' => 'smaragd', 'price_modifier' => 480, 'color_hex' => '#11a66a', 'is_special' => 0],
            ['id' => 5, 'name' => 'Aquamarin', 'slug' => 'aquamarin', 'price_modifier' => 340, 'color_hex' => '#7ad8e8', 'is_special' => 0],
            ['id' => 6, 'name' => 'Perle', 'slug' => 'perle', 'price_modifier' => 300, 'color_hex' => '#f3eee6', 'is_special' => 0],
            ['id' => 7, 'name' => 'Jade', 'slug' => 'jade', 'price_modifier' => 620, 'color_hex' => '#2f8f62', 'is_special' => 1],
            ['id' => 8, 'name' => 'Tansanit', 'slug' => 'tansanit', 'price_modifier' => 760, 'color_hex' => '#5a57d9', 'is_special' => 1],
            ['id' => 9, 'name' => 'Alexandrit', 'slug' => 'alexandrit', 'price_modifier' => 920, 'color_hex' => '#4f7d68', 'is_special' => 1],
            ['id' => 10, 'name' => 'Opal', 'slug' => 'opal', 'price_modifier' => 680, 'color_hex' => '#b7d8ff', 'is_special' => 1],
            ['id' => 11, 'name' => 'Paraiba-Turmalin', 'slug' => 'paraiba-turmalin', 'price_modifier' => 1250, 'color_hex' => '#33dcd0', 'is_special' => 1]
        ]
    ];
}
//================

function categoryById(int $categoryId): ?array
{
    foreach (catalogCategories() as $cat) {
        if ((int)$cat['id'] === $categoryId) {
            return $cat;
        }
    }
    return null;
}

function categoryBySlug(string $slug): ?array
{
    foreach (catalogCategories() as $cat) {
        if ($cat['slug'] === $slug) {
            return $cat;
        }
    }
    return null;
}

function productById(int $id): ?array
{
    foreach (catalogProducts() as $p) {
        if ((int)$p['id'] === $id && (int)($p['is_active'] ?? 0) === 1) {
            return $p;
        }
    }
    return null;
}

function productBySlug(string $slug): ?array
{
    foreach (catalogProducts() as $p) {
        if ($p['slug'] === $slug && (int)($p['is_active'] ?? 0) === 1) {
            return $p;
        }
    }
    return null;
}

function productsWithCategory(?string $categorySlug = null): array
{
    $cats = catalogCategories();
    $catMap = [];
    foreach ($cats as $c) {
        $catMap[(int)$c['id']] = $c;
    }

    $out = [];
    foreach (catalogProducts() as $p) {
        if ((int)($p['is_active'] ?? 0) !== 1) {
            continue;
        }

        $cat = $catMap[(int)$p['category_id']] ?? null;
        if (!$cat) {
            continue;
        }

        if ($categorySlug && $cat['slug'] !== $categorySlug) {
            continue;
        }

        // compute card_price = (base + default option modifiers) * 0.8
        $opts = catalogOptions();
        $types = $opts['types'][$p['category_id']] ?? [];
        $materials = $opts['materials'] ?? [];
        $sizes = $opts['sizes'][$p['category_id']] ?? [];
        $shapes = $opts['shapes'][$p['category_id']] ?? [];
        $jewels = $opts['jewels'] ?? [];

        $subtotal = (float)$p['base_price'];
        if (!empty($types)) $subtotal += (float)($types[array_key_first($types)]['price_modifier'] ?? 0);
        if (!empty($materials)) $subtotal += (float)($materials[0]['price_modifier'] ?? 0);
        if (!empty($sizes)) $subtotal += (float)($sizes[array_key_first($sizes)]['price_modifier'] ?? 0);
        if (!empty($shapes)) $subtotal += (float)($shapes[array_key_first($shapes)]['price_modifier'] ?? 0);
        if (!empty($jewels)) $subtotal += (float)($jewels[0]['price_modifier'] ?? 0);

        $card_price = round($subtotal * 0.8, 2);

        $out[] = array_merge($p, [
            'category_name' => $cat['name'],
            'category_slug' => $cat['slug'],
            'card_price' => $card_price
        ]);
    }

    return $out;
}

function optionById(string $group, int $id, ?int $categoryId = null): ?array
{
    $opts = catalogOptions();

    if ($group === 'materials' || $group === 'jewels') {
        foreach ($opts[$group] as $opt) {
            if ((int)$opt['id'] === $id) {
                return $opt;
            }
        }
        return null;
    }

    if ($categoryId === null) {
        return null;
    }

    $list = $opts[$group][$categoryId] ?? [];
    foreach ($list as $opt) {
        if ((int)$opt['id'] === $id) {
            return $opt;
        }
    }
    return null;
}
