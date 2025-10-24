# Project Streamlining Analysis

## Project Analysis: Evolution and Streamlining Opportunities

Based on the documentation and file structure, here's how the project has evolved and where we can streamline.

---

## **Core Structure (3 Main Things)**

The project centers around 3 (actually 4) learning tools:

### 1. **Practice Exams** (Lecture content - multiple choice, true/false, essays)
- **Files:** `unit2-exam.html` / `exam-template.html`
- **Data:** `unit2-exam.yml`, `unit3-exam3.yml`, `exam2-practice.yml`

### 2. **Practice Practicals** (Image-based vessel/anatomy identification)
- **Files:** `unit1-practical.html`, `unit2-practical.html`, `unit2-part2-practical.html`, `unit3-practical4.html`
- **Data:** `unit1-practical.yml`, `unit2-practical.yml`, `unit2-part2-practical.yml`, `unit3-practical4.yml`

### 3. **Flashcards** (Spaced repetition review)
- **Files:** `unit2-flashcards.html`, `unit2-part2-flashcards.html`, `unit2-lecture-flashcards.html`, `unit3-flashcards.html`
- **Data:** Shares practical YAMLs + `unit2-lecture-topics.yml`

### 4. **Mini Quiz Builder** (`mini-quiz-builder.html`)
- 4-question quizzes from tags
- **Value:** **ESSENTIAL** - Class has 1-2 four-question quizzes per week. This tool is used for studying while building the practice practicals.
- **Data:** Shares practical YAMLs + `unit2-lecture-topics.yml`

---

## **Extra**

#### **Pathway Quiz** (`pathway-mini-quiz.html`)
- Vessel pathway tracing
- **Value?** Unique interactive format for extra credit questions
- **Bloat?** Separate tool instead of integrated into practicals

## **Archive**
- In order to make the project more manageable, files not in active use were moved to an Archive directory

---

## **Streamlining Options**

### **Step 1: Consolidate Templates**

**Problem:** You have separate HTML files for every practical/exam/flashcard set
- `unit1-practical.html`, `unit2-practical.html`, `unit2-part2-practical.html`, `unit3-practical4.html`

**Solution:** Single `practical-template.html` that loads data based on URL parameter
```
practical-template.html?unit=unit1
practical-template.html?unit=unit2-part2
```

**Benefits:**
- One file to maintain instead of 4+
- Bug fixes apply everywhere instantly
- Easier to add new units

**Drawbacks:**
- Requires refactoring all HTML files
- URL parameters may be less intuitive than separate files

---

### **Step 2: Share Code Between Mini Quiz and Practicals**

**Decision:** Mini quiz builder stays as separate tool (essential for weekly quiz prep), but should share code with practicals.

**What to share:**
- Core question logic and rendering
- Styling (CSS)
- Modal review system (already using `js/question-modal.js`)
- Answer checking and feedback mechanisms
- Tag filtering and question selection logic

**What stays different:**
- Separate HTML file for dedicated workflow
- UI optimized for quick 4-question practice
- Different configuration/entry point

**Benefits:**
- Maintains dedicated tool for weekly quiz prep
- Eliminates code duplication
- Bug fixes apply to both tools
- Consistent UX between mini-quizzes and practicals

---

### **Step 3: Standardize Flashcard Decks**

You have multiple flashcard HTML files:
- `unit2-flashcards.html`
- `unit2-part2-flashcards.html`
- `unit2-lecture-flashcards.html`
- `unit3-flashcards.html`

**Solution:** Single `flashcard-template.html` with deck config loaded by URL parameter
```
flashcard-template.html?deck=unit2-part2
```

**Benefits:**
- One flashcard engine to maintain
- Consistent UX across all decks
- Easier to add new decks

