#!/usr/bin/env node

const fs = require('fs');
const yaml = require('js-yaml');

// Read the vessel connections file
const vesselData = yaml.load(fs.readFileSync('data/vessel-connections.yml', 'utf8'));

// Known valid endpoints that don't need entries
const validEndpoints = new Set([
    'heart',
    'right atrium',
    'left ventricle'
]);

let hasErrors = false;

function validateTree(treeName, tree) {
    console.log(`\nValidating ${treeName} tree...`);

    // Collect all vessel names that have entries
    const definedVessels = new Set(Object.keys(tree));

    // Check each vessel's connections
    for (const [vessel, connections] of Object.entries(tree)) {
        if (!Array.isArray(connections)) {
            console.error(`❌ Error: "${vessel}" connections is not an array`);
            hasErrors = true;
            continue;
        }

        // Check each connection
        for (const connectedVessel of connections) {
            // Skip if it's a valid endpoint
            if (validEndpoints.has(connectedVessel)) {
                continue;
            }

            // Check if the connected vessel is defined
            if (!definedVessels.has(connectedVessel)) {
                console.error(`❌ Broken reference: "${vessel}" → "${connectedVessel}" (not defined in ${treeName} tree)`);
                hasErrors = true;
            }
        }
    }

    if (!hasErrors) {
        console.log(`✓ No broken references in ${treeName} tree`);
    }
}

// Validate both trees
validateTree('arterial', vesselData.arterial);
validateTree('venous', vesselData.venous);

if (hasErrors) {
    console.log('\n❌ Validation failed - fix broken references above');
    process.exit(1);
} else {
    console.log('\n✅ All vessel connections are valid!');
    process.exit(0);
}
