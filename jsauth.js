class Auth {
    static initLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                Auth.handleLogin();
            });
        }
    }

    static initRegisterForm() {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                Auth.handleRegister();
            });
        }
    }

    static handleLogin() {
        const username = document.getElementById('username')?.value.trim();
        const password = document.getElementById('password')?.value;
        
        if (!username || !password) {
            Utils.showNotification('Заполните все поля', 'error');
            return;
        }

        const demoAccounts = {
            'arduino_123': 'arduino_123',
            'novice': 'demo123', 
            'student': 'demo123',
            'pro': 'demo123'
        };

        if (demoAccounts[username] && demoAccounts[username] === password) {
            localStorage.setItem('currentUser', username);
            localStorage.setItem('isDemoAccount', 'true');
            
            const demoData = JSON.parse(localStorage.getItem('demoAccountsData') || '{}');
            const userData = demoData[username] || DataManager.createUserData(username);
            DataManager.saveUserData(username, userData);
            
            Utils.showNotification(`Добро пожаловать, ${username}!`, 'success');
            setTimeout(() => window.location.href = 'index.html', 1000);
        } else {
            Utils.showNotification('Неверное имя пользователя или пароль', 'error');
        }
    }

    static handleRegister() {
        const username = document.getElementById('regUsername')?.value.trim();
        const password = document.getElementById('regPassword')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;
        
        if (!username || !password || !confirmPassword) {
            Utils.showNotification('Заполните все поля', 'error');
            return;
        }

        if (password !== confirmPassword) {
            Utils.showNotification('Пароли не совпадают', 'error');
            return;
        }

        if (password.length < 4) {
            Utils.showNotification('Пароль должен быть не менее 4 символов', 'error');
            return;
        }

        if (username.length < 3 || username.length > 20) {
            Utils.showNotification('Имя пользователя должно быть от 3 до 20 символов', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
        
        if (users[username]) {
            Utils.showNotification('Пользователь с таким именем уже существует', 'error');
            return;
        }

        users[username] = {
            password: password,
            registeredAt: new Date().toISOString()
        };
        
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        
        DataManager.createUserData(username);
        localStorage.setItem('currentUser', username);
        localStorage.removeItem('isDemoAccount');
        
        Utils.showNotification('Аккаунт успешно создан!', 'success');
        setTimeout(() => window.location.href = 'index.html', 1000);
    }

    static loginToDemoAccount(username) {
        localStorage.setItem('currentUser', username);
        localStorage.setItem('isDemoAccount', 'true');
        
        const demoData = JSON.parse(localStorage.getItem('demoAccountsData') || '{}');
        const userData = demoData[username] || DataManager.createUserData(username);
        DataManager.saveUserData(username, userData);
        
        Utils.showNotification(`Демо-режим: ${username}`, 'success');
        setTimeout(() => window.location.href = 'index.html', 1000);
    }

    static toggleDemoAccounts() {
        const demoAccounts = document.getElementById('demoAccounts');
        if (demoAccounts) {
            demoAccounts.classList.toggle('hidden');
        }
    }

    static logout() {
        if (confirm('Вы уверены, что хотите выйти?')) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isDemoAccount');
            Utils.showNotification('Вы вышли из системы', 'info');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        }
    }
}

window.Auth = Auth;