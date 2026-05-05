
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

        const data = await this._fetch(`${API_BASE}/cart.php?action=add`, {
            method: 'POST',
            body: JSON.stringify(body)
        });
        updateCartBadge();
        return data;
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
        const fetchOptions = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        };

        if (options.body) {
            fetchOptions.body = typeof options.body === 'string'
                ? options.body
                : JSON.stringify(options.body);
        }

        const response = await fetch(url, fetchOptions);
        let data = null;

        try {
            data = await response.json();
        } catch (err) {
            data = null;
        }

        if (!response.ok) {
            throw { status: response.status, error: data?.error || response.statusText };
        }

        return data || {};
    }
};

let currentUser = null;
let userLoaded = false;

async function getCurrentUser() {
    if (userLoaded) return currentUser;
    try {
        const data = await OreonAPI.getMe();
        currentUser = data?.user || null;
    } catch (err) {
        currentUser = null;
    }
    userLoaded = true;
    return currentUser;
}

function setCurrentUser(user) {
    currentUser = user || null;
    userLoaded = true;
}

// =====KI=====
function bumpCartBadge(delta) {
    document.querySelectorAll('#cartCount').forEach(element => {
        const current = parseInt(element.textContent || '0', 10) || 0;
        const next = Math.max(0, current + delta);
        element.textContent = next;
        element.style.display = next > 0 ? 'flex' : 'none';
    });
}

async function updateCartBadge() {
    let count = 0;
    try {
        const data = await OreonAPI.getCartCount();
        if (typeof data?.count === 'number') {
            count = data.count;
        }
    } catch (err) {
    }

    document.querySelectorAll('#cartCount').forEach(element => {
        element.textContent = count;
        element.style.display = count > 0 ? 'flex' : 'none';
    });
}

function formatPrice(price) {
    return '€ ' + parseFloat(price).toFixed(2).replace('.', ',');
}
// ============