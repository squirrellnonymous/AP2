/**
 * FuzzyMatcher Utility
 * Provides intelligent fuzzy string matching for medical terminology
 * with built-in protection against medical opposites
 */
class FuzzyMatcher {
    /**
     * Medical opposites that should never be considered similar
     * These are anatomical, physiological, or directional opposites
     */
    static getMedicalOpposites() {
        return [
            ['atrial', 'ventricular'],
            ['systolic', 'diastolic'],
            ['artery', 'vein'],
            ['arteries', 'veins'],
            ['anterior', 'posterior'],
            ['superior', 'inferior'],
            ['left', 'right'],
            ['systole', 'diastole'],
            ['contraction', 'relaxation'],
            ['depolarization', 'repolarization'],
            ['sympathetic', 'parasympathetic'],
            ['inspiration', 'expiration'],
            ['inhale', 'exhale'],
            ['tricuspid', 'bicuspid'],
            ['tricuspid', 'mitral'],
            ['pulmonary', 'systemic'],
            ['aortic', 'pulmonary'],
            ['ascending', 'descending'],
            ['proximal', 'distal'],
            ['medial', 'lateral'],
            ['superficial', 'deep'],
            ['efferent', 'afferent'],

            // Vessel-specific anatomical terms that should NEVER be considered similar
            ['radial', 'ulnar'],
            ['radial', 'brachial'],
            ['radial', 'axillary'],
            ['radial', 'femoral'],
            ['radial', 'tibial'],
            ['radial', 'fibular'],
            ['ulnar', 'brachial'],
            ['ulnar', 'axillary'],
            ['ulnar', 'femoral'],
            ['ulnar', 'tibial'],
            ['ulnar', 'fibular'],
            ['brachial', 'axillary'],
            ['brachial', 'femoral'],
            ['brachial', 'tibial'],
            ['brachial', 'fibular'],
            ['axillary', 'femoral'],
            ['axillary', 'tibial'],
            ['axillary', 'fibular'],
            ['femoral', 'popliteal'],
            ['femoral', 'tibial'],
            ['femoral', 'fibular'],
            ['tibial', 'fibular'],
            ['tibial', 'popliteal'],
            ['fibular', 'popliteal'],

            // Major vessel names
            ['carotid', 'subclavian'],
            ['carotid', 'jugular'],
            ['carotid', 'vertebral'],
            ['subclavian', 'jugular'],
            ['subclavian', 'vertebral'],
            ['jugular', 'vertebral'],

            // Leg veins
            ['saphenous', 'femoral'],
            ['saphenous', 'popliteal'],
            ['saphenous', 'tibial'],

            // Arm veins
            ['basilic', 'cephalic'],
            ['basilic', 'cubital'],
            ['cephalic', 'cubital'],

            // Abdominal vessels
            ['celiac', 'mesenteric'],
            ['celiac', 'renal'],
            ['mesenteric', 'renal'],
            ['hepatic', 'splenic'],
            ['hepatic', 'gastric'],
            ['splenic', 'gastric'],

            // Brain vessels
            ['cerebral', 'cerebellar'],
            ['basilar', 'cerebral']
        ];
    }

    /**
     * Normalize answer by removing articles, standardizing format, and handling plurals
     * @param {string} answer - The answer to normalize
     * @returns {string} - Normalized answer
     */
    static normalizeAnswer(answer) {
        let normalized = answer.toLowerCase().trim();

        // Remove leading articles
        if (normalized.startsWith('the ')) {
            normalized = normalized.substring(4);
        } else if (normalized.startsWith('an ')) {
            normalized = normalized.substring(3);
        } else if (normalized.startsWith('a ')) {
            normalized = normalized.substring(2);
        }

        //R is Right and L is Left
        normalized = normalized.replace(/\br\b/g, 'right');
        normalized = normalized.replace(/\bl\b/g, 'left');

        //Ant is Anterior
        normalized = normalized.replace(/\bant\.?\b/g, 'anterior');
        normalized = normalized.replace(/\bpost\.?\b/g, 'posterior');

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
     * @param {string} str1 - First string
     * @param {string} str2 - Second string
     * @returns {number} - Edit distance
     */
    static levenshteinDistance(str1, str2) {
        const matrix = [];

        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        matrix[i][j - 1] + 1,     // insertion
                        matrix[i - 1][j] + 1      // deletion
                    );
                }
            }
        }

        return matrix[str2.length][str1.length];
    }

    /**
     * Check if two words are medical opposites
     * @param {string} word1 - First word
     * @param {string} word2 - Second word
     * @returns {boolean} - True if they are medical opposites
     */
    static areMedicalOpposites(word1, word2) {
        const w1 = word1.toLowerCase();
        const w2 = word2.toLowerCase();
        const opposites = this.getMedicalOpposites();

        return opposites.some(pair =>
            (w1.includes(pair[0]) && w2.includes(pair[1])) ||
            (w1.includes(pair[1]) && w2.includes(pair[0]))
        );
    }

    /**
     * Calculate similarity score between student answer and correct answer
     * @param {string} student - Student's answer
     * @param {string} correct - Correct answer
     * @param {Object} options - Configuration options
     * @param {number} options.threshold - Minimum similarity threshold (default: 0.7)
     * @returns {number} - Similarity score between 0 and 1
     */
    static calculateSimilarity(student, correct, options = {}) {
        const { threshold = 0.7 } = options;

        const normalizedStudent = this.normalizeAnswer(student);
        const normalizedCorrect = this.normalizeAnswer(correct);

        // Exact match gets full credit
        if (normalizedStudent === normalizedCorrect) {
            return 1.0;
        }

        // Check for medical opposites - give zero credit
        if (this.areMedicalOpposites(normalizedStudent, normalizedCorrect)) {
            return 0;
        }

        // Calculate edit distance
        const distance = this.levenshteinDistance(normalizedStudent, normalizedCorrect);
        const maxLength = Math.max(normalizedStudent.length, normalizedCorrect.length);

        // Avoid division by zero
        if (maxLength === 0) return 1.0;

        // Calculate raw similarity (1 - normalized distance)
        const rawSimilarity = 1 - (distance / maxLength);

        // Don't give partial credit if similarity is too low
        if (rawSimilarity < threshold) {
            return 0;
        }

        // Round to reasonable academic increments:
        // - 1.0 = Perfect (exact match)
        // - 0.5 = Minor misspelling (-0.5 pts)
        // - 0.0 = Wrong answer
        if (rawSimilarity >= 0.85) {
            return 0.5; // Close enough for half credit
        } else {
            return 0; // Too different
        }
    }

    /**
     * Calculate best similarity score across multiple possible correct answers
     * @param {string} student - Student's answer
     * @param {string|Array<string>} correctAnswers - Correct answer(s)
     * @param {Object} options - Configuration options
     * @returns {number} - Best similarity score between 0 and 1
     */
    static calculateBestSimilarity(student, correctAnswers, options = {}) {
        if (Array.isArray(correctAnswers)) {
            return Math.max(...correctAnswers.map(ans =>
                this.calculateSimilarity(student, ans, options)
            ));
        } else {
            return this.calculateSimilarity(student, correctAnswers, options);
        }
    }

    /**
     * Get scoring result with detailed information
     * @param {string} student - Student's answer
     * @param {string|Array<string>} correctAnswers - Correct answer(s)
     * @param {Object} options - Configuration options
     * @returns {Object} - Detailed scoring result
     */
    static getDetailedScore(student, correctAnswers, options = {}) {
        const score = this.calculateBestSimilarity(student, correctAnswers, options);

        return {
            score: score,
            isCorrect: score === 1.0,
            hasPartialCredit: score === 0.5,
            isIncorrect: score === 0,
            percentage: Math.round(score * 100),
            studentAnswer: student,
            correctAnswers: Array.isArray(correctAnswers) ? correctAnswers : [correctAnswers]
        };
    }
}

// For environments that don't support ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FuzzyMatcher;
}