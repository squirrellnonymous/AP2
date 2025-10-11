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
