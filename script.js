* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Special Elite', cursive, sans-serif;
    background: linear-gradient(135deg, #0c0c0c, #1a1a2e, #16213e);
    color: white;
    overflow-x: hidden;
    min-height: 100vh;
}

/* Particles */
#particles {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
}

.particle {
    position: absolute;
    background: #ff3366;
    border-radius: 50%;
    animation: float 6s ease-in-out infinite;
}

@keyframes float {
    0%, 100% {
        transform: translateY(0) translateX(0);
        opacity: 0.7;
    }
    25% {
        transform: translateY(-20px) translateX(10px);
        opacity: 1;
    }
    50% {
        transform: translateY(-40px) translateX(-10px);
        opacity: 0.8;
    }
    75% {
        transform: translateY(-20px) translateX(10px);
        opacity: 0.9;
    }
}

/* Desktop Version */
.desktop-version {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.desktop-header {
    text-align: center;
    margin-bottom: 40px;
    padding-top: 20px;
}

#text {
    font-size: 4rem;
    background: linear-gradient(45deg, #ff3366, #00b4ff, #ff00ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 10px;
    animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
    from {
        text-shadow: 0 0 10px #ff3366, 0 0 20px #ff3366, 0 0 30px #ff3366;
    }
    to {
        text-shadow: 0 0 20px #00b4ff, 0 0 30px #00b4ff, 0 0 40px #00b4ff;
    }
}

.tagline {
    font-size: 1.2rem;
    opacity: 0.8;
    margin-top: 10px;
}

.letter {
    display: inline-block;
    opacity: 0;
    animation: letterAppear 0.5s forwards, letterGlow 2s 2s infinite alternate;
}

@keyframes letterAppear {
    to {
        opacity: 1;
    }
}

@keyframes letterGlow {
    from {
        text-shadow: 0 0 5px currentColor;
    }
    to {
        text-shadow: 0 0 20px currentColor, 0 0 30px currentColor;
    }
}

/* Stats Container */
.stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.stat-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    padding: 25px;
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.stat-card h3 {
    font-size: 1.1rem;
    margin-bottom: 15px;
    color: #00b4ff;
}

.stat-number {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 15px;
    background: linear-gradient(45deg, #ff3366, #00b4ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #ff3366, #00b4ff);
    border-radius: 4px;
    transition: width 1s ease-in-out;
}

/* Countdown */
.countdown-container {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    padding: 30px;
    text-align: center;
    margin-bottom: 40px;
}

.countdown-container h3 {
    font-size: 1.5rem;
    margin-bottom: 25px;
    color: #00b4ff;
}

.countdown-timer {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    margin-bottom: 20px;
}

.time-unit {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    padding: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.time-number {
    font-size: 2.5rem;
    font-weight: bold;
    display: block;
    background: linear-gradient(45deg, #ff3366, #00b4ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.time-label {
    font-size: 0.9rem;
    opacity: 0.8;
    margin-top: 5px;
    display: block;
}

.countdown-message {
    font-size: 1.1rem;
    margin-top: 15px;
    color: #ff3366;
}

/* Benefits */
.benefits-container {
    margin-bottom: 40px;
}

.benefits-container h3 {
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 25px;
    color: #00b4ff;
}

.benefits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}

.benefit-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    padding: 25px;
    text-align: center;
    transition: transform 0.3s ease;
}

.benefit-card:hover {
    transform: translateY(-5px);
}

.benefit-icon {
    font-size: 2.5rem;
    margin-bottom: 15px;
    display: block;
}

.benefit-card h4 {
    font-size: 1.2rem;
    margin-bottom: 10px;
    color: #ff3366;
}

.benefit-card p {
    opacity: 0.8;
    line-height: 1.4;
}

/* Share Container */
.share-container {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    padding: 30px;
    text-align: center;
}

.share-container h3 {
    font-size: 1.5rem;
    margin-bottom: 25px;
    color: #00b4ff;
}

.share-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-bottom: 25px;
    flex-wrap: wrap;
}

.share-btn {
    padding: 12px 25px;
    border: none;
    border-radius: 25px;
    font-family: inherit;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: bold;
}

.telegram-btn {
    background: linear-gradient(135deg, #0088cc, #00b4ff);
    color: white;
}

.copy-btn {
    background: linear-gradient(135deg, #ff3366, #ff00ff);
    color: white;
}

.share-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.channel-preview {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.preview-stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: 15px;
    flex-wrap: wrap;
    gap: 10px;
}

.channel-link {
    display: inline-block;
    background: linear-gradient(135deg, #ff3366, #00b4ff);
    color: white;
    padding: 10px 20px;
    border-radius: 20px;
    text-decoration: none;
    font-weight: bold;
    transition: transform 0.3s ease;
}

.channel-link:hover {
    transform: translateY(-2px);
}

/* Mobile Version */
.mobile-version {
    display: none;
    min-height: 100vh;
    position: relative;
    overflow: hidden;
}

.mobile-section {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
}

.mobile-section.active {
    opacity: 1;
    transform: translateY(0);
    pointer-events: all;
}

.mobile-header {
    text-align: center;
    margin-bottom: 40px;
}

.mobile-header h1 {
    font-size: 2.5rem;
    background: linear-gradient(45deg, #ff3366, #00b4ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 10px;
}

.mobile-tagline {
    font-size: 1rem;
    opacity: 0.8;
}

.mobile-welcome {
    text-align: center;
}

.welcome-icon {
    font-size: 4rem;
    margin-bottom: 20px;
    animation: bounce 2s infinite;
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-10px);
    }
    60% {
        transform: translateY(-5px);
    }
}

.mobile-welcome h2 {
    font-size: 1.8rem;
    margin-bottom: 15px;
    color: #00b4ff;
}

.swipe-hint {
    margin-top: 30px;
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    font-size: 0.9rem;
    opacity: 0.7;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 0.7;
    }
    50% {
        opacity: 1;
    }
}

/* Mobile Stats */
.mobile-stats {
    width: 100%;
    max-width: 400px;
}

.mobile-stats h2 {
    text-align: center;
    font-size: 1.8rem;
    margin-bottom: 30px;
    color: #00b4ff;
}

.mobile-stat-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
}

.stat-icon {
    font-size: 2rem;
}

.stat-info {
    flex: 1;
}

.stat-info h3 {
    font-size: 1rem;
    margin-bottom: 5px;
    color: #ff3366;
}

.mobile-stat-number {
    font-size: 1.5rem;
    font-weight: bold;
    background: linear-gradient(45deg, #ff3366, #00b4ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.mobile-progress-bar {
    width: 80px;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
}

.mobile-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #ff3366, #00b4ff);
    border-radius: 3px;
    transition: width 1s ease-in-out;
}

/* Mobile Countdown */
.mobile-countdown {
    text-align: center;
    width: 100%;
    max-width: 400px;
}

.mobile-countdown h2 {
    font-size: 1.8rem;
    margin-bottom: 30px;
    color: #00b4ff;
}

.mobile-timer {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-bottom: 25px;
}

.mobile-time-unit {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    padding: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-time-number {
    font-size: 2rem;
    font-weight: bold;
    display: block;
    background: linear-gradient(45deg, #ff3366, #00b4ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.mobile-time-label {
    font-size: 0.8rem;
    opacity: 0.8;
    margin-top: 5px;
    display: block;
}

.mobile-countdown-message {
    font-size: 1rem;
    color: #ff3366;
    margin-top: 15px;
}

/* Mobile Share */
.mobile-share {
    text-align: center;
    width: 100%;
    max-width: 400px;
}

.mobile-share h2 {
    font-size: 1.8rem;
    margin-bottom: 25px;
    color: #00b4ff;
}

.mobile-benefits {
    margin-bottom: 25px;
}

.mobile-benefit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    margin-bottom: 10px;
    font-size: 0.9rem;
}

.benefit-emoji {
    font-size: 1.2rem;
}

.mobile-share-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 25px;
}

.mobile-share-btn {
    padding: 15px 25px;
    border: none;
    border-radius: 25px;
    font-family: inherit;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: bold;
}

.mobile-channel-link a {
    display: inline-block;
    background: linear-gradient(135deg, #ff3366, #00b4ff);
    color: white;
    padding: 12px 25px;
    border-radius: 25px;
    text-decoration: none;
    font-weight: bold;
    transition: transform 0.3s ease;
}

.mobile-channel-link a:hover {
    transform: translateY(-2px);
}

/* Mobile Navigation */
.mobile-navigation {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 1000;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
}

.dot.active {
    background: #00b4ff;
    transform: scale(1.2);
}

/* Notification */
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #ff3366, #00b4ff);
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    z-index: 10000;
    transform: translateX(150%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    max-width: 300px;
}

.notification.show {
    transform: translateX(0);
}

.notification-text {
    font-weight: bold;
}

/* Responsive */
@media (max-width: 768px) {
    .desktop-version {
        display: none;
    }
    
    .mobile-version {
        display: block;
    }
    
    #text {
        font-size: 2.5rem;
    }
    
    .countdown-timer {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .share-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .share-btn {
        width: 100%;
        max-width: 250px;
    }
}

@media (max-width: 480px) {
    .mobile-header h1 {
        font-size: 2rem;
    }
    
    .mobile-timer {
        grid-template-columns: 1fr;
    }
    
    .preview-stats {
        flex-direction: column;
        gap: 10px;
    }
}

/* Animation Classes */
.stat-updated {
    animation: statUpdate 0.6s ease-in-out;
}

.number-change {
    animation: numberChange 0.5s ease-in-out;
}

.message-change {
    animation: messageChange 1s ease-in-out;
}

@keyframes statUpdate {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); color: #00b4ff; }
    100% { transform: scale(1); }
}

@keyframes numberChange {
    0% { opacity: 0.5; transform: translateY(-10px); }
    100% { opacity: 1; transform: translateY(0); }
}

@keyframes messageChange {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
}

@keyframes pulseBlue {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}
