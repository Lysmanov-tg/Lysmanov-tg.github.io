document.addEventListener('DOMContentLoaded', () => {
    const text = document.getElementById('text');
    const textContent = text.textContent;
    text.innerHTML = '';
    
    for (let i = 0; i < textContent.length; i++) {
        const letter = document.createElement('span');
        letter.className = 'letter';
        letter.textContent = textContent[i];
        const delay = i * 0.2;
        letter.style.animationDelay = `${delay}s, ${delay + 2}s`;
        const moveDuration = 6 + Math.random() * 3;
        letter.style.animationDuration = `2s, ${moveDuration}s`;
        text.appendChild(letter);
    }
    
    const signature = document.getElementById('signature');
    const signatureContent = signature.textContent;
    signature.innerHTML = '';
    
    for (let i = 0; i < signatureContent.length; i++) {
        const letter = document.createElement('span');
        letter.className = 'signature-letter';
        letter.textContent = signatureContent[i];
        letter.style.animationDelay = `${i * 0.05}s`;
        signature.appendChild(letter);
    }
    
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const left = Math.random() * 100;
        const delay = Math.random() * 8;
        const duration = 6 + Math.random() * 6;
        const size = 1 + Math.random() * 2;
        particle.style.left = `${left}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        const colors = ['#ff3366', '#00b4ff', '#8b0000', '#0066ff'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = randomColor;
        particlesContainer.appendChild(particle);
    }
    
    // РЕАЛЬНЫЕ ДАННЫЕ ПОДПИСЧИКОВ - НАЧАЛО
    function updateRealStats() {
        const REAL_SUBSCRIBERS = 51;  // ТЕКУЩИЕ ПОДПИСЧИКИ
        const REAL_POSTS = 484;       // ТЕКУЩИЕ ПОСТЫ
        
        const subscribersProgress = document.getElementById('subscribers-progress');
        const postsProgress = document.getElementById('posts-progress');
        const subscribersText = document.getElementById('subscribers-text');
        const postsText = document.getElementById('posts-text');
        const helpText = document.querySelector('.stat-item .help-text');
        
        // Обновляем подписчиков
        subscribersProgress.style.width = `${REAL_SUBSCRIBERS}%`;
        subscribersText.textContent = `${REAL_SUBSCRIBERS}/100`;
        
        // Обновляем посты
        const postsPercentage = (REAL_POSTS / 1000) * 100;
        postsProgress.style.width = `${postsPercentage}%`;
        postsText.textContent = `${REAL_POSTS}/1000`;
        
        // Динамические сообщения в зависимости от прогресса
        if (REAL_SUBSCRIBERS >= 100) {
            helpText.textContent = '🎉 Цель достигнута! Спасибо!';
            helpText.style.color = '#ff3366';
            helpText.style.fontWeight = 'bold';
        } else if (REAL_SUBSCRIBERS >= 75) {
            helpText.textContent = 'Почти у цели! Осталось немного! 🔥';
            helpText.style.color = '#00ff88';
        } else if (REAL_SUBSCRIBERS >= 50) {
            helpText.textContent = 'Отлично! Уже половина пути! 💪';
            helpText.style.color = '#00b4ff';
        } else if (REAL_SUBSCRIBERS >= 25) {
            helpText.textContent = 'Хороший старт! Продолжаем в том же духе! 🚀';
            helpText.style.color = '#ffcc00';
        } else {
            helpText.textContent = 'Помогите достичь цели! Расскажите друзьям! 📢';
            helpText.style.color = '#ff3366';
        }
        
        // Сохраняем в localStorage
        localStorage.setItem('lastSubscribers', REAL_SUBSCRIBERS);
        localStorage.setItem('lastPosts', REAL_POSTS);
        
        console.log(`📊 Статистика обновлена: ${REAL_SUBSCRIBERS} подписчиков, ${REAL_POSTS} постов`);
    }

    // Функция для красивого появления прогресс-баров
    function animateProgressBars() {
        setTimeout(() => {
            const subscribersProgress = document.getElementById('subscribers-progress');
            const postsProgress = document.getElementById('posts-progress');
            
            subscribersProgress.style.transition = 'width 2s ease-in-out';
            postsProgress.style.transition = 'width 2s ease-in-out';
            
            // Запускаем обновление статистики
            updateRealStats();
        }, 1000);
    }

    // Автоматическое обновление каждые 10 минут
    function startAutoUpdate() {
        // Первый запуск
        animateProgressBars();
        
        // Дополнительно: обновляем каждые 10 минут
        setInterval(() => {
            console.log('🔄 Автообновление статистики...');
            updateRealStats();
        }, 10 * 60 * 1000);
    }

    // Запускаем обновление статистики с реальными цифрами
    startAutoUpdate();
    // РЕАЛЬНЫЕ ДАННЫЕ ПОДПИСЧИКОВ - КОНЕЦ
    
    document.addEventListener('mousemove', (e) => {
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            const rect = particle.getBoundingClientRect();
            const particleX = rect.left + rect.width / 2;
            const particleY = rect.top + rect.height / 2;
            const distance = Math.sqrt(
                Math.pow(e.clientX - particleX, 2) + 
                Math.pow(e.clientY - particleY, 2)
            );
            if (distance < 100) {
                particle.style.transform = `translate(${(e.clientX - particleX) * 0.1}px, ${(e.clientY - particleY) * 0.1}px)`;
            }
        });
    });
});

function shareTelegram() {
    const url = 'https://t.me/Lysmanov';
    const text = 'Подпишись на крутой канал LYSMANOV ✞ - важные новости, интересный контент, повседневность и многое другое!';
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
}

function copyLink() {
    const url = 'https://t.me/Lysmanov';
    navigator.clipboard.writeText(url).then(() => {
        alert('Ссылка скопирована в буфер обмена!');
    }).catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Ссылка скопирована!');
    });
}
