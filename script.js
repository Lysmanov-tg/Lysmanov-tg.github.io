console.log('🚀 LYSMANOV Site - Starting...');

// Простые переменные для навигации
let currentPage = 0;
const totalPages = 4;
let canScroll = true;

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded');
    
    // Инициализация навигации
    initNavigation();
    
    // Анимация текста
    animateText();
    
    // Запуск функций
    setTimeout(function() {
        updateStats();
        startCountdown();
    }, 1000);
});

// Анимация текста LYSMANOV
function animateText() {
    const text = document.getElementById('text');
    if (!text) return;
    
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

// Обновление статистики
function updateStats() {
    const subscribers = 51;
    const posts = 484;
    
    const subsProgress = document.getElementById('subscribers-progress');
    const postsProgress = document.getElementById('posts-progress');
    const subsText = document.getElementById('subscribers-text');
    const postsText = document.getElementById('posts-text');
    
    if (subsProgress) subsProgress.style.width = subscribers + '%';
    if (postsProgress) postsProgress.style.width = (posts/10) + '%';
    if (subsText) subsText.textContent = subscribers + '/100';
    if (postsText) postsText.textContent = posts + '/1000';
}

// Обратный отсчет
function startCountdown() {
    const targetDate = new Date('2026-01-01T00:00:00').getTime();
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const messageElement = document.getElementById('countdownMessage');
    
    const messages = [
        "🎉 Скоро Новый 2026 Год!",
        "⏰ Время летит незаметно...",
        "🚀 Готовься к празднику!",
        "🎁 Сколько планов на следующий год?"
    ];

    function update() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            if (daysElement) daysElement.textContent = '00';
            if (hoursElement) hoursElement.textContent = '00';
            if (minutesElement) minutesElement.textContent = '00';
            if (secondsElement) secondsElement.textContent = '00';
            if (messageElement) {
                messageElement.textContent = '🎉 С НОВЫМ 2026 ГОДОМ! 🎉';
                messageElement.style.color = '#ff3366';
            }
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
        if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
        if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
        if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        if (messageElement && seconds % 10 === 0) {
            const randomIndex = Math.floor(Math.random() * messages.length);
            messageElement.textContent = messages[randomIndex];
        }
    }
    
    update();
    setInterval(update, 1000);
    
    if (messageElement) {
        messageElement.textContent = messages[0];
    }
}

// Инициализация навигации
function initNavigation() {
    // Показываем первую страницу
    showPage(0);
    
    // Обработчик колеса мыши
    document.addEventListener('wheel', function(e) {
        if (!canScroll) return;
        
        canScroll = false;
        
        if (e.deltaY > 0) {
            nextPage();
        } else {
            prevPage();
        }
        
        setTimeout(() => { canScroll = true; }, 800);
    });
    
    // Обработчик касаний для мобильных
    let startY = 0;
    
    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        if (!canScroll) return;
        
        const endY = e.changedTouches[0].clientY;
        const diff = startY - endY;
        
        if (Math.abs(diff) > 50) {
            canScroll = false;
            
            if (diff > 0) {
                nextPage();
            } else {
                prevPage();
            }
            
            setTimeout(() => { canScroll = true; }, 800);
        }
    });
    
    // Клики по точкам-индикаторам
    const dots = document.querySelectorAll('.page-dot');
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const pageIndex = parseInt(this.getAttribute('data-page'));
            showPage(pageIndex);
        });
    });
}

// Показать страницу
function showPage(index) {
    if (index < 0 || index >= totalPages) return;
    
    currentPage = index;
    
    // Скрываем все страницы
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Показываем текущую страницу
    pages[index].classList.add('active');
    
    // Обновляем индикаторы
    const dots = document.querySelectorAll('.page-dot');
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    dots[index].classList.add('active');
}

// Следующая страница
function nextPage() {
    if (currentPage < totalPages - 1) {
        showPage(currentPage + 1);
    }
}

// Предыдущая страница
function prevPage() {
    if (currentPage > 0) {
        showPage(currentPage - 1);
    }
}

// Функции для кнопок
function shareTelegram() {
    const url = 'https://t.me/Lysmanov';
    const text = 'Подпишись на крутой канал LYSMANOV ✞!';
    window.open('https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text), '_blank');
}

function copyLink() {
    const url = 'https://t.me/Lysmanov';
    navigator.clipboard.writeText(url).then(function() {
        alert('Ссылка скопирована в буфер обмена!');
    }).catch(function() {
        alert('Ссылка скопирована!');
    });
}

console.log('🚀 LYSMANOV Site - Script loaded');
