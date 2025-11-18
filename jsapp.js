class ArduinoSchoolApp {
    constructor() {
        this.currentUser = null;
        this.userData = null;
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;

        try {
            // Инициализируем менеджер данных
            DataManager.initialize();
            
            // Загружаем пользователя только если он авторизован
            await this.loadUserData();
            
            this.isInitialized = true;
            console.log('🚀 Arduino School App 2.0 initialized');
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            // Не показываем уведомление об ошибке на странице входа
            if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
                Utils.showNotification('Ошибка инициализации приложения', 'error');
            }
        }
    }

    async loadUserData() {
        const username = localStorage.getItem('currentUser');
        if (!username) {
            // Если пользователь не авторизован, это нормально на страницах входа/регистрации
            if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
                return;
            }
            // На других страницах перенаправляем на вход
            window.location.href = 'login.html';
            return;
        }

        this.currentUser = username;
        this.userData = DataManager.getUserData(username);
        
        if (!this.userData) {
            this.userData = DataManager.createUserData(username);
        }
    }

    static getInstance() {
        if (!ArduinoSchoolApp.instance) {
            ArduinoSchoolApp.instance = new ArduinoSchoolApp();
        }
        return ArduinoSchoolApp.instance;
    }

    static getCurrentUser() {
        const app = ArduinoSchoolApp.getInstance();
        return app.currentUser;
    }

    static getUserData() {
        const app = ArduinoSchoolApp.getInstance();
        return app.userData;
    }

    static getSettings() {
        return DataManager.getSettings();
    }

    static loadProfileData() {
        const userData = this.getUserData();
        const currentUser = this.getCurrentUser();
        
        if (!userData || !currentUser) return;
        
        const profileElements = {
            'profileUsername': currentUser,
            'statPoints': userData.points || 0,
            'statLevel': userData.level || 'Новичок',
            'statLessons': `${userData.completedLessons?.length || 0}/5`,
            'profileCompletedLessons': userData.completedLessons?.length || 0,
            'userWelcome': currentUser ? `Привет, ${currentUser}!` : 'Добро пожаловать!',
            'totalPoints': userData.points || 0,
            'userLevel': userData.level || 'Новичок',
            'completedLessons': userData.completedLessons?.length || 0
        };
        
        Object.entries(profileElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
        
        const progressFill = document.getElementById('progressFill');
        const profileProgressFill = document.getElementById('profileProgressFill');
        const progress = ((userData.completedLessons?.length || 0) / 5) * 100;
        
        if (progressFill) progressFill.style.width = progress + '%';
        if (profileProgressFill) profileProgressFill.style.width = progress + '%';
        
        const joinDateElement = document.getElementById('joinDate');
        if (joinDateElement && userData.joinDate) {
            const joinDate = new Date(userData.joinDate);
            joinDateElement.textContent = `Дата регистрации: ${joinDate.toLocaleDateString('ru-RU')}`;
        }
        
        // Обновляем статус уроков
        UserInterface.updateLessonStatus();
    }
    
    static loadSettings() {
        const settings = this.getSettings();
        const themeSelect = document.getElementById('themeSelect');
        const fontSize = document.getElementById('fontSize');
        const bgColorInput = document.getElementById('bgColor');
        const bgColorValue = document.getElementById('bgColorValue');
        
        if (themeSelect) themeSelect.value = settings.theme || 'auto';
        if (fontSize) fontSize.value = settings.fontSize || 'medium';
        if (bgColorInput) bgColorInput.value = settings.bgColor || '#667eea';
        if (bgColorValue) bgColorValue.textContent = settings.bgColor || '#667eea';
    }
    
    static changeTheme(theme) {
        DataManager.updateSetting('theme', theme);
        localStorage.setItem('userTheme', theme);
        UserInterface.loadTheme();
        Utils.showNotification(`Тема изменена на: ${theme === 'auto' ? 'Авто' : theme === 'light' ? 'Светлая' : 'Темная'}`, 'success');
    }
    
    static changeBackgroundColor(color) {
        DataManager.updateSetting('bgColor', color);
        UserInterface.loadBackgroundColor();
        Utils.showNotification('Цвет фона изменен', 'success');
    }
    
    static changeFontSize(size) {
        DataManager.updateSetting('fontSize', size);
        const fontSize = size === 'small' ? '14px' : size === 'large' ? '18px' : '16px';
        document.documentElement.style.fontSize = fontSize;
        Utils.showNotification(`Размер шрифта изменен на: ${size === 'small' ? 'Маленький' : size === 'large' ? 'Большой' : 'Средний'}`, 'success');
    }
    
    static exportData() {
        DataManager.exportData();
    }
    
    static resetProgress() {
        if (confirm('ВНИМАНИЕ! Вы уверены, что хотите сбросить прогресс?\n\nВсе ваши достижения, баллы и пройденные уроки будут удалены. Это действие нельзя отменить.')) {
            const userData = this.getUserData();
            if (userData) {
                userData.completedLessons = [];
                userData.achievements = [];
                userData.points = 0;
                userData.level = 'Новичок';
                userData.learningCompleted = false;
                
                DataManager.saveUserData(this.getCurrentUser(), userData);
                this.loadProfileData();
                UserInterface.updateLessonStatus();
                UserInterface.loadAchievements();
                Utils.showNotification('Прогресс успешно сброшен!', 'success');
            }
        }
    }

    static addPoints(points, reason = '') {
        const userData = this.getUserData();
        if (!userData) {
            console.warn('Cannot add points: no user data');
            return 0;
        }

        userData.points = (userData.points || 0) + points;
        
        // Обновляем уровень
        const oldLevel = userData.level;
        if (userData.points >= 100) userData.level = 'Эксперт';
        else if (userData.points >= 50) userData.level = 'Продвинутый';
        else if (userData.points >= 25) userData.level = 'Опытный';
        else if (userData.points >= 10) userData.level = 'Начинающий';
        else userData.level = 'Новичок';
        
        // Проверяем, изменился ли уровень
        if (oldLevel !== userData.level) {
            Utils.showNotification(`🎉 Поздравляем! Вы достигли уровня: ${userData.level}`, 'success');
        }
        
        DataManager.saveUserData(this.getCurrentUser(), userData);
        this.loadProfileData();
        
        if (reason) {
            Utils.showNotification(`+${points} баллов! ${reason}`, 'success');
        }
        
        return userData.points;
    }

    static completeLesson(lessonId) {
        const userData = this.getUserData();
        if (!userData) {
            console.warn('Cannot complete lesson: no user data');
            return false;
        }

        const completedLessons = userData.completedLessons || [];
        if (!completedLessons.includes(lessonId)) {
            completedLessons.push(lessonId);
            userData.completedLessons = completedLessons;
            
            // Начисляем баллы
            this.addPoints(10, `Урок ${lessonId}`);
            
            // Проверяем достижения
            this.checkLessonAchievements(lessonId, userData);
            
            DataManager.saveUserData(this.getCurrentUser(), userData);
            
            // Обновляем прогресс
            UserInterface.updateProgressBars();
            
            Utils.showNotification(`🎉 Урок ${lessonId} завершен! +10 баллов`, 'success');
            return true;
        }
        
        return false;
    }

    static checkLessonAchievements(lessonId, userData) {
        const achievements = {
            1: 'first_lesson',
            2: 'button_master', 
            3: 'pwm_expert',
            4: 'servo_master',
            5: 'sensor_expert'
        };

        if (achievements[lessonId]) {
            UserInterface.checkAndAwardAchievement(achievements[lessonId], userData);
        }

        // Проверяем достижение "Основы Arduino"
        if (userData.completedLessons.length >= 3 && !userData.achievements.includes('arduino_basics')) {
            UserInterface.checkAndAwardAchievement('arduino_basics', userData);
        }

        // Проверяем достижение "Идеальный результат"
        if (userData.points >= 100 && !userData.achievements.includes('perfect_score')) {
            UserInterface.checkAndAwardAchievement('perfect_score', userData);
        }

        // Проверяем достижение "Быстрый ученик"
        this.checkFastLearnerAchievement(userData);
    }

    static checkFastLearnerAchievement(userData) {
        // Для демонстрации считаем, что достижение доступно после 3 уроков
        if (userData.completedLessons.length >= 3 && !userData.achievements.includes('fast_learner')) {
            UserInterface.checkAndAwardAchievement('fast_learner', userData);
        }
    }

    static isAuthenticated() {
        return !!localStorage.getItem('currentUser');
    }
}

// Безопасная инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    // Всегда загружаем тему
    UserInterface.loadTheme();
    
    // Инициализируем приложение только если это не страница входа/регистрации
    // или если пользователь уже авторизован
    const isAuthPage = window.location.pathname.includes('login.html') || 
                      window.location.pathname.includes('register.html');
    
    if (!isAuthPage || ArduinoSchoolApp.isAuthenticated()) {
        ArduinoSchoolApp.getInstance().initialize().catch(error => {
            console.error('App initialization failed:', error);
        });
    }
});

window.ArduinoSchoolApp = ArduinoSchoolApp;