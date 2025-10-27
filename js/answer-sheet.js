/**
 * Answer Sheet Generation Module
 * Shared between practical-template.html and mini-quiz-builder.html
 */

const AnswerSheet = {
    /**
     * Generates a two-column answer sheet grid
     * @param {Object} options - Configuration options
     * @param {string} options.gridSelector - CSS selector for the answers grid container
     * @param {number} options.totalQuestions - Total number of questions
     * @param {Function} options.onNumberClick - Callback when answer number is clicked, receives (index)
     * @param {Function} options.onInputClick - Callback when input field is clicked, receives (index)
     */
    generate(options) {
        const {
            gridSelector,
            totalQuestions,
            onNumberClick,
            onInputClick
        } = options;

        const answersGrid = document.querySelector(gridSelector);
        if (!answersGrid) {
            console.error(`Answer grid not found: ${gridSelector}`);
            return;
        }

        answersGrid.innerHTML = ''; // Clear existing content

        // Create two columns
        const leftColumn = document.createElement('div');
        const rightColumn = document.createElement('div');
        leftColumn.className = 'answer-column';
        rightColumn.className = 'answer-column';

        // Calculate midpoint for splitting questions
        const midpoint = Math.ceil(totalQuestions / 2);

        for (let i = 1; i <= totalQuestions; i++) {
            const answerItem = document.createElement('div');
            answerItem.className = 'answer-item';
            answerItem.innerHTML = `
                <button class="answer-number"
                        data-question-index="${i - 1}"
                        tabindex="-1">${i}</button>
                <input type="text" name="answer${i}"
                       readonly
                       data-question-index="${i - 1}"
                       tabindex="${i}" />
            `;

            // Distribute questions between columns
            if (i <= midpoint) {
                leftColumn.appendChild(answerItem);
            } else {
                rightColumn.appendChild(answerItem);
            }
        }

        answersGrid.appendChild(leftColumn);
        answersGrid.appendChild(rightColumn);

        // Attach event listeners
        if (onNumberClick) {
            answersGrid.querySelectorAll('.answer-number').forEach(button => {
                button.addEventListener('click', () => {
                    const index = parseInt(button.dataset.questionIndex);
                    onNumberClick(index);
                });
            });
        }

        if (onInputClick) {
            answersGrid.querySelectorAll('input[type="text"]').forEach(input => {
                input.addEventListener('click', () => {
                    const index = parseInt(input.dataset.questionIndex);
                    onInputClick(index);
                });
            });
        }
    }
};
