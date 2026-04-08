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
            'base_price' => 89.00,
            'image_url' => '',
            'is_active' => 1
        ],
        [
            'id' => 2,
            'category_id' => 1,
            'name' => 'Nova Solitaire',
            'slug' => 'nova-solitaire',
            'description' => 'Der Nova Solitaire besticht durch seine klare Linie und den einzelnen, brillant gefassten Stein.',
            'base_price' => 149.00,
            'image_url' => '',
            'is_active' => 1
        ],
        [
            'id' => 3,
            'category_id' => 1,
            'name' => 'Regalia Signet',
            'slug' => 'regalia-signet',
            'description' => 'Ein kraftvoller Siegelring mit individueller Gravur-Option. Statement und Tradition in einem.',
            'base_price' => 119.00,
            'image_url' => '',
            'is_active' => 1
        ],
        [
            'id' => 4,
            'category_id' => 1,
            'name' => 'Aura Twist',
            'slug' => 'aura-twist',
            'description' => 'Spielerisch verdrehtes Design – der Aura Twist ist modern, mutig und einzigartig.',
            'base_price' => 109.00,
            'image_url' => '',
            'is_active' => 1
        ],
        [
            'id' => 5,
            'category_id' => 2,
            'name' => 'Luxe Chain',
            'slug' => 'luxe-chain',
            'description' => 'Ein elegantes Gliederarmband, das sich perfekt an das Handgelenk schmiegt.',
            'base_price' => 129.00,
            'image_url' => '',
            'is_active' => 1
        ],
        [
            'id' => 6,
            'category_id' => 2,
            'name' => 'Celestia Bangle',
            'slug' => 'celestia-bangle',
            'description' => 'Ein schlanker Armreif mit fließender Form – minimalistisch und doch auffallend.',
            'base_price' => 99.00,
            'image_url' => '',
            'is_active' => 1
        ],
        [
            'id' => 7,
            'category_id' => 2,
            'name' => 'Vega Tennis',
            'slug' => 'vega-tennis',
            'description' => 'Das Vega Tennis-Armband glänzt mit einer durchgehenden Reihe funkelnder Steine.',
            'base_price' => 199.00,
            'image_url' => '',
            'is_active' => 1
        ],
        [
            'id' => 8,
            'category_id' => 2,
            'name' => 'Orion Cuff',
            'slug' => 'orion-cuff',
            'description' => 'Ein breiter, offener Armreif mit markanter Oberfläche. Bold und selbstbewusst.',
            'base_price' => 159.00,
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
                ['id' => 1, 'category_id' => 1, 'name' => 'Solitär', 'slug' => 'solitaer', 'price_modifier' => 50],
                ['id' => 2, 'category_id' => 1, 'name' => 'Ehering', 'slug' => 'ehering', 'price_modifier' => 0],
                ['id' => 3, 'category_id' => 1, 'name' => 'Verlobungsring', 'slug' => 'verlobungsring', 'price_modifier' => 75],
                ['id' => 4, 'category_id' => 1, 'name' => 'Statement-Ring', 'slug' => 'statement', 'price_modifier' => 40],
                ['id' => 5, 'category_id' => 1, 'name' => 'Siegelring', 'slug' => 'siegelring', 'price_modifier' => 35]
            ],
            2 => [
                ['id' => 6, 'category_id' => 2, 'name' => 'Armreif', 'slug' => 'armreif', 'price_modifier' => 20],
                ['id' => 7, 'category_id' => 2, 'name' => 'Gliederarmband', 'slug' => 'glieder', 'price_modifier' => 30],
                ['id' => 8, 'category_id' => 2, 'name' => 'Tennisarmband', 'slug' => 'tennis', 'price_modifier' => 60],
                ['id' => 9, 'category_id' => 2, 'name' => 'Panzerarmband', 'slug' => 'panzer', 'price_modifier' => 25],
                ['id' => 10, 'category_id' => 2, 'name' => 'Charm-Armband', 'slug' => 'charm', 'price_modifier' => 15]
            ]
        ],
        'materials' => [
            ['id' => 1, 'name' => '925er Silber', 'slug' => 'silber', 'price_modifier' => 0, 'color_hex' => '#C0C0C0'],
            ['id' => 2, 'name' => '750er Gelbgold', 'slug' => 'gelbgold', 'price_modifier' => 120, 'color_hex' => '#FFD700'],
            ['id' => 3, 'name' => '750er Roségold', 'slug' => 'rosegold', 'price_modifier' => 130, 'color_hex' => '#B76E79'],
            ['id' => 4, 'name' => '750er Weißgold', 'slug' => 'weissgold', 'price_modifier' => 125, 'color_hex' => '#E8E8E8'],
            ['id' => 5, 'name' => 'Platin 950', 'slug' => 'platin', 'price_modifier' => 250, 'color_hex' => '#E5E4E2'],
            ['id' => 6, 'name' => 'Titan', 'slug' => 'titan', 'price_modifier' => 30, 'color_hex' => '#878681']
        ],
        'sizes' => [
            1 => [
                ['id' => 1, 'category_id' => 1, 'label' => '48 (15.3mm)', 'value' => '48', 'price_modifier' => 0],
                ['id' => 2, 'category_id' => 1, 'label' => '50 (15.9mm)', 'value' => '50', 'price_modifier' => 0],
                ['id' => 3, 'category_id' => 1, 'label' => '52 (16.6mm)', 'value' => '52', 'price_modifier' => 0],
                ['id' => 4, 'category_id' => 1, 'label' => '54 (17.2mm)', 'value' => '54', 'price_modifier' => 0],
                ['id' => 5, 'category_id' => 1, 'label' => '56 (17.8mm)', 'value' => '56', 'price_modifier' => 0],
                ['id' => 6, 'category_id' => 1, 'label' => '58 (18.5mm)', 'value' => '58', 'price_modifier' => 0],
                ['id' => 7, 'category_id' => 1, 'label' => '60 (19.1mm)', 'value' => '60', 'price_modifier' => 0],
                ['id' => 8, 'category_id' => 1, 'label' => '62 (19.7mm)', 'value' => '62', 'price_modifier' => 5],
                ['id' => 9, 'category_id' => 1, 'label' => '64 (20.4mm)', 'value' => '64', 'price_modifier' => 5],
                ['id' => 10, 'category_id' => 1, 'label' => '66 (21.0mm)', 'value' => '66', 'price_modifier' => 10]
            ],
            2 => [
                ['id' => 11, 'category_id' => 2, 'label' => 'S (16cm)', 'value' => 'S', 'price_modifier' => 0],
                ['id' => 12, 'category_id' => 2, 'label' => 'M (18cm)', 'value' => 'M', 'price_modifier' => 0],
                ['id' => 13, 'category_id' => 2, 'label' => 'L (20cm)', 'value' => 'L', 'price_modifier' => 5],
                ['id' => 14, 'category_id' => 2, 'label' => 'XL (22cm)', 'value' => 'XL', 'price_modifier' => 10]
            ]
        ],
        'shapes' => [
            1 => [
                ['id' => 1, 'category_id' => 1, 'name' => 'Klassisch rund', 'slug' => 'klassisch', 'price_modifier' => 0],
                ['id' => 2, 'category_id' => 1, 'name' => 'Flach', 'slug' => 'flach', 'price_modifier' => 0],
                ['id' => 3, 'category_id' => 1, 'name' => 'Gewölbt', 'slug' => 'gewoelbt', 'price_modifier' => 10],
                ['id' => 4, 'category_id' => 1, 'name' => 'Twisted', 'slug' => 'twisted', 'price_modifier' => 25],
                ['id' => 5, 'category_id' => 1, 'name' => 'Hexagonal', 'slug' => 'hexagonal', 'price_modifier' => 30]
            ],
            2 => [
                ['id' => 6, 'category_id' => 2, 'name' => 'Rund', 'slug' => 'rund', 'price_modifier' => 0],
                ['id' => 7, 'category_id' => 2, 'name' => 'Flach', 'slug' => 'flach', 'price_modifier' => 0],
                ['id' => 8, 'category_id' => 2, 'name' => 'Oval', 'slug' => 'oval', 'price_modifier' => 10],
                ['id' => 9, 'category_id' => 2, 'name' => 'Eckig', 'slug' => 'eckig', 'price_modifier' => 15]
            ]
        ],
        'engravings' => [
            ['id' => 1, 'name' => 'Einfache Gravur', 'max_chars' => 20, 'price_per_char' => 2.50, 'base_price' => 15],
            ['id' => 2, 'name' => 'Schreibschrift', 'max_chars' => 15, 'price_per_char' => 3.50, 'base_price' => 20],
            ['id' => 3, 'name' => 'Symbolgravur', 'max_chars' => 5, 'price_per_char' => 5.00, 'base_price' => 25]
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

        $out[] = array_merge($p, [
            'category_name' => $cat['name'],
            'category_slug' => $cat['slug']
        ]);
    }

    return $out;
}

function optionById(string $group, int $id, ?int $categoryId = null): ?array
{
    $opts = catalogOptions();

    if ($group === 'materials' || $group === 'engravings') {
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
