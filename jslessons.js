// Глобальный объект для управления уроками
const Lessons = {
    // Инициализация урока
    initLesson(lessonNumber) {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            alert('Пожалуйста, войдите в систему');
            window.location.href = 'login.html';
            return;
        }
        
        const userData = DataManager.getUserData(currentUser);
        const completedLessons = userData?.completedLessons || [];
        
        // Проверяем доступ к уроку
        if (lessonNumber > 1 && !completedLessons.includes(lessonNumber - 1)) {
            alert(`Сначала пройди Урок ${lessonNumber - 1}!`);
            window.location.href = 'lessons.html';
            return;
        }
        
        console.log(`Урок ${lessonNumber} инициализирован для пользователя ${currentUser}`);
        
        // Устанавливаем фокус на редактор кода
        setTimeout(() => {
            const codeEditor = document.getElementById('codeEditor');
            if (codeEditor) {
                codeEditor.focus();
            }
        }, 500);
    },

    // Проверка кода для урока
    checkCode(lessonNumber) {
        const codeEditor = document.getElementById('codeEditor');
        if (!codeEditor) return false;

        const code = codeEditor.value;
        const result = document.getElementById('result');
        const message = document.getElementById('message');
        
        if (!code.trim()) {
            message.innerHTML = '❌ Введите код для проверки';
            message.className = 'error';
            result.classList.remove('hidden');
            return false;
        }
        
        const isCorrect = this.checkLessonCode(lessonNumber, code);
        
        if (isCorrect) {
            const successMessages = {
                1: '✅ Отлично! Код правильный! Светодиод будет мигать!',
                2: '✅ Отлично! Кнопка теперь управляет светодиодом!',
                3: '✅ Отлично! Светодиод теперь плавно меняет яркость!',
                4: '✅ Отлично! Сервопривод теперь плавно поворачивается!',
                5: '✅ Отлично! Система измерения расстояния готова!'
            };
            
            message.innerHTML = successMessages[lessonNumber] || '✅ Код правильный!';
            message.className = 'success';
            result.classList.remove('hidden');
            
        } else {
            const errorMessages = {
                1: '❌ Проверь, что ты использовал все нужные функции: pinMode, digitalWrite, delay',
                2: '❌ Используй digitalRead для чтения кнопки и if для проверки состояния',
                3: '❌ Используй analogWrite для ШИМ и for для плавного изменения',
                4: '❌ Не забудь подключить библиотеку Servo и использовать методы attach() и write()',
                5: '❌ Используй Serial для вывода, pulseIn для измерения времени и правильную формулу расчета расстояния'
            };
            
            message.innerHTML = errorMessages[lessonNumber] || '❌ Код содержит ошибки';
            message.className = 'error';
            result.classList.remove('hidden');
        }
        
        return isCorrect;
    },

    // Проверка кода для конкретного урока
    checkLessonCode(lessonNumber, code) {
        const normalizedCode = code.toLowerCase().replace(/\s/g, '');
        
        switch(lessonNumber) {
            case 1:
                return normalizedCode.includes('pinmode(13,output)') && 
                       (normalizedCode.includes('digitalwrite(13,high)') || normalizedCode.includes('digitalwrite(13,1)')) && 
                       (normalizedCode.includes('digitalwrite(13,low)') || normalizedCode.includes('digitalwrite(13,0)')) && 
                       normalizedCode.includes('delay(1000)');
            case 2:
                return normalizedCode.includes('digitalread(') && 
                       normalizedCode.includes('if(') && 
                       normalizedCode.includes('digitalwrite(');
            case 3:
                return normalizedCode.includes('analogwrite(') && 
                       normalizedCode.includes('for(');
            case 4:
                return normalizedCode.includes('#include<servo.h>') && 
                       normalizedCode.includes('servo') && 
                       normalizedCode.includes('.attach(') && 
                       normalizedCode.includes('.write(');
            case 5:
                return normalizedCode.includes('serial.begin(') && 
                       normalizedCode.includes('pulsein(') && 
                       normalizedCode.includes('serial.print(');
            default:
                return false;
        }
    },

    // Завершение урока
    completeLesson(lessonNumber) {
        const success = ArduinoSchoolApp.completeLesson(lessonNumber);
        if (success) {
            // Показываем дополнительное сообщение
            const messages = {
                1: '🎉 Ты сделал первый шаг в программировании Arduino!',
                2: '🎉 Теперь ты умеешь работать с кнопками и светодиодами!',
                3: '🎉 Потрясающе! Ты освоил ШИМ и управление яркостью!',
                4: '🎉 Великолепно! Сервоприводы теперь под твоим контролем!',
                5: '🎉 Фантастика! Ты стал настоящим экспертом по датчикам!'
            };
            
            setTimeout(() => {
                Utils.showNotification(messages[lessonNumber] || '🎉 Урок завершен!', 'success');
            }, 1000);
        }
        
        return success;
    },

    // Получение информации об уроке
    getLessonInfo(lessonNumber) {
        const lessons = {
            1: {
                title: 'Первая программа',
                description: 'Мигающий светодиод',
                difficulty: 'Начальный',
                estimatedTime: '10 минут',
                components: ['Arduino Uno', 'Светодиод'],
                objectives: [
                    'Понять структуру программы Arduino',
                    'Научиться использовать функции setup() и loop()',
                    'Освоить команды pinMode() и digitalWrite()'
                ]
            },
            2: {
                title: 'Светодиод и кнопка',
                description: 'Управление светодиодом с помощью кнопки',
                difficulty: 'Начальный',
                estimatedTime: '15 минут',
                components: ['Arduino Uno', 'Светодиод', 'Кнопка', 'Резистор 10кОм'],
                objectives: [
                    'Научиться читать состояние кнопки',
                    'Освоить команду digitalRead()',
                    'Использовать условные операторы if'
                ]
            },
            3: {
                title: 'ШИМ и яркость',
                description: 'Управление яркостью светодиода',
                difficulty: 'Средний',
                estimatedTime: '20 минут',
                components: ['Arduino Uno', 'Светодиод', 'Резистор 220Ом'],
                objectives: [
                    'Понять принцип работы ШИМ (PWM)',
                    'Освоить команду analogWrite()',
                    'Использовать циклы for для плавного изменения'
                ]
            },
            4: {
                title: 'Сервопривод',
                description: 'Управление сервомотором',
                difficulty: 'Средний',
                estimatedTime: '25 минут',
                components: ['Arduino Uno', 'Сервопривод'],
                objectives: [
                    'Научиться работать с библиотекой Servo',
                    'Освоить управление углом поворота сервопривода',
                    'Использовать плавное движение сервопривода'
                ]
            },
            5: {
                title: 'Ультразвуковой датчик',
                description: 'Измерение расстояния',
                difficulty: 'Продвинутый',
                estimatedTime: '30 минут',
                components: ['Arduino Uno', 'Ультразвуковой датчик HC-SR04'],
                objectives: [
                    'Научиться работать с ультразвуковым датчиком',
                    'Освоить измерение времени импульса',
                    'Использовать Serial для отладки'
                ]
            }
        };
        
        return lessons[lessonNumber] || null;
    },

    // Получение примера кода для урока
    getCodeExample(lessonNumber) {
        const examples = {
            1: `int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);
  delay(1000);
  digitalWrite(ledPin, LOW);
  delay(1000);
}`,
            2: `int buttonPin = 2;
int ledPin = 13;

void setup() {
  pinMode(buttonPin, INPUT);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  int buttonState = digitalRead(buttonPin);
  
  if (buttonState == HIGH) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }
}`,
            3: `int ledPin = 9;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  for (int brightness = 0; brightness <= 255; brightness++) {
    analogWrite(ledPin, brightness);
    delay(10);
  }
  
  for (int brightness = 255; brightness >= 0; brightness--) {
    analogWrite(ledPin, brightness);
    delay(10);
  }
}`,
            4: `#include <Servo.h>
Servo myServo;

void setup() {
  myServo.attach(9);
}

void loop() {
  for (int angle = 0; angle <= 180; angle++) {
    myServo.write(angle);
    delay(15);
  }
  
  for (int angle = 180; angle >= 0; angle--) {
    myServo.write(angle);
    delay(15);
  }
}`,
            5: `const int trigPin = 9;
const int echoPin = 10;

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  long duration = pulseIn(echoPin, HIGH);
  int distance = duration * 0.034 / 2;
  
  Serial.print("Расстояние: ");
  Serial.print(distance);
  Serial.println(" см");
  
  delay(500);
}`
        };
        
        return examples[lessonNumber] || '';
    }
};

// Глобальные функции для обратной совместимости
function initLesson(lessonNumber) {
    return Lessons.initLesson(lessonNumber);
}

function checkCode() {
    const currentPage = window.location.pathname.split('/').pop();
    let lessonNumber = 1;
    
    switch(currentPage) {
        case 'lesson1.html': lessonNumber = 1; break;
        case 'lesson2.html': lessonNumber = 2; break;
        case 'lesson3.html': lessonNumber = 3; break;
        case 'lesson4.html': lessonNumber = 4; break;
        case 'lesson5.html': lessonNumber = 5; break;
        default: lessonNumber = 1;
    }
    
    return Lessons.checkCode(lessonNumber);
}

function completeLesson(lessonNumber) {
    if (!lessonNumber) {
        const currentPage = window.location.pathname.split('/').pop();
        switch(currentPage) {
            case 'lesson1.html': lessonNumber = 1; break;
            case 'lesson2.html': lessonNumber = 2; break;
            case 'lesson3.html': lessonNumber = 3; break;
            case 'lesson4.html': lessonNumber = 4; break;
            case 'lesson5.html': lessonNumber = 5; break;
            default: lessonNumber = 1;
        }
    }
    
    return Lessons.completeLesson(lessonNumber);
}

function checkLessonCode(lessonNumber, code) {
    return Lessons.checkLessonCode(lessonNumber, code);
}

// Экспортируем объект Lessons в глобальную область видимости
window.Lessons = Lessons;
window.initLesson = initLesson;
window.checkCode = checkCode;
window.completeLesson = completeLesson;
window.checkLessonCode = checkLessonCode;