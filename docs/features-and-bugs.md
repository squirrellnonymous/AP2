# Features and Bugs

## Quick Index

### Feature Requests
- Comprehensive Style Library System for Flashcards - Not yet implemented
- Footer on All Pages with Project Information - Not yet implemented
- Midi Quizzes - 10 Question Practice Format - Not yet implemented
- Wider Input Boxes and Consistent Column Layout for Quizzes - Not yet implemented
- Question Grouping for Practice Practicals - Not yet implemented
- Pathway Validator: Improve Error Messages to Not Give Away Answers - Not yet implemented
- Pathway Questions in Practice Practicals with Auto-Grading - Not yet implemented
- Mini Quizzes for Lecture Exam Material - Not yet implemented
- Fill-in-the-Blanks Flowchart Practice - Not yet implemented
- Better Styling for Blank Answers in Answer Sheet - Not yet implemented
- Refine Display of Correct Answers from Arrays in Quiz Results - Not yet implemented
- Alphabetical Tag Ordering in Custom Flashcard Deck Builder - Not yet implemented
- Refactor index.html JavaScript to External File - Not yet implemented
- Load index.html Content from YAML Configuration - Not yet implemented

### Known Bugs
- **Flashcard Flip Animation Regression - Regular Image Cards** - ❌ VOID - Firefox emulation artifact (October 28, 2025)
- Flashcard Image Flash During Flip Animation on Mobile - ✅ FIXED (October 2025)
- Pathway Quiz Corrections Still Give Away Answers - Not yet fixed
- Answer Inputs Not Disabled After Practical Submission - Not yet fixed
- Light/Dark Mode Button Covers Page Title - Not yet fixed
- Theme Lab File Not Responsive and Doesn't Show Real Usage - Not yet fixed
- Results Modal Shows Text-Only Questions Larger Than Image Questions - ✅ FIXED (October 2025)
- Inconsistent "(blank)" Display in Answer Modal - Not yet fixed
- Text Overlay Questions Spacing Mismatch in Mini Quiz Builder - Not yet fixed

---

# Feature Requests (Detailed)

## Comprehensive Style Library System for Flashcards

**Status:** Not yet implemented
**Priority:** Low (nice-to-have for future content creation workflow)
**Location:** YAML files, CSS themes, flashcard engine

### Vision

Create a comprehensive styling system for flashcards that gives total control over the appearance of both front and back of cards, with a reusable style library that can be referenced by simple shortcuts. This will enable non-technical contributors to create beautifully styled flashcards by browsing available styles or customizing existing ones.

### Current State

**What Works:**
- Text-only cards support theme shortcuts (e.g., `theme: "blk-wht"`) in YAML
- Text overlay cards show white text over background images with dark shadows
- Dynamic font sizing based on text length
- Basic color/gradient themes defined in `css/themes.css`

**Limitations:**
- Text overlay cards have hardcoded white text and can't use dark text on light backgrounds
- No per-card control over text color, shadow style, or background properties
- No unified style system across text-only and text-overlay cards
- Themes are scattered between CSS and hardcoded in JavaScript
- No visual preview/browsing of available styles

### Desired Features

#### 1. **Total Styling Control Per Card**

Allow complete customization of both front and back of flashcards via YAML:

```yaml
# Example: Full custom styling
- id: 103
  question: "What is Henry's Law?"
  image: "gradients/02.jpg"
  textOverlay: true
  style:
    front:
      textColor: "#1a202c"
      textShadow: "light"
      backgroundColor: "#f8fafc"  # For text-only cards
      fontWeight: "600"
    back:
      backgroundColor: "#ffffff"
      textColor: "#374151"
```

#### 2. **Style Library with Shortcuts**

Create a library of pre-defined, reusable styles referenced by simple names:

```yaml
# Example: Using style library shortcuts
- id: 103
  question: "What is Henry's Law?"
  image: "gradients/02.jpg"
  textOverlay: true
  stylePreset: "light-elegant"  # References pre-built style

- id: 104
  question: "What is Dalton's Law?"
  image: "gradients/03.jpg"
  textOverlay: true
  stylePreset: "dark-bold"  # Different pre-built style
```

Style library could be defined in YAML or JSON:
```yaml
# styles-library.yml
stylePresets:
  light-elegant:
    front:
      textColor: "#1a202c"
      textShadow: "1px 1px 3px rgba(255,255,255,0.8)"
      fontWeight: "500"
    back:
      backgroundColor: "#ffffff"

  dark-bold:
    front:
      textColor: "#ffffff"
      textShadow: "2px 2px 8px rgba(0,0,0,0.7)"
      fontWeight: "700"
    back:
      backgroundColor: "#1a202c"
      textColor: "#f7fafc"
```

#### 3. **Style Browser Interface** (Long-term)

Visual interface for non-technical users to:
- **Browse available styles** - See previews of all style presets
- **Select a style** - Click to apply to current card
- **Modify existing styles** - Adjust colors, shadows, fonts with visual controls
- **Save custom styles** - Add new presets to the library
- **Share styles** - Export/import style definitions

#### 4. **Unified Theme System**

Consolidate styling across all card types:
- Text-only cards (no image)
- Text overlay cards (text over background image)
- Image cards (image with text below)
- Back side styling

All should use the same style property syntax and library system.

#### 5. **Non-Coder Workflow** (Future)

Enable contributors without coding knowledge to:
1. Open flashcard builder interface
2. Browse style library with live previews
3. Select a style preset or customize one
4. Preview their card with the selected style
5. Save to YAML automatically with correct syntax

### Technical Implementation Considerations

**Files Involved:**
- `css/themes.css` - Style definitions
- `flashcards/flashcard-engine.js` - Style application logic
- YAML data files - Style references
- New: `styles-library.yml` or similar - Centralized style library
- New: Style browser UI (optional, future)

**Backward Compatibility:**
- Existing `theme: "blk-wht"` syntax should continue working
- Migrate existing themes to new library format
- Default styles for cards without explicit styling

**Style Properties to Support:**
- Text: color, shadow, weight, size (already dynamic), alignment
- Background: color, gradient, opacity
- Border: color, width, style
- Spacing: padding, margins
- Effects: shadows, blur, overlays

### Use Cases

**Scenario 1: Simple Quick Styling**
```yaml
- id: 105
  question: "Define osmosis"
  stylePreset: "clean-minimal"  # One line = styled card
```

**Scenario 2: Texture Backgrounds**
```yaml
- id: 106
  question: "What is Boyle's Law?"
  image: "textures/marble-light.jpg"
  textOverlay: true
  stylePreset: "dark-text-serif"  # Dark text works on light marble
```

**Scenario 3: Custom One-Off**
```yaml
- id: 107
  question: "Emergency concept"
  stylePreset: "emergency-red"
  styleOverrides:
    front:
      textColor: "#ffeb3b"  # Override just the text color
```

### Benefits

1. **Content Creators** - Easier to create visually consistent, beautiful cards
2. **Non-Technical Contributors** - Can style cards without touching CSS
3. **Maintainability** - Centralized style definitions, easier to update
4. **Consistency** - Reusable styles ensure visual coherence across deck
5. **Flexibility** - Total control when needed, quick presets when not
6. **Collaboration** - Style library can grow with community contributions

### Next Steps

1. **Design style property schema** - Finalize what properties are controllable
2. **Create style library format** - YAML/JSON structure for style definitions
3. **Update JavaScript** - Apply styles from YAML to cards dynamically
4. **Migrate existing themes** - Convert current themes to new library
5. **Build style browser** (optional, future) - Visual interface for non-coders
6. **Documentation** - Guide for creating and using styles

### Notes

- Details not yet finalized - this is a vision/direction document
- Implementation approach to be determined based on actual usage patterns
- May evolve as we understand what level of control is actually needed
- Consider starting simple and expanding based on real needs

---

## Footer on All Pages with Project Information

**Status:** Not yet implemented
**Location:** All HTML pages (consider adding to shared CSS/template)

### Description
Add a consistent footer to all pages containing information about the project, such as who created it, what it's for, contact information, or other relevant details.

### Expected Features
- **Consistent placement** across all pages (practicals, quizzes, flashcards, exams)
- **Minimal design** that doesn't distract from main content
- **Responsive** - works on mobile and desktop
- **Dark mode support**
- Could include:
  - Project purpose/description
  - Author/creator information
  - Contact or feedback information
  - Link to documentation or help
  - Version or last updated date
  - Copyright or license information

### Technical Considerations
- Add footer HTML to all page templates
- Create shared footer CSS in `css/shared.css` or similar
- Consider using a template/include system to avoid duplicating footer code across all files
- Should be sticky or fixed at bottom, or just flow naturally at end of page content
- Ensure it doesn't interfere with existing layouts or navigation

### Use Cases
- Provides context about what the project is
- Gives users a way to contact or provide feedback
- Professional appearance with proper attribution
- Helps distinguish this from official course materials if needed

### Implementation Priority
Low - Nice to have for polish and professionalism

---

## Midi Quizzes - 10 Question Practice Format

**Status:** Not yet implemented
**Location:** New feature - intermediate-length practice quiz

### Description
Create a "midi quiz" option that generates 10-question practice quizzes, sitting between the 4-question mini quizzes and the 40-question full practice practicals.

### Expected Features
- **10 questions** randomly selected from chosen tags
- Same tag-based selection interface as mini quiz builder
- Same layout and functionality as mini/full practicals
- "New Random Quiz" button to regenerate with same tags
- "Change Topics" button to return to tag selection
- Shareable URLs with tag parameters
- Full dark mode support
- Smart grading with partial credit

### Rationale
- **Mini quizzes (4 questions)**: Very quick review, good for targeted practice
- **Midi quizzes (10 questions)**: More comprehensive practice without full commitment
- **Full practicals (40 questions)**: Complete exam simulation

### Use Cases
- Longer practice session without the time commitment of 40 questions
- Better statistical representation of knowledge across topics
- Study sessions when you have 10-15 minutes available
- More thorough review of specific tag combinations
- Intermediate difficulty for building confidence

### Technical Considerations
- Could be same file as mini quiz builder with configurable question count
- Or separate file (`midi-quiz-builder.html`) for clarity
- Reuse all existing quiz infrastructure (grading, modal, keyboard navigation)
- May need adjusted layout for 10 questions (possibly 5x2 grid)

### Implementation Priority
Low - Nice to have, but mini and full practicals already cover the use cases

---

## Wider Input Boxes and Consistent Column Layout for Quizzes

**Status:** Not yet implemented
**Location:** Practice practicals and mini quiz builder (shared CSS)

### Description
Improve the user experience by making answer input boxes wider and ensuring consistent question ordering across mini quizzes and practice practicals.

### Expected Changes

**1. Wider Input Boxes**
- Increase width of answer input fields for better readability and easier typing
- Apply consistently across:
  - Practice practicals (`unit1-practical.html`, `unit2-practical.html`, `unit2-part2-practical.html`)
  - Mini quiz builder (`mini-quiz-builder.html`)
- Use shared CSS to ensure consistency

**2. Consistent Two-Column Layout**
- Mini quizzes currently read left-to-right (questions 1, 2 in first row; 3, 4 in second row)
- Practice practicals read top-to-bottom (questions 1, 2 in first column; 3, 4 in second column)
- **Change mini quiz to match practice practical layout**: Questions 1 and 2 in left column, questions 3 and 4 in right column
- Eliminates confusion from inconsistent layouts
- Makes mini quizzes feel like "mini practicals"

### Technical Considerations
- Create or update shared CSS file for consistent input styling
- Modify CSS grid/flexbox layout for mini quiz builder to use column-based ordering
- Ensure responsive design maintains readability on mobile devices
- Test that wider inputs don't break layout on smaller screens

### Use Cases
- Easier to type longer answers (vessel names, anatomical terms)
- Reduced confusion when switching between mini quizzes and practice practicals
- Consistent muscle memory for navigation patterns
- Better visual hierarchy and readability

### Implementation Priority
Low to Medium - Quality of life improvement that enhances consistency and usability

---

## Question Grouping for Practice Practicals

**Status:** Not yet implemented
**Location:** Practice practicals (e.g., `unit2-part2-practical.html`, `unit1-practical.html`)

### Description
Add the ability to group related questions together so they appear as a set in sequential order during practice practicals, even when questions are randomized. This is useful for multi-part questions that reference the same image or model with different labels (e.g., "What is structure X?", "What is structure Y?", "What is structure Z?").

### Expected Features
- **YAML configuration**: Define question groups with a `group` field
- **Preserve group order**: Questions within a group always appear in their original sequential order
- **Randomize groups**: Groups themselves can be randomized among other questions
- **Flexible grouping**: Works with any question types (image, text-only, etc.)
- **Backward compatible**: Questions without a group field work exactly as before

### Configuration Format
In the YAML file (e.g., `unit2-part2-practical.yml`):
```yaml
questions:
  - id: 64
    image: "practical-2-2/64.jpg"
    question: "What is the structure labeled X?"
    answer: ["hepatic portal vein"]
    group: "internal-organs-1"
    tags: ["blood-vessels", "vein", "models", "internal-organ-model"]

  - id: 65
    image: "practical-2-2/65.jpg"
    question: "What is the structure labeled Y?"
    answer: ["right renal vein"]
    group: "internal-organs-1"
    tags: ["blood-vessels", "vein", "models", "internal-organ-model"]

  - id: 66
    image: "practical-2-2/66.jpg"
    question: "What is the structure labeled Z?"
    answer: ["left renal artery"]
    group: "internal-organs-1"
    tags: ["blood-vessels", "artery", "models", "internal-organ-model"]
```

### How It Works
1. During question randomization, identify all questions with group identifiers
2. Keep grouped questions together as a single unit
3. Randomize the position of groups among individual questions
4. Within each group, preserve the original sequential order (64 → 65 → 66)
5. Ensures students see X, Y, Z in order, but the group can appear anywhere in the exam

### Use Cases
- **Multi-label images**: Same anatomical model with different structures labeled (X, Y, Z)
- **Sequential processes**: Questions that build on each other step-by-step
- **Comparative questions**: Questions that compare related structures
- **Case studies**: Multiple questions about the same clinical scenario

### Technical Considerations
- Modify practical JavaScript randomization logic to detect and handle groups
- Parse `group` field from YAML data
- Group questions by their group identifier before randomization
- Treat each group as a single unit during shuffle
- Maintain internal order within groups
- Ensure compatibility with existing features (tag balancing, etc.)

### Example Behavior
**Before grouping** (random order):
- Question 42: Right renal vein (standalone)
- Question 15: Internal iliac artery (standalone)
- Question 66: What is structure Z? (left renal artery)
- Question 8: Celiac trunk (standalone)
- Question 64: What is structure X? (hepatic portal vein)
- Question 23: Gastric artery (standalone)
- Question 65: What is structure Y? (right renal vein)

**After grouping** (X, Y, Z stay together in order):
- Question 42: Right renal vein (standalone)
- Question 15: Internal iliac artery (standalone)
- Question 64: What is structure X? (hepatic portal vein)
- Question 65: What is structure Y? (right renal vein)
- Question 66: What is structure Z? (left renal artery)
- Question 8: Celiac trunk (standalone)
- Question 23: Gastric artery (standalone)

### Implementation Priority
Medium - Would improve user experience for multi-part questions but not blocking current functionality.

---

## Pathway Validator: Improve Error Messages to Not Give Away Answers

**Status:** Not yet implemented
**Location:** Pathway validator (`js/pathway-validator.js`)

### Description
When students enter an incorrect vessel in a pathway, the error messages should guide them without explicitly telling them the correct answer. Currently, error messages can reveal the next vessel in the pathway, which reduces the learning opportunity.

### Current Behavior
Error messages suggest specific vessels to try next:
- "Try going through the [vessel name] next"
- This tells students exactly what vessel to add, rather than letting them figure it out

### Expected Behavior
Error messages should:
- Indicate that the connection is invalid without revealing the answer
- Provide directional/contextual hints (e.g., "You need another vessel to get to the destination")
- For arterial pathways (away from heart): Don't suggest going backwards
- For venous pathways (toward heart): Don't suggest going forward
- Distinguish between different error types:
  - **Wrong vessel entirely**: "That vessel doesn't connect to [current vessel]"
  - **Skipped a vessel**: "You skipped a vessel between [current] and [next]" (without naming it)
  - **Missing final vessel**: "You're close but haven't reached the destination yet"
  - **Wrong vessel type**: "That's a vein, not an artery" (already implemented)

### Example Scenarios

**Arterial pathway (heart → left foot):**
- Student enters: aorta → descending aorta → left common iliac → left external iliac → left femoral → left popliteal → (stops)
- Current message: "Try going through the left posterior tibial artery next"
- Better message: "You haven't reached the foot yet. You need at least one more vessel."

**Venous pathway (right hand → heart):**
- Student enters: right radial vein → right ulnar vein (wrong - skipped brachial)
- Current message: "You skipped right brachial vein"
- Better message: "There's a vessel between the radial vein and where you're going"

### Educational Benefits
- **Active learning**: Students must think through the pathway themselves
- **Problem-solving**: Encourages anatomical reasoning rather than rote memorization
- **Reduced cheating potential**: Can't just keep submitting until the error message tells you the answer
- **Better retention**: Students who figure it out themselves remember it better

### Technical Considerations
- Modify error message generation in `pathway-validator.js` lines 357-389
- Remove vessel name suggestions from error messages
- Keep directional hints (artery vs vein, toward vs away from heart)
- Consider adding a "Show Hint" button that students can optionally click for more specific guidance

### Implementation Priority
Medium - Improves learning outcomes but doesn't block functionality

---

## Pathway Questions in Practice Practicals with Auto-Grading

**Status:** Not yet implemented
**Location:** Practice practicals (e.g., `unit2-part2-practical.html`, `unit1-practical.html`)

### Description
Add pathway questions to practice practicals that use the same intelligent validation logic as the pathway mini quiz, but with a simpler comma-separated input format for students.

### Expected Features
- **Simple input**: Students type a comma-separated list of vessels (e.g., "aorta, brachiocephalic trunk, right subclavian artery")
- **Pathway mini quiz validation**: Reuse existing pathway validator logic
- **Smart grading**:
  - Fuzzy matching for typos (lose 0.5 points per misspelling)
  - Zero points if pathway is wrong (skipped vessel, incorrect connection, etc.)
  - Maximum 2 points total for extra credit pathway questions
- **Human-like feedback**: Clear, contextual error messages just like pathway mini quiz
- **Visual feedback**: Color-coded results showing which vessels were correct/typos/wrong

### Scoring Rules
- **2 points total** for extra credit pathway questions
- **-0.5 points** per misspelled vessel name (typo detection via fuzzy matching)
- **0 points** if pathway is fundamentally wrong:
  - Skipped a required vessel
  - Used incorrect vessel sequence
  - Wrong vessel type (artery vs vein)
  - Invalid connection

### Technical Considerations
- Reuse `js/pathway-validator.js` validation logic
- Parse comma-separated input into array of vessel names
- Apply same fuzzy matching and connection validation as pathway mini quiz
- Display results in answer sheet with color coding
- Store pathway question data in YAML with `type: "pathway"` field
- Questions marked as extra credit (2 points max)

### Use Cases
- Practice vessel pathways within the context of a full practical exam
- Get immediate feedback on pathway accuracy
- Partial credit for understanding the pathway despite typos
- Simpler input format than dynamic field addition (just type and go)

### Example Question in YAML
```yaml
- id: 200
  type: pathway
  question: "How would blood get from the heart to the right hand?"
  image: "practical/heart-to-hand.png"
  direction: arterial
  validStartVessels: ["aorta", "ascending aorta", "heart", "left ventricle"]
  validEndVessels: ["right radial artery", "right ulnar artery", "right hand"]
  points: 2
  extraCredit: true
```

---

## Mini Quizzes for Lecture Exam Material

**Status:** Not yet implemented
**Location:** New feature - lecture exam preparation

### Description
Create a mini quiz builder similar to the existing practical mini quiz system, but designed for lecture exam content (definitions, concepts, processes, etc.).

### Expected Features
- Tag-based quiz generation for lecture topics
- Multiple choice, fill-in-the-blank, or short answer formats
- 4-10 question quizzes for quick review sessions
- Smart grading with partial credit
- Shareable URLs with specific topic combinations
- Integration with existing mini quiz builder interface
- Mobile and desktop friendly

### Use Cases
- Quick review of specific lecture topics before exams
- Practice definitions and concepts
- Test understanding of physiological processes
- Share study quizzes with classmates
- Focused practice on weak areas

### Technical Considerations
- Extend existing mini quiz builder architecture
- YAML data format for lecture content
- Reuse existing grading and modal systems
- Tag system for organizing lecture topics (e.g., cardiac-cycle, blood-pressure, hemodynamics)

---

## Fill-in-the-Blanks Flowchart Practice

**Status:** Not yet implemented
**Location:** New feature for lecture exam preparation

### Description
Interactive flowchart practice where students fill in missing labels/terms on process diagrams (e.g., cardiac cycle, blood flow pathways, physiological processes).

### Expected Features
- Display flowcharts with blanks/gaps for key terms
- Click or tap to fill in answers
- Smart grading with partial credit for close answers
- Visual feedback showing correct/incorrect answers
- Review mode to see completed flowcharts
- Mobile and desktop friendly

### Use Cases
- Practice cardiac cycle step-by-step
- Learn blood flow pathways through chambers and vessels
- Study physiological processes with sequential steps
- Visual learning for process-oriented content on lecture exams

### Technical Considerations
- Could use SVG overlays or labeled images
- Similar grading system to practicals
- YAML data format for flowchart definitions

---

## Better Styling for Blank Answers in Answer Sheet

**Status:** Not yet implemented
**Location:** Practice practical answer sheet after submission

### Description
When a question is left blank (unanswered), the answer sheet should show the correct answer in a more subtle, helpful way.

### Expected Behavior
- Blank answers should display the correct answer in parentheses
- Text should be styled in gray to indicate it was not the student's answer
- Only show the first answer from the array (not all possible answers joined with "OR")

### Current Behavior
- Shows the full correct answer (all options with "OR") in the normal styling
- Doesn't visually distinguish that this was a blank/unanswered question

### Example
- Current: `Right ventricle OR Ventricle`
- Proposed: `(Right ventricle)` in gray text

---

## Refine Display of Correct Answers from Arrays in Quiz Results

**Status:** Not yet implemented
**Location:** Quiz results display in practice practicals and mini quiz builder

### Description
When showing correct answers that come from an array of acceptable answers, improve the display to be more readable and less cluttered than showing all options joined with "OR".

### Current Behavior
- Shows all acceptable answers joined with " OR " (e.g., "Right ventricle OR Ventricle")
- Can be cluttered when there are many acceptable variations
- Takes up significant space in results display

### Expected Behavior
- Show the most canonical/preferred answer (first in array) as the primary display
- Optionally indicate there are other acceptable answers without listing them all
- Cleaner, more readable results display
- Consider different formatting for:
  - Correct answers: Show primary answer
  - Incorrect answers: Show primary answer (what they should have written)
  - Blank answers: Show primary answer in gray/parentheses

### Potential Approaches
1. **Simple**: Just show first answer from array
2. **Informative**: Show first answer with indicator like "(or similar)"
3. **Expandable**: Show first answer with "+" to expand and see all options
4. **Context-aware**: Show the answer closest to what student wrote (if incorrect)

### Use Cases
- Cleaner answer sheets after quiz submission
- More focused feedback on what the canonical answer is
- Less visual clutter when reviewing results
- Still maintains flexibility of accepting multiple answer variations

---

## Alphabetical Tag Ordering in Custom Flashcard Deck Builder

**Status:** Not yet implemented
**Location:** Custom flashcard deck builder

### Description
When building a custom flashcard deck, the tags should be displayed in alphabetical order to make it easier to find and select specific tags.

### Expected Behavior
- Tags appear in alphabetical order (A-Z)
- Easier to scan and find specific topics

### Current Behavior
- Tags appear in whatever order they're encountered in the data
- No particular sorting applied


---

## Refactor index.html JavaScript to External File

**Status:** Not yet implemented
**Location:** `index.html`

### Description
The JavaScript code in index.html for progress tracking and section sorting is currently inline in the HTML file. This makes the file harder to read and maintain. The JavaScript should be moved to a separate `.js` file.

### Expected Changes
- Move all `<script>` content from `index.html` to a new file (e.g., `js/index.js`)
- Link the external script file in `index.html`
- Ensure all functionality continues to work (localStorage, sorting, checkboxes)
- Cleaner separation of concerns (HTML structure vs. JavaScript behavior)

### Technical Considerations
- Maintain all existing functionality (progress tracking, section sorting, "Up Next" heading)
- Ensure proper loading order (script should load after DOM elements are ready)
- Consider using `defer` or `DOMContentLoaded` event listener
- Update any hardcoded references if needed

### Implementation Priority
Low - Code organization improvement, not affecting functionality

---

## Load index.html Content from YAML Configuration

**Status:** Not yet implemented
**Location:** `index.html`

### Description
The course sections (exams, practicals, flashcards) in index.html are currently hardcoded in the HTML. This content should be loaded from a YAML configuration file to make it easier to add, remove, or modify course sections without editing HTML.

### Expected Changes
- Create a YAML config file (e.g., `data/course-structure.yml`)
- Define all course sections in YAML format
- JavaScript loads YAML and dynamically generates section HTML
- Remove hardcoded section HTML from index.html

### YAML Structure Example
```yaml
sections:
  - id: practical-1
    order: 1
    title: "Cells & Tissues"
    links:
      - text: "Practice Practical #1"
        icon: "📋"
        url: "unit1-practical.html"
      - text: "Flashcards"
        icon: "📚"
        url: "unit1-flashcards.html"

  - id: exam-2
    order: 2
    title: "Blood, Heart, and Blood Vessels"
    links:
      - text: "Exam 2 Practice Test"
        icon: "📝"
        url: "exam-template.html?exam=unit2-exam"
      - text: "Practice Practical #2"
        icon: "📋"
        url: "unit2-practical.html"
      - text: "Practice Practical #3"
        icon: "📋"
        url: "unit2-part2-practical.html"
      - text: "Flashcards"
        icon: "📚"
        url: "unit2-flashcards.html"
```

### Benefits
- Easier to maintain course structure
- Add/remove/reorder sections without touching HTML
- Consistent data format across the project
- Could enable dynamic course configuration for different semesters
- Simpler for non-technical users to update content

### Technical Considerations
- Use js-yaml library (already used elsewhere in project)
- JavaScript generates section HTML on page load
- Preserve existing progress tracking and sorting functionality
- Ensure proper loading order (YAML loads before rendering)
- Maintain current styling and layout

### Implementation Priority
Low-Medium - Improves maintainability but requires refactoring

---

# Known Bugs (Detailed)

## Flashcard Flip Animation Regression - Regular Image Cards

**Status:** ❌ VOID - Not a real bug, Firefox/Safari emulation artifact
**Date Reported:** October 28, 2025
**Date Resolved:** October 28, 2025
**Location:** `flashcards/flashcard-engine.js`, `flashcards/flashcard-styles.css`

### Resolution

This was **not a real regression**. The perceived glitches were artifacts of testing in Firefox desktop with mobile emulation, not actual issues on real mobile devices.

**Root Cause:** Firefox desktop rendering of CSS 3D transforms differs significantly from actual mobile Safari/Chrome. Desktop browsers emulating mobile viewport sizes do not replicate the actual mobile rendering pipeline, particularly for `backface-visibility`, z-index layering, and hardware-accelerated 3D transforms.

**Actual Status:** Flashcards work correctly on real mobile devices (iOS Safari, Android Chrome). The CSS z-index fix from October 27 is functioning as intended for the target platform.

### Original Report (Void)

Regular image flashcards (vessel photos with text below) appeared to show flip animation glitches where the image and/or text from the front side showed through during the flip from back to front when tested in Firefox desktop with mobile emulation.

### Timeline of Regression

**October 27, 2025 (late afternoon):**
- Image cards worked correctly with smooth flip animations
- CSS z-index fix (lines 188-215 in flashcard-styles.css) was handling flip visibility
- Code only explicitly handled text overlay cards, regular images relied on CSS

**October 28, 2025 (today):**
- Attempted to add separate handling for regular image cards vs text overlay cards
- Multiple attempted fixes using opacity manipulation
- Each attempt made the glitching worse
- Code now partially reverted but glitches remain

### Current Behavior

When flipping from back (definition) to front (image + text):
- Image and/or text from the front side become visible before/during the flip animation
- Content "shows through" the back side during rotation
- Glitchy, unprofessional appearance
- Similar to the original bug from October 27 morning before the CSS z-index fix

### What Was Working Yesterday

**Commit a4c1d28** ("fixed another glitch (maybe the last one?)")
```javascript
// Flip back to show term
if (overlay) {
    overlay.style.display = '';
}
cardElement.classList.remove('flipped');
```

This simple code worked because:
- Text overlays were handled explicitly (show immediately)
- Regular images relied on CSS z-index layering (lines 188-215)
- No opacity manipulation

### Suspected Root Cause

**Theory:** When we added text overlay card support, something in the HTML structure or CSS cascade changed that broke the z-index fix for regular image cards.

**What Changed:**
1. Text overlay rendering adds `.has-text-overlay` class to image container
2. Text overlay creates `.question-text-overlay` element with absolute positioning
3. These changes may have altered the stacking context or CSS specificity in a way that broke the existing z-index fix for regular images

**CSS z-index fix (still present in flashcard-styles.css lines 188-215):**
```css
.flip-card-front {
    z-index: 2;  /* Front on top by default */
}

.flip-card-back {
    z-index: 1;
}

.flip-card.flipped .flip-card-back {
    z-index: 2;  /* Back on top when flipped */
}

.flip-card.flipped .flip-card-front {
    z-index: 1;
}
```

This CSS should prevent images from showing through, but it's not working.

### Failed Fix Attempts (October 28, 2025)

**Attempt 1: Hide/show image and text with opacity**
- Set image and text to `opacity: 0` before flip
- Show at 300ms (halfway through flip)
- Result: Blank front face, then content pops in

**Attempt 2: Show earlier (200ms delay)**
- Result: Content still showed through during rotation

**Attempt 3: Show after flip completes (600ms delay)**
- Result: Long blank period on front face

**Current State:**
Code partially reverted to simple approach (only handle text overlays), but glitches persist.

### What Works vs What Doesn't

**✓ Text Overlay Cards (gradients with text like "Boyle's Law"):**
- Show text immediately when flipping back
- Smooth rotation, no pop-in effect
- Working correctly

**✗ Regular Image Cards (vessel photos with text below):**
- Image and/or text showing through during flip
- Glitchy appearance
- Broken

**✓ Text-Only Cards (no image):**
- Appear to work correctly

### Affected Files

**JavaScript:**
- `flashcards/flashcard-engine.js`
  - Lines 609-624: `flipCard()` function - flip back to front logic
  - Lines 442-538: `showCard()` function - card rendering

**CSS:**
- `flashcards/flashcard-styles.css`
  - Lines 188-215: Z-index layering for flip faces
  - Lines 91-140: Image container and text overlay styles

**HTML:**
- `flashcards/flashcard-template.html` - Flip card structure

### Testing Requirements

- Test on iOS Safari (primary use case - mobile)
- Test on Android Chrome
- Test on desktop browsers
- Test regular image cards specifically (vessel photos)
- Test text overlay cards (should continue working)
- Test rapid flipping (back and forth repeatedly)

### Debugging Approach Needed

1. **Verify CSS z-index is actually being applied**
   - Use browser dev tools to inspect computed z-index values during flip
   - Check if stacking context is being created correctly

2. **Check if text overlay changes broke CSS specificity**
   - Compare DOM structure with/without `.has-text-overlay` class
   - Verify z-index rules aren't being overridden

3. **Consider browser-specific issues**
   - Mobile Safari handles 3D transforms and backface-visibility differently
   - May need mobile-specific fixes

4. **Test in isolation**
   - Create minimal test case with just flip animation
   - Add back features one at a time to identify what breaks it

### User Impact

- **Priority:** HIGH
- **Severity:** High - Creates unprofessional, glitchy user experience
- **Frequency:** Every flip on regular image flashcards
- **User Experience:** Frustrating, distracting, breaks immersion
- **Platforms Affected:** All platforms, especially mobile (primary use case)
- **Workaround:** None - flashcards are unusable for studying

### Notes

- This is a regression of the bug fixed on October 27, 2025
- The original fix worked by relying on CSS z-index layering
- Something changed when we added text overlay support that broke the CSS fix
- Multiple attempts to fix with JavaScript opacity manipulation made it worse
- Need to understand WHY the CSS fix stopped working, not just add more JavaScript hacks

---

## Pathway Quiz Corrections Still Give Away Answers

**Status:** Not yet fixed
**Location:** Pathway validator (`js/pathway-validator.js`)

### Description
The error/correction messages in the pathway mini quiz still reveal too much information and give away the correct answers. While improvements have been made, further refinement is needed to provide helpful guidance without telling students exactly what vessel to add next.

### Current Behavior
- Messages still suggest specific vessels or reveal the correct path
- Students can use the feedback to figure out answers without thinking through the anatomy
- Reduces the learning opportunity
- **Example:** If the last vessel is left off, the error says "Should end with: inferior vena cava OR heart OR right atrium" instead of something like "A vessel is missing, blood still hasn't made it to the heart"

### Expected Behavior
- Messages should indicate an error without revealing the specific vessel needed
- Provide directional hints (e.g., "you're missing a vessel" rather than "you skipped the femoral artery")
- Maintain educational value by requiring students to think through the pathway themselves

### Technical Considerations
- This is an iterative refinement process with lots of edge cases to test
- Need to balance helpful feedback with not giving away answers
- May require multiple rounds of testing and adjustment

### Implementation Priority
Medium - Improves learning outcomes significantly

---

## Answer Inputs Not Disabled After Practical Submission

**Status:** Not yet fixed
**Location:** Practice practicals (e.g., `unit2-part2-practical.html`, `unit1-practical.html`)

### Description
After submitting and grading a practice practical, students can still type into the answer input fields. The inputs should be disabled/locked after submission to prevent confusion and accidental edits.

### Current Behavior
- Student submits practical and receives grading/results
- Answer input fields remain editable
- Student can type new answers into graded fields
- No visual indication that the practical has been submitted and shouldn't be edited
- Could cause confusion about whether changes will be re-graded

### Expected Behavior
- After clicking "Submit Practical", all answer input fields should become read-only/disabled
- Inputs should have visual styling indicating they are locked (e.g., grayed out, different background)
- Students should not be able to modify their answers after submission
- Clear visual distinction between "taking the quiz" and "reviewing results" states

### Technical Considerations
- Add `readonly` or `disabled` attribute to all answer inputs after submission
- Update CSS to show locked state (already exists: `.answer-item input[readonly]` styling)
- May need to disable both regular answer inputs and extra credit inputs
- Consider whether students should be able to "retake" the practical (clear answers and start fresh)

### Possible Solutions
1. **Simple readonly**: Set `readonly` attribute on all inputs during `submitPractical()` function
2. **Full disable**: Set `disabled` attribute (prevents focus entirely)
3. **Add "Retake" button**: Allow students to clear all answers and start over if desired

### User Impact
- **Priority**: Medium - Not breaking functionality but creates confusion
- **Frequency**: Happens on every practical submission
- **User Experience**: Confusing - unclear whether editing answers will re-grade or if changes are lost

### Location in Code
- Main submission logic likely in practical HTML files (`unit2-part2-practical.html`, etc.)
- Look for `submitPractical()` or similar function
- Answer inputs have class `.answer-item input` and names like `answer1`, `answer2`, etc.

---

## Light/Dark Mode Button Covers Page Title

**Status:** Not yet fixed
**Location:** Pages with dark mode toggle button

### Description
The light mode/dark mode toggle button overlaps and covers the page title, especially on mobile devices.

### Current Behavior
- Toggle button positioned in a way that overlaps page title
- Makes title difficult or impossible to read
- Particularly problematic on smaller screens

### Expected Behavior
- Toggle button should be positioned to avoid overlapping any content
- All page elements should be clearly visible
- Responsive positioning that works on all screen sizes

---

## Theme Lab File Not Responsive and Doesn't Show Real Usage

**Status:** Not yet fixed
**Location:** Theme lab/preview page

### Description
The theme lab file used for previewing text-only question themes is not mobile responsive and doesn't accurately represent how themes appear in actual use cases (flashcards, practice questions).

### Current Behavior
- Theme preview doesn't work well on mobile devices
- Preview boxes don't match the real-world presentation of flashcards or practice questions
- Users can't accurately preview how themes will look when actually studying

### Expected Behavior
- Mobile responsive design for theme preview
- Show themes applied to actual flashcard and practice question layouts
- Give users accurate representation of how their theme selections will appear during study sessions

---

## Results Modal Shows Text-Only Questions Larger Than Image Questions

**Status:** ✅ FIXED (October 2025)
**Location:** Practice practicals - answer review modal, flashcards

### Description
Text-only questions displayed at inconsistent sizes compared to image-based questions in modals and flashcards.

### Solution Implemented
Converted text-only questions to use text overlay approach:
- Questions now use gradient background images (1024x768)
- Text positioned absolutely over the image background
- All questions now use identical image containers
- Eliminates size inconsistencies between question types

### YAML Format
```yaml
- id: 42
  image: "gradients/02.jpg"
  question: "What is the mitral valve also known as?"
  answer: ["bicuspid valve"]
  textOverlay: true
```

### Technical Implementation
- CSS: `.question-text-overlay` with absolute positioning and text shadow
- JavaScript: Detects `textOverlay: true` flag and renders text over image
- Dynamic font sizing adjusts based on text length (3rem for short questions, 1.5rem for long)
- Text width set to 80% of container for readability

### Files Updated
- `flashcards/flashcard-engine.js` - Text overlay rendering and dynamic font sizing
- `css/themes.css` - Text overlay styles
- Data files using `textOverlay: true` flag

### Result
Consistent sizing across all question types in modals and flashcards.

---

## Inconsistent "(blank)" Display in Answer Modal

**Status:** Not yet fixed
**Location:** `unit2-part2-practical.html` - answer review popup modal

### Description
When reviewing results after submitting a practical, the popup modal sometimes shows "(blank)" for unanswered questions and sometimes doesn't display it, even though the question was left blank.

### Known Conditions
- The issue appears to occur specifically when the user has clicked/focused into an answer field but left it empty
- Questions that were never focused seem to consistently show "(blank)"

### Technical Details
The display logic is in the `showModalAtIndex()` function around line 1237:
```javascript
const displayStudentAnswer = (resultType === 'unanswered' || !studentAnswer) ? '(blank)' : studentAnswer;
```

The grading results are stored in `question.gradingResult` during `submitPractical()` around line 818-823:
```javascript
question.gradingResult = {
    studentAnswer: studentAnswer,
    resultType: answerResult.isCorrect ? 'correct' :
               answerResult.isPartial ? 'partial' :
               (studentAnswer && studentAnswer.trim() !== '') ? 'incorrect' : 'unanswered'
};
```

### Attempted Fixes (All Failed)
1. **Updated `resultType` determination to explicitly check for empty strings after trimming**
   - Changed: `studentAnswer ? 'incorrect' : 'unanswered'`
   - To: `(studentAnswer && studentAnswer.trim() !== '') ? 'incorrect' : 'unanswered'`
   - Result: Did not fix the issue

2. **Changed display logic to show "(blank)" if either condition is true**
   - Changed: `resultType === 'unanswered' && !studentAnswer ? '(blank)' : studentAnswer`
   - To: `(resultType === 'unanswered' || !studentAnswer) ? '(blank)' : studentAnswer`
   - Result: Did not fix the issue

3. **Added grading results storage directly on question objects**
   - Previously relied on DOM parsing with selectors like `.answer-item:nth-child(${modalQuestion.questionNum})`
   - Now stores `question.gradingResult = { studentAnswer, resultType }` during grading
   - Changed `getQuestionData()` to use stored results instead of DOM parsing
   - Result: Fixed some inconsistencies but not the blank answer display issue

### Next Steps to Try
- Add console logging to track what `studentAnswer` and `resultType` values are being stored and retrieved
- Verify that `getQuestionData()` is consistently finding the `gradingResult` object
- Check if there's a race condition or timing issue with when grading results are stored vs. when popups are opened
- Consider forcing all empty answers to explicitly store empty string `''` with `resultType: 'unanswered'`

### Reproduction
1. Start a practical
2. Click into some answer fields and leave them blank (don't type anything)
3. Leave other answer fields completely untouched
4. Submit the practical
5. Click on the blank answers in the results to open the review popup
6. Observe that some show "(blank)" and others don't

---

## Flashcard Image Flash During Flip Animation on Mobile

**Status:** ✅ FIXED (October 2025)
**Location:** Flashcards (`flashcards/flashcard-engine.js`, `flashcards/flashcard-styles.css`)

### Description
When using flashcards on mobile (phone), there are visual glitches during the flip animation, particularly when flipping from the back (definition side) to the front (image/question side).

**User Report (Oct 2025):** Image disappears too fast before the flip animation completes. The "squished" rotation animation that should occur during the flip appears to have been lost during refactoring - the card content changes instantly rather than smoothly rotating/flipping.

### Solution Implemented
Fixed the flip animation by:
1. **Delayed text overlay timing** - Text overlays now wait 300ms before appearing when flipping back to front
2. **Z-index control** - Added dynamic z-index switching to ensure the correct face stays visible during rotation
3. **Removed opacity interference** - Let natural CSS 3D transforms and backface-visibility handle the rotation

### Technical Changes
- `flashcard-engine.js` lines 610-616: Added setTimeout to delay text overlay display when flipping back to front
- `flashcard-styles.css` lines 188-215: Added z-index rules to keep back face on top when flipped, front face on top when not flipped
- Result: Smooth 3D flip animation visible on mobile with no image flash

### Primary Issue: Image Flash Before Flip Completes (FIXED)
**Symptom:** When flipping from back to front, the image (which should only be visible on the front) appears for a split second before the flip animation begins.

**Current Behavior:**
1. User is viewing the back of the card (showing definition)
2. User taps/clicks to flip back to the front
3. **BUG:** Image from the front face flashes into view immediately
4. Flip animation then begins and completes
5. Front of card displays properly

**Expected Behavior:**
1. User is viewing the back of the card
2. User taps/clicks to flip
3. Flip animation begins immediately with no image flash
4. Front face becomes visible only as the card rotates
5. Image appears smoothly as part of the flip

### Technical Analysis

**Root Cause:**
The issue is in the `flipCard()` function (`flashcard-engine.js` lines 586-618) and CSS styling:

```javascript
// Flip back to show term
cardElement.classList.remove('flipped');
showingDefinition = false;

// Show text overlay immediately when flipping back to front
if (overlay) {
    overlay.style.display = '';
}
```

When `flipped` class is removed, the CSS rule that hides the front face is immediately removed:
```css
/* flashcard-styles.css lines 188-192 */
.flip-card.flipped .flip-card-front {
    opacity: 0;
    pointer-events: none;
}
```

The front face becomes visible (opacity: 1) **instantly**, but the CSS transform animation takes 0.6 seconds to complete. This creates a mismatch where the content is visible before the visual rotation is complete, causing the flash.

**Related Code Locations:**
- **Flip logic**: `flashcard-engine.js` lines 586-618 (`flipCard()`)
- **CSS hiding rule**: `flashcard-styles.css` lines 188-192
- **Flip animation**: `flashcard-styles.css` lines 162-173
- **Text overlay timing**: `flashcard-engine.js` lines 595-613

### Additional Potential Issues Found

**1. Text Overlay "Wink" Effect**
The code addresses a "wink" effect for text overlays:
```javascript
// Hide text overlay after flip animation completes (0.6s transition)
// This prevents the "wink" effect where text disappears before card flips
if (overlay) {
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 300); // Hide halfway through the 0.6s flip animation
}
```

This suggests there's already awareness of timing issues between content visibility and animation.

**2. Image Preloading Flash**
When advancing to a new card with `swipeLeft()` or `swipeRight()`, there's logic to prevent image flashing:
```javascript
setTimeout(() => {
    // Set placeholder image FIRST to prevent flash of old image
    const termImage = document.getElementById('term-image');
    const loadingOverlay = document.getElementById('image-loading-overlay');
    termImage.src = '../images/0.jpg';
    loadingOverlay.style.display = 'block';
    ...
}, 400);
```

However, this only addresses flashing during card transitions, not during flip animations.

**3. Mobile Safari Specific Behavior**
The CSS includes a comment about Mobile Safari requiring specific fixes:
```css
/* Ensure front face is completely hidden when flipped (fix for mobile Safari) */
```

Mobile browsers (especially Safari) handle CSS 3D transforms and backface-visibility differently than desktop, which likely contributes to these issues.

### Proposed Solutions

**Option 1: Delay Opacity Change**
Coordinate the opacity change with the flip animation by using CSS transitions on opacity that match the rotation duration:

```css
.flip-card-front {
    transition: opacity 0.6s, transform 0.6s;
}

.flip-card.flipped .flip-card-front {
    opacity: 0;
    transition-delay: 0s; /* Fade out immediately when flipping to back */
}

.flip-card:not(.flipped) .flip-card-front {
    opacity: 1;
    transition-delay: 0.3s; /* Delay fade-in until halfway through flip back */
}
```

**Option 2: JavaScript-Controlled Timing**
Add a class that controls visibility separately from the flip state:
```javascript
cardElement.classList.add('hiding-front');
setTimeout(() => {
    cardElement.classList.remove('flipped');
}, 50);
setTimeout(() => {
    cardElement.classList.remove('hiding-front');
}, 300);
```

**Option 3: Force Z-Index During Animation**
Ensure the back face stays visually "on top" during the flip-back animation using z-index manipulation.

### Testing Requirements
- Test on iOS Safari (iPhone)
- Test on Android Chrome
- Test on various screen sizes
- Test rapid flipping (flip forward then immediately flip back)
- Test with both image cards and text-only cards
- Test with text overlay cards

### User Impact
- **Severity:** Medium - Doesn't break functionality but creates jarring visual experience
- **Frequency:** Occurs every time user flips from back to front on mobile
- **User Experience:** Distracting and unprofessional, breaks the smooth interaction pattern
- **Platforms Affected:** Primarily mobile (especially iOS Safari)

### Implementation Priority
Medium - Affects mobile UX significantly and mobile is a primary use case for flashcards

---

## Text Overlay Questions Spacing Mismatch in Mini Quiz Builder

**Status:** Not yet fixed
**Location:** Mini quiz builder (`mini-quiz-builder.html`), Practice practicals
**Date Identified:** October 2025

### Description
When displaying text-overlay questions (questions with `textOverlay: true` that show text centered on a background image), there's a slight spacing mismatch that causes the answer box to "jump" vertically when navigating between text-overlay questions and regular image-based questions.

### Current Behavior
- Text-overlay questions display correctly with text centered on the image
- However, the spacing below the image doesn't match the spacing used by regular image-based questions
- When navigating from a regular image question (with text below the image) to a text-overlay question (with text on the image), the answer box jumps down slightly
- This creates a jarring visual experience during navigation

### Expected Behavior
- The answer box should remain at the same vertical position when navigating between all question types
- Spacing should be consistent whether text appears below the image or overlaid on it
- Smooth navigation with no visual "jumps"

### Root Cause Analysis

**The Problem:**
Text-overlay questions position the question text absolutely over the image. This removes the text from the document flow, so no space is reserved where the text would normally appear (below the image). Regular image questions have text that flows naturally below the image, taking up vertical space.

**Visual Comparison:**
```
Regular Image Question:          Text Overlay Question:
┌─────────────────┐             ┌─────────────────┐
│                 │             │   Question      │  ← Text positioned absolutely
│     Image       │             │   Text Here     │     over the image
│                 │             │                 │
└─────────────────┘             └─────────────────┘
Question text here              (no text here - absolute positioned)
↓ Answer box                    ↓ Answer box (jumps up due to missing space)
```

### Attempted Solutions (All Failed)

**Strategy: Add a spacer element to maintain layout flow**

The approach was to insert a placeholder element that reserves the same vertical space that question text normally occupies, so the answer box stays in the same position.

**Attempt 1: CSS ::after pseudo-element with fixed height**
- Added `.text-overlay-spacer::after` with `height: 2.5rem`
- **Result:** Space was too large, answer box jumped down instead of staying level

**Attempt 2: CSS ::after with zero-width space character (`\200B`)**
- Used zero-width space to establish line height naturally
- **Result:** No visible space created, didn't work at all

**Attempt 3: CSS ::after with invisible text character**
- Used single character 'X' with `visibility: hidden`
- **Result:** Still too much or too little space, not matching exactly

**Attempt 4: CSS ::after with transparent text**
- Used text "Placeholder" with `color: transparent`
- Matched font-size (1.1rem), font-weight (500), margin-top (12px)
- **Result:** Still didn't match - answer box still jumping slightly

**Why Attempts Failed:**
The approaches all tried to replicate the dimensions of `.question-text` but couldn't account for:
- Browser default line-height calculations
- Sub-pixel rendering differences
- Exact box model of the actual text element with its specific content
- Possible inherited styles or browser quirks

### Better Solution Approaches

**Option 1: Use actual text content as spacer**
Instead of trying to fake the height with invisible characters or empty space:
- Insert the actual question text into the spacer element
- Make it invisible with `visibility: hidden` or `color: transparent`
- This guarantees exact height match since it's the same content with same styles
- **Pros:** Should match exactly, uses browser's natural text rendering
- **Cons:** Duplicates question text in the DOM (once in overlay, once in spacer)

**Option 2: Keep question-text in flow but visually position overlay**
- Don't remove `.question-text` from document flow
- Keep it in its normal position below image (invisible)
- Position the text overlay absolutely, but relative to the image container, not the question-text
- **Pros:** Natural spacing preserved, no need for spacer tricks
- **Cons:** Requires restructuring the HTML/CSS positioning context

**Option 3: Use JavaScript to measure and match**
- After rendering, measure the actual height of `.question-text` on a regular question
- Programmatically set the spacer height to match exactly
- **Pros:** Guaranteed pixel-perfect match
- **Cons:** Adds JavaScript complexity, may cause flash/reflow

**Option 4: Fixed height for all question areas**
- Set a fixed height for the area where question text appears (both below and on images)
- All questions reserve the same vertical space whether text is used or not
- **Pros:** Simple, consistent, no jumps ever
- **Cons:** Wastes vertical space on text-overlay questions, may not look as clean

### Recommended Next Steps

1. **Try Option 2** (restructure positioning context)
   - This is the most architecturally sound solution
   - Keeps natural document flow while achieving the overlay effect
   - May require refactoring CSS but results in cleaner code

2. **If Option 2 is too complex, try Option 1** (duplicate actual text)
   - Quick fix that should work reliably
   - Trade-off: DOM duplication vs. clean code

3. **If all else fails, use Option 4** (fixed height)
   - Guaranteed to work, simple implementation
   - Trade-off: some wasted space vs. perfect alignment

### Files Involved
- `mini-quiz-builder.html` (lines 688-732) - Question rendering logic
- `js/question-renderer.js` (lines 37-80) - Shared question rendering
- `css/practical.css` (lines 146-186) - Question text and spacer styles
- `css/themes.css` (lines 91-113) - Text overlay positioning styles

### Technical Implementation Notes

**Current Code Structure:**
```javascript
// When textOverlay is true:
imageContainer.classList.add('has-text-overlay');
questionTextElement.innerHTML = `<div class="question-text-overlay">${question.question}</div>`;

// Spacer added to maintain layout:
let spacer = document.createElement('div');
spacer.className = 'text-overlay-spacer';
questionTextElement.parentNode.insertBefore(spacer, questionTextElement.nextSibling);
```

**Current CSS:**
```css
.image-container.has-text-overlay .question-text {
    position: absolute;  /* Removes from flow */
    top: 0;
    left: 0;
    right: 0;
    height: 450px;
    margin: 0;
    pointer-events: none;
}

.text-overlay-spacer {
    margin-top: 12px;
    font-size: 1.1rem;
    font-weight: 500;
    color: transparent;
}
```

### User Impact
- **Severity:** Low - Visual annoyance but doesn't break functionality
- **Frequency:** Occurs on every navigation to/from text-overlay questions
- **User Experience:** Minor jarring effect, slightly unprofessional appearance
- **Platforms Affected:** All platforms (desktop and mobile)

### Implementation Priority
Low-Medium - Quality of life improvement, not critical but noticeable

---
