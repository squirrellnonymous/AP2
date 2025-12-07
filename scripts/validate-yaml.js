#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function validateYamlFile(filePath) {
    const isQuiet = process.env.QUIET === 'true';

    if (!isQuiet) {
        console.log(`\nValidating: ${filePath}`);
        console.log('='.repeat(50));
    }

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
        const isConnectionsFile = fileName.includes('connections');

        if (isExamFile) {
            if (!isQuiet) console.log('⏭️  Skipping (exam file - validated separately)');
            return true;
        }

        if (isConfigFile) {
            if (!isQuiet) console.log('⏭️  Skipping (config file - different structure)');
            return true;
        }

        if (isConnectionsFile) {
            // Validate vessel connections structure
            if (!data.arterial || typeof data.arterial !== 'object') {
                console.error('❌ Missing or invalid arterial tree');
                return false;
            }
            if (!data.venous || typeof data.venous !== 'object') {
                console.error('❌ Missing or invalid venous tree');
                return false;
            }

            // Count vessels in each tree
            const arterialCount = Object.keys(data.arterial).length;
            const venousCount = Object.keys(data.venous).length;

            if (!isQuiet) {
                console.log('✅ YAML syntax is valid');
                console.log(`🫀 Arterial tree: ${arterialCount} vessels`);
                console.log(`🫀 Venous tree: ${venousCount} vessels`);
                console.log('✅ Vessel connection structure is valid');
            }

            return true;
        }

        // Check if this is a pathway questions file
        const isPathwayFile = data.questions && data.questions.length > 0 &&
                              data.questions.every(q => q.type === 'pathway');

        if (!data.questions || !Array.isArray(data.questions)) {
            console.error('❌ Missing required field: questions (must be an array)');
            return false;
        }

        if (!isQuiet) {
            console.log('✅ YAML syntax is valid');
            console.log(`📊 Found ${data.questions.length} total questions`);
        }

        // Validate each question
        let validQuestions = 0;
        let emptyQuestions = 0;
        let extraCreditQuestions = 0;
        const issues = [];

        data.questions.forEach((question, index) => {
            const questionNum = question.id || (index + 1);

            // Check required fields
            if (question.id === undefined || question.id === null) {
                issues.push(`Question ${index + 1}: Missing id field`);
            }

            // Image is optional - skip check

            // Validate pathway questions differently
            if (question.type === 'pathway') {
                // Pathway-specific validation
                if (!question.direction) {
                    issues.push(`Question ${questionNum}: Missing direction field (e.g., "arterial" or "venous")`);
                }
                if (!question.validStartVessels || !Array.isArray(question.validStartVessels)) {
                    issues.push(`Question ${questionNum}: Missing or invalid validStartVessels array`);
                }
                if (!question.validEndVessels || !Array.isArray(question.validEndVessels)) {
                    issues.push(`Question ${questionNum}: Missing or invalid validEndVessels array`);
                }

                // Question field is optional for pathway questions if image is present
                const hasQuestion = question.question && question.question.trim() !== '';
                const hasImage = question.image && question.image.trim() !== '';

                if (!hasQuestion && !hasImage) {
                    issues.push(`Question ${questionNum}: Must have either question text or image`);
                    emptyQuestions++;
                } else {
                    validQuestions++;
                }
            } else {
                // Regular question validation
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

        if (!isQuiet) {
            console.log(`✅ ${validQuestions} complete questions`);
            console.log(`⚠️  ${emptyQuestions} incomplete/placeholder questions`);
            console.log(`🎯 ${extraCreditQuestions} extra credit questions`);
        }

        if (issues.length > 0) {
            console.log(`\n⚠️  Issues in ${fileName}:`);
            issues.forEach(issue => console.log(`   • ${issue}`));
        } else if (!isQuiet) {
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
    const isQuiet = process.env.QUIET === 'true';

    if (!isQuiet) console.log('🔍 Validating practical YAML files...');

    let allValid = true;
    let totalFiles = 0;
    let validFiles = 0;

    // Find all YAML files in data directory
    const yamlFiles = fs.readdirSync(dataDir)
        .filter(file => file.endsWith('.yml') || file.endsWith('.yaml'))
        .map(file => path.join(dataDir, file));

    if (yamlFiles.length === 0) {
        console.log('No YAML files found in data directory');
        return;
    }

    yamlFiles.forEach(file => {
        totalFiles++;
        const isValid = validateYamlFile(file);
        if (isValid) validFiles++;
        if (!isValid) allValid = false;
    });

    if (isQuiet) {
        console.log(`✅ Practical files: ${validFiles}/${totalFiles} valid`);
    } else {
        console.log('\n' + '='.repeat(50));
        if (allValid) {
            console.log('✅ All YAML files are valid!');
        } else {
            console.log('❌ Some YAML files have issues. Please fix them before proceeding.');
        }
    }

    process.exit(allValid ? 0 : 1);
}

if (require.main === module) {
    main();
}

module.exports = { validateYamlFile };