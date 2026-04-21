const ConfigState = {
    product: null,
    categoryId: null,
    categorySlug: 'ringe',
    options: { types: [], materials: [], sizes: [], shapes: [], engravings: [] },
    selected: {
        type: null,
        material: null,
        size: null,
        shape: null,
        engraving: null,
        engravingText: ''
    },
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
            { id: 1, name: 'Solitär', slug: 'solitaer', price_modifier: 50 },
            { id: 2, name: 'Ehering', slug: 'ehering', price_modifier: 0 },
            { id: 3, name: 'Verlobungsring', slug: 'verlobungsring', price_modifier: 75 },
            { id: 4, name: 'Statement-Ring', slug: 'statement', price_modifier: 40 },
            { id: 5, name: 'Siegelring', slug: 'siegelring', price_modifier: 35 }
        ],
        sizes: [
            { id: 1, label: '48 (15.3mm)', value: '48', price_modifier: 0 },
            { id: 2, label: '50 (15.9mm)', value: '50', price_modifier: 0 },
            { id: 3, label: '52 (16.6mm)', value: '52', price_modifier: 0 },
            { id: 4, label: '54 (17.2mm)', value: '54', price_modifier: 0 },
            { id: 5, label: '56 (17.8mm)', value: '56', price_modifier: 0 },
            { id: 6, label: '58 (18.5mm)', value: '58', price_modifier: 0 },
            { id: 7, label: '60 (19.1mm)', value: '60', price_modifier: 0 },
            { id: 8, label: '62 (19.7mm)', value: '62', price_modifier: 5 },
            { id: 9, label: '64 (20.4mm)', value: '64', price_modifier: 5 },
            { id: 10, label: '66 (21.0mm)', value: '66', price_modifier: 10 }
        ],
        shapes: [
            { id: 1, name: 'Klassisch rund', slug: 'klassisch', price_modifier: 0 },
            { id: 2, name: 'Flach', slug: 'flach', price_modifier: 0 },
            { id: 3, name: 'Gewölbt', slug: 'gewoelbt', price_modifier: 10 },
            { id: 4, name: 'Twisted', slug: 'twisted', price_modifier: 25 },
            { id: 5, name: 'Hexagonal', slug: 'hexagonal', price_modifier: 30 }
        ]
    },
    armbaender: {
        types: [
            { id: 6, name: 'Armreif', slug: 'armreif', price_modifier: 20 },
            { id: 7, name: 'Gliederarmband', slug: 'glieder', price_modifier: 30 },
            { id: 8, name: 'Tennisarmband', slug: 'tennis', price_modifier: 60 },
            { id: 9, name: 'Panzerarmband', slug: 'panzer', price_modifier: 25 },
            { id: 10, name: 'Charm-Armband', slug: 'charm', price_modifier: 15 }
        ],
        sizes: [
            { id: 11, label: 'S (16cm)', value: 'S', price_modifier: 0 },
            { id: 12, label: 'M (18cm)', value: 'M', price_modifier: 0 },
            { id: 13, label: 'L (20cm)', value: 'L', price_modifier: 5 },
            { id: 14, label: 'XL (22cm)', value: 'XL', price_modifier: 10 }
        ],
        shapes: [
            { id: 6, name: 'Rund', slug: 'rund', price_modifier: 0 },
            { id: 7, name: 'Flach', slug: 'flach', price_modifier: 0 },
            { id: 8, name: 'Oval', slug: 'oval', price_modifier: 10 },
            { id: 9, name: 'Eckig', slug: 'eckig', price_modifier: 15 }
        ]
    },
    materials: [
        { id: 1, name: '925er Silber', slug: 'silber', price_modifier: 0, color_hex: '#C0C0C0' },
        { id: 2, name: '750er Gelbgold', slug: 'gelbgold', price_modifier: 120, color_hex: '#FFD700' },
        { id: 3, name: '750er Roségold', slug: 'rosegold', price_modifier: 130, color_hex: '#B76E79' },
        { id: 4, name: '750er Weißgold', slug: 'weissgold', price_modifier: 125, color_hex: '#E8E8E8' },
        { id: 5, name: 'Platin 950', slug: 'platin', price_modifier: 250, color_hex: '#E5E4E2' },
        { id: 6, name: 'Titan', slug: 'titan', price_modifier: 30, color_hex: '#878681' }
    ],
    engravings: [
        { id: 1, name: 'Einfache Gravur', max_chars: 20, price_per_char: 2.50, base_price: 15 },
        { id: 2, name: 'Schreibschrift', max_chars: 15, price_per_char: 3.50, base_price: 20 },
        { id: 3, name: 'Symbolgravur', max_chars: 5, price_per_char: 5.00, base_price: 25 }
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

    const categoryIcon = category === 'ringe' ? 'fa-ring' : 'fa-circle-notch';
    grid.innerHTML = productsForCategory
        .map(product => {
            return `
                <div class="product-card" data-product-slug="${escapeHtml(product.slug)}">
                    <div class="product-card-img">
                        <span class="placeholder-icon"><i class="fas ${categoryIcon}"></i></span>
                    </div>
                    <div class="product-card-body">
                        <div class="product-card-category">${escapeHtml(product.category_name)}</div>
                        <h3 class="product-card-title">${escapeHtml(product.name)}</h3>
                        <p class="product-card-desc">${escapeHtml(product.description)}</p>
                        <div class="product-card-footer">
                            <span class="product-price"><small>ab</small><span class="product-price-value">${formatPrice(product.base_price)}</span></span>
                            <span class="btn btn-secondary btn-sm">Auswählen</span>
                        </div>
                    </div>
                </div>
            `;
        })
        .join('');

    grid.querySelectorAll('.product-card').forEach(productCard => {
        productCard.addEventListener('click', () => {
            const selectedProductSlug = productCard.dataset.productSlug;
            const selectedProduct = PLACEHOLDER_PRODUCTS.find(product => product.slug === selectedProductSlug);
            if (selectedProduct) {
                selectProduct(selectedProduct);
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

    ConfigState.selected = { type: null, material: null, size: null, shape: null, engraving: null, engravingText: '' };

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
        engravings: PLACEHOLDER_OPTIONS.engravings
    };

    renderOptions();
}

function renderOptions() {
    const opts = ConfigState.options;

    renderOptionGroup('configTypes', opts.types, 'type', (t) =>
        `${t.name}<span class="price-mod">${t.price_modifier > 0 ? '+' + formatPrice(t.price_modifier) : 'inkl.'}</span>`
    );

    renderOptionGroup('configMaterials', opts.materials, 'material', (m) =>
        `<div class="material-swatch"><span class="swatch-circle" data-color="${escapeHtml(m.color_hex)}"></span>${m.name}</div><span class="price-mod">${m.price_modifier > 0 ? '+' + formatPrice(m.price_modifier) : 'inkl.'}</span>`
    );
    applyMaterialSwatches();

    renderOptionGroup('configSizes', opts.sizes, 'size', (s) =>
        `${s.label}<span class="price-mod">${s.price_modifier > 0 ? '+' + formatPrice(s.price_modifier) : 'inkl.'}</span>`
    );

    renderOptionGroup('configShapes', opts.shapes, 'shape', (sh) =>
        `${sh.name}<span class="price-mod">${sh.price_modifier > 0 ? '+' + formatPrice(sh.price_modifier) : 'inkl.'}</span>`
    );

    renderOptionGroup('configEngravings', opts.engravings, 'engraving', (engraving) =>
        `${engraving.name}<span class="price-mod">ab ${formatPrice(engraving.base_price)}</span>`
    );

    const engInput = document.getElementById('engravingText');
    if (engInput) {
        engInput.addEventListener('input', () => {
            ConfigState.selected.engravingText = engInput.value;
            updateCharCount();
            updatePrice();
        });
    }
}

function applyMaterialSwatches() {
    document.querySelectorAll('#configMaterials .swatch-circle[data-color]').forEach(swatch => {
        swatch.style.backgroundColor = swatch.dataset.color;
    });
}

function renderOptionGroup(containerId, options, stateKey, renderFn) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = options.map(opt => `
        <div class="config-option" data-id="${opt.id}" data-key="${stateKey}">
            ${renderFn(opt)}
        </div>
    `).join('');

    container.querySelectorAll('.config-option').forEach(el => {
        el.addEventListener('click', () => {
            container.querySelectorAll('.config-option').forEach(s => s.classList.remove('selected'));
            el.classList.add('selected');

            const id = parseInt(el.dataset.id);
            ConfigState.selected[stateKey] = options.find(o => o.id === id);

            if (stateKey === 'engraving') {
                const engInput = document.getElementById('engravingText');
                if (engInput) {
                    engInput.disabled = false;
                    engInput.maxLength = ConfigState.selected.engraving.max_chars;
                    engInput.focus();
                    updateCharCount();
                }
            }

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

function updateCharCount() {
    const engInput = document.getElementById('engravingText');
    const countEl = document.getElementById('engravingCharCount');
    const eng = ConfigState.selected.engraving;
    if (engInput && countEl && eng) {
        countEl.textContent = `${engInput.value.length}/${eng.max_chars} Zeichen`;
    }
}

function updatePrice() {
    const selectedOptions = ConfigState.selected;
    let total = ConfigState.basePrice;

    if (selectedOptions.type) total += parseFloat(selectedOptions.type.price_modifier || 0);
    if (selectedOptions.material) total += parseFloat(selectedOptions.material.price_modifier || 0);
    if (selectedOptions.size) total += parseFloat(selectedOptions.size.price_modifier || 0);
    if (selectedOptions.shape) total += parseFloat(selectedOptions.shape.price_modifier || 0);

    if (selectedOptions.engraving && selectedOptions.engravingText) {
        total += parseFloat(selectedOptions.engraving.base_price || 0);
        total += selectedOptions.engravingText.length * parseFloat(selectedOptions.engraving.price_per_char || 0);
    }

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
        if (selectedOptions.engraving && selectedOptions.engravingText) {
            const engPrice = parseFloat(selectedOptions.engraving.base_price) + selectedOptions.engravingText.length * parseFloat(selectedOptions.engraving.price_per_char);
            parts.push(`Gravur: +${formatPrice(engPrice)}`);
        }
        breakdownEl.textContent = parts.join(' | ');
    }

    return total;
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
        {
            label: 'Gravur',
            value: selectedOptions.engraving
                ? `${selectedOptions.engraving.name}${selectedOptions.engravingText ? ': "' + escapeHtml(selectedOptions.engravingText) + '"' : ''}`
                : 'Keine'
        }
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
            engraving_text: selectedOptions.engravingText
        };

        if (LocalStore.isLoggedIn() && typeof OreonAPI !== 'undefined') {
            (async () => {
                try {
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
                            engraving_text: cartItem.engraving_text
                        },
                        cartItem.total_price
                    );
                    showToast('In den Warenkorb gelegt!', 'success');
                    updateCartBadge();
                } catch (err) {
                    LocalStore.addToCart(cartItem);
                    showToast('In den Warenkorb gelegt!', 'success');
                }
            })();
        } else {
            LocalStore.addToCart(cartItem);
            showToast('In den Warenkorb gelegt!', 'success');
        }

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
        if (!LocalStore.isLoggedIn()) {
            showToast('Bitte melde dich an, um Konfigurationen zu speichern.', 'error');
            setTimeout(() => window.location.href = 'login.html', 1500);
            return;
        }

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
            engraving_id: selectedOptions.engraving?.id,
            engraving_name: selectedOptions.engraving?.name,
            engraving_text: selectedOptions.engravingText
        };

        if (typeof OreonAPI !== 'undefined') {
            (async () => {
                try {
                    await OreonAPI.saveConfiguration(payload);
                    showToast('Konfiguration gespeichert!', 'success');
                } catch (err) {
                    LocalStore.saveConfiguration(payload);
                    showToast('Konfiguration gespeichert!', 'success');
                }
            })();
        } else {
            LocalStore.saveConfiguration(payload);
            showToast('Konfiguration gespeichert!', 'success');
        }

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
    let config = null;

    if (LocalStore.isLoggedIn() && typeof OreonAPI !== 'undefined') {
        try {
            const data = await OreonAPI.getConfiguration(configId);
            config = data.configuration;
        } catch (err) {
            config = null;
        }
    }

    if (!config) {
        const configs = LocalStore.getConfigurations();
        config = configs.find(c => c.id === configId);
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
        if (config.engraving_id) {
            selectOptionById('engraving', config.engraving_id);
            const engInput = document.getElementById('engravingText');
            if (engInput && config.engraving_text) {
                engInput.value = config.engraving_text;
                engInput.disabled = false;
                ConfigState.selected.engravingText = config.engraving_text;
                updateCharCount();
            }
        }
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
        engraving: 'configEngravings'
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
    const camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, Math.PI / 2.5, 6, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 3;
    camera.upperRadiusLimit = 12;
    camera.wheelDeltaPercentage = 0.01;
    camera.panningSensibility = 0; // disable panning

    // Auto rotate
    scene.registerBeforeRender(() => {
        if (!scene.activeCamera) return;
        camera.alpha += 0.003;
    });

    // Lighting
    const hemiLight = new BABYLON.HemisphericLight('hemiLight', new BABYLON.Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.6;
    hemiLight.diffuse = new BABYLON.Color3(1, 0.95, 0.85);

    const dirLight = new BABYLON.DirectionalLight('dirLight', new BABYLON.Vector3(-1, -2, -1), scene);
    dirLight.intensity = 0.8;
    dirLight.position = new BABYLON.Vector3(5, 10, 5);

    const pointLight = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(2, 3, 2), scene);
    pointLight.intensity = 0.4;
    pointLight.diffuse = new BABYLON.Color3(1, 0.9, 0.7);

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
    switch (shapeSlug) {
        case 'flach':
            ring = BABYLON.MeshBuilder.CreateTorus('ring', {
                diameter: 3, thickness: 0.4, tessellation: 64
            }, scene);
            // Flatten
            ring.scaling.y = 0.5;
            break;
        case 'gewoelbt':
            ring = BABYLON.MeshBuilder.CreateTorus('ring', {
                diameter: 3, thickness: 0.5, tessellation: 64
            }, scene);
            break;
        case 'twisted':
            // Create twisted ring using path/ribbon
            ring = createTwistedRing(scene);
            break;
        case 'hexagonal':
            ring = BABYLON.MeshBuilder.CreateTorus('ring', {
                diameter: 3, thickness: 0.4, tessellation: 6
            }, scene);
            break;
        default: // klassisch
            ring = BABYLON.MeshBuilder.CreateTorus('ring', {
                diameter: 3, thickness: 0.45, tessellation: 64
            }, scene);
    }

    // Apply material
    const mat = createMetalMaterial(scene);
    ring.material = mat;
    ConfigState.meshes.main = ring;

    // Add gem for Solitär/Verlobungsring
    const typeSlug = ConfigState.selected.type?.slug;
    if (typeSlug === 'solitaer' || typeSlug === 'verlobungsring') {
        const gem = BABYLON.MeshBuilder.CreateIcoSphere('gem', { radius: 0.25, subdivisions: 3 }, scene);
        gem.position.y = 1.6;
        const gemMat = new BABYLON.PBRMaterial('gemMat', scene);
        gemMat.albedoColor = new BABYLON.Color3(0.9, 0.9, 1);
        gemMat.metallic = 0.1;
        gemMat.roughness = 0.05;
        gemMat.indexOfRefraction = 2.42; // Diamond
        gemMat.alpha = 0.85;
        gemMat.subSurface.isRefractionEnabled = true;
        gem.material = gemMat;
        ConfigState.meshes.gem = gem;
    }

    // Platform
    createPlatform(scene);
}

function createTwistedRing(scene) {
    // Create a twisted path
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

    createPlatform(scene);
}

function addGems(scene, count, radius) {
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const gem = BABYLON.MeshBuilder.CreateIcoSphere(`gem_${i}`, { radius: 0.1, subdivisions: 2 }, scene);
        gem.position.x = radius * Math.cos(angle);
        gem.position.z = radius * Math.sin(angle);
        gem.position.y = 0;

        const gemMat = new BABYLON.PBRMaterial(`gemMat_${i}`, scene);
        gemMat.albedoColor = new BABYLON.Color3(0.95, 0.95, 1);
        gemMat.metallic = 0.1;
        gemMat.roughness = 0.05;
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

    mat.metallic = 0.95;
    mat.roughness = 0.15;
    mat.environmentIntensity = 1.2;

    return mat;
}

function createPlatform(scene) {
    const platform = BABYLON.MeshBuilder.CreateCylinder('platform', {
        diameter: 5, height: 0.1, tessellation: 64
    }, scene);
    platform.position.y = -1.2;
    const platMat = new BABYLON.PBRMaterial('platMat', scene);
    platMat.albedoColor = new BABYLON.Color3(0.08, 0.12, 0.08); // dark green
    platMat.metallic = 0.3;
    platMat.roughness = 0.7;
    platform.material = platMat;
    ConfigState.meshes.platform = platform;
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
