#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * Generate flashcard sets from practical data using tag-based filtering
 * Usage: node scripts/generate-flashcards.js --source practical-2 --tags leukocytes,formed-elements --output generated-blood-cells
 */

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    const value = args[i + 1];
    parsed[key] = value;
  }

  return parsed;
}

function loadPracticalData(sourceName) {
  const filePath = path.join(__dirname, '..', 'data', `${sourceName}.yml`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Source file not found: ${filePath}`);
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  return yaml.load(fileContent);
}

function filterByTags(questions, targetTags) {
  let filteredQuestions = questions;

  if (targetTags && targetTags.length > 0) {
    filteredQuestions = questions.filter(question => {
      if (!question.tags || question.tags.length === 0) {
        return false;
      }
      // Check if question has ANY of the target tags
      return targetTags.some(tag => question.tags.includes(tag));
    });
  }

  // Always exclude extra-credit questions unless explicitly requested
  if (!targetTags || !targetTags.includes('extra-credit')) {
    filteredQuestions = filteredQuestions.filter(question => {
      return !question.tags || !question.tags.includes('extra-credit');
    });
  }

  return filteredQuestions;
}

function convertToFlashcardFormat(practicalData, filteredQuestions) {
  const flashcards = filteredQuestions.map(q => {
    // Convert practical format to flashcard format
    const flashcard = {
      id: q.id,
      term: q.question,
      image: q.image,
      answer: Array.isArray(q.answer) ? q.answer[0] : q.answer, // Use first answer option
      keywords: Array.isArray(q.answer) ? q.answer : [q.answer],
      definition: q.definition || "",
      breakdown: q.breakdown || "",
      example: ""
    };

    return flashcard;
  });

  return {
    title: `Generated from ${practicalData.title}`,
    description: practicalData.description,
    color_theme: "blue",
    flashcards: flashcards
  };
}

function main() {
  try {
    const args = parseArgs();

    if (!args.source) {
      console.error('Error: --source parameter is required');
      console.log('Usage: node scripts/generate-flashcards.js --source practical-2 --tags leukocytes,formed-elements --output generated-blood-cells');
      process.exit(1);
    }

    if (!args.output) {
      console.error('Error: --output parameter is required');
      process.exit(1);
    }

    // Parse tags
    const tags = args.tags ? args.tags.split(',').map(tag => tag.trim()) : [];

    console.log(`Loading data from: ${args.source}`);
    console.log(`Filtering by tags: ${tags.length > 0 ? tags.join(', ') : 'none (all questions)'}`);

    // Load practical data
    const practicalData = loadPracticalData(args.source);

    // Filter questions by tags
    const filteredQuestions = filterByTags(practicalData.questions, tags);

    console.log(`Found ${filteredQuestions.length} matching questions out of ${practicalData.questions.length} total`);

    if (filteredQuestions.length === 0) {
      console.warn('Warning: No questions matched the specified tags');
      return;
    }

    // Convert to flashcard format
    const flashcardSet = convertToFlashcardFormat(practicalData, filteredQuestions);

    // Write output file
    const outputPath = path.join(__dirname, '..', 'flashcards', 'sets', `${args.output}.yml`);
    const yamlOutput = yaml.dump(flashcardSet, {
      indent: 2,
      lineWidth: 120,
      noRefs: true
    });

    fs.writeFileSync(outputPath, yamlOutput);

    console.log(`Generated flashcard set: ${outputPath}`);
    console.log(`Title: ${flashcardSet.title}`);
    console.log(`Cards: ${flashcardSet.flashcards.length}`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { loadPracticalData, filterByTags, convertToFlashcardFormat };