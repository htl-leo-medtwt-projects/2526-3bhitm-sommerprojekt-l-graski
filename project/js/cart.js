document.addEventListener('DOMContentLoaded', () => {
    loadCart();
});

const CART_QTY_MIN = 1;
const CART_QTY_MAX = 100;

function normalizeCartQuantity(value) {
    let qty = parseInt(value, 10);
    if (!Number.isFinite(qty)) qty = CART_QTY_MIN;
    qty = Math.max(CART_QTY_MIN, Math.min(CART_QTY_MAX, qty));
    return qty;
}

async function loadCart() {
    const list = document.getElementById('cartItems');
    const empty = document.getElementById('emptyCart');
    const layout = document.getElementById('cartLayout');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('totalPrice');

    if (!list || !empty || !layout || !subtotalEl || !totalEl) return;

    let items = [];
    try {
        const data = await OreonAPI.getCart();
        items = data.cart || [];
    } catch (err) {
        if (err?.status === 401) {
            showToast('Bitte melde dich an, um den Warenkorb zu sehen.', 'error');
            setTimeout(() => window.location.href = 'login.html', 1200);
        } else {
            showToast(err?.error || 'Warenkorb konnte nicht geladen werden.', 'error');
        }
        items = [];
    }

    if (items.length === 0) {
        layout.classList.add('hidden');
        empty.classList.remove('hidden');
        subtotalEl.textContent = formatPrice(0);
        totalEl.textContent = formatPrice(0);
        updateCartBadge();
        return;
    }

    layout.classList.remove('hidden');
    empty.classList.add('hidden');

    list.innerHTML = items.map(item => buildCartItem(item)).join('');
    bindCartActions(items);
    updateCartTotals(items);
    updateCartBadge();
}

function buildCartItem(item) {
        const image = item.image_url
                ? `<img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(item.product_name || '')}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` +
                    `<span class="placeholder-icon" style="display:none;"><i class="fas fa-gem"></i></span>`
                : `<span class="placeholder-icon"><i class="fas fa-gem"></i></span>`;

    const configParts = [
        item.type_name,
        item.material_name,
        item.size_label,
        item.shape_name
    ].filter(Boolean);

    if (item.engraving_text) {
        configParts.push(`Gravur: ${item.engraving_text}`);
    }

    const quantity = normalizeCartQuantity(item.quantity || 1);
    const unit = parseFloat(item.unit_price ?? item.total_price ?? item.base_price ?? 0);
    const price = unit * quantity;

    return `
        <div class="cart-item">
            <div class="cart-item-img">${image}</div>
            <div class="cart-item-details">
                <h3>${escapeHtml(item.product_name || 'Produkt')}</h3>
                <div class="cart-item-config">
                    ${configParts.map(part => `<span>${escapeHtml(part)}</span>`).join('')}
                </div>
            </div>
            <div class="cart-item-actions">
                <div class="cart-item-price">${formatPrice(price)}</div>
                <div class="quantity-control">
                    <button class="quantity-btn" data-action="dec" data-id="${item.id}">-</button>
                    <input
                        type="number"
                        class="quantity-value"
                        value="${quantity}"
                        min="${CART_QTY_MIN}"
                        max="${CART_QTY_MAX}"
                        step="1"
                        inputmode="numeric"
                        data-action="set"
                        data-id="${item.id}"
                        aria-label="Menge"
                    />
                    <button class="quantity-btn" data-action="inc" data-id="${item.id}">+</button>
                </div>
                <button class="btn btn-secondary btn-sm" data-action="remove" data-id="${item.id}">Entfernen</button>
            </div>
        </div>
    `;
}

function bindCartActions(items) {
    const buttons = document.querySelectorAll('button[data-action][data-id]');
    buttons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = parseInt(btn.dataset.id, 10);
            const action = btn.dataset.action;
            const item = items.find(i => i.id === id);
            if (!item) return;

            if (action === 'remove') {
                await updateCartItem(id, 0, true);
                return;
            }

            if (action !== 'inc' && action !== 'dec') return;

            const currentQty = normalizeCartQuantity(item.quantity || 1);
            const nextQty = action === 'inc' ? currentQty + 1 : currentQty - 1;
            await updateCartItem(id, nextQty, false);
        });
    });

    const qtyInputs = document.querySelectorAll('input.quantity-value[data-id]');
    qtyInputs.forEach(input => {
        const id = parseInt(input.dataset.id, 10);
        const item = items.find(i => i.id === id);
        if (!item) return;

        const selectAll = () => {
            try {
                input.select();
            } catch (e) {
            }
        };

        input.addEventListener('focus', selectAll);
        input.addEventListener('click', selectAll);

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                input.blur();
            }
        });

        input.addEventListener('blur', async () => {
            const currentQty = normalizeCartQuantity(item.quantity || 1);
            const nextQty = normalizeCartQuantity(input.value);
            input.value = String(nextQty);

            if (nextQty === currentQty) return;
            await updateCartItem(id, nextQty, false);
        });
    });
}

async function updateCartItem(id, quantity, removeExplicit) {
    try {
        if (removeExplicit) {
            await OreonAPI.removeCartItem(id);
        } else {
            const nextQty = normalizeCartQuantity(quantity);
            await OreonAPI.updateCartItem(id, nextQty);
        }
        await loadCart();
    } catch (err) {
        showToast(err?.error || 'Warenkorb konnte nicht aktualisiert werden.', 'error');
    }
}

function updateCartTotals(items) {
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('totalPrice');
    if (!subtotalEl || !totalEl) return;

    const subtotal = items.reduce((sum, item) => {
        const unit = parseFloat(item.unit_price ?? item.total_price ?? item.base_price ?? 0);
        return sum + unit * (item.quantity || 1);
    }, 0);

    subtotalEl.textContent = formatPrice(subtotal);
    totalEl.textContent = formatPrice(subtotal);
}
