// script.js - ИСПРАВЛЕННЫЙ ДЛЯ ПРАВИЛЬНЫХ ПРОГРЕСС-БАРОВ
class LysmanovSite {
    constructor() {
        this.stats = {
            subscribers: 51,
            posts: 485,
            lastUpdated: new Date().toISOString(),
            isReal: true
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
        
        if (this.isMobile) {
            this.initMobileNavigation();
        } else {
            this.initDesktopAnimations();
        }
        
        window.addEventListener('resize', () => this.handleResize());
        console.log('✅ Site fully loaded!');
    }

    async loadStats() {
        try {
            const stats = await this.getChannelStats();
            if (stats) {
                this.stats = stats;
            }
            this.updateStatsUI();
        } catch (error) {
            this.updateStatsUI();
        }
    }

    async getChannelStats() {
        // Всегда используем реальные базовые цифры
        return {
            subscribers: 51,
            posts: 485,
            lastUpdated: new Date().toISOString(),
            isReal: true
        };
    }

    updateStatsManually(newSubscribers, newPosts) {
        const stats = {
            subscribers: newSubscribers,
            posts: newPosts,
            lastUpdated: new Date().toISOString(),
            isReal: true
        };
        
        localStorage.setItem('manualStatsUpdate', JSON.stringify(stats));
        this.stats = stats;
        this.updateStatsUI();
        
        this.createNotification('📊 Статистика обновлена!', `Подписчики: ${newSubscribers}, Посты: ${newPosts}`);
    }

    // ИСПРАВЛЕННАЯ ФУНКЦИЯ ДЛЯ ПРОГРЕСС-БАРОВ
    updateStatsUI() {
        // ПРАВИЛЬНЫЙ РАСЧЕТ ПРОЦЕНТОВ
        const subsProgress = (this.stats.subscribers / 100) * 100;
        const postsProgress = (this.stats.posts / 1000) * 100;

        console.log('🎯 Progress calculation:', {
            subscribers: this.stats.subscribers,
            subsProgress: subsProgress + '%',
            posts: this.stats.posts,
            postsProgress: postsProgress + '%'
        });

        this.updateProgressBars(subsProgress, postsProgress);
        this.updateStatsText();
    }

    updateProgressBars(subsProgress, postsProgress) {
        // ОГРАНИЧИВАЕМ МАКСИМУМ 100%
        const safeSubsProgress = Math.min(subsProgress, 100);
        const safePostsProgress = Math.min(postsProgress, 100);

        const bars = [
            { id: 'mobile-subs-progress', width: safeSubsProgress },
            { id: 'mobile-posts-progress', width: safePostsProgress },
            { id: 'subscribers-progress', width: safeSubsProgress },
            { id: 'posts-progress', width: safePostsProgress }
        ];

        bars.forEach(({ id, width }) => {
            const element = document.getElementById(id);
            if (element) {
                // Сбрасываем анимацию
                element.style.transition = 'none';
                element.style.width = '0%';
                
                // Запускаем плавное заполнение
                setTimeout(() => {
                    element.style.transition = 'width 1.5s ease-in-out';
                    element.style.width = width + '%';
                }, 50);
            }
        });
    }

    updateStatsText() {
        const texts = [
            { id: 'mobile-subs-text', value: `${this.stats.subscribers}/100` },
            { id: 'mobile-posts-text', value: `${this.stats.posts}/1000` },
            { id: 'subscribers-text', value: `${this.stats.subscribers}/100` },
            { id: 'posts-text', value: `${this.stats.posts}/1000` }
        ];

        texts.forEach(({ id, value }) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });

        // Показываем текущие значения в консоли для отладки
        console.log('📈 Current stats:', {
            subscribers: this.stats.subscribers,
            posts: this.stats.posts
        });
    }

    createNotification(title, message) {
        const notification = document.createElement('div');
        notification.className = 'stats-notification';
        notification.innerHTML = `
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    showCorrectVersion() {
        const mobile = document.querySelector('.mobile-version');
        const desktop = document.querySelector('.desktop-version');
        
        if (this.isMobile) {
            if (mobile) mobile.style.display = 'block';
            if (desktop) desktop.style.display = 'none';
        } else {
            if (mobile) mobile.style.display = 'none';
            if (desktop) desktop.style.display = 'flex';
        }
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = this.checkMobile();
        
        if (wasMobile !== this.isMobile) {
            this.showCorrectVersion();
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
                if (element) element.textContent = eval(unit);
            });
        });
    }

    updateCountdownMessage(message) {
        const mobileMessage = document.getElementById('mobile-countdown-message');
        const desktopMessage = document.getElementById('countdownMessage');
        
        if (mobileMessage) mobileMessage.textContent = message;
        if (desktopMessage) desktopMessage.textContent = message;
    }

    showNewYearMessage() {
        const messages = document.querySelectorAll('.countdown-message, #countdownMessage');
        messages.forEach(msg => {
            if (msg) {
                msg.textContent = '🎉 С НОВЫМ 2026 ГОДОМ! 🎉';
                msg.style.color = '#ff3366';
            }
        });
    }

    initParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        
        container.innerHTML = '';
        const count = this.isMobile ? 20 : 30;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particle.style.animationDuration = (4 + Math.random() * 4) + 's';
            
            const colors = ['#ff3366', '#00b4ff'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.opacity = '0.7';
            
            container.appendChild(particle);
        }
    }

    initMobileNavigation() {
        if (!this.isMobile) return;
        
        const sections = document.querySelectorAll('.mobile-section');
        const dots = document.querySelectorAll('.dot');
        
        this.showMobileSection(0);
        
        window.addEventListener('wheel', (e) => {
            if (this.isScrolling) return;
            this.isScrolling = true;
            
            if (e.deltaY > 0 && this.currentSection < sections.length - 1) {
                this.showMobileSection(this.currentSection + 1);
            } else if (e.deltaY < 0 && this.currentSection > 0) {
                this.showMobileSection(this.currentSection - 1);
            }
            
            setTimeout(() => { this.isScrolling = false; }, 800);
        });
        
        let startY = 0;
        window.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        });
        
        window.addEventListener('touchend', (e) => {
            if (this.isScrolling) return;
            
            const endY = e.changedTouches[0].clientY;
            const diff = startY - endY;
            
            if (Math.abs(diff) > 50) {
                this.isScrolling = true;
                
                if (diff > 0 && this.currentSection < sections.length - 1) {
                    this.showMobileSection(this.currentSection + 1);
                } else if (diff < 0 && this.currentSection > 0) {
                    this.showMobileSection(this.currentSection - 1);
                }
                
                setTimeout(() => { this.isScrolling = false; }, 800);
            }
        });
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.showMobileSection(index);
            });
        });
    }

    showMobileSection(index) {
        const sections = document.querySelectorAll('.mobile-section');
        const dots = document.querySelectorAll('.dot');
        
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        if (sections[index]) {
            sections[index].classList.add('active');
        }
        
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');
        
        this.currentSection = index;
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
                const delay = i * 0.2;
                letter.style.animationDelay = `${delay}s, ${delay + 2}s`;
                text.appendChild(letter);
            }
        }
    }
}

// Функции для кнопок
function shareTelegram() {
    const url = 'https://t.me/Lysmanov';
    const text = 'Подпишись на крутой канал LYSMANOV ✞ - важные новости и интересный контент!';
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
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

function updateChannelStats() {
    const newSubs = prompt('Введите новое количество подписчиков:', '51');
    const newPosts = prompt('Введите новое количество постов:', '485');
    
    if (newSubs && newPosts) {
        if (window.lysmanovSite) {
            window.lysmanovSite.updateStatsManually(parseInt(newSubs), parseInt(newPosts));
        }
    }
}

function showCopyNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 180, 255, 0.9);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 10000;
        font-family: 'Special Elite', cursive;
        font-size: 1.1rem;
        animation: fadeInOut 2s ease-in-out;
    `;
    notification.textContent = '✅ Ссылка скопирована!';
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 2000);
}

// Запуск сайта
document.addEventListener('DOMContentLoaded', () => {
    window.lysmanovSite = new LysmanovSite();
});

// Добавляем стили для уведомлений
const style = document.createElement('style');
style.textContent = `
    .stats-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff3366, #00b4ff);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        animation: slideIn 0.5s ease;
        font-family: 'Special Elite', cursive;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.2);
    }
    
    .notification-title {
        font-weight: bold;
        margin-bottom: 5px;
    }
    
    .notification-message {
        font-size: 0.9rem;
        opacity: 0.9;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(style);

console.log('📄 LYSMANOV script loaded');
