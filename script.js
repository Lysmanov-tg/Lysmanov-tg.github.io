// Простая проверка на мобильное устройство
function isMobile() {
    return window.innerWidth <= 768;
}

// Запускаем когда страница загрузится
window.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Site loading...');
    
    // Показываем правильную версию
    showCorrectVersion();
    
    // Запускаем обратный отсчет
    startCountdown();
    
    // Показываем прогресс-бары
    showProgressBars();
    
    // Добавляем частицы
    addParticles();
});

// Показываем правильную версию сайта
function showCorrectVersion() {
    const mobile = document.querySelector('.mobile-version');
    const desktop = document.querySelector('.desktop-version');
    
    if (isMobile()) {
        if (mobile) mobile.style.display = 'block';
        if (desktop) desktop.style.display = 'none';
        console.log('📱 Mobile version shown');
    } else {
        if (mobile) mobile.style.display = 'none';
        if (desktop) desktop.style.display = 'flex';
        console.log('💻 Desktop version shown');
    }
}

// Показываем прогресс-бары
function showProgressBars() {
    // Мобильные прогресс-бары
    const mobileSubs = document.getElementById('mobile-subs-progress');
    const mobilePosts = document.getElementById('mobile-posts-progress');
    
    if (mobileSubs) {
        mobileSubs.style.width = '51%';
        mobileSubs.style.background = 'linear-gradient(90deg, #ff3366, #00b4ff)';
    }
    if (mobilePosts) {
        mobilePosts.style.width = '48.4%';
        mobilePosts.style.background = 'linear-gradient(90deg, #ff3366, #00b4ff)';
    }
    
    // ПК прогресс-бары
    const desktopSubs = document.getElementById('subscribers-progress');
    const desktopPosts = document.getElementById('posts-progress');
    
    if (desktopSubs) {
        desktopSubs.style.width = '51%';
        desktopSubs.style.background = 'linear-gradient(90deg, #ff3366, #00b4ff)';
    }
    if (desktopPosts) {
        desktopPosts.style.width = '48.4%';
        desktopPosts.style.background = 'linear-gradient(90deg, #ff3366, #00b4ff)';
    }
    
    console.log('📊 Progress bars shown');
}

// Обратный отсчет
function startCountdown() {
    const targetDate = new Date('2026-01-01T00:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        // Если время вышло
        if (distance < 0) {
            setTimerValues('00', '00', '00', '00');
            showNewYearMessage();
            return;
        }
        
        // Вычисляем время
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Обновляем таймер
        setTimerValues(
            days.toString().padStart(2, '0'),
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        );
    }
    
    // Запускаем сразу и каждую секунду
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    console.log('⏰ Countdown started');
}

// Устанавливаем значения таймера
function setTimerValues(days, hours, minutes, seconds) {
    // Мобильные элементы
    const mobileElements = {
        days: document.getElementById('mobile-days'),
        hours: document.getElementById('mobile-hours'),
        minutes: document.getElementById('mobile-minutes'),
        seconds: document.getElementById('mobile-seconds')
    };
    
    // ПК элементы
    const desktopElements = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    };
    
    // Обновляем мобильный таймер
    for (const [key, element] of Object.entries(mobileElements)) {
        if (element) element.textContent = eval(key);
    }
    
    // Обновляем ПК таймер
    for (const [key, element] of Object.entries(desktopElements)) {
        if (element) element.textContent = eval(key);
    }
}

// Показываем сообщение о Новом годе
function showNewYearMessage() {
    const mobileMessage = document.getElementById('mobile-countdown-message');
    const desktopMessage = document.getElementById('countdownMessage');
    
    const message = '🎉 С НОВЫМ 2026 ГОДОМ! 🎉';
    
    if (mobileMessage) {
        mobileMessage.textContent = message;
        mobileMessage.style.color = '#ff3366';
    }
    
    if (desktopMessage) {
        desktopMessage.textContent = message;
        desktopMessage.style.color = '#ff3366';
    }
}

// Добавляем частицы на фон
function addParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const count = isMobile() ? 15 : 25;
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.background = '#ff3366';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animation = `floatParticle ${6 + Math.random() * 6}s infinite linear`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        container.appendChild(particle);
    }
    
    console.log('✨ Particles added');
}

// Функции для кнопок "Поделиться"
function shareTelegram() {
    const url = 'https://t.me/Lysmanov';
    const text = 'Подпишись на крутой канал LYSMANOV ✞ - важные новости и интересный контент!';
    window.open('https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text), '_blank');
}

function copyLink() {
    const url = 'https://t.me/Lysmanov';
    
    // Пробуем современный способ
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function() {
            alert('✅ Ссылка скопирована!');
        });
    } else {
        // Старый способ для поддержки
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        alert('✅ Ссылка скопирована!');
    }
}

// Обработчик изменения размера окна
window.addEventListener('resize', function() {
    showCorrectVersion();
});
