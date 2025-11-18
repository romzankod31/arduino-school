// js/init.js - Инициализация приложения

// Функция для автоматического создания чистого аккаунта
function initializeCleanAccount() {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    
    // Создаем чистый аккаунт если его нет
    if (!users['arduino_123']) {
        users['arduino_123'] = {
            password: 'arduino_123',
            class: '7 класс',
            registeredAt: new Date().toISOString()
        };
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        console.log('✅ Чистый аккаунт arduino_123 создан');
    }
    
    // Инициализируем данные пользователя
    const userKey = `user_arduino_123`;
    const userData = {
        points: 0,
        completedLessons: [],
        learningCompleted: false,
        level: 'Новичок',
        joinDate: new Date().toISOString(),
        achievements: []
    };
    
    // Не перезаписываем существующие данные
    if (!localStorage.getItem(userKey)) {
        localStorage.setItem(userKey, JSON.stringify(userData));
        console.log('✅ Данные чистого аккаунта инициализированы');
    }
}

// Инициализация демо-аккаунтов
function initializeDemoAccounts() {
    const demoData = {
        'arduino_123': {
            points: 0,
            completedLessons: [],
            learningCompleted: false,
            level: 'Новичок',
            joinDate: new Date().toISOString(),
            achievements: []
        },
        'novice': {
            points: 10,
            completedLessons: [1],
            learningCompleted: true,
            level: 'Начинающий',
            joinDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            achievements: ['Первый урок', 'Основы Arduino']
        },
        'student': {
            points: 20,
            completedLessons: [1, 2, 3],
            learningCompleted: true,
            level: 'Опытный',
            joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            achievements: ['Первый урок', 'Основы Arduino', 'Мастер кнопок', 'Контроль яркости']
        },
        'pro': {
            points: 20,
            completedLessons: [1, 2, 3, 4],
            learningCompleted: true,
            level: 'Продвинутый',
            joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
            achievements: ['Первый урок', 'Основы Arduino', 'Мастер кнопок', 'Контроль яркости', 'Сервомастер', 'Ультразвуковой эксперт']
        }
    };
    
    localStorage.setItem('demoAccountsData', JSON.stringify(demoData));
    console.log('✅ Демо-аккаунты инициализированы');
}

// Проверка и создание базовой структуры данных
function initializeDataStructure() {
    // Создаем зарегистрированных пользователей если нет
    if (!localStorage.getItem('registeredUsers')) {
        localStorage.setItem('registeredUsers', JSON.stringify({}));
    }
    
    // Создаем демо-данные если нет
    if (!localStorage.getItem('demoAccountsData')) {
        initializeDemoAccounts();
    }
    
    // Создаем настройки по умолчанию если нет
    if (!localStorage.getItem('userSettings')) {
        const defaultSettings = {
            theme: 'light',
            fontSize: 'medium',
            progressNotifications: true,
            achievementNotifications: true,
            soundEffects: true,
            animations: true,
            showHints: true
        };
        localStorage.setItem('userSettings', JSON.stringify(defaultSettings));
    }
}

// Применение сохраненных настроек
function applyUserSettings() {
    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    
    // Применяем тему
    if (settings.theme) {
        document.documentElement.setAttribute('data-theme', settings.theme);
    }
    
    // Применяем размер шрифта
    if (settings.fontSize) {
        document.documentElement.style.fontSize = 
            settings.fontSize === 'small' ? '14px' : 
            settings.fontSize === 'large' ? '18px' : '16px';
    }
}

// Основная инициализация
function initializeApp() {
    console.log('🚀 Инициализация Arduino School App...');
    
    // Инициализируем структуру данных
    initializeDataStructure();
    
    // Инициализируем демо-аккаунты
    initializeDemoAccounts();
    
    // Инициализируем чистый аккаунт
    initializeCleanAccount();
    
    // Применяем настройки пользователя
    applyUserSettings();
    
    // Инициализируем базовые настройки
    if (!localStorage.getItem('appInitialized')) {
        localStorage.setItem('appInitialized', 'true');
        console.log('✅ Arduino School App успешно инициализирована!');
    }
}

// Запускаем инициализацию при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Глобальная функция для отладки
window.debugApp = function() {
    console.log('=== DEBUG INFO ===');
    console.log('currentUser:', localStorage.getItem('currentUser'));
    console.log('isDemoAccount:', localStorage.getItem('isDemoAccount'));
    console.log('registeredUsers:', JSON.parse(localStorage.getItem('registeredUsers') || '{}'));
    console.log('demoAccountsData:', JSON.parse(localStorage.getItem('demoAccountsData') || '{}'));
    console.log('userSettings:', JSON.parse(localStorage.getItem('userSettings') || '{}'));
    console.log('appInitialized:', localStorage.getItem('appInitialized'));
    
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const userKey = `user_${currentUser}`;
        console.log('currentUserData:', JSON.parse(localStorage.getItem(userKey) || '{}'));
    }
};

// Глобальные функции для меню
window.toggleMenu = function() {
    const menu = document.getElementById('menuDropdown');
    if (menu) {
        menu.classList.toggle('show');
    }
};

// Закрытие меню при клике вне его
document.addEventListener('click', function(event) {
    const menu = document.getElementById('menuDropdown');
    const menuBtn = document.querySelector('.menu-btn');
    
    if (menu && menuBtn && !menu.contains(event.target) && !menuBtn.contains(event.target)) {
        menu.classList.remove('show');
    }
});