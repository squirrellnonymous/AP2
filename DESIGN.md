# Working Design Document

## Current Status
- **Working**: Leukocytes flashcards work perfectly (don't touch!)
- **Completed**:
  - practice-practical-2.yml structure and leukocytes content (8 items)
  - Dynamic 40-question answer sheet with auto-disable for unavailable questions
  - Content-driven navigation (keyboard, buttons) respects available question count
  - All image loading fixed with proper paths
- **In Progress**: Building tag-based flashcard sets from the practical data (images and yml)
- **Goal**: Single source of truth for content with flexible flashcard generation

## Practical-First Content Architecture

### Overview
Build practical-2 as the primary content source, then generate flashcards from it.

### Content Flow
1. **Practical-2**: Master content with wide images (1024x760)
   - Blood components (leukocytes, RBCs, platelets)
   - Cardiac structures
   - Vessels
   - Progressive enablement as content is added

2. **Flashcards**: Generated from practical-2 enabled items
   - Use wide images as-is on desktop
   - CSS cropping to square on mobile only
   - Plan to extract by tag once more content is added to the practical data (e.g. structures of the heart, vessels)

### Data Structure
```yaml
# practice-practical-2.yml
questions:
  - id: 1
    image: "practical-2/01.jpg"
    question: "Identify the formed element?"
    answer: "Neutrophil"
    definition: "Most abundant WBCs, first responders..."
    tags: ["leukocytes"]
```

## Working Plan

### Phase 1: Update Practical-2 Structure
1. **Update practical-2.yml structure** - done enough for now
   - Use comprehensive tagging (e.g., "unit-2", "leukocytes", "blood-cells")

2. **Content migration help** - done


### Phase 2: Build Flashcard Generator
3. **Create flashcard generation script**
   - Filter practical-2 items by tags
   - Generate flashcard-format YAML from practical data
   - Support multiple tag combinations (e.g., all "leukocytes", or "blood-cells" + "granulocytes")

### Phase 3: Update Systems
4. **Modify flashcard engine** to handle wide images
5. **Add mobile CSS cropping** for flashcards
6. **Test practical-2 with enabled/disabled states**

### Implementation Notes
- Practical shows enabled items, disables incomplete ones
- Single image source (no duplicate folders)
- Flashcard generator pulls `enabled: true` items by tags
- CSS `object-fit: cover` for mobile flashcard cropping only

### System Coexistence
**Preserve existing working flashcards:**
- Keep `flashcards/sets/leukocytes.yml` untouched - it works perfectly
- Current flashcard engine stays as-is

**New parallel system:**
- `practical-2.yml` - new tag-based structure for practical
- On-the-fly flashcard generation from practical data (single source of truth)
- Both systems use same flashcard engine

### Scaling Approach
- `practical-2.yml` - Blood, heart, vessels (Unit 2)
- `practical-3.yml` - Unit 3 content
- `practical-4.yml` - Unit 4 content
- `practical-5.yml` - End of semester (hybrid: new content + strategic pulls from practicals 2-4)

Flashcard URLs: `?source=practical-2&tags=leukocytes` or `?source=practical-5&tags=unit-2,unit-3`

## Key Constraints & Decisions
- **Don't break working code**: Existing leukocytes flashcards stay untouched
- **Single source of truth**: Fix content once in practical YAML, it updates everywhere
- **Empty quotes for placeholders**: Use `""` not `"blank"` for incomplete content
- **Tag-based organization**: Multiple tags per item for flexible filtering
- **Mobile-first images**: 1024x760 wide images, crop to square on mobile only

## Big Picture Todo List

1. Content Clean Up
- [ ] Create practical-2.yml with tag-based structure (Arena)
- [ ] Remove placeholder content from practical files (Claude and Arena)
  - Replace "blank" with empty quotes `""`
  - Code can check `if (item.answer === "" || !item.answer)` to disable items
- [ ] Clean up images and existing practical yml files (Arena)
- **Note: Keep existing `leukocytes.yml` flashcard set untouched**

2. Build New Parallel System
- [ ] Build flashcard generator script for tag-based filtering
- [ ] Generator creates new sets (e.g., `generated-leukocytes.yml`, `blood-components.yml`)
- [ ] Update flashcard engine for wide images
- [ ] Add mobile CSS cropping for flashcards
- [ ] Test practical-2 with enabled/disabled states

3. Make the practical more realistic
- [ ] last question is a two point extra credit
- [ ] fourty questions plus one extra credit question 
- [ ] more than 41 items can exist in the yml file and we pull strategically to create a good mix of topics

4. Let's consider an interface for students to submit question content (could be a github issue since I'm not sure I want a database... but maybe I want a database?)

5. Work on the score and let students know by topic how they did... maybe suggest a set of flashcards just for them. 

