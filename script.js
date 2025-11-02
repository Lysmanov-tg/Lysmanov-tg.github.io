// Определяем устройство
function isMobile() {
    return window.innerWidth <= 768;
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 LYSMANOV Site Started');
    
    try {
        // Сначала обновляем прогресс-бары
        updateAllStats();
        
        // Показываем правильную версию
        checkVersion();
        
        // Общие функции
        initCommonFeatures();
        
        // Слушаем изменение размера окна
        window.addEventListener('resize', checkVersion);
        
    } catch (error) {
        console.error('Ошибка инициализации:', error);
    }
});

// Проверка и показ правильной версии
function checkVersion() {
    try {
        const mobileVersion = document.querySelector('.mobile-version');
        const desktopVersion = document.querySelector('.desktop-version');
        
        if (!mobileVersion || !desktopVersion) {
            console.error('Не найдены версии сайта');
            return;
        }
        
        if (isMobile()) {
            console.log('📱 Mobile version');
            mobileVersion.style.display = 'block';
            desktopVersion.style.display = 'none';
            initMobileVersion();
        } else {
            console.log('💻 Desktop version');
            mobileVersion.style.display = 'none';
            desktopVersion.style.display = 'flex';
            initDesktopVersion();
        }
    } catch (error) {
        console.error('Ошибка checkVersion:', error);
    }
}

// Мобильная версия
function initMobileVersion() {
    console.log('📱 Mobile version initialized');
    try {
        startMobileCountdown();
        initMobileNavigation();
    } catch (error) {
        console.error('Ошибка initMobileVersion:', error);
    }
}

// ПК версия  
function initDesktopVersion() {
    console.log('💻 Desktop version initialized');
    try {
        animateDesktopText();
        startDesktopCountdown();
    } catch (error) {
        console.error('Ошибка initDesktopVersion:', error);
    }
}

// Общие функции
function initCommonFeatures() {
    try {
        initParticles();
    } catch (error) {
        console.error('Ошибка initCommonFeatures:', error);
    }
}

// ОБНОВЛЕНИЕ ВСЕХ ПРОГРЕСС-БАРОВ
function updateAllStats() {
    try {
        const subscribers = 51;
        const posts = 484;
        
        // Ждем немного чтобы элементы точно были в DOM
        setTimeout(() => {
            // Мобильные элементы
            const mobileSubsProgress = document.getElementById('mobile-subs-progress');
            const mobilePostsProgress = document.getElementById('mobile-posts-progress');
            const mobileSubsText = document.getElementById('mobile-subs-text');
            const mobilePostsText = document.getElementById('mobile-posts-text');
            
            // ПК элементы
            const desktopSubsProgress = document.getElementById('subscribers-progress');
            const desktopPostsProgress = document.getElementById('posts-progress');
            const desktopSubsText = document.getElementById('subscribers-text');
            const desktopPostsText = document.getElementById('posts-text');
            
            // Обновляем мобильные прогресс-бары
            if (mobileSubsProgress) {
                mobileSubsProgress.style.width = '51%';
                mobileSubsProgress.style.transition = 'width 2s ease-in-out';
            }
            if (mobilePostsProgress) {
                mobilePostsProgress.style.width = '48.4%';
                mobilePostsProgress.style.transition = 'width 2s ease-in-out';
            }
            if (mobileSubsText) mobileSubsText.textContent = subscribers + '/100';
            if (mobilePostsText) mobilePostsText.textContent = posts + '/1000';
            
            // Обновляем ПК прогресс-бары
            if (desktopSubsProgress) {
                desktopSubsProgress.style.width = '51%';
                desktopSubsProgress.style.transition = 'width 2s ease-in-out';
            }
            if (desktopPostsProgress) {
                desktopPostsProgress.style.width = '48.4%';
                desktopPostsProgress.style.transition = 'width 2s ease-in-out';
            }
            if (desktopSubsText) desktopSubsText.textContent = subscribers + '/100';
            if (desktopPostsText) desktopPostsText.textContent = posts + '/1000';
            
            console.log('📊 Progress bars updated');
        }, 100);
        
    } catch (error) {
        console.error('Ошибка updateAllStats:', error);
    }
}

// Обратный отсчет для мобильных
function startMobileCountdown() {
    try {
        const targetDate = new Date('2026-01-01T00:00:00').getTime();
        const messageElement = document.getElementById('mobile-countdown-message');
        
        const messages = [
            "🎉 Скоро Новый 2026 Год!",
            "⏰ Время летит незаметно...", 
            "🚀 Готовься к празднику!",
            "🎁 Сколько планов на следующий год?"
        ];

        function update() {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            if (distance < 0) {
                updateMobileTimer('00', '00', '00', '00');
                if (messageElement) {
                    messageElement.textContent = '🎉 С НОВЫМ 2026 ГОДОМ! 🎉';
                    messageElement.style.color = '#ff3366';
                }
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            updateMobileTimer(
                days.toString().padStart(2, '0'),
                hours.toString().padStart(2, '0'), 
                minutes.toString().padStart(2, '0'),
                seconds.toString().padStart(2, '0')
            );
            
            // Смена сообщения
            if (messageElement && seconds % 10 === 0) {
                const randomIndex = Math.floor(Math.random() * messages.length);
                messageElement.textContent = messages[randomIndex];
            }
        }
        
        function updateMobileTimer(days, hours, minutes, seconds) {
            const elements = {
                days: document.getElementById('mobile-days'),
                hours: document.getElementById('mobile-hours'),
                minutes: document.getElementById('mobile-minutes'), 
                seconds: document.getElementById('mobile-seconds')
            };
            
            for (const [key, element] of Object.entries(elements)) {
                if (element) element.textContent = eval(key);
            }
        }
        
        update();
        setInterval(update, 1000);
        
        // Первое сообщение
        if (messageElement) {
            messageElement.textContent = messages[0];
        }
        
        console.log('⏰ Mobile countdown started');
    } catch (error) {
        console.error('Ошибка startMobileCountdown:', error);
    }
}

// Обратный отсчет для ПК
function startDesktopCountdown() {
    try {
        const targetDate = new Date('2026-01-01T00:00:00').getTime();
        const messageElement = document.getElementById('countdownMessage');
        
        const messages = [
            "🎉 Скоро Новый 2026 Год!",
            "⏰ Время летит незаметно...", 
            "🚀 Готовься к празднику!",
            "🎁 Сколько планов на следующий год?"
        ];

        function update() {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            if (distance < 0) {
                updateDesktopTimer('00', '00', '00', '00');
                if (messageElement) {
                    messageElement.textContent = '🎉 С НОВЫМ 2026 ГОДОМ! 🎉';
                    messageElement.style.color = '#ff3366';
                }
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            updateDesktopTimer(
                days.toString().padStart(2, '0'),
                hours.toString().padStart(2, '0'),
                minutes.toString().padStart(2, '0'), 
                seconds.toString().padStart(2, '0')
            );
            
            // Смена сообщения
            if (messageElement && seconds % 10 === 0) {
                const randomIndex = Math.floor(Math.random() * messages.length);
                messageElement.textContent = messages[randomIndex];
            }
        }
        
        function updateDesktopTimer(days, hours, minutes, seconds) {
            const elements = {
                days: document.getElementById('days'),
                hours: document.getElementById('hours'),
                minutes: document.getElementById('minutes'),
                seconds: document.getElementById('seconds')
            };
            
            for (const [key, element] of Object.entries(elements)) {
                if (element) element.textContent = eval(key);
            }
        }
        
        update();
        setInterval(update, 1000);
        
        if (messageElement) {
            messageElement.textContent = messages[0];
        }
        
        console.log('⏰ Desktop countdown started');
    } catch (error) {
        console.error('Ошибка startDesktopCountdown:', error);
    }
}

// Анимация текста для ПК
function animateDesktopText() {
    try {
        const text = document.getElementById('text');
        if (!text) return;
        
        const textContent = text.textContent;
        text.innerHTML = '';
        
        for (let i = 0; i < textContent.length; i++) {
            const letter = document.createElement('span');
            letter.className = 'letter';
            letter.textContent = textContent[i];
            const delay = i * 0.2;
            letter.style.animationDelay = `${delay}s, ${delay + 2}s`;
            text.appendChild(letter);
        }
    } catch (error) {
        console.error('Ошибка animateDesktopText:', error);
    }
}

// Навигация для мобильных
function initMobileNavigation() {
    try {
        const sections = document.querySelectorAll('.mobile-section');
        const dots = document.querySelectorAll('.dot');
        let currentSection = 0;
        
        // Показываем первую секцию
        if (sections.length > 0) {
            sections[0].classList.add('active');
        }
        
        let isScrolling = false;
        
        window.addEventListener('wheel', function(e) {
            if (isScrolling) return;
            
            isScrolling = true;
            
            if (e.deltaY > 0 && currentSection < sections.length - 1) {
                showMobileSection(currentSection + 1);
            } else if (e.deltaY < 0 && currentSection > 0) {
                showMobileSection(currentSection - 1);
            }
            
            setTimeout(() => { isScrolling = false; }, 800);
        });
        
        // Обработчик касаний
        let startY = 0;
        
        window.addEventListener('touchstart', function(e) {
            startY = e.touches[0].clientY;
        });
        
        window.addEventListener('touchend', function(e) {
            if (isScrolling) return;
            
            const endY = e.changedTouches[0].clientY;
            const diff = startY - endY;
            
            if (Math.abs(diff) > 50) {
                isScrolling = true;
                
                if (diff > 0 && currentSection < sections.length - 1) {
                    showMobileSection(currentSection + 1);
                } else if (diff < 0 && currentSection > 0) {
                    showMobileSection(currentSection - 1);
                }
                
                setTimeout(() => { isScrolling = false; }, 800);
            }
        });
        
        // Клики по точкам
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const sectionIndex = parseInt(this.getAttribute('data-page'));
                showMobileSection(sectionIndex);
            });
        });
        
        function showMobileSection(index) {
            // Скрываем все секции
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Показываем выбранную секцию
            sections[index].classList.add('active');
            
            // Обновляем точки
            dots.forEach(dot => {
                dot.classList.remove('active');
            });
            dots[index].classList.add('active');
            
            currentSection = index;
        }
    } catch (error) {
        console.error('Ошибка initMobileNavigation:', error);
    }
}

// Частицы
function initParticles() {
    try {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;
        
        const particleCount = isMobile() ? 15 : 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const left = Math.random() * 100;
            const delay = Math.random() * 8;
            const duration = 6 + Math.random() * 6;
            const size = isMobile() ? 1 : 1 + Math.random() * 2;
            particle.style.left = `${left}%`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            const colors = ['#ff3366', '#00b4ff', '#8b0000', '#0066ff'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.background = randomColor;
            particlesContainer.appendChild(particle);
        }
    } catch (error) {
        console.error('Ошибка initParticles:', error);
    }
}

// Функции для кнопок
function shareTelegram() {
    try {
        const url = 'https://t.me/Lysmanov';
        const text = 'Подпишись на крутой канал LYSMANOV ✞ - важные новости и интересный контент!';
        window.open('https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text), '_blank');
    } catch (error) {
        console.error('Ошибка shareTelegram:', error);
    }
}

function copyLink() {
    try {
        const url = 'https://t.me/Lysmanov';
        navigator.clipboard.writeText(url).then(function() {
            alert('✅ Ссылка скопирована!');
        }).catch(function() {
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('✅ Ссылка скопирована!');
        });
    } catch (error) {
        console.error('Ошибка copyLink:', error);
    }
}
