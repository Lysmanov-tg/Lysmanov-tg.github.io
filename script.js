// script.js - ИСПРАВЛЕННЫЙ КОД ДЛЯ МОБИЛЬНОЙ ВЕРСИИ
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
        
        // Принудительный показ мобильной версии
        this.forceMobileView();
        
        await this.loadStats();
        this.initCountdown();
        this.initParticles();
        
        if (this.isMobile) {
            this.initMobileNavigation();
        }
        
        console.log('✅ Site fully loaded!');
    }

    forceMobileView() {
        const mobile = document.querySelector('.mobile-version');
        const desktop = document.querySelector('.desktop-version');
        
        if (this.isMobile) {
            if (mobile) {
                mobile.style.display = 'block';
                mobile.style.opacity = '1';
            }
            if (desktop) {
                desktop.style.display = 'none';
            }
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
                }
            }
        } catch (error) {
            console.log('❌ Error loading stats, using defaults');
        }
        
        this.updateStatsUI();
    }

    updateStatsUI() {
        // Прогресс-бары
        const subsProgress = document.getElementById('mobile-subs-progress');
        const postsProgress = document.getElementById('mobile-posts-progress');
        const desktopSubs = document.getElementById('subscribers-progress');
        const desktopPosts = document.getElementById('posts-progress');
        
        if (subsProgress) subsProgress.style.width = '51%';
        if (postsProgress) postsProgress.style.width = '48.4%';
        if (desktopSubs) desktopSubs.style.width = '51%';
        if (desktopPosts) desktopPosts.style.width = '48.4%';

        // Текстовые значения
        const texts = [
            { id: 'mobile-subs-text', value: `${this.stats.subscribers}/100` },
            { id: 'mobile-posts-text', value: `${this.stats.posts}/1000` },
            { id: 'subscribers-text', value: `${this.stats.subscribers}/100` },
            { id: 'posts-text', value: `${this.stats.posts}/1000` }
        ];

        texts.forEach(({ id, value }) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });

        console.log('📈 Stats updated:', this.stats);
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
        
        let touchStartY = 0;
        
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
}

// Вспомогательные функции
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
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 2000);
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    window.lysmanovSite = new LysmanovSite();
});

// Стили для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(style);

console.log('📄 LYSMANOV mobile site loaded!');
