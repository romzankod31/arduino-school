// js/profile.js - Функции для личного кабинета

// Загрузка данных профиля
function loadProfileData() {
    const userData = getCurrentUserData();
    const currentUser = localStorage.getItem('currentUser');
    
    if (!userData || !currentUser) {
        alert('Ошибка загрузки данных профиля');
        window.location.href = 'login.html';
        return;
    }

    // Основная информация
    document.getElementById('profileUsername').textContent = currentUser;
    document.getElementById('statPoints').textContent = userData.points || 0;
    document.getElementById('statLevel').textContent = userData.level || 'Новичок';
    
    // Прогресс уроков
    const completedLessons = userData.completedLessons || [];
    document.getElementById('statLessons').textContent = `${completedLessons.length}/5`;
    document.getElementById('profileCompletedLessons').textContent = completedLessons.length;
    
    // Прогресс бар
    const progressPercent = (completedLessons.length / 5) * 100;
    document.getElementById('profileProgressFill').style.width = progressPercent + '%';
    
    // Дата регистрации
    if (userData.joinDate) {
        const joinDate = new Date(userData.joinDate);
        document.getElementById('joinDate').textContent = `Дата регистрации: ${joinDate.toLocaleDateString('ru-RU')}`;
    }
    
    // Достижения
    loadAchievements(userData.achievements || []);
    
    // Статистика
    updateLearningStats(userData, completedLessons);
}

// Загрузка достижений
function loadAchievements(achievements) {
    const achievementsList = document.getElementById('achievementsList');
    const allAchievements = [
        { id: 'first_lesson', name: 'Первый урок', icon: '🎉', description: 'Завершил первый урок программирования' },
        { id: 'button_master', name: 'Мастер кнопок', icon: '🔘', description: 'Освоил работу с кнопками и светодиодами' },
        { id: 'pwm_expert', name: 'Контроль яркости', icon: '💡', description: 'Научился управлять яркостью светодиодов' },
        { id: 'servo_master', name: 'Сервомастер', icon: '⚙️', description: 'Успешно работает с сервоприводами' },
        { id: 'sensor_expert', name: 'Ультразвуковой эксперт', icon: '📏', description: 'Освоил измерение расстояния' },
        { id: 'learning_complete', name: 'Основы Arduino', icon: '📚', description: 'Прошел базовое обучение языку' }
    ];
    
    if (!achievementsList) return;
    
    achievementsList.innerHTML = '';
    
    allAchievements.forEach(achievement => {
        const hasAchievement = achievements.includes(achievement.name);
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement-item ${hasAchievement ? 'achievement-earned' : 'achievement-locked'}`;
        achievementElement.innerHTML = `
            <span class="achievement-icon">${achievement.icon}</span>
            <div class="achievement-info">
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
            </div>
            <span class="achievement-status">${hasAchievement ? '✅' : '🔒'}</span>
        `;
        achievementsList.appendChild(achievementElement);
    });
}

// Обновление статистики обучения
function updateLearningStats(userData, completedLessons) {
    // Дата первого урока
    const firstLessonDate = document.getElementById('firstLessonDate');
    if (firstLessonDate) {
        firstLessonDate.textContent = completedLessons.length > 0 ? 'Пройден' : 'Не пройден';
    }
    
    // Статус обучения
    const learningStatus = document.getElementById('learningStatus');
    if (learningStatus) {
        learningStatus.textContent = userData.learningCompleted ? 'Да' : 'Нет';
    }
    
    // Статус активности
    const activityStatus = document.getElementById('activityStatus');
    if (activityStatus) {
        if (completedLessons.length >= 4) {
            activityStatus.textContent = 'Очень активный';
        } else if (completedLessons.length >= 3) {
            activityStatus.textContent = 'Активный';
        } else if (completedLessons.length >= 1) {
            activityStatus.textContent = 'Начинающий';
        } else {
            activityStatus.textContent = 'Новичок';
        }
    }
}

// Экспорт данных профиля
function exportProfileData() {
    const userData = getCurrentUserData();
    const currentUser = localStorage.getItem('currentUser');
    
    if (!userData || !currentUser) {
        alert('Нет данных для экспорта');
        return;
    }
    
    const exportData = {
        username: currentUser,
        exportDate: new Date().toISOString(),
        userData: userData
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `arduino-school-profile-${currentUser}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    alert('Данные профиля успешно экспортированы!');
}

// Инициализация профиля
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем данные профиля только если мы на странице профиля
    if (window.location.pathname.includes('profile.html')) {
        loadProfileData();
    }
});

// Глобальные функции
window.exportProfileData = exportProfileData;