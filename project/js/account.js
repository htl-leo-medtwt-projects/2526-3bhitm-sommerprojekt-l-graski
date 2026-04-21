document.addEventListener('DOMContentLoaded', () => {
    if (!LocalStore.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    initAccountNav();
    loadConfigurations();
    loadOrders();
    loadProfile();
    initDeleteAccount();

    if (window.location.hash === '#orders') {
        switchSection('orders');
    }
});

function initDeleteAccount() {
    const btn = document.getElementById('deleteAccountBtn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        const ok = confirm('Möchtest du deinen Account wirklich endgültig löschen? Diese Aktion kann nicht rückgängig gemacht werden.');
        if (!ok) return;

        try {
            if (typeof OreonAPI !== 'undefined') {
                await OreonAPI.deleteAccount();
            }
        } catch (err) {
            showToast(err?.error || 'Account löschen fehlgeschlagen', 'error');
            return;
        }

        LocalStore.clearUser();
        LocalStore.clearCart();
        showToast('Account gelöscht', 'success');
        setTimeout(() => window.location.href = 'index.html', 600);
    });
}

function initAccountNav() {
    document.querySelectorAll('.account-nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            if (section === 'logout') {
                (async () => {
                    try {
                        if (typeof OreonAPI !== 'undefined') {
                            await OreonAPI.logout();
                        }
                    } catch (err) {
                    } finally {
                        LocalStore.clearUser();
                        showToast('Abgemeldet', 'info');
                        setTimeout(() => window.location.href = 'index.html', 500);
                    }
                })();
                return;
            }
            switchSection(section);
        });
    });
}

function switchSection(section) {
    document.querySelectorAll('.account-nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`.account-nav-item[data-section="${section}"]`)?.classList.add('active');

    ['configurations', 'orders', 'profile'].forEach(s => {
        const el = document.getElementById(`section-${s}`);
        if (el) {
            el.classList.toggle('hidden', s !== section);
        }
    });

    // =====KI=====
    const activeSection = document.getElementById(`section-${section}`);
    if (activeSection && typeof gsap !== 'undefined') {
        gsap.fromTo(activeSection, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
    }
    // ============
}

async function loadConfigurations() {
    const list = document.getElementById('configList');
    if (!list) return;

    let configs = [];
    if (LocalStore.isLoggedIn() && typeof OreonAPI !== 'undefined') {
        try {
            const data = await OreonAPI.getConfigurations();
            configs = data.configurations || [];
        } catch (err) {
            configs = LocalStore.getConfigurations();
        }
    } else {
        configs = LocalStore.getConfigurations();
    }

    if (configs.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚙️</div>
                <h2>Keine Konfigurationen</h2>
                <p>Gestalte dein erstes Schmuckstück im Konfigurator.</p>
                <a href="configurator.html" class="btn btn-primary">Zum Konfigurator</a>
            </div>
        `;
        return;
    }

    list.innerHTML = configs.map(config => {
        const icon = config.category_slug === 'ringe' ? '💍' : '⌚';
        const details = [config.type_name, config.material_name, config.size_label, config.shape_name].filter(Boolean).join(' · ');

        return `
            <div class="config-card">
                <div class="config-card-thumb">${icon}</div>
                <div class="config-card-info">
                    <h4>${escapeHtml(config.name || config.product_name || 'Konfiguration')}</h4>
                    <p>${escapeHtml(details || 'Keine Details')}</p>
                    <p class="config-price-highlight">${formatPrice(config.total_price || 0)}</p>
                </div>
                <div class="config-card-actions">
                    <button class="btn btn-secondary btn-sm" data-action="edit" data-config-id="${config.id}">
                        <i class="fas fa-edit"></i> Bearbeiten
                    </button>
                    <button class="btn btn-primary btn-sm" data-action="add-to-cart" data-config-id="${config.id}">
                        <i class="fas fa-shopping-bag"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" data-action="delete" data-config-id="${config.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    list.querySelectorAll('button[data-action][data-config-id]').forEach(button => {
        button.addEventListener('click', () => {
            const configId = parseInt(button.dataset.configId, 10);
            if (!configId) return;

            if (button.dataset.action === 'edit') {
                loadConfigToConfigurator(configId);
                return;
            }

            if (button.dataset.action === 'add-to-cart') {
                addConfigToCart(configId);
                return;
            }

            if (button.dataset.action === 'delete') {
                deleteConfig(configId);
            }
        });
    });
}

function loadConfigToConfigurator(configId) {
    window.location.href = `configurator.html?config=${configId}`;
}

function addConfigToCart(configId) {
    (async () => {
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

        if (LocalStore.isLoggedIn() && typeof OreonAPI !== 'undefined') {
            try {
                await OreonAPI.addToCart(config.product_id, config.id, 1, null, config.total_price ?? null);
                showToast('In den Warenkorb gelegt!', 'success');
                updateCartBadge();
                return;
            } catch (err) {
            }
        }

        LocalStore.addToCart({
            product_id: config.product_id,
            product_name: config.product_name,
            category_slug: config.category_slug,
            total_price: config.total_price,
            base_price: config.base_price,
            type_name: config.type_name,
            material_name: config.material_name,
            size_label: config.size_label,
            shape_name: config.shape_name,
            engraving_text: config.engraving_text
        });

        showToast('In den Warenkorb gelegt!', 'success');
    })();
}

function deleteConfig(configId) {
    (async () => {
        if (LocalStore.isLoggedIn() && typeof OreonAPI !== 'undefined') {
            try {
                await OreonAPI.deleteConfiguration(configId);
                showToast('Konfiguration gelöscht', 'info');
                await loadConfigurations();
                return;
            } catch (err) {
            }
        }

        LocalStore.deleteConfiguration(configId);
        showToast('Konfiguration gelöscht', 'info');
        loadConfigurations();
    })();
}

async function loadOrders() {
    const list = document.getElementById('orderList');
    if (!list) return;

    let orders = [];
    if (LocalStore.isLoggedIn() && typeof OreonAPI !== 'undefined') {
        try {
            const data = await OreonAPI.getOrders();
            orders = data.orders || [];
        } catch (err) {
            orders = LocalStore.getOrders();
        }
    } else {
        orders = LocalStore.getOrders();
    }

    if (orders.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <h2>Keine Bestellungen</h2>
                <p>Du hast noch keine Bestellungen aufgegeben.</p>
                <a href="products.html" class="btn btn-primary">Jetzt einkaufen</a>
            </div>
        `;
        return;
    }

    list.innerHTML = orders.map(order => {
        const statusLabels = {
            pending: 'Ausstehend', confirmed: 'Bestätigt',
            processing: 'In Bearbeitung', shipped: 'Versandt',
            delivered: 'Zugestellt', cancelled: 'Storniert'
        };
        const date = new Date(order.created_at).toLocaleDateString('de-AT');

        return `
            <div class="order-card">
                <div class="order-header">
                    <span class="order-number">${escapeHtml(order.order_number)}</span>
                    <span class="order-status ${order.status}">${statusLabels[order.status] || order.status}</span>
                </div>
                <div class="order-details">
                    <span>${date}</span>
                    <span>${order.items ? order.items.length + ' Artikel' : ''}</span>
                    <span class="order-total">${formatPrice(order.total_price)}</span>
                </div>
            </div>
        `;
    }).join('');
}

async function loadProfile() {
    let user = LocalStore.getUser();

    if (LocalStore.isLoggedIn() && typeof OreonAPI !== 'undefined') {
        try {
            const data = await OreonAPI.getMe();
            if (data?.user) {
                user = data.user;
                LocalStore.setUser(user);
            }
        } catch (err) {
        }
    }

    if (!user) return;

    const fields = {
        profileFirstName: user.first_name || '',
        profileLastName: user.last_name || '',
        profileEmail: user.email || '',
        profilePhone: user.phone || '',
        profileStreet: user.street || '',
        profileZip: user.zip || '',
        profileCity: user.city || '',
        profileCountry: user.country || 'Österreich'
    };

    Object.entries(fields).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.value = value;
    });

    const form = document.getElementById('profileForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const updatedUser = {
                ...user,
                first_name: document.getElementById('profileFirstName').value.trim(),
                last_name: document.getElementById('profileLastName').value.trim(),
                phone: document.getElementById('profilePhone').value.trim(),
                street: document.getElementById('profileStreet').value.trim(),
                zip: document.getElementById('profileZip').value.trim(),
                city: document.getElementById('profileCity').value.trim(),
                country: document.getElementById('profileCountry').value.trim()
            };

            (async () => {
                if (LocalStore.isLoggedIn() && typeof OreonAPI !== 'undefined') {
                    try {
                        await OreonAPI.updateProfile(updatedUser);
                    } catch (err) {
                    }
                }

                LocalStore.setUser(updatedUser);
                showToast('Profil gespeichert!', 'success');
            })();
        });
    }
}
