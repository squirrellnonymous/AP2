# Release Notes

## October 11, 2025 - Flashcard Display Improvements

### 🎨 Enhanced Flashcard Image Display

**File:** `flashcards/flashcard-styles.css`

Improved image display in flashcard review to maximize visual detail:
- Reduced card padding from 40px → 10px for more image space
- Increased max image height from 350px → 480px
- Added 25% zoom crop (12.5% cropped from each side) to focus on central detail
- Images now take up nearly the full card height with enhanced detail
- Mobile responsive: Back link now appears above deck title on small screens

---

## October 11, 2025 - Unit 1 Practical & Index Updates

### 🆕 New Feature: Unit 1 Practice Practical

Created `unit1-practical.html` to replace the broken Practice Practical #1.

**File:** `unit1-practical.html`
**Data:** `data/unit1-practical.yml`

#### Features
- Pulls data from `data/unit1-practical.yml`
- Uses same functionality as unit2-part2-practical.html:
  - Shared modal system (`js/question-modal.js`)
  - Smart grading with partial credit
  - Arrow key navigation
  - Extra credit questions (microscope parts)
  - Full dark mode support
- 40 questions covering Unit 1 material

#### Tags Added to Data
- `unit1` - All Unit 1 questions
- `lymphatic` - Lymph nodes, spleen, tonsils, thymus, lymphatic vessels
- `endocrine` - Glands, hormones, pituitary, thyroid, adrenal, pancreas
- `immune` - Antibodies, antigen presenting cells
- `microscope` - Extra credit microscope parts

#### Technical Improvements
- **Standardized YAML image paths**: All YAML files now use relative paths without "images/" prefix (e.g., `"practical/01.png"` instead of `"images/practical/01.png"`)
- HTML/JS adds "images/" prefix when loading images
- Consistent with unit2-part2-practical.yml format

### 🎨 Index Page Typography Update

**File:** `css/index.css`

Improved spacing and readability on the home page:
- Increased section spacing (h2 top margin: 36px → 48px)
- Added proper h3 styling with better hierarchy
- Increased paragraph spacing for better breathing room
- Improved line-height for readability (1.4 → 1.5)
- Updated dark mode styles for h3 and p elements

---

## October 11, 2025 - Mini Quiz Builder

### 🎯 New Feature: Custom Mini Quiz Builder

We've added a new mini quiz builder that lets you create focused, 4-question practice quizzes from specific topics!

**File:** `mini-quiz-builder.html`

#### Key Features

**Tag-Based Quiz Generation**
- Select from any combination of available tags (vessels-8, vessels-9, blood-vessels, etc.)
- Tags are displayed in alphabetical/natural order for easy browsing
- Real-time question count shows how many questions are available for your selection
- Generates 4 random questions from your chosen topics

**Flexible Quiz Options**
- **New Random Quiz** - Generate a fresh set of 4 questions from the same tags
- **Change Topics** - Return to tag selection to pick different topics
- **Shareable URLs** - Copy a URL that automatically loads your tag selection for classmates

**Enhanced User Experience**
- Smart keyboard navigation:
  - Arrow keys to navigate between questions (respects cursor position in answer field)
  - Enter key to advance to next question
- Breadcrumb navigation (Home › Mini Quizzes)
- Clean indigo/blue color scheme
- Full dark mode support

**Scoring & Feedback**
- Same intelligent grading as practice practicals:
  - Exact match scoring
  - Partial credit for close answers (typos, minor variations)
  - Article and plural handling
- Visual feedback with color-coded results
- Score display with percentage
- **Clickable answer review modals**:
  - Click any answer after submission to review the question
  - See your answer vs. correct answer
  - Navigate between questions with arrow keys or buttons
  - Press Escape to close

#### Technical Improvements

**Code Quality**
- Extracted tag selection styles to `shared.css`
- Consistent tag chip design across flashcards and quiz builder
- **New: Created modular question modal system** (`js/question-modal.js`)
  - Shared modal review functionality across all quiz/practical features
  - Eliminated ~240 lines of duplicate code
  - Single source of truth for modal behavior
  - Easy to extend to new features
- Reusable components for better maintainability

**URL Parameters**
Share quizzes with classmates using URL parameters:
```
mini-quiz-builder.html?tags=vessels-8,vessels-9,vessels-10
```
When visited, automatically selects those tags and starts the quiz!

#### Use Cases

1. **Focused Topic Practice** - Practice just vessels-8, vessels-9, and vessels-10 before an exam
2. **Quick Review** - 4 questions instead of 40+ for faster practice sessions
3. **Study Groups** - Share quiz URLs with classmates to practice the same topics
4. **Spaced Repetition** - Generate new random questions from the same tags for repeated practice

---

### 🎨 Design Updates

**Color Scheme**
- Moved from generic grays to cohesive indigo/blue palette
- Light mode: Soft indigo backgrounds with rich indigo accents
- Dark mode: Slate backgrounds with bright indigo highlights

**Tag Selection Interface**
- Unified design across all features (flashcards, quiz builder)
- Hover states and smooth transitions
- Clear visual feedback for selected tags

---

### 📝 Documentation

- Updated `docs/features-and-bugs.md` to reflect completed feature
- All tag selection components now documented in shared styles

---

## Code Architecture

### New Shared Modules

**`js/question-modal.js`** - Question Review Modal System
- Reusable modal for reviewing quiz/practical answers
- Features:
  - Display question image or text
  - Show student answer with result indicator (✓/✗/½/—)
  - Display correct answer when needed
  - Keyboard navigation (Left/Right arrows, Escape)
  - Click-outside-to-close functionality
- Used by: Practice practicals, Mini quiz builder
- Benefits: DRY principle, consistent UX, single point of maintenance

**`css/shared.css`** - Shared Component Styles
- Tag selection components (`.tag-selector`, `.tag-chip`)
- Common UI elements used across multiple features
- Consistent styling for light and dark modes

### Files Using Shared Modules
- `unit1-practical.html` - Uses both `question-modal.js` and `shared.css`
- `unit2-part2-practical.html` - Uses both `question-modal.js` and `shared.css`
- `mini-quiz-builder.html` - Uses both `question-modal.js` and `shared.css`
- `unit2-flashcards.html` - Uses `shared.css`
- `unit2-flashcards-backup.html` - Uses `shared.css`
- `unit2-part2-flashcards.html` - Uses `shared.css`
