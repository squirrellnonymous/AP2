/**
 * Pathway Validation Module
 * Validates sequential pathways (blood vessels, clotting cascades, etc.)
 * against a connection tree
 */

class PathwayValidator {
    constructor() {
        this.connectionTrees = null;
    }

    /**
     * Load the connection tree data from YAML file
     */
    async loadConnectionTrees() {
        try {
            const response = await fetch('data/vessel-connections.yml');
            const yamlText = await response.text();
            this.connectionTrees = jsyaml.load(yamlText);
            console.log('Loaded pathway connection trees');
            return true;
        } catch (error) {
            console.error('Error loading connection trees:', error);
            return false;
        }
    }

    /**
     * Normalize a vessel/node name for comparison
     * Handles variations like "right"/"R", "artery"/"Artery", whitespace, etc.
     */
    normalizeNodeName(name) {
        if (!name) return '';

        let normalized = name.toLowerCase().trim();

        // Remove leading articles
        if (normalized.startsWith('the ')) {
            normalized = normalized.substring(4);
        }

        // Handle R/L abbreviations
        normalized = normalized.replace(/^r\s+/i, 'right ');
        normalized = normalized.replace(/^l\s+/i, 'left ');

        return normalized;
    }

    /**
     * Check if two node names match (with fuzzy matching)
     */
    nodesMatch(name1, name2) {
        const norm1 = this.normalizeNodeName(name1);
        const norm2 = this.normalizeNodeName(name2);

        // Exact match
        if (norm1 === norm2) return true;

        // Check if one is a substring of the other (for partial matches)
        // e.g., "aorta" matches "ascending aorta"
        if (norm1.includes(norm2) || norm2.includes(norm1)) {
            return true;
        }

        return false;
    }

    /**
     * Check if node1 connects to node2 in the given connection tree
     */
    isValidConnection(node1, node2, treeType) {
        if (!this.connectionTrees || !this.connectionTrees[treeType]) {
            console.error(`Connection tree "${treeType}" not found`);
            return false;
        }

        const tree = this.connectionTrees[treeType];
        const normalizedNode1 = this.normalizeNodeName(node1);

        // Find matching key in tree (case-insensitive)
        let connections = null;
        for (const key in tree) {
            if (this.nodesMatch(key, normalizedNode1)) {
                connections = tree[key];
                break;
            }
        }

        if (!connections || !Array.isArray(connections)) {
            return false;
        }

        // Check if node2 is in the list of valid connections
        const normalizedNode2 = this.normalizeNodeName(node2);
        for (const possibleNext of connections) {
            if (this.nodesMatch(possibleNext, normalizedNode2)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if a node name is valid in the given tree
     */
    isValidNode(nodeName, treeType) {
        if (!this.connectionTrees || !this.connectionTrees[treeType]) {
            return false;
        }

        const tree = this.connectionTrees[treeType];
        const normalized = this.normalizeNodeName(nodeName);

        // Check if node exists as a key in the tree
        for (const key in tree) {
            if (this.nodesMatch(key, normalized)) {
                return true;
            }
        }

        // Also check if it exists as a destination
        for (const key in tree) {
            const connections = tree[key];
            if (Array.isArray(connections)) {
                for (const dest of connections) {
                    if (this.nodesMatch(dest, normalized)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * Validate a complete pathway
     * @param {Array} pathway - Array of node names in order
     * @param {String} treeType - Type of connection tree ('arterial', 'venous', etc.)
     * @param {Array} validStartNodes - Array of acceptable starting nodes
     * @param {Array} validEndNodes - Array of acceptable ending nodes
     * @returns {Object} Validation results with detailed feedback
     */
    validatePathway(pathway, treeType, validStartNodes = [], validEndNodes = []) {
        const results = {
            isValid: false,
            isComplete: false,
            validSteps: 0,
            totalSteps: pathway.length,
            brokenAtIndex: null,
            feedback: [],
            score: 0,
            maxScore: 0
        };

        // Filter out empty entries
        const cleanedPathway = pathway.filter(node => node && node.trim() !== '');
        results.totalSteps = cleanedPathway.length;

        if (cleanedPathway.length === 0) {
            results.feedback.push({
                type: 'error',
                message: 'No pathway entered'
            });
            return results;
        }

        // Check start point
        const startNode = cleanedPathway[0];
        const validStart = validStartNodes.length === 0 || validStartNodes.some(validNode =>
            this.nodesMatch(startNode, validNode)
        );

        if (!validStart) {
            results.feedback.push({
                step: 0,
                type: 'invalid-start',
                vessel: startNode,
                message: `Should start with: ${validStartNodes.join(' OR ')}`
            });
            return results;
        }

        results.feedback.push({
            step: 0,
            type: 'valid-start',
            vessel: startNode,
            message: 'Valid start point'
        });
        results.validSteps++;

        // Validate each connection in the pathway
        for (let i = 0; i < cleanedPathway.length - 1; i++) {
            const currentNode = cleanedPathway[i];
            const nextNode = cleanedPathway[i + 1];

            if (this.isValidConnection(currentNode, nextNode, treeType)) {
                results.feedback.push({
                    step: i + 1,
                    type: 'valid',
                    vessel: nextNode,
                    message: `✓ Valid connection from ${currentNode}`
                });
                results.validSteps++;
            } else {
                // Check if they might have confused artery/vein
                let hint = '';
                const oppositeTree = treeType === 'arterial' ? 'venous' : 'arterial';
                if (this.isValidNode(nextNode, oppositeTree)) {
                    const vesselType = treeType === 'arterial' ? 'artery' : 'vein';
                    const wrongType = treeType === 'arterial' ? 'vein' : 'artery';
                    hint = ` (Hint: "${nextNode}" is a ${wrongType}, not an ${vesselType})`;
                }

                results.feedback.push({
                    step: i + 1,
                    type: 'invalid',
                    vessel: nextNode,
                    message: `✗ "${nextNode}" does not connect to ${currentNode}${hint}`
                });
                results.brokenAtIndex = i + 1;
                break;
            }
        }

        // Check end point (only if we made it through without breaking)
        if (results.brokenAtIndex === null) {
            const endNode = cleanedPathway[cleanedPathway.length - 1];
            const validEnd = validEndNodes.length === 0 || validEndNodes.some(validNode =>
                this.nodesMatch(endNode, validNode)
            );

            if (validEnd) {
                results.feedback.push({
                    step: cleanedPathway.length - 1,
                    type: 'valid-end',
                    vessel: endNode,
                    message: 'Valid end point'
                });
                results.isComplete = true;
                results.isValid = true;
            } else {
                results.feedback.push({
                    step: cleanedPathway.length - 1,
                    type: 'invalid-end',
                    vessel: endNode,
                    message: `Should end with: ${validEndNodes.join(' OR ')}`
                });
            }
        }

        // Calculate score (partial credit per valid connection)
        // Max score = number of expected connections (totalSteps - 1 for connections, +2 for start/end)
        results.maxScore = results.totalSteps + 1; // steps + end validation
        results.score = results.validSteps + (results.isComplete ? 1 : 0);

        return results;
    }
}

// Create singleton instance
const pathwayValidator = new PathwayValidator();
