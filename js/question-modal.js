// Question Modal Review System
// Shared functionality for displaying question review popups with navigation

let currentModalIndex = 0;
let modalQuestions = [];
let modalPreloadedImages = new Map(); // Cache for modal preloaded images

function preloadModalImages(currentIndex) {
    // Preload previous image
    if (currentIndex > 0) {
        const prevQuestion = modalQuestions[currentIndex - 1];
        if (prevQuestion && prevQuestion.imagePath) {
            const imagePath = `images/${prevQuestion.imagePath}`;
            if (!modalPreloadedImages.has(imagePath)) {
                const img = new Image();
                img.onload = () => {
                    modalPreloadedImages.set(imagePath, img);
                };
                img.src = imagePath;
            }
        }
    }

    // Preload next image
    if (currentIndex < modalQuestions.length - 1) {
        const nextQuestion = modalQuestions[currentIndex + 1];
        if (nextQuestion && nextQuestion.imagePath) {
            const imagePath = `images/${nextQuestion.imagePath}`;
            if (!modalPreloadedImages.has(imagePath)) {
                const img = new Image();
                img.onload = () => {
                    modalPreloadedImages.set(imagePath, img);
                };
                img.src = imagePath;
            }
        }
    }
}

function buildModalQuestionsList(questions, includeExtraCredit = false) {
    modalQuestions = [];

    // Add regular questions
    if (questions && questions.length > 0) {
        questions.forEach((question, index) => {
            modalQuestions.push({
                type: 'regular',
                index: index,
                questionNum: index + 1,
                question: question,
                questionText: question.question || 'What is the tissue/structure?',
                imagePath: question.image
            });
        });
    }

    // Add extra credit questions if provided
    if (includeExtraCredit && window.extraCreditQuestions && window.extraCreditQuestions.length > 0) {
        window.extraCreditQuestions.forEach((question, index) => {
            modalQuestions.push({
                type: 'extra-credit',
                index: index,
                questionNum: 'EC',
                question: question,
                questionText: question.question || 'Extra Credit Question',
                imagePath: question.image
            });
        });
    }
}

function getQuestionData(modalQuestion) {
    let studentAnswer = '';
    let resultType = '';
    let correctAnswer = modalQuestion.question.answer;

    // Use stored grading results if available (after submission)
    if (modalQuestion.question.gradingResult) {
        studentAnswer = modalQuestion.question.gradingResult.studentAnswer;
        resultType = modalQuestion.question.gradingResult.resultType;
    } else {
        // Fallback to DOM parsing (before submission)
        if (modalQuestion.type === 'regular') {
            const answerInput = document.querySelector(`input[name="answer${modalQuestion.questionNum}"]`);
            if (answerInput) {
                studentAnswer = answerInput.value.trim();
            }
        } else if (modalQuestion.type === 'extra-credit') {
            const extraCreditInput = document.querySelector(`input[name="extra-credit-${modalQuestion.index}"]`);
            if (extraCreditInput) {
                studentAnswer = extraCreditInput.value.trim();
            }
        }
    }

    return { studentAnswer, resultType, correctAnswer };
}

function getTextOnlyThemeClass(themeName) {
    return `text-only-theme-${themeName || 'default'}`;
}

function showQuestionPopup(questionNum, questionText, correctAnswer, imagePath, studentAnswer = '', resultType = '') {
    // Build the questions list if not already built
    if (modalQuestions.length === 0) {
        console.warn('Modal questions list not built. Call buildModalQuestionsList() first.');
        return;
    }

    // Find the index in our modal questions list
    let targetIndex = 0;
    if (questionNum === 'EC') {
        // Find the extra credit question
        targetIndex = modalQuestions.findIndex(q => q.type === 'extra-credit');
    } else {
        // Find the regular question
        targetIndex = modalQuestions.findIndex(q => q.type === 'regular' && q.questionNum == questionNum);
    }

    if (targetIndex >= 0) {
        currentModalIndex = targetIndex;
    }

    showModalAtIndex(currentModalIndex);
}

function showModalAtIndex(index) {
    if (index < 0 || index >= modalQuestions.length) return;

    // Preload adjacent modal images for smooth navigation
    preloadModalImages(index);

    // Remove any existing popup
    const existingPopup = document.querySelector('.question-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    const modalQuestion = modalQuestions[index];
    const { studentAnswer, resultType, correctAnswer } = getQuestionData(modalQuestion);

    // Format correct answer for display
    const displayCorrectAnswer = Array.isArray(correctAnswer)
        ? correctAnswer.join(' OR ')
        : correctAnswer;

    // Create student response section based on result type
    let studentResponseSection = '';
    if (studentAnswer || resultType === 'unanswered') {
        let responseClass = '';
        let responseIcon = '';

        switch (resultType) {
            case 'correct':
                responseClass = 'student-response-correct';
                responseIcon = '✓';
                break;
            case 'partial':
                responseClass = 'student-response-partial';
                responseIcon = '½';
                break;
            case 'incorrect':
                responseClass = 'student-response-incorrect';
                responseIcon = '✗';
                break;
            case 'unanswered':
                responseClass = 'student-response-unanswered';
                responseIcon = '—';
                break;
        }

        const displayStudentAnswer = (resultType === 'unanswered' || !studentAnswer) ? '(blank)' : studentAnswer;

        studentResponseSection = `
            <div class="popup-student-response ${responseClass}">
                <div class="response-number">${modalQuestion.questionNum}</div>
                <span class="response-text">${displayStudentAnswer}</span>
                <span class="response-icon">${responseIcon}</span>
            </div>
        `;
    }

    // Show correct answer for wrong, partial, or unanswered
    let correctAnswerSection = '';
    if (resultType !== 'correct' && correctAnswer) {
        correctAnswerSection = `
            <div class="popup-correction">
                <span class="correction-text">${displayCorrectAnswer}</span>
            </div>
        `;
    }

    // Navigation arrows
    const navigationSection = `
        <div class="modal-navigation">
            <button class="modal-nav-btn modal-prev" onclick="navigateModal(-1)" ${index === 0 ? 'disabled' : ''}>‹</button>
            <span class="modal-position">${index + 1} of ${modalQuestions.length}</span>
            <button class="modal-nav-btn modal-next" onclick="navigateModal(1)" ${index === modalQuestions.length - 1 ? 'disabled' : ''}>›</button>
        </div>
    `;

    // Create popup
    const popup = document.createElement('div');
    popup.className = 'question-popup';

    // For text-only questions, apply theme styling
    let questionDisplaySection = '';
    if (modalQuestion.imagePath) {
        // Check if this is a text-overlay question
        if (modalQuestion.question.textOverlay) {
            // Text overlay question - show image with text overlaid
            questionDisplaySection = `
                <div class="popup-image popup-image-with-overlay">
                    <img src="images/${modalQuestion.imagePath}" alt="Labeled anatomical structure" />
                    <div class="popup-question-overlay">${modalQuestion.questionText}</div>
                </div>
            `;
        } else {
            // Regular image question
            questionDisplaySection = `
                <div class="popup-image">
                    <img src="images/${modalQuestion.imagePath}" alt="Labeled anatomical structure" />
                </div>
                <div class="popup-question">${modalQuestion.questionText}</div>
            `;
        }
    } else {
        // Text-only question - apply theme
        const themeClass = getTextOnlyThemeClass(modalQuestion.question.theme);

        // Calculate responsive font size based on question length
        const textLength = modalQuestion.questionText.length;
        let fontSize;
        if (textLength <= 20) {
            fontSize = '2rem';
        } else if (textLength <= 30) {
            fontSize = '1.8rem';
        } else if (textLength <= 45) {
            fontSize = '1.5rem';
        } else if (textLength <= 70) {
            fontSize = '1.3rem';
        } else if (textLength <= 100) {
            fontSize = '1.1rem';
        } else {
            fontSize = '1rem';
        }

        questionDisplaySection = `
            <div class="popup-question">
                <div class="text-only-question-box ${themeClass}">
                    <span class="text-content" style="font-size: ${fontSize};">${modalQuestion.questionText}</span>
                </div>
            </div>
        `;
    }

    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-header">
                <h3>Question ${modalQuestion.questionNum}</h3>
                <button class="close-popup" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
            </div>
            ${questionDisplaySection}
            ${studentResponseSection}
            ${correctAnswerSection}
            ${navigationSection}
        </div>
    `;

    // Add to page
    document.body.appendChild(popup);

    // Add click outside to close
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.remove();
        }
    });

    // Add keyboard navigation
    const handleKeydown = (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            navigateModal(-1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            navigateModal(1);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            popup.remove();
            document.removeEventListener('keydown', handleKeydown);
        }
    };

    document.addEventListener('keydown', handleKeydown);

    // Remove event listener when popup is closed
    const originalRemove = popup.remove.bind(popup);
    popup.remove = () => {
        document.removeEventListener('keydown', handleKeydown);
        originalRemove();
    };
}

function navigateModal(direction) {
    const newIndex = currentModalIndex + direction;
    if (newIndex >= 0 && newIndex < modalQuestions.length) {
        currentModalIndex = newIndex;
        showModalAtIndex(currentModalIndex);
    }
}
