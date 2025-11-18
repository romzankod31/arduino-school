class Learning {
    static init() {
        console.log('Learning system initialized');
        this.loadModuleProgress();
    }

    static toggleModule(moduleId) {
        const moduleContent = document.getElementById(`${moduleId}-content`);
        const moduleCard = document.querySelector(`[data-module="${moduleId}"]`);
        
        if (moduleContent && moduleCard) {
            moduleContent.classList.toggle('hidden');
            moduleCard.classList.toggle('active');
            
            // Прокрутка к модулю при открытии
            if (!moduleContent.classList.contains('hidden')) {
                moduleContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }

    static nextStep(currentStep) {
        const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        const nextStepElement = document.querySelector(`[data-step="${currentStep + 1}"]`);
        
        if (currentStepElement && nextStepElement) {
            currentStepElement.classList.remove('active');
            currentStepElement.classList.add('hidden');
            
            nextStepElement.classList.remove('hidden');
            nextStepElement.classList.add('active');
            
            // Прокрутка к верху следующего шага
            nextStepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    static prevStep(currentStep) {
        const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        const prevStepElement = document.querySelector(`[data-step="${currentStep - 1}"]`);
        
        if (currentStepElement && prevStepElement) {
            currentStepElement.classList.remove('active');
            currentStepElement.classList.add('hidden');
            
            prevStepElement.classList.remove('hidden');
            prevStepElement.classList.add('active');
            
            // Прокрутка к верху предыдущего шага
            prevStepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    static completeModule(moduleId) {
        const userData = ArduinoSchoolApp.getUserData();
        if (!userData) {
            Utils.showNotification('Ошибка: данные пользователя не найдены', 'error');
            return;
        }

        // Добавляем модуль в завершенные
        if (!userData.completedModules) {
            userData.completedModules = [];
        }

        if (!userData.completedModules.includes(moduleId)) {
            userData.completedModules.push(moduleId);
            
            // Начисляем баллы за завершение модуля
            ArduinoSchoolApp.addPoints(15, `Модуль "${this.getModuleName(moduleId)}"`);
            
            // Обновляем прогресс
            DataManager.saveUserData(ArduinoSchoolApp.getCurrentUser(), userData);
            
            // Показываем уведомление
            Utils.showNotification(`🎉 Модуль "${this.getModuleName(moduleId)}" завершен! +15 баллов`, 'success');
            
            // Обновляем статус модуля
            this.updateModuleStatus(moduleId, 'completed');
            
            // Закрываем модуль
            this.toggleModule(moduleId);
        }
    }

    static getModuleName(moduleId) {
        const moduleNames = {
            'what-is-arduino': 'Что такое Arduino?'
        };
        return moduleNames[moduleId] || moduleId;
    }

    static updateModuleStatus(moduleId, status) {
        const moduleCard = document.querySelector(`[data-module="${moduleId}"]`);
        if (moduleCard) {
            const statusElement = moduleCard.querySelector('.module-status');
            if (statusElement) {
                if (status === 'completed') {
                    statusElement.textContent = '✅ Завершено';
                    statusElement.style.background = 'var(--success-color)';
                }
            }
        }
    }

    static loadModuleProgress() {
        const userData = ArduinoSchoolApp.getUserData();
        if (userData && userData.completedModules) {
            userData.completedModules.forEach(moduleId => {
                this.updateModuleStatus(moduleId, 'completed');
            });
        }
    }

    // Проверка доступности модуля
    static isModuleAvailable(moduleId) {
        const userData = ArduinoSchoolApp.getUserData();
        if (!userData) return false;

        // Здесь можно добавить логику зависимости модулей
        // Например, модуль доступен только после завершения предыдущих
        return true;
    }
}

window.Learning = Learning;

// ==================== 
// КЛАСС ДЛЯ УПРАВЛЕНИЯ ОБУЧЕНИЕМ
// ====================
class Learning {
    static init() {
        console.log('Learning system initialized');
        this.loadModuleProgress();
    }

    // Переключение модулей
    // В файле jslearning.js замените функцию toggleModule:

static toggleModule(moduleId) {
    const moduleContent = document.getElementById(`${moduleId}-content`);
    const moduleCard = document.querySelector(`[data-module="${moduleId}"]`);
    
    if (moduleContent && moduleCard) {
        // Переключаем видимость контента
        moduleContent.classList.toggle('hidden');
        
        // Переключаем активное состояние карточки
        moduleCard.classList.toggle('active');
        
        // Закрываем другие открытые модули
        document.querySelectorAll('.module-card').forEach(card => {
            if (card !== moduleCard && card.classList.contains('active')) {
                card.classList.remove('active');
                const otherContent = document.getElementById(`${card.dataset.module}-content`);
                if (otherContent) otherContent.classList.add('hidden');
            }
        });
    }
}

// Также обновите функции nextStep и prevStep чтобы они принимали moduleId:
static nextStep(moduleId, currentStep) {
    const currentStepElement = document.querySelector(`#${moduleId}-content [data-step="${currentStep}"]`);
    const nextStepElement = document.querySelector(`#${moduleId}-content [data-step="${currentStep + 1}"]`);
    
    if (currentStepElement && nextStepElement) {
        currentStepElement.classList.remove('active');
        currentStepElement.classList.add('hidden');
        
        nextStepElement.classList.remove('hidden');
        nextStepElement.classList.add('active');
    }
}

static prevStep(moduleId, currentStep) {
    const currentStepElement = document.querySelector(`#${moduleId}-content [data-step="${currentStep}"]`);
    const prevStepElement = document.querySelector(`#${moduleId}-content [data-step="${currentStep - 1}"]`);
    
    if (currentStepElement && prevStepElement) {
        currentStepElement.classList.remove('active');
        currentStepElement.classList.add('hidden');
        
        prevStepElement.classList.remove('hidden');
        prevStepElement.classList.add('active');
    }
}

    // Выбор операционной системы
    static selectOS(osType) {
        document.querySelectorAll('.os-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        const selectedOption = document.querySelector(`.os-option[onclick*="${osType}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
        
        const nextButton = document.getElementById('nextStep2');
        if (nextButton) {
            nextButton.disabled = false;
        }
        
        Utils.showNotification(`Выбрана ${this.getOSName(osType)}! 🎯`, 'success');
    }

    static getOSName(osType) {
        const osNames = {
            'windows': 'Windows 🪟',
            'mac': 'Mac OS 🍎', 
            'linux': 'Linux 🐧'
        };
        return osNames[osType] || osType;
    }

    // Завершение модуля
    static completeModule(moduleId) {
        const userData = ArduinoSchoolApp.getUserData();
        if (!userData) return;

        if (!userData.completedModules) {
            userData.completedModules = [];
        }

        if (!userData.completedModules.includes(moduleId)) {
            userData.completedModules.push(moduleId);
            
            // Начисляем баллы
            ArduinoSchoolApp.addPoints(15, `Модуль "${this.getModuleName(moduleId)}"`);
            
            DataManager.saveUserData(ArduinoSchoolApp.getCurrentUser(), userData);
            
            Utils.showNotification(`🎉 Модуль "${this.getModuleName(moduleId)}" завершен! +15 баллов`, 'success');
            
            this.updateModuleStatus(moduleId, 'completed');
            this.toggleModule(moduleId);
        }
    }

    static getModuleName(moduleId) {
        const moduleNames = {
            'what-is-arduino': 'Что такое Arduino?',
            'install-arduino-ide': 'Установка Arduino IDE',
            'install-arduino-driver': 'Установка драйверов Arduino',
            'work-with-arduino-ide': 'Работа с Arduino IDE'
        };
        return moduleNames[moduleId] || moduleId;
    }

    static updateModuleStatus(moduleId, status) {
        const moduleCard = document.querySelector(`[data-module="${moduleId}"]`);
        if (moduleCard) {
            const statusElement = moduleCard.querySelector('.module-status');
            if (statusElement && status === 'completed') {
                statusElement.textContent = '✅ Завершено';
                statusElement.style.background = 'var(--success-color)';
            }
        }
    }

    static loadModuleProgress() {
        const userData = ArduinoSchoolApp.getUserData();
        if (userData && userData.completedModules) {
            userData.completedModules.forEach(moduleId => {
                this.updateModuleStatus(moduleId, 'completed');
            });
        }
    }
}

// ====================
// КЛАСС ДЛЯ СИМУЛЯЦИИ УСТАНОВКИ ДРАЙВЕРОВ
// ====================
class DriverSimulation {
    static installDriver() {
        const installButton = document.querySelector('.install-button-driver');
        const statusElement = document.getElementById('installStatus');
        
        if (installButton && statusElement) {
            installButton.disabled = true;
            installButton.textContent = 'Установка...';
            statusElement.textContent = '⏳ Устанавливаем драйвер...';
            statusElement.style.color = '#ed8936';
            
            setTimeout(() => {
                statusElement.textContent = '✅ Драйвер успешно установлен!';
                statusElement.style.color = '#48bb78';
                installButton.textContent = 'УСТАНОВЛЕНО';
                installButton.style.background = '#48bb78';
                
                Utils.showNotification('Драйвер CH341 успешно установлен! 🎉', 'success');
            }, 2000);
        }
    }
}

// ====================
// КЛАСС ДЛЯ СИМУЛЯЦИИ РАБОТЫ С IDE
// ====================
class IDESimulation {
    static togglePorts() {
        const portsList = document.getElementById('portsList');
        const categoryHeader = document.querySelector('.dm-category-header');
        
        if (portsList && categoryHeader) {
            if (portsList.style.display === 'none') {
                portsList.style.display = 'block';
                categoryHeader.innerHTML = '🔽 Порты (COM и LPT)';
            } else {
                portsList.style.display = 'none';
                categoryHeader.innerHTML = '▶️ Порты (COM и LPT)';
            }
        }
    }

    static showPortsDropdown() {
        const dropdown = document.getElementById('portsDropdown');
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
    }

    static selectPort(port) {
        const dropdown = document.getElementById('portsDropdown');
        const allItems = document.querySelectorAll('.dropdown-item');
        
        allItems.forEach(item => item.classList.remove('selected'));
        
        const selectedItem = document.querySelector(`.dropdown-item[onclick*="${port}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
        }
        
        if (dropdown) dropdown.style.display = 'none';
        Utils.showNotification(`Выбран порт: ${port} ✅`, 'success');
    }

    static showBoardsDropdown() {
        const dropdown = document.getElementById('boardsDropdown');
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
    }

    static selectBoard(boardType) {
        const dropdown = document.getElementById('boardsDropdown');
        const allOptions = document.querySelectorAll('.board-option');
        
        allOptions.forEach(option => {
            option.classList.remove('selected');
            option.innerHTML = option.innerHTML.replace(' ✅', '');
        });
        
        const selectedOption = document.querySelector(`.board-option[onclick*="${boardType}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
            selectedOption.innerHTML += ' ✅';
        }
        
        if (dropdown) dropdown.style.display = 'none';
        
        const boardNames = {'uno': 'Arduino Uno'};
        Utils.showNotification(`Выбрана плата: ${boardNames[boardType]} ✅`, 'success');
    }
}

// Экспорт в глобальную область видимости
window.Learning = Learning;
window.DriverSimulation = DriverSimulation;
window.IDESimulation = IDESimulation;