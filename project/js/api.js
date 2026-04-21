/**
 * Oréon API Helper
 * Zentraler API-Client für alle Backend-Aufrufe
 */
const API_BASE = 'api';

const OreonAPI = {
    // --- Produkte ---
    async getProducts(category = '') {
        const params = category ? `?action=list&category=${encodeURIComponent(category)}` : '?action=list';
        return this._fetch(`${API_BASE}/products.php${params}`);
    },

    async getProduct(slug) {
        return this._fetch(`${API_BASE}/products.php?action=detail&slug=${encodeURIComponent(slug)}`);
    },

    async getCategories() {
        return this._fetch(`${API_BASE}/products.php?action=categories`);
    },

    async getOptions(categoryId) {
        return this._fetch(`${API_BASE}/products.php?action=options&category_id=${categoryId}`);
    },

    // --- Auth ---
    async login(email, password) {
        return this._fetch(`${API_BASE}/auth.php?action=login`, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    async register(data) {
        return this._fetch(`${API_BASE}/auth.php?action=register`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async logout() {
        return this._fetch(`${API_BASE}/auth.php?action=logout`);
    },

    async deleteAccount() {
        return this._fetch(`${API_BASE}/auth.php?action=delete`, {
            method: 'POST'
        });
    },

    async getMe() {
        return this._fetch(`${API_BASE}/auth.php?action=me`);
    },

    async updateProfile(data) {
        return this._fetch(`${API_BASE}/auth.php?action=update`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // --- Konfigurationen ---
    async saveConfiguration(data) {
        return this._fetch(`${API_BASE}/configurations.php?action=save`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async getConfigurations() {
        return this._fetch(`${API_BASE}/configurations.php?action=list`);
    },

    async getConfiguration(id) {
        return this._fetch(`${API_BASE}/configurations.php?action=detail&id=${id}`);
    },

    async deleteConfiguration(id) {
        return this._fetch(`${API_BASE}/configurations.php?action=delete`, {
            method: 'POST',
            body: JSON.stringify({ id })
        });
    },

    // --- Warenkorb ---
    async addToCart(productId, configurationId = null, quantity = 1, configurationSnapshot = null, unitPrice = null) {
        const body = { product_id: productId, configuration_id: configurationId, quantity };
        if (configurationSnapshot) body.configuration_snapshot = configurationSnapshot;
        if (unitPrice !== null && unitPrice !== undefined) body.unit_price = unitPrice;

        return this._fetch(`${API_BASE}/cart.php?action=add`, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    },

    async getCart() {
        return this._fetch(`${API_BASE}/cart.php?action=list`);
    },

    async updateCartItem(id, quantity) {
        return this._fetch(`${API_BASE}/cart.php?action=update`, {
            method: 'POST',
            body: JSON.stringify({ id, quantity })
        });
    },

    async removeCartItem(id) {
        return this._fetch(`${API_BASE}/cart.php?action=remove`, {
            method: 'POST',
            body: JSON.stringify({ id })
        });
    },

    async getCartCount() {
        return this._fetch(`${API_BASE}/cart.php?action=count`);
    },

    // --- Bestellungen ---
    async createOrder(data) {
        return this._fetch(`${API_BASE}/orders.php?action=create`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async getOrders() {
        return this._fetch(`${API_BASE}/orders.php?action=list`);
    },

    async getOrder(id) {
        return this._fetch(`${API_BASE}/orders.php?action=detail&id=${id}`);
    },

    // --- Helper ---
    async _fetch(url, options = {}) {
        const defaults = {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin'
        };
        const config = { ...defaults, ...options, headers: { ...defaults.headers, ...(options.headers || {}) } };
        const response = await fetch(url, config);
        const data = await response.json();
        if (!response.ok) {
            throw { status: response.status, ...data };
        }
        return data;
    }
};

// KI GENERIERT: LocalStorage-Fallback (Demo/Offline-Funktionalität ohne Backend)
// --- Local Storage Helpers (Fallback wenn kein Backend) ---
const LocalStore = {
    getUser() {
        const data = localStorage.getItem('oreon_user');
        return data ? JSON.parse(data) : null;
    },
    setUser(user) {
        localStorage.setItem('oreon_user', JSON.stringify(user));
    },
    clearUser() {
        localStorage.removeItem('oreon_user');
    },
    isLoggedIn() {
        return !!this.getUser();
    },

    // Cart in localStorage
    getCart() {
        const data = localStorage.getItem('oreon_cart');
        return data ? JSON.parse(data) : [];
    },
    setCart(items) {
        localStorage.setItem('oreon_cart', JSON.stringify(items));
        updateCartBadge();
    },
    addToCart(item) {
        const cart = this.getCart();
        cart.push({ ...item, id: Date.now(), quantity: item.quantity || 1 });
        this.setCart(cart);
        return cart;
    },
    removeFromCart(id) {
        const cart = this.getCart().filter(i => i.id !== id);
        this.setCart(cart);
        return cart;
    },
    updateCartQuantity(id, quantity) {
        const cart = this.getCart();
        const item = cart.find(i => i.id === id);
        if (item) item.quantity = Math.max(1, quantity);
        this.setCart(cart);
        return cart;
    },
    clearCart() {
        this.setCart([]);
    },
    getCartCount() {
        return this.getCart().reduce((s, i) => s + (i.quantity || 1), 0);
    },

    // Configurations in localStorage
    getConfigurations() {
        const data = localStorage.getItem('oreon_configs');
        return data ? JSON.parse(data) : [];
    },
    saveConfiguration(config) {
        const configs = this.getConfigurations();
        config.id = Date.now();
        config.created_at = new Date().toISOString();
        configs.push(config);
        localStorage.setItem('oreon_configs', JSON.stringify(configs));
        return config;
    },
    deleteConfiguration(id) {
        const configs = this.getConfigurations().filter(c => c.id !== id);
        localStorage.setItem('oreon_configs', JSON.stringify(configs));
        return configs;
    },

    // Orders
    getOrders() {
        const data = localStorage.getItem('oreon_orders');
        return data ? JSON.parse(data) : [];
    },
    addOrder(order) {
        const orders = this.getOrders();
        order.id = Date.now();
        order.order_number = 'ORN-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        order.status = 'pending';
        order.created_at = new Date().toISOString();
        orders.unshift(order);
        localStorage.setItem('oreon_orders', JSON.stringify(orders));
        return order;
    }
};

async function updateCartBadge() {
    let count = LocalStore.getCartCount();

    if (LocalStore.isLoggedIn() && typeof OreonAPI !== 'undefined') {
        try {
            const data = await OreonAPI.getCartCount();
            if (typeof data?.count === 'number') {
                count = data.count;
            }
        } catch (e) {
            // fallback to localStorage count
        }
    }

    document.querySelectorAll('#cartCount').forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
    });
}

function formatPrice(price) {
    return '€ ' + parseFloat(price).toFixed(2).replace('.', ',');
}
