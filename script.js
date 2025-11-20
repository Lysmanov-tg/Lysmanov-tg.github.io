// script.js - FULL WORKING VERSION (FIXED)
class LysmanovSite {
    constructor() {
        this.stats = {
            subscribers: 51,
            posts: 485
        };
        this.isMobile = this.checkMobile();
        this.currentSection = 0;
        this.isScrolling = false;
        this.init();
    }

    checkMobile() {
        return window.innerWidth <= 768;
    }

    async init() {
        console.log('🚀 LYSMANOV Site Initializing...');
        
        this.showCorrectVersion();
        await this.loadStats();
        this.initCountdown();
        this.initParticles();
        this.initNotifications();
        
        // ПРИНУДИТЕЛЬНОЕ ОТОБРАЖЕНИЕ ПЕРВОЙ СЕКЦИИ
        setTimeout(() => {
            this.showMobileSection(0);
        }, 100);
        
        if (this.isMobile) {
            this.initMobileNavigation();
            this.initMobileAnimations();
        } else {
            this.initDesktopAnimations();
        }
        
        this.initSmoothAnimations();
        window.addEventListener('resize', () => this.handleResize());
        
        console.log('✅ Site fully loaded!');
        this.showNotification('Добро пожаловать на LYSMANOV! 🎉');
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

    async loadStats() {
        try {
            console.log('📊 Loading stats...');
            
            const response = await fetch('stats.json?t=' + Date.now());
            if (response.ok) {
                const fileStats = await response.json();
                
                if (fileStats && typeof fileStats.subscribers === 'number' && typeof fileStats.posts === 'number') {
                    this.stats = {
                        subscribers: fileStats.subscribers,
                        posts: fileStats.posts,
                        lastUpdated: fileStats.updated || new Date().toISOString()
                    };
                    console.log('✅ Stats loaded from file:', this.stats);
                    this.showNotification('Статистика обновлена! 📈');
                }
            }
        } catch (error) {
            console.log('❌ Error loading stats, using defaults');
        }
        
        this.updateStatsUI();
    }

    updateStatsUI() {
        // Обновляем все текстовые значения
        const elements = [
            { id: 'mobile-subs-text', value: `${this.stats.subscribers}/100` },
            { id: 'mobile-posts-text', value: `${this.stats.posts}/1000` },
            { id: 'subscribers-text', value: `${this.stats.subscribers}/100` },
            { id: 'posts-text', value: `${this.stats.posts}/1000` },
            { id: 'preview-subs', value: this.stats.subscribers },
            { id: 'preview-posts', value: this.stats.posts }
        ];

        elements.forEach(({ id, value }) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
                // Анимация обновления
                element.classList.add('stat-updated');
                setTimeout(() => element.classList.remove('stat-updated'), 1000);
            }
        });

        console.log('📈 Stats updated:', this.stats);
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
            if (seconds % 10 === 0) {
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
                    element.textContent = eval(unit);
                    // Анимация изменения цифр
                    if (element.textContent !== eval(unit)) {
                        element.classList.add('number-change');
                        setTimeout(() => element.classList.remove('number-change'), 500);
                    }
                }
            });
        });
    }

    updateCountdownMessage(message) {
        const mobileMessage = document.getElementById('mobile-countdown-message');
        const desktopMessage = document.getElementById('countdownMessage');
        
        if (mobileMessage) {
            mobileMessage.textContent = message;
            mobileMessage.classList.add('message-change');
            setTimeout(() => mobileMessage.classList.remove('message-change'), 1000);
        }
        if (desktopMessage) {
            desktopMessage.textContent = message;
            desktopMessage.classList.add('message-change');
            setTimeout(() => desktopMessage.classList.remove('message-change'), 1000);
        }
    }

    showNewYearMessage() {
        const messages = document.querySelectorAll('.countdown-message, #countdownMessage');
        messages.forEach(msg => {
            if (msg) {
                msg.textContent = '🎉 С НОВЫМ 2026 ГОДОМ! 🎉';
                msg.style.color = '#ff3366';
                msg.style.animation = 'pulseBlue 1s infinite';
            }
        });
    }

    initParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        
        container.innerHTML = '';
        const count = this.isMobile ? 25 : 40;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (3 + Math.random() * 4) + 's';
            
            const colors = ['#ff3366', '#00b4ff', '#ff00ff', '#00ff88'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.opacity = (0.3 + Math.random() * 0.7).toFixed(2);
            particle.style.width = (1 + Math.random() * 3) + 'px';
            particle.style.height = particle.style.width;
            
            container.appendChild(particle);
        }
    }

    initNotifications() {
        console.log('🔔 Notifications system ready');
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notification-text');
        
        if (notification && notificationText) {
            notificationText.textContent = message;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }

    initMobileNavigation() {
        if (!this.isMobile) return;
        
        const sections = document.querySelectorAll('.mobile-section');
        const dots = document.querySelectorAll('.dot');
        
        this.showMobileSection(0);
        
        let touchStartY = 0;
        let scrollTimeout;
        
        // Плавный скролл
        window.addEventListener('wheel', (e) => {
            if (this.isScrolling) return;
            
            clearTimeout(scrollTimeout);
            this.isScrolling = true;
            
            if (e.deltaY > 50 && this.currentSection < sections.length - 1) {
                this.showMobileSection(this.currentSection + 1);
            } else if (e.deltaY < -50 && this.currentSection > 0) {
                this.showMobileSection(this.currentSection - 1);
            }
            
            scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
            }, 1000);
        });
        
        // Тач события
        window.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });
        
        window.addEventListener('touchend', (e) => {
            if (this.isScrolling) return;
            
            const endY = e.changedTouches[0].clientY;
            const diff = touchStartY - endY;
            
            if (Math.abs(diff) > 50) {
                this.isScrolling = true;
                
                if (diff > 0 && this.currentSection < sections.length - 1) {
                    this.showMobileSection(this.currentSection + 1);
                } else if (diff < 0 && this.currentSection > 0) {
                    this.showMobileSection(this.currentSection - 1);
                }
                
                setTimeout(() => {
                    this.isScrolling = false;
                }, 1000);
            }
        });
        
        // Клик по точкам навигации
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.showMobileSection(index);
            });
        });
        
        // Автоматическая прокрутка каждые 20 секунд
        setInterval(() => {
            if (!this.isScrolling) {
                const nextSection = (this.currentSection + 1) % sections.length;
                this.showMobileSection(nextSection);
                
                // Добавляем небольшую задержку для стабильности
                this.isScrolling = true;
                setTimeout(() => {
                    this.isScrolling = false;
                }, 1500);
            }
        }, 20000);
    }

    showMobileSection(index) {
        const sections = document.querySelectorAll('.mobile-section');
        const dots = document.querySelectorAll('.dot');
        
        // Скрываем все секции
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Показываем выбранную секцию
        if (sections[index]) {
            sections[index].classList.add('active');
        }
        
        // Обновляем точки навигации
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');
        
        this.currentSection = index;
        
        // Показываем уведомление при смене секции
        const messages = [
            "Добро пожаловать! 👋",
            "Статистика канала 📊", 
            "Обратный отсчет ⏰"
        ];
        if (messages[index]) {
            this.showNotification(messages[index]);
        }
    }

    initMobileAnimations() {
        // Анимация появления элементов при загрузке
        const elements = document.querySelectorAll('.stat-card, .countdown-card, .benefits-card, .share-card');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 300 + index * 200);
        });
    }

    initDesktopAnimations() {
        const text = document.getElementById('text');
        if (text) {
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
        }
    }

    initSmoothAnimations() {
        // Добавляем CSS для плавных анимаций
        const style = document.createElement('style');
        style.textContent = `
            .stat-updated {
                animation: statUpdate 0.6s ease-in-out;
            }
            
            .number-change {
                animation: numberChange 0.5s ease-in-out;
            }
            
            .message-change {
                animation: messageChange 1s ease-in-out;
            }
            
            @keyframes statUpdate {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); color: #00b4ff; }
                100% { transform: scale(1); }
            }
            
            @keyframes numberChange {
                0% { opacity: 0.5; transform: translateY(-10px); }
                100% { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes messageChange {
                0% { opacity: 0; transform: translateY(10px); }
                100% { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = this.checkMobile();
        
        if (wasMobile !== this.isMobile) {
            this.showCorrectVersion();
        }
    }
}

// Вспомогательные функции
function shareTelegram() {
    const url = 'https://t.me/Lysmanov';
    const text = 'Подпишись на крутой канал LYSMANOV ✞ - важные новости и интересный контент! 🚀';
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    
    if (window.lysmanovSite) {
        window.lysmanovSite.showNotification('Поделиться в Telegram 📱');
    }
}

function copyLink() {
    const url = 'https://t.me/Lysmanov';
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            showCopyNotification();
        });
    } else {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showCopyNotification();
    }
}

function showCopyNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #00b4ff, #0088cc);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        z-index: 10000;
        font-family: 'Special Elite', cursive;
        font-size: 1.1rem;
        animation: copyNotify 2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        border: 2px solid rgba(255,255,255,0.2);
        backdrop-filter: blur(10px);
    `;
    notification.textContent = '✅ Ссылка скопирована в буфер!';
    
    // Добавляем стили для анимации
    const style = document.createElement('style');
    style.textContent = `
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
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
        // Удаляем добавленные стили
        if (style.parentNode) {
            style.remove();
        }
    }, 2000);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.lysmanovSite = new LysmanovSite();
});

// Обработка ошибок
window.addEventListener('error', function(e) {
    console.error('🚨 Global error:', e.error);
});
