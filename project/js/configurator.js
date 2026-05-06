const ConfigState = {
    product: null,
    categoryId: null,
    categorySlug: 'ringe',
    options: { types: [], materials: [], sizes: [], shapes: [], jewels: [] },
    defaultSelections: { type: null, material: null, size: null, shape: null, jewel: null },
    selected: {
        type: null,
        material: null,
        size: null,
        shape: null,
        jewel: null
    },
    pricingMode: 'preset',
    basePrice: 0,
    babylonScene: null,
    babylonEngine: null,
    meshes: {},
    currentStep: 0,
    totalSteps: 6
};

const PLACEHOLDER_OPTIONS = {
    ringe: {
        types: [
            { id: 1, name: 'Solitär', slug: 'solitaer', price_modifier: 420 },
            { id: 2, name: 'Ehering', slug: 'ehering', price_modifier: 520 },
            { id: 3, name: 'Verlobungsring', slug: 'verlobungsring', price_modifier: 500 },
            { id: 4, name: 'Statement-Ring', slug: 'statement', price_modifier: 370 },
            { id: 5, name: 'Siegelring', slug: 'siegelring', price_modifier: 360 }
        ],
        sizes: [
            { id: 1, label: '48 (15.3mm)', value: '48', price_modifier: 0 },
            { id: 2, label: '50 (15.9mm)', value: '50', price_modifier: 30 },
            { id: 3, label: '52 (16.6mm)', value: '52', price_modifier: 40 },
            { id: 4, label: '54 (17.2mm)', value: '54', price_modifier: 50 },
            { id: 5, label: '56 (17.8mm)', value: '56', price_modifier: 60 },
            { id: 6, label: '58 (18.5mm)', value: '58', price_modifier: 70 },
            { id: 7, label: '60 (19.1mm)', value: '60', price_modifier: 80 },
            { id: 8, label: '62 (19.7mm)', value: '62', price_modifier: 110 },
            { id: 9, label: '64 (20.4mm)', value: '64', price_modifier: 130 },
            { id: 10, label: '66 (21.0mm)', value: '66', price_modifier: 160 }
        ],
        shapes: [
            { id: 1, name: 'Klassisch rund', slug: 'klassisch', price_modifier: 60 },
            { id: 2, name: 'Flach', slug: 'flach', price_modifier: 50 },
            { id: 3, name: 'Gewölbt', slug: 'gewoelbt', price_modifier: 110 },
            { id: 4, name: 'Twisted', slug: 'twisted', price_modifier: 200 },
            { id: 5, name: 'Hexagonal', slug: 'hexagonal', price_modifier: 240 }
        ]
    },
    armbaender: {
        types: [
            { id: 6, name: 'Armreif', slug: 'armreif', price_modifier: 240 },
            { id: 7, name: 'Gliederarmband', slug: 'glieder', price_modifier: 290 },
            { id: 8, name: 'Tennisarmband', slug: 'tennis', price_modifier: 460 },
            { id: 9, name: 'Panzerarmband', slug: 'panzer', price_modifier: 270 },
            { id: 10, name: 'Charm-Armband', slug: 'charm', price_modifier: 230 }
        ],
        sizes: [
            { id: 11, label: 'S (16cm)', value: 'S', price_modifier: 0 },
            { id: 12, label: 'M (18cm)', value: 'M', price_modifier: 40 },
            { id: 13, label: 'L (20cm)', value: 'L', price_modifier: 65 },
            { id: 14, label: 'XL (22cm)', value: 'XL', price_modifier: 100 }
        ],
        shapes: [
            { id: 6, name: 'Rund', slug: 'rund', price_modifier: 55 },
            { id: 7, name: 'Flach', slug: 'flach', price_modifier: 45 },
            { id: 8, name: 'Oval', slug: 'oval', price_modifier: 100 },
            { id: 9, name: 'Eckig', slug: 'eckig', price_modifier: 140 }
        ]
    },
    materials: [
        { id: 1, name: '925er Silber', slug: 'silber', price_modifier: 0, color_hex: '#C0C0C0' },
        { id: 2, name: '750er Gelbgold', slug: 'gelbgold', price_modifier: 620, color_hex: '#FFD700' },
        { id: 3, name: '750er Roségold', slug: 'rosegold', price_modifier: 650, color_hex: '#B76E79' },
        { id: 4, name: '750er Weißgold', slug: 'weissgold', price_modifier: 640, color_hex: '#E8E8E8' },
        { id: 5, name: 'Platin 950', slug: 'platin', price_modifier: 980, color_hex: '#E5E4E2' },
        { id: 6, name: 'Titan', slug: 'titan', price_modifier: 340, color_hex: '#878681' }
    ],
    jewels: [
        { id: 1, name: 'Diamant', slug: 'diamant', price_modifier: 690, color_hex: '#f5f9ff', is_special: 0 },
        { id: 2, name: 'Saphir', slug: 'saphir', price_modifier: 420, color_hex: '#2850d8', is_special: 0 },
        { id: 3, name: 'Rubin', slug: 'rubin', price_modifier: 460, color_hex: '#c32036', is_special: 0 },
        { id: 4, name: 'Smaragd', slug: 'smaragd', price_modifier: 480, color_hex: '#11a66a', is_special: 0 },
        { id: 5, name: 'Aquamarin', slug: 'aquamarin', price_modifier: 340, color_hex: '#7ad8e8', is_special: 0 },
        { id: 6, name: 'Perle', slug: 'perle', price_modifier: 300, color_hex: '#f3eee6', is_special: 0 },
        { id: 7, name: 'Jade', slug: 'jade', price_modifier: 620, color_hex: '#2f8f62', is_special: 1 },
        { id: 8, name: 'Tansanit', slug: 'tansanit', price_modifier: 760, color_hex: '#5a57d9', is_special: 1 },
        { id: 9, name: 'Alexandrit', slug: 'alexandrit', price_modifier: 920, color_hex: '#4f7d68', is_special: 1 },
        { id: 10, name: 'Opal', slug: 'opal', price_modifier: 680, color_hex: '#b7d8ff', is_special: 1 },
        { id: 11, name: 'Paraiba-Turmalin', slug: 'paraiba-turmalin', price_modifier: 1250, color_hex: '#33dcd0', is_special: 1 }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    initConfigCategoryFilter();
    loadConfigProducts('ringe');
    initConfiguratorButtons();
    initWizardNav();

    const productSlug = getUrlParam('product');
    const configId = getUrlParam('config');

    if (productSlug) {
        const product = PLACEHOLDER_PRODUCTS.find(item => item.slug === productSlug);
        if (product) {
            selectProduct(product);
        }
    } else if (configId) {
        loadSavedConfiguration(parseInt(configId));
    }
});

function initWizardNav() {
    const prevBtn = document.getElementById('wizardPrev');
    const nextBtn = document.getElementById('wizardNext');

    prevBtn?.addEventListener('click', () => {
        if (ConfigState.currentStep > 0) {
            goToStep(ConfigState.currentStep - 1);
        }
    });

    nextBtn?.addEventListener('click', () => {
        if (ConfigState.currentStep < ConfigState.totalSteps - 1) {
            goToStep(ConfigState.currentStep + 1);
        }
    });

    document.querySelectorAll('.wizard-step-dot[data-step]').forEach(dot => {
        dot.addEventListener('click', () => {
            const step = parseInt(dot.dataset.step);
            if (step <= getMaxReachableStep()) {
                goToStep(step);
            }
        });
    });
}

function getMaxReachableStep() {
    const selectedOptions = ConfigState.selected;
    let max = 0;
    if (selectedOptions.type) max = 1;
    if (selectedOptions.type && selectedOptions.material) max = 2;
    if (selectedOptions.type && selectedOptions.material && selectedOptions.size) max = 3;
    if (selectedOptions.type && selectedOptions.material && selectedOptions.size && selectedOptions.shape) max = 4;
    if (selectedOptions.type && selectedOptions.material && selectedOptions.size && selectedOptions.shape) max = 5;
    return max;
}

function goToStep(step) {
    const previousStepIndex = ConfigState.currentStep;
    ConfigState.currentStep = step;

    document.querySelectorAll('.wizard-step-content').forEach(el => {
        el.classList.remove('active');
    });
    const activeContent = document.querySelector(`.wizard-step-content[data-step="${step}"]`);
    if (activeContent) {
        activeContent.classList.add('active');

        // =====KI=====
        if (typeof gsap !== 'undefined') {
            const direction = step > previousStepIndex ? 1 : -1;
            gsap.fromTo(activeContent,
                { opacity: 0, x: direction * 40 },
                { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
            );
        }
        // ============
    }

    document.querySelectorAll('.wizard-step-dot').forEach(dot => {
        const dotStepIndex = parseInt(dot.dataset.step);
        dot.classList.remove('active', 'done');
        if (dotStepIndex === step) dot.classList.add('active');
        else if (dotStepIndex < step) dot.classList.add('done');
    });

    const lines = document.querySelectorAll('.wizard-step-line');
    lines.forEach((line, i) => {
        line.classList.toggle('done', i < step);
    });

    const prevBtn = document.getElementById('wizardPrev');
    const nextBtn = document.getElementById('wizardNext');
    if (prevBtn) prevBtn.disabled = step === 0;
    if (nextBtn) {
        if (step === ConfigState.totalSteps - 1) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = '';
        }
    }

    if (step === 5) {
        buildSummary();
    }

    if (ConfigState.babylonEngine) {
        setTimeout(() => ConfigState.babylonEngine.resize(), 50);
    }
}

function initConfigCategoryFilter() {
    const filter = document.getElementById('configCategoryFilter');
    if (!filter) return;

    filter.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filter.querySelector('.active')?.classList.remove('active');
            btn.classList.add('active');
            loadConfigProducts(btn.dataset.category);
        });
    });
}

function loadConfigProducts(category) {
    const grid = document.getElementById('configProductGrid');
    if (!grid) return;

    ConfigState.categorySlug = category;
    const productsForCategory = PLACEHOLDER_PRODUCTS.filter(product => product.category_slug === category);

    grid.innerHTML = productsForCategory
        .map(product => createProductCard(product))
        .join('');

    grid.querySelectorAll('.product-card[data-slug]').forEach(productCard => {
        const handleSelect = () => {
            const selectedProductSlug = productCard.dataset.slug;
            const selectedProduct = PLACEHOLDER_PRODUCTS.find(product => product.slug === selectedProductSlug);
            if (selectedProduct) {
                selectProduct(selectedProduct);
            }
        };

        productCard.addEventListener('click', handleSelect);
        productCard.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleSelect();
            }
        });
    });

    // =====KI=====
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(grid.querySelectorAll('.product-card'),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
        );
    }
    // ============
}

function selectProduct(product) {
    if (!product) return;

    ConfigState.product = product;
    ConfigState.basePrice = parseFloat(product.base_price);
    ConfigState.categorySlug = product.category_slug;
    ConfigState.categoryId = product.category_id;
    ConfigState.currentStep = 0;
    ConfigState.pricingMode = 'preset';

    ConfigState.selected = { type: null, material: null, size: null, shape: null, jewel: null };
    ConfigState.defaultSelections = { type: null, material: null, size: null, shape: null, jewel: null };

    document.getElementById('productSelection')?.classList.add('hidden');
    const pageHeader = document.querySelector('.page-header');
    if (pageHeader) pageHeader.style.display = 'none';
    document.getElementById('configuratorSection')?.classList.remove('hidden');
    document.getElementById('configProductName').textContent = product.name;
    document.getElementById('navbar')?.classList.add('hidden');
    document.querySelector('.footer')?.classList.add('hidden');

    loadOptions();

    goToStep(0);

    initBabylonScene();

    updatePrice();

    // =====KI=====
    if (typeof gsap !== 'undefined') {
        gsap.fromTo('#configuratorSection',
            { opacity: 0 },
            { opacity: 1, duration: 0.5, ease: 'power2.out' }
        );
    }
    // ============
}

function loadOptions() {
    const cat = ConfigState.categorySlug;
    const catOpts = PLACEHOLDER_OPTIONS[cat] || PLACEHOLDER_OPTIONS.ringe;

    ConfigState.options = {
        types: catOpts.types,
        materials: PLACEHOLDER_OPTIONS.materials,
        sizes: catOpts.sizes,
        shapes: catOpts.shapes,
        jewels: PLACEHOLDER_OPTIONS.jewels
    };

    ConfigState.defaultSelections = {
        type: ConfigState.options.types[0] || null,
        material: ConfigState.options.materials[0] || null,
        size: ConfigState.options.sizes[0] || null,
        shape: ConfigState.options.shapes[0] || null,
        jewel: ConfigState.options.jewels[0] || null
    };

    ConfigState.selected = { ...ConfigState.defaultSelections };

    renderOptions();
}

function renderOptions() {
    const opts = ConfigState.options;

    renderOptionGroup('configTypes', opts.types, 'type', (t) =>
        `${t.name}<span class="price-mod">${t.price_modifier > 0 ? '+' + formatPrice(t.price_modifier) : 'inkl.'}</span>`,
        ConfigState.selected.type?.id
    );

    renderOptionGroup('configMaterials', opts.materials, 'material', (m) =>
        `<div class="material-swatch"><span class="swatch-circle" data-color="${escapeHtml(m.color_hex)}"></span>${m.name}</div><span class="price-mod">${m.price_modifier > 0 ? '+' + formatPrice(m.price_modifier) : 'inkl.'}</span>`,
        ConfigState.selected.material?.id
    );
    applyMaterialSwatches();

    renderOptionGroup('configSizes', opts.sizes, 'size', (s) =>
        `${s.label}<span class="price-mod">${s.price_modifier > 0 ? '+' + formatPrice(s.price_modifier) : 'inkl.'}</span>`,
        ConfigState.selected.size?.id
    );

    renderOptionGroup('configShapes', opts.shapes, 'shape', (sh) =>
        `${sh.name}<span class="price-mod">${sh.price_modifier > 0 ? '+' + formatPrice(sh.price_modifier) : 'inkl.'}</span>`,
        ConfigState.selected.shape?.id
    );

    renderOptionGroup('configJewels', opts.jewels, 'jewel', (jewel) =>
        `${jewel.name}<span class="price-mod">+${formatPrice(jewel.price_modifier)}</span>`,
        ConfigState.selected.jewel?.id
    );
}

function applyMaterialSwatches() {
    document.querySelectorAll('#configMaterials .swatch-circle[data-color]').forEach(swatch => {
        swatch.style.backgroundColor = swatch.dataset.color;
    });
}

function renderOptionGroup(containerId, options, stateKey, renderFn, selectedId = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = options.map(opt => `
        <div class="config-option${selectedId !== null && Number(selectedId) === Number(opt.id) ? ' selected' : ''}" data-id="${opt.id}" data-key="${stateKey}">
            ${renderFn(opt)}
        </div>
    `).join('');

    container.querySelectorAll('.config-option').forEach(el => {
        el.addEventListener('click', () => {
            container.querySelectorAll('.config-option').forEach(s => s.classList.remove('selected'));
            el.classList.add('selected');

            const id = parseInt(el.dataset.id);
            ConfigState.selected[stateKey] = options.find(o => o.id === id);

            syncPricingMode();
            updatePrice();
            update3DModel();

            // =====KI=====
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(el, { scale: 0.95 }, { scale: 1, duration: 0.2, ease: 'back.out(2)' });
            }
            // ============
        });
    });
}

function updatePrice() {
    syncPricingMode();

    const selectedOptions = ConfigState.selected;
    let subtotal = ConfigState.basePrice;

    if (selectedOptions.type) subtotal += parseFloat(selectedOptions.type.price_modifier || 0);
    if (selectedOptions.material) subtotal += parseFloat(selectedOptions.material.price_modifier || 0);
    if (selectedOptions.size) subtotal += parseFloat(selectedOptions.size.price_modifier || 0);
    if (selectedOptions.shape) subtotal += parseFloat(selectedOptions.shape.price_modifier || 0);
    if (selectedOptions.jewel) subtotal += parseFloat(selectedOptions.jewel.price_modifier || 0);

    let total = subtotal;
    if (ConfigState.pricingMode === 'preset') {
        total = subtotal * 0.8;
    } else {
        total = subtotal + 200;
    }

    total = Math.round(total * 100) / 100;

    const formatted = formatPrice(total);

    const topPrice = document.getElementById('configTotalPrice');
    if (topPrice) {
        topPrice.textContent = formatted;
        if (typeof gsap !== 'undefined') {
            // =====KI=====
            gsap.fromTo(topPrice, { scale: 1.15, color: '#D4B85A' }, { scale: 1, color: '#C9A84C', duration: 0.4, ease: 'power2.out' });
            // ============
        }
    }

    const finalPrice = document.getElementById('configTotalPriceFinal');
    if (finalPrice) finalPrice.textContent = formatted;

    const breakdownEl = document.getElementById('configPriceBreakdown');
    if (breakdownEl) {
        const parts = [`Basis: ${formatPrice(ConfigState.basePrice)}`];
        if (selectedOptions.type?.price_modifier > 0) parts.push(`Art: +${formatPrice(selectedOptions.type.price_modifier)}`);
        if (selectedOptions.material?.price_modifier > 0) parts.push(`Material: +${formatPrice(selectedOptions.material.price_modifier)}`);
        if (selectedOptions.size?.price_modifier > 0) parts.push(`Größe: +${formatPrice(selectedOptions.size.price_modifier)}`);
        if (selectedOptions.shape?.price_modifier > 0) parts.push(`Form: +${formatPrice(selectedOptions.shape.price_modifier)}`);
        if (selectedOptions.jewel?.price_modifier > 0) parts.push(`Juwel: +${formatPrice(selectedOptions.jewel.price_modifier)}`);
        if (ConfigState.pricingMode === 'preset') {
            parts.push('Preset: -20%');
        } else {
            parts.push('Eigene Konfiguration: +200,00 €');
        }
        breakdownEl.textContent = parts.join(' | ');
    }

    return total;
}

function syncPricingMode() {
    const selected = ConfigState.selected;
    const defaults = ConfigState.defaultSelections;

    const isPreset = ['type', 'material', 'size', 'shape', 'jewel'].every(key => {
        const selectedId = selected[key]?.id ?? null;
        const defaultId = defaults[key]?.id ?? null;
        return selectedId === defaultId;
    });

    ConfigState.pricingMode = isPreset ? 'preset' : 'custom';
}

function buildSummary() {
    const el = document.getElementById('wizardSummary');
    if (!el) return;

    const selectedOptions = ConfigState.selected;
    const rows = [
        { label: 'Art', value: selectedOptions.type?.name || '—' },
        { label: 'Material', value: selectedOptions.material?.name || '—' },
        { label: 'Größe', value: selectedOptions.size?.label || '—' },
        { label: 'Form', value: selectedOptions.shape?.name || '—' },
        { label: 'Juwel', value: selectedOptions.jewel?.name || 'Keines' }
    ];

    el.innerHTML = rows.map(r => `
        <div class="wizard-summary-row">
            <span class="summary-label">${r.label}</span>
            <span class="summary-value">${r.value}</span>
        </div>
    `).join('');

    updatePrice();

    // =====KI=====
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(el.querySelectorAll('.wizard-summary-row'),
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.3, stagger: 0.06, ease: 'power2.out' }
        );
    }
    // ============
}

function initConfiguratorButtons() {
    document.getElementById('backToProducts')?.addEventListener('click', () => {
        document.getElementById('configuratorSection')?.classList.add('hidden');
        document.getElementById('productSelection')?.classList.remove('hidden');
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader) pageHeader.style.display = '';
        document.getElementById('navbar')?.classList.remove('hidden');
        document.querySelector('.footer')?.classList.remove('hidden');
        disposeBabylon();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.getElementById('btnAddToCart')?.addEventListener('click', () => {
        if (!ConfigState.product) return;
        if (!ConfigState.selected.type || !ConfigState.selected.material || !ConfigState.selected.size || !ConfigState.selected.shape) {
            showToast('Bitte wähle alle Optionen aus.', 'error');
            return;
        }

        const selectedOptions = ConfigState.selected;
        const totalPrice = updatePrice();

        const cartItem = {
            product_id: ConfigState.product.id,
            product_name: ConfigState.product.name,
            category_slug: ConfigState.categorySlug,
            base_price: ConfigState.basePrice,
            total_price: totalPrice,
            type_name: selectedOptions.type?.name,
            material_name: selectedOptions.material?.name,
            size_label: selectedOptions.size?.label,
            shape_name: selectedOptions.shape?.name,
            jewel_name: selectedOptions.jewel?.name,
            jewel_slug: selectedOptions.jewel?.slug
        };

        (async () => {
            const user = await getCurrentUser();
            if (!user) {
                showToast('Bitte melde dich an, um den Warenkorb zu nutzen.', 'error');
                setTimeout(() => window.location.href = 'login.html', 1200);
                return;
            }

            try {
                bumpCartBadge(1);
                await OreonAPI.addToCart(
                    cartItem.product_id,
                    null,
                    1,
                    {
                        category_slug: cartItem.category_slug,
                        type_name: cartItem.type_name,
                        material_name: cartItem.material_name,
                        size_label: cartItem.size_label,
                        shape_name: cartItem.shape_name,
                        jewel_name: cartItem.jewel_name,
                        jewel_slug: cartItem.jewel_slug
                    },
                    cartItem.total_price
                );
                showToast('In den Warenkorb gelegt!', 'success');
                updateCartBadge();
            } catch (err) {
                updateCartBadge();
                showToast(err?.error || 'Konnte nicht in den Warenkorb legen.', 'error');
            }
        })();

        // =====KI=====
        const btn = document.getElementById('btnAddToCart');
        if (btn && typeof gsap !== 'undefined') {
            gsap.timeline()
                .to(btn, { scale: 0.95, duration: 0.1 })
                .to(btn, { scale: 1.05, duration: 0.15, ease: 'back.out(3)' })
                .to(btn, { scale: 1, duration: 0.1 });
        }
        // ============
    });

    document.getElementById('btnSaveConfig')?.addEventListener('click', () => {
        if (!ConfigState.product) return;

        const selectedOptions = ConfigState.selected;
        const name = document.getElementById('configName')?.value.trim() || `${ConfigState.product.name} Konfiguration`;
        const totalPrice = updatePrice();

        const payload = {
            product_id: ConfigState.product.id,
            product_name: ConfigState.product.name,
            category_slug: ConfigState.categorySlug,
            base_price: ConfigState.basePrice,
            total_price: totalPrice,
            name: name,
            type_id: selectedOptions.type?.id,
            type_name: selectedOptions.type?.name,
            material_id: selectedOptions.material?.id,
            material_name: selectedOptions.material?.name,
            size_id: selectedOptions.size?.id,
            size_label: selectedOptions.size?.label,
            shape_id: selectedOptions.shape?.id,
            shape_name: selectedOptions.shape?.name,
            jewel_id: selectedOptions.jewel?.id,
            jewel_name: selectedOptions.jewel?.name
        };

        (async () => {
            const user = await getCurrentUser();
            if (!user) {
                showToast('Bitte melde dich an, um Konfigurationen zu speichern.', 'error');
                setTimeout(() => window.location.href = 'login.html', 1500);
                return;
            }

            try {
                await OreonAPI.saveConfiguration(payload);
                showToast('Konfiguration gespeichert!', 'success');
            } catch (err) {
                showToast(err?.error || 'Konfiguration speichern fehlgeschlagen.', 'error');
            }
        })();

        // =====KI=====
        const btn = document.getElementById('btnSaveConfig');
        if (btn && typeof gsap !== 'undefined') {
            gsap.timeline()
                .to(btn, { scale: 0.95, duration: 0.1 })
                .to(btn, { scale: 1.05, duration: 0.15, ease: 'back.out(3)' })
                .to(btn, { scale: 1, duration: 0.1 });
        }
        // ============
    });
}

async function loadSavedConfiguration(configId) {
    const user = await getCurrentUser();
    if (!user) {
        showToast('Bitte melde dich an, um Konfigurationen zu laden.', 'error');
        setTimeout(() => window.location.href = 'login.html', 1200);
        return;
    }

    let config = null;
    try {
        const data = await OreonAPI.getConfiguration(configId);
        config = data.configuration;
    } catch (err) {
        config = null;
    }

    if (!config) return;

    const product = PLACEHOLDER_PRODUCTS.find(productItem => productItem.id === config.product_id);
    if (!product) return;

    selectProduct(product);

    setTimeout(() => {
        if (config.type_id) selectOptionById('type', config.type_id);
        if (config.material_id) selectOptionById('material', config.material_id);
        if (config.size_id) selectOptionById('size', config.size_id);
        if (config.shape_id) selectOptionById('shape', config.shape_id);
        if (config.jewel_id) selectOptionById('jewel', config.jewel_id);
        if (config.name) {
            const nameInput = document.getElementById('configName');
            if (nameInput) nameInput.value = config.name;
        }
        updatePrice();
    }, 200);
}

function selectOptionById(stateKey, id) {
    const containerMap = {
        type: 'configTypes',
        material: 'configMaterials',
        size: 'configSizes',
        shape: 'configShapes',
        jewel: 'configJewels'
    };
    const container = document.getElementById(containerMap[stateKey]);
    if (!container) return;

    const el = container.querySelector(`[data-id="${id}"]`);
    if (el) el.click();
}

// ========== KI GENERIERT: Babylon.js 3D Scene ==========
function initBabylonScene() {
    const canvas = document.getElementById('babylon-canvas');
    if (!canvas || typeof BABYLON === 'undefined') return;

    // Dispose existing
    disposeBabylon();

    const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    ConfigState.babylonEngine = engine;

    const scene = new BABYLON.Scene(engine);
    ConfigState.babylonScene = scene;

    // Background
    scene.clearColor = new BABYLON.Color4(0.04, 0.08, 0.05, 1); // dark green-ish

    // Camera
    const camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, Math.PI / 2.35, 5.4, new BABYLON.Vector3(0, 0.15, 0), scene);
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 3.2;
    camera.upperRadiusLimit = 9;
    camera.wheelDeltaPercentage = 0.01;
    camera.panningSensibility = 0;
    camera.useAutoRotationBehavior = false;

    // Lighting
    const hemiLight = new BABYLON.HemisphericLight('hemiLight', new BABYLON.Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.55;
    hemiLight.diffuse = new BABYLON.Color3(1, 0.97, 0.9);

    const dirLight = new BABYLON.DirectionalLight('dirLight', new BABYLON.Vector3(-0.6, -1, -0.35), scene);
    dirLight.intensity = 1.05;
    dirLight.position = new BABYLON.Vector3(4, 8, 3);

    const pointLight = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(2.8, 2.6, -1.2), scene);
    pointLight.intensity = 0.65;
    pointLight.diffuse = new BABYLON.Color3(1, 0.92, 0.8);

    const rimLight = new BABYLON.PointLight('rimLight', new BABYLON.Vector3(-2.8, 1.8, 2.8), scene);
    rimLight.intensity = 0.35;
    rimLight.diffuse = new BABYLON.Color3(0.8, 0.95, 1);

    // Environment
    const envTexture = BABYLON.CubeTexture.CreateFromPrefilteredData('https://assets.babylonjs.com/environments/environmentSpecular.env', scene);
    scene.environmentTexture = envTexture;

    // Create initial mesh
    createJewelryMesh(scene);

    // Render loop
    engine.runRenderLoop(() => scene.render());

    // Resize
    window.addEventListener('resize', () => engine.resize());

    // =====KI=====
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(canvas, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' });
    }
    // ============
}

function createJewelryMesh(scene) {
    // Remove existing meshes
    Object.values(ConfigState.meshes).forEach(mesh => mesh.dispose());
    ConfigState.meshes = {};

    const isRing = ConfigState.categorySlug === 'ringe';

    if (isRing) {
        createRingMesh(scene);
    } else {
        createBraceletMesh(scene);
    }
}

function createRingMesh(scene) {
    // Create a torus (ring)
    const shapeSlug = ConfigState.selected.shape?.slug || 'klassisch';

    let ring;
    const ringDiameter = 3;
    let ringThickness = 0.45;
    switch (shapeSlug) {
        case 'flach':
            ring = BABYLON.MeshBuilder.CreateTorus('ring', {
                diameter: ringDiameter, thickness: 0.42, tessellation: 96
            }, scene);
            ringThickness = 0.42;
            ring.scaling.y = 0.5;
            break;
        case 'gewoelbt':
            ring = BABYLON.MeshBuilder.CreateTorus('ring', {
                diameter: ringDiameter, thickness: 0.52, tessellation: 96
            }, scene);
            ringThickness = 0.52;
            break;
        case 'twisted':
            ring = createTwistedRing(scene);
            ringThickness = 0.4;
            break;
        case 'hexagonal':
            ring = BABYLON.MeshBuilder.CreateTorus('ring', {
                diameter: ringDiameter, thickness: 0.4, tessellation: 12
            }, scene);
            ringThickness = 0.4;
            break;
        default: // klassisch
            ring = BABYLON.MeshBuilder.CreateTorus('ring', {
                diameter: ringDiameter, thickness: ringThickness, tessellation: 96
            }, scene);
    }

    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.05;

    // Apply material
    const mat = createMetalMaterial(scene);
    ring.material = mat;
    ConfigState.meshes.main = ring;

    const selectedJewel = ConfigState.selected.jewel;
    if (selectedJewel) {
        const jewelPack = createJewelAssembly(scene, selectedJewel, ringDiameter, ringThickness, mat);
        ConfigState.meshes.jewelAssembly = jewelPack.root;
        ConfigState.meshes.gemSeat = jewelPack.seat;
        ConfigState.meshes.gem = jewelPack.gem;
        jewelPack.prongs.forEach((prong, index) => {
            ConfigState.meshes[`prong_${index}`] = prong;
        });
    }
}

function createJewelAssembly(scene, selectedJewel, ringDiameter, ringThickness, metalMaterial) {
    const seatHeight = ringDiameter * 0.5 + 0.28;
    const root = new BABYLON.TransformNode('jewelAssembly', scene);

    const seat = BABYLON.MeshBuilder.CreateCylinder('gemSeat', {
        diameterTop: ringThickness * 1.08,
        diameterBottom: ringThickness * 1.28,
        height: 0.22,
        tessellation: 64
    }, scene);
    seat.position.y = seatHeight;
    seat.material = metalMaterial;
    seat.parent = root;

    const gem = createJewelMesh(scene, selectedJewel, seatHeight + 0.15);
    gem.parent = root;

    const gemMat = createGemMaterial(scene, 'gemMat', selectedJewel.color_hex);
    gem.material = gemMat;

    const prongs = [];
    for (let i = 0; i < 4; i++) {
        const prongAngle = (i / 4) * Math.PI * 2;
        const prong = BABYLON.MeshBuilder.CreateCylinder(`prong_${i}`, {
            diameter: 0.045,
            height: 0.34,
            tessellation: 18
        }, scene);
        prong.position.x = Math.cos(prongAngle) * 0.18;
        prong.position.z = Math.sin(prongAngle) * 0.18;
        prong.position.y = seatHeight + 0.14;
        prong.rotation.z = Math.PI / 2;
        prong.material = metalMaterial;
        prong.parent = root;
        prongs.push(prong);
    }

    return { root, seat, gem, prongs };
}

function createJewelMesh(scene, selectedJewel, yPosition) {
    const jewelSlug = selectedJewel?.slug || 'diamant';
    let gem;

    switch (jewelSlug) {
        case 'diamant':
            gem = BABYLON.MeshBuilder.CreatePolyhedron('gem', {
                type: 1,
                size: 0.24,
                updatable: false
            }, scene);
            gem.scaling = new BABYLON.Vector3(1, 1.18, 1);
            gem.rotation.y = Math.PI / 5;
            break;
        case 'saphir':
            gem = BABYLON.MeshBuilder.CreateIcoSphere('gem', {
                radius: 0.26,
                subdivisions: 4
            }, scene);
            gem.scaling = new BABYLON.Vector3(1.15, 0.92, 1.05);
            gem.rotation.x = Math.PI / 9;
            gem.rotation.y = Math.PI / 7;
            break;
        case 'rubin':
            gem = BABYLON.MeshBuilder.CreatePolyhedron('gem', {
                type: 2,
                size: 0.255,
                updatable: false
            }, scene);
            gem.scaling = new BABYLON.Vector3(1.15, 0.95, 1.1);
            gem.rotation.y = Math.PI / 4;
            break;
        case 'smaragd':
            gem = BABYLON.MeshBuilder.CreateBox('gem', {
                size: 0.42,
                faceColors: new Array(6).fill(null)
            }, scene);
            gem.scaling = new BABYLON.Vector3(1.0, 0.68, 0.78);
            gem.rotation.y = Math.PI / 4;
            gem.rotation.z = Math.PI / 18;
            break;
        case 'aquamarin':
            gem = BABYLON.MeshBuilder.CreateCylinder('gem', {
                diameterTop: 0.12,
                diameterBottom: 0.42,
                height: 0.34,
                tessellation: 10
            }, scene);
            gem.scaling = new BABYLON.Vector3(1.1, 1, 1.05);
            gem.rotation.x = Math.PI / 2;
            gem.rotation.z = Math.PI / 10;
            break;
        case 'perle':
            gem = BABYLON.MeshBuilder.CreateSphere('gem', {
                diameter: 0.34,
                segments: 32
            }, scene);
            gem.scaling = new BABYLON.Vector3(1.0, 0.96, 1.0);
            break;
        case 'jade':
            gem = BABYLON.MeshBuilder.CreatePolyhedron('gem', {
                type: 7,
                size: 0.24,
                updatable: false
            }, scene);
            gem.scaling = new BABYLON.Vector3(1.1, 1.05, 1.1);
            gem.rotation.y = Math.PI / 6;
            gem.rotation.x = Math.PI / 14;
            break;
        case 'tansanit':
            gem = BABYLON.MeshBuilder.CreateCylinder('gem', {
                diameterTop: 0.18,
                diameterBottom: 0.34,
                height: 0.4,
                tessellation: 6
            }, scene);
            gem.scaling = new BABYLON.Vector3(1.0, 1.0, 1.0);
            gem.rotation.x = Math.PI / 2;
            gem.rotation.y = Math.PI / 6;
            break;
        case 'alexandrit':
            gem = BABYLON.MeshBuilder.CreatePolyhedron('gem', {
                type: 6,
                size: 0.23,
                updatable: false
            }, scene);
            gem.scaling = new BABYLON.Vector3(1.12, 1.02, 1.08);
            gem.rotation.y = Math.PI / 8;
            break;
        case 'opal':
            gem = BABYLON.MeshBuilder.CreateSphere('gem', {
                diameter: 0.35,
                segments: 20
            }, scene);
            gem.scaling = new BABYLON.Vector3(1.0, 1.05, 0.94);
            gem.rotation.y = Math.PI / 12;
            break;
        case 'paraiba-turmalin':
            gem = BABYLON.MeshBuilder.CreateCylinder('gem', {
                diameterTop: 0.16,
                diameterBottom: 0.3,
                height: 0.46,
                tessellation: 8
            }, scene);
            gem.rotation.x = Math.PI / 2;
            gem.rotation.y = Math.PI / 7;
            break;
        default:
            gem = BABYLON.MeshBuilder.CreatePolyhedron('gem', {
                type: 1,
                size: 0.24,
                updatable: false
            }, scene);
            gem.scaling = new BABYLON.Vector3(1, 1.18, 1);
            break;
    }

    gem.position.y = yPosition;
    gem.position.x = 0;
    gem.position.z = 0;
    gem.rotation.z = gem.rotation.z || 0;

    const sparkle = gem.getChildMeshes?.() || [];
    sparkle.forEach(child => {
        child.isVisible = true;
    });

    return gem;
}

function createTwistedRing(scene) {
    const path = [];
    const twists = 3;
    const segments = 120;
    const radius = 1.5;
    const tubeRadius = 0.2;

    for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        const y = Math.sin(angle * twists) * 0.15;
        path.push(new BABYLON.Vector3(x, y, z));
    }

    const tube = BABYLON.MeshBuilder.CreateTube('ring', {
        path: path,
        radius: tubeRadius,
        tessellation: 32,
        cap: BABYLON.Mesh.NO_CAP
    }, scene);

    return tube;
}

function createBraceletMesh(scene) {
    const shapeSlug = ConfigState.selected.shape?.slug || 'rund';

    let bracelet;
    switch (shapeSlug) {
        case 'flach':
            bracelet = BABYLON.MeshBuilder.CreateTorus('bracelet', {
                diameter: 4, thickness: 0.3, tessellation: 64
            }, scene);
            bracelet.scaling.y = 0.35;
            break;
        case 'oval':
            bracelet = BABYLON.MeshBuilder.CreateTorus('bracelet', {
                diameter: 4, thickness: 0.35, tessellation: 64
            }, scene);
            bracelet.scaling.x = 1.3;
            bracelet.scaling.z = 0.85;
            break;
        case 'eckig':
            bracelet = BABYLON.MeshBuilder.CreateTorus('bracelet', {
                diameter: 4, thickness: 0.3, tessellation: 4
            }, scene);
            break;
        default: // rund
            bracelet = BABYLON.MeshBuilder.CreateTorus('bracelet', {
                diameter: 4, thickness: 0.35, tessellation: 64
            }, scene);
    }

    const mat = createMetalMaterial(scene);
    bracelet.material = mat;
    ConfigState.meshes.main = bracelet;

    // Add chain links for Glieder/Tennis/Panzer
    const typeSlug = ConfigState.selected.type?.slug;
    if (typeSlug === 'tennis') {
        addGems(scene, 20, 2);
    }

}

function addGems(scene, count, radius) {
    const selectedJewel = ConfigState.selected.jewel;
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const gem = BABYLON.MeshBuilder.CreatePolyhedron(`gem_${i}`, { type: 1, size: 0.12 }, scene);
        gem.position.x = radius * Math.cos(angle);
        gem.position.z = radius * Math.sin(angle);
        gem.position.y = 0.08;
        gem.rotation.y = angle;
        gem.rotation.x = Math.PI / 8;
        gem.scaling = new BABYLON.Vector3(1.08, 0.9, 1.08);

        const gemMat = createGemMaterial(scene, `gemMat_${i}`, selectedJewel?.color_hex);
        gem.material = gemMat;

        ConfigState.meshes[`gem_${i}`] = gem;
    }
}

function createMetalMaterial(scene) {
    const mat = new BABYLON.PBRMaterial('metalMat', scene);
    const selected = ConfigState.selected.material;

    if (selected) {
        const hex = selected.color_hex;
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        mat.albedoColor = new BABYLON.Color3(r, g, b);
    } else {
        mat.albedoColor = new BABYLON.Color3(0.75, 0.75, 0.75); // default silver
    }

    mat.metallic = 1;
    mat.roughness = 0.08;
    mat.environmentIntensity = 1.35;
    mat.reflectivityColor = new BABYLON.Color3(0.95, 0.95, 0.95);
    mat.microSurface = 0.96;
    mat.clearCoat.isEnabled = true;
    mat.clearCoat.intensity = 0.35;
    mat.clearCoat.roughness = 0.12;

    return mat;
}

function createGemMaterial(scene, materialName = 'gemMat', colorHex = '#f5f9ff') {
    const gemMat = new BABYLON.PBRMaterial(materialName, scene);
    const color = hexToColor3(colorHex);
    gemMat.albedoColor = color.scale(0.08);
    gemMat.metallic = 0;
    gemMat.roughness = 0;
    gemMat.indexOfRefraction = 2.42;
    gemMat.alpha = 0.96;
    gemMat.microSurface = 1;
    gemMat.environmentIntensity = 2.2;
    gemMat.reflectivityColor = new BABYLON.Color3(1, 1, 1);
    gemMat.subSurface.isRefractionEnabled = true;
    gemMat.subSurface.isTranslucencyEnabled = true;
    gemMat.subSurface.tintColor = color.scale(0.9);
    gemMat.subSurface.tintColorAtDistance = 0.35;
    gemMat.subSurface.volumeIndexOfRefraction = 2.42;
    gemMat.subSurface.minimumThickness = 0.08;
    gemMat.subSurface.maximumThickness = 0.28;
    gemMat.clearCoat.isEnabled = true;
    gemMat.clearCoat.intensity = 1;
    gemMat.clearCoat.roughness = 0.02;

    return gemMat;
}

function hexToColor3(hex) {
    if (!hex || typeof hex !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(hex)) {
        return new BABYLON.Color3(0.92, 0.97, 1);
    }

    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return new BABYLON.Color3(r, g, b);
}

function update3DModel() {
    if (!ConfigState.babylonScene) return;
    createJewelryMesh(ConfigState.babylonScene);
}

function disposeBabylon() {
    if (ConfigState.babylonEngine) {
        ConfigState.babylonEngine.dispose();
        ConfigState.babylonEngine = null;
        ConfigState.babylonScene = null;
        ConfigState.meshes = {};
    }
}
