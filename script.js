// script.js - СТАТИСТИКА ИЗ ФАЙЛА
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
        await this.loadStatsFromFile(); // Загружаем из файла
        this.initCountdown();
        this.initParticles();
        this.initAnimatedTips();
        
        if (this.isMobile) {
            this.initMobileNavigation();
        } else {
            this.initDesktopAnimations();
        }
        
        window.addEventListener('resize', () => this.handleResize());
        console.log('✅ Site fully loaded!');
    }

    // ЗАГРУЗКА СТАТИСТИКИ ИЗ ФАЙЛА
    async loadStatsFromFile() {
        try {
            console.log('📊 Loading stats from file...');
            
            const response = await fetch('stats.json');
            if (!response.ok) {
                throw new Error('Stats file not found');
            }
            
            const fileStats = await response.json();
            
            // Проверяем что данные валидные
            if (fileStats && typeof fileStats.subscribers === 'number' && typeof fileStats.posts === 'number') {
                this.stats = {
                    subscribers: fileStats.subscribers,
                    posts: fileStats.posts,
                    lastUpdated: fileStats.updated || new Date().toISOString(),
                    isReal: true
                };
                console.log('✅ Stats loaded from file:', this.stats);
            } else {
                throw new Error('Invalid stats format');
            }
            
        } catch (error) {
            console.log('❌ Error loading stats from file, using defaults:', error.message);
            // Используем значения по умолчанию
            this.stats = {
                subscribers: 51,
                posts: 485,
                lastUpdated: new Date().toISOString(),
                isReal: true
            };
        }
        
        this.updateStatsUI();
    }

    updateStatsUI() {
        const subsProgress = (this.stats.subscribers / 100) * 100;
        const postsProgress = (this.stats.posts / 1000) * 100;

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
                element.style.transition = 'none';
                element.style.width = '0%';
                
                setTimeout(() => {
                    element.style.transition = 'width 1.5s ease-in-out';
                    element.style.width = width + '%';
                }, 50);
            }
        });

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

        console.log('📈 Current stats displayed:', this.stats);
    }

    // СИСТЕМА АНИМИРОВАННЫХ СОВЕТОВ
    initAnimatedTips() {
        this.tips = [
            "💡 Знаете ли вы? Можно поделиться сайтом с друзьями!",
            "🎯 Цель: 100 подписчиков!",
            "⭐ Не забудьте подписаться на канал!",
            "🚀 Новые посты выходят регулярно!",
            "💎 Эксклюзивный контент только для подписчиков!",
            "📱 Листайте чтобы увидеть больше информации!",
            "🎁 Следите за специальными предложениями!",
            "👥 Пригласите друзей - получите бонусы!",
            "🔥 Самый интересный контент еще впереди!",
            "💫 Вы среди первых подписчиков канала!"
        ];
        
        this.currentTipIndex = 0;
        this.isTipsEnabled = true;
        this.tipInterval = null;
        this.createTipContainer();
        this.startTipsRotation();
        
        setTimeout(() => {
            this.showWelcomeTip();
        }, 3000);
    }

    createTipContainer() {
        this.tipContainer = document.createElement('div');
        this.tipContainer.className = 'animated-tips-container';
        this.tipContainer.innerHTML = `
            <div class="tip-header">
                <span class="tip-icon">💡</span>
                <span class="tip-title">Совет дня</span>
                <button class="tip-close" onclick="window.lysmanovSite.hideTips()">×</button>
            </div>
            <div class="tip-content">
                <div class="tip-text">${this.tips[0]}</div>
                <div class="tip-progress"><div class="tip-progress-bar"></div></div>
            </div>
            <div class="tip-controls">
                <button class="tip-prev" onclick="window.lysmanovSite.prevTip()">‹</button>
                <button class="tip-pause" onclick="window.lysmanovSite.toggleTips()">⏸️</button>
                <button class="tip-next" onclick="window.lysmanovSite.nextTip()">›</button>
            </div>
        `;

        document.body.appendChild(this.tipContainer);
    }

    startTipsRotation() {
        this.tipInterval = setInterval(() => {
            if (this.isTipsEnabled) {
                this.nextTip();
            }
        }, 8000);
    }

    showCurrentTip() {
        if (!this.tipContainer) return;

        const tipText = this.tipContainer.querySelector('.tip-text');
        const progressBar = this.tipContainer.querySelector('.tip-progress');
        
        if (tipText) {
            tipText.textContent = this.tips[this.currentTipIndex];
            tipText.style.animation = 'none';
            setTimeout(() => {
                tipText.style.animation = 'textFade 0.5s ease-in-out';
            }, 10);
        }

        if (progressBar) {
            progressBar.innerHTML = '<div class="tip-progress-bar"></div>';
        }
    }

    nextTip() {
        this.currentTipIndex = (this.currentTipIndex + 1) % this.tips.length;
        this.showCurrentTip();
    }

    prevTip() {
        this.currentTipIndex = (this.currentTipIndex - 1 + this.tips.length) % this.tips.length;
        this.showCurrentTip();
    }

    toggleTips() {
        this.isTipsEnabled = !this.isTipsEnabled;
        const pauseBtn = this.tipContainer.querySelector('.tip-pause');
        
        if (pauseBtn) {
            pauseBtn.textContent = this.isTipsEnabled ? '⏸️' : '▶️';
        }

        if (this.isTipsEnabled) {
            this.startTipsRotation();
        } else {
            clearInterval(this.tipInterval);
        }
    }

    hideTips() {
        if (this.tipContainer) {
            this.tipContainer.remove();
        }
        clearInterval(this.tipInterval);
    }

    showWelcomeTip() {
        this.addCustomTip("🎉 Добро пожаловать на сайт LYSMANOV!");
    }

    addCustomTip(tip) {
        this.tips.push(tip);
        this.currentTipIndex = this.tips.length - 1;
        this.showCurrentTip();
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

// ГЛОБАЛЬНЫЕ ФУНКЦИИ
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
    
    setTimeout(() => notification.remove(), 2000);
}

// ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ СТАТИСТИКИ (если нужно принудительно)
function refreshStats() {
    if (window.lysmanovSite) {
        window.lysmanovSite.loadStatsFromFile();
    }
}

// ЗАПУСК САЙТА
document.addEventListener('DOMContentLoaded', () => {
    window.lysmanovSite = new LysmanovSite();
    
    // Добавляем кнопку обновления для разработки
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

// СТИЛИ ДЛЯ СОВЕТОВ И УВЕДОМЛЕНИЙ
const style = document.createElement('style');
style.textContent = `
    .animated-tips-container {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 320px;
        background: linear-gradient(135deg, rgba(255,51,102,0.95), rgba(0,180,255,0.95));
        border-radius: 15px;
        padding: 0;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
        z-index: 10000;
        font-family: 'Special Elite', cursive;
        overflow: hidden;
    }
    
    .tip-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 15px;
        background: rgba(0,0,0,0.2);
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .tip-icon {
        font-size: 1.2rem;
        animation: iconPulse 2s infinite;
    }
    
    @keyframes iconPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    .tip-title {
        color: white;
        font-weight: bold;
        font-size: 0.9rem;
    }
    
    .tip-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }
    
    .tip-close:hover {
        background: rgba(255,255,255,0.2);
        transform: scale(1.1);
    }
    
    .tip-content {
        padding: 15px;
    }
    
    .tip-text {
        color: white;
        font-size: 0.9rem;
        line-height: 1.4;
        min-height: 40px;
        display: flex;
        align-items: center;
        animation: textFade 0.5s ease-in-out;
    }
    
    @keyframes textFade {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .tip-progress {
        height: 3px;
        background: rgba(255,255,255,0.3);
        border-radius: 2px;
        margin-top: 10px;
        overflow: hidden;
    }
    
    .tip-progress-bar {
        height: 100%;
        background: white;
        border-radius: 2px;
        width: 100%;
        animation: progressShrink 8s linear;
    }
    
    @keyframes progressShrink {
        from { width: 100%; }
        to { width: 0%; }
    }
    
    .tip-controls {
        display: flex;
        justify-content: space-between;
        padding: 10px 15px;
        background: rgba(0,0,0,0.1);
        border-top: 1px solid rgba(255,255,255,0.1);
    }
    
    .tip-prev, .tip-next, .tip-pause {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        font-size: 1rem;
    }
    
    .tip-prev:hover, .tip-next:hover, .tip-pause:hover {
        background: rgba(255,255,255,0.3);
        transform: scale(1.1);
    }
    
    .tip-pause {
        font-size: 0.8rem;
    }
    
    @media (max-width: 768px) {
        .animated-tips-container {
            left: 10px;
            right: 10px;
            width: auto;
            bottom: 10px;
        }
    }
    
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(style);

console.log('📄 LYSMANOV site with file-based stats loaded!');
