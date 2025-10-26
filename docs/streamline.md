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

### **Step 1: Consolidate Templates** ✅ **COMPLETED (Oct 2025)**

**Problem:** You have separate HTML files for every practical/exam/flashcard set
- `unit1-practical.html`, `unit2-practical.html`, `unit2-part2-practical.html`, `unit3-practical4.html`

**Solution:** Single `practical-template.html` that loads data based on URL parameter
```
practical-template.html?unit=unit1-practical
practical-template.html?unit=unit2-part2-practical
```

**Status: COMPLETED**
- Created `practical-template.html` as universal template
- Updated all index.html links to use URL parameters
- Dynamically loads title and metadata from YAML files
- Old individual practical files can be archived when ready

**Implementation Details:**
- Template uses URL parameter `?unit=` to specify YAML file
- Page title and header updated from YAML `title` field
- Defaults to `unit3-practical4` if no parameter provided
- All existing practicals now use single template

**Benefits:**
- One file to maintain instead of 4+
- Bug fixes apply everywhere instantly
- Easier to add new units

---

### **Step 2: Share Code Between Mini Quiz and Practicals** ✅ **COMPLETED (Oct 25, 2025)**

**Decision:** Mini quiz builder stays as separate tool (essential for weekly quiz prep), but should share code with practicals.

**Status: COMPLETED**
- Mini quiz builder now uses URL parameters (`mini-quiz-builder.html?unit=unit3-practical4`)
- Shares modal review system (`js/question-modal.js`) ✅
- Shares CSS styling (`css/shared.css` for tags, buttons, etc.) ✅
- Shares answer checking/normalization (`js/answer-checker.js`) ✅ NEW
- Shares rendering utilities (`js/question-renderer.js`) ✅ NEW
- Each tool maintains separate HTML file for dedicated workflow ✅

**New Shared Modules Created:**
- `js/answer-checker.js` - Answer normalization, Levenshtein distance, partial credit grading
- `js/question-renderer.js` - Theme helpers, shuffle, navigation, preloading, arrow key handling

**What is now shared:**
- Core question logic and rendering ✅
- Styling (CSS) ✅
- Modal review system ✅ (`js/question-modal.js`)
- Answer checking and feedback mechanisms ✅
- Navigation and keyboard handling ✅

**What stays different:**
- Separate HTML file for dedicated workflow ✅
- UI optimized for quick 4-question practice ✅
- Different configuration/entry point ✅
- Two-column answer sheet layout (1-2 left, 3-4 right) ✅

**Benefits:**
- Maintains dedicated tool for weekly quiz prep ✅
- Eliminates ~200 lines of code duplication ✅
- Bug fixes apply to both tools automatically ✅
- Consistent UX between mini-quizzes and practicals ✅
- Single source of truth for grading logic ✅

---

### **Step 3: Standardize Flashcard Decks** ✅ **COMPLETED (Oct 25, 2025)**

**Problem:** Multiple flashcard hub HTML files that are nearly identical:
- `unit2-flashcards.html`
- `unit2-part2-flashcards.html`
- `unit2-lecture-flashcards.html`
- `unit3-flashcards.html`

**Solution:** Single `flashcard-hub-template.html` with config loaded by URL parameter
```
flashcard-hub-template.html?config=decks-config&source=unit2-practical&title=...&subtitle=...
flashcard-hub-template.html?config=unit3-decks-config&source=unit3-practical4&title=...&subtitle=...
```

**Status: COMPLETED**
- Created `flashcard-hub-template.html` as universal flashcard hub
- Updated all index.html links to use URL parameters
- Dynamically loads deck configurations from YAML files
- Dynamically loads page title and subtitle from URL parameters
- Created config files for all flashcard hubs:
  - `data/unit2-decks-config.yml` (Unit 2 practical flashcards)
  - `data/lecture-decks-config.yml` (Unit 2 lecture flashcards)
  - `data/practical-3-decks-config.yml` (Practical 3 blood vessels)
  - `data/unit3-decks-config.yml` (Unit 3 respiratory/renal/acid-base)
- Old individual flashcard hub files can be archived when ready

**Implementation Details:**
- Template uses URL parameters:
  - `?config=` to specify which deck config YAML to load
  - `?source=` to specify which YAML file for custom tag building
  - `?title=` and `?subtitle=` for page headers
- All deck definitions now in YAML config files
- Unified dark mode and tag selection logic
- Single codebase for all flashcard hubs

**Benefits:**
- One file to maintain instead of 4+
- Bug fixes apply to all hubs instantly
- Easier to add new flashcard collections
- Consistent UX across all study modes
- No code duplication

