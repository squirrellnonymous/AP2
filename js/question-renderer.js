// Question Rendering Module
// Shared functionality for rendering questions and utility functions

/**
 * Get theme class for text-only questions
 * @param {string} themeName - Optional theme name from question data
 * @returns {string} CSS class name for the theme
 */
function getTextOnlyThemeClass(themeName) {
    return `text-only-theme-${themeName || 'default'}`;
}

/**
 * Fisher-Yates shuffle algorithm
 * Returns a shuffled copy of the array (does not modify original)
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled copy of the array
 */
function shuffleArray(array) {
    const shuffled = [...array]; // Create a copy
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Render a question in the image display area
 * Handles both image-based and text-only questions
 *
 * @param {Object} question - Question object with image/question/theme properties
 * @param {HTMLImageElement} imageElement - The image element to update
 * @param {HTMLElement} questionTextElement - The question text element to update
 * @returns {void}
 */
function renderQuestion(question, imageElement, questionTextElement) {
    if (!question) return;

    // Clear current image immediately
    imageElement.src = '';

    // Get the image container element
    const imageContainer = imageElement.closest('.image-container');

    if (question.image) {
        // Image-based question
        const imagePath = `images/${question.image}`;
        imageElement.src = imagePath;
        imageElement.style.display = 'block';

        // Check if this is a text-overlay question
        if (question.textOverlay) {
            // Add class to image container for positioning
            if (imageContainer) {
                imageContainer.classList.add('has-text-overlay');
            }
            // Wrap question text in overlay div
            questionTextElement.innerHTML = `<div class="question-text-overlay">${question.question || ''}</div>`;

            // Add or update spacer element to maintain layout
            let spacer = imageContainer.querySelector('.text-overlay-spacer');
            if (!spacer) {
                spacer = document.createElement('div');
                spacer.className = 'text-overlay-spacer';
                questionTextElement.parentNode.insertBefore(spacer, questionTextElement.nextSibling);
            }
        } else {
            // Regular image question
            if (imageContainer) {
                imageContainer.classList.remove('has-text-overlay');
            }
            // Remove spacer if it exists
            const spacer = imageContainer.querySelector('.text-overlay-spacer');
            if (spacer) spacer.remove();

            questionTextElement.innerHTML = question.question || '';
        }
    } else {
        // Text-only question
        if (imageContainer) {
            imageContainer.classList.remove('has-text-overlay');
        }
        imageElement.style.display = 'none';
        const themeClass = getTextOnlyThemeClass(question.theme);
        questionTextElement.innerHTML = `
            <div class="text-only-question-box ${themeClass}">
                ${question.question || ''}
            </div>&nbsp;
        `;
    }
}

/**
 * Create an answer item element for the answer sheet
 * @param {number} questionNum - Question number (1-indexed)
 * @param {number} tabIndex - Tab index for accessibility
 * @returns {HTMLElement} The answer item div
 */
function createAnswerItem(questionNum, tabIndex) {
    const answerItem = document.createElement('div');
    answerItem.className = 'answer-item';
    answerItem.innerHTML = `
        <button class="answer-number"
                onclick="goToImage(${questionNum - 1})"
                tabindex="-1">${questionNum}</button>
        <input type="text" name="answer${questionNum}"
               readonly
               onclick="goToQuestionAndFocus(${questionNum - 1})"
               tabindex="${tabIndex}" />
    `;
    return answerItem;
}

/**
 * Update navigation button states based on current position
 * @param {number} currentIndex - Current question index (0-indexed)
 * @param {number} maxIndex - Maximum question index
 * @param {HTMLButtonElement} prevBtn - Previous button element
 * @param {HTMLButtonElement} nextBtn - Next button element
 */
function updateNavigationButtons(currentIndex, maxIndex, prevBtn, nextBtn) {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
}

/**
 * Update question counter display
 * @param {HTMLElement} counterElement - The counter element to update
 * @param {number} currentNum - Current question number (1-indexed)
 * @param {number} totalQuestions - Total number of questions
 */
function updateQuestionCounter(counterElement, currentNum, totalQuestions) {
    counterElement.innerHTML = `Question <span id="current-question">${currentNum}</span> of ${totalQuestions}`;
}

/**
 * Highlight active answer number in answer sheet
 * @param {number} activeIndex - Index of the active question (0-indexed)
 */
function highlightActiveAnswer(activeIndex) {
    document.querySelectorAll('.answer-number').forEach((btn, i) => {
        btn.classList.toggle('active', i === activeIndex);
    });
}

/**
 * Smart arrow key navigation handler
 * Only navigates when cursor is at beginning/end of input or input not focused
 *
 * @param {KeyboardEvent} event - The keyboard event
 * @param {HTMLInputElement} inputElement - The input element to check focus on
 * @param {Function} onNavigate - Callback with direction: onNavigate('left' | 'right')
 * @returns {boolean} True if navigation occurred
 */
function handleArrowKeyNavigation(event, inputElement, onNavigate) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        return false;
    }

    const isInputFocused = document.activeElement === inputElement;
    let shouldNavigate = false;

    if (!isInputFocused) {
        // Input not focused - always allow navigation
        shouldNavigate = true;
    } else {
        // Input is focused - check cursor position
        const cursorPosition = inputElement.selectionStart;
        const textLength = inputElement.value.length;

        if (event.key === 'ArrowLeft' && cursorPosition === 0) {
            shouldNavigate = true;
        } else if (event.key === 'ArrowRight' && cursorPosition === textLength) {
            shouldNavigate = true;
        }
    }

    if (shouldNavigate) {
        event.preventDefault();
        const direction = event.key === 'ArrowLeft' ? 'left' : 'right';
        onNavigate(direction);

        // Re-focus input if it was focused before
        if (isInputFocused) {
            setTimeout(() => inputElement.focus(), 0);
        }

        return true;
    }

    return false;
}

/**
 * Preload an image for smoother navigation
 * @param {string} imagePath - Path to the image (without "images/" prefix)
 * @param {Map} cache - Cache map to store preloaded images
 */
function preloadImage(imagePath, cache) {
    if (!imagePath || cache.has(imagePath)) {
        return; // Already preloaded or no path
    }

    const img = new Image();
    img.onload = () => {
        cache.set(imagePath, img);
    };
    img.src = `images/${imagePath}`;
}

/**
 * Filter questions to only include valid ones for practical/quiz display
 * Excludes: blank questions, flashcards, extra credit
 * @param {Array} questions - Array of question objects
 * @returns {Array} Filtered array of valid questions
 */
function filterValidQuestions(questions) {
    return questions.filter(question => {
        // Must have valid question text
        const hasQuestion = question.question && question.question.trim() !== '';

        // Must have valid answer(s)
        const hasAnswer = question.answer && (
            Array.isArray(question.answer)
                ? question.answer.some(ans => ans && ans.trim() !== '')
                : question.answer.trim() !== ''
        );

        // Exclude flashcards and extra credit
        const isNotFlashcard = !question.tags || !question.tags.includes('flashcards');
        const isNotExtraCredit = !question.tags || !question.tags.includes('extra-credit');

        return hasQuestion && hasAnswer && isNotFlashcard && isNotExtraCredit;
    });
}
