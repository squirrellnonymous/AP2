/**
 * answer-grading.js
 *
 * Shared module for grading answers and displaying results in practicals and quizzes.
 * Handles:
 * - Collection of student answers
 * - Blank answer warnings
 * - Scoring with partial credit support
 * - Visual feedback (correct/incorrect/partial/unanswered)
 * - Display div creation and replacement
 * - Extra credit grading (optional)
 *
 * Dependencies: answer-checker.js (for checkAnswer function)
 */

const AnswerGrading = {
    /**
     * Grades a set of questions and updates the UI with visual feedback
     *
     * @param {Object} options - Configuration options
     * @param {Array} options.questions - Array of question objects to grade
     * @param {string} options.answerInputPrefix - Prefix for answer input names (e.g., "answer" for "answer1", "answer2")
     * @param {string} options.circleSelector - CSS selector for answer number circles
     * @param {boolean} options.showPartialCredit - Whether to show partial credit (0.5 points)
     * @param {boolean} options.warnBlanks - Whether to warn about blank answers before submission
     * @param {Function} options.onQuestionClick - Callback when clicking on graded answer display
     * @returns {Object} - { score, total, gradedQuestions }
     */
    gradeQuestions(options) {
        const {
            questions,
            answerInputPrefix = 'answer',
            circleSelector = '.answer-number',
            showPartialCredit = true,
            warnBlanks = false,
            onQuestionClick = null
        } = options;

        // Collect answers
        const answers = {};
        let blankCount = 0;
        const blankQuestions = [];

        for (let i = 1; i <= questions.length; i++) {
            const input = document.querySelector(`input[name="${answerInputPrefix}${i}"]`);
            const answer = input ? input.value.trim() : '';
            answers[i] = answer;

            if (answer === '') {
                blankCount++;
                blankQuestions.push(i);
            }
        }

        // Warn about blank answers if enabled
        if (warnBlanks && blankCount > 0) {
            const message = blankCount === 1
                ? `You have 1 blank answer (Question ${blankQuestions[0]}). Are you sure you want to submit?`
                : `You have ${blankCount} blank answers (Questions ${blankQuestions.slice(0, 5).join(', ')}${blankCount > 5 ? '...' : ''}). Are you sure you want to submit?`;

            if (!confirm(message)) {
                return null; // User cancelled submission
            }
        }

        // Grade each question
        let score = 0;
        const total = questions.length;
        const circles = document.querySelectorAll(circleSelector);

        questions.forEach((question, index) => {
            const questionNum = index + 1;
            const studentAnswer = answers[questionNum] || '';
            const correctAnswer = question.answer || '';
            const input = document.querySelector(`input[name="${answerInputPrefix}${questionNum}"]`);
            const circle = circles[index];

            // Check if this is a valid question (not placeholder)
            const hasValidQuestion = question.question && question.question.trim() !== '';
            const hasValidAnswer = question.answer && (
                Array.isArray(question.answer)
                    ? question.answer.some(ans => ans && ans.trim() !== '')
                    : question.answer.trim() !== ''
            );

            if (!hasValidQuestion || !hasValidAnswer) {
                // Mark as disabled placeholder
                if (circle) {
                    circle.classList.add('disabled');
                    if (input) {
                        const displayDiv = document.createElement('div');
                        displayDiv.className = 'answer-display disabled';
                        displayDiv.innerHTML = '<span class="placeholder-text">Placeholder</span>';
                        input.parentNode.replaceChild(displayDiv, input);
                    }
                }
                return; // Skip scoring
            }

            // Use shared answer checking logic
            const answerResult = checkAnswer(studentAnswer, correctAnswer);

            // Determine result type
            const resultType = answerResult.isCorrect ? 'correct' :
                             answerResult.isPartial ? 'partial' :
                             (studentAnswer && studentAnswer.trim() !== '') ? 'incorrect' : 'unanswered';

            // Store grading results on the question object for later retrieval
            question.gradingResult = {
                studentAnswer: studentAnswer,
                resultType: resultType
            };

            // Add to score
            if (showPartialCredit) {
                score += answerResult.points; // 0, 0.5, or 1
            } else {
                score += answerResult.isCorrect ? 1 : 0; // Only count full credit
            }

            // Apply visual feedback
            if (circle) {
                if (answerResult.isCorrect) {
                    circle.classList.add('result-correct');
                    this._createAnswerDisplay(input, 'correct', studentAnswer, correctAnswer, questionNum, question, onQuestionClick);
                } else if (answerResult.isPartial && showPartialCredit) {
                    circle.classList.add('result-partial');
                    this._createAnswerDisplay(input, 'partial', studentAnswer, correctAnswer, questionNum, question, onQuestionClick);
                } else if (studentAnswer) {
                    circle.classList.add('result-incorrect');
                    this._createAnswerDisplay(input, 'incorrect', studentAnswer, correctAnswer, questionNum, question, onQuestionClick);
                } else {
                    circle.classList.add('result-unanswered');
                    this._createAnswerDisplay(input, 'unanswered', studentAnswer, correctAnswer, questionNum, question, onQuestionClick);
                }
            }
        });

        return { score, total, questions };
    },

    /**
     * Grades extra credit questions with special scoring
     *
     * @param {Object} options - Configuration options
     * @param {Array} options.questions - Array of extra credit question objects
     * @param {string} options.answerInputPrefix - Prefix for answer input names (e.g., "extra-credit-")
     * @param {string} options.buttonSelector - CSS selector for extra credit buttons
     * @param {number} options.correctPoints - Points for correct answer (default: 2)
     * @param {number} options.partialPoints - Points for partial answer (default: 1)
     * @param {number} options.threshold - Levenshtein threshold for extra credit (default: 0.8)
     * @param {Function} options.onQuestionClick - Callback when clicking on graded answer display
     * @returns {Object} - { score, questions }
     */
    gradeExtraCredit(options) {
        const {
            questions,
            answerInputPrefix = 'extra-credit-',
            buttonSelector = '.extra-credit-button',
            correctPoints = 2,
            partialPoints = 1,
            threshold = 0.8,
            onQuestionClick = null,
            showCorrectAnswer = true // Extra credit shows correct answer inline
        } = options;

        let extraCreditScore = 0;
        const buttons = document.querySelectorAll(buttonSelector);

        questions.forEach((question, index) => {
            const input = document.querySelector(`input[name="${answerInputPrefix}${index}"]`);
            const button = buttons[index];
            const studentAnswer = input ? input.value.trim() : '';
            const correctAnswer = question.answer || '';

            // Use shared answer checking logic with higher threshold
            const answerResult = checkAnswer(studentAnswer, correctAnswer, threshold);

            // Determine result type
            const resultType = answerResult.isCorrect ? 'correct' :
                             answerResult.isPartial ? 'partial' :
                             (studentAnswer && studentAnswer.trim() !== '') ? 'incorrect' : 'unanswered';

            // Store grading results
            question.gradingResult = {
                studentAnswer: studentAnswer,
                resultType: resultType
            };

            // Apply visual feedback to button
            if (button) {
                if (answerResult.isCorrect) {
                    button.classList.add('result-correct');
                    extraCreditScore += correctPoints;
                    this._createExtraCreditDisplay(input, 'correct', studentAnswer, correctAnswer, 'EC', question, onQuestionClick);
                } else if (answerResult.isPartial) {
                    button.classList.add('result-partial');
                    extraCreditScore += partialPoints;
                    this._createExtraCreditDisplay(input, 'partial', studentAnswer, correctAnswer, 'EC', question, onQuestionClick);
                } else if (studentAnswer) {
                    button.classList.add('result-incorrect');
                    this._createExtraCreditDisplay(input, 'incorrect', studentAnswer, correctAnswer, 'EC', question, onQuestionClick);
                } else {
                    button.classList.add('result-unanswered');
                    this._createExtraCreditDisplay(input, 'unanswered', studentAnswer, correctAnswer, 'EC', question, onQuestionClick);
                }
            }
        });

        return { score: extraCreditScore, questions };
    },

    /**
     * Creates and replaces input with answer display div
     *
     * @private
     */
    _createAnswerDisplay(input, resultType, studentAnswer, correctAnswer, questionNum, question, onQuestionClick) {
        if (!input) return;

        const displayDiv = document.createElement('div');
        displayDiv.className = `answer-display ${resultType}`;
        displayDiv.style.cursor = onQuestionClick ? 'pointer' : 'default';

        const displayAnswer = Array.isArray(correctAnswer)
            ? correctAnswer.join(' OR ')
            : correctAnswer;

        switch (resultType) {
            case 'correct':
                displayDiv.innerHTML = `<span class="student-answer">${studentAnswer}</span>`;
                if (onQuestionClick) {
                    displayDiv.onclick = () => onQuestionClick(questionNum, question.question, correctAnswer, question.image, studentAnswer, 'correct');
                }
                break;

            case 'partial':
                displayDiv.innerHTML = `<span class="student-answer">${studentAnswer}</span><span class="partial-indicator">(0.5)</span>`;
                displayDiv.title = 'Click to see question and correction - Partial credit for close answer';
                if (onQuestionClick) {
                    displayDiv.onclick = () => onQuestionClick(questionNum, question.question, correctAnswer, question.image, studentAnswer, 'partial');
                }
                break;

            case 'incorrect':
                displayDiv.innerHTML = `<span class="student-answer">${studentAnswer}</span>`;
                displayDiv.title = 'Click to see question and correction';
                if (onQuestionClick) {
                    displayDiv.onclick = () => onQuestionClick(questionNum, question.question, correctAnswer, question.image, studentAnswer, 'incorrect');
                }
                break;

            case 'unanswered':
                displayDiv.innerHTML = `<span class="correct-answer">${displayAnswer}</span>`;
                if (onQuestionClick) {
                    displayDiv.onclick = () => onQuestionClick(questionNum, question.question, correctAnswer, question.image, '', 'unanswered');
                }
                break;
        }

        input.parentNode.replaceChild(displayDiv, input);
    },

    /**
     * Creates and replaces input with extra credit answer display div
     * Shows correct answer inline for partial/incorrect
     *
     * @private
     */
    _createExtraCreditDisplay(input, resultType, studentAnswer, correctAnswer, questionNum, question, onQuestionClick) {
        if (!input) return;

        const displayDiv = document.createElement('div');
        displayDiv.className = `answer-display ${resultType}`;
        displayDiv.style.cursor = onQuestionClick ? 'pointer' : 'default';

        const displayAnswer = Array.isArray(correctAnswer)
            ? correctAnswer.join(' OR ')
            : correctAnswer;

        switch (resultType) {
            case 'correct':
                displayDiv.innerHTML = `<span class="student-answer">${studentAnswer}</span> <span class="checkmark">✓</span>`;
                displayDiv.title = 'Click to see question and your answer';
                if (onQuestionClick) {
                    displayDiv.onclick = () => onQuestionClick(questionNum, question.question, correctAnswer, question.image, studentAnswer, 'correct');
                }
                break;

            case 'partial':
                displayDiv.innerHTML = `<span class="student-answer">${studentAnswer}</span> <span class="partial-credit">½</span><br><small class="correct-answer">Correct: ${displayAnswer}</small>`;
                displayDiv.title = 'Click to see question and correction';
                if (onQuestionClick) {
                    displayDiv.onclick = () => onQuestionClick(questionNum, question.question, correctAnswer, question.image, studentAnswer, 'partial');
                }
                break;

            case 'incorrect':
                displayDiv.innerHTML = `<span class="student-answer incorrect">${studentAnswer}</span> <span class="cross">✗</span><br><small class="correct-answer">Correct: ${displayAnswer}</small>`;
                displayDiv.title = 'Click to see question and correction';
                if (onQuestionClick) {
                    displayDiv.onclick = () => onQuestionClick(questionNum, question.question, correctAnswer, question.image, studentAnswer, 'incorrect');
                }
                break;

            case 'unanswered':
                displayDiv.innerHTML = `<span class="correct-answer">${displayAnswer}</span>`;
                if (onQuestionClick) {
                    displayDiv.onclick = () => onQuestionClick(questionNum, question.question, correctAnswer, question.image, '', 'unanswered');
                }
                break;
        }

        input.parentNode.replaceChild(displayDiv, input);
    },

    /**
     * Formats and displays the final score
     *
     * @param {Object} options - Display options
     * @param {number} options.score - Main score
     * @param {number} options.total - Total possible points
     * @param {number} options.extraCreditScore - Extra credit points (optional)
     * @param {string} options.scoreElementId - ID of element to display score in
     * @param {string} options.submitButtonSelector - CSS selector for submit button to hide
     */
    displayFinalScore(options) {
        const {
            score,
            total,
            extraCreditScore = 0,
            scoreElementId = 'final-score',
            submitButtonSelector = '.submit-button'
        } = options;

        const totalWithEC = score + extraCreditScore;
        const totalPercentage = total > 0 ? Math.round((totalWithEC / total) * 100) : 0;
        const basePercentage = total > 0 ? Math.round((score / total) * 100) : 0;

        const scoreElement = document.getElementById(scoreElementId);
        if (scoreElement) {
            scoreElement.innerHTML = extraCreditScore > 0
                ? `<strong>Final Score: ${score}+${extraCreditScore}/${total} (${totalPercentage}%)</strong>`
                : `<strong>Final Score: ${score}/${total} (${basePercentage}%)</strong>`;
            scoreElement.style.display = 'block';
        }

        const submitButton = document.querySelector(submitButtonSelector);
        if (submitButton) {
            submitButton.style.display = 'none';
        }
    },

    /**
     * Clears all answer sheet highlighting
     *
     * @param {string} numberSelector - CSS selector for answer numbers (default: '.answer-number')
     * @param {string} extraCreditSelector - CSS selector for extra credit buttons (default: '.extra-credit-button')
     */
    clearHighlighting(numberSelector = '.answer-number', extraCreditSelector = '.extra-credit-button') {
        document.querySelectorAll(numberSelector).forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll(extraCreditSelector).forEach(btn => {
            btn.classList.remove('active');
        });
    }
};
