#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function validateExamFile(filePath) {
    console.log(`\nValidating exam file: ${filePath}`);
    console.log('='.repeat(50));

    try {
        if (!fs.existsSync(filePath)) {
            console.error('❌ File does not exist');
            return false;
        }

        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = yaml.load(fileContent);

        if (!data) {
            console.error('❌ YAML file is empty or invalid');
            return false;
        }

        const issues = [];

        // Validate title
        if (!data.title) {
            issues.push('Missing required field: title');
        }

        // Validate multiple choice questions
        if (data.multipleChoice) {
            if (!Array.isArray(data.multipleChoice)) {
                issues.push('multipleChoice must be an array');
            } else {
                console.log(`📊 Found ${data.multipleChoice.length} multiple choice questions`);

                data.multipleChoice.forEach((q, index) => {
                    const qNum = index + 1;

                    if (!q.question || q.question.trim() === '') {
                        issues.push(`MC Q${qNum}: Missing question text`);
                    }

                    if (!q.options || !Array.isArray(q.options)) {
                        issues.push(`MC Q${qNum}: Missing or invalid options array`);
                    } else if (q.options.length < 2) {
                        issues.push(`MC Q${qNum}: Must have at least 2 options`);
                    }

                    if (typeof q.correct !== 'number') {
                        issues.push(`MC Q${qNum}: Missing or invalid correct answer index`);
                    } else if (q.options && (q.correct < 0 || q.correct >= q.options.length)) {
                        issues.push(`MC Q${qNum}: correct index ${q.correct} is out of bounds for ${q.options.length} options`);
                    }

                    // Tags are recommended but not required
                    // if (!q.tags || !Array.isArray(q.tags) || q.tags.length === 0) {
                    //     issues.push(`MC Q${qNum}: Missing tags array`);
                    // }
                });

                // Check tag distribution (just report, don't fail)
                const bloodQuestions = data.multipleChoice.filter(q => q.tags && q.tags.includes('blood'));
                const heartQuestions = data.multipleChoice.filter(q => q.tags && q.tags.includes('heart'));

                console.log(`   • ${bloodQuestions.length} tagged 'blood'`);
                console.log(`   • ${heartQuestions.length} tagged 'heart'`);
            }
        }

        // Validate True/Make True questions
        if (data.trueMakeTrue) {
            if (!Array.isArray(data.trueMakeTrue)) {
                issues.push('trueMakeTrue must be an array');
            } else {
                console.log(`📊 Found ${data.trueMakeTrue.length} True/Make True questions`);

                data.trueMakeTrue.forEach((q, index) => {
                    const qNum = index + 1;

                    if (!q.statement || q.statement.trim() === '') {
                        issues.push(`TMT Q${qNum}: Missing statement`);
                    }

                    if (typeof q.isTrue !== 'boolean') {
                        issues.push(`TMT Q${qNum}: Missing or invalid isTrue field (must be true/false)`);
                    }

                    if (!q.isTrue && !q.correctWord) {
                        issues.push(`TMT Q${qNum}: False statement must have correctWord field`);
                    }

                    if (q.points && typeof q.points !== 'number') {
                        issues.push(`TMT Q${qNum}: points must be a number`);
                    }
                });
            }
        }

        // Validate table questions
        if (data.table) {
            if (!Array.isArray(data.table)) {
                issues.push('table must be an array');
            } else {
                console.log(`📊 Found ${data.table.length} table questions`);

                data.table.forEach((q, index) => {
                    const qNum = index + 1;

                    if (!q.question || q.question.trim() === '') {
                        issues.push(`Table Q${qNum}: Missing question`);
                    }

                    if (!q.headers || !Array.isArray(q.headers)) {
                        issues.push(`Table Q${qNum}: Missing headers array`);
                    }

                    if (!q.answer || !Array.isArray(q.answer)) {
                        issues.push(`Table Q${qNum}: Missing answer array`);
                    }

                    if (!q.points || typeof q.points !== 'number') {
                        issues.push(`Table Q${qNum}: Missing or invalid points`);
                    }
                });
            }
        }

        // Validate essay questions
        if (data.essay) {
            if (!Array.isArray(data.essay)) {
                issues.push('essay must be an array');
            } else {
                console.log(`📊 Found ${data.essay.length} essay questions`);

                data.essay.forEach((q, index) => {
                    const qNum = index + 1;

                    if (!q.question || q.question.trim() === '') {
                        issues.push(`Essay Q${qNum}: Missing question`);
                    }

                    if (!q.answer || q.answer.trim() === '') {
                        issues.push(`Essay Q${qNum}: Missing answer`);
                    }

                    if (!q.points || typeof q.points !== 'number') {
                        issues.push(`Essay Q${qNum}: Missing or invalid points`);
                    }

                    // Validate image reference if present
                    if (q.image) {
                        const imagePath = path.join(__dirname, '..', 'images', q.image);
                        if (!fs.existsSync(imagePath)) {
                            issues.push(`Essay Q${qNum}: Image not found at images/${q.image}`);
                        }
                    }
                });
            }
        }

        // Summary
        if (issues.length > 0) {
            console.log('\n❌ Issues found:');
            issues.forEach(issue => console.log(`   • ${issue}`));
            return false;
        } else {
            console.log('✅ All validation checks passed');
            return true;
        }

    } catch (error) {
        console.error('❌ YAML parsing error:');
        console.error(error.message);
        return false;
    }
}

function main() {
    const dataDir = path.join(__dirname, '..', 'data');

    console.log('🔍 Validating exam YAML files...');

    let criticalFilesValid = true;

    // Critical files that MUST pass validation for deployment
    const criticalFiles = ['unit2-exam.yml', 'unit2-exam-pdf.yml'];

    // Find exam YAML files
    const examFiles = fs.readdirSync(dataDir)
        .filter(file => file.includes('exam') && (file.endsWith('.yml') || file.endsWith('.yaml')))
        .map(file => path.join(dataDir, file));

    if (examFiles.length === 0) {
        console.log('No exam YAML files found');
        return;
    }

    examFiles.forEach(file => {
        const fileName = path.basename(file);
        const isValid = validateExamFile(file);
        const isCritical = criticalFiles.includes(fileName);

        if (!isValid && isCritical) {
            criticalFilesValid = false;
        }
    });

    console.log('\n' + '='.repeat(50));
    if (criticalFilesValid) {
        console.log('✅ All critical exam YAML files are valid!');
        process.exit(0);
    } else {
        console.log('❌ Critical exam YAML files have issues. Please fix them before deploying.');
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { validateExamFile };
