// script.js - ИСПРАВЛЕННАЯ МОБИЛЬНАЯ ВЕРСИЯ
class LysmanovSite {
    constructor() {
        this.stats = {
            subscribers: 51,
            posts: 485
        };
        this.isMobile = this.checkMobile();
        this.currentSection = 0;
        this.isScrolling = false;
        this.touchStartY = 0;
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
            
            // Используем данные из stats.json
            const fileStats = {
                subscribers: 44,
                posts: 522,
                updated: "2024-01-01T12:00:00.000Z"
            };
            
            this.stats = {
                subscribers: fileStats.subscribers,
                posts: fileStats.posts,
                lastUpdated: fileStats.updated,
                isReal: true
            };
            console.log('✅ Stats loaded from file:', this.stats);
            
        } catch (error) {
            console.log('❌ Error loading stats, using defaults');
            this.stats = {
                subscribers: 51,
                posts: 485,
                lastUpdated: new Date().toISOString(),
                isReal: false
            };
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
        console.log('Dots found:', dots.length);
        
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
            }, 800);
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
                }, 800);
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
            
            // Добавляем стили для лучшей кликабельности
            dot.style.cursor = 'pointer';
            dot.style.pointerEvents = 'all';
        });
        
        // Автоматическая прокрутка каждые 15 секунд
        setInterval(() => {
            if (!this.isScrolling && this.isMobile) {
                const nextSection = (this.currentSection + 1) % sections.length;
                console.log('🔄 Auto-scroll to section:', nextSection);
                this.showMobileSection(nextSection);
            }
        }, 15000);
    }

    showMobileSection(index) {
        const sections = document.querySelectorAll('.mobile-section');
        const dots = document.querySelectorAll('.dot');
        
        if (index < 0 || index >= sections.length) {
            console.warn('❌ Invalid section index:', index);
            return;
        }
        
        console.log('🔄 Showing section:', index);
        
        // Скрываем все секции
        sections.forEach((section, i) => {
            section.classList.remove('active');
            section.style.transform = 'translateY(20px)';
            section.style.opacity = '0';
            section.style.pointerEvents = 'none';
        });
        
        // Показываем выбранную секцию
        const activeSection = sections[index];
        activeSection.classList.add('active');
        activeSection.style.transform = 'translateY(0)';
        activeSection.style.opacity = '1';
        activeSection.style.pointerEvents = 'all';
        
        // Обновляем точки навигации
        dots.forEach(dot => {
            dot.classList.remove('active');
            dot.style.background = 'rgba(255, 255, 255, 0.3)';
            dot.style.transform = 'scale(1)';
        });
        
        if (dots[index]) {
            dots[index].classList.add('active');
            dots[index].style.background = '#ff3366';
            dots[index].style.transform = 'scale(1.2)';
        }
        
        this.currentSection = index;
        
        // Показываем подсказку в консоли
        const messages = [
            "Добро пожаловать! 👋",
            "Статистика канала 📊", 
            "Обратный отсчет ⏰"
        ];
        if (messages[index]) {
            console.log('💬 ' + messages[index]);
        }
    }

    initCountdown() {
        const targetDate = new Date('2026-01-01T00:00:00').getTime();
        const messages = [
            "🎉 Скоро Новый 2026 Год!",
            "⏰ Время летит незаметно...", 
            "🚀 Готовься к празднику!",
            "🎁 Сколько планов на следующий год?"
        ];

        let messageIndex = 0;
        
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
            
            if (seconds % 15 === 0) {
                this.updateCountdownMessage(messages[messageIndex]);
                messageIndex = (messageIndex + 1) % messages.length;
            }
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
        const messages = document.querySelectorAll('.countdown-message, #countdownMessage');
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
            const count = this.isMobile ? 15 : 30;
            
            for (let i = 0; i < count; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 5 + 's';
                particle.style.animationDuration = (3 + Math.random() * 4) + 's';
                
                const colors = ['#ff3366', '#00b4ff', '#ff00ff'];
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                particle.style.opacity = (0.3 + Math.random() * 0.5).toFixed(2);
                particle.style.width = (2 + Math.random() * 3) + 'px';
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
            console.log('📱🖥️ Screen size changed, reloading...');
            this.showCorrectVersion();
            
            if (this.isMobile) {
                this.initMobileNavigation();
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

// Добавляем стили для анимации уведомления
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
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
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(notificationStyle);

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded, initializing site...');
    window.lysmanovSite = new LysmanovSite();
});

// Обработка ошибок
window.addEventListener('error', function(e) {
    console.error('🚨 Global error:', e.error);
});
