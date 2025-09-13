# A&P 224 Interactive Quiz System - Design Document

## Project Overview

An interactive quiz system designed to emulate the Anatomy & Physiology 224 exam format. The system supports three question types matching the actual exam structure and avoids context/character limits through modular data loading.

## Exam Format Requirements

### 1. Multiple Choice (Scantron Section)
- 4-5 answer options per question
- Single correct answer selection
- Automatic scoring
- Visual feedback for correct/incorrect answers

### 2. True/Make True Section
- Sentences with **bolded keywords**
- Student responds with:
  - "true" if statement is correct
  - The correct word/phrase that makes the statement true
- Text input field for responses
- Partial credit scoring logic

### 3. Essay Questions
- Variable length responses (1 sentence to full paragraph)
- Expandable text areas
- Manual review/grading interface
- Rich text formatting support

## Technical Architecture

### Frontend
- **Framework**: Pure HTML/CSS/JavaScript (lightweight, no build process)
- **Structure**: Single Page Application (SPA)
- **Components**: Modular question type components
- **Styling**: Clean, academic interface with mobile responsiveness

### Data Management
- **Format**: YAML files for quiz content (human-readable, easier editing)
- **Structure**: Separate files per topic/chapter to avoid context limits
- **Loading**: Dynamic content loading with YAML parser
- **Storage**: Local storage for progress persistence

### Question Data Structure
```yaml
quiz:
  title: "Chapter 1: Introduction to A&P"
  sections:
    multipleChoice: [...]
    trueMakeTrue: [...]
    essay: [...]
```

### Multiple Choice Format
```yaml
- id: mc1
  question: "Which plane divides the body into left and right halves?"
  options:
    - "Sagittal plane"
    - "Frontal plane"
    - "Transverse plane" 
    - "Coronal plane"
  correctAnswer: 0
  explanation: "The sagittal plane divides the body into left and right portions."
```

### True/Make True Format
```yaml
- id: tmt1
  statement: "The **distal** end of the humerus articulates with the shoulder joint."
  bolded: "distal"
  correctAnswer: "proximal"
  isTrue: false
  explanation: "The proximal end connects to the shoulder; distal connects to elbow."
```

### Essay Format
```yaml
- id: essay1
  question: "Explain the concept of homeostasis and provide two examples."
  points: 10
  rubric:
    - "Define homeostasis (3 points)"
    - "Provide first example (3 points)" 
    - "Provide second example (3 points)"
    - "Clarity and grammar (1 point)"
```

## User Interface Design

### Navigation Structure
1. **Quiz Selection** - Choose from available quizzes/chapters
2. **Section Selection** - Navigate between MC, True/Make True, Essay
3. **Progress Tracking** - Visual progress bar and section completion status
4. **Review Mode** - Review answers and explanations

### Question Display
- **Clear sectioning** - Distinct visual separation between question types
- **Progress indicators** - Current question number and section progress
- **Navigation controls** - Previous/Next buttons, jump to question
- **Auto-save** - Continuous progress saving

### Results Interface
- **Section scores** - Breakdown by question type
- **Detailed review** - Question-by-question analysis
- **Missed questions** - Focused review of incorrect answers
- **Performance metrics** - Time spent, accuracy rates

## Implementation Phases

### Phase 1: Core Infrastructure
- Basic HTML structure and CSS styling
- Quiz data loading system
- Navigation framework
- Progress persistence

### Phase 2: Question Components
- Multiple choice component with scoring
- True/Make True component with text input validation
- Essay component with expandable text areas

### Phase 3: Results & Review
- Scoring algorithms
- Results dashboard
- Review mode with explanations
- Performance analytics

### Phase 4: Enhancement
- Timer functionality
- Question randomization
- Export results (PDF/print)
- Study mode vs. exam mode

## File Structure
```
224/
├── index.html
├── css/
│   ├── main.css
│   └── components.css
├── js/
│   ├── app.js
│   ├── quiz-engine.js
│   └── components/
│       ├── multiple-choice.js
│       ├── true-make-true.js
│       └── essay.js
├── data/
│   ├── chapter1.yml
│   ├── chapter2.yml
│   └── ...
└── DESIGN.md
```

## Success Criteria
- Accurate emulation of A&P 224 exam format
- Seamless navigation between question types
- Reliable progress saving and results tracking
- Mobile-friendly responsive design
- Fast loading despite large question banks
- Intuitive interface requiring minimal explanation