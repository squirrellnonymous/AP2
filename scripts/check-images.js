#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function checkImageReferences() {
    console.log('🔍 Checking image references...\n');

    const dataDir = path.join(__dirname, '..', 'data');
    const imagesDir = path.join(__dirname, '..', 'images');
    const issues = [];
    const referencedImages = new Set();

    // Check all YAML files
    const yamlFiles = fs.readdirSync(dataDir)
        .filter(file => file.endsWith('.yml') || file.endsWith('.yaml'))
        .map(file => path.join(dataDir, file));

    yamlFiles.forEach(yamlFile => {
        try {
            const fileContent = fs.readFileSync(yamlFile, 'utf8');
            const data = yaml.load(fileContent);

            const fileName = path.basename(yamlFile);

            // Check practical questions
            if (data.questions && Array.isArray(data.questions)) {
                data.questions.forEach((q, index) => {
                    if (q.image) {
                        referencedImages.add(q.image);
                        // Handle both "images/path" and "path" formats
                        const imageRelPath = q.image.startsWith('images/') ? q.image.substring(7) : q.image;
                        const imagePath = path.join(imagesDir, imageRelPath);
                        if (!fs.existsSync(imagePath)) {
                            issues.push(`${fileName} Q${q.id || index + 1}: Image not found at images/${imageRelPath}`);
                        }
                    }
                });
            }

            // Check essay questions
            if (data.essay && Array.isArray(data.essay)) {
                data.essay.forEach((q, index) => {
                    if (q.image) {
                        referencedImages.add(q.image);
                        // Handle both "images/path" and "path" formats
                        const imageRelPath = q.image.startsWith('images/') ? q.image.substring(7) : q.image;
                        const imagePath = path.join(imagesDir, imageRelPath);
                        if (!fs.existsSync(imagePath)) {
                            issues.push(`${fileName} Essay Q${index + 1}: Image not found at images/${imageRelPath}`);
                        }
                    }
                });
            }

        } catch (error) {
            console.error(`⚠️  Error reading ${path.basename(yamlFile)}: ${error.message}`);
        }
    });

    console.log(`📊 Found ${referencedImages.size} unique image references`);

    if (issues.length > 0) {
        console.log('\n❌ Missing images:');
        issues.forEach(issue => console.log(`   • ${issue}`));
        console.log('\n' + '='.repeat(50));
        console.log('❌ Image validation failed');
        process.exit(1);
    } else {
        console.log('✅ All referenced images exist');
        process.exit(0);
    }
}

checkImageReferences();
