class UserInterface {
    static updateLessonStatus() {
        const userData = ArduinoSchoolApp.getUserData();
        if (!userData) return;

        const completedLessons = userData.completedLessons || [];
        
        for (let i = 1; i <= 5; i++) {
            const statusElement = document.getElementById(`lesson${i}Status`);
            if (statusElement) {
                if (completedLessons.includes(i)) {
                    statusElement.textContent = '✅';
                    statusElement.className = 'lesson-status completed';
                    const lessonSquare = document.querySelector(`.lesson-square[data-lesson="${i}"]`);
                    if (lessonSquare) {
                        lessonSquare.classList.add('completed');
                        lessonSquare.classList.remove('locked');
                    }
                } else if (i === 1 || completedLessons.includes(i - 1)) {
                    statusElement.textContent = '🎯';
                    statusElement.className = 'lesson-status available';
                    const lessonSquare = document.querySelector(`.lesson-square[data-lesson="${i}"]`);
                    if (lessonSquare) {
                        lessonSquare.classList.remove('completed', 'locked');
                    }
                } else {
                    statusElement.textContent = '🔒';
                    statusElement.className = 'lesson-status locked';
                    const lessonSquare = document.querySelector(`.lesson-square[data-lesson="${i}"]`);
                    if (lessonSquare) {
                        lessonSquare.classList.add('locked');
                        lessonSquare.classList.remove('completed');
                    }
                }
            }
        }
    }

    static openLesson(lessonNumber) {
        const userData = ArduinoSchoolApp.getUserData();
        if (!userData) {
            Utils.showNotification('Пожалуйста, войдите в систему', 'error');
            return;
        }

        if (lessonNumber > 1 && !userData.completedLessons.includes(lessonNumber - 1)) {
            Utils.showNotification(`Сначала пройди Урок ${lessonNumber - 1}`, 'warning');
            return;
        }

        window.location.href = `lesson${lessonNumber}.html`;
    }

    static loadTheme() {
        const settings = DataManager.getSettings();
        const userTheme = localStorage.getItem('userTheme') || settings.theme || 'auto';
        
        // Сохраняем текущую тему в настройках
        if (userTheme !== settings.theme) {
            DataManager.updateSetting('theme', userTheme);
        }
        
        let appliedTheme = userTheme;
        if (userTheme === 'auto') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            appliedTheme = isDark ? 'dark' : 'light';
        }
        
        document.documentElement.setAttribute('data-theme', appliedTheme);
        
        // Применяем кастомный цвет фона
        this.loadBackgroundColor();

        // Обновляем селектор темы в настройках если есть элемент
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = userTheme;
        }
    }

    static loadBackgroundColor() {
        const settings = DataManager.getSettings();
        const bgColor = settings.bgColor || '#667eea';
        
        document.documentElement.style.setProperty('--primary-color', bgColor);
        document.documentElement.style.setProperty('--primary-dark', this.darkenColor(bgColor, 20));
        
        // Обновляем значение в настройках если есть элемент
        const bgColorInput = document.getElementById('bgColor');
        const bgColorValue = document.getElementById('bgColorValue');
        
        if (bgColorInput) bgColorInput.value = bgColor;
        if (bgColorValue) bgColorValue.textContent = bgColor;
    }

    static darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    static loadAchievements() {
        const userData = ArduinoSchoolApp.getUserData();
        if (!userData) {
            console.log('No user data for achievements');
            return;
        }

        const achievementsGrid = document.getElementById('achievementsGrid');
        if (!achievementsGrid) {
            console.log('Achievements grid element not found');
            return;
        }

        const achievements = this.getAchievementsData();
        const userAchievements = userData.achievements || [];
        
        console.log('Loading achievements:', {
            userAchievements: userAchievements,
            allAchievements: achievements.map(a => a.id)
        });
        
        achievementsGrid.innerHTML = achievements.map(achievement => {
            const isEarned = userAchievements.includes(achievement.id);
            
            return `
                <div class="achievement-item ${isEarned ? 'earned' : 'locked'}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-info">
                        <h4>${achievement.name}</h4>
                        <p>${achievement.description}</p>
                    </div>
                    <div class="achievement-status">${isEarned ? '✅' : '🔒'}</div>
                </div>
            `;
        }).join('');
    }

    static loadProfileAchievements() {
        const userData = ArduinoSchoolApp.getUserData();
        if (!userData) {
            console.log('No user data for profile achievements');
            return;
        }

        const achievementsGrid = document.getElementById('profileAchievements');
        if (!achievementsGrid) {
            console.log('Profile achievements element not found');
            return;
        }

        const achievements = this.getAchievementsData();
        const userAchievements = userData.achievements || [];
        
        const earnedCount = userAchievements.length;
        const totalCount = achievements.length;
        
        console.log('Loading profile achievements:', {
            earned: earnedCount,
            total: totalCount,
            userAchievements: userAchievements
        });
        
        achievementsGrid.innerHTML = `
            <div class="achievements-header">
                <span>Получено: ${earnedCount}/${totalCount}</span>
            </div>
            <div class="achievements-list">
                ${achievements.map(achievement => {
                    const isEarned = userAchievements.includes(achievement.id);
                    
                    return `
                        <div class="achievement-item ${isEarned ? 'earned' : 'locked'}">
                            <div class="achievement-icon">${achievement.icon}</div>
                            <div class="achievement-info">
                                <h4>${achievement.name}</h4>
                                <p>${achievement.description}</p>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    static getAchievementsData() {
        return [
            {
                id: 'first_lesson',
                name: 'Первые шаги',
                description: 'Заверши первый урок программирования',
                icon: '🚀',
                lesson: 1
            },
            {
                id: 'button_master',
                name: 'Мастер кнопок',
                description: 'Освоил работу с кнопками и светодиодами',
                icon: '🔘',
                lesson: 2
            },
            {
                id: 'pwm_expert',
                name: 'Контроль яркости',
                description: 'Научился управлять яркостью светодиодов',
                icon: '💡',
                lesson: 3
            },
            {
                id: 'servo_master',
                name: 'Сервомастер',
                description: 'Успешно работает с сервоприводами',
                icon: '⚙️',
                lesson: 4
            },
            {
                id: 'sensor_expert',
                name: 'Ультразвуковой эксперт',
                description: 'Освоил измерение расстояния',
                icon: '📏',
                lesson: 5
            },
            {
                id: 'arduino_basics',
                name: 'Основы Arduino',
                description: 'Прошел базовое обучение языку',
                icon: '📚',
                lesson: 'learn'
            },
            {
                id: 'fast_learner',
                name: 'Быстрый ученик',
                description: 'Завершил 3 урока за короткое время',
                icon: '⚡',
                lesson: 'special'
            },
            {
                id: 'perfect_score',
                name: 'Идеальный результат',
                description: 'Набрал максимальное количество баллов',
                icon: '🏆',
                lesson: 'special'
            }
        ];
    }

    static checkAndAwardAchievement(achievementId, userData) {
        const achievements = userData.achievements || [];
        
        if (!achievements.includes(achievementId)) {
            achievements.push(achievementId);
            userData.achievements = achievements;
            
            const achievementData = this.getAchievementsData().find(a => a.id === achievementId);
            if (achievementData) {
                Utils.showNotification(`🏆 Получено достижение: ${achievementData.name}`, 'success');
                
                // Показываем всплывающее окно с достижением
                this.showAchievementPopup(achievementData);
                
                // Обновляем отображение достижений
                this.loadAchievements();
                this.loadProfileAchievements();
            }
            
            return true;
        }
        
        return false;
    }

    static showAchievementPopup(achievement) {
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.innerHTML = `
            <div class="achievement-popup-content">
                <div class="achievement-popup-icon">${achievement.icon}</div>
                <h3>Новое достижение!</h3>
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
                <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">Отлично!</button>
            </div>
        `;
        
        popup.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        
        document.body.appendChild(popup);
        
        // Автоматическое закрытие через 5 секунд
        setTimeout(() => {
            if (popup.parentNode) {
                popup.remove();
            }
        }, 5000);
    }

    static updateProgressBars() {
        const userData = ArduinoSchoolApp.getUserData();
        if (!userData) return;

        const completedLessons = userData.completedLessons || [];
        const progress = (completedLessons.length / 5) * 100;
        
        const progressBars = [
            document.getElementById('progressFill'),
            document.getElementById('profileProgressFill')
        ];
        
        progressBars.forEach(bar => {
            if (bar) {
                bar.style.width = progress + '%';
            }
        });
    }
}

// Добавляем стили для анимаций
const uiStyles = document.createElement('style');
uiStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .achievement-popup-content {
        background: white;
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        max-width: 400px;
        width: 90%;
        animation: slideUp 0.5s ease;
    }
    
    @keyframes slideUp {
        from { transform: translateY(50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    .achievement-popup-icon {
        font-size: 4em;
        margin-bottom: 20px;
    }
    
    .achievement-popup-content h3 {
        color: #667eea;
        margin-bottom: 10px;
    }
    
    .achievement-popup-content h4 {
        color: #2d3748;
        margin-bottom: 15px;
        font-size: 1.5em;
    }
    
    .achievement-popup-content p {
        color: #718096;
        margin-bottom: 20px;
    }
`;
document.head.appendChild(uiStyles);

window.UserInterface = UserInterface;