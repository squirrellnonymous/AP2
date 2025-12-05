# Release Notes

## December 4, 2025 - Practical 5 Mobile-First Design & Cache Busting

### 🎯 Mobile-First Portrait Layout for Practical 5

Implemented mobile-first design for Unit 4 Practical 5 using portrait layout (400px × 593px) for consistent viewing across all devices.

**Files Updated:** `data/unit4-practical5.yml`, `css/practical.css`, `practical-template.html`, `images/gradients/01p.jpg-05p.jpg`

#### New Features

**Portrait Gradient Images**
- Created portrait-specific gradient backgrounds (01p.jpg through 05p.jpg) sized at 400 × 593 pixels
- Standard gradients are 700 × 450, but portrait practicals need custom dimensions
- Use these for text overlay questions in mobile-first practicals

**Modal Text Sizing Fix**
- Increased font size for text-only questions in review modal from inherited size to 1.5rem
- Added explicit line-height: 1.6 for better readability
- CSS: `.popup-question .text-only-question-box { font-size: 1.5rem; line-height: 1.6; }`

**Cache Busting for CSS Updates**
- Added version parameters to CSS file links in practical-template.html
- Format: `<link rel="stylesheet" href="css/practical.css?v=1735950000">`
- Use timestamp-based version numbers (e.g., v=1735950000) for immediate cache invalidation
- **Automated via git hook:** Pre-commit hook automatically updates version when CSS files change
  - Detects staged CSS files in `css/` directory
  - Generates new timestamp version on each commit
  - Updates HTML templates and auto-stages them
  - See `.husky/pre-commit` lines 15-34
- GitHub Pages CDN can cache files for 10-20 minutes, version parameters ensure users get fresh CSS immediately

#### YAML Structure for Mobile-First Practicals

```yaml
layout: "portrait"  # Enables mobile-first 400px width

# Text overlay questions use portrait gradients
- id: 100
  image: "gradients/01p.jpg"  # Portrait gradient (400 × 593)
  question: "What structure secretes progesterone?"
  answer: ["corpus luteum"]
  textOverlay: true
  tags: ["unit4", "reproductive", "text-only"]
```

### 📝 Content Added to Practical 5

Added 12 new image-based questions (IDs 15-26) covering digestive and reproductive systems:
- Cystic duct, common hepatic duct, bile duct anatomy
- Pancreatic duct and internal anal sphincter
- Circular muscle layer of digestive tract
- Ovary, fallopian tube identification on fetal pig
- Ileocecal valve, hepatic portal ducts
- Gallbladder function

Added 1 text-only question:
- Corpus luteum and progesterone secretion

## November 20, 2025 - Unit 4 Exam Build-Out & System Improvements

### 🎯 Major Content Addition: Exam 4 Digestive System Questions

Extensively built out the Unit 4 exam with comprehensive coverage of digestive system topics including enzymes, hormones, liver function, bile, and large intestine.

**Files Updated:** `data/unit4-exam4.yml`, `exam-template.html`, `css/quiz.css`, `practical-template.html`, `js/answer-checker.js`, `data/hesi.yml`, `data/hesi-decks-config.yml`, `index.html`

#### Exam Content Added

**Multiple Choice Questions (22 total)**
- Vitamin B12 absorption location (ileum)
- Mechanical vs chemical digestion (segmentation)
- Peristalsis and propulsion
- Pancreas functions and secretions
- Pancreatic juice contents (zymogens)
- Enzyme activation cascade (enteropeptidase, trypsinogen)
- Protein digestion enzymes (trypsin, chymotrypsin, carboxypeptidase, dipeptidase)
- Zymogen function (procarboxypeptidase)
- Protein monomers (amino acids)
- Brush border enzymes (maltase, lactase, sucrase)
- Secretin hormone (small intestine, pancreatic juices)
- Organ removal consequences (pancreas)
- Liver functions
- Hepatic portal vein route
- Bile contents and functions
- Bile production and storage (liver/gallbladder)
- CCK/cholecystokinin hormone
- Ideal stool characteristics
- Nutrient absorption location (with diagram)
- Liver and bile metabolism questions
- Large intestine anatomy and function

**True/Make-True Questions (3 total)**
- Haustral contractions vs mass movements
- Goblet cells produce mucus
- Cecum fermentation in coprophagic animals (rabbits)

**Table Questions (2 total)**
- Pancreatic endocrine functions
  - Headers: Hormone, Stimulated by, Responds by, Less/more hungry?, Stores/breaks down glycogen?
  - Rows: Insulin and Glucagon
  - 10 points total
- Nutrient digestion by location
  - Headers: Nutrient, Oral Cavity, Small Intestine, Large Intestine
  - Rows: Carbohydrates, Proteins, Fats, Nucleic Acids
  - Students indicate if digestion occurs in each region

**Answer Distribution**
- Reshuffled options to prevent all answers being "A"
- Correct answers distributed across positions B, C, D
- Improved question balance and variety

#### System Improvements

**Text-Only Question Filter Fix** (`practical-template.html`)
- **Problem:** Text-only question limit (5 max, 12.5%) wasn't working
- **Root Cause:** Code checked for `!q.image` but all questions had images (including gradients for text-overlay questions)
- **Solution:** Changed filtering logic to check for `textOverlay` property
- **Lines Updated:** 107-108, 123-124, 277-278

```javascript
// Before
let imageQuestions = validQuestions.filter(q => q.image);
let textOnlyQuestions = validQuestions.filter(q => !q.image);

// After
let imageQuestions = validQuestions.filter(q => !q.textOverlay);
let textOnlyQuestions = validQuestions.filter(q => q.textOverlay === true);
```

**Answer Normalization Enhancement** (`js/answer-checker.js`)
- Added "non-keratinized = nonkeratinized" normalization
- Handles hyphenated vs non-hyphenated medical terminology
- Students can use either variant and receive full credit
- Line 18: `normalized = normalized.replace(/\bnon-keratinized\b/g, 'nonkeratinized');`

**Share Button Feature** (`exam-template.html`, `css/quiz.css`)
- Added share button to exam header for easy URL sharing
- Copies current URL to clipboard with visual feedback
- Button changes to "✓ Copied!" with green background
- Resets after 2 seconds
- Fallback alert if clipboard API unavailable

**Share Button Styling** (`css/quiz.css` lines 1190-1219)
```css
.share-button {
    background: transparent;
    color: #4f46e5;
    border: 2px solid #4f46e5;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
}

.share-button:hover {
    background: #4f46e5;
    color: white;
    transform: translateY(-1px);
}
```

**Share Function** (`exam-template.html` lines 1508-1531)
```javascript
function shareExam() {
    const currentUrl = window.location.href;

    navigator.clipboard.writeText(currentUrl).then(() => {
        const shareBtn = document.getElementById('share-button');
        shareBtn.innerHTML = '✓ Copied!';
        shareBtn.style.background = '#10b981';

        setTimeout(() => {
            shareBtn.innerHTML = originalText;
            shareBtn.style.background = '';
        }, 2000);
    }).catch(err => {
        alert('Failed to copy URL. Please copy manually: ' + currentUrl);
    });
}
```

#### HESI Exam Prep Section

**New Files Created**
- `data/hesi.yml` - Data file for HESI exam preparation flashcards
- `data/hesi-decks-config.yml` - Deck configuration with sections for:
  - All HESI Topics
  - Pharmacology (commented)
  - Medical-Surgical (commented)
  - Fundamentals (commented)
  - Maternity & Pediatrics (commented)
  - Mental Health (commented)
  - Critical Thinking & Dosage Calculations (commented)

**Index Page Update** (`index.html`)
- Added HESI section as data-order="7" below Unit 4
- Links to flashcard hub with HESI configuration
- Checkbox tracking for completion status
- Integrated with existing progress tracking system

#### Content Quality Improvements

**Terminology Refinements**
- Changed "pancreatic bicarbonate" → "pancreatic juices" (clearer for students)
- Updated coprophagy question: "large intestine" → "transverse colon" (more specific)
- Consistent use of anatomical terminology throughout

**Explanations Added**
- Detailed explanations for enzyme activation cascade
- Brush border enzymes finisher role explained
- Hormone feedback loops (insulin/glucagon)
- Bile emulsification vs digestion distinction
- Hepatic portal system function

**Image-Based Questions**
- Created questions using digestive-system-diagram.jpg
- Labeled A-E for different anatomical structures
- Nutrient absorption location question active
- Additional diagram questions commented for future use

#### Commented Question Templates

Created extensive commented question templates in proper YAML syntax for future content:
- 7 liver & bile multiple choice questions
- 3 large intestine multiple choice questions
- 3 true/make-true questions
- 1 coprophagy essay question

**Example Template Format**
```yaml
# - question: "Which of the following is NOT a function of the liver?"
#   options:
#     - "Detoxification of drugs and toxins"
#     - "Production of bile"
#     - "Production of digestive enzymes"
#     - "Storage of glycogen and vitamins"
#   correct: 2
#   explanation: "The liver does NOT produce digestive enzymes..."
#   tags: ["unit-4", "digestive", "liver"]
```

#### Technical Implementation

**YAML Structure Consistency**
- All questions follow standardized format
- Consistent tagging: unit-4, digestive, organs, enzymes, hormones
- Point values specified for table questions
- Proper nesting for table headers and answers

**Question Type Diversity**
- Multiple choice for concept testing
- True/Make-True for precise terminology
- Table questions for comparative understanding
- Essay questions for synthesis (commented)

#### Educational Benefits

**Comprehensive Coverage**
- Enzyme activation cascade (enteropeptidase → trypsin)
- Zymogen concept (inactive enzyme precursors)
- Brush border "finisher" enzymes concept
- Hormonal regulation (secretin, CCK, insulin, glucagon)
- Liver functions (not including enzyme production)
- Bile enterohepatic circulation
- Large intestine anatomy and bacterial fermentation

**Clinical Applications**
- Pancreas removal consequences
- Vitamin B12 absorption location
- Coprophagy in rabbits (comparative anatomy)
- Ideal stool characteristics

**Reduced Guessing**
- Answer distribution across all positions
- Plausible distractors for each question
- "All of these" options for comprehensive concepts

#### Use Cases

1. **Comprehensive exam practice** - 23+ questions covering major digestive topics
2. **Share practice exams** - Copy URL to share with classmates
3. **Targeted study** - Filter by tags (enzymes, hormones, liver, etc.)
4. **Self-assessment** - Immediate feedback with explanations
5. **HESI prep** - New section for nursing exam preparation flashcards
6. **Consistent validation** - Fixed text-overlay detection across all practicals

---

## November 16, 2025 - Optional Essays & Modal Grading System

### 🎯 Major Feature: Optional Essay Questions with Interactive Grading

Completely redesigned the essay/table self-grading experience in exam-template.html, making essay questions optional and implementing an intuitive modal-based grading workflow.

**Files Updated:** `exam-template.html`, `css/quiz.css`, `data/unit4-exam4.yml`

#### Optional Essay Questions

**Student Choice**
- Essay and table questions are now completely optional
- Students can skip essays without penalty
- Blank essays are automatically excluded from final grade calculation
- No warning prompts for unanswered essays
- Clear instructions: "Practice essay questions. Any questions left blank will not be graded."

**Smart Grading Logic**
- Only attempted essays appear in grading workflow
- Unanswered essays excluded from max score denominator
- Final score accurately reflects only completed work
- Example: If student attempts 1 of 2 essays worth 3 points each, final score is out of (MC + TMT + 3) instead of (MC + TMT + 6)

#### Modal-Based Grading System

**Sequential Review Workflow**
- After submission, modal opens automatically for essay/table grading
- One question at a time - focused, less overwhelming
- Questions sorted by point value (easiest first)
- Clean interface showing:
  - Question text with point value
  - Student's answer
  - Sample answer (highlighted in green)
  - Grading interface

**Navigation Features**
- Position indicator: "1 of 3"
- Previous/Next buttons for navigation
- "Finish Grading" button on last question
- Keyboard shortcuts:
  - Number keys (0-9) for quick point selection
  - Enter to advance to next question
  - Arrow keys for Previous/Next navigation
- Can navigate back to revise grades

**Visual Design**
- Full-screen modal with dark overlay
- Scrollable content for longer answers
- Professional styling with proper spacing
- Question separated from answers with visual hierarchy
- Sample answers highlighted with green background

#### Button-Based Grading Interface

**Quick-Click Grading**
- Replaced number input with button grid
- One click to assign points - much faster than typing
- Smart labels adapt to question point value:
  - **2 points:** Wrong, Partial, Perfect
  - **3 points:** Wrong, Partial, Good, Perfect
  - **4 points:** Wrong, Poor, Partial, Good, Perfect
  - **5 points:** Wrong, Poor, Fair, Good, Great, Perfect

**Visual Feedback**
- Selected button highlights in orange
- Hover effects with subtle lift animation
- Clear point values shown on each button
- Yellow background section to draw attention
- Centered "How did your answer compare?" prompt

**Keyboard Shortcuts**
- Press 0-3 (or 0-5 for larger questions) to select points
- Enter advances to next question after selection
- Extremely fast workflow for keyboard users
- Perfect for quick self-grading

#### Markdown Support for Explanations

**Supported Formatting**
- **Bold text:** `**text**` or `__text__`
- *Italic text:* `*text*` or `_text_`
- `Inline code:` `` `code` ``
- Links: `[text](url)`

**Styling Integration**
- Bold text appears with proper font-weight
- Italic text displays correctly
- Code snippets shown with monospace font and background
- Links are underlined and clickable
- All markdown adapts to explanation box color (green/red)

**Example Usage**
```yaml
explanation: "Ingestion is bringing it into the alimentary canal (still outside the body). **Absorption is the process of bringing things from the digestive tract into the blood (from outside the body into the body)**."
```
The `**Absorption...**` portion renders as bold text in the explanation.

#### Implementation Details

**Modal System**
- JavaScript-based grading modal similar to question-modal.js pattern
- Manages grading state with Map data structure
- Tracks current position and scores
- Builds list of attempted essays/tables on submit
- Auto-calculates final score when modal closes

**Grading Score Storage**
- `gradingScores` Map stores points for each question
- Scores persist when navigating between questions
- Hidden input field syncs with button selections
- Scores validated and clamped to max points

**Grade Calculation**
- `autoCalculateFinalScore()` function called after grading
- Recalculates MC and TMT scores from form data
- Adds essay/table scores from grading modal
- Computes percentage and breakdown by section
- Updates main score display with complete results

#### CSS Architecture

**Modal Styles** (`css/quiz.css`)
- `.grading-modal` - Full-screen overlay with dark background
- `.grading-modal-content` - Centered white card, max 800px wide
- `.grading-buttons-grid` - Responsive grid layout for point buttons
- `.grading-option-btn` - Individual button styling with hover/selected states
- Mobile responsive with adjusted padding and layout

**Color Scheme**
- Yellow/amber theme for grading section (attention-grabbing)
- Orange selected state for buttons
- Green backgrounds for sample answers
- Clean white modal on dark overlay

#### Educational Benefits

**Reduced Pressure**
- Essays are practice questions, not required
- Students can focus on learning without stress
- Encourages experimentation with answers
- Skipping difficult questions doesn't hurt score

**Better Self-Assessment**
- One question at a time improves focus
- Direct comparison with sample answer
- Quick grading reduces decision fatigue
- Immediate feedback on understanding

**Faster Workflow**
- Button clicks faster than typing numbers
- Keyboard shortcuts for power users
- No scrolling to find next essay
- Linear workflow from start to finish

#### Technical Notes

**Table Question Support**
- Modal works identically for table questions
- Displays student table vs sample table side-by-side
- Same grading button interface
- Both essays and tables intermixed in modal sequence

**Backward Compatibility**
- Old "Calculate Final Score" button removed
- Previous inline grading UI replaced entirely
- No breaking changes to YAML format
- Works with existing exam data files

#### Inline Essay Review After Grading

**Post-Grading Display**
- After modal closes, all attempted essays/tables display on the page
- Similar to how MC questions show answers inline after submission
- Students can scroll through entire exam to review everything

**What's Displayed**
- Student's answer (read-only, light background)
- Sample answer (green highlighted box)
- Points awarded (green display box showing "X / Y points")
- Consistent with MC question review format

**Benefits**
- Complete exam review in one scrollable page
- No need to reopen modals or click buttons
- Can reference all questions and answers together
- Print-friendly format for offline review

#### Content Templates Created

**Multiple Choice Questions (8 total)**
- Alimentary canal "outside the body" concept
- Epithelial tissue types in digestive system
- Saliva types (sympathetic vs parasympathetic)
- Stomach functions (nutrient absorption misconception)
- Stomach cell types (parietal, chief, mucous, enteroendocrine)
- Gastric bypass and vitamin B12 absorption
- Proton pump inhibitors mechanism
- Alcohol absorption on empty stomach

**True/Make-True Questions (7 total)**
- Esophagus epithelium (true statement)
- Sympathetic vs parasympathetic digestion
- Acetylcholine neurotransmitter (true statement)
- Serous vs mucous fluid in acinar cells
- Ingestion vs absorption distinction
- Secretion process (true statement)
- Deglutition (swallowing) terminology

**Essay Questions (1 total)**
- Gastric bypass, intrinsic factor, and B12 injections (5 points)
- Multi-part question testing mechanism understanding
- Includes: cell types, intrinsic factor function, clinical application

**Source Material**
- Questions created from digestive system lecture transcript
- Focus on understanding vs memorization
- Include clinical applications (medications, surgery)
- Explanations use markdown for emphasis

#### Use Cases

1. **Optional essay practice** - Skip hard questions, focus on achievable goals
2. **Quick self-grading** - Review and grade in under 30 seconds
3. **Multiple attempts** - Try essay, see sample, try again in future practice
4. **Focused learning** - One question at a time prevents overwhelm
5. **Keyboard efficiency** - Grade entire exam without touching mouse
6. **Complete review** - Scroll through all answers after grading (inline display)

---

## October 28, 2025 - ❌ False Alarm: Firefox Emulation Artifact (Not a Bug)

### Flashcard "Regression" Resolved - Browser Emulation Issue

**Status:** ❌ VOID - Not a real bug

**What Happened:**
Regular image flashcards appeared to have glitchy flip animations when tested in Firefox desktop with mobile emulation. After investigation, determined this was a **browser rendering artifact**, not an actual bug.

**Root Cause:**
Firefox desktop rendering of CSS 3D transforms differs significantly from actual mobile Safari/Chrome. Desktop browsers emulating mobile viewport sizes do not replicate the actual mobile rendering pipeline, particularly for `backface-visibility`, z-index layering, and hardware-accelerated 3D transforms.

**Resolution:**
Flashcards work correctly on real mobile devices (iOS Safari, Android Chrome). No code changes needed. The CSS z-index fix from October 27 is functioning as intended for the target platform.

**Lesson Learned:**
Always test on actual mobile devices for mobile-specific features, not just desktop browser emulation. Desktop emulation can show false positives for CSS 3D transform issues.

---

## October 28, 2025 - Text Overlay Rendering Refactored to Shared Module

### 🔧 Code Refactoring: Unified Text-Overlay Question Rendering

Consolidated duplicate text-overlay rendering code between mini-quiz-builder and practice practicals into a single shared module, ensuring consistent styling and behavior across all quiz types.

**Files Updated:**
- `mini-quiz-builder.html` - Now uses `renderQuestion()` from shared module
- `practical-template.html` - Now uses `renderQuestion()` from shared module (2 locations)
- `js/question-renderer.js` - Already contained the working implementation

#### Problem Solved

**Code Duplication**
- Mini-quiz-builder had ~50 lines of text-overlay rendering code
- Practical-template had the same code duplicated in 2 places (`showImage()` and `showExtraCreditImage()`)
- Total: ~150 lines of duplicate code
- Changes needed to be made in 3 places for consistency
- Risk of implementations diverging over time

**Inconsistent Text-Overlay Support**
- Mini-quiz had working text-overlay questions (text centered over gradient images)
- Practicals had no text-overlay support (only handled regular image questions)
- Different visual styling between quiz types
- Confusing for students switching between tools

#### Solution: Shared `renderQuestion()` Module

**What Changed**
All question rendering now goes through `js/question-renderer.js`:

```javascript
// OLD CODE (mini-quiz-builder.html) - ~50 lines
if (question.image) {
    const imagePath = `images/${question.image}`;
    imageElement.src = imagePath;
    if (question.textOverlay) {
        imageContainer.classList.add('has-text-overlay');
        questionTextElement.innerHTML = `<div class="question-text-overlay">${question.question}</div>`;
        // ... spacer logic ...
    } else {
        questionTextElement.innerHTML = question.question || '';
    }
} else {
    // text-only question rendering ...
}

// NEW CODE - 1 line
renderQuestion(question, imageElement, questionTextElement);
```

**Code Reduction**
- Mini-quiz: ~50 lines → 1 line (98% reduction)
- Practical (showImage): ~30 lines → 1 line + click handlers (97% reduction)
- Practical (showExtraCreditImage): ~30 lines → 1 line + click handlers (97% reduction)
- Total: ~150 lines of duplicate code eliminated

#### Benefits

**DRY Principle Achieved**
- Single source of truth for question rendering logic
- One place to fix bugs or add features
- Consistent behavior across all quiz/practical tools
- Reduced maintenance burden

**Consistent Text-Overlay Support**
- Mini-quizzes and practicals now render text-overlay questions identically
- Same CSS classes (`has-text-overlay`, `question-text-overlay`) used everywhere
- Uniform visual styling with white text, dark shadow, centered positioning
- Layout spacer system works consistently across all tools

**Better Code Architecture**
- Clear separation of concerns: rendering logic separate from UI control
- Reusable across future quiz/practical features
- Easier to test and debug rendering issues
- Self-documenting code with clear function purpose

#### Technical Implementation

**How `renderQuestion()` Works**

The shared function handles three question types:

1. **Image questions with text below** (`question.image`, no `textOverlay`)
   - Displays image
   - Shows question text below image
   - Normal layout flow

2. **Text-overlay questions** (`question.image` + `question.textOverlay`)
   - Displays gradient/texture image as background
   - Overlays question text centered on image (absolutely positioned)
   - Adds spacer div to maintain consistent layout height
   - Uses CSS classes: `has-text-overlay`, `question-text-overlay`

3. **Text-only questions** (no `question.image`)
   - Displays themed text box with gradient background
   - Uses theme classes from YAML data
   - Fixed height matching image questions

**Layout Spacer System**
```javascript
// Create spacer to reserve space where text would normally appear
let spacer = imageContainer.querySelector('.text-overlay-spacer');
if (!spacer) {
    spacer = document.createElement('div');
    spacer.className = 'text-overlay-spacer';
    questionTextElement.parentNode.insertBefore(spacer, questionTextElement.nextSibling);
}
```

The spacer maintains layout consistency so the answer box doesn't jump when switching between question types.

#### CSS Architecture

**Shared Styles** (`css/practical.css` + `css/themes.css`)

All quiz/practical pages load the same CSS files:
- `css/practical.css` - Layout, spacing, positioning rules
- `css/themes.css` - Text-overlay styling and theme definitions

```css
/* Positioning context for text overlays */
.image-container.has-text-overlay .image-content {
    position: relative;
}

/* Absolutely positioned text over image */
.image-container.has-text-overlay .question-text {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 450px;
    margin: 0;
    pointer-events: none;
}

/* The actual overlay text styling */
.question-text-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
    width: 80%;
}
```

#### Files Now Using Shared Rendering

**Mini Quiz Builder** (`mini-quiz-builder.html`)
- Line 698: `renderQuestion(question, imageElement, questionTextElement);`
- Removed ~50 lines of duplicate rendering code
- Text-overlay questions now work identically to practicals

**Practice Practicals** (`practical-template.html`)
- Line 421: Main question rendering uses shared module
- Line 519: Extra credit question rendering uses shared module
- Removed ~60 lines of duplicate code
- Now supports text-overlay questions (previously didn't)

#### Use Cases

**Text-Overlay Questions in Practicals**
Now practicals can include questions like:
```yaml
- id: 101
  image: "gradients/02.jpg"  # Teal-blue gradient
  question: "What is Henry's Law?"
  answer: ["Henry's Law"]
  textOverlay: true
```

**Consistent Student Experience**
- Text-overlay questions look identical across all quiz types
- Same white text with shadow over gradient backgrounds
- Predictable layout and spacing
- Easier to learn, less cognitive load

**Easier Content Creation**
- YAML format for text-overlay questions works everywhere
- No need to consider which tool will display it
- Gradients/textures can be reused across quiz types
- Consistent visual branding

#### Testing Completed

✅ Mini-quiz text-overlay questions display correctly
✅ Text appears centered over gradient images
✅ Answer box position relatively stable (minor variations expected)
✅ Practical-template ready for text-overlay questions
✅ Extra credit questions support text-overlay format
✅ Dark mode works correctly for text-overlays

#### Next Steps

**Potential Improvements**
- Fine-tune spacer height to minimize answer box jumping
- Consider fixed answer box position for perfect consistency
- Test with various question text lengths
- Add more gradient/texture background images

**Content Opportunities**
- Convert existing text-only practical questions to text-overlay format
- Create new gradient backgrounds for visual variety
- Use texture images (notebook paper, chalkboard) for themed questions

---

## October 27, 2025 (Evening) - Fixed Text Overlay Pop-In During Flip Animation

### 🐛 Bug Fix: Text Overlay Now Visible Throughout Flip Animation

Fixed a glitchy behavior where text overlays on flashcards (like "Henry's Law") would pop into visibility after the flip animation instead of being visible throughout the rotation. The text now feels physically present on the card during the entire flip.

**File Updated:**
- `flashcards/flashcard-engine.js` lines 605-614 - Removed 300ms delay for text overlay appearance

#### Problem
- When flipping from back to front on text-overlay cards, the question text was not immediately visible
- Text would "pop in" after the flip animation completed (at 300ms)
- This created a jarring effect where the text felt like it was being added after the flip rather than being physically present on the card
- Front-to-back flips looked good, but back-to-front flips looked wrong

#### Root Cause
The previous fix (see October 27 morning entry) added a 300ms delay before showing the text overlay when flipping back to front. This delay was intended to prevent text from showing through during rotation, but it created a worse problem: the text appeared to "pop in" rather than rotate smoothly with the card.

#### Solution
**Trust CSS backface-visibility** - Remove the manual 300ms delay and let CSS handle the visibility:
1. Show the text overlay immediately before removing the 'flipped' class
2. The CSS `backface-visibility: hidden` property on `.flip-card-front` ensures the overlay is hidden when the card is rotated away (180deg)
3. As the card rotates from 180deg back to 0deg, the overlay naturally becomes visible with the front face
4. No manual timing delays needed - the browser handles it correctly

#### Code Change
```javascript
// OLD CODE (with delay):
} else {
    // Flip back to show term
    cardElement.classList.remove('flipped');
    showingDefinition = false;

    if (overlay) {
        setTimeout(() => {
            overlay.style.display = '';
        }, 300); // Show halfway through animation
    }
}

// NEW CODE (immediate):
} else {
    // Flip back to show term
    // Show text overlay BEFORE flipping so it's visible during rotation
    if (overlay) {
        overlay.style.display = '';
    }

    cardElement.classList.remove('flipped');
    showingDefinition = false;
}
```

#### Result
- Text overlays are now visible throughout the flip animation
- Text feels physically present on the card, not added after the fact
- Smooth rotation with text squishing/unsquishing naturally
- Matches the good behavior of front-to-back flips

---

## October 27, 2025 (Morning) - Fixed Flashcard Flip Animation on Mobile

### 🐛 Bug Fix: Smooth Flip Animation Without Image Flash

Fixed visual glitches in the flashcard flip animation on mobile devices. The card now smoothly rotates with the full 3D "squished" effect visible, and images no longer flash before the animation completes.

**Files Updated:**
- `flashcards/flashcard-engine.js` lines 610-616 - Added 300ms delay for text overlay appearance
- `flashcards/flashcard-styles.css` lines 188-215 - Added z-index control for proper face layering

#### Problem
- When flipping from back to front on mobile, the image would flash into view before the rotation animation started
- The 3D rotation animation appeared to disappear or card content would change instantly
- Text overlays appeared immediately, breaking the flip illusion

#### Root Cause
Mobile Safari has inconsistent handling of CSS `backface-visibility`, causing front face content to show through during rotation. Text overlays were being displayed immediately when the flip began, before the card rotated into view.

#### Solution
1. **Delayed text overlay timing** - Text overlays now wait 300ms before appearing when flipping back to front (halfway through the 0.6s rotation)
2. **Z-index layering** - Front face has `z-index: 2` by default, back face gets `z-index: 2` when flipped, ensuring correct face stays visible
3. **Removed opacity interference** - Let natural CSS 3D transforms handle the animation instead of opacity fades

#### Result
- Smooth 3D flip animation visible throughout
- No image flash when flipping back to front
- Text overlays appear at the right moment
- Works reliably on iOS Safari and Android Chrome

---

## October 27, 2025 - Dynamic Font Sizing for Flashcard Questions

### 🎨 Feature: Smart Font Sizing Based on Text Length

Implemented dynamic font sizing for flashcard questions that automatically adjusts based on text length, making short questions prominent and ensuring long questions remain readable.

**Files Updated:**
- `flashcards/flashcard-engine.js` - Added dynamic font sizing logic for both text-only and text overlay questions
- `css/themes.css` - Removed static font-size declarations to allow JavaScript control
- `flashcards/flashcard-styles.css` - Increased container width temporarily (later reverted)

#### Problem Solved

**Inconsistent Text Sizing**
- Short questions like "What is Boyle's Law?" were displayed at the same size as long questions
- Medium-length questions had awkward line wrapping and narrow appearance
- No visual hierarchy to emphasize punchy short questions
- Static CSS couldn't adapt to varying question lengths

#### Solution: JavaScript-Controlled Dynamic Font Sizing

**Implementation Details**

Both text-only questions (`.text-only-question-box`) and text overlay questions (`.question-text-overlay`) now use the same dynamic sizing logic:

```javascript
// Dynamic font sizing based on text length
const textLength = card.term.length;
if (textLength <= 25) {
    element.style.setProperty('font-size', '3rem', 'important');    // Large for short questions
} else if (textLength <= 45) {
    element.style.setProperty('font-size', '2.5rem', 'important');  // Medium-large
} else if (textLength <= 70) {
    element.style.setProperty('font-size', '2.1rem', 'important');  // Medium for moderate length
} else if (textLength <= 100) {
    element.style.setProperty('font-size', '1.8rem', 'important');  // Smaller for longer questions
} else {
    element.style.setProperty('font-size', '1.5rem', 'important');  // Smallest for very long questions
}
```

**Font Size Progression:**
- **≤25 characters**: 3rem - Large and prominent (e.g., "What is Boyle's Law?" = 21 chars)
- **26-45 characters**: 2.5rem - Still large and readable
- **46-70 characters**: 2.1rem - Medium (e.g., "What is the purpose of the cilia and goblet cells in the trachea?" = 66 chars)
- **71-100 characters**: 1.8rem - Slightly smaller but still comfortable
- **>100 characters**: 1.5rem - Smallest size for very long questions

#### CSS Changes Required

**Removed Static Font Sizes**
- Removed `font-size: 2rem` from all theme classes (`.text-only-theme-default`, `.text-only-theme-blk-wht`, etc.)
- Removed `!important` overrides from mobile media queries that blocked JavaScript control
- Cleaned up conflicting CSS that prevented dynamic sizing

**Text Overlay Width Fix**
- Changed `.question-text-overlay` from `max-width: 95%` to `width: 80%`
- Fixed issue where absolutely positioned overlay was shrinking to ~300px instead of filling available space
- Text now uses proper line width for better readability

#### Technical Implementation

**Two Code Paths Updated**
1. **Text-only cards** (no image) - Lines 404-420 in `flashcard-engine.js`
2. **Text overlay cards** (text on gradient images) - Lines 487-499 in `flashcard-engine.js`

Both paths now use identical sizing logic to ensure consistency across all flashcard types.

**CSS Specificity with `!important`**
- JavaScript uses `element.style.setProperty('font-size', '3rem', 'important')` to override any remaining CSS
- Ensures dynamic sizing works regardless of CSS cascade

#### Benefits

**Better Visual Hierarchy**
- Short, punchy questions stand out prominently
- Gradual size reduction feels natural and readable
- Long questions still fit comfortably without feeling cramped

**Improved Readability**
- Medium-length questions now have appropriate line width (80% container width)
- Better line breaks with more natural text flow
- Consistent experience across text-only and text overlay questions

**Smarter Adaptation**
- Automatically handles any question length
- No manual CSS tweaking needed per question
- Works for both flashcard types (text-only and text overlay)

#### Architecture Notes

**Text Overlay vs Text-Only**
- **Text overlay** (`textOverlay: true` in YAML): Text displayed over gradient background images using `.question-text-overlay` class
- **Text-only** (no image): Text displayed in themed colored boxes using `.text-only-question-box` class
- Both are actively used features with different visual styles but now share font sizing logic

**Not Legacy Code**
The text overlay feature is actively used for questions like Unit 3 flashcards (Boyle's Law, Dalton's Law, Henry's Law, etc.) where gradient backgrounds provide visual interest without distracting from the text.

---

## October 27, 2025 - Flashcard Text Overlay Feature: Background Images for Text Questions

### 🎨 New Feature: Text Overlay Questions with Background Images

Implemented a new approach for text-only questions in flashcards that uses background images with overlaid text instead of CSS-themed colored boxes. This solves mobile layout issues and creates consistent sizing across all question types.

**Files Updated:**
- `css/themes.css` - Added text overlay styles
- `flashcards/flashcard-styles.css` - Enhanced image container handling
- `flashcards/flashcard-engine.js` - Added text overlay detection and rendering

#### Problem Solved

**Mobile Layout Issues**
- Text-only questions had inconsistent sizing compared to image questions
- Modal view showed text-only questions much larger than image questions
- Complex CSS was needed to try to match sizes between different question types
- Different code paths for rendering text vs image questions

#### Solution: Background Images with Text Overlays

**New YAML Format**
```yaml
# Old text-only format (still supported)
- id: 42
  question: "What is the mitral valve also known as?"
  answer: ["bicuspid valve"]
  theme: "blue-gradient"

# New background image format with text overlay
- id: 42
  image: "practical4/101.jpg"  # gradient background image
  question: "What is the mitral valve also known as?"
  answer: ["bicuspid valve"]
  textOverlay: true
```

#### Benefits

**Perfect Size Consistency**
- All questions now use the same image container (same dimensions)
- No more size discrepancies between text and image questions
- Single code path for rendering all question types
- Simplified CSS without complex height-matching logic

**Better Mobile Experience**
- Text overlays scale responsively with `clamp()` sizing
- Background images fill the card space properly
- Text remains readable at all screen sizes
- Consistent visual experience across devices

**Visual Interest**
- Gradient backgrounds are more engaging than plain colored boxes
- Maintains visual variety with different gradient styles
- Better memory retention through visual association
- Professional, polished appearance

**Simpler Code**
- Eliminates complex text-only vs image question distinction in CSS
- One rendering path handles all questions
- Easier to maintain and debug
- Future-proof architecture

#### CSS Implementation

**Text Overlay Styles** (`css/themes.css`)
```css
.question-text-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
    padding: 40px;
    max-width: 85%;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
    line-height: 1.4;
}
```

**Mobile Responsive Sizing**
```css
@media (max-width: 768px) {
    .question-text-overlay {
        font-size: clamp(1.3rem, 4.5vw, 1.8rem);
        padding: 20px;
        max-width: 90%;
        text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.7);
    }
}
```

#### JavaScript Detection

The flashcard engine now detects `textOverlay: true` in question data and automatically:
1. Displays the background image
2. Positions the question text as an overlay on the image
3. Adds `has-text-overlay` class to image container for proper styling
4. Handles loading states and preloading like regular image questions

#### Backward Compatibility

**Old format still works:**
- Questions without `textOverlay` flag render normally
- Text-only questions with `theme` field use colored box styling
- No breaking changes to existing flashcard decks
- Gradual migration path

#### Creating Background Images

**Gradient Images**
- Same dimensions as practical images (1024x768 recommended)
- Examples: `images/practical4/101.jpg` (teal-blue gradient), `images/practical4/102.jpg` (warm tan-orange gradient)
- Can create various styles: gradients, patterns, subtle textures, notebook paper, chalkboard, etc.
- Text overlay automatically handles contrast with text shadow

#### Use Cases

1. **Consistent flashcard sizing** - All questions look uniform in mobile and desktop views
2. **Better modal experience** - Review modals show consistent sizes for all question types
3. **Visual variety** - Different backgrounds help with memory association
4. **Easier theming** - Just swap background images instead of managing CSS theme classes
5. **Future flexibility** - Can use photos, patterns, or any visual background

#### Migration Path

1. Create gradient/background images at 1024x768 dimensions
2. Update YAML files to add `image` path and `textOverlay: true` flag to text-only questions
3. Remove old `theme` field (optional - still works if present)
4. Test in flashcard view and modal review
5. Once migrated, can remove deprecated text-only CSS classes

#### Technical Notes

- Text overlay uses absolute positioning within relative image container
- Z-index ensures text appears above image
- Text shadow provides contrast on any background
- Responsive `clamp()` sizing ensures readability on all devices
- Image preloading works identically to regular image questions

---

## October 25, 2025 - Code Refactoring: Shared Modules for DRY Principle

### 🔧 Major Refactoring: Shared Question Logic Modules

Completed **Step 2** of project streamlining by extracting shared code between mini quiz builder and practice practicals into reusable modules.

**Files Created:**
- `js/answer-checker.js` - Shared answer normalization and grading logic
- `js/question-renderer.js` - Shared rendering utilities and helpers

**Files Updated:**
- `mini-quiz-builder.html` - Now uses shared modules
- `practical-template.html` - Now uses shared modules

#### New Shared Modules

**`js/answer-checker.js`** - Answer Validation & Grading
- `normalizeAnswer()` - Removes articles, handles plurals, converts Roman numerals
- `getLevenshteinDistance()` - Calculates edit distance between strings
- `getSimilarityScore()` - Determines similarity percentage for partial credit
- `hasConflictingAnatomicalTerms()` - Detects opposite anatomical terms (left/right, etc.)
- `checkAnswer()` - Main grading function with configurable partial credit threshold
- `getResultType()` - Returns 'correct', 'partial', 'incorrect', or 'unanswered'

**`js/question-renderer.js`** - Rendering Utilities
- `getTextOnlyThemeClass()` - Returns theme class for text-only questions
- `shuffleArray()` - Fisher-Yates shuffle algorithm
- `renderQuestion()` - Renders image or text-only questions
- `createAnswerItem()` - Creates answer sheet item elements
- `updateNavigationButtons()` - Updates prev/next button states
- `updateQuestionCounter()` - Updates question counter display
- `highlightActiveAnswer()` - Highlights active answer in answer sheet
- `handleArrowKeyNavigation()` - Smart arrow key navigation (cursor position aware)
- `preloadImage()` - Preloads images for smoother navigation

#### Benefits

**DRY Principle Achieved**
- ~200 lines of duplicated code eliminated
- Single source of truth for answer checking logic
- Consistent behavior across all quiz/practical features
- Bug fixes apply to all tools automatically

**Code Quality Improvements**
- Modular, testable functions
- Clear separation of concerns
- Reusable across future features
- Well-documented function signatures

**UX Consistency**
- Identical grading logic in mini quizzes and practicals
- Same partial credit thresholds
- Consistent keyboard navigation behavior
- Matching visual feedback patterns

#### UX Enhancement: Two-Column Answer Sheet

Updated mini quiz builder to use the same two-column answer sheet layout as practice practicals:
- Questions 1-2 in left column
- Questions 3-4 in right column
- Numbers read down first column, then second column
- Consistent visual layout across all quiz tools

#### Technical Implementation

**Module Loading Strategy**
- Modules loaded via `<script>` tags before main application code
- Practical template uses dynamic script loading for dependency management
- Functions available globally for easy use across tools

**Backward Compatibility**
- No breaking changes to existing functionality
- All features continue to work as before
- Improved code maintainability for future development

#### Files Now Using Shared Modules

**Mini Quiz Builder** (`mini-quiz-builder.html`)
- Uses `js/answer-checker.js` for grading
- Uses `js/question-renderer.js` for utilities
- Uses `js/question-modal.js` for review modals (already shared)

**Practice Practicals** (`practical-template.html`)
- Uses `js/answer-checker.js` for grading (including extra credit)
- Uses `js/question-renderer.js` for utilities
- Uses `js/question-modal.js` for review modals (already shared)

#### Next Steps

**Step 3: Standardize Flashcard Decks** (docs/streamline.md)
- Create single `flashcard-template.html` with URL parameters
- Consolidate 4+ flashcard files into one template
- Further reduce code duplication

---

## October 24, 2025 - Pathway Quiz Data and Logic Fixes

### 🐛 Bug Fixes and Data Corrections

**Files Updated:** `js/pathway-validator.js`, `js/fuzzy-matcher.js`, `data/vessel-connections.yml`, `data/pathway-questions.yml`, `pathway-mini-quiz.html`

Fixed various data errors and logic issues in the vessels pathway quiz to improve accuracy and reliability of pathway validation.

### 📝 Documentation Workflow Improvement

**File Updated:** `CLAUDE.md`

Added a workflow section establishing documentation as a required final step when implementing features or fixing bugs. This ensures work is documented incrementally throughout sessions, avoiding large context usage at the end of sessions when trying to reconstruct what was done.

---

## October 24, 2025 - Pathway Quiz Major Improvements

### 🎯 Pathway Validator Enhancements

Significantly improved the pathway mini quiz grading and feedback system with better error messages and scoring.

**Files Updated:** `js/pathway-validator.js`, `js/fuzzy-matcher.js`, `data/vessel-connections.yml`, `data/pathway-questions.yml` (image paths)

#### Grading System: Always 2 Points Maximum

**2-Point Scoring System**
- All pathway questions now scaled to exactly **2.0 points maximum**
- Proportional scoring based on pathway length
- Examples:
  - 5-vessel pathway with all correct = 6 raw points → **2.0/2.0 points** (100%)
  - 5-vessel pathway with 1 typo = 5.5 raw points → **1.8/2.0 points** (92%)
  - 10-vessel pathway with all correct = 11 raw points → **2.0/2.0 points** (100%)
  - 10-vessel pathway with 2 typos = 10 raw points → **1.8/2.0 points** (91%)
- Maintains proportional partial credit for typos (-0.5 per misspelling)
- Zero points if pathway is fundamentally wrong (skipped vessel, wrong connection)

**Implementation**
- Raw score calculation: 1 point per vessel + 0.5 for typos + 1 for reaching endpoint
- Scaling factor: `2.0 / rawMaxScore`
- Final score rounded to 1 decimal place
- Display: "Score: 1.8/2 pts (90%)"

#### Error Messages: No More Answer Giveaways

**Problem Fixed**
- Error messages were revealing the correct answers
- Students could keep guessing until the hint told them what to add
- Reduced learning opportunity and critical thinking

**New Error Messages**

1. **Invalid vessel name** ✅ (NEW)
   - Before: Listed all valid connections
   - Now: `"{vessel}" is not a blood vessel. Check the name and try again."`
   - Example: `"left posterior popliteal artery" is not a blood vessel. Check the name and try again.`

2. **Skipped vessel** ✅ (IMPROVED)
   - Before: `You skipped "right external iliac artery".`
   - Now: `"right femoral artery" doesn't connect directly to "right common iliac artery". You skipped an artery. Check the connection and try again.`
   - Tells students they're close without revealing which vessel was skipped

3. **Wrong vessel type** ✅ (unchanged - already good)
   - Message: `"{vessel}" is a vein, not an artery."`
   - Educational feedback for common confusion

4. **Vessel doesn't connect** ✅ (IMPROVED)
   - Before: `Try going through the left popliteal artery next.`
   - Before: `From "X", you can go to "Y", "Z".`
   - Now: `"{currentNode}" doesn't connect to "{nextNode}". Check the connection and try again."`
   - No longer reveals valid next vessels

**Educational Benefits**
- Students must think through anatomy themselves
- Active learning and problem-solving encouraged
- Better retention when students figure it out
- Reduced "guess until hint tells you" strategy

#### Fuzzy Matcher: Distinct Vessel Names

**Enhanced Medical Opposites List**
- Added comprehensive vessel-specific anatomical terms that should NEVER be considered similar
- Prevents false matches like "radial" ≈ "brachial"

**New Anatomical Term Pairs (66 new entries)**
- **Arm/Upper Limb**: radial ≠ ulnar ≠ brachial ≠ axillary
- **Arm Veins**: basilic ≠ cephalic ≠ cubital
- **Leg/Lower Limb**: femoral ≠ popliteal ≠ tibial ≠ fibular
- **Leg Veins**: saphenous ≠ femoral ≠ popliteal ≠ tibial
- **Head/Neck**: carotid ≠ subclavian ≠ jugular ≠ vertebral
- **Abdomen**: celiac ≠ mesenteric ≠ renal, hepatic ≠ splenic ≠ gastric
- **Brain**: cerebral ≠ cerebellar ≠ basilar

**How It Works**
- Before calculating similarity, checks if vessel names are in opposites list
- If found: Returns 0 (zero credit) immediately
- No partial credit for completely different vessels
- Example: "radial artery" vs "brachial artery" → 0 points (not 0.5)

#### Vessel Connection Updates

**Great Saphenous Vein Shortcut**
- Added direct connection: great saphenous vein → external iliac vein
- Allows skipping common femoral vein
- Applies to both right and left sides
- More anatomically flexible pathway validation

**Data File Updates**
- `data/vessel-connections.yml`: Added saphenous vein shortcuts with comments
- `data/pathway-questions.yml`: Fixed image paths for consistency

### 🔄 "Try Again" Feature: Preserve Correct Answers

**Status:** ✅ Implemented

**Description**
When students click "Try Again" after getting a pathway wrong, the correct vessels are preserved so they can continue from where they made a mistake.

**Features Implemented**
- Preserves all correctly validated vessels (green styling, read-only)
- Clears only fields after the first error
- Auto-focuses cursor on first editable field
- Remove buttons hidden for preserved vessels
- Full dark mode support for preserved inputs (emerald green backgrounds)

**How It Works**
1. Captures original pathway BEFORE clearing inputs (bug fix)
2. Finds first error in validation feedback
3. Re-creates input fields up to error point with correct values
4. Marks preserved fields as read-only with green styling
5. Adds empty fields for student to fix error and continue

**Example**
- Student enters: aorta ✓, descending aorta ✓, left common iliac ✓, femoral artery ✗
- "Try Again" preserves: aorta, descending aorta, left common iliac (green, locked)
- Cursor focuses on field 4 (empty, editable)
- Student adds missing "left external iliac artery" and continues

**Educational Benefits**
- Productive failure - learn from mistakes without losing progress
- Scaffolding - correct portions provide foundation
- Reduced frustration - don't re-type correct vessels
- Faster iteration - quick retry cycles improve learning

#### Bug Fixes

**"Try Again" Clear Bug Fixed**
- Problem: Calling `getPathway()` after clearing inputs returned empty array
- Solution: Capture pathway BEFORE clearing `innerHTML`
- Now correctly preserves vessels when retrying

### 📝 Documentation Updates

**Updated `docs/features-and-bugs.md`**
- Marked "Preserve Correct Answers on Try Again" as ✅ Implemented (completed 2025-10-24)
- Added new feature request: "Pathway Validator: Improve Error Messages to Not Give Away Answers"
  - Status: ✅ Implemented (completed same session)
  - Documented all error message improvements
  - Listed educational benefits and technical considerations

**Image Path Corrections**
- User updated some incorrectly linked images in pathway question data
- Fixed image references for consistency

---

## October 18, 2025 - Flashcard Image Loading Fix & Blood Vessels Content

### 🐛 Fixed Flashcard Image Loading Flash

**Files:** `flashcards/flashcard-engine.js`, `flashcards/flashcard-styles.css`

Fixed a jarring black/dark flash when navigating between flashcards.

#### Problem
- Images showed dark gray body background during transitions
- 1ms delay before displaying preloaded images caused visible flash
- Poor user experience during card navigation

#### Root Causes
1. **Missing background color** - `.image-container` had no background, so dark page background (`#374151`) showed through
2. **Unnecessary setTimeout** - 1ms delay before showing preloaded images even when already cached

#### Solution
1. **Added white background** - `flashcards/flashcard-styles.css:272`
   - Set `background-color: #ffffff` on `.image-container`
   - White background shows during loading instead of dark page background

2. **Removed setTimeout delay** - `flashcards/flashcard-engine.js:416-419`
   - Changed from `setTimeout(() => { termImage.src = ... }, 1)` to immediate assignment
   - Preloaded images display instantly without delay
   - Images already loaded in memory, no delay needed

#### Result
- Smooth transitions between flashcards with no visible flash
- Clean white background during brief loading moments
- Better user experience during card navigation
- Preloading system now works as intended

---

### 📚 Blood Vessels Practice Practical Expansion

**File:** `data/unit2-part2-practical.yml`

Added 3 new questions for the internal organ model with labeled structures.

#### New Questions Added
- **Question 64**: "What is the structure labeled X?" → Hepatic portal vein
- **Question 65**: "What is the structure labeled Y?" → Right renal vein
- **Question 66**: "What is the structure labeled Z?" → Left renal artery

#### Content Details
- All three questions reference the same internal organ anatomical model
- Labels X, Y, Z identify different vessels on kidneys and liver
- Each includes comprehensive educational definitions
- Tagged with: `blood-vessels`, `vein`/`artery`, `models`, `internal-organ-model`

#### Educational Value
- **Hepatic portal vein**: Light purple vessel carrying nutrient-rich blood to liver (portal system)
- **Right renal vein**: Blue vessel draining right kidney to IVC
- **Left renal artery**: Red vessel supplying oxygenated blood to left kidney

#### Total Content
Practice Practical #3 now includes:
- **66 image-based questions** (id: 1-67, excluding gap at 63)
- **17 text-only questions** (id: 100-116)
- **83 total questions** for comprehensive blood vessels practice

---

### 📋 Feature Request: Question Grouping

**File:** `docs/features-and-bugs.md`

Documented new feature request for question grouping in practice practicals.

#### Proposed Feature
Keep related questions together in sequential order during randomization (e.g., X, Y, Z labels on same image).

#### Configuration Format
```yaml
- id: 64
  question: "What is the structure labeled X?"
  group: "internal-organs-1"

- id: 65
  question: "What is the structure labeled Y?"
  group: "internal-organs-1"

- id: 66
  question: "What is the structure labeled Z?"
  group: "internal-organs-1"
```

#### Expected Behavior
- Questions within a group stay together and in order
- Groups randomize as single units among other questions
- Backward compatible with existing questions
- Works with tag balancing and other features

#### Use Cases
- Multi-label images (X, Y, Z on same model)
- Sequential processes that build on each other
- Comparative questions about related structures
- Case studies with multiple related questions

#### Priority
Medium - Enhances UX for multi-part questions but not blocking.

---

## October 15, 2025 - Flashcard Mobile Image Crop Fix

### 🖼️ Fixed Mobile Image Cropping to Preserve Top/Bottom Anatomy

**File:** `flashcards/flashcard-styles.css`

Fixed an issue where flashcard images on mobile devices were cropping important anatomy and arrows at the top and bottom of images.

#### Problem
- Mobile view was using `object-fit: cover` with `transform: scale(1.25)`
- This caused aggressive cropping that cut off arrows and anatomical structures at top/bottom
- Made vessel identification difficult when key features were hidden

#### Solution
Implemented height-based image sizing that crops sides only:
- **Fixed height:** `420px` - fills the available white space in the card
- **Auto width:** `width: auto` - lets width adjust based on image aspect ratio
- **Minimum width:** `min-width: 100%` - ensures image spans full container width (often exceeds, allowing side cropping)
- **Object-fit:** `cover` - fills the 420px height while maintaining aspect ratio
- **Centered:** `object-position: center` - crops sides evenly
- Combined with `.image-container` having `overflow: hidden`, sides get clipped while preserving top/bottom content

#### Result
- Images now fill the mobile card space effectively
- All anatomy and arrows at top/bottom are fully visible
- Side cropping provides zoom effect without losing critical content
- Better learning experience for vessel identification

---

## October 15, 2025 - Blood Vessels Practical Content Expansion

### 📚 Major Content Addition: 28 New Vessel Questions with Definitions

Significantly expanded the blood vessels practice practical with comprehensive venous system coverage and helpful learning aids.

**File Updated:** `data/unit2-part2-practical.yml`

#### Content Added

**Page 19 - Hepatic Portal System (6 questions, id: 35-40)**
- Hepatic portal vein
- Hepatic veins
- Superior mesenteric vein
- Gastric veins
- Splenic vein
- Inferior mesenteric vein

**Page 18 - Systemic Veins (10 questions, id: 41-50)**
- Hepatic veins (duplicate from different view)
- Right renal vein
- Right internal iliac vein
- Left cephalic vein
- Left basilic vein
- Left brachial vein
- Left median cubital vein
- Left radial vein
- Left axillary vein
- Right gonadal vein

**Page 15 - Dural Venous Sinuses (5 questions, id: 51-55)**
- Cavernous sinus
- Internal jugular vein/veins
- Petrosal sinus
- Sigmoid sinus
- Transverse sinuses

**Page 17 - Head & Neck Vessels (7 questions, id: 56-62)**
- Superior sagittal sinus
- Right transverse sinus
- Right external jugular vein
- Right internal jugular vein
- Right brachiocephalic vein
- Right subclavian vein
- Right vertebral vein

**Crystal Skull Model (1 question, id: 67)**
- Right transverse sinus (on model)
- Left gap (id: 63-66) for future model questions

#### Educational Enhancements

**Comprehensive Definitions Added**
- All 28 new questions include detailed definitions for flashcard review
- Definitions include:
  - Anatomical function (what the vessel drains/supplies)
  - Key connections to other vessels
  - Memory aids and fun facts
  - Clinical relevance where applicable

**Notable Definition Features**
- **Etymology notes**: Basilic vein (Greek/Arabic origins), Cephalic vein (Greek for head)
- **Clinical facts**: Median cubital vein (most common blood draw site), Renal arteries (20% of cardiac output)
- **Anatomical comparisons**: Right vs left renal veins, brachiocephalic veins vs arteries
- **Memory tips**: Sigmoid = S-shaped, Superior sagittal sinus CSF reabsorption

**Plural/Singular Clarity**
- Updated transverse sinuses to plural (id: 55) - shows both sinuses in image
- Consistent naming for paired vs unpaired structures

#### Previously Missing Definitions Added

Filled in definitions for 19 existing questions (id: 6, 11-34) that had empty definition fields:
- Left common carotid artery
- Right renal artery
- Common iliac arteries
- External/internal iliac arteries
- Subclavian arteries
- Radial and ulnar arteries
- Hepatic and splenic arteries
- Mesenteric arteries
- Adrenal and gonadal arteries
- Brachiocephalic trunk and branches
- Vein identification question

#### Content Quality Improvements

**Consistent Formatting**
- All definitions written in accessible, student-friendly language
- Anatomical connections clearly stated
- Emphasis on relationships between vessels in drainage/supply pathways

**Tagging System**
- New page-specific tags: `vessels-15`, `vessels-17`, `vessels-18`, `vessels-19`
- Model questions tagged with: `models`, `crystal-skull`
- All questions maintain `blood-vessels` base tag

#### Project Scope

**Total Questions in unit2-part2-practical.yml**
- **62 image-based questions** (id: 1-62, plus id: 67)
- **17 text-only questions** (id: 100-116)
- **79 total questions** in blood vessels practical

**Image Naming Convention**
- Images match ID numbers: `practical-2-2/35.jpg` through `practical-2-2/62.jpg`
- Model images use non-sequential numbers: `practical-2-2/67.jpg`
- Gap reserved (id: 63-66) for future model photos

#### Bug Documentation

**New Bug Reported** (`docs/features-and-bugs.md`)
- **Flashcard Images Flash Black Before Loading**
  - Occurs when advancing between flashcards
  - Possible causes: No image preloading, black background CSS, missing loading attributes
  - Documented with potential solutions for future fix

#### Use Cases

1. **Comprehensive venous system practice** - Portal system, systemic veins, dural sinuses
2. **Flashcard study** - All questions include definitions for spaced repetition
3. **Targeted practice by page** - Filter by vessels-15, vessels-17, vessels-18, vessels-19 tags
4. **Model-based learning** - Crystal skull questions tagged separately
5. **Etymology learning** - Word origins help with memorization

---

## October 14, 2025 - Unit 2 Exam Print Enhancements & Image Support

### 🖨️ Print-Friendly Exam with Answer Key

Enhanced `unit2-exam.html` with comprehensive print functionality and professional formatting for paper-based practice.

**Files Updated:** `unit2-exam.html`, `css/exam-print.css`, `css/quiz.css`, `data/unit2-exam.yml`

#### Print Features Implemented

**Complete Answer Key (Print-Only)**
- Appears on separate page after exam questions (hidden on screen)
- Organized by section with clear headers
- **Multiple Choice:** Listed as "1. A", "2. C", etc.
- **True/Make True:** Shows correct word or "True" for each statement
- **Table Questions:** Shows question with pipe-separated answer rows
- **Essay/Short Answer:** Full answer text with question context
- Professional formatting with section dividers

**Cover Page & Scantron**
- Print-only cover page with exam title, name field, and date field
- Dynamic scantron bubble sheet generated from actual questions
- **Letters inside bubbles** for cleaner appearance
- **Uniform bubble columns:** All questions show A-E bubbles (based on max options in exam)
- Two-column layout with proper page breaks
- Hidden on screen, only visible when printing

**Optimized Question Layouts**
- **Multiple Choice:** Compact layout (~10 per page) with visual separation
- **True/Make True:** Numbered blank lines with CSS counter system for proper numbering
- **Essay Questions:**
  - Low-point questions (< 10 pts): ~180pt spacing for handwritten answers
  - High-point questions (≥ 10 pts): Full page per question
  - Questions with images: Image + question on one page, blank space on next
- **Mobile images:** Responsive sizing so images fit on mobile screens

**Print CSS Enhancements**
- All UI elements hidden (buttons, navigation, grading interfaces)
- Black text, no shadows or gradients
- Optimized page breaks to prevent awkward splits
- Professional typography (11pt body, appropriate headings)

#### Image Support for Multiple Choice

**New Feature: MC Questions with Images**
- Added `image` field support for multiple choice questions
- Images display between question number and question text
- **Screen:** Centered with rounded corners and subtle shadow
- **Print:** Centered, max 90% width, 300pt height
- **Mobile:** Responsive sizing (max-width: 100%)
- Example: Graph question added to exam (graph-25.jpg)

#### Configurable Randomization System

**YAML-Based Quiz Configuration**
- `randomize: true/false` - Toggle random question selection
- `maxQuestions: 36` - Configurable question limit
- When randomization enabled:
  - Proportionally samples from blood, heart, and vessels categories
  - Shuffles final selection for varied practice
- When randomization disabled (`randomize: false`):
  - Shows all questions in YAML order
  - Useful for comprehensive review

#### Content Updates

**Answer Key Verification**
- Compared all 27 professor questions against official answer key
- ✅ All answers verified correct
- Updated **Plasminogen** answer: "Does nothing" → "Is inactive" (clearer wording)
- Fixed **Warfarin essay**: Corrected "intrinsic pathway is faster" → "extrinsic pathway is faster"
- Added **anastomoses** true/make-true question for vessel connections

**YAML Fixes**
- Fixed image path: `graph_25.jpg` → `graph-25.jpg`
- Removed "(see image)" from clotting pathway essay question
- Added `randomize` and `maxQuestions` configuration fields

#### Technical Implementation

**CSS Counter System for True/Make True**
- Replaced fragile nth-child selectors with robust counter system
- `counter-reset` on section, `counter-increment` on cards
- Numbering works correctly regardless of DOM structure
- Supports text wrapping with proper alignment

**Answer Key Generation**
- JavaScript function `renderAnswerKey()` generates key from quiz data
- Calculates correct letter (A/B/C/D/E) from index for MC questions
- Shows first correct word from array for true/make-true
- Formats essay answers with question context
- Hidden on screen via CSS, shown only in print media

**Print CSS Architecture**
- `exam-print.css` loaded with `media="print"` attribute
- Screen-specific hiding rules in `quiz.css` for broad compatibility
- Separate `@media screen` and `@media print` sections
- Cover page and answer key visibility controlled by both files

#### Design Decisions

**Answer Key Format**
- Simple numbered lists by section (not inline with questions)
- First correct answer shown (not all accepted variations)
- Matches traditional exam answer key format
- Easy to grade printed exams quickly

**Print Layout**
- Prioritized readability and space efficiency
- True/make-true: Shorter blank line, statement starts immediately after
- Point values in section headers, not per question (less clutter)
- Page breaks prevent orphaned questions

**Mobile Responsiveness**
- Added `.question-image` and `.essay-image` mobile rules
- Max-width: 100%, height: auto for proper scaling
- Reduced margins on mobile (12px vs 16pt)

#### Files Modified

**HTML**
- `unit2-exam.html`: Added answer key HTML, image support, renderAnswerKey(), updated randomization logic

**CSS**
- `css/exam-print.css`: Cover page, scantron, answer key print styles
- `css/quiz.css`: Screen-specific hiding rules, mobile image styles

**Data**
- `data/unit2-exam.yml`: Added `randomize`, `maxQuestions`, fixed answers, added anastomoses question

**Documentation**
- Updated `docs/features-and-bugs.md`: Marked print CSS feature as completed

#### Use Cases

1. **Print practice exam** - Professional paper format with scantron
2. **Print answer key** - Separate key for self-grading or instructor use
3. **Study offline** - Complete exam without screen time
4. **Simulate real exam** - Practice under paper-based conditions
5. **Mobile practice** - Images properly sized for phone screens
6. **Customizable difficulty** - Adjust question count via YAML config

---

## October 12, 2025 - Pathway Mini Quiz Advanced Refinements

### 🎯 Major Enhancements to Pathway Validation System

Significantly improved the pathway quiz with intelligent feedback, partial credit for typos, and contextual guidance.

**Files Updated:** `js/pathway-validator.js`, `pathway-mini-quiz.html`, `data/pathway-questions.yml`, `data/vessel-connections.yml`

#### Advanced Features Implemented

**Partial Credit for Typos (Yellow Highlighting)**
- **FuzzyMatcher integration**: Detects minor spelling errors and awards 0.5 points
- **Visual feedback**: Yellow arrows (—½→) and yellow input backgrounds for typos
- **Corrected pathway tracking**: Typos don't break the chain - validator uses corrected names for subsequent validation
- **Example**: "right redial artery" → 0.5 points, feedback shows "should be 'right radial artery'"
- **Scoring**: Each vessel = 1.0 point, typos = 0.5 points, wrong = 0 points

**Intelligent Contextual Feedback**
- **Skipped vessel detection**: "You skipped 'right femoral artery'."
- **Artery/vein confusion**: "'right femoral vein' is a vein, not an artery."
- **Pathfinding guidance**: Uses breadth-first search to identify vessels that lead toward the destination
- **Conversational tone**: Natural language feedback like a helpful tutor
- **Example**: "The right foot doesn't connect directly to the descending aorta. Try going through the right common iliac artery next."

**Optional Descriptors Support**
- **Starting points**: "heart", "left ventricle", and "aortic semilunar valve" are optional prefixes before "aorta"
- **Endpoints**: "hand" and "foot" can be added after terminal arteries as optional descriptors
- **Anatomical positioning**: "aortic semilunar valve" must be in correct location if included
- **Endpoint validation**: Recognizes when valid endpoint was reached even if optional descriptor added after

**Enhanced Fuzzy Matching**
- **"descending aorta" fix**: No longer incorrectly matches plain "aorta"
- **Ascending shortcuts**: "aorta" can match "ascending aorta" but not "descending aorta"
- **Handles**: R/L abbreviations, "the" prefix, case differences, plurals

**Vessel Connection Updates**
- Removed "hand" and "foot" from valid endpoints list (now optional extensions only)
- Added "hand"/"foot" as valid connections FROM terminal arteries (radial, ulnar, tibial, fibular)
- 50+ arterial vessels, 40+ venous vessels mapped

#### Visual Improvements

**Color-Coded Feedback**
- Green checkmark arrows (—✓→) for correct vessels (1.0 point)
- Yellow half arrows (—½→) for typos (0.5 points)
- Red X arrows (—✗→) for incorrect vessels (0 points)
- Matching input field backgrounds (green/yellow/red)

**Current Questions** (4 pathway questions)
- Heart → Right Hand (id: 200) - with image
- Heart → Left Hand (id: 201) - with image
- Heart → Right Foot (id: 202) - with image
- Heart → Left Foot (id: 203) - with image
- Questions randomly selected on page load/refresh

#### Core Infrastructure

**Pathway Validator** (`js/pathway-validator.js`)
- Validates sequential pathways against connection tree
- **Fuzzy name matching**: Uses FuzzyMatcher.js for typo detection and partial credit
- **Pathfinding**: Breadth-first search to find vessels that lead to destination
- **Corrected pathway tracking**: Replaces typos with correct names for chain validation
- **Artery/vein detection**: Checks if student used wrong vessel type
- **Skipped vessel detection**: Identifies when student skipped an intermediate vessel
- **Contextual feedback**: Shows only the immediate next step toward destination
- Enhanced error messages in conversational tone

**Vessel Connection Tree** (`data/vessel-connections.yml`)
- Complete arterial and venous trees
- 50+ arterial vessels mapped with connections
- 40+ venous vessels mapped with connections
- Optional descriptors: heart → aorta, terminal arteries → hand/foot
- Anatomically valid shortcuts included

#### Educational Philosophy
- **Productive failure**: Students learn from specific, helpful feedback
- **Partial credit**: Rewards understanding despite minor spelling errors
- **Contextual guidance**: Shows the correct path without giving away entire answer
- **Immediate feedback**: Try Again button for repeated practice
- **Progressive difficulty**: Can add optional vessels for extra detail

---

## October 12, 2025 - Pathway Mini Quiz Initial Implementation

### 🆕 New Feature: Pathway Mini Quiz for Extra Credit

Created a standalone pathway practice system for tracing blood vessel routes - a complete extra credit practice tool.

**File:** `pathway-mini-quiz.html`
**Data:** `data/pathway-questions.yml`

#### Features Implemented

**Visual Question Display**
- Image-based pathway diagrams (heart → hand/foot)
- Question text displayed below images as prompts
- Clean, centered layout optimized for clarity

**Smart Input System**
- Start with 3 empty vessel input fields
- Add/remove fields dynamically as needed
- Enter/Tab key navigation between fields (skips delete buttons)
- Minimum 1 field always present
- Auto-focus on next field after Enter/Tab

**Intelligent Validation & Feedback**
- **Visual pathway display** with color-coded arrows for valid/invalid connections
- **Input field color coding**: Green for correct, red for incorrect
- **Detailed text feedback**: Shows exact error messages
- **Helpful hints**: Detects when you use a vein instead of an artery
- Partial credit scoring per valid connection
- Try Again button for repeated practice

#### Core Infrastructure

**Pathway Validator** (`js/pathway-validator.js`)
- Validates sequential pathways against connection tree
- **Fuzzy name matching**: Handles typos, R/L abbreviations, "the" prefix
- **Artery/vein detection**: Checks if student used wrong vessel type and provides helpful hint
- Flexible design - works for any connected system (vessels, nerves, metabolic pathways, etc.)
- Enhanced error messages show the problematic vessel name

**Vessel Connection Tree** (`data/vessel-connections.yml`)
- Complete arterial and venous trees
- 50+ arterial vessels mapped
- 40+ venous vessels mapped
- Includes anatomically valid shortcuts (e.g., skip "ascending aorta" → directly to "aortic arch")
- **Validated structure**: Custom validator checks for broken references

**YAML Validation System**
- Extended `scripts/validate-yaml.js` to handle pathway questions
- Pathway-specific validation:
  - Requires `direction` field (arterial/venous)
  - Requires `validStartVessels` array
  - Requires `validEndVessels` array
  - Accepts either question text OR image (or both)
- Vessel connections validation:
  - Checks arterial/venous tree structure
  - Reports vessel counts
  - Validates with dedicated `validate-vessels.js` script

**Vessel Connection Validator** (`validate-vessels.js`)
- Checks for broken references in vessel trees
- Ensures every vessel in a connection list exists or is a valid endpoint
- Run with: `node validate-vessels.js`

#### Design Decisions
- Arterial paths: Start with "aorta", "ascending aorta", "heart", or "left ventricle"
- Arterial endpoints: Accept specific arteries OR generic "hand"/"foot" for flexibility
- Shortcuts: Allow skipping intermediate descriptive labels, but not actual vessels
- Scoring: Partial credit per valid step + bonus for reaching correct endpoint
- Separated from practice practicals to avoid slowing down main quiz validation

#### Technical Improvements
- Pathway questions stored in separate `data/pathway-questions.yml` file
- Reusable pathway question type - can be used for any system (nerves, metabolic pathways, etc.)
- Fixed feedback index mapping bug for correct input field coloring
- Smart Tab/Enter key handling skips UI elements, focuses on content

#### Use Cases
- Extra credit practice for vessel pathway questions
- Learn valid blood flow routes step-by-step
- Immediate feedback on where pathway breaks
- Understand vessel connections through trial and error

---

## October 11, 2025 - Pathway Mini Quiz Feature (Initial Implementation)

### 🆕 New Feature: Blood Vessel Pathway Practice

Created a new pathway mapping feature for extra credit practice - tracing blood vessel routes from one location to another.

**File:** `pathway-mini-quiz.html`

#### Features
- **Single-question practice format** - Quick, focused extra credit review
- **Dynamic pathway input**
  - Start with 3 input fields
  - Add/remove vessel fields as needed
  - Enter key navigation between fields
  - Minimum 1 field always present
- **Smart validation**
  - Validates anatomical connections using vessel tree
  - Fuzzy name matching (handles typos, variations)
  - Partial credit scoring per valid connection
  - Detailed feedback showing where pathway breaks
- **Question example:** "How would blood get from the heart to the right hand?"
- **Full dark mode support**
- **Try Again** button for repeated practice

#### Core Infrastructure

**Pathway Validator** (`js/pathway-validator.js`)
- Validates sequential pathways against connection tree
- Flexible design - works for any connected system (vessels, nerves, metabolic pathways, etc.)
- Handles anatomically valid shortcuts (e.g., "aorta" → "brachiocephalic trunk")

**Vessel Connection Tree** (`data/vessel-connections.yml`)
- Maps all blood vessel connections
- Separate arterial and venous trees
- Includes shortcuts for flexibility (skip descriptive terms, not anatomical structures)

#### Design Decisions
- Arterial paths start with: "aorta", "ascending aorta", or "heart"
- Venous paths end at: "right atrium" or "heart"
- Shortcuts allow skipping intermediate labels but not actual vessels
- Scoring: Partial credit per valid connection

#### Use Cases
- Extra credit practice for vessel pathway questions
- Quick review before practicals/exams
- Helps students learn valid blood flow routes
- Refresh page for new random question

#### Additional Files Created
- `pathway-test.html` - Development/testing page
- `pathway-practical.html` - Multi-question demo
- Question added to `unit2-part2-practical.yml` (id: 200)

---

# Release Notes

## October 11, 2025 - Flashcard Display Improvements

### 🎨 Enhanced Flashcard Image Display

**File:** `flashcards/flashcard-styles.css`

Improved image display in flashcard review to maximize visual detail:
- **Desktop:** 30px padding with full uncropped images, no border
- **Mobile:** 10px padding on front (image cards) with 25% zoom crop for detail, 30px padding on back (definition cards)
- Increased max image height from 350px → 480px
- Mobile responsive: Back link now appears above deck title on small screens

### 📱 Practice Practical Mobile Header Fix

**File:** `css/practical.css`

Fixed header overlap issue on mobile:
- Home link now appears above title instead of overlapping
- Vertical layout on mobile with proper spacing
- Title and question count remain centered

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
