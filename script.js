console.log('🚀 LYSMANOV Site - Starting...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded');
    
    // Простая анимация текста
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
    
    // Реальная статистика
    function updateRealStats() {
        console.log('📊 Updating stats...');
        const REAL_SUBSCRIBERS = 51;
        const REAL_POSTS = 484;
        
        try {
            const subscribersProgress = document.getElementById('subscribers-progress');
            const postsProgress = document.getElementById('posts-progress');
            const subscribersText = document.getElementById('subscribers-text');
            const postsText = document.getElementById('posts-text');
            
            if (subscribersProgress && postsProgress && subscribersText && postsText) {
                subscribersProgress.style.width = REAL_SUBSCRIBERS + '%';
                subscribersText.textContent = REAL_SUBSCRIBERS + '/100';
                
                const postsPercentage = (REAL_POSTS / 1000) * 100;
                postsProgress.style.width = postsPercentage + '%';
                postsText.textContent = REAL_POSTS + '/1000';
                
                console.log('✅ Stats updated successfully');
            }
        } catch (error) {
            console.log('❌ Error updating stats:', error);
        }
    }
    
    // Обратный отсчет
    function startCountdown() {
        console.log('⏰ Starting countdown...');
        const targetDate = new Date('2026-01-01T00:00:00').getTime();
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            if (distance < 0) {
                if (daysElement) daysElement.textContent = '00';
                if (hoursElement) hoursElement.textContent = '00';
                if (minutesElement) minutesElement.textContent = '00';
                if (secondsElement) secondsElement.textContent = '00';
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
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    // Запускаем все функции
    setTimeout(function() {
        updateRealStats();
        startCountdown();
    }, 1000);
});

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
