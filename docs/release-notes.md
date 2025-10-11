# Release Notes

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

#### Technical Improvements

**Code Quality**
- Extracted tag selection styles to `shared.css`
- Consistent tag chip design across flashcards and quiz builder
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
