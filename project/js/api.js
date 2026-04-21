
const API_BASE = 'api';

const OreonAPI = {
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

    async _fetch(url, options = {}) {
        const getBody = () => {
            if (!options || !options.body) return null;
            try {
                return JSON.parse(options.body);
            } catch (err) {
                return null;
            }
        };

        const body = getBody();
        try {
            // =====KI=====
            if (url.includes('products.php')) {
                const actionMatch = url.match(/action=([^&]+)/);
                const action = actionMatch ? actionMatch[1] : 'list';

                if (action === 'list') {
                    return { products: (typeof PLACEHOLDER_PRODUCTS !== 'undefined') ? PLACEHOLDER_PRODUCTS : [] };
                }

                if (action === 'detail') {
                    const slugMatch = url.match(/slug=([^&]+)/);
                    const slug = slugMatch ? decodeURIComponent(slugMatch[1]) : null;
                    const list = (typeof PLACEHOLDER_PRODUCTS !== 'undefined') ? PLACEHOLDER_PRODUCTS : [];
                    const product = list.find(p => p.slug === slug) || null;
                    return { product };
                }
                // ============

                if (action === 'categories') {
                    const list = (typeof PLACEHOLDER_PRODUCTS !== 'undefined') ? PLACEHOLDER_PRODUCTS : [];
                    const categories = [];
                    list.forEach(p => {
                        if (!categories.find(c => c.slug === p.category_slug)) {
                            categories.push({ id: p.category_id, name: p.category_name, slug: p.category_slug });
                        }
                    });
                    return { categories };
                }

                if (action === 'options') {
                    if (typeof PLACEHOLDER_OPTIONS !== 'undefined') {
                        return { options: PLACEHOLDER_OPTIONS };
                    }
                    return { options: {} };
                }
            }

            // =====KI=====
            if (url.includes('auth.php')) {
                const actionMatch = url.match(/action=([^&]+)/);
                const action = actionMatch ? actionMatch[1] : null;

                if (action === 'login') {
                    const email = body?.email;
                    const password = body?.password;
                    if (email === 'admin' && password === 'admin') {
                        const adminUser = { id: 0, email: 'admin', first_name: 'Admin', last_name: '' };
                        return { user: adminUser };
                    }

                    const demoUsers = JSON.parse(localStorage.getItem('oreon_users') || '[]');
                    const found = demoUsers.find(u => u.email === email && u.password === password);
                    if (found) return { user: { id: found.id, email: found.email, first_name: found.first_name, last_name: found.last_name } };
                    throw { status: 401, error: 'Ungültige Anmeldedaten.' };
                }

                if (action === 'register') {
                    const users = JSON.parse(localStorage.getItem('oreon_users') || '[]');
                    const newUser = { id: Date.now(), first_name: body.first_name, last_name: body.last_name, email: body.email, password: body.password };
                    users.push(newUser);
                    localStorage.setItem('oreon_users', JSON.stringify(users));
                    return { user: { id: newUser.id, email: newUser.email, first_name: newUser.first_name, last_name: newUser.last_name } };
                }
                // ============

                if (action === 'logout') {
                    return { success: true };
                }

                if (action === 'me') {
                    const me = LocalStore.getUser();
                    return { user: me };
                }

                if (action === 'update') {
                    const updated = body;
                    LocalStore.setUser(updated);
                    return { user: updated };
                }

                if (action === 'delete') {
                    LocalStore.clearUser();
                    return { success: true };
                }
            }

            // =====KI=====
            if (url.includes('configurations.php')) {
                const actionMatch = url.match(/action=([^&]+)/);
                const action = actionMatch ? actionMatch[1] : null;

                if (action === 'save') {
                    const saved = LocalStore.saveConfiguration(body);
                    return { configuration: saved };
                }

                if (action === 'list') {
                    return { configurations: LocalStore.getConfigurations() };
                }

                if (action === 'detail') {
                    const idMatch = url.match(/id=([^&]+)/);
                    const id = idMatch ? parseInt(idMatch[1], 10) : null;
                    const configs = LocalStore.getConfigurations();
                    return { configuration: configs.find(c => c.id === id) || null };
                }

                if (action === 'delete') {
                    LocalStore.deleteConfiguration(body.id);
                    return { success: true };
                }
            }

            if (url.includes('cart.php')) {
                const actionMatch = url.match(/action=([^&]+)/);
                const action = actionMatch ? actionMatch[1] : null;

                if (action === 'add') {
                    const item = body;
                    const added = LocalStore.addToCart(item);
                    return { cart: added };
                }

                if (action === 'list') {
                    return { cart: LocalStore.getCart() };
                }

                if (action === 'update') {
                    LocalStore.updateCartQuantity(body.id, body.quantity);
                    return { cart: LocalStore.getCart() };
                }

                if (action === 'remove') {
                    LocalStore.removeFromCart(body.id);
                    return { cart: LocalStore.getCart() };
                }

                if (action === 'count') {
                    return { count: LocalStore.getCartCount() };
                }
            }
            // ============

            if (url.includes('orders.php')) {
                const actionMatch = url.match(/action=([^&]+)/);
                const action = actionMatch ? actionMatch[1] : null;

                if (action === 'create') {
                    const order = LocalStore.addOrder(body);
                    return { order };
                }

                if (action === 'list') {
                    return { orders: LocalStore.getOrders() };
                }

                if (action === 'detail') {
                    const idMatch = url.match(/id=([^&]+)/);
                    const id = idMatch ? parseInt(idMatch[1], 10) : null;
                    const order = LocalStore.getOrders().find(o => o.id === id) || null;
                    return { order };
                }
            }

            return {};
        } catch (err) {
            throw { status: err.status || 500, error: err.error || String(err) };
        }
    }
};

// =====KI=====
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
        const cart = this.getCart().filter(item => item.id !== id);
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
        return this.getCart().reduce((sum, item) => sum + (item.quantity || 1), 0);
    },

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
// ============

async function updateCartBadge() {
    let count = LocalStore.getCartCount();

    if (LocalStore.isLoggedIn() && typeof OreonAPI !== 'undefined') {
        try {
            const data = await OreonAPI.getCartCount();
            if (typeof data?.count === 'number') {
                count = data.count;
            }
        } catch (err) {
        }
    }

    document.querySelectorAll('#cartCount').forEach(element => {
        element.textContent = count;
        element.style.display = count > 0 ? 'flex' : 'none';
    });
}

// =====KI=====
function formatPrice(price) {
    return '€ ' + parseFloat(price).toFixed(2).replace('.', ',');
}
// ============