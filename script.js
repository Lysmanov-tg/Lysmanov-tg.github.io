// script.js - ПОЛНЫЙ КОД С АНИМИРОВАННЫМИ СОВЕТАМИ
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
        this.initAnimatedTips(); // Инициализируем советы
        
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
    }

    // СИСТЕМА АНИМИРОВАННЫХ СОВЕТОВ
    initAnimatedTips() {
        this.tips = [
            "💡 Знаете ли вы? Можно поделиться сайтом с друзьями!",
            "🎯 Цель: 100 подписчиков до конца месяца!",
            "⭐ Не забудьте подписаться на канал!",
            "🚀 Новые посты выходят каждый день!",
            "💎 Эксклюзивный контент только для подписчиков!",
            "📱 Листайте вниз чтобы увидеть больше информации!",
            "🎁 Следите за специальными предложениями!",
            "👥 Пригласите друзей - получите бонусы!",
            "🔥 Самый интересный контент еще впереди!",
            "💫 Вы среди первых подписчиков канала!",
            "🎊 Скоро Новый Год - готовьтесь к сюрпризам!",
            "📈 Мы растем вместе с вами!",
            "💌 Есть идеи? Напишите в комментариях!",
            "🌟 Оцените наш контент - поставьте реакцию!",
            "🔄 Не пропустите обновления - включите уведомления!"
        ];
        
        this.currentTipIndex = 0;
        this.isTipsEnabled = true;
        this.tipInterval = null;
        this.createTipContainer();
        this.startTipsRotation();
        
        // Показываем приветственный совет через 3 секунды
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
        this.applyTipStyles();
    }

    applyTipStyles() {
        const styles = `
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
                animation: tipSlideIn 0.5s ease-out;
            }

            @keyframes tipSlideIn {
                from {
                    transform: translateX(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes tipSlideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(-100%);
                    opacity: 0;
                }
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

            .tip-premium {
                background: linear-gradient(135deg, rgba(255,215,0,0.95), rgba(255,140,0,0.95)) !important;
            }

            .tip-urgent {
                animation: urgentPulse 2s infinite !important;
            }

            @keyframes urgentPulse {
                0%, 100% { box-shadow: 0 0 0 rgba(255,51,102,0.5); }
                50% { box-shadow: 0 0 20px rgba(255,51,102,0.8); }
            }

            .tip-success {
                background: linear-gradient(135deg, rgba(76,175,80,0.95), rgba(56,142,60,0.95)) !important;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
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

        this.applySpecialTipStyles();
    }

    applySpecialTipStyles() {
        const tip = this.tips[this.currentTipIndex];
        this.tipContainer.classList.remove('tip-premium', 'tip-urgent', 'tip-success');

        if (tip.includes('💎') || tip.includes('🎁')) {
            this.tipContainer.classList.add('tip-premium');
        } else if (tip.includes('🔥') || tip.includes('🚀')) {
            this.tipContainer.classList.add('tip-urgent');
        } else if (tip.includes('⭐') || tip.includes('🎯')) {
            this.tipContainer.classList.add('tip-success');
        }
    }

    nextTip() {
        this.currentTipIndex = (this.currentTipIndex + 1) % this.tips.length;
        this.showCurrentTip();
        this.createTipTransitionEffect();
    }

    prevTip() {
        this.currentTipIndex = (this.currentTipIndex - 1 + this.tips.length) % this.tips.length;
        this.showCurrentTip();
        this.createTipTransitionEffect();
    }

    createTipTransitionEffect() {
        this.tipContainer.style.transform = 'translateX(-10px)';
        setTimeout(() => {
            this.tipContainer.style.transform = 'translateX(0)';
            this.tipContainer.style.transition = 'transform 0.3s ease';
        }, 100);
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
            this.tipContainer.style.animation = 'tipSlideOut 0.5s ease-in forwards';
            setTimeout(() => {
                if (this.tipContainer && this.tipContainer.parentNode) {
                    this.tipContainer.parentNode.removeChild(this.tipContainer);
                }
            }, 500);
        }
        clearInterval(this.tipInterval);
    }

    showTips() {
        if (!this.tipContainer || !this.tipContainer.parentNode) {
            this.createTipContainer();
            this.startTipsRotation();
        }
    }

    addCustomTip(tip, type = 'normal') {
        this.tips.push(tip);
        this.currentTipIndex = this.tips.length - 1;
        this.showCurrentTip();
    }

    showWelcomeTip() {
        this.addCustomTip("🎉 Добро пожаловать на сайт LYSMANOV! Исследуйте все возможности!", 'premium');
    }

    showSubscriptionTip() {
        this.addCustomTip("🔔 Подпишитесь на канал чтобы не пропустить важные обновления!", 'urgent');
    }

    showShareTip() {
        this.addCustomTip("📢 Понравился сайт? Поделитесь с друзьями!", 'success');
    }

    // Остальные методы сайта...
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

// Глобальные функции для кнопок
function shareTelegram() {
    const url = 'https://t.me/Lysmanov';
    const text = 'Подпишись на крутой канал LYSMANOV ✞ - важные новости и интересный контент!';
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    
    // Показываем совет о шаринге
    if (window.lysmanovSite) {
        setTimeout(() => {
            window.lysmanovSite.showShareTip();
        }, 1000);
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

// Глобальные функции для управления советами
function showTip() {
    if (window.lysmanovSite) {
        window.lysmanovSite.showTips();
    }
}

function hideTip() {
    if (window.lysmanovSite) {
        window.lysmanovSite.hideTips();
    }
}

function nextTip() {
    if (window.lysmanovSite) {
        window.lysmanovSite.nextTip();
    }
}

function addCustomTip(text) {
    if (window.lysmanovSite) {
        window.lysmanovSite.addCustomTip(text);
    }
}

// Запуск сайта
document.addEventListener('DOMContentLoaded', () => {
    window.lysmanovSite = new LysmanovSite();
    
    // Авто-обновление статистики каждые 4 часа
    setInterval(() => {
        if (window.lysmanovSite) {
            window.lysmanovSite.loadStats();
        }
    }, 4 * 60 * 60 * 1000);
    
    // Добавляем кнопку для ручного обновления
    if (location.hostname === 'lysmanov-tg.github.io') {
        console.log('🔧 Manual stats update available: updateChannelStats()');
        
        const updateBtn = document.createElement('button');
        updateBtn.innerHTML = '✏️';
        updateBtn.style.cssText = `
            position: fixed;
            bottom: 60px;
            left: 10px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #ff3366;
            color: white;
            border: none;
            cursor: pointer;
            z-index: 10000;
            font-size: 18px;
            opacity: 0.3;
            transition: opacity 0.3s;
        `;
        updateBtn.title = 'Обновить статистику';
        updateBtn.addEventListener('mouseenter', () => updateBtn.style.opacity = '1');
        updateBtn.addEventListener('mouseleave', () => updateBtn.style.opacity = '0.3');
        updateBtn.addEventListener('click', updateChannelStats);
        
        document.body.appendChild(updateBtn);
    }
    
    // Советы при скролле
    let scrollTipsShown = false;
    window.addEventListener('scroll', () => {
        if (!scrollTipsShown && window.scrollY > 500) {
            if (window.lysmanovSite) {
                window.lysmanovSite.addCustomTip("📖 Листайте дальше! Еще много интересного ниже!", 'normal');
            }
            scrollTipsShown = true;
        }
    });
    
    // Советы при бездействии
    let inactivityTimer;
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            if (window.lysmanovSite) {
                window.lysmanovSite.addCustomTip("💭 Все еще здесь? Загляните в наш Telegram-канал!", 'premium');
            }
        }, 30000);
    }

    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keypress', resetInactivityTimer);
    resetInactivityTimer();
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

console.log('📄 LYSMANOV site with animated tips loaded!');
