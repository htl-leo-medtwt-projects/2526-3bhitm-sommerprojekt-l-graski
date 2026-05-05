document.addEventListener('DOMContentLoaded', () => {
    initCheckout();
});

async function initCheckout() {
    const user = await getCurrentUser();
    if (!user) {
        showToast('Bitte melde dich an, um zu bestellen.', 'error');
        setTimeout(() => window.location.href = 'login.html', 1200);
        return;
    }

    fillShippingFromUser(user);
    initPaymentOptions();
    await loadCheckoutSummary();
    initCheckoutForm();
}

function fillShippingFromUser(user) {
    const firstName = document.getElementById('checkFirstName');
    const lastName = document.getElementById('checkLastName');
    const street = document.getElementById('checkStreet');
    const zip = document.getElementById('checkZip');
    const city = document.getElementById('checkCity');
    const country = document.getElementById('checkCountry');

    if (firstName) firstName.value = user.first_name || '';
    if (lastName) lastName.value = user.last_name || '';
    if (street) street.value = user.street || '';
    if (zip) zip.value = user.zip || '';
    if (city) city.value = user.city || '';
    if (country && user.country) country.value = user.country;
}

function initPaymentOptions() {
    document.querySelectorAll('.payment-option input[type="radio"]').forEach(input => {
        input.addEventListener('change', () => {
            document.querySelectorAll('.payment-option').forEach(option => option.classList.remove('selected'));
            input.closest('.payment-option')?.classList.add('selected');
        });
    });
}

async function loadCheckoutSummary() {
    const list = document.getElementById('checkoutItems');
    const subtotalEl = document.getElementById('checkSubtotal');
    const totalEl = document.getElementById('checkTotal');

    if (!list || !subtotalEl || !totalEl) return;

    let items = [];
    try {
        const data = await OreonAPI.getCart();
        items = data.cart || [];
    } catch (err) {
        showToast(err?.error || 'Warenkorb konnte nicht geladen werden.', 'error');
        items = [];
    }

    if (items.length === 0) {
        showToast('Dein Warenkorb ist leer.', 'info');
        setTimeout(() => window.location.href = 'cart.html', 1000);
        return;
    }

    list.innerHTML = items.map(item => {
        const unit = parseFloat(item.unit_price ?? item.total_price ?? item.base_price ?? 0);
        const price = unit * (item.quantity || 1);
        const name = escapeHtml(item.product_name || 'Produkt');
        return `
            <div class="summary-row">
                <span class="label">${name} × ${item.quantity || 1}</span>
                <span class="value">${formatPrice(price)}</span>
            </div>
        `;
    }).join('');

    const subtotal = items.reduce((sum, item) => {
        const unit = parseFloat(item.unit_price ?? item.total_price ?? item.base_price ?? 0);
        return sum + unit * (item.quantity || 1);
    }, 0);

    subtotalEl.textContent = formatPrice(subtotal);
    totalEl.textContent = formatPrice(subtotal);
}

function initCheckoutForm() {
    const form = document.getElementById('checkoutForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const payload = {
            shipping_street: document.getElementById('checkStreet')?.value.trim(),
            shipping_zip: document.getElementById('checkZip')?.value.trim(),
            shipping_city: document.getElementById('checkCity')?.value.trim(),
            shipping_country: document.getElementById('checkCountry')?.value.trim(),
            payment_method: document.querySelector('input[name="payment"]:checked')?.value || ''
        };

        try {
            await OreonAPI.createOrder(payload);
            updateCartBadge();
            window.location.href = 'account.html#orders';
        } catch (err) {
            showToast(err?.error || 'Bestellung fehlgeschlagen.', 'error');
        }
    });
}
