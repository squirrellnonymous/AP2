# Features and Bugs

## Project Structure Notes

### Active Files
- **Practice Practicals**: Current upcoming practical is `unit2-part2-practical.html` (multiple practicals share the same logic/architecture)
- **Flashcards**: Main flashcard system and deck builder

### Legacy/Deprecated Files
- **exam1-practice.html** and related `exam1-*` files: OLD implementations that should not be used or referenced. These are kept for historical reference only but are not actively maintained.
- **flashcards-prototype.html**: OLD prototype version of flashcards. Use the main flashcard system instead.

---

# Feature Requests

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

## Tag Balancing for Practice Practicals

**Status:** Not yet implemented
**Location:** Practice practicals (e.g., `unit2-part2-practical.html`, `unit1-practical.html`)

### Description
Add configurable tag balancing to practice practicals so that randomly selected questions can be automatically balanced across specified tag pairs (e.g., equal numbers of artery and vein questions).

### Expected Features
- **Configurable in YAML**: Enable/disable balancing and define which tag pairs to balance
- **Flexible design**: Not hardcoded to specific tags - works for any tag pair defined in config
- **Automatic balancing**: After randomly selecting questions, swap some out to achieve roughly 50/50 balance
- **Allows variance**: Can be off-balance by one question (e.g., 20 arteries, 19 veins is acceptable)
- **Preserves non-tagged questions**: Questions without either tag in the pair remain in the pool

### Configuration Format
In the YAML file (e.g., `unit2-part2-practical.yml`):
```yaml
balance_tags: true
balanced_tag_pairs:
  - ["artery", "vein"]
```

### How It Works
1. Randomly select 40 questions from the full pool
2. Count questions with each tag in the balanced pairs
3. If imbalanced (e.g., 22 arteries, 13 veins), swap out extras for the underrepresented tag
4. Final result: roughly equal distribution (allowing ±1 difference)

### Use Cases
- Ensure balanced practice between arteries and veins for vessel practicals
- Future flexibility for other tag pair balancing (e.g., "anterior" vs "posterior")
- Better represent real exam distributions
- More comprehensive practice coverage

### Technical Considerations
- Parse `balance_tags` and `balanced_tag_pairs` from YAML config
- Implement balancing algorithm after random selection
- Track available questions by tag for swapping
- Maintain randomness while achieving balance

### Implementation Plan
- **First implementation**: Balance "artery" and "vein" tags for `unit2-part2-practical.html`
- Add config to `unit2-part2-practical.yml`
- Test with existing vessel questions to ensure proper balancing
- Once working, can be extended to other practicals as needed

---

## Share Deck Button on Flashcard Results Screen

**Status:** 🚧 In Progress
**Location:** Flashcard results screen (`flashcards/flashcard-template.html`, `flashcards/flashcard-engine.js`)

### Description
When users finish a flashcard deck, they should see a "Share this deck" button that allows them to easily share the specific deck with classmates.

### Implemented Features
- "Share this deck" button added to results screen
- Native share API integration for mobile devices (iOS/Android share sheet)
- Clipboard fallback for desktop browsers
- Visual feedback: Button shows "Link copied!" with green background for 2 seconds
- Shares the full URL with all parameters (tags, source) so recipients get the exact same deck
- Share message includes deck title

### How It Works
- **Mobile:** Opens native share sheet to share via messaging apps, social media, etc.
- **Desktop:** Copies URL to clipboard and shows confirmation
- Shared URL includes all query parameters for exact deck replication

### Next Steps
- Test on various mobile devices and browsers
- Verify Open Graph preview images display correctly in share messages
- Consider adding share analytics if needed

### Use Cases
- Share study decks with classmates
- Send specific tag combinations to study groups
- Quick way to distribute focused review sets
- Help others access the same flashcard content

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

## Update unit2-practical.html with Latest Refactoring

**Status:** Not yet implemented
**Location:** `unit2-practical.html`

### Description
Ensure `unit2-practical.html` is updated with the latest refactoring and improvements from `unit2-part2-practical.html`, including the shared modal system and other architectural improvements.

### Technical Considerations
- Apply shared modal system (`js/question-modal.js`)
- Ensure consistent grading logic and keyboard navigation
- Verify dark mode support
- Check that all recent bug fixes are applied

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

## Timer for Practice Lecture Exams

**Status:** Not yet implemented
**Location:** Practice lecture exam features (mini quizzes, future flowchart practice)

### Description
Add an optional timer to practice exams to help students prepare for timed lecture exams and manage their pacing.

### Expected Features
- Optional timer that can be turned on/off
- Configurable time limit (e.g., 1 minute per question, custom total time)
- Visual countdown display
- Warning when time is running low
- Auto-submit option when time expires (or just notify)
- Display time taken after completion for untimed practice
- Save timing statistics to track improvement

### Use Cases
- Practice under real exam conditions
- Learn to pace answers appropriately
- Build confidence for timed exams
- Track speed improvement over multiple attempts

### Technical Considerations
- Store timer preference in localStorage
- Non-intrusive display (top corner or header)
- Pause functionality for breaks
- Mobile friendly display

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

## Progress Tracking with Checkbox-Based Index Sorting

**Status:** ✅ Implemented
**Location:** `index.html`
**Completed:** 2025-10-18

### Description
Progress tracking on the index page using checkboxes and localStorage. Students can mark completed units/resources, and the page automatically reorganizes to show uncompleted items first, followed by completed items at the bottom. This helps students focus on what's next while maintaining a sense of progress throughout the semester.

### Implemented Features
- **Checkbox for each section**: Each practical/exam/unit gets a green checkbox to mark as completed
- **localStorage persistence**: Checkbox states saved across sessions using key `courseProgress`
- **Automatic sorting**: Page reorganizes based on completion status
  - Uncompleted items appear at top in logical course order
  - Completed items move to bottom in logical course order
  - Visual separator (hr line) between uncompleted and completed sections
- **"Up Next" heading**: Appears dynamically above uncompleted sections once at least one item is checked off
- **Clean minimal design**: No progress percentages or reset button - just focused tracking

### Technical Implementation
- Each section wrapped in `<section class="course-section">` with:
  - Unique ID (e.g., `practical-1`, `exam-2`, `practical-3`)
  - `data-order` attribute for course sequence (1, 2, 3, ...)
  - Checkbox input with `accent-color: #10b981` for green checkmarks
- JavaScript (`index.html` inline script):
  - `loadProgress()` / `saveProgress()` handle localStorage operations
  - `sortSections()` dynamically re-orders DOM based on completion
  - `updateUpNextHeading()` shows/hides "Up Next:" heading
  - `initializeCheckboxes()` loads saved state on page load
- CSS styling:
  - `.section-header` uses flexbox with `align-items: center` for proper checkbox/heading alignment
  - `.section-header h2 { margin: 0; }` ensures vertical alignment works correctly
  - Green checkboxes via `accent-color: #10b981`
  - Full dark mode support for all progress tracking elements

### localStorage Structure
```javascript
{
  "courseProgress": {
    "practical-1": true,
    "practical-2": true,
    "exam-2": true,
    "practical-3": false,
    "exam-3": false
  }
}
```

### Use Cases
- Students see what's immediately relevant at the top
- Motivating visual progress as semester advances
- Clear indication of what to focus on next
- Works across devices (if using same browser)
- No backend or login required

### Design Decisions
- **No reset button**: Simpler interface, users can manually uncheck if needed
- **No progress counter**: "Up Next:" heading is sufficient context
- **No opacity on completed items**: Keeps all text readable and clear
- **Green checkboxes**: Positive visual feedback for completion

### Future Enhancements
- "Show all" toggle to view full list in original order regardless of completion
- Export/import progress (to share across browsers)
- Completion dates/timestamps
- Study streak tracking

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

## Better Background Color for Flashcards Review Page

**Status:** ✅ Implemented
**Location:** Flashcards review page
**Completed:** 2025-10-11

### Description
The purple background on the flashcards review page is distracting and should be replaced with a more neutral gray color scheme.

### Implemented Solution
- Changed from purple gradient to solid dark blue-gray (`#374151`)
- Swipe buttons changed from purple to indigo/blue-violet (`#5b68c4` to `#4338a8`)
- Removed glowing shadow effects from buttons for cleaner appearance
- Much less distracting, allows better focus on content

---

## Custom Mini Quiz Builder

**Status:** ✅ Implemented
**Location:** `mini-quiz-builder.html`
**Completed:** 2025-10-11

### Description
A system to dynamically generate mini quizzes (4 questions) from specific tags in the practical exam data.

### Implemented Features
- Tag selection interface with alphabetical/natural sorting
- Dynamic question count display
- 4-question quizzes randomly selected from chosen topics
- "New Random Quiz" button to regenerate with same tags
- "Change Topics" button to return to builder
- Shareable URLs that auto-load specific tag combinations
- Smart arrow key navigation (respects cursor position)
- Enter key to advance to next question
- Breadcrumb navigation (Home › Mini Quizzes)
- Full dark mode support
- Beautiful indigo/blue color scheme

### Additional Improvements
- Extracted tag selection styles to `shared.css` for reuse across flashcards and quiz builder
- Consistent styling between all tag selection interfaces

---

## Print CSS for Practice Lecture Exams

**Status:** ✅ Implemented
**Location:** `css/exam-print.css`, linked in `unit2-exam.html`
**Completed:** 2025-10-14

### Description
Create a print stylesheet that formats practice lecture exams to look like real exam papers, optimized for printing and completing by hand with pencil.

### Expected Layout

#### Multiple Choice Questions
- Compact layout, approximately 10 questions per page
- Clean, exam-like formatting matching actual exam appearance
- Minimal spacing between questions to maximize page usage while keeping questions visually separate

#### True/Make-True Questions
- Each statement with a blank line before it
- Student can write either "true" or the corrected word
- Format: `__________ [statement with ***word*** highlighted]`

#### Essay Questions - Low Points (< 10 points)
- About 3 questions per page
- Space provided below each question for handwritten answer
- Appropriate spacing based on point value

#### Essay Questions - High Points (≥ 10 points)
- Full page dedicated to each high-point question
- If essay includes an image:
  - First page: Question text with image
  - Second page: Full page of blank space for handwritten answer
- If no image:
  - Full page with question at top and remaining space for answer

### Technical Considerations
- Create shared print CSS file (e.g., `css/exam-print.css`)
- Use `@media print` queries
- Hide unnecessary UI elements (navigation, buttons, dark mode toggle)
- Optimize page breaks with `page-break-before`, `page-break-after`, `page-break-inside`
- Ensure images print at appropriate sizes
- Consider adding question numbering if not already present
- Make sure true/make-true blank lines are visible when printed

### Use Cases
- Print practice exams to simulate real exam conditions
- Complete exams by hand to practice writing answers
- Study without screen time
- Take practice exams in different environments (library, study groups)

---

# Known Bugs

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

**Status:** Not yet fixed
**Location:** Practice practicals - answer review modal (`js/question-modal.js`)

### Description
When reviewing answers after submitting a practical, the popup modal displays text-only questions at a much larger size than image-based questions, creating an inconsistent and jarring user experience.

### Current Behavior
- Text-only questions appear significantly larger in the modal
- Image-based questions display at normal/expected size
- Size inconsistency makes navigation between different question types feel unpolished

### Expected Behavior
- Both text-only and image-based questions should display at similar, consistent sizes in the modal
- Smooth visual experience when navigating between question types

---

## Back Link Positioning in Flashcard Deck Review

**Status:** ✅ Fixed
**Location:** Flashcard deck review page
**Completed:** 2025-10-11

### Description
The back/return link while reviewing a flashcard deck was misaligned due to full-width header breaking out of container.

### Solution
- Removed full-width viewport hack (`width: 100vw` with centering transform)
- Changed header to stay within container bounds (max-width: 600px)
- Removed negative side margins causing alignment issues
- Back link now aligns properly with page content

---

## Flashcards Show HTML Tags Instead of Rendering Them

**Status:** ✅ Fixed
**Location:** Flashcard display (`flashcards/flashcard-engine.js`)
**Completed:** 2025-10-11

### Description
Flashcards were displaying raw HTML tags like `<strong>` in the text instead of rendering them as formatted HTML (e.g., bold text).

### Solution
- Changed `document.getElementById('term').textContent = card.term` to `.innerHTML` (line 347)
- Added markdown conversion for term content: `**text**` → `<strong>text</strong>` (line 346)
- Now both HTML tags and markdown bold syntax render properly on both front and back of cards

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

## Practice Practical Images Flash Black During Navigation

**Status:** Not yet fixed
**Location:** Practice practicals (e.g., `unit2-part2-practical.html`, `unit1-practical.html`)

### Description
When navigating between questions using arrow keys or Next button in the answer review modal, images briefly show a black/dark flash before loading, creating a jarring visual experience.

### Current Behavior
- Black flash visible when pressing Right arrow or Next button to advance to next question
- Flash occurs in the question review modal after submitting a practical
- Similar to the flashcard image loading issue but in a different context

### Possible Causes
1. **No image preloading in modal** - Modal may not preload the next question's image
2. **Missing background color** - Image container in modal might have no background-color set
3. **Image loading timing** - Image src may be set before container is ready
4. **CSS background** - Modal image container might default to dark/black background

### Expected Behavior
- Smooth transitions between questions with no black flash
- Images should appear instantly or show neutral background during loading
- Same smooth experience as flashcard navigation (after that fix)

### Related Fix
The flashcard image flash was fixed by:
1. Adding white background to `.image-container`
2. Removing setTimeout delay for preloaded images
Similar approach may work for practice practical modal.

### Reproduction
1. Start any practice practical
2. Answer some questions and submit
3. Click on any answer to open review modal
4. Press Right arrow or Next button to advance to next question
5. Observe black flash before next image loads

---

## Flashcard Images Flash Black Before Loading

**Status:** ✅ Fixed
**Location:** Flashcard review (`flashcards/flashcard-engine.js`, `flashcards/flashcard-styles.css`)
**Completed:** 2025-10-18

### Description
When advancing to the next flashcard or flipping a card, images briefly showed a black/dark background flash before they finished loading, creating a jarring visual experience.

### Root Causes Identified
1. **Missing background color on `.image-container`** - The image container had no background-color set, so the dark gray body background (`#374151`) showed through during image transitions
2. **Unnecessary setTimeout delay** - A 1ms delay before displaying preloaded images was causing a brief flash even when images were already cached

### Solution Implemented
1. **Added white background to image container** - `flashcards/flashcard-styles.css:272`
   - Set `background-color: #ffffff` on `.image-container`
   - Ensures white background shows during loading instead of dark page background

2. **Removed setTimeout delay for preloaded images** - `flashcards/flashcard-engine.js:416-419`
   - Changed from `setTimeout(() => { termImage.src = ... }, 1)` to immediate assignment
   - Preloaded images now display instantly without any delay
   - Images are already loaded in memory, so no delay is needed

### Result
- Smooth transitions between flashcards with no visible flash
- Clean white background during any brief loading moments
- Better user experience during card navigation
- Preloading system now works as intended

---
