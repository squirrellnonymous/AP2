// Flashcard Engine - Reusable flashcard system
// Simple variables
let cards = [];
let allCards = []; // Original deck
let reviewPile = []; // Cards to review soon
let knownPile = []; // Cards known well (review later)
let currentIndex = 0;
let showingDefinition = false;
let showExtraInfo = false;
let flashcardSet = null; // Metadata about current set

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
    document.getElementById('definition').textContent = card.definition;
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

    // Update counter
    document.getElementById('card-counter').textContent = `${currentIndex + 1} / ${cards.length}`;

    // Update navigation
    document.getElementById('prev-btn').disabled = currentIndex === 0;
    document.getElementById('next-btn').disabled = currentIndex === cards.length - 1;

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
    currentX = 0;
    currentY = 0;
}

// Swipe left - "Need to review"
function swipeLeft() {
    // Add to review pile (see again soon)
    const currentCard = cards[currentIndex];
    reviewPile.push(currentCard);

    // Animate out
    cardElement.style.transform = 'translateX(-100vw) rotate(-30deg)';
    cardElement.style.opacity = '0';

    setTimeout(() => {
        removeCurrentCard();
        nextCardAfterSwipe();
    }, 300);
}

// Swipe right - "I know this well"
function swipeRight() {
    // Add to known pile (review much later)
    const currentCard = cards[currentIndex];
    knownPile.push(currentCard);

    // Animate out
    cardElement.style.transform = 'translateX(100vw) rotate(30deg)';
    cardElement.style.opacity = '0';

    setTimeout(() => {
        removeCurrentCard();
        nextCardAfterSwipe();
    }, 300);
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

// Navigation
function nextCard() {
    if (currentIndex < cards.length - 1) {
        currentIndex++;
        showCard();
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