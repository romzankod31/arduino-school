class DataManager {
    static initialize() {
        if (!localStorage.getItem('registeredUsers')) {
            localStorage.setItem('registeredUsers', JSON.stringify({}));
        }
        if (!localStorage.getItem('userSettings')) {
            localStorage.setItem('userSettings', JSON.stringify({
                theme: 'auto',
                fontSize: 'medium',
                bgColor: '#667eea'
            }));
        }
        if (!localStorage.getItem('demoAccountsData')) {
            localStorage.setItem('demoAccountsData', JSON.stringify({
                'arduino_123': { 
                    points: 0, 
                    completedLessons: [], 
                    level: 'Новичок',
                    joinDate: new Date().toISOString(),
                    achievements: [],
                    learningCompleted: false
                },
                'novice': { 
                    points: 10, 
                    completedLessons: [1], 
                    level: 'Начинающий',
                    joinDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    achievements: ['first_lesson'],
                    learningCompleted: false
                },
                'student': { 
                    points: 20, 
                    completedLessons: [1, 2, 3], 
                    level: 'Опытный',
                    joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    achievements: ['first_lesson', 'button_master', 'pwm_expert'],
                    learningCompleted: false
                },
                'pro': { 
                    points: 30, 
                    completedLessons: [1, 2, 3, 4], 
                    level: 'Продвинутый',
                    joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
                    achievements: ['first_lesson', 'button_master', 'pwm_expert', 'servo_master'],
                    learningCompleted: false
                }
            }));
        }
        
        // Инициализируем тему если её нет
        const settings = this.getSettings();
        if (!settings.theme) {
            settings.theme = 'auto';
            localStorage.setItem('userSettings', JSON.stringify(settings));
        }
        
        console.log('✅ Data Manager initialized');
    }

    static getSettings() {
        try {
            return JSON.parse(localStorage.getItem('userSettings') || '{}');
        } catch (error) {
            console.error('Error parsing settings:', error);
            return {};
        }
    }

    static updateSetting(key, value) {
        const settings = this.getSettings();
        settings[key] = value;
        try {
            localStorage.setItem('userSettings', JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    }

    static getUserData(username) {
        if (!username) return null;
        const userKey = `user_${username}`;
        try {
            const data = localStorage.getItem(userKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }

    static saveUserData(username, data) {
        if (!username || !data) return false;
        const userKey = `user_${username}`;
        try {
            localStorage.setItem(userKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving user data:', error);
            return false;
        }
    }

    static createUserData(username) {
        const userData = {
            points: 0,
            completedLessons: [],
            learningCompleted: false,
            level: 'Новичок',
            joinDate: new Date().toISOString(),
            achievements: [],
            lastActive: new Date().toISOString()
        };
        this.saveUserData(username, userData);
        return userData;
    }

    static exportData() {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            Utils.showNotification('Нет данных для экспорта', 'error');
            return;
        }

        try {
            const backup = {
                version: '2.0.0',
                user: currentUser,
                userData: this.getUserData(currentUser) || {},
                settings: this.getSettings(),
                demoAccounts: JSON.parse(localStorage.getItem('demoAccountsData') || '{}'),
                registeredUsers: JSON.parse(localStorage.getItem('registeredUsers') || '{}'),
                timestamp: new Date().toISOString(),
                exportType: 'arduino_school_backup'
            };

            const dataStr = JSON.stringify(backup, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `arduino-school-backup-${currentUser}-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
            Utils.showNotification('Данные успешно экспортированы!', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            Utils.showNotification('Ошибка при экспорте данных', 'error');
        }
    }

    static importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const backup = JSON.parse(e.target.result);
                    
                    // Проверяем валидность backup файла
                    if (!backup.user || !backup.userData || !backup.settings) {
                        throw new Error('Неверный формат файла backup');
                    }
                    
                    // Восстанавливаем данные
                    if (backup.userData) {
                        DataManager.saveUserData(backup.user, backup.userData);
                    }
                    
                    if (backup.settings) {
                        localStorage.setItem('userSettings', JSON.stringify(backup.settings));
                    }
                    
                    if (backup.demoAccounts) {
                        localStorage.setItem('demoAccountsData', JSON.stringify(backup.demoAccounts));
                    }
                    
                    if (backup.registeredUsers) {
                        localStorage.setItem('registeredUsers', JSON.stringify(backup.registeredUsers));
                    }
                    
                    localStorage.setItem('currentUser', backup.user);
                    resolve(backup);
                    
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = function() {
                reject(new Error('Ошибка чтения файла'));
            };
            
            reader.readAsText(file);
        });
    }

    static clearAllData() {
        if (confirm('ВНИМАНИЕ! Это удалит ВСЕ данные приложения, включая все аккаунты, настройки и прогресс. Это действие НЕОБРАТИМО. Продолжить?')) {
            const confirmation = prompt('Для подтверждения введите "УДАЛИТЬ ВСЕ":');
            if (confirmation === 'УДАЛИТЬ ВСЕ') {
                localStorage.clear();
                Utils.showNotification('Все данные успешно удалены!', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                return true;
            } else {
                Utils.showNotification('Удаление отменено', 'info');
                return false;
            }
        }
        return false;
    }

    static getStorageUsage() {
        let totalSize = 0;
        
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage[key].length * 2; // UTF-16 символы занимают 2 байта
            }
        }
        
        return {
            bytes: totalSize,
            kilobytes: (totalSize / 1024).toFixed(2),
            megabytes: (totalSize / 1024 / 1024).toFixed(2)
        };
    }

    static getAllUsers() {
        try {
            return JSON.parse(localStorage.getItem('registeredUsers') || '{}');
        } catch (error) {
            console.error('Error parsing users:', error);
            return {};
        }
    }

    static userExists(username) {
        const users = this.getAllUsers();
        return !!users[username];
    }

    static validatePassword(username, password) {
        const users = this.getAllUsers();
        const user = users[username];
        return user && user.password === password;
    }
}

window.DataManager = DataManager;