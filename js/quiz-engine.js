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

    // Delegate to shared FuzzyMatcher utility
    calculateSimilarity(student, correct) {
        return FuzzyMatcher.calculateSimilarity(student, correct);
    }

    // Check answers and display results
    checkAnswers() {
        let totalScore = 0;
        let maxScore = 0;
        let results = [];

        // Check multiple choice questions
        if (this.selectedQuestions) {
            this.selectedQuestions.forEach((question, index) => {
                const selectedAnswer = document.querySelector(`input[name="q${index}"]:checked`);
                const isCorrect = selectedAnswer && parseInt(selectedAnswer.value) === question.correct;

                if (isCorrect) totalScore += 1;
                maxScore += 1;

                results.push({
                    type: 'multiple-choice',
                    question: question.question,
                    isCorrect: isCorrect,
                    selectedAnswer: selectedAnswer ? question.options[selectedAnswer.value] : 'No answer selected',
                    correctAnswer: question.options[question.correct],
                    score: isCorrect ? 1 : 0,
                    maxScore: 1
                });
            });
        }

        // Check true/make true questions
        if (this.quizData.trueMakeTrue) {
            this.quizData.trueMakeTrue.forEach((question, index) => {
                const selectedAnswer = document.querySelector(`input[name="tmt${index}"]:checked`);
                const makeItTrueInput = document.querySelector(`input[name="correction${index}"]`);

                let score = 0;
                let maxQuestionScore = question.points || 2.5;

                if (selectedAnswer) {
                    const isTrue = selectedAnswer.value === 'true';
                    if ((isTrue && question.isTrue) || (!isTrue && !question.isTrue)) {
                        if (!isTrue && !question.isTrue) {
                            // Check if they provided a correction using fuzzy matching
                            const correction = makeItTrueInput.value.trim();
                            if (correction) {
                                const bestSimilarity = FuzzyMatcher.calculateBestSimilarity(correction, question.correctWord);

                                if (bestSimilarity >= 0.7) {
                                    score = maxQuestionScore * bestSimilarity;
                                } else {
                                    score = maxQuestionScore / 2; // Partial credit for identifying it as false
                                }
                            } else {
                                score = maxQuestionScore / 2; // Partial credit for identifying it as false
                            }
                        } else {
                            score = maxQuestionScore;
                        }
                    }
                }

                totalScore += score;
                maxScore += maxQuestionScore;

                results.push({
                    type: 'true-make-true',
                    question: question.statement,
                    isCorrect: score === maxQuestionScore,
                    hasPartialCredit: score > 0 && score < maxQuestionScore,
                    selectedAnswer: selectedAnswer ? selectedAnswer.value : 'No answer selected',
                    correction: makeItTrueInput.value,
                    correctAnswer: question.isTrue ? 'True' : `False - Correct word(s): ${question.correctWord.join(', ')}`,
                    score: score,
                    maxScore: maxQuestionScore,
                    similarity: correction ? FuzzyMatcher.calculateBestSimilarity(correction, question.correctWord) : 0
                });
            });
        }

        // Essay questions (no auto-grading)
        if (this.quizData.essay) {
            this.quizData.essay.forEach((question, index) => {
                const textarea = document.querySelector(`textarea[name="essay${index}"]`);
                const maxQuestionScore = question.points || 5;

                maxScore += maxQuestionScore;

                results.push({
                    type: 'essay',
                    question: question.question,
                    answer: textarea.value,
                    modelAnswer: question.answer,
                    score: 0, // Will be manually graded
                    maxScore: maxQuestionScore
                });
            });
        }

        this.displayResults(results, totalScore, maxScore);
    }

    displayResults(results, totalScore, maxScore) {
        const resultsDiv = document.getElementById('results');
        const scoreDiv = document.getElementById('score');

        let resultsHTML = `<p><strong>Score: ${totalScore.toFixed(1)}/${maxScore} points</strong></p>`;

        results.forEach((result, index) => {
            const resultClass = result.isCorrect ? 'correct' :
                              result.hasPartialCredit ? 'partial' : 'incorrect';

            resultsHTML += `<div class="result-item ${resultClass}">`;
            resultsHTML += `<h4>Question ${index + 1}: ${result.question}</h4>`;

            if (result.type === 'multiple-choice') {
                resultsHTML += `<p><strong>Your answer:</strong> ${result.selectedAnswer}</p>`;
                resultsHTML += `<p><strong>Correct answer:</strong> ${result.correctAnswer}</p>`;
            } else if (result.type === 'true-make-true') {
                resultsHTML += `<p><strong>Your answer:</strong> ${result.selectedAnswer}`;
                if (result.correction) {
                    resultsHTML += ` - Correction: ${result.correction}`;
                    if (result.hasPartialCredit && result.similarity) {
                        resultsHTML += ` <span class="partial-credit">(${Math.round(result.similarity * 100)}% match)</span>`;
                    }
                }
                resultsHTML += `</p>`;
                resultsHTML += `<p><strong>Correct answer:</strong> ${result.correctAnswer}</p>`;
            } else if (result.type === 'essay') {
                resultsHTML += `<p><strong>Your answer:</strong></p><div class="essay-answer">${result.answer || 'No answer provided'}</div>`;
                resultsHTML += `<p><strong>Model answer:</strong></p><div class="model-answer">${result.modelAnswer}</div>`;
                resultsHTML += `<p><em>This question requires manual grading (${result.maxScore} points)</em></p>`;
            }

            resultsHTML += `<p><strong>Score:</strong> ${result.score.toFixed(1)}/${result.maxScore} points</p>`;
            resultsHTML += `</div>`;
        });

        scoreDiv.innerHTML = resultsHTML;

        document.getElementById('quiz-form').style.display = 'none';
        resultsDiv.style.display = 'block';

        // Show calculate final score button if there are essay questions
        if (this.quizData.essay && this.quizData.essay.length > 0) {
            document.getElementById('calculate-final-score').style.display = 'block';
        }
    }
}

// Global instance (will be created by individual quiz pages)
let quizEngine = null;