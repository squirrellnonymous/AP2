// Answer Checking and Normalization Module
// Shared functionality for grading and normalizing student answers

/**
 * Normalizes an answer for comparison by:
 * - Converting to lowercase
 * - Trimming whitespace
 * - Removing leading articles (the, an, a)
 * - Converting Roman numerals (I, II) to Arabic (1, 2)
 * - Handling common plural forms
 */
function normalizeAnswer(answer) {
    let normalized = answer.toLowerCase().trim();

    // Remove leading articles
    if (normalized.startsWith('the ')) {
        normalized = normalized.substring(4);
    } else if (normalized.startsWith('an ')) {
        normalized = normalized.substring(3);
    } else if (normalized.startsWith('a ')) {
        normalized = normalized.substring(2);
    }

    // Convert Roman numerals to Arabic numerals
    normalized = normalized.replace(/\bii\b/g, '2');
    normalized = normalized.replace(/\bi\b/g, '1');

    // Handle common plural forms
    if (normalized.endsWith('s') && normalized.length > 3 &&
        !normalized.endsWith('ss') && !normalized.endsWith('us') &&
        !normalized.endsWith('is') && !normalized.endsWith('os')) {
        normalized = normalized.slice(0, -1);
    } else if (normalized.endsWith('ies') && normalized.length > 4) {
        normalized = normalized.slice(0, -3) + 'y';
    } else if (normalized.endsWith('ves') && normalized.length > 4) {
        normalized = normalized.slice(0, -3) + 'fe';
    }

    return normalized;
}

/**
 * Calculate Levenshtein distance between two strings
 * Used for determining similarity between student and correct answers
 */
function getLevenshteinDistance(str1, str2) {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
            if (str1[i - 1] === str2[j - 1]) {
                matrix[j][i] = matrix[j - 1][i - 1];
            } else {
                matrix[j][i] = Math.min(
                    matrix[j - 1][i] + 1,     // deletion
                    matrix[j][i - 1] + 1,     // insertion
                    matrix[j - 1][i - 1] + 1  // substitution
                );
            }
        }
    }

    return matrix[str2.length][str1.length];
}

/**
 * Calculate similarity score (0-1) based on edit distance
 * Higher score means more similar
 */
function getSimilarityScore(str1, str2) {
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1;
    const distance = getLevenshteinDistance(str1, str2);
    return 1 - (distance / maxLength);
}

/**
 * Check if student answer contains conflicting anatomical terms
 * Returns true if student used opposite/conflicting term from correct answer
 */
function hasConflictingAnatomicalTerms(studentAnswer, correctAnswer) {
    const student = studentAnswer.toLowerCase();
    const correct = correctAnswer.toLowerCase();

    // Define conflicting pairs
    const conflictingPairs = [
        ['bicuspid', 'tricuspid'],
        ['left', 'right'],
        ['superior', 'inferior'],
        ['anterior', 'posterior'],
        ['atrial', 'ventricular'],
        ['systemic', 'pulmonary'],
        ['artery', 'vein'],
        ['ascending', 'descending']
    ];

    for (const [term1, term2] of conflictingPairs) {
        // If student used term1 but correct answer has term2, or vice versa
        if ((student.includes(term1) && correct.includes(term2)) ||
            (student.includes(term2) && correct.includes(term1))) {
            return true;
        }
    }

    return false;
}

/**
 * Check if a student answer is correct
 * Returns object with: { isCorrect, isPartial, points }
 *
 * @param {string} studentAnswer - The student's submitted answer
 * @param {string|Array} correctAnswer - The correct answer(s)
 * @param {number} partialCreditThreshold - Similarity threshold for partial credit (default 0.75)
 * @returns {Object} Result with isCorrect, isPartial, and points
 */
function checkAnswer(studentAnswer, correctAnswer, partialCreditThreshold = 0.75) {
    const normalizedStudentAnswer = normalizeAnswer(studentAnswer);
    let result = { isCorrect: false, isPartial: false, points: 0 };

    const correctAnswers = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];

    for (const ans of correctAnswers) {
        const normalizedCorrect = normalizeAnswer(ans);

        // Check for exact match
        if (normalizedStudentAnswer === normalizedCorrect) {
            return { isCorrect: true, isPartial: false, points: 1 };
        }

        // Check for partial credit (close match)
        const similarity = getSimilarityScore(normalizedStudentAnswer, normalizedCorrect);
        if (similarity >= partialCreditThreshold &&
            similarity < 1 &&
            !hasConflictingAnatomicalTerms(studentAnswer, ans)) {
            result = { isCorrect: false, isPartial: true, points: 0.5 };
        }
    }

    return result;
}

/**
 * Determine the result type for grading display
 * @param {Object} answerResult - Result from checkAnswer()
 * @param {string} studentAnswer - The student's submitted answer
 * @returns {string} 'correct', 'partial', 'incorrect', or 'unanswered'
 */
function getResultType(answerResult, studentAnswer) {
    if (answerResult.isCorrect) return 'correct';
    if (answerResult.isPartial) return 'partial';
    if (studentAnswer && studentAnswer.trim() !== '') return 'incorrect';
    return 'unanswered';
}
