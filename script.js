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
    question: "Why does Sheldon say he cannot be adopted?",
    choices: [
      "Because he looks like his parents.",
      "Because he has a twin sister.",
      "Because he has a younger brother.",
      "Because he knows his birth parents."
    ],
    answer: 1,
    explanation: "Sheldon says, 'How can I be adopted when I have a twin sister?'"
  },
  {
    type: "mcq",
    question: "What were they about to do before dinner?",
    choices: [
      "Watch TV",
      "Wash the dishes",
      "Pray",
      "Leave the house"
    ],
    answer: 2,
    explanation: "Mary says, 'Now, let's pray.'"
  },
  {
    type: "mcq",
    question: "What food did Georgie wish they had?",
    choices: [
      "French fries",
      "Mashed potatoes",
      "Chicken nuggets",
      "Tater tots"
    ],
    answer: 3,
    explanation: "Georgie asks, 'How come we ain't got no tater tots?'"
  },
  {
    type: "mcq",
    question: "What does George Sr. say he prefers?",
    choices: [
      "Tater tots over mashed potatoes",
      "Rice over potatoes ",
      "Mashed potatoes over tater tots",
      "Pizza over potatoes"
    ],
    answer: 0,
    explanation: "George says he'd take tater tots over mashed potatoes any day."
  },
  {
    type: "mcq",
    question: "Why is Georgie unhappy about school?",
    choices: [
      "He failed his classes.",
      "He has too much homework.",
      "Sheldon will be in the same grade.",
      "He is changing schools."
    ],
    answer: 2,
    explanation: "Georgie complains that Sheldon will be in the same grade as him."
  },
  {
    type: "mcq",
    question: "What does Sheldon say about ninth grade?",
    choices: [
      "He wants to repeat it.",
      "He won't stay there for very long.",
      "He is afraid of it.",
      "He plans to skip school."
    ],
    answer: 1,
    explanation: "Sheldon says he isn't planning on being in the ninth grade for very long."
  },
  {
    type: "mcq",
    question: "Why can't George Sr. go to church?",
    choices: [
      "He is meeting with the other coaches.",
      "He has homework.",
      "He is sick",
      "He is traveling."
    ],
    answer: 0,
    explanation: "George Sr. says he is meeting with the other coaches."
  },
  {
    type: "mcq",
    question: "Why does Sheldon decide to go to church?",
    choices: [
      "He believes in God.",
      "He likes church music.",
      "He believes in Mom.",
      "His teacher told him to go."
    ],
    answer: 2,
    explanation: "Sheldon says, 'I don't believe in God, but I believe in Mom.'"
  },
  {
    type: "mcq",
    question: "Who asked Missy to do something?",
    choices: [
      "Sheldon",
      "Heather",
      "Georgie",
      "Mary"
    ],
    answer: 1,
    explanation: "Missy says Heather asked her to do something."
  },
  {
    type: "mcq",
    question: "According to Adult Sheldon, where did Jane Goodall go to study apes?",
    choices: [
      "Africa",
      "Asia",
      "Australia",
      "Europe"
    ],
    answer: 0,
    explanation: "Adult Sheldon says Jane Goodall had to go to Africa to study apes."
  },
  {
    type: "fill",
    question: "Complete the sentence: 'Sheldon said he was exploring ________ kinematics.'",
    answer: "dimensional",
    explanation: "The full phrase is 'dimensional kinematics.'"
  },
  {
    type: "fill",
    question: "Complete the sentence: 'Mary thanked God for the ________ they were about to receive.'",
    answer: "food",
    explanation: "She prayed, 'Thank you, God, for this food we're about to receive.'"
  },
  {
    type: "fill",
    question: "Complete the sentence: 'George Sr. preferred tater tots over mashed ________.'",
    answer: "potatoes",
    explanation: "George says he would take tater tots over mashed potatoes any day."
  },
  {
    type: "fill",
    question: "Complete the sentence: 'High school is a haven for higher ________.'",
    answer: "learning",
    explanation: "Sheldon describes high school as 'a haven for higher learning.'"
  },
  {
    type: "fill",
    question: "Complete the sentence: Sheldon says that he doesn't believe in God, but he believes in his  ________.'",
    answer: "mom",
    explanation: "Sheldon goes to church because he believes in his mother."
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
    setupNameInput(); // 👈 Thêm dòng này
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
    const studentName = userNameInput.value.trim() || 'Student'; // 👈 Lấy tên

    let emoji, title, message;

    if (percentage >= 80) {
        emoji = '🎉';
        title = `Excellent, ${studentName}!`; // 👈 Gọi tên
        message = `Amazing work! You scored ${score}/10. You really know your stuff!`;
        startConfetti();
    } else if (percentage >= 50) {
        emoji = '👏';
        title = `Good Job, ${studentName}!`;
        message = `Nice effort! You scored ${score}/10. Keep it up!`;
    } else {
        emoji = '📚';
        title = `Keep Practicing, ${studentName}!`;
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
