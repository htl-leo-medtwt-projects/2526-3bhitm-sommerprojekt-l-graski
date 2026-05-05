document.addEventListener('DOMContentLoaded', () => {
    (async () => {
        const user = await getCurrentUser();
        if (!user) {
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
    })();
});

function initDeleteAccount() {
    const btn = document.getElementById('deleteAccountBtn');
    const modal = document.getElementById('deleteAccountModal');
    const confirmBtn = document.getElementById('confirmDeleteAccount');
    const cancelBtn = document.getElementById('cancelDeleteAccount');
    if (!btn) return;

    const openModal = () => {
        if (modal) modal.classList.add('active');
    };

    const closeModal = () => {
        if (modal) modal.classList.remove('active');
    };

    btn.addEventListener('click', () => {
        openModal();
    });

    cancelBtn?.addEventListener('click', () => {
        closeModal();
    });

    modal?.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

    confirmBtn?.addEventListener('click', async () => {
        closeModal();

        try {
            if (typeof OreonAPI !== 'undefined') {
                await OreonAPI.deleteAccount();
            }
        } catch (err) {
            showToast(err?.error || 'Account löschen fehlgeschlagen', 'error');
            return;
        }

        setCurrentUser(null);
        updateCartBadge();
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
                        setCurrentUser(null);
                        updateCartBadge();
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
    try {
        const data = await OreonAPI.getConfigurations();
        configs = data.configurations || [];
    } catch (err) {
        showToast(err?.error || 'Konfigurationen konnten nicht geladen werden.', 'error');
        configs = [];
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
        try {
            const data = await OreonAPI.getConfiguration(configId);
            config = data.configuration;
        } catch (err) {
            config = null;
        }

        if (!config) return;

        try {
            await OreonAPI.addToCart(config.product_id, config.id, 1, null, config.total_price ?? null);
            showToast('In den Warenkorb gelegt!', 'success');
            updateCartBadge();
        } catch (err) {
            showToast(err?.error || 'Konnte nicht in den Warenkorb legen.', 'error');
        }
    })();
}

function deleteConfig(configId) {
    (async () => {
        try {
            await OreonAPI.deleteConfiguration(configId);
            showToast('Konfiguration gelöscht', 'info');
            await loadConfigurations();
        } catch (err) {
            showToast(err?.error || 'Konfiguration löschen fehlgeschlagen.', 'error');
        }
    })();
}

async function loadOrders() {
    const list = document.getElementById('orderList');
    if (!list) return;

    let orders = [];
    try {
        const data = await OreonAPI.getOrders();
        orders = data.orders || [];
    } catch (err) {
        showToast(err?.error || 'Bestellungen konnten nicht geladen werden.', 'error');
        orders = [];
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
    let user = await getCurrentUser();

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
                try {
                    const data = await OreonAPI.updateProfile(updatedUser);
                    setCurrentUser(data.user || updatedUser);
                    showToast('Profil gespeichert!', 'success');
                } catch (err) {
                    showToast(err?.error || 'Profil speichern fehlgeschlagen.', 'error');
                }
            })();
        });
    }
}
