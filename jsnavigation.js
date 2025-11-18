class Navigation {
    static toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');
        if (sidebar) {
            sidebar.classList.toggle('active');
            if (mainContent) {
                mainContent.classList.toggle('sidebar-active');
            }
        }
    }

    static closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');
        if (sidebar) {
            sidebar.classList.remove('active');
            if (mainContent) {
                mainContent.classList.remove('sidebar-active');
            }
        }
    }

    static closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.menu-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }

    static isAuthenticated() {
        return !!localStorage.getItem('currentUser');
    }

    static requireAuth() {
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return false;
        }
        return true;
    }

    static redirectToLogin() {
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }

    static redirectToHome() {
        window.location.href = 'index.html';
    }
}

// Закрытие сайдбара при клике вне его
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (sidebar && menuToggle && 
        !sidebar.contains(event.target) && 
        !menuToggle.contains(event.target) &&
        sidebar.classList.contains('active')) {
        Navigation.closeSidebar();
    }
});

// Закрытие сайдбара по Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        Navigation.closeSidebar();
        Navigation.closeAllDropdowns();
    }
});

// Автоматическое закрытие сайдбара на мобильных устройствах при переходе
document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu-item[href]');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                Navigation.closeSidebar();
            }
        });
    });

    // Проверяем авторизацию только на защищенных страницах
    const isProtectedPage = !window.location.pathname.includes('login.html') && 
                           !window.location.pathname.includes('register.html');
    
    if (isProtectedPage && !Navigation.isAuthenticated()) {
        Navigation.redirectToLogin();
    }
});

window.Navigation = Navigation;