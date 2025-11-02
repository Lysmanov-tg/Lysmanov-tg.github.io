// Простая инициализация
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 LYSMANOV Mobile Site Started');
    
    // Запускаем обратный отсчет
    startMobileCountdown();
    
    // Инициализируем навигацию
    initMobileNavigation();
});

// Обратный отсчет для мобильных
function startMobileCountdown() {
    const targetDate = new Date('2026-01-01T00:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            updateTimerElements('00', '00', '00', '00');
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        updateTimerElements(
            days.toString().padStart(2, '0'),
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        );
    }
    
    function updateTimerElements(days, hours, minutes, seconds) {
        const daysEl = document.getElementById('mobile-days');
        const hoursEl = document.getElementById('mobile-hours');
        const minutesEl = document.getElementById('mobile-minutes');
        const secondsEl = document.getElementById('mobile-seconds');
        
        if (daysEl) daysEl.textContent = days;
        if (hoursEl) hoursEl.textContent = hours;
        if (minutesEl) minutesEl.textContent = minutes;
        if (secondsEl) secondsEl.textContent = seconds;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Простая навигация по секциям
function initMobileNavigation() {
    const sections = document.querySelectorAll('.mobile-section');
    const dots = document.querySelectorAll('.dot');
    let currentSection = 0;
    
    // Показываем первую секцию
    showSection(0);
    
    // Обработчик скролла
    let isScrolling = false;
    
    window.addEventListener('wheel', function(e) {
        if (isScrolling) return;
        
        isScrolling = true;
        
        if (e.deltaY > 0 && currentSection < sections.length - 1) {
            // Скролл вниз
            showSection(currentSection + 1);
        } else if (e.deltaY < 0 && currentSection > 0) {
            // Скролл вверх
            showSection(currentSection - 1);
        }
        
        setTimeout(() => { isScrolling = false; }, 800);
    });
    
    // Обработчик касаний для мобильных
    let startY = 0;
    
    window.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
    });
    
    window.addEventListener('touchend', function(e) {
        if (isScrolling) return;
        
        const endY = e.changedTouches[0].clientY;
        const diff = startY - endY;
        
        if (Math.abs(diff) > 50) {
            isScrolling = true;
            
            if (diff > 0 && currentSection < sections.length - 1) {
                // Свайп вверх
                showSection(currentSection + 1);
            } else if (diff < 0 && currentSection > 0) {
                // Свайп вниз
                showSection(currentSection - 1);
            }
            
            setTimeout(() => { isScrolling = false; }, 800);
        }
    });
    
    // Клики по точкам
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const sectionIndex = parseInt(this.getAttribute('data-page'));
            showSection(sectionIndex);
        });
    });
    
    function showSection(index) {
        // Скрываем все секции
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Показываем выбранную секцию
        sections[index].classList.add('active');
        
        // Обновляем точки
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        dots[index].classList.add('active');
        
        currentSection = index;
        
        // Плавная прокрутка к секции
        sections[index].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Функции для кнопок
function shareTelegram() {
    const url = 'https://t.me/Lysmanov';
    const text = 'Подпишись на крутой канал LYSMANOV ✞ - важные новости и интересный контент!';
    window.open('https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text), '_blank');
}

function copyLink() {
    const url = 'https://t.me/Lysmanov';
    navigator.clipboard.writeText(url).then(function() {
        alert('Ссылка скопирована!');
    }).catch(function() {
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Ссылка скопирована!');
    });
}
