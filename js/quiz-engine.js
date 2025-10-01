/**
 * Shared Quiz Engine
 * Handles quiz loading, rendering, and scoring for all quiz types
 */

class QuizEngine {
    constructor(dataFile, config = {}) {
        this.dataFile = dataFile;
        this.config = {
            randomizeQuestions: config.randomizeQuestions || false,
            questionSelection: config.questionSelection || null, // { blood: 15, heart: 12 }
            ...config
        };
        this.quizData = null;
        this.selectedQuestions = null;
    }

    async loadQuizData() {
        try {
            const response = await fetch(this.dataFile);
            const yamlText = await response.text();
            this.quizData = jsyaml.load(yamlText);

            // Update page title and header
            if (this.quizData.title) {
                document.getElementById('page-title').textContent = this.quizData.title;
                document.getElementById('quiz-title').innerHTML = this.quizData.title;
            }

            this.selectQuestions();
            this.renderQuiz();
            this.showQuizForm();

        } catch (error) {
            console.error('Error loading quiz data:', error);
            this.showError();
        }
    }

    selectQuestions() {
        if (!this.quizData || !this.quizData.multipleChoice) return;

        const allQuestions = this.quizData.multipleChoice;

        if (this.config.questionSelection) {
            // Select specific numbers by category
            const selected = [];

            Object.entries(this.config.questionSelection).forEach(([category, count]) => {
                const categoryQuestions = allQuestions.filter(q =>
                    q.tags && q.tags.includes(category)
                );
                const shuffled = [...categoryQuestions].sort(() => 0.5 - Math.random());
                selected.push(...shuffled.slice(0, Math.min(count, categoryQuestions.length)));
            });

            this.selectedQuestions = this.config.randomizeQuestions ?
                selected.sort(() => 0.5 - Math.random()) : selected;
        } else {
            // Use all questions
            this.selectedQuestions = this.config.randomizeQuestions ?
                [...allQuestions].sort(() => 0.5 - Math.random()) : allQuestions;
        }
    }

    renderQuiz() {
        this.renderMultipleChoice();
        this.renderTrueMakeTrue();
        this.renderTable();
        this.renderEssay();
        this.updateProgress();
    }

    renderMultipleChoice() {
        const container = document.getElementById('questions-container');
        if (!container || !this.selectedQuestions) return;

        container.innerHTML = '';

        this.selectedQuestions.forEach((question, index) => {
            const questionCard = document.createElement('div');
            questionCard.className = 'question-card';

            questionCard.innerHTML = `
                <div class="question-number">Question ${index + 1}</div>
                <div class="question-text">${question.question}</div>
                <div class="options">
                    ${question.options.map((option, optionIndex) => `
                        <label class="option">
                            <input type="radio" name="q${index}" value="${optionIndex}" onchange="quizEngine.updateProgress()">
                            <span class="option-text">${String.fromCharCode(97 + optionIndex)}) ${option}</span>
                        </label>
                    `).join('')}
                </div>
            `;

            container.appendChild(questionCard);
        });
    }

    renderTrueMakeTrue() {
        const container = document.getElementById('true-make-true-container');
        if (!container || !this.quizData.trueMakeTrue) return;

        container.innerHTML = '';
        container.className = 'true-make-true-section';

        const sectionTitle = document.createElement('div');
        sectionTitle.className = 'section-title';
        sectionTitle.textContent = 'Part II: True/Make True';
        container.appendChild(sectionTitle);

        const instructions = document.createElement('div');
        instructions.className = 'instructions';
        instructions.innerHTML = 'If the statement is false, provide the correct word(s) to make it true.';
        container.appendChild(instructions);

        this.quizData.trueMakeTrue.forEach((question, index) => {
            const questionCard = document.createElement('div');
            questionCard.className = 'question-card';

            questionCard.innerHTML = `
                <div class="question-number">Question ${index + 1}</div>
                <div class="question-text">${question.statement}</div>
                <div class="true-false-options">
                    <label class="option">
                        <input type="radio" name="tmt${index}" value="true" onchange="quizEngine.updateProgress()">
                        <span class="option-text">True</span>
                    </label>
                    <label class="option">
                        <input type="radio" name="tmt${index}" value="false" onchange="quizEngine.updateProgress()">
                        <span class="option-text">False - Make it true:</span>
                    </label>
                    <input type="text" class="make-true-input" name="correction${index}"
                           placeholder="If false, write the correct word(s) here..."
                           oninput="quizEngine.updateProgress()">
                </div>
            `;

            container.appendChild(questionCard);
        });
    }

    renderTable() {
        const container = document.getElementById('table-container');
        if (!container || !this.quizData.table) return;

        container.innerHTML = '';
        container.className = 'table-section';

        const sectionTitle = document.createElement('div');
        sectionTitle.className = 'section-title';
        sectionTitle.textContent = 'Part III: Table Questions';
        container.appendChild(sectionTitle);

        this.quizData.table.forEach((question, index) => {
            const questionCard = document.createElement('div');
            questionCard.className = 'question-card';

            const tableHTML = `
                <table class="answer-table">
                    <thead>
                        <tr>
                            ${question.headers.map(header => `<th>${header}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${question.answer.map((row, rowIndex) => `
                            <tr>
                                ${row.map((cell, cellIndex) => `
                                    <td><input type="text" name="table${index}_${rowIndex}_${cellIndex}"
                                             placeholder="Enter answer..." oninput="quizEngine.updateProgress()"></td>
                                `).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;

            questionCard.innerHTML = `
                <div class="question-number">Question ${index + 1}</div>
                <div class="question-text">${question.question}</div>
                ${tableHTML}
            `;

            container.appendChild(questionCard);
        });
    }

    renderEssay() {
        const container = document.getElementById('essay-container');
        if (!container || !this.quizData.essay) return;

        container.innerHTML = '';
        container.className = 'essay-section';

        const sectionTitle = document.createElement('div');
        sectionTitle.className = 'section-title';
        sectionTitle.textContent = 'Part IV: Essay Questions';
        container.appendChild(sectionTitle);

        const instructions = document.createElement('div');
        instructions.className = 'instructions';
        instructions.innerHTML = 'Please answer all of the following questions.';
        container.appendChild(instructions);

        this.quizData.essay.forEach((question, index) => {
            const questionCard = document.createElement('div');
            questionCard.className = 'question-card';

            questionCard.innerHTML = `
                <div class="question-number">Question ${index + 1}</div>
                <div class="question-text">${question.question}</div>
                <textarea name="essay${index}" rows="6" placeholder="Enter your answer here..."
                          oninput="quizEngine.updateProgress()"></textarea>
            `;

            container.appendChild(questionCard);
        });
    }

    updateProgress() {
        const totalQuestions = (this.selectedQuestions?.length || 0) +
                             (this.quizData?.trueMakeTrue?.length || 0) +
                             (this.quizData?.table?.length || 0) +
                             (this.quizData?.essay?.length || 0);

        let answeredQuestions = 0;

        // Count multiple choice
        if (this.selectedQuestions) {
            for (let i = 0; i < this.selectedQuestions.length; i++) {
                if (document.querySelector(`input[name="q${i}"]:checked`)) {
                    answeredQuestions++;
                }
            }
        }

        // Count true/make true
        if (this.quizData?.trueMakeTrue) {
            for (let i = 0; i < this.quizData.trueMakeTrue.length; i++) {
                if (document.querySelector(`input[name="tmt${i}"]:checked`)) {
                    answeredQuestions++;
                }
            }
        }

        // Count table questions
        if (this.quizData?.table) {
            for (let i = 0; i < this.quizData.table.length; i++) {
                const inputs = document.querySelectorAll(`input[name^="table${i}_"]`);
                const filled = Array.from(inputs).filter(input => input.value.trim()).length;
                if (filled > 0) answeredQuestions++;
            }
        }

        // Count essay questions
        if (this.quizData?.essay) {
            for (let i = 0; i < this.quizData.essay.length; i++) {
                const textarea = document.querySelector(`textarea[name="essay${i}"]`);
                if (textarea && textarea.value.trim()) {
                    answeredQuestions++;
                }
            }
        }

        const progressElement = document.getElementById('progress');
        if (progressElement) {
            progressElement.textContent = `Progress: ${answeredQuestions}/${totalQuestions} questions answered`;
        }
    }

    showQuizForm() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('quiz-form').style.display = 'block';
    }

    showError() {
        document.getElementById('loading').innerHTML = `
            <div style="color: #ef4444; text-align: center;">
                <h3>Error Loading Quiz</h3>
                <p>Could not load quiz data from: ${this.dataFile}</p>
                <p>Please check that the file exists and is properly formatted.</p>
                <a href="index.html" style="color: #3b82f6;">← Back to Home</a>
            </div>
        `;
    }

    // Scoring methods would go here...
    checkAnswers() {
        // Implementation for checking answers and displaying results
        // This would be similar to the existing logic but centralized
    }
}

// Global instance (will be created by individual quiz pages)
let quizEngine = null;