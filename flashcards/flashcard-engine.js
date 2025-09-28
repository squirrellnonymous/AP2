// Flashcard Engine - Reusable flashcard system
// Simple variables
let cards = [];
let allCards = []; // Original deck
let knownCards = []; // Cards student knows
let missedCards = []; // Cards student needs to review
let currentIndex = 0;
let showingDefinition = false;
let flashcardSet = null; // Metadata about current set
let studyMode = 'initial'; // 'initial' or 'review'
let cardsReviewed = 0; // Track how many cards have been swiped

// Image preloading
let preloadedImages = new Map(); // Cache for preloaded images

// State management
let eventsSetup = false; // Prevent duplicate event listeners
let hasEverFlipped = false; // Track if user has ever flipped a card

// Touch/swipe variables
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;
let cardElement = null;
let isDragging = false;

// Get flashcard set from URL parameter
function getFlashcardSet() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('set') || 'anatomy-basics'; // Default set
}

// Get practical source and tags from URL parameters
function getPracticalParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        source: urlParams.get('source'),
        tags: urlParams.get('tags') ? urlParams.get('tags').split(',').map(tag => tag.trim()) : null
    };
}

// Generate descriptive deck title based on tags
function generateDeckTitle(tags, cardCount) {
    if (!tags || tags.length === 0) {
        return `Complete Study Set`;
    }

    const titleMap = {
        'valve': 'Heart Valves',
        'blood-disorder': 'Blood Disorders',
        'leukocytes': 'White Blood Cells (Leukocytes)',
        'coronary-circulation': 'Coronary Circulation',
        'ekg': 'EKG & Cardiac Rhythms',
        'heart-lp-4': 'Heart Anatomy - Lab Practical 4',
        'heart-lp-5': 'Advanced Heart & Circulation',
        'heart-layers': 'Heart Layers & Tissues',
        'tissue': 'Heart Tissues & Layers',
        'membranes': 'Heart Membranes',
        'formed-elements': 'Blood & Formed Elements',
        'platelets': 'Platelets',
        'blood-clotting': 'Blood Clotting',
        'anemia': 'Anemia',
        'platelet-disorder': 'Platelet Disorders',
        'leukocyte-disorder': 'Leukocyte Disorders'
    };

    // Try to find the most specific tag first
    for (const tag of tags) {
        if (titleMap[tag]) {
            return titleMap[tag];
        }
    }

    // Create meaningful titles from common tag combinations
    if (tags.includes('heart') && tags.includes('anatomy')) {
        return `Heart Anatomy`;
    } else if (tags.includes('heart')) {
        return `Heart Study`;
    } else if (tags.includes('blood')) {
        return `Blood Study`;
    } else if (tags.includes('leukocytes') && tags.includes('formed-elements')) {
        return `White Blood Cells`;
    }

    // Final fallback - capitalize and clean up tag names
    const cleanTags = tags.map(tag => {
        return tag.replace(/-/g, ' ')
                  .replace(/\b\w/g, l => l.toUpperCase());
    });

    return cleanTags.length === 1 ? cleanTags[0] : `${cleanTags.join(' & ')} Study`;
}


// Load flashcards
async function loadFlashcards() {
    try {
        // Show flashcard app immediately with placeholder
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('flashcard-app').classList.remove('hidden');

        // Make sure the image element is visible and showing placeholder with loading overlay
        const termImage = document.getElementById('term-image');
        const loadingOverlay = document.getElementById('image-loading-overlay');
        termImage.src = '../images/0.jpg';
        termImage.alt = 'Loading...';
        termImage.classList.remove('hidden');
        loadingOverlay.style.display = 'block';

        console.log('Starting to load flashcards...');
        console.log('Current URL:', window.location.href);

        // Check if js-yaml is loaded first
        if (typeof jsyaml === 'undefined') {
            throw new Error('js-yaml library not loaded - CDN may be blocked');
        }
        console.log('js-yaml loaded successfully');

        // Check if we're loading from practical data or flashcard set
        const practicalParams = getPracticalParams();
        let data;

        if (practicalParams.source) {
            // Load from practical data
            console.log('Loading from practical source:', practicalParams.source);
            console.log('Filtering by tags:', practicalParams.tags);

            // Map source parameter to actual filename
            const sourceMap = {
                'practical-2': 'unit2-practical',
                'practical': 'practice-practical'
            };
            const actualFilename = sourceMap[practicalParams.source] || practicalParams.source;
            const fetchUrl = `../data/${actualFilename}.yml`;
            console.log('Fetching practical data:', fetchUrl);

            const response = await fetch(fetchUrl);
            if (!response.ok) {
                throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
            }

            const yamlText = await response.text();
            const practicalData = jsyaml.load(yamlText);

            // Filter questions by tags if specified
            let filteredQuestions = practicalData.questions;
            if (practicalParams.tags && practicalParams.tags.length > 0) {
                filteredQuestions = practicalData.questions.filter(question => {
                    if (!question.tags || question.tags.length === 0) return false;
                    return practicalParams.tags.some(tag => question.tags.includes(tag));
                });
            }

            // Always exclude extra-credit questions unless explicitly requested
            if (!practicalParams.tags || !practicalParams.tags.includes('extra-credit')) {
                filteredQuestions = filteredQuestions.filter(question => {
                    return !question.tags || !question.tags.includes('extra-credit');
                });
            }

            // Generate descriptive title based on tags
            const deckTitle = generateDeckTitle(practicalParams.tags, filteredQuestions.length);

            // Convert to flashcard format
            data = {
                title: deckTitle,
                description: practicalData.description,
                color_theme: 'blue',
                flashcards: filteredQuestions.map(q => ({
                    id: q.id,
                    term: q.question,
                    image: q.image,
                    answer: Array.isArray(q.answer) ? q.answer[0] : q.answer,
                    keywords: Array.isArray(q.answer) ? q.answer : [q.answer],
                    definition: q.definition || "",
                    breakdown: q.breakdown || "",
                    example: ""
                }))
            };

            console.log(`Loaded ${filteredQuestions.length} cards from ${practicalData.questions.length} total questions`);
        } else {
            // Load from flashcard set (existing behavior)
            const setName = getFlashcardSet();
            console.log('Set name:', setName);

            const fetchUrl = `flashcards/sets/${setName}.yml`;
            console.log('Fetching:', fetchUrl);

            const response = await fetch(fetchUrl);
            console.log('Fetch response status:', response.status);
            console.log('Response OK:', response.ok);

            if (!response.ok) {
                throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
            }

            const yamlText = await response.text();
            console.log('YAML text length:', yamlText.length);
            console.log('First 100 chars:', yamlText.substring(0, 100));

            data = jsyaml.load(yamlText);
        }

        console.log('Parsed data cards count:', data.flashcards?.length);

        // Store set metadata
        flashcardSet = {
            title: data.title || 'Study Flashcards',
            description: data.description || '',
            colorTheme: data.color_theme || 'default'
        };

        // Update page title
        document.getElementById('page-title').textContent = flashcardSet.title;
        document.title = flashcardSet.title;

        // Update deck title in header
        const deckTitleElement = document.getElementById('deck-title');
        if (deckTitleElement) {
            deckTitleElement.textContent = flashcardSet.title;
        }

        // Update card count in header
        const cardCountElement = document.getElementById('card-count');
        if (cardCountElement) {
            const cardCount = data.flashcards?.length || 0;
            cardCountElement.textContent = `${cardCount} flashcard${cardCount !== 1 ? 's' : ''}`;
        }

        allCards = [...data.flashcards];
        cards = [...data.flashcards]; // Current deck

        // Setup touch events first
        setupTouchEvents();

        // Always shuffle on load
        shuffleCards();

        // App already shown above, just hide progress
        document.getElementById('progress').classList.add('hidden');

    } catch (error) {
        console.error('Error loading flashcards:', error);
        document.getElementById('loading').innerHTML = `
            <div>Error loading flashcard set</div>
            <div style="font-size: 0.8rem; margin-top: 10px;">
                Error: ${error.message}<br>
                Check console for details
            </div>
        `;
    }
}

// CLEAN SLATE: Reset card to front state with no residual flip behavior
function resetCardToFront() {
    // Initialize cardElement if needed
    if (!cardElement) {
        cardElement = document.querySelector('.flip-card');
    }

    if (!cardElement) return;

    const flipCardInner = cardElement.querySelector('.flip-card-inner');

    // 1. Reset all state variables immediately
    showingDefinition = false;
    isDragging = false;
    currentX = 0;
    currentY = 0;

    // 2. Disable ALL transitions to prevent any animation during reset
    cardElement.style.transition = 'none';
    if (flipCardInner) flipCardInner.style.transition = 'none';

    // 3. Remove all flip-related classes and styles
    cardElement.classList.remove('flipped');
    cardElement.style.transform = '';
    cardElement.style.opacity = '';
    cardElement.style.borderLeft = '';

    // 4. Clear any swipe-related transforms that might be lingering
    if (flipCardInner) {
        flipCardInner.style.transform = '';
    }

    // 5. Force a reflow to ensure changes take effect
    cardElement.offsetHeight;

    // 6. Re-enable transitions after a brief delay (after content is loaded)
    setTimeout(() => {
        cardElement.style.transition = '';
        if (flipCardInner) {
            flipCardInner.style.transition = 'transform 0.6s';
        }
    }, 50);
}

// Show current card
function showCard() {
    if (!cards || cards.length === 0) return;

    const card = cards[currentIndex];

    // CLEAN SLATE APPROACH: Complete state reset before any content changes
    resetCardToFront();

    // Reset swipe button state for new card
    resetSwipeButtons();

    // Immediately clear the previous image to prevent flash
    const termImage = document.getElementById('term-image');
    const loadingOverlay = document.getElementById('image-loading-overlay');
    termImage.src = '../images/0.jpg';
    termImage.alt = 'Loading...';
    loadingOverlay.style.display = 'block';

    // Update content
    document.getElementById('term').textContent = card.term;

    // Handle answer + definition or just definition
    let definitionContent = '';
    if (card.answer) {
        definitionContent = `<strong>${card.answer}</strong><br>${card.definition}`;
    } else {
        definitionContent = card.definition;
    }
    // Apply markdown formatting
    definitionContent = definitionContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    document.getElementById('definition').innerHTML = definitionContent;


    // Handle images - placeholder already set above
    if (card.image) {
        const imagePath = `../images/${card.image}`;
        termImage.classList.remove('hidden');

        // Check if image is already preloaded
        if (preloadedImages.has(imagePath)) {
            // Use preloaded image immediately (after placeholder is set)
            setTimeout(() => {
                termImage.src = preloadedImages.get(imagePath).src;
                termImage.alt = card.term;
                loadingOverlay.style.display = 'none'; // Hide loading overlay
            }, 1); // Tiny delay to ensure placeholder shows first
        } else {
            // Create new image to load
            const newImg = new Image();
            newImg.onload = () => {
                // Cache the loaded image
                preloadedImages.set(imagePath, newImg);
                // Update display
                termImage.src = newImg.src;
                termImage.alt = card.term;
                loadingOverlay.style.display = 'none'; // Hide loading overlay
            };
            newImg.src = imagePath;
        }
    } else {
        termImage.classList.add('hidden');
        loadingOverlay.style.display = 'none'; // Hide loading overlay for cards without images
    }

    // Preload next few images in background
    preloadNextImages();

    // Flip reset already handled at the beginning of function

    // Update counter - show total count
    document.getElementById('card-counter').textContent = `${allCards.length} cards`;

    // Update navigation buttons
    updateNavigationButtons();

    // Card setup complete

}

// Preload next few images in background
function preloadNextImages() {
    const preloadCount = 3; // Preload next 3 images

    for (let i = 1; i <= preloadCount; i++) {
        const nextIndex = currentIndex + i;
        if (nextIndex < cards.length) {
            const nextCard = cards[nextIndex];
            if (nextCard.image) {
                const imagePath = `../images/${nextCard.image}`;

                // Only preload if not already cached
                if (!preloadedImages.has(imagePath)) {
                    const preloadImg = new Image();
                    preloadImg.onload = () => {
                        preloadedImages.set(imagePath, preloadImg);
                    };
                    preloadImg.src = imagePath;
                }
            }
        }
    }
}

// Update navigation button states
function updateNavigationButtons() {
    // Previous button: always enabled unless on first card AND showing term
    document.getElementById('prev-btn').disabled = currentIndex === 0 && !showingDefinition;

    // Next button: disabled only when on last card
    document.getElementById('next-btn').disabled = currentIndex === cards.length - 1;
}

// Flip card (term <-> definition)
function flipCard() {
    if (!showingDefinition) {
        // Flip to show definition
        cardElement.classList.add('flipped');
        showingDefinition = true;

        // Enable swipe options after flip
        enableSwipeButtons();
    } else {
        // Flip back to show term
        cardElement.classList.remove('flipped');
        showingDefinition = false;
    }

    // Update navigation buttons
    updateNavigationButtons();
}

// Reset swipe buttons for new card
function resetSwipeButtons() {
    if (!hasEverFlipped) return; // Don't show buttons until first flip ever

    const swipeOptions = document.getElementById('swipe-options');
    const leftBtn = document.getElementById('swipe-left-btn');
    const rightBtn = document.getElementById('swipe-right-btn');

    // Show buttons but disabled for new card
    swipeOptions.classList.remove('invisible');
    swipeOptions.classList.remove('hidden');
    leftBtn.classList.add('disabled');
    rightBtn.classList.add('disabled');
}

// Enable swipe buttons after first flip
function enableSwipeButtons() {
    const swipeOptions = document.getElementById('swipe-options');
    const leftBtn = document.getElementById('swipe-left-btn');
    const rightBtn = document.getElementById('swipe-right-btn');

    hasEverFlipped = true;
    swipeOptions.classList.remove('invisible');
    swipeOptions.classList.remove('hidden');
    leftBtn.classList.remove('disabled');
    rightBtn.classList.remove('disabled');
}

// Setup touch events for swiping
function setupTouchEvents() {
    if (eventsSetup) return; // Prevent duplicate setup

    cardElement = document.querySelector('.flip-card');

    // Touch events for mobile swiping
    cardElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    cardElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    cardElement.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Use event delegation for click handling - attach to stable container
    document.querySelector('.container').addEventListener('click', function(e) {
        // Only handle clicks on the flip-card or its children
        if (e.target.closest('.flip-card')) {
            handleCardClick(e);
        }
    });

    eventsSetup = true;
}

// Handle card click for flipping
function handleCardClick(e) {
    // Don't flip if clicking on a navigation button
    if (e.target.closest('button')) {
        return;
    }

    flipCard();
}

// Touch start - only works on back side (definition showing)
function handleTouchStart(e) {
    if (!showingDefinition) return; // Only swipe when showing definition

    // Don't start dragging if touching a button
    if (e.target.closest('.swipe-option')) return;

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
    cardElement.style.transition = 'none';
}

// Touch move
function handleTouchMove(e) {
    if (!isDragging || !showingDefinition) return;

    e.preventDefault();
    currentX = e.touches[0].clientX - startX;
    currentY = e.touches[0].clientY - startY;

    // Apply transform
    updateCardPosition();
}

// Touch end
function handleTouchEnd(e) {
    if (!isDragging || !showingDefinition) return;

    isDragging = false;
    cardElement.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

    // Determine swipe direction
    const threshold = 100;
    if (Math.abs(currentX) > threshold) {
        if (currentX > 0) {
            swipeRight(); // Know it well
        } else {
            swipeLeft(); // Need to review
        }
    } else {
        // Snap back
        resetCardPosition();
    }
}

// Mouse events (for desktop)
function handleMouseDown(e) {
    startX = e.clientX;
    startY = e.clientY;
    isDragging = false; // Will become true only if actual dragging occurs
    cardElement.style.transition = 'none';
    e.preventDefault();
}

function handleMouseMove(e) {
    // Only process mouse move if mouse is pressed down
    if (e.buttons === 0) return; // No mouse button pressed

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    // If movement exceeds threshold, start dragging (lower threshold for more responsiveness)
    if (!isDragging && Math.abs(deltaX) > 5) {
        isDragging = true;
    }

    if (isDragging) {
        currentX = deltaX;
        currentY = deltaY;
        updateCardPosition();
    }
}

function handleMouseUp(e) {
    if (isDragging) {
        isDragging = false;
        cardElement.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

        const threshold = 100;
        if (Math.abs(currentX) > threshold) {
            if (currentX > 0) {
                swipeRight();
            } else {
                swipeLeft();
            }
        } else {
            resetCardPosition();
        }
    }
    // Click handling is now done by handleCardClick
}

// Update card position during drag
function updateCardPosition() {
    // More responsive movement - follow finger/mouse more naturally
    const rotation = currentX * 0.08; // Reduced rotation for smoother feel
    const opacity = 1 - Math.abs(currentX) / 400; // Slower opacity fade

    cardElement.style.transform = `translateX(${currentX}px) rotate(${rotation}deg)`;
    cardElement.style.opacity = Math.max(0.5, opacity); // Less dramatic opacity change

    // Color feedback with lower threshold
    if (currentX > 30) {
        cardElement.style.borderLeft = '4px solid #10b981'; // Green for "know it"
    } else if (currentX < -30) {
        cardElement.style.borderLeft = '4px solid #ef4444'; // Red for "review"
    } else {
        cardElement.style.borderLeft = 'none';
    }
}

// Reset card position
function resetCardPosition() {
    cardElement.style.transform = 'translateX(0) rotate(0deg)';
    cardElement.style.opacity = '1';
    cardElement.style.borderLeft = 'none';
    cardElement.style.transition = 'opacity 0.2s ease';
    currentX = 0;
    currentY = 0;
    isDragging = false; // Make sure we're not stuck in drag state
}

// Swipe left - "Need to review"
function swipeLeft() {
    console.log('swipeLeft() called');
    const currentCard = cards[currentIndex];

    if (studyMode === 'initial') {
        // Add to missed cards for review
        missedCards.push(currentCard);
        cardsReviewed++;
        console.log('Swiped left - missed cards:', missedCards.length, 'reviewed:', cardsReviewed);
    } else if (studyMode === 'review') {
        // In review mode, still needs review - keep in missed cards
        console.log('Still needs review in review mode');
    }

    // Animate like a real swipe - start slow, then accelerate
    cardElement.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease';
    cardElement.style.transform = 'translateX(-120vw) rotate(-30deg)';
    cardElement.style.opacity = '0';

    setTimeout(() => {
        // Reset position instantly, then advance to new card
        cardElement.style.transition = 'none';
        cardElement.style.transform = 'translateX(0) rotate(0deg)';
        cardElement.style.opacity = '1';
        cardElement.style.borderLeft = 'none';

        // Clear swipe-related styles completely
        setTimeout(() => {
            cardElement.style.transition = '';
            cardElement.style.transform = '';
            cardElement.style.opacity = '';
        }, 10);

        advanceCard();
    }, 400);
}

// Swipe right - "I know this well"
function swipeRight() {
    console.log('swipeRight() called');
    const currentCard = cards[currentIndex];

    if (studyMode === 'initial') {
        // Add to known cards
        knownCards.push(currentCard);
        cardsReviewed++;
        console.log('Swiped right - known cards:', knownCards.length, 'reviewed:', cardsReviewed);
    } else if (studyMode === 'review') {
        // In review mode, now knows it - remove from missed cards and add to known
        const cardIndex = missedCards.findIndex(card => card.id === currentCard.id);
        if (cardIndex > -1) {
            missedCards.splice(cardIndex, 1);
            knownCards.push(currentCard);
            console.log('Moved from missed to known - missed:', missedCards.length, 'known:', knownCards.length);
        }

        // Also remove from current review deck
        cards.splice(currentIndex, 1);
        if (currentIndex >= cards.length && cards.length > 0) {
            currentIndex = 0;
        }

        // If no more cards to review, go back to results
        if (cards.length === 0) {
            setTimeout(() => {
                showResults();
            }, 400);
            return;
        }
    }

    // Animate like a real swipe - start slow, then accelerate
    cardElement.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease';
    cardElement.style.transform = 'translateX(120vw) rotate(30deg)';
    cardElement.style.opacity = '0';

    setTimeout(() => {
        // Reset position instantly, then advance to new card
        cardElement.style.transition = 'none';
        cardElement.style.transform = 'translateX(0) rotate(0deg)';
        cardElement.style.opacity = '1';
        cardElement.style.borderLeft = 'none';

        // Clear swipe-related styles completely
        setTimeout(() => {
            cardElement.style.transition = '';
            cardElement.style.transform = '';
            cardElement.style.opacity = '';
        }, 10);

        advanceCard();
    }, 400);
}

// Remove current card from deck
function removeCurrentCard() {
    cards.splice(currentIndex, 1);

    // If we removed the last card, go back one
    if (currentIndex >= cards.length && currentIndex > 0) {
        currentIndex = cards.length - 1;
    }
}

// Next card after swipe
function nextCardAfterSwipe() {
    resetCardPosition();

    // If no more cards, add some review cards back
    if (cards.length === 0) {
        if (reviewPile.length > 0) {
            // Add back some review cards
            const reviewCount = Math.min(5, reviewPile.length);
            for (let i = 0; i < reviewCount; i++) {
                cards.push(reviewPile.shift());
            }
            currentIndex = 0;
        } else if (knownPile.length > 0) {
            // If no review cards, add back some known cards
            const knownCount = Math.min(3, knownPile.length);
            for (let i = 0; i < knownCount; i++) {
                cards.push(knownPile.shift());
            }
            currentIndex = 0;
        } else {
            // Reset everything
            cards = [...allCards];
            reviewPile = [];
            knownPile = [];
            currentIndex = 0;
        }
    }

    if (cards.length > 0) {
        showCard();
    }
}

// Smart card advancement
function advanceCard() {
    console.log('advanceCard called - currentIndex:', currentIndex, 'cards.length:', cards.length, 'studyMode:', studyMode, 'cardsReviewed:', cardsReviewed);

    if (currentIndex < cards.length - 1) {
        // Move to next card
        currentIndex++;
        console.log('Moving to next card, new index:', currentIndex);
        showCard(); // showCard() handles complete state reset
    } else if (studyMode === 'initial' && cardsReviewed >= allCards.length) {
        // Completed initial review - show results
        console.log('All cards reviewed, showing results');
        showResults();
    } else if (studyMode === 'review') {
        // In review mode, loop through missed cards
        currentIndex = 0;
        showCard(); // showCard() handles complete state reset
    } else {
        // Safety fallback
        console.log('Safety fallback - showing results');
        showResults();
    }
}

// Navigation
function nextCard() {
    if (currentIndex < cards.length - 1) {
        currentIndex++;
        showCard(); // showCard() handles complete state reset
    }
}

function previousCard() {
    // If showing definition, flip back to term first
    if (showingDefinition) {
        // Use clean slate reset instead of manual flip
        resetCardToFront();
        updateNavigationButtons();
    } else {
        // Already showing term, go to previous card
        if (currentIndex > 0) {
            currentIndex--;
            showCard(); // showCard() handles complete state reset
        }
    }
}

// Shuffle cards
function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    currentIndex = 0;
    showCard(); // showCard() handles complete state reset
}


// List view functions
function showListView() {
    document.getElementById('flashcard-app').classList.add('hidden');
    document.getElementById('list-view').classList.remove('hidden');

    const listContainer = document.getElementById('card-list');
    listContainer.innerHTML = '';

    allCards.forEach((card, index) => {
        const cardItem = document.createElement('div');
        cardItem.className = 'list-item';

        let imageHtml = '';
        if (card.image) {
            imageHtml = `<img src="../images/${card.image}" alt="${card.term}" class="list-image">`;
        }

        cardItem.innerHTML = `
            ${imageHtml}
            <div class="list-term">${card.term}</div>
        `;
        cardItem.onclick = () => {
            currentIndex = cards.findIndex(c => c.id === card.id);
            if (currentIndex === -1) currentIndex = 0;
            hideListView();
        };
        listContainer.appendChild(cardItem);
    });
}

function hideListView() {
    document.getElementById('list-view').classList.add('hidden');
    document.getElementById('flashcard-app').classList.remove('hidden');
    // Ensure clean state when returning from list view
    resetCardToFront();
    updateNavigationButtons();
}

// Results Screen functions
function showResults() {
    document.getElementById('flashcard-app').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');

    // Debug logging
    console.log('Known cards:', knownCards.length, knownCards);
    console.log('Missed cards:', missedCards.length, missedCards);
    console.log('Cards reviewed:', cardsReviewed);

    // Update tally counts
    document.getElementById('known-count').textContent = knownCards.length;
    document.getElementById('missed-count').textContent = missedCards.length;

    // Show/hide review missed button
    const reviewBtn = document.getElementById('review-missed-btn');
    if (missedCards.length > 0) {
        reviewBtn.style.display = 'inline-block';
        reviewBtn.textContent = `Review missed cards`;
    } else {
        reviewBtn.style.display = 'none';
    }

    // Make sure other buttons are visible
    const startOverBtn = document.querySelector('button[onclick="startOver()"]');
    const doneBtn = document.querySelector('a[href="../index.html"]');
    if (startOverBtn) startOverBtn.style.display = 'inline-block';
    if (doneBtn) doneBtn.style.display = 'inline-block';
}

function reviewMissed() {
    if (missedCards.length === 0) return;

    // Set up review mode
    studyMode = 'review';
    cards = [...missedCards];
    currentIndex = 0;

    // Hide results, show flashcards
    document.getElementById('results').classList.add('hidden');
    document.getElementById('flashcard-app').classList.remove('hidden');

    showCard(); // showCard() handles complete state reset
}

function startOver() {
    // Reset everything
    studyMode = 'initial';
    knownCards = [];
    missedCards = [];
    cardsReviewed = 0;
    currentIndex = 0;
    cards = [...allCards];

    // Shuffle and start fresh
    shuffleCards(); // shuffleCards() calls showCard() which handles complete state reset

    document.getElementById('results').classList.add('hidden');
    document.getElementById('flashcard-app').classList.remove('hidden');
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') previousCard();
    if (e.key === 'ArrowRight') nextCard();
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        flipCard();
    }
});

// Load cards when page loads
loadFlashcards();