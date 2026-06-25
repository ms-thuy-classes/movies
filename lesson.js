// ============================================================
// 📚 LEARN WITH MS. THÚY – Lesson Page (fetch from JSON)
// ============================================================

// ===== GET POST ID FROM URL =====
function getPostId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// ===== GLOBAL STATE =====
let lessonData = null;
let quizData = [];
let totalQuestions = 0;
let isChecked = false;

// ===== DOM ELEMENTS =====
const mainContent = document.getElementById('main-content');
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const correctCountEl = document.getElementById('correct-count');
const scoreDisplayEl = document.getElementById('score-display');
const progressFillEl = document.getElementById('progress-fill');
const progressTextEl = document.getElementById('progress-text');
const popupOverlay = document.getElementById('popup-overlay');
const popupEmoji = document.getElementById('popup-emoji');
const popupTitle = document.getElementById('popup-title');
const popupMessage = document.getElementById('popup-message');
const popupCloseBtn = document.getElementById('popup-close');
const userNameInput = document.getElementById('user-name');
const themeToggle = document.getElementById('theme-toggle');

// ===== INITIALIZE =====
async function init() {
    loadTheme();
    setupThemeToggle();
    setupNameInput();
    
    const postId = getPostId();
    if (!postId) {
        showError();
        return;
    }
    
    await loadLesson(postId);
}

// ===== THEME =====
function loadTheme() {
    const saved = localStorage.getItem('msThuy_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
}

function setupThemeToggle() {
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('msThuy_theme', newTheme);
    });
}

// ===== NAME INPUT =====
function setupNameInput() {
    const savedName = localStorage.getItem('msThuy_studentName');
    if (savedName) {
        userNameInput.value = savedName;
        userNameInput.classList.add('has-name');
    }
    
    let saveTimeout;
    userNameInput.addEventListener('input', () => {
        const name = userNameInput.value.trim();
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            if (name) {
                localStorage.setItem('msThuy_studentName', name);
                userNameInput.classList.add('has-name');
            } else {
                localStorage.removeItem('msThuy_studentName');
                userNameInput.classList.remove('has-name');
            }
        }, 300);
    });
    
    userNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            userNameInput.blur();
        }
        e.stopPropagation();
    });
}

// ===== LOAD LESSON DATA =====
async function loadLesson(postId) {
    try {
        const response = await fetch(`data/posts/${postId}.json`);
        if (!response.ok) throw new Error('Lesson not found');
        
        lessonData = await response.json();
        quizData = lessonData.quizData || [];
        totalQuestions = quizData.length;
        
        // Update page title
        document.title = `${lessonData.videoTitle} – Learn with Ms. Thúy`;
        
        renderLesson();
    } catch (error) {
        console.error('Error loading lesson:', error);
        showError();
    }
}

// ===== SHOW ERROR =====
function showError() {
    loadingState.style.display = 'none';
    errorState.style.display = 'block';
}

// ===== RENDER LESSON =====
function renderLesson() {
    loadingState.style.display = 'none';
    
    const youtubeURL = `https://www.youtube.com/embed/${lessonData.videoId}`;
    
    // Build quiz cards
    let quizCardsHTML = '';
    quizData.forEach((q, index) => {
        quizCardsHTML += renderQuestionCard(q, index);
    });
    
    // Assemble page
    mainContent.innerHTML = `
        <div class="page-title">
            <span class="level-badge ${lessonData.level}">${lessonData.level}</span>
            <h1>📚 ${lessonData.videoTitle}</h1>
            <p>${lessonData.videoDescription || 'Watch the video and test your understanding!'}</p>
        </div>
        <div class="content-grid">
            <div class="video-column">
                <div class="video-card">
                    <div class="video-wrapper">
                        <iframe 
                            src="${youtubeURL}" 
                            title="${lessonData.videoTitle}"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    </div>
                    <div class="video-info">
                        <h3>📺 ${lessonData.videoTitle}</h3>
                        <p>⏱ Duration: ${lessonData.duration || '—'} • ❓ ${totalQuestions} questions</p>
                    </div>
                </div>
            </div>
            <div class="quiz-column">
                ${quizCardsHTML}
                <div class="actions-bar">
                    <button class="action-btn btn-check" id="btn-check" onclick="checkAnswers()">
                        ✅ Check Answers
                    </button>
                    <button class="action-btn btn-reset" id="btn-reset" onclick="resetQuiz()">
                        🔄 Reset
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Setup interactions
    setupIntersectionObserver();
    updateStats(0);
    
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', createRipple);
    });
}

// ===== RENDER QUESTION CARD =====
function renderQuestionCard(question, index) {
    const qNumber = index + 1;
    let inputHTML = '';

    if (question.type === 'mcq') {
        let optionsHTML = '';
        question.choices.forEach((choice, i) => {
            optionsHTML += `
                <label class="option-item" data-index="${i}">
                    <input type="radio" name="q${index}" value="${i}">
                    <span class="option-radio"></span>
                    <span class="option-text">${String.fromCharCode(65 + i)}. ${choice}</span>
                </label>
            `;
        });
        inputHTML = `<div class="options-list">${optionsHTML}</div>`;
    } else if (question.type === 'fill') {
        inputHTML = `
            <input type="text" class="fill-input" id="fill-${index}" 
                   placeholder="Type your answer here..." 
                   autocomplete="off" spellcheck="false">
        `;
    }

    return `
        <div class="question-card" data-question="${index}" id="card-${index}">
            <div class="question-number">${qNumber}</div>
            <div class="question-text">${question.question}</div>
            ${inputHTML}
            <div class="result-badge" id="result-${index}"></div>
            <div class="explanation-card" id="explanation-${index}">
                <div class="explanation-header">
                    <span>💡</span>
                    <span>Explanation</span>
                </div>
                <div class="explanation-content" id="explanation-content-${index}"></div>
            </div>
        </div>
    `;
}

// ===== INTERSECTION OBSERVER =====
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.question-card').forEach(card => {
        observer.observe(card);
    });
}

// ===== CHECK ANSWERS =====
function checkAnswers() {
    if (isChecked) return;
    isChecked = true;

    let correctCount = 0;

    quizData.forEach((q, index) => {
        const card = document.getElementById(`card-${index}`);
        const resultBadge = document.getElementById(`result-${index}`);
        const explanationCard = document.getElementById(`explanation-${index}`);
        const explanationContent = document.getElementById(`explanation-content-${index}`);

        let isCorrect = false;

        if (q.type === 'mcq') {
            const selected = document.querySelector(`input[name="q${index}"]:checked`);
            const selectedValue = selected ? parseInt(selected.value) : -1;
            isCorrect = selectedValue === q.answer;

            document.querySelectorAll(`input[name="q${index}"]`).forEach(input => {
                input.disabled = true;
            });

            const options = card.querySelectorAll('.option-item');
            options.forEach((opt, i) => {
                if (i === q.answer) {
                    opt.style.borderColor = '#56ab2f';
                    opt.style.background = 'rgba(86, 171, 47, 0.1)';
                } else if (i === selectedValue && !isCorrect) {
                    opt.style.borderColor = '#e74c3c';
                    opt.style.background = 'rgba(231, 76, 60, 0.1)';
                }
            });
        } else if (q.type === 'fill') {
            const input = document.getElementById(`fill-${index}`);
            const userAnswer = input.value.trim().toLowerCase();
            const correctAnswer = q.answer.toLowerCase();
            isCorrect = userAnswer === correctAnswer;
            input.disabled = true;
            input.classList.add(isCorrect ? 'correct-input' : 'incorrect-input');
        }

        if (isCorrect) {
            correctCount++;
            card.classList.add('correct');
            resultBadge.className = 'result-badge correct-badge show';
            resultBadge.innerHTML = '✔ Correct!';
        } else {
            card.classList.add('incorrect');
            resultBadge.className = 'result-badge incorrect-badge show';
            resultBadge.innerHTML = '✖ Incorrect';
        }

        let explanationHTML = '';
        if (!isCorrect && q.type === 'mcq') {
            explanationHTML += `<div class="correct-answer-text">✔ Correct Answer: ${String.fromCharCode(65 + q.answer)}. ${q.choices[q.answer]}</div>`;
        } else if (!isCorrect && q.type === 'fill') {
            explanationHTML += `<div class="correct-answer-text">✔ Correct Answer: ${q.answer}</div>`;
        }
        explanationHTML += `<div class="explanation-text">${q.explanation}</div>`;
        explanationContent.innerHTML = explanationHTML;
        explanationCard.classList.add('show');
    });

    updateStats(correctCount);

    setTimeout(() => {
        showPopup(correctCount);
    }, 600);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== UPDATE STATS =====
function updateStats(correctCount) {
    const score = ((correctCount / totalQuestions) * 10).toFixed(1);
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    correctCountEl.textContent = `${correctCount} / ${totalQuestions}`;
    scoreDisplayEl.textContent = `${score} / 10`;
    progressFillEl.style.width = `${percentage}%`;
    progressTextEl.textContent = `${percentage}%`;
}

// ===== SHOW POPUP =====
function showPopup(correctCount) {
    const score = ((correctCount / totalQuestions) * 10).toFixed(1);
    const percentage = (correctCount / totalQuestions) * 100;
    const studentName = userNameInput.value.trim() || 'Student';

    let emoji, title, message;

    if (percentage >= 80) {
        emoji = '🎉';
        title = `Excellent, ${studentName}!`;
        message = `Amazing work! You scored ${score}/10.`;
        startConfetti();
    } else if (percentage >= 50) {
        emoji = '👏';
        title = `Good Job, ${studentName}!`;
        message = `Nice effort! You scored ${score}/10.`;
    } else {
        emoji = '📚';
        title = `Keep Practicing, ${studentName}!`;
        message = `You scored ${score}/10. Don't give up!`;
    }

    popupEmoji.textContent = emoji;
    popupTitle.textContent = title;
    popupMessage.textContent = message;
    popupOverlay.classList.add('show');
}

popupCloseBtn.addEventListener('click', () => {
    popupOverlay.classList.remove('show');
});

popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) popupOverlay.classList.remove('show');
});

// ===== RESET QUIZ =====
function resetQuiz() {
    isChecked = false;

    quizData.forEach((q, index) => {
        const card = document.getElementById(`card-${index}`);
        const resultBadge = document.getElementById(`result-${index}`);
        const explanationCard = document.getElementById(`explanation-${index}`);

        card.classList.remove('correct', 'incorrect');
        resultBadge.className = 'result-badge';
        resultBadge.innerHTML = '';
        explanationCard.classList.remove('show');

        if (q.type === 'mcq') {
            document.querySelectorAll(`input[name="q${index}"]`).forEach(radio => {
                radio.disabled = false;
                radio.checked = false;
            });
            card.querySelectorAll('.option-item').forEach(opt => {
                opt.style.borderColor = '';
                opt.style.background = '';
                opt.classList.remove('selected');
            });
        } else if (q.type === 'fill') {
            const input = document.getElementById(`fill-${index}`);
            input.value = '';
            input.disabled = false;
            input.classList.remove('correct-input', 'incorrect-input');
        }
    });

    updateStats(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== RIPPLE EFFECT =====
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');

    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) existingRipple.remove();

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

// ===== MCQ OPTION CLICK =====
document.addEventListener('change', (e) => {
    if (e.target.type === 'radio') {
        const name = e.target.name;
        document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
            radio.closest('.option-item').classList.remove('selected');
        });
        e.target.closest('.option-item').classList.add('selected');
    }
});

// ===== CONFETTI =====
function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiPieces = [];
    const colors = ['#FFB347', '#FFB6C1', '#C3B1E1', '#A7C7E7', '#B2DFDB', '#FF6B9D', '#56ab2f', '#f1c40f'];
    const numPieces = 150;

    for (let i = 0; i < numPieces; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 12 + 6,
            h: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 3 + 2,
            angle: Math.random() * 360,
            spin: Math.random() * 0.2 - 0.1,
            drift: Math.random() * 2 - 1,
            opacity: 1
        });
    }

    let frame = 0;
    const maxFrames = 300;

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frame++;

        confettiPieces.forEach(piece => {
            piece.y += piece.speed;
            piece.x += piece.drift;
            piece.angle += piece.spin;
            if (frame > maxFrames - 60) piece.opacity -= 0.016;

            ctx.save();
            ctx.translate(piece.x, piece.y);
            ctx.rotate((piece.angle * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, piece.opacity);
            ctx.fillStyle = piece.color;
            ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
            ctx.restore();
        });

        if (frame < maxFrames) {
            requestAnimationFrame(animateConfetti);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animateConfetti();
}

// ===== KEYBOARD SUPPORT =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isChecked && document.activeElement !== userNameInput) {
        checkAnswers();
    }
    if (e.key === 'Escape') {
        popupOverlay.classList.remove('show');
    }
});

// ===== START =====
document.addEventListener('DOMContentLoaded', init);
