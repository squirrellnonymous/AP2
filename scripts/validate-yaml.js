#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function validateYamlFile(filePath) {
    console.log(`\nValidating: ${filePath}`);
    console.log('='.repeat(50));

    try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.error('❌ File does not exist');
            return false;
        }

        // Read and parse YAML
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = yaml.load(fileContent);

        // Basic structure validation
        if (!data) {
            console.error('❌ YAML file is empty or invalid');
            return false;
        }

        if (!data.title) {
            console.error('❌ Missing required field: title');
            return false;
        }

        // Skip exam files (they have different structure validated separately)
        const fileName = path.basename(filePath);
        const isExamFile = fileName.includes('exam');
        const isConfigFile = fileName.includes('config');

        if (isExamFile) {
            console.log('⏭️  Skipping (exam file - validated separately)');
            return true;
        }

        if (isConfigFile) {
            console.log('⏭️  Skipping (config file - different structure)');
            return true;
        }

        if (!data.questions || !Array.isArray(data.questions)) {
            console.error('❌ Missing required field: questions (must be an array)');
            return false;
        }

        console.log('✅ YAML syntax is valid');
        console.log(`📊 Found ${data.questions.length} total questions`);

        // Validate each question
        let validQuestions = 0;
        let emptyQuestions = 0;
        let extraCreditQuestions = 0;
        const issues = [];

        data.questions.forEach((question, index) => {
            const questionNum = question.id || (index + 1);

            // Check required fields
            if (!question.id) {
                issues.push(`Question ${index + 1}: Missing id field`);
            }

            // Image is optional - skip check

            // Check if question is complete
            const hasQuestion = question.question && question.question.trim() !== '';
            const hasAnswer = question.answer && (
                Array.isArray(question.answer)
                    ? question.answer.some(ans => ans && ans.trim() !== '')
                    : question.answer.trim() !== ''
            );

            if (!hasQuestion || !hasAnswer) {
                emptyQuestions++;
                if (!hasQuestion) issues.push(`Question ${questionNum}: Empty question field`);
                if (!hasAnswer) issues.push(`Question ${questionNum}: Empty answer field`);
            } else {
                validQuestions++;
            }

            // Check for extra credit
            if (question.tags && question.tags.includes('extra-credit')) {
                extraCreditQuestions++;
            }

            // Check for inconsistent point values
            if (question.points && typeof question.points !== 'number') {
                issues.push(`Question ${questionNum}: Points field must be a number`);
            }
        });

        console.log(`✅ ${validQuestions} complete questions`);
        console.log(`⚠️  ${emptyQuestions} incomplete/placeholder questions`);
        console.log(`🎯 ${extraCreditQuestions} extra credit questions`);

        if (issues.length > 0) {
            console.log('\n⚠️  Issues found:');
            issues.forEach(issue => console.log(`   • ${issue}`));
        } else {
            console.log('✅ No structural issues found');
        }

        return issues.length === 0;

    } catch (error) {
        console.error('❌ YAML parsing error:');
        console.error(error.message);
        return false;
    }
}

function main() {
    const dataDir = path.join(__dirname, '..', 'data');

    console.log('🔍 Validating YAML files...');

    let allValid = true;

    // Find all YAML files in data directory
    const yamlFiles = fs.readdirSync(dataDir)
        .filter(file => file.endsWith('.yml') || file.endsWith('.yaml'))
        .map(file => path.join(dataDir, file));

    if (yamlFiles.length === 0) {
        console.log('No YAML files found in data directory');
        return;
    }

    yamlFiles.forEach(file => {
        const isValid = validateYamlFile(file);
        if (!isValid) allValid = false;
    });

    console.log('\n' + '='.repeat(50));
    if (allValid) {
        console.log('✅ All YAML files are valid!');
        process.exit(0);
    } else {
        console.log('❌ Some YAML files have issues. Please fix them before proceeding.');
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { validateYamlFile };