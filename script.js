// ============================================================
// 🎓 LEARN WITH MS. THÚY – Interactive Video Quiz
// ============================================================

// ===== CONFIGURATION =====
// Thay đổi Video ID YouTube tại đây
const YOUTUBE_VIDEO_ID = "8t_qFivFGaM?si=QOBUaHdtXVz54qBS"; // <-- Thay video ID của bạn
const youtubeURL = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`;

// ===== QUIZ DATA =====
// Thêm/sửa câu hỏi tại đây. Hỗ trợ 2 dạng: "mcq" và "fill"
const quizData = [
    {
        type: "mcq",
        question: "What is the main topic of the video?",
        choices: [
            "How to cook pasta",
            "English grammar basics",
            "Travel tips for Vietnam",
            "Mathematics for beginners"
        ],
        answer: 1,
        explanation: "The video focuses on fundamental English grammar concepts including tenses, sentence structure, and common expressions."
    },
    {
        type: "mcq",
        question: "What does the speaker say about 'present perfect' tense?",
        choices: [
            "It is used for past actions only",
            "It connects past and present",
            "It is the same as simple past",
            "It is only used in formal writing"
        ],
        answer: 1,
        explanation: "Present perfect tense connects a past action or state to the present moment. It's formed with 'have/has + past participle'."
    },
    {
        type: "fill",
        question: "Complete the sentence: 'She ___ to school every day.'",
        answer: "goes",
        explanation: "We use 'goes' because the subject 'She' is third person singular, and this is a habitual action (simple present tense)."
    },
    {
        type: "mcq",
        question: "Which sentence is grammatically correct?",
        choices: [
            "He don't like coffee.",
            "He doesn't likes coffee.",
            "He doesn't like coffee.",
            "He not like coffee."
        ],
        answer: 2,
        explanation: "With third person singular (he/she/it), we use 'doesn't' + base form of the verb. So 'He doesn't like coffee' is correct."
    },
    {
        type: "fill",
        question: "Fill in the blank: 'I have ___ (study) English for 5 years.'",
        answer: "studied",
        explanation: "Present perfect tense requires the past participle form. The past participle of 'study' is 'studied'."
    },
    {
        type: "mcq",
        question: "What is the meaning of the idiom 'break the ice'?",
        choices: [
            "To break something frozen",
            "To start a conversation in a social setting",
            "To feel very cold",
            "To solve a difficult problem"
        ],
        answer: 1,
        explanation: "'Break the ice' means to initiate conversation or make people feel more comfortable in a social situation, especially when people haven't met before."
    },
    {
        type: "fill",
        question: "Complete: 'If it rains tomorrow, we ___ stay at home.'",
        answer: "will",
        explanation: "This is a first conditional sentence: 'If + present simple, will + base verb'. It expresses a real possibility in the future."
    },
    {
        type: "mcq",
        question: "Choose the correct pronunciation guide for 'comfortable':",
        choices: [
            "com-FORT-a-ble (4 syllables)",
            "COMF-ta-ble (3 syllables)",
            "com-FOR-table (3 syllables)",
            "COM-for-TA-ble (4 syllables)"
        ],
        answer: 1,
        explanation: "Native speakers typically pronounce 'comfortable' with 3 syllables: COMF-ta-ble /ˈkʌmftəbəl/. Many learners mistakenly try to pronounce all written vowels."
    },
    {
        type: "fill",
        question: "Write the correct form: 'They ___ (play) football when it started to rain.'",
        answer: "were playing",
        explanation: "We use past continuous (was/were + V-ing) for an action that was in progress when another action interrupted it."
    },
    {
        type: "mcq",
        question: "What is the difference between 'make' and 'do'?",
        choices: [
            "They are completely interchangeable",
            "'Make' is for creating things, 'do' is for actions/tasks",
            "'Make' is formal, 'do' is informal",
            "There is no difference"
        ],
        answer: 1,
        explanation: "'Make' is generally used for creating or producing something (make a cake, make a plan), while 'do' is used for actions, tasks, or activities (do homework, do exercise)."
    }
];

// ===== GLOBAL VARIABLES =====
let totalQuestions = quizData.length;
let isChecked = false;

// ===== DOM ELEMENTS =====
const mainContent = document.getElementById('main-content');
const correctCountEl = document.getElementById('correct-count');
const scoreDisplayEl = document.getElementById('score-display');
const progressFillEl = document.getElementById('progress-fill');
const progressTextEl = document.getElementById('progress-text');
const popupOverlay = document.getElementById('popup-overlay');
const popupEmoji = document.getElementById('popup-emoji');
const popupTitle = document.getElementById('popup-title');
const popupMessage = document.getElementById('popup-message');
const popupCloseBtn = document.getElementById('popup-close');

// ===== INITIALIZE WEBSITE =====
function init() {
    renderContent();
    setupIntersectionObserver();
    updateStats(0);
}

// ===== RENDER ALL CONTENT =====
function renderContent() {
    // Page Title
    const titleHTML = `
        <div class="page-title">
            <h1>🎓 Learn with Ms. Thúy</h1>
            <p>📚 Interactive Video Quiz – Watch, Learn & Practice!</p>
        </div>
    `;

    // Video Column
    const videoColumnHTML = `
        <div class="video-column">
            <div class="video-card">
                <div class="video-wrapper">
                    <iframe 
                        src="${youtubeURL}" 
                        title="Lesson Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
                <div class="video-info">
                    <h3>📺 Watch the lesson video</h3>
                    <p>Listen carefully and answer the questions on the right!</p>
                </div>
            </div>
        </div>
    `;

    // Quiz Column
    let quizCardsHTML = '';
    quizData.forEach((q, index) => {
        quizCardsHTML += renderQuestionCard(q, index);
    });

    // Action Buttons
    const actionsHTML = `
        <div class="actions-bar">
            <button class="action-btn btn-check" id="btn-check" onclick="checkAnswers()">
                ✅ Check Answers
            </button>
            <button class="action-btn btn-reset" id="btn-reset" onclick="resetQuiz()">
                🔄 Reset
            </button>
        </div>
    `;

    // Assemble Main Content
    mainContent.innerHTML = `
        ${titleHTML}
        <div class="content-grid">
            ${videoColumnHTML}
            <div class="quiz-column">
                ${quizCardsHTML}
                ${actionsHTML}
            </div>
        </div>
    `;

    // Add ripple effect to buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', createRipple);
    });
}

// ===== RENDER SINGLE QUESTION CARD =====
function renderQuestionCard(question, index) {
    const qNumber = index + 1;
    let inputHTML = '';

    if (question.type === 'mcq') {
        // Multiple Choice
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
        // Fill in the Blank
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

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

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
            // Check MCQ
            const selected = document.querySelector(`input[name="q${index}"]:checked`);
            const selectedValue = selected ? parseInt(selected.value) : -1;
            isCorrect = selectedValue === q.answer;

            // Disable all radio buttons
            document.querySelectorAll(`input[name="q${index}"]`).forEach(input => {
                input.disabled = true;
            });

            // Highlight correct/incorrect options
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
            // Check Fill in the Blank
            const input = document.getElementById(`fill-${index}`);
            const userAnswer = input.value.trim().toLowerCase();
            const correctAnswer = q.answer.toLowerCase();
            isCorrect = userAnswer === correctAnswer;

            // Disable input
            input.disabled = true;

            if (isCorrect) {
                input.classList.add('correct-input');
            } else {
                input.classList.add('incorrect-input');
            }
        }

        // Update card appearance
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

        // Show explanation
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

    // Update stats
    updateStats(correctCount);

    // Show popup
    setTimeout(() => {
        showPopup(correctCount);
    }, 600);

    // Scroll to top
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

    let emoji, title, message;

    if (percentage >= 80) {
        emoji = '🎉';
        title = 'Excellent!';
        message = `Amazing work! You scored ${score}/10. You really know your stuff!`;
        // Confetti for high scores
        startConfetti();
    } else if (percentage >= 50) {
        emoji = '👏';
        title = 'Good Job!';
        message = `Nice effort! You scored ${score}/10. Keep it up!`;
    } else {
        emoji = '📚';
        title = 'Keep Practicing!';
        message = `You scored ${score}/10. Don't give up – practice makes perfect!`;
    }

    popupEmoji.textContent = emoji;
    popupTitle.textContent = title;
    popupMessage.textContent = message;
    popupOverlay.classList.add('show');
}

// ===== CLOSE POPUP =====
popupCloseBtn.addEventListener('click', () => {
    popupOverlay.classList.remove('show');
});

popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) {
        popupOverlay.classList.remove('show');
    }
});

// ===== RESET QUIZ =====
function resetQuiz() {
    isChecked = false;

    quizData.forEach((q, index) => {
        const card = document.getElementById(`card-${index}`);
        const resultBadge = document.getElementById(`result-${index}`);
        const explanationCard = document.getElementById(`explanation-${index}`);

        // Remove classes
        card.classList.remove('correct', 'incorrect');

        // Reset result badge
        resultBadge.className = 'result-badge';
        resultBadge.innerHTML = '';

        // Hide explanation
        explanationCard.classList.remove('show');

        if (q.type === 'mcq') {
            // Reset radio buttons
            const radios = document.querySelectorAll(`input[name="q${index}"]`);
            radios.forEach(radio => {
                radio.disabled = false;
                radio.checked = false;
            });
            // Reset option styles
            const options = card.querySelectorAll('.option-item');
            options.forEach(opt => {
                opt.style.borderColor = '';
                opt.style.background = '';
                opt.classList.remove('selected');
            });
        } else if (q.type === 'fill') {
            // Reset fill input
            const input = document.getElementById(`fill-${index}`);
            input.value = '';
            input.disabled = false;
            input.classList.remove('correct-input', 'incorrect-input');
        }
    });

    // Reset stats
    updateStats(0);

    // Scroll to top
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

    // Remove existing ripples
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) existingRipple.remove();

    button.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => ripple.remove(), 600);
}

// ===== MCQ OPTION CLICK HANDLER =====
document.addEventListener('change', (e) => {
    if (e.target.type === 'radio') {
        const name = e.target.name;
        // Remove selected class from all options in this question
        document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
            radio.closest('.option-item').classList.remove('selected');
        });
        // Add selected class to chosen option
        e.target.closest('.option-item').classList.add('selected');
    }
});

// ===== CONFETTI ANIMATION =====
function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiPieces = [];
    const colors = ['#FFB347', '#FFB6C1', '#C3B1E1', '#A7C7E7', '#B2DFDB', '#FF6B9D', '#56ab2f', '#f1c40f'];
    const numPieces = 150;

    // Create confetti pieces
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
    const maxFrames = 300; // ~5 seconds at 60fps

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frame++;

        confettiPieces.forEach(piece => {
            piece.y += piece.speed;
            piece.x += piece.drift;
            piece.angle += piece.spin;

            // Fade out near the end
            if (frame > maxFrames - 60) {
                piece.opacity -= 0.016;
            }

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

    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ===== KEYBOARD SUPPORT =====
document.addEventListener('keydown', (e) => {
    // Enter key to check answers
    if (e.key === 'Enter' && !isChecked) {
        checkAnswers();
    }
    // Escape key to close popup
    if (e.key === 'Escape') {
        popupOverlay.classList.remove('show');
    }
});
// ===== NAME INPUT HANDLING =====
const userNameInput = document.getElementById('user-name');

// Load tên đã lưu từ localStorage
function loadUserName() {
    const savedName = localStorage.getItem('msThuy_studentName');
    if (savedName) {
        userNameInput.value = savedName;
        userNameInput.classList.add('has-name');
    }
}

// Lưu tên khi người dùng gõ
function setupNameInput() {
    loadUserName();

    // Lưu khi gõ (debounce nhẹ để không lưu quá nhiều)
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

    // Hiệu ứng khi focus
    userNameInput.addEventListener('focus', () => {
        userNameInput.select();
    });

    // Lưu khi nhấn Enter hoặc blur
    userNameInput.addEventListener('blur', () => {
        const name = userNameInput.value.trim();
        if (name) {
            localStorage.setItem('msThuy_studentName', name);
            userNameInput.classList.add('has-name');
        }
    });

    userNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            userNameInput.blur();
        }
        // Ngăn Enter kích hoạt checkAnswers
        e.stopPropagation();
    });
}
// ===== START THE APP =====
document.addEventListener('DOMContentLoaded', init);
