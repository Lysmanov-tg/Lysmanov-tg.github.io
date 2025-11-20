// script.js - ИСПРАВЛЕННЫЙ КОД БЕЗ БАГОВ ПЕРЕРИСОВКИ
class LysmanovSite {
    constructor() {
        this.stats = {
            subscribers: 51,
            posts: 485
        };
        this.isMobile = this.checkMobile();
        this.currentSection = 0;
        this.isScrolling = false;
        this.lastFileHash = '';
        this.isUpdating = false; // Флаг для предотвращения одновременных обновлений
        this.init();
    }

    checkMobile() {
        return window.innerWidth <= 768;
    }

    async init() {
        console.log('🚀 LYSMANOV Site Initializing...');
        
        this.showCorrectVersion();
        await this.loadStatsWithTracking();
        this.initCountdown();
        this.initParticles();
        
        if (this.isMobile) {
            this.initMobileNavigation();
        } else {
            this.initDesktopAnimations();
        }
        
        window.addEventListener('resize', () => this.handleResize());
        
        // Более мягкая проверка изменений
        setInterval(() => this.checkForFileChanges(), 45000); // 45 секунд вместо 30
        
        console.log('✅ Site fully loaded!');
    }

    async loadStatsWithTracking() {
        if (this.isUpdating) return;
        this.isUpdating = true;
        
        try {
            console.log('📊 Loading stats...');
            
            const response = await fetch('stats.json?t=' + Date.now());
            if (!response.ok) {
                throw new Error('Stats file not found');
            }
            
            const fileStats = await response.json();
            const currentHash = this.generateFileHash(fileStats);
            
            // Только если файл действительно изменился
            if (this.lastFileHash && this.lastFileHash !== currentHash) {
                console.log('🔄 File changed! Updating stats...');
                this.showFileChangeNotification();
            }
            
            this.lastFileHash = currentHash;
            
            if (fileStats && typeof fileStats.subscribers === 'number' && typeof fileStats.posts === 'number') {
                const oldStats = {...this.stats};
                this.stats = {
                    subscribers: fileStats.subscribers,
                    posts: fileStats.posts,
                    lastUpdated: fileStats.updated || new Date().toISOString(),
                    isReal: true
                };
                
                console.log('✅ Stats loaded:', this.stats);
                
                // Плавное обновление UI
                if (oldStats.subscribers !== this.stats.subscribers || oldStats.posts !== this.stats.posts) {
                    setTimeout(() => {
                        this.showStatsChangeNotification(oldStats, this.stats);
                    }, 1000);
                }
                
            } else {
                throw new Error('Invalid stats format');
            }
            
        } catch (error) {
            console.log('❌ Error loading stats:', error.message);
            // Используем резервные значения без перерисовки
            this.stats = {
                subscribers: this.stats.subscribers || 51,
                posts: this.stats.posts || 485,
                lastUpdated: new Date().toISOString(),
                isReal: false
            };
        } finally {
            this.isUpdating = false;
        }
        
        this.updateStatsUI();
    }

    async checkForFileChanges() {
        if (this.isUpdating) return;
        
        try {
            const response = await fetch('stats.json?t=' + Date.now());
            if (!response.ok) return;
            
            const fileStats = await response.json();
            const currentHash = this.generateFileHash(fileStats);
            
            if (this.lastFileHash && this.lastFileHash !== currentHash) {
                console.log('🔄 File change detected!');
                this.lastFileHash = currentHash;
                
                if (fileStats && typeof fileStats.subscribers === 'number' && typeof fileStats.posts === 'number') {
                    const oldStats = {...this.stats};
                    this.stats = {
                        subscribers: fileStats.subscribers,
                        posts: fileStats.posts,
                        lastUpdated: fileStats.updated || new Date().toISOString(),
                        isReal: true
                    };
                    
                    console.log('🔄 Stats updated:', this.stats);
                    
                    // Задержка для плавного отображения
                    setTimeout(() => {
                        this.showStatsChangeNotification(oldStats, this.stats);
                        this.updateStatsUI();
                    }, 500);
                }
            }
        } catch (error) {
            console.log('❌ Error checking file changes:', error.message);
        }
    }

    generateFileHash(stats) {
        return btoa(JSON.stringify({
            subscribers: stats.subscribers,
            posts: stats.posts,
            updated: stats.updated
        }));
    }

    updateStatsUI() {
        // Сохраняем текущие значения перед обновлением
        const currentSubs = this.stats.subscribers;
        const currentPosts = this.stats.posts;
        
        const subsProgress = Math.min((currentSubs / 100) * 100, 100);
        const postsProgress = Math.min((currentPosts / 1000) * 100, 100);

        // ПЛАВНОЕ ОБНОВЛЕНИЕ ПРОГРЕСС-БАРОВ
        this.animateProgressBar('mobile-subs-progress', subsProgress);
        this.animateProgressBar('mobile-posts-progress', postsProgress);
        this.animateProgressBar('subscribers-progress', subsProgress);
        this.animateProgressBar('posts-progress', postsProgress);

        // ОБНОВЛЕНИЕ ТЕКСТА БЕЗ ИСЧЕЗНОВЕНИЯ
        this.safeTextUpdate('mobile-subs-text', `${currentSubs}/100`);
        this.safeTextUpdate('mobile-posts-text', `${currentPosts}/1000`);
        this.safeTextUpdate('subscribers-text', `${currentSubs}/100`);
        this.safeTextUpdate('posts-text', `${currentPosts}/1000`);

        // Обновление времени
        this.updateTimeDisplay();

        console.log('📈 Stats UI updated:', this.stats);
    }

    // ПЛАВНАЯ АНИМАЦИЯ ПРОГРЕСС-БАРОВ
    animateProgressBar(elementId, targetWidth) {
        const element = document.getElementById(elementId);
        if (!element) return;

        // Сохраняем текущую ширину
        const currentWidth = parseFloat(element.style.width) || 0;
        
        // Плавная анимация
        element.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Небольшая задержка для стабильности
        setTimeout(() => {
            element.style.width = targetWidth + '%';
        }, 50);
    }

    // БЕЗОПАСНОЕ ОБНОВЛЕНИЕ ТЕКСТА
    safeTextUpdate(elementId, newText) {
        const element = document.getElementById(elementId);
        if (!element) return;

        // Сохраняем текущий текст
        const currentText = element.textContent;
        
        // Только если текст действительно изменился
        if (currentText !== newText) {
            // Добавляем класс анимации
            element.classList.add('stats-updating');
            
            // Обновляем текст
            element.textContent = newText;
            
            // Убираем класс анимации после завершения
            setTimeout(() => {
                element.classList.remove('stats-updating');
            }, 600);
        }
    }

    updateTimeDisplay() {
        const timeElement = document.getElementById('mobile-update-time');
        if (timeElement) {
            timeElement.textContent = new Date().toLocaleTimeString();
        }
    }

    showStatsChangeNotification(oldStats, newStats) {
        // Проверяем, не открыто ли уже уведомление
        if (document.querySelector('.stats-notification')) return;

        const notification = document.createElement('div');
        notification.className = 'stats-notification stats-change';
        
        let changes = [];
        
        if (oldStats.subscribers !== newStats.subscribers) {
            const diff = newStats.subscribers - oldStats.subscribers;
            const arrow = diff > 0 ? '📈' : diff < 0 ? '📉' : '➡️';
            changes.push(`Подписчики: ${oldStats.subscribers} → ${newStats.subscribers} ${arrow}`);
        }
        
        if (oldStats.posts !== newStats.posts) {
            const diff = newStats.posts - oldStats.posts;
            const arrow = diff > 0 ? '📈' : diff < 0 ? '📉' : '➡️';
            changes.push(`Посты: ${oldStats.posts} → ${newStats.posts} ${arrow}`);
        }
        
        if (changes.length === 0) return; // Нет изменений - не показываем уведомление

        notification.innerHTML = `
            <div class="notification-title">🔄 Статистика обновлена</div>
            <div class="notification-changes">
                ${changes.map(change => `<div class="change-item">${change}</div>`).join('')}
            </div>
            <div class="notification-time">${new Date().toLocaleTimeString()}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Автоматическое скрытие
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 500);
            }
        }, 4000);
    }

    showFileChangeNotification() {
        const notification = document.createElement('div');
        notification.className = 'stats-notification file-change';
        notification.innerHTML = `
            <div class="notification-title">📁 Обновление данных</div>
            <div class="notification-message">Загружаем новую статистику...</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 500);
            }
        }, 3000);
    }

    // ОСТАЛЬНЫЕ МЕТОДЫ БЕЗ ИЗМЕНЕНИЙ
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
        let touchEndY = 0;
        
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
            touchStartY = e.changedTouches[0].screenY;
        });
        
        window.addEventListener('touchend', (e) => {
            if (this.isScrolling) return;
            
            touchEndY = e.changedTouches[0].screenY;
            const diff = touchStartY - touchEndY;
            
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
}

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
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
    // Проверяем, не открыто ли уже уведомление
    if (document.querySelector('.copy-notification')) return;
    
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
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

function refreshStats() {
    if (window.lysmanovSite && !window.lysmanovSite.isUpdating) {
        window.lysmanovSite.loadStatsWithTracking();
    }
}

// ИНИЦИАЛИЗАЦИЯ
document.addEventListener('DOMContentLoaded', () => {
    window.lysmanovSite = new LysmanovSite();
    
    // Кнопка обновления статистики
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

// ДОБАВЛЯЕМ СТИЛИ ДЛЯ ПЛАВНЫХ АНИМАЦИЙ
const style = document.createElement('style');
style.textContent = `
    /* Плавные анимации для статистики */
    .stats-updating {
        animation: gentlePulse 0.6s ease-in-out;
    }
    
    @keyframes gentlePulse {
        0%, 100% { 
            opacity: 1;
            transform: scale(1);
        }
        50% { 
            opacity: 0.8;
            transform: scale(1.02);
        }
    }
    
    /* Уведомления */
    .stats-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff3366, #00b4ff);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        animation: slideInNotification 0.5s ease;
        font-family: 'Special Elite', cursive;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.2);
        max-width: 300px;
        backdrop-filter: blur(10px);
    }
    
    .notification-title {
        font-size: 1rem;
        font-weight: bold;
        margin-bottom: 8px;
    }
    
    .notification-changes {
        font-size: 0.8rem;
        margin-bottom: 5px;
    }
    
    .change-item {
        margin: 3px 0;
    }
    
    .notification-time {
        font-size: 0.7rem;
        opacity: 0.8;
        text-align: right;
    }
    
    .stats-notification.fade-out {
        animation: fadeOutNotification 0.5s ease forwards;
    }
    
    @keyframes slideInNotification {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOutNotification {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    /* Гарантия видимости элементов */
    .progress-fill {
        background: linear-gradient(90deg, #ff3366, #00b4ff) !important;
        height: 100% !important;
        border-radius: 6px !important;
        display: block !important;
        min-width: 5% !important; /* Всегда виден */
    }
    
    /* Фиксы для обратного отсчета */
    .time-number, .time-digit {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        min-width: 40px !important;
    }
    
    /* Адаптивность уведомлений */
    @media (max-width: 768px) {
        .stats-notification {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
    
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
    
    /* Плавные переходы для прогресс-баров */
    .progress-fill {
        transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
`;
document.head.appendChild(style);

console.log('🔧 LYSMANOV site with FIXED rendering loaded!');
