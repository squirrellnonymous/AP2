# Release Notes

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
