// js/settings.js - Функции для настроек

// Загрузка сохраненных настроек
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    
    // Тема
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.value = settings.theme || 'light';
    }
    
    // Размер шрифта
    const fontSize = document.getElementById('fontSize');
    if (fontSize) {
        fontSize.value = settings.fontSize || 'medium';
    }
    
    // Уведомления
    const emailNotifications = document.getElementById('emailNotifications');
    const progressNotifications = document.getElementById('progressNotifications');
    const achievementNotifications = document.getElementById('achievementNotifications');
    
    if (emailNotifications) emailNotifications.checked = settings.emailNotifications || false;
    if (progressNotifications) progressNotifications.checked = settings.progressNotifications !== false;
    if (achievementNotifications) achievementNotifications.checked = settings.achievementNotifications !== false;
    
    // Игровые настройки
    const soundEffects = document.getElementById('soundEffects');
    const animations = document.getElementById('animations');
    const showHints = document.getElementById('showHints');
    
    if (soundEffects) soundEffects.checked = settings.soundEffects !== false;
    if (animations) animations.checked = settings.animations !== false;
    if (showHints) showHints.checked = settings.showHints !== false;
}

// Сохранение настроек
function saveSettings(key, value) {
    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    settings[key] = value;
    localStorage.setItem('userSettings', JSON.stringify(settings));
    applyUserSettings();
}

// Применение настроек
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

// Смена темы
function changeTheme(theme) {
    saveSettings('theme', theme);
    showSettingsNotification('Тема изменена');
}

// Смена размера шрифта
function changeFontSize(size) {
    saveSettings('fontSize', size);
    showSettingsNotification('Размер шрифта изменен');
}

// Управление уведомлениями
function toggleNotifications(type) {
    const checkbox = document.getElementById(type + 'Notifications');
    saveSettings(type + 'Notifications', checkbox.checked);
    showSettingsNotification('Настройки уведомлений обновлены');
}

// Звуковые эффекты
function toggleSoundEffects() {
    const checkbox = document.getElementById('soundEffects');
    saveSettings('soundEffects', checkbox.checked);
    showSettingsNotification('Настройки звука обновлены');
}

// Анимации
function toggleAnimations() {
    const checkbox = document.getElementById('animations');
    saveSettings('animations', checkbox.checked);
    showSettingsNotification('Настройки анимаций обновлены');
}

// Подсказки
function toggleHints() {
    const checkbox = document.getElementById('showHints');
    saveSettings('showHints', checkbox.checked);
    showSettingsNotification('Настройки подсказок обновлены');
}

// Показ уведомления о изменении настроек
function showSettingsNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'settings-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-in reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// Экспорт данных
function exportData() {
    const userData = getCurrentUserData();
    const currentUser = localStorage.getItem('currentUser');
    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    
    if (!userData || !currentUser) {
        alert('Нет данных для экспорта');
        return;
    }
    
    const exportData = {
        username: currentUser,
        exportDate: new Date().toISOString(),
        userData: userData,
        settings: settings,
        isDemoAccount: localStorage.getItem('isDemoAccount') === 'true'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `arduino-school-backup-${currentUser}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showSettingsNotification('Данные успешно экспортированы!');
}

// Сброс прогресса
function resetProgress() {
    if (confirm('ВНИМАНИЕ! Вы уверены, что хотите сбросить весь прогресс? Это действие нельзя отменить.')) {
        const userData = getCurrentUserData();
        userData.completedLessons = [];
        userData.achievements = [];
        userData.points = 0;
        userData.level = 'Новичок';
        userData.learningCompleted = false;
        
        saveCurrentUserData(userData);
        showSettingsNotification('Прогресс сброшен!');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Очистка всех данных
function clearData() {
    if (confirm('ВНИМАНИЕ! Это удалит ВСЕ ваши данные, включая аккаунт, прогресс и настройки. Вы уверены?')) {
        if (confirm('Это действие НЕОБРАТИМО. Введите "УДАЛИТЬ" для подтверждения:') === 'УДАЛИТЬ') {
            localStorage.clear();
            showSettingsNotification('Все данные удалены!');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }
    }
}

// Инициализация настроек
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем настройки только если мы на странице настроек
    if (window.location.pathname.includes('settings.html')) {
        loadSettings();
    }
});

// Глобальные функции
window.changeTheme = changeTheme;
window.changeFontSize = changeFontSize;
window.toggleNotifications = toggleNotifications;
window.toggleSoundEffects = toggleSoundEffects;
window.toggleAnimations = toggleAnimations;
window.toggleHints = toggleHints;
window.exportData = exportData;
window.resetProgress = resetProgress;
window.clearData = clearData;