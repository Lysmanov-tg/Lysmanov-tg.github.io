console.log('🚀 LYSMANOV Site - Starting...');

// Переменные для управления страницами
let currentPage = 0;
const totalPages = 4;
let isScrolling = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded');
    
    // Инициализация листания
    initSwipeNavigation();
    
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
        const messageElement = document.getElementById('countdownMessage');
        
        const messages = [
            "🎉 Скоро Новый 2026 Год!",
            "⏰ Время летит незаметно...",
            "🚀 Готовься к празднику!",
            "🎁 Сколько планов на следующий год?"
        ];

        function updateCountdown() {
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
            
            // Смена сообщения
            if (messageElement && seconds % 10 === 0) {
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                messageElement.textContent = randomMessage;
            }
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
        
        // Первое сообщение
        if (messageElement) {
            messageElement.textContent = messages[0];
        }
    }

    // Функция для инициализации навигации свайпами
    function initSwipeNavigation() {
        const pagesContainer = document.querySelector('.pages-container');
        const pages = document.querySelectorAll('.page');
        const dots = document.querySelectorAll('.page-dot');
        
        if (!pagesContainer) return;
        
        // Показываем первую страницу
        showPage(0);
        
        // Обработчик колеса мыши для десктопа
        pagesContainer.addEventListener('wheel', function(e) {
            if (isScrolling) return;
            
            if (e.deltaY > 0) {
                // Скролл вниз - следующая страница
                nextPage();
            } else {
                // Скролл вверх - предыдущая страница
                prevPage();
            }
        });
        
        // Обработчик касаний для мобильных
        let startY = 0;
        
        pagesContainer.addEventListener('touchstart', function(e) {
            startY = e.touches[0].clientY;
        });
        
        pagesContainer.addEventListener('touchend', function(e) {
            if (isScrolling) return;
            
            const endY = e.changedTouches[0].clientY;
            const diff = startY - endY;
            
            // Минимальная дистанция свайпа
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    // Свайп вверх - следующая страница
                    nextPage();
                } else {
                    // Свайп вниз - предыдущая страница
                    prevPage();
                }
            }
        });
        
        // Обработчики для точек-индикаторов
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const pageIndex = parseInt(this.getAttribute('data-page'));
                showPage(pageIndex);
            });
        });
    }
    
    // Функция показа страницы
    function showPage(pageIndex) {
        if (isScrolling || pageIndex < 0 || pageIndex >= totalPages) return;
        
        isScrolling = true;
        currentPage = pageIndex;
        
        const pages = document.querySelectorAll('.page');
        const dots = document.querySelectorAll('.page-dot');
        const pagesContainer = document.querySelector('.pages-container');
        
        // Скрываем все страницы
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Показываем выбранную страницу
        pages[pageIndex].classList.add('active');
        
        // Обновляем индикаторы
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        dots[pageIndex].classList.add('active');
        
        // Прокручиваем к странице
        if (pagesContainer) {
            pagesContainer.scrollTo({
                top: window.innerHeight * pageIndex,
                behavior: 'smooth'
            });
        }
        
        // Сбрасываем флаг прокрутки
        setTimeout(() => {
            isScrolling = false;
        }, 500);
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
    
    // Глобальные функции для отладки
    window.nextPage = nextPage;
    window.prevPage = prevPage;
    window.showPage = showPage;

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

console.log('🚀 LYSMANOV Site - Script loaded');console.log('🚀 LYSMANOV Site - Starting...');

// Переменные для управления страницами
let currentPage = 0;
const totalPages = 4;
let isScrolling = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded');
    
    // Инициализация листания
    initSwipeNavigation();
    
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
        const messageElement = document.getElementById('countdownMessage');
        
        const messages = [
            "🎉 Скоро Новый 2026 Год!",
            "⏰ Время летит незаметно...",
            "🚀 Готовься к празднику!",
            "🎁 Сколько планов на следующий год?"
        ];

        function updateCountdown() {
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
            
            // Смена сообщения
            if (messageElement && seconds % 10 === 0) {
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                messageElement.textContent = randomMessage;
            }
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
        
        // Первое сообщение
        if (messageElement) {
            messageElement.textContent = messages[0];
        }
    }

    // Функция для инициализации навигации свайпами
    function initSwipeNavigation() {
        const pagesContainer = document.querySelector('.pages-container');
        const pages = document.querySelectorAll('.page');
        const dots = document.querySelectorAll('.page-dot');
        
        if (!pagesContainer) return;
        
        // Показываем первую страницу
        showPage(0);
        
        // Обработчик колеса мыши для десктопа
        pagesContainer.addEventListener('wheel', function(e) {
            if (isScrolling) return;
            
            if (e.deltaY > 0) {
                // Скролл вниз - следующая страница
                nextPage();
            } else {
                // Скролл вверх - предыдущая страница
                prevPage();
            }
        });
        
        // Обработчик касаний для мобильных
        let startY = 0;
        
        pagesContainer.addEventListener('touchstart', function(e) {
            startY = e.touches[0].clientY;
        });
        
        pagesContainer.addEventListener('touchend', function(e) {
            if (isScrolling) return;
            
            const endY = e.changedTouches[0].clientY;
            const diff = startY - endY;
            
            // Минимальная дистанция свайпа
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    // Свайп вверх - следующая страница
                    nextPage();
                } else {
                    // Свайп вниз - предыдущая страница
                    prevPage();
                }
            }
        });
        
        // Обработчики для точек-индикаторов
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const pageIndex = parseInt(this.getAttribute('data-page'));
                showPage(pageIndex);
            });
        });
    }
    
    // Функция показа страницы
    function showPage(pageIndex) {
        if (isScrolling || pageIndex < 0 || pageIndex >= totalPages) return;
        
        isScrolling = true;
        currentPage = pageIndex;
        
        const pages = document.querySelectorAll('.page');
        const dots = document.querySelectorAll('.page-dot');
        const pagesContainer = document.querySelector('.pages-container');
        
        // Скрываем все страницы
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Показываем выбранную страницу
        pages[pageIndex].classList.add('active');
        
        // Обновляем индикаторы
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        dots[pageIndex].classList.add('active');
        
        // Прокручиваем к странице
        if (pagesContainer) {
            pagesContainer.scrollTo({
                top: window.innerHeight * pageIndex,
                behavior: 'smooth'
            });
        }
        
        // Сбрасываем флаг прокрутки
        setTimeout(() => {
            isScrolling = false;
        }, 500);
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
    
    // Глобальные функции для отладки
    window.nextPage = nextPage;
    window.prevPage = prevPage;
    window.showPage = showPage;

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
