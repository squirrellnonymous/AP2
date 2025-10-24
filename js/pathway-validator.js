/**
 * Pathway Validation Module
 * Validates sequential pathways (blood vessels, clotting cascades, etc.)
 * against a connection tree
 * Uses FuzzyMatcher for typo detection and partial credit
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
        // BUT: "aorta" should NOT match "descending aorta" - too ambiguous
        // Only allow substring matching for "ascending" variant
        if (norm1.includes(norm2)) {
            // norm1 is longer, norm2 is substring
            // Allow if norm1 starts with "ascending" and norm2 is the base term
            if (norm1.startsWith('ascending ') && norm1.includes(norm2)) {
                return true;
            }
            // Don't match if norm1 contains "descending" and norm2 doesn't
            if (norm1.includes('descending') && !norm2.includes('descending')) {
                return false;
            }
        }

        if (norm2.includes(norm1)) {
            // norm2 is longer, norm1 is substring
            // Allow if norm2 starts with "ascending" and norm1 is the base term
            if (norm2.startsWith('ascending ') && norm2.includes(norm1)) {
                return true;
            }
            // Don't match if norm2 contains "descending" and norm1 doesn't
            if (norm2.includes('descending') && !norm1.includes('descending')) {
                return false;
            }
        }

        return false;
    }

    /**
     * Check if node1 connects to node2 in the given connection tree
     * Returns a match object with quality score for partial credit
     * @returns {Object} - { isValid: boolean, matchQuality: number (0, 0.5, or 1), matchedVessel: string }
     */
    isValidConnection(node1, node2, treeType) {
        if (!this.connectionTrees || !this.connectionTrees[treeType]) {
            console.error(`Connection tree "${treeType}" not found`);
            return { isValid: false, matchQuality: 0, matchedVessel: null };
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
            return { isValid: false, matchQuality: 0, matchedVessel: null };
        }

        // Check if node2 is in the list of valid connections
        const normalizedNode2 = this.normalizeNodeName(node2);

        // First check for exact matches
        for (const possibleNext of connections) {
            if (this.nodesMatch(possibleNext, normalizedNode2)) {
                return { isValid: true, matchQuality: 1.0, matchedVessel: possibleNext };
            }
        }

        // If no exact match, check for fuzzy matches (typos)
        for (const possibleNext of connections) {
            const similarity = FuzzyMatcher.calculateSimilarity(normalizedNode2, possibleNext);
            if (similarity === 0.5) {
                // Close enough for partial credit (typo detected)
                return { isValid: true, matchQuality: 0.5, matchedVessel: possibleNext };
            }
        }

        return { isValid: false, matchQuality: 0, matchedVessel: null };
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
     * Check if there's a path from startNode to any of the targetNodes
     * Uses breadth-first search with a depth limit to avoid infinite loops
     */
    canReachTarget(startNode, targetNodes, treeType, maxDepth = 15) {
        if (!this.connectionTrees || !this.connectionTrees[treeType]) {
            return false;
        }

        // Check if startNode is already a target
        for (const target of targetNodes) {
            if (this.nodesMatch(startNode, target)) {
                return true;
            }
        }

        const tree = this.connectionTrees[treeType];
        const visited = new Set();
        const queue = [{ node: this.normalizeNodeName(startNode), depth: 0 }];

        while (queue.length > 0) {
            const { node, depth } = queue.shift();

            if (depth > maxDepth) continue;
            if (visited.has(node)) continue;
            visited.add(node);

            // Find connections for this node
            let connections = null;
            for (const key in tree) {
                if (this.nodesMatch(key, node)) {
                    connections = tree[key];
                    break;
                }
            }

            if (!connections || !Array.isArray(connections)) continue;

            // Check each connection
            for (const nextNode of connections) {
                const normalized = this.normalizeNodeName(nextNode);

                // Check if this is a target
                for (const target of targetNodes) {
                    if (this.nodesMatch(nextNode, target)) {
                        return true;
                    }
                }

                // Add to queue for further exploration
                if (!visited.has(normalized)) {
                    queue.push({ node: normalized, depth: depth + 1 });
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
        results.score += 1.0;

        // Create a corrected pathway that replaces typos with correct vessel names
        // This ensures subsequent connections are validated against the correct vessel
        const correctedPathway = [cleanedPathway[0]]; // Start with the first vessel

        // Validate each connection in the pathway
        for (let i = 0; i < cleanedPathway.length - 1; i++) {
            const currentNode = correctedPathway[i]; // Use corrected name for current node
            const nextNode = cleanedPathway[i + 1];  // Student's input for next node

            const connectionResult = this.isValidConnection(currentNode, nextNode, treeType);

            if (connectionResult.isValid) {
                if (connectionResult.matchQuality === 1.0) {
                    // Perfect match
                    results.feedback.push({
                        step: i + 1,
                        type: 'valid',
                        vessel: nextNode,
                        matchQuality: 1.0,
                        message: `✓ Valid connection from ${currentNode}`
                    });
                    results.validSteps++;
                    results.score += 1.0;
                    correctedPathway.push(connectionResult.matchedVessel); // Add correct name
                } else if (connectionResult.matchQuality === 0.5) {
                    // Typo detected - partial credit
                    results.feedback.push({
                        step: i + 1,
                        type: 'partial',
                        vessel: nextNode,
                        matchQuality: 0.5,
                        correctVessel: connectionResult.matchedVessel,
                        message: `½ Minor spelling error (should be "${connectionResult.matchedVessel}")`
                    });
                    results.validSteps++;
                    results.score += 0.5;
                    correctedPathway.push(connectionResult.matchedVessel); // Add CORRECTED name for next validation
                }
            } else {
                // Invalid connection - provide helpful feedback
                let hint = '';

                // Check if they skipped a vessel (nextNode connects to something that connects to currentNode)
                const tree = this.connectionTrees[treeType];
                const normalizedCurrent = this.normalizeNodeName(currentNode);

                // Find what currentNode connects to
                let currentConnections = null;
                for (const key in tree) {
                    if (this.nodesMatch(key, normalizedCurrent)) {
                        currentConnections = tree[key];
                        break;
                    }
                }

                // Check if nextNode is reachable through one intermediate vessel
                let skippedVessel = null;
                if (currentConnections && Array.isArray(currentConnections)) {
                    for (const intermediate of currentConnections) {
                        // Check if intermediate connects to nextNode
                        const intermediateResult = this.isValidConnection(intermediate, nextNode, treeType);
                        if (intermediateResult.isValid) {
                            skippedVessel = intermediate;
                            break;
                        }
                    }
                }

                let message = '';

                if (skippedVessel) {
                    // Don't reveal which vessel was skipped - make them figure it out
                    const vesselType = treeType === 'arterial' ? 'artery' : 'vein';
                    message = `"${nextNode}" doesn't connect directly to "${currentNode}". You skipped ${vesselType === 'artery' ? 'an artery' : 'a vein'}. Check the connection and try again.`;
                } else {
                    // Check if the vessel name is valid at all in either tree
                    const oppositeTree = treeType === 'arterial' ? 'venous' : 'arterial';
                    const isValidInCurrentTree = this.isValidNode(nextNode, treeType);
                    const isValidInOppositeTree = this.isValidNode(nextNode, oppositeTree);

                    if (!isValidInCurrentTree && !isValidInOppositeTree) {
                        // Vessel doesn't exist in either tree - probably a made-up or misspelled name
                        message = `"${nextNode}" is not a blood vessel. Check the name and try again.`;
                    } else if (isValidInOppositeTree) {
                        // Check if they might have confused artery/vein
                        const vesselType = treeType === 'arterial' ? 'artery' : 'vein';
                        const wrongType = treeType === 'arterial' ? 'vein' : 'artery';
                        message = `"${nextNode}" is a ${wrongType}, not an ${vesselType}.`;
                    } else if (currentConnections && currentConnections.length > 0) {
                        // Vessel doesn't connect - don't give away the answer
                        message = `"${currentNode}" doesn't connect to "${nextNode}". Check the connection and try again.`;
                    } else {
                        // Current vessel has no outgoing connections (is an endpoint)
                        message = `"${currentNode}" doesn't connect to "${nextNode}". Check the connection and try again.`;
                    }
                }

                results.feedback.push({
                    step: i + 1,
                    type: 'invalid',
                    vessel: nextNode,
                    matchQuality: 0,
                    message: `✗ ${message}`
                });
                results.brokenAtIndex = i + 1;
                break;
            }
        }

        // Check end point (only if we made it through without breaking)
        if (results.brokenAtIndex === null) {
            const endNode = cleanedPathway[cleanedPathway.length - 1];

            // Check if the last vessel IS a valid endpoint
            const exactMatch = validEndNodes.length === 0 || validEndNodes.some(validNode =>
                this.nodesMatch(endNode, validNode)
            );

            if (exactMatch) {
                // Last vessel is a valid endpoint
                results.isComplete = true;
                results.isValid = true;
                results.score += 1.0;
            } else {
                // Check for fuzzy match (typo in endpoint)
                let fuzzyMatch = false;
                for (const validNode of validEndNodes) {
                    const similarity = FuzzyMatcher.calculateSimilarity(endNode, validNode);
                    if (similarity === 0.5) {
                        fuzzyMatch = true;
                        // Typo in endpoint - give partial credit
                        results.isComplete = true;
                        results.isValid = true;
                        results.score += 0.5;
                        break;
                    }
                }

                // If not a valid endpoint or typo, check if we passed through a valid endpoint earlier
                if (!fuzzyMatch) {
                    // Check if any vessel in the corrected pathway is a valid endpoint
                    let passedThroughValidEndpoint = false;
                    for (const vessel of correctedPathway) {
                        if (validEndNodes.some(validNode => this.nodesMatch(vessel, validNode))) {
                            passedThroughValidEndpoint = true;
                            break;
                        }
                    }

                    if (passedThroughValidEndpoint) {
                        // We reached a valid endpoint and then added optional descriptors (like "hand" or "foot")
                        results.isComplete = true;
                        results.isValid = true;
                        results.score += 1.0;
                    } else {
                        // Truly wrong endpoint
                        results.feedback.push({
                            step: cleanedPathway.length - 1,
                            type: 'invalid-end',
                            vessel: endNode,
                            message: `Should end with: ${validEndNodes.join(' OR ')}`
                        });
                    }
                }
            }
        }

        // Calculate raw max score (1 point per vessel + 1 for reaching valid endpoint)
        const rawMaxScore = results.totalSteps + 1;

        // Scale to 2 points maximum for pathway questions
        const scalingFactor = 2.0 / rawMaxScore;
        results.score = Math.round(results.score * scalingFactor * 10) / 10; // Round to 1 decimal place
        results.maxScore = 2.0;

        return results;
    }
}

// Create singleton instance
const pathwayValidator = new PathwayValidator();
