// Flashcard Engine - Reusable flashcard system
// Simple variables
let cards = [];
let allCards = []; // Original deck
let knownCards = []; // Cards student knows
let missedCards = []; // Cards student needs to review
let currentIndex = 0;
let showingDefinition = false;
let showExtraInfo = false;
let flashcardSet = null; // Metadata about current set
let studyMode = 'initial'; // 'initial' or 'review'
let cardsReviewed = 0; // Track how many cards have been swiped

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

// Load flashcards
async function loadFlashcards() {
    try {
        const setName = getFlashcardSet();
        const response = await fetch(`sets/${setName}.yml`);
        const yamlText = await response.text();
        const data = jsyaml.load(yamlText);

        // Store set metadata
        flashcardSet = {
            title: data.title || 'Study Flashcards',
            description: data.description || '',
            colorTheme: data.color_theme || 'default'
        };

        // Update page title
        document.getElementById('page-title').textContent = flashcardSet.title;
        document.title = flashcardSet.title;

        allCards = [...data.flashcards];
        cards = [...data.flashcards]; // Current deck

        // Always shuffle on load
        shuffleCards();

        setupTouchEvents();
        showCard();

        document.getElementById('loading').classList.add('hidden');
        document.getElementById('progress').classList.add('hidden');
        document.getElementById('flashcard-app').classList.remove('hidden');

    } catch (error) {
        console.error('Error loading flashcards:', error);
        document.getElementById('loading').textContent = `Error loading flashcard set. Make sure the set exists.`;
    }
}

// Show current card
function showCard() {
    if (!cards || cards.length === 0) return;

    const card = cards[currentIndex];

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

    document.getElementById('breakdown').textContent = card.breakdown || '';
    document.getElementById('example').innerHTML = card.example ? `<strong>Example:</strong> ${card.example}` : '';

    // Handle images
    const termImage = document.getElementById('term-image');
    if (card.image) {
        termImage.src = `../images/${card.image}`;
        termImage.alt = card.term;
        termImage.classList.remove('hidden');
    } else {
        termImage.classList.add('hidden');
    }

    // Reset to term side
    showingDefinition = false;
    document.getElementById('term-side').classList.remove('hidden');
    document.getElementById('definition-side').classList.add('hidden');

    // Update counter - show total count
    document.getElementById('card-counter').textContent = `${allCards.length} cards`;

    // Update navigation
    if (studyMode === 'initial') {
        // Disable navigation buttons during initial study - force swiping
        document.getElementById('prev-btn').disabled = true;
        document.getElementById('next-btn').disabled = true;
    } else {
        document.getElementById('prev-btn').disabled = currentIndex === 0;
        document.getElementById('next-btn').disabled = currentIndex === cards.length - 1;
    }

    // Update extra info visibility
    document.getElementById('extra-info').classList.toggle('hidden', !showExtraInfo);
}

// Flip card (term <-> definition)
function flipCard() {
    if (!showingDefinition) {
        // Show definition
        document.getElementById('term-side').classList.add('hidden');
        document.getElementById('definition-side').classList.remove('hidden');
        showingDefinition = true;
    } else {
        // Go to next card
        nextCard();
    }
}

// Setup touch events for swiping
function setupTouchEvents() {
    cardElement = document.querySelector('.flashcard');

    // Touch events
    cardElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    cardElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    cardElement.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Mouse events for desktop
    cardElement.addEventListener('mousedown', handleMouseDown);
    cardElement.addEventListener('mousemove', handleMouseMove);
    cardElement.addEventListener('mouseup', handleMouseUp);
    cardElement.addEventListener('mouseleave', handleMouseUp);
}

// Touch start
function handleTouchStart(e) {
    if (!showingDefinition) return; // Only swipe on definition side

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
    if (!showingDefinition) return;

    startX = e.clientX;
    startY = e.clientY;
    isDragging = true;
    cardElement.style.transition = 'none';
    e.preventDefault();
}

function handleMouseMove(e) {
    if (!isDragging || !showingDefinition) return;

    currentX = e.clientX - startX;
    currentY = e.clientY - startY;
    updateCardPosition();
}

function handleMouseUp(e) {
    if (!isDragging || !showingDefinition) return;

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

// Update card position during drag
function updateCardPosition() {
    const rotation = currentX * 0.1; // Slight rotation
    const opacity = 1 - Math.abs(currentX) / 300;

    cardElement.style.transform = `translateX(${currentX}px) rotate(${rotation}deg)`;
    cardElement.style.opacity = Math.max(0.3, opacity);

    // Color feedback
    if (currentX > 50) {
        cardElement.style.borderLeft = '4px solid #10b981'; // Green for "know it"
    } else if (currentX < -50) {
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
        // Reset position instantly, then fade in new card
        cardElement.style.transition = 'none';
        cardElement.style.transform = 'translateX(0) rotate(0deg)';
        cardElement.style.opacity = '0';
        cardElement.style.borderLeft = 'none';

        advanceCard();

        // Quick fade in
        setTimeout(() => {
            cardElement.style.transition = 'opacity 0.15s ease';
            cardElement.style.opacity = '1';
        }, 50);
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
        // In review mode, now knows it - remove from missed cards
        const cardIndex = missedCards.findIndex(card => card.id === currentCard.id);
        if (cardIndex > -1) {
            missedCards.splice(cardIndex, 1);
            console.log('Removed from missed cards, remaining:', missedCards.length);
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
        // Reset position instantly, then fade in new card
        cardElement.style.transition = 'none';
        cardElement.style.transform = 'translateX(0) rotate(0deg)';
        cardElement.style.opacity = '0';
        cardElement.style.borderLeft = 'none';

        advanceCard();

        // Quick fade in
        setTimeout(() => {
            cardElement.style.transition = 'opacity 0.15s ease';
            cardElement.style.opacity = '1';
        }, 50);
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
        showCard();
    } else if (studyMode === 'initial' && cardsReviewed >= allCards.length) {
        // Completed initial review - show results
        console.log('All cards reviewed, showing results');
        showResults();
    } else if (studyMode === 'review') {
        // In review mode, loop through missed cards
        currentIndex = 0;
        showCard();
    } else {
        // Safety fallback
        console.log('Safety fallback - showing results');
        showResults();
    }
}

// Navigation
function nextCard() {
    // In initial mode, force user to swipe (make a decision)
    if (studyMode === 'initial') {
        // Don't allow skipping - user must swipe to make a decision
        return;
    }

    if (currentIndex < cards.length - 1) {
        currentIndex++;
        showCard();
    } else {
        // Reached the end - show results
        showResults();
    }
}

function previousCard() {
    if (currentIndex > 0) {
        currentIndex--;
        showCard();
    }
}

// Shuffle cards
function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    currentIndex = 0;
    showCard();
}

// Toggle extra info
function toggleExtraInfo() {
    showExtraInfo = !showExtraInfo;
    const btn = event.target;

    if (showExtraInfo) {
        btn.textContent = '💡 Hide Details';
        document.getElementById('extra-info').classList.remove('hidden');
    } else {
        btn.textContent = '💡 Show Details';
        document.getElementById('extra-info').classList.add('hidden');
    }
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
        cardItem.innerHTML = `
            <div class="list-term">${card.term}</div>
            <div class="list-definition">${card.definition}</div>
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

    showCard();
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
    shuffleCards();

    document.getElementById('results').classList.add('hidden');
    document.getElementById('flashcard-app').classList.remove('hidden');
    showCard();
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