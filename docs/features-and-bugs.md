# Features and Bugs

## Project Structure Notes

### Active Files
- **Practice Practicals**: `unit2-part2-practical.html` and related files are the current, actively maintained practical exam system
- **Flashcards**: Main flashcard system and deck builder

### Legacy/Deprecated Files
- **exam1-practice.html** and related `exam1-*` files: OLD implementations that should not be used or referenced. These are kept for historical reference only but are not actively maintained.
- **flashcards-prototype.html**: OLD prototype version of flashcards. Use the main flashcard system instead.

---

# Feature Requests

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

**Status:** Not yet implemented
**Location:** Flashcards review page

### Description
The purple background on the flashcards review page is distracting and should be replaced with a more neutral gray color scheme.

### Expected Behavior
- Use a nice gray color scheme (both dark and light tones)
- Less distracting, more focused on content

### Current Behavior
- Purple background is visually distracting during review

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

# Known Bugs

## Back Link Positioning in Flashcard Deck Review

**Status:** Not yet fixed
**Location:** Flashcard deck review page

### Description
The back/return link while reviewing a flashcard deck is positioned too far to the left, inconsistent with its placement on other pages.

### Expected Behavior
- Back link should be in a consistent position matching other pages in the site

### Actual Behavior
- Back link appears too far left compared to other pages

---

## Flashcards Show HTML Tags Instead of Rendering Them

**Status:** Not yet fixed
**Location:** Flashcard display

### Description
Flashcards are displaying raw HTML tags like `<strong>` in the text instead of rendering them as formatted HTML (e.g., bold text).

### Expected Behavior
- `<strong>text</strong>` should display as **text** (bold)
- HTML formatting tags should be rendered, not shown as literal text

### Actual Behavior
- Tags appear as plain text: "This is <strong>important</strong>" instead of "This is **important**"

### Likely Cause
- Using `.textContent` instead of `.innerHTML` when setting flashcard content
- Or HTML entities are being escaped somewhere in the rendering pipeline

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
