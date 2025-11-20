// script.js - ПОЛНОСТЬЮ ИСПРАВЛЕННЫЙ КОД С ЗАГРУЗКОЙ ИЗ ФАЙЛА
class LysmanovSite {
    constructor() {
        this.stats = {
            subscribers: 44,
            posts: 522
        };
        this.isMobile = this.checkMobile();
        this.currentSection = 0;
        this.isScrolling = false;
        this.touchStartY = 0;
        this.autoScrollInterval = null;
        this.init();
    }

    checkMobile() {
        return window.innerWidth <= 768;
    }

    async init() {
        console.log('🚀 LYSMANOV Site Initializing...');
        
        this.showCorrectVersion();
        await this.loadStatsFromFile();
        this.initCountdown();
        this.initParticles();
        
        if (this.isMobile) {
            this.initMobileNavigation();
        } else {
            this.initDesktopAnimations();
        }
        
        window.addEventListener('resize', () => this.handleResize());
        console.log('✅ Site fully loaded!');
    }

    async loadStatsFromFile() {
        try {
            console.log('📊 Loading stats from file...');
            
            const response = await fetch('stats.json');
            if (!response.ok) {
                throw new Error('Stats file not found');
            }
            
            const fileStats = await response.json();
            
            if (fileStats && typeof fileStats.subscribers === 'number' && typeof fileStats.posts === 'number') {
                this.stats = {
                    subscribers: fileStats.subscribers,
                    posts: fileStats.posts,
                    lastUpdated: fileStats.updated || new Date().toISOString(),
                    isReal: true
                };
                console.log('✅ Stats loaded from file:', this.stats);
                this.showNotification('Статистика обновлена!', `Подписчики: ${this.stats.subscribers}, Посты: ${this.stats.posts}`);
            } else {
                throw new Error('Invalid stats format');
            }
            
        } catch (error) {
            console.log('❌ Error loading stats from file, using defaults:', error.message);
            this.stats = {
                subscribers: 44,
                posts: 522,
                lastUpdated: new Date().toISOString(),
                isReal: false
            };
            this.showNotification('Статистика загружена', 'Используются базовые значения');
        }
        
        this.updateStatsUI();
    }

    updateStatsUI() {
        const subsProgress = (this.stats.subscribers / 100) * 100;
        const postsProgress = (this.stats.posts / 1000) * 100;

        const safeSubsProgress = Math.min(subsProgress, 100);
        const safePostsProgress = Math.min(postsProgress, 100);

        // Обновляем прогресс-бары с анимацией
        const progressBars = [
            { id: 'mobile-subs-progress', width: safeSubsProgress },
            { id: 'mobile-posts-progress', width: safePostsProgress },
            { id: 'subscribers-progress', width: safeSubsProgress },
            { id: 'posts-progress', width: safePostsProgress }
        ];

        progressBars.forEach(({ id, width }) => {
            const element = document.getElementById(id);
            if (element) {
                // Сбрасываем анимацию
                element.style.transition = 'none';
                element.style.width = '0%';
                
                // Запускаем анимацию
                setTimeout(() => {
                    element.style.transition = 'width 1.5s ease-in-out';
                    element.style.width = width + '%';
                }, 100);
            }
        });

        // Обновляем текстовые значения
        const textElements = [
            { id: 'mobile-subs-text', value: `${this.stats.subscribers}/100` },
            { id: 'mobile-posts-text', value: `${this.stats.posts}/1000` },
            { id: 'subscribers-text', value: `${this.stats.subscribers}/100` },
            { id: 'posts-text', value: `${this.stats.posts}/1000` }
        ];

        textElements.forEach(({ id, value }) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
                element.classList.add('stats-updated');
                setTimeout(() => element.classList.remove('stats-updated'), 1000);
            }
        });

        console.log('📈 Current stats displayed:', this.stats);
    }

    showNotification(title, message) {
        const notification = document.getElementById('notification');
        const notificationTitle = document.getElementById('notification-title');
        const notificationMessage = document.getElementById('notification-message');
        
        if (notification && notificationTitle && notificationMessage) {
            notificationTitle.textContent = title;
            notificationMessage.textContent = message;
            notification.style.display = 'block';
            notification.classList.remove('fade-out');
            
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 500);
            }, 3000);
        }
    }

    showCorrectVersion() {
        const mobile = document.querySelector('.mobile-version');
        const desktop = document.querySelector('.desktop-version');
        
        if (this.isMobile) {
            if (mobile) {
                mobile.style.display = 'block';
                mobile.style.opacity = '1';
            }
            if (desktop) desktop.style.display = 'none';
        } else {
            if (mobile) mobile.style.display = 'none';
            if (desktop) desktop.style.display = 'flex';
        }
    }

    initMobileNavigation() {
        if (!this.isMobile) return;
        
        const sections = document.querySelectorAll('.mobile-section');
        const dots = document.querySelectorAll('.dot');
        
        console.log('📱 Mobile navigation initializing...');
        console.log('Sections found:', sections.length);
        
        // Устанавливаем начальные стили для всех секций
        sections.forEach((section, index) => {
            section.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.pointerEvents = 'none';
            section.classList.remove('active');
        });
        
        // Показываем первую секцию
        this.showMobileSection(0);
        
        // Обработчик колесика мыши
        window.addEventListener('wheel', (e) => {
            if (this.isScrolling) return;
            
            this.isScrolling = true;
            
            if (e.deltaY > 50 && this.currentSection < sections.length - 1) {
                console.log('⬇️ Scrolling down to section:', this.currentSection + 1);
                this.showMobileSection(this.currentSection + 1);
            } else if (e.deltaY < -50 && this.currentSection > 0) {
                console.log('⬆️ Scrolling up to section:', this.currentSection - 1);
                this.showMobileSection(this.currentSection - 1);
            }
            
            setTimeout(() => {
                this.isScrolling = false;
            }, 1200);
        });
        
        // Обработчик касаний
        document.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (this.isScrolling) return;
            
            const touchEndY = e.changedTouches[0].clientY;
            const diff = this.touchStartY - touchEndY;
            
            if (Math.abs(diff) > 50) {
                this.isScrolling = true;
                
                if (diff > 0 && this.currentSection < sections.length - 1) {
                    // Свайп вверх - следующая секция
                    console.log('👆 Swipe up to section:', this.currentSection + 1);
                    this.showMobileSection(this.currentSection + 1);
                } else if (diff < 0 && this.currentSection > 0) {
                    // Свайп вниз - предыдущая секция
                    console.log('👇 Swipe down to section:', this.currentSection - 1);
                    this.showMobileSection(this.currentSection - 1);
                }
                
                setTimeout(() => {
                    this.isScrolling = false;
                }, 1200);
            }
        });
        
        // Клик по точкам навигации
        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔘 Dot clicked:', index);
                this.showMobileSection(index);
            });
            
            dot.style.cursor = 'pointer';
            dot.style.pointerEvents = 'all';
        });
        
        // Запускаем авто-прокрутку через 3 секунды после загрузки
        setTimeout(() => {
            this.startAutoScroll();
        }, 3000);
    }

    showMobileSection(index) {
        const sections = document.querySelectorAll('.mobile-section');
        const dots = document.querySelectorAll('.dot');
        
        if (index < 0 || index >= sections.length) {
            console.warn('❌ Invalid section index:', index);
            return;
        }
        
        console.log('🔄 Showing section:', index);
        
        // Останавливаем авто-прокрутку при ручном переключении
        this.stopAutoScroll();
        
        // Скрываем текущую активную секцию
        const currentActive = document.querySelector('.mobile-section.active');
        if (currentActive) {
            currentActive.style.opacity = '0';
            currentActive.style.transform = 'translateY(-30px)';
            currentActive.classList.remove('active');
        }
        
        // Показываем новую секцию с задержкой для плавности
        setTimeout(() => {
            const newSection = sections[index];
            newSection.style.opacity = '1';
            newSection.style.transform = 'translateY(0)';
            newSection.classList.add('active');
            
            // Обновляем точки навигации
            dots.forEach((dot, i) => {
                dot.classList.remove('active');
                dot.style.background = 'rgba(255, 255, 255, 0.3)';
                dot.style.transform = 'scale(1)';
                
                if (i === index) {
                    dot.classList.add('active');
                    dot.style.background = '#ff3366';
                    dot.style.transform = 'scale(1.3)';
                }
            });
            
            this.currentSection = index;
            
            // Добавляем анимацию появления контента
            this.animateSectionContent(newSection);
            
            // Перезапускаем авто-прокрутку через 6 секунд
            setTimeout(() => {
                this.startAutoScroll();
            }, 6000);
            
        }, 400);
    }

    animateSectionContent(section) {
        // Анимируем появление элементов внутри секции
        const elements = section.querySelectorAll('.stat-card, .countdown-card, .benefits-card, .share-card, .mobile-button');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'all 0.6s ease-out';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 200 + (index * 150));
        });
    }

    startAutoScroll() {
        // Останавливаем предыдущий интервал
        this.stopAutoScroll();
        
        const sections = document.querySelectorAll('.mobile-section');
        if (sections.length === 0) return;
        
        console.log('🔁 Starting auto-scroll...');
        
        this.autoScrollInterval = setInterval(() => {
            if (!this.isScrolling && this.isMobile) {
                const nextSection = (this.currentSection + 1) % sections.length;
                console.log('🔄 Auto-scroll to section:', nextSection);
                this.showMobileSection(nextSection);
            }
        }, 8000); // 8 секунд между авто-прокрутками
    }

    stopAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
            console.log('⏹️ Auto-scroll stopped');
        }
    }

    initCountdown() {
        const targetDate = new Date('2026-01-01T00:00:00').getTime();
        const messages = [
            "🎉 Скоро Новый 2026 Год!",
            "⏰ Время летит незаметно...", 
            "🚀 Готовься к празднику!",
            "🎁 Сколько планов на следующий год?",
            "⭐ Не пропусти новые посты!",
            "👥 Пригласи друзей в канал!"
        ];

        let messageIndex = 0;
        let lastSecond = -1;
        
        const update = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            if (distance < 0) {
                this.updateTimerDisplay('00', '00', '00', '00');
                this.showNewYearMessage();
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            this.updateTimerDisplay(
                days.toString().padStart(2, '0'),
                hours.toString().padStart(2, '0'),
                minutes.toString().padStart(2, '0'),
                seconds.toString().padStart(2, '0')
            );
            
            // Смена сообщения каждые 10 секунд
            if (seconds !== lastSecond && seconds % 10 === 0) {
                this.updateCountdownMessage(messages[messageIndex]);
                messageIndex = (messageIndex + 1) % messages.length;
            }
            
            lastSecond = seconds;
        };
        
        this.updateCountdownMessage(messages[0]);
        update();
        setInterval(update, 1000);
    }

    updateTimerDisplay(days, hours, minutes, seconds) {
        const elements = {
            mobile: {
                days: 'mobile-days',
                hours: 'mobile-hours', 
                minutes: 'mobile-minutes',
                seconds: 'mobile-seconds'
            },
            desktop: {
                days: 'days',
                hours: 'hours',
                minutes: 'minutes', 
                seconds: 'seconds'
            }
        };
        
        Object.values(elements).forEach(version => {
            Object.entries(version).forEach(([unit, id]) => {
                const element = document.getElementById(id);
                if (element) {
                    const newValue = eval(unit);
                    if (element.textContent !== newValue) {
                        element.textContent = newValue;
                        // Анимация изменения цифры
                        element.style.animation = 'none';
                        setTimeout(() => {
                            element.style.animation = 'numberPulse 0.5s ease-in-out';
                        }, 10);
                    }
                }
            });
        });
    }

    updateCountdownMessage(message) {
        const mobileMessage = document.getElementById('mobile-countdown-message');
        const desktopMessage = document.getElementById('countdownMessage');
        
        if (mobileMessage && mobileMessage.textContent !== message) {
            mobileMessage.textContent = message;
            mobileMessage.style.animation = 'none';
            setTimeout(() => {
                mobileMessage.style.animation = 'messagePulse 1s ease-in-out';
            }, 10);
        }
        if (desktopMessage && desktopMessage.textContent !== message) {
            desktopMessage.textContent = message;
        }
    }

    showNewYearMessage() {
        const messages = document.querySelectorAll('.countdown-message, #countdownMessage, .mobile-countdown-message');
        messages.forEach(msg => {
            if (msg) {
                msg.textContent = '🎉 С НОВЫМ 2026 ГОДОМ! 🎉';
                msg.style.color = '#ff3366';
                msg.style.animation = 'pulse 1s infinite';
            }
        });
    }

    initParticles() {
        const containers = document.querySelectorAll('#particles');
        
        containers.forEach(container => {
            if (!container) return;
            
            container.innerHTML = '';
            const count = this.isMobile ? 20 : 35;
            
            for (let i = 0; i < count; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 8 + 's';
                particle.style.animationDuration = (4 + Math.random() * 6) + 's';
                
                const colors = ['#ff3366', '#00b4ff', '#ff00ff', '#00ff88'];
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                particle.style.opacity = (0.3 + Math.random() * 0.7).toFixed(2);
                particle.style.width = (1 + Math.random() * 4) + 'px';
                particle.style.height = particle.style.width;
                
                container.appendChild(particle);
            }
        });
    }

    initDesktopAnimations() {
        if (this.isMobile) return;
        
        const text = document.getElementById('text');
        if (text) {
            const textContent = text.textContent;
            text.innerHTML = '';
            
            for (let i = 0; i < textContent.length; i++) {
                const letter = document.createElement('span');
                letter.className = 'letter';
                letter.textContent = textContent[i];
                const delay = i * 0.1;
                letter.style.animationDelay = `${delay}s, ${delay + 2}s`;
                text.appendChild(letter);
            }
        }
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = this.checkMobile();
        
        if (wasMobile !== this.isMobile) {
            console.log('📱🖥️ Screen size changed:', this.isMobile ? 'Mobile' : 'Desktop');
            this.stopAutoScroll();
            this.showCorrectVersion();
            
            if (this.isMobile) {
                // Переинициализируем мобильную навигацию
                setTimeout(() => {
                    this.initMobileNavigation();
                }, 100);
            }
        }
    }
}

// Вспомогательные функции
function shareTelegram() {
    const url = 'https://t.me/Lysmanov';
    const text = 'Подпишись на крутой канал LYSMANOV ✞ - важные новости и интересный контент! 🚀';
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    
    showCopyNotification('📱 Открыт Telegram для публикации');
}

function copyLink() {
    const url = 'https://t.me/Lysmanov';
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            showCopyNotification('✅ Ссылка скопирована в буфер!');
        }).catch(() => {
            fallbackCopy(url);
        });
    } else {
        fallbackCopy(url);
    }
}

function fallbackCopy(url) {
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyNotification('✅ Ссылка скопирована!');
    } catch (err) {
        showCopyNotification('❌ Не удалось скопировать ссылку');
    }
    
    document.body.removeChild(textArea);
}

function showCopyNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #00b4ff, #0088cc);
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        z-index: 10000;
        font-family: 'Special Elite', cursive;
        font-size: 1rem;
        animation: copyNotify 2s ease-in-out;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.2);
        backdrop-filter: blur(10px);
        pointer-events: none;
        text-align: center;
        max-width: 250px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 2000);
}

// Функция для обновления статистики
function refreshStats() {
    if (window.lysmanovSite) {
        window.lysmanovSite.loadStatsFromFile();
    }
}

// Добавляем стили для анимаций
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes copyNotify {
        0% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.8) rotate(-5deg);
        }
        20% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1.05) rotate(2deg);
        }
        40% { 
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
        }
        80% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
        }
        100% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.8) rotate(5deg);
        }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    @keyframes numberPulse {
        0% { 
            transform: scale(1); 
            text-shadow: 0 0 10px rgba(0, 180, 255, 0.7);
        }
        50% { 
            transform: scale(1.1); 
            text-shadow: 0 0 15px rgba(0, 180, 255, 1);
        }
        100% { 
            transform: scale(1); 
            text-shadow: 0 0 10px rgba(0, 180, 255, 0.7);
        }
    }
    
    @keyframes messagePulse {
        0%, 100% { 
            opacity: 0.8;
            transform: translateY(0);
        }
        50% { 
            opacity: 1;
            transform: translateY(-2px);
        }
    }
    
    .stats-updated {
        animation: statsUpdate 0.6s ease-in-out;
    }
    
    @keyframes statsUpdate {
        0% { 
            transform: scale(1);
            color: inherit;
        }
        50% { 
            transform: scale(1.1);
            color: #00b4ff;
        }
        100% { 
            transform: scale(1);
            color: inherit;
        }
    }
`;
document.head.appendChild(animationStyles);

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded, initializing site...');
    window.lysmanovSite = new LysmanovSite();
    
    // Кнопка обновления статистики только на GitHub Pages
    if (location.hostname === 'lysmanov-tg.github.io') {
        const refreshBtn = document.createElement('button');
        refreshBtn.innerHTML = '🔄';
        refreshBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #00b4ff;
            color: white;
            border: none;
            cursor: pointer;
            z-index: 10000;
            font-size: 18px;
            opacity: 0.3;
            transition: opacity 0.3s;
        `;
        refreshBtn.title = 'Обновить статистику';
        refreshBtn.addEventListener('mouseenter', () => refreshBtn.style.opacity = '1');
        refreshBtn.addEventListener('mouseleave', () => refreshBtn.style.opacity = '0.3');
        refreshBtn.addEventListener('click', refreshStats);
        
        document.body.appendChild(refreshBtn);
    }
});

// Обработка ошибок
window.addEventListener('error', function(e) {
    console.error('🚨 Global error:', e.error);
});

console.log('🎯 LYSMANOV site script loaded successfully!');
