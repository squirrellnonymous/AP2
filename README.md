# Anatomy & Physiology II

A project for Anatomy & Physiology II students featuring interactive practice tests with:
- multiple choice with automatic evaluation
- true/make-true with automatic evaluation
- short/long essay questions with self-grading
- interaction: full test then feedback and grade calculation
- responsive mobile design for students on the go.

## Getting Started

[basic instructions for contributing]

## Structure

- Index
- Exam 1 Practice Test

## Technical Implementation

### Architecture
- **Frontend**: Vanilla HTML5, CSS3, and JavaScript (no frameworks)
- **Data**: YAML configuration files with JavaScript fallback for GitHub Pages
- **Styling**: External CSS with mobile-first responsive design
- **Hosting**: GitHub Pages with automatic deployment

### Features
- Dynamic quiz generation from YAML data
- Three question types: multiple choice, true/make-true, and essay
- Automatic scoring with weighted point allocation
- Self-grading interface for essay questions
- CORS-compliant data loading with fallback support
- Accessible UI with proper semantic HTML
- Mobile-optimized responsive design

### File Structure
```
├── index.html              # Landing page
├── exam1-practice.html     # Quiz interface
├── css/
│   └── quiz.css           # Styling for quiz components
├── data/
│   └── exam1-practice.yml # Quiz content and answers
└── README.md              # This file
```

### Contributing
Pull requests welcome. When adding new quizzes, follow the YAML structure in `data/exam1-practice.yml` and update the fallback data in the HTML file's JavaScript section.