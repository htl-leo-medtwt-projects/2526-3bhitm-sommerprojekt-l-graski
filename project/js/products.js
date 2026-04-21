/**
 * Oréon – Products Page JS
 * Product listing, filtering, card rendering
 */

// KI GENERIERT: Placeholder-Produktdaten (Fallback wenn API nicht verfügbar)
// Placeholder product data (used when API is not available)
const PLACEHOLDER_PRODUCTS = [
    {
        id: 1, category_id: 1, name: 'Eternal Band', slug: 'eternal-band',
        description: 'Ein zeitloser Ring, der Eleganz und Schlichtheit vereint. Perfekt als Ehering oder als täglicher Begleiter.',
        base_price: 89.00, image_url: '', category_name: 'Ringe', category_slug: 'ringe'
    },
    {
        id: 2, category_id: 1, name: 'Nova Solitaire', slug: 'nova-solitaire',
        description: 'Der Nova Solitaire besticht durch seine klare Linie und den einzelnen, brillant gefassten Stein.',
        base_price: 149.00, image_url: '', category_name: 'Ringe', category_slug: 'ringe'
    },
    {
        id: 3, category_id: 1, name: 'Regalia Signet', slug: 'regalia-signet',
        description: 'Ein kraftvoller Siegelring mit individueller Gravur-Option. Statement und Tradition in einem.',
        base_price: 119.00, image_url: '', category_name: 'Ringe', category_slug: 'ringe'
    },
    {
        id: 4, category_id: 1, name: 'Aura Twist', slug: 'aura-twist',
        description: 'Spielerisch verdrehtes Design – der Aura Twist ist modern, mutig und einzigartig.',
        base_price: 109.00, image_url: '', category_name: 'Ringe', category_slug: 'ringe'
    },
    {
        id: 5, category_id: 2, name: 'Luxe Chain', slug: 'luxe-chain',
        description: 'Ein elegantes Gliederarmband, das sich perfekt an das Handgelenk schmiegt.',
        base_price: 129.00, image_url: '', category_name: 'Armbänder', category_slug: 'armbaender'
    },
    {
        id: 6, category_id: 2, name: 'Celestia Bangle', slug: 'celestia-bangle',
        description: 'Ein schlanker Armreif mit fließender Form – minimalistisch und doch auffallend.',
        base_price: 99.00, image_url: '', category_name: 'Armbänder', category_slug: 'armbaender'
    },
    {
        id: 7, category_id: 2, name: 'Vega Tennis', slug: 'vega-tennis',
        description: 'Das Vega Tennis-Armband glänzt mit einer durchgehenden Reihe funkelnder Steine.',
        base_price: 199.00, image_url: '', category_name: 'Armbänder', category_slug: 'armbaender'
    },
    {
        id: 8, category_id: 2, name: 'Orion Cuff', slug: 'orion-cuff',
        description: 'Ein breiter, offener Armreif mit markanter Oberfläche. Bold und selbstbewusst.',
        base_price: 159.00, image_url: '', category_name: 'Armbänder', category_slug: 'armbaender'
    }
];

const CATEGORY_ICONS = {
    ringe: 'fa-ring',
    armbaender: 'fa-circle-notch'
};

function createProductCard(product) {
    const icon = CATEGORY_ICONS[product.category_slug] || 'fa-gem';
    const imgHtml = product.image_url
        ? `<img src="${escapeHtml(product.image_url)}" alt="${escapeHtml(product.name)}">`
        : `<span class="placeholder-icon"><i class="fas ${icon}"></i></span>`;

    return `
        <div class="product-card" data-slug="${escapeHtml(product.slug)}" data-category="${escapeHtml(product.category_slug)}" role="button" tabindex="0">
            <div class="product-card-img">
                ${imgHtml}
            </div>
            <div class="product-card-body">
                <div class="product-card-category">${escapeHtml(product.category_name)}</div>
                <h3 class="product-card-title">${escapeHtml(product.name)}</h3>
                <p class="product-card-desc">${escapeHtml(product.description)}</p>
                <div class="product-card-footer">
                    <span class="product-price"><small>ab</small><span class="product-price-value">${formatPrice(product.base_price)}</span></span>
                    <span class="btn btn-secondary btn-sm">Konfigurieren</span>
                </div>
            </div>
        </div>
    `;
}

function getPlaceholderProducts() {
    return PLACEHOLDER_PRODUCTS.map(p => createProductCard(p)).join('');
}

function goToConfigurator(slug) {
    window.location.href = `configurator.html?product=${slug}`;
}

function bindProductCardLinks(container) {
    if (!container) return;

    container.querySelectorAll('.product-card[data-slug]').forEach(card => {
        if (card.dataset.bound === '1') return;
        card.dataset.bound = '1';

        card.addEventListener('click', () => {
            goToConfigurator(card.dataset.slug);
        });

        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                goToConfigurator(card.dataset.slug);
            }
        });
    });
}

// ========== Products Page Init ==========
async function initProductsPage() {
    const grid = document.getElementById('productsGrid');
    const filterBar = document.getElementById('filterBar');
    if (!grid) return;

    let products = [];

    // Try API, fallback to placeholders
    try {
        const data = await OreonAPI.getProducts();
        products = data.products || [];
    } catch (e) {
        products = [...PLACEHOLDER_PRODUCTS];
    }

    // Check URL param for initial category
    const urlCategory = getUrlParam('category');

    function renderProducts(category = 'all') {
        const filtered = category === 'all'
            ? products
            : products.filter(p => p.category_slug === category);

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="empty-state empty-state-full-width">
                    <div class="empty-state-icon">🔍</div>
                    <h2>Keine Produkte gefunden</h2>
                    <p>Versuche eine andere Kategorie.</p>
                </div>
            `;
        } else {
            grid.innerHTML = filtered.map(p => createProductCard(p)).join('');
            bindProductCardLinks(grid);

            // =====KI=====
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(grid.querySelectorAll('.product-card'),
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
                );
            }
            // ============
        }
    }

    // Filter buttons
    if (filterBar) {
        filterBar.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                filterBar.querySelector('.filter-btn.active')?.classList.remove('active');
                btn.classList.add('active');
                renderProducts(btn.dataset.category);
            });
        });
    }

    // Apply URL filter
    if (urlCategory) {
        const btn = filterBar?.querySelector(`[data-category="${urlCategory}"]`);
        if (btn) {
            filterBar.querySelector('.filter-btn.active')?.classList.remove('active');
            btn.classList.add('active');
        }
        renderProducts(urlCategory);
    } else {
        renderProducts('all');
    }
}

async function initFeaturedProducts() {
    const grid = document.getElementById('featuredProducts');
    if (!grid) return;

    try {
        const data = await OreonAPI.getProducts();
        if (data.products) {
            const featured = data.products.slice(0, 4);
            grid.innerHTML = featured.map(p => createProductCard(p)).join('');
            bindProductCardLinks(grid);
            return;
        }
    } catch (e) {
        // fallback below
    }

    grid.innerHTML = getPlaceholderProducts();
    bindProductCardLinks(grid);
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('productsGrid')) {
        initProductsPage();
    }

    if (document.getElementById('featuredProducts')) {
        initFeaturedProducts();
    }
});
