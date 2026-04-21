document.addEventListener('DOMContentLoaded', () => {
    if (LocalStore.isLoggedIn()) {
        window.location.href = 'account.html';
        return;
    }

    initAuthTabs();
    initLoginForm();
    initRegisterForm();
});

function initAuthTabs() {
    const tabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if (tab.dataset.tab === 'login') {
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            } else {
                loginForm.classList.add('hidden');
                registerForm.classList.remove('hidden');
            }

            // =====KI=====
            if (typeof gsap !== 'undefined') {
                const form = tab.dataset.tab === 'login' ? loginForm : registerForm;
                gsap.fromTo(form, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
            }
            // ============
        });
    });
}

function initLoginForm() {
    const form = document.getElementById('loginForm');
    const errorEl = document.getElementById('loginError');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorEl.textContent = '';

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            errorEl.textContent = 'Bitte alle Felder ausfüllen.';
            return;
        }

        try {
            const data = await OreonAPI.login(email, password);
            LocalStore.setUser(data.user);
            showToast('Erfolgreich angemeldet!', 'success');
            setTimeout(() => window.location.href = 'account.html', 500);
        } catch (err) {
            const demoUsers = JSON.parse(localStorage.getItem('oreon_users') || '[]');
            const user = demoUsers.find(u => u.email === email && u.password === password);
            if (user) {
                LocalStore.setUser({ id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name });
                showToast('Erfolgreich angemeldet!', 'success');
                setTimeout(() => window.location.href = 'account.html', 500);
            } else {
                errorEl.textContent = err.error || 'Ungültige Anmeldedaten.';
            }
        }
    });
}

function initRegisterForm() {
    const form = document.getElementById('registerForm');
    const errorEl = document.getElementById('registerError');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorEl.textContent = '';

        const firstName = document.getElementById('regFirstName').value.trim();
        const lastName = document.getElementById('regLastName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const passwordConfirm = document.getElementById('regPasswordConfirm').value;

        if (!firstName || !lastName || !email || !password) {
            errorEl.textContent = 'Bitte alle Felder ausfüllen.';
            return;
        }
        if (password.length < 8) {
            errorEl.textContent = 'Passwort muss mindestens 8 Zeichen haben.';
            return;
        }
        if (password !== passwordConfirm) {
            errorEl.textContent = 'Passwörter stimmen nicht überein.';
            return;
        }

        // =====KI=====
        try {
            const data = await OreonAPI.register({ first_name: firstName, last_name: lastName, email, password });
            LocalStore.setUser(data.user);
            showToast('Konto erstellt!', 'success');
            setTimeout(() => window.location.href = 'account.html', 500);
        } catch (err) {
            const demoUsers = JSON.parse(localStorage.getItem('oreon_users') || '[]');
            if (demoUsers.find(u => u.email === email)) {
                errorEl.textContent = 'Diese E-Mail ist bereits registriert.';
                return;
            }
            const newUser = { id: Date.now(), first_name: firstName, last_name: lastName, email, password };
            demoUsers.push(newUser);
            localStorage.setItem('oreon_users', JSON.stringify(demoUsers));
            LocalStore.setUser({ id: newUser.id, email, first_name: firstName, last_name: lastName });
            showToast('Konto erstellt!', 'success');
            setTimeout(() => window.location.href = 'account.html', 500);
        }
        // ============
    });
}
