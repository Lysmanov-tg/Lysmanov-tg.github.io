// script.js - СТАТИСТИКА РУЧНОГО УПРАВЛЕНИЯ
class LysmanovSite {
    constructor() {
        // Загружаем статистику из localStorage или используем значения по умолчанию
        this.stats = this.loadStatsFromStorage() || {
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
        this.updateStatsUI(); // Просто обновляем UI без загрузки
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

    // ЗАГРУЗКА СТАТИСТИКИ ИЗ LOCALSTORAGE
    loadStatsFromStorage() {
        try {
            const savedStats = localStorage.getItem('lysmanov_stats');
            if (savedStats) {
                const stats = JSON.parse(savedStats);
                console.log('📊 Loaded stats from storage:', stats);
                return stats;
            }
        } catch (error) {
            console.log('❌ Error loading stats from storage');
        }
        return null;
    }

    // СОХРАНЕНИЕ СТАТИСТИКИ В LOCALSTORAGE
    saveStatsToStorage() {
        try {
            localStorage.setItem('lysmanov_stats', JSON.stringify(this.stats));
            console.log('💾 Stats saved to storage:', this.stats);
        } catch (error) {
            console.log('❌ Error saving stats to storage');
        }
    }

    // ОБНОВЛЕНИЕ СТАТИСТИКИ ВРУЧНУЮ
    updateStatsManually(newSubscribers, newPosts) {
        const stats = {
            subscribers: newSubscribers,
            posts: newPosts,
            lastUpdated: new Date().toISOString(),
            isReal: true
        };
        
        this.stats = stats;
        this.saveStatsToStorage(); // Сохраняем в localStorage
        this.updateStatsUI();
        
        this.createNotification(
            '📊 Статистика обновлена!', 
            `Подписчики: ${newSubscribers}, Посты: ${newPosts}`
        );
        
        console.log('✏️ Manual stats update:', stats);
    }

    // БЫСТРОЕ ОБНОВЛЕНИЕ ЧЕРЕЗ КНОПКИ
    quickUpdateStats(type, change) {
        const currentValue = this.stats[type];
        const newValue = Math.max(0, currentValue + change);
        
        this.stats[type] = newValue;
        this.stats.lastUpdated = new Date().toISOString();
        this.saveStatsToStorage();
        this.updateStatsUI();
        
        const action = change > 0 ? 'увеличено' : 'уменьшено';
        this.createNotification(
            '📊 Статистика обновлена!',
            `${type === 'subscribers' ? 'Подписчики' : 'Посты'} ${action} на ${Math.abs(change)}`
        );
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

        // Обновляем дату последнего изменения
        this.updateLastModified();
    }

    updateLastModified() {
        const lastUpdated = new Date(this.stats.lastUpdated);
        const options = { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        console.log('📅 Last updated:', lastUpdated.toLocaleDateString('ru-RU', options));
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

// ФУНКЦИИ ДЛЯ УПРАВЛЕНИЯ СТАТИСТИКОЙ
function updateStatsManually() {
    const currentSubs = window.lysmanovSite.stats.subscribers;
    const currentPosts = window.lysmanovSite.stats.posts;
    
    const newSubs = prompt('Введите новое количество подписчиков:', currentSubs);
    const newPosts = prompt('Введите новое количество постов:', currentPosts);
    
    if (newSubs !== null && newPosts !== null) {
        if (window.lysmanovSite) {
            window.lysmanovSite.updateStatsManually(parseInt(newSubs), parseInt(newPosts));
        }
    }
}

function quickSubsIncrease() {
    if (window.lysmanovSite) {
        window.lysmanovSite.quickUpdateStats('subscribers', 1);
    }
}

function quickSubsDecrease() {
    if (window.lysmanovSite) {
        window.lysmanovSite.quickUpdateStats('subscribers', -1);
    }
}

function quickPostsIncrease() {
    if (window.lysmanovSite) {
        window.lysmanovSite.quickUpdateStats('posts', 1);
    }
}

function quickPostsDecrease() {
    if (window.lysmanovSite) {
        window.lysmanovSite.quickUpdateStats('posts', -1);
    }
}

function resetStats() {
    if (confirm('Вы уверены что хотите сбросить статистику к значениям по умолчанию?')) {
        if (window.lysmanovSite) {
            window.lysmanovSite.updateStatsManually(51, 485);
        }
    }
}

// ОСТАЛЬНЫЕ ГЛОБАЛЬНЫЕ ФУНКЦИИ
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

// ЗАПУСК САЙТА
document.addEventListener('DOMContentLoaded', () => {
    window.lysmanovSite = new LysmanovSite();
    
    // СОЗДАЕМ ПАНЕЛЬ УПРАВЛЕНИЯ СТАТИСТИКОЙ
    createStatsControlPanel();
});

function createStatsControlPanel() {
    const controlPanel = document.createElement('div');
    controlPanel.className = 'stats-control-panel';
    controlPanel.innerHTML = `
        <div class="control-header">
            <span>📊 Управление статистикой</span>
            <button class="control-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="control-buttons">
            <div class="control-group">
                <span>Подписчики:</span>
                <button onclick="quickSubsDecrease()">-1</button>
                <button onclick="quickSubsIncrease()">+1</button>
                <button onclick="quickSubsIncrease(5)">+5</button>
            </div>
            <div class="control-group">
                <span>Посты:</span>
                <button onclick="quickPostsDecrease()">-1</button>
                <button onclick="quickPostsIncrease()">+1</button>
                <button onclick="quickPostsIncrease(5)">+5</button>
            </div>
            <div class="control-actions">
                <button onclick="updateStatsManually()" class="btn-edit">✏️ Ручной ввод</button>
                <button onclick="resetStats()" class="btn-reset">🔄 Сброс</button>
            </div>
        </div>
    `;

    // Стили для панели управления
    const styles = `
        .stats-control-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #ff3366;
            border-radius: 10px;
            padding: 0;
            z-index: 10001;
            font-family: 'Special Elite', cursive;
            color: white;
            min-width: 250px;
            backdrop-filter: blur(10px);
        }
        
        .control-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            background: #ff3366;
            border-radius: 8px 8px 0 0;
            font-weight: bold;
        }
        
        .control-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .control-buttons {
            padding: 15px;
        }
        
        .control-group {
            display: flex;
            align-items: center;
            gap: 5px;
            margin-bottom: 10px;
            flex-wrap: wrap;
        }
        
        .control-group span {
            min-width: 80px;
            font-size: 0.9rem;
        }
        
        .control-group button {
            background: #00b4ff;
            border: none;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            font-family: 'Special Elite', cursive;
            transition: all 0.3s ease;
        }
        
        .control-group button:hover {
            background: #ff3366;
            transform: scale(1.05);
        }
        
        .control-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            flex-wrap: wrap;
        }
        
        .btn-edit, .btn-reset {
            flex: 1;
            padding: 8px 12px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-family: 'Special Elite', cursive;
            transition: all 0.3s ease;
        }
        
        .btn-edit {
            background: #00b4ff;
            color: white;
        }
        
        .btn-reset {
            background: #ff3366;
            color: white;
        }
        
        .btn-edit:hover, .btn-reset:hover {
            transform: scale(1.05);
            opacity: 0.9;
        }
        
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
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
        
        /* Стили для анимированных советов */
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
        }
        
        @media (max-width: 768px) {
            .stats-control-panel {
                right: 10px;
                left: 10px;
                top: 10px;
            }
            
            .animated-tips-container {
                left: 10px;
                right: 10px;
                width: auto;
                bottom: 10px;
            }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    document.body.appendChild(controlPanel);
}

console.log('📄 LYSMANOV site with manual stats control loaded!');
