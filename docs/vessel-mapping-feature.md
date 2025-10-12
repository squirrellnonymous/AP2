# Pathway Mapping Feature

## Overview
A flexible question type for practice practicals that allows students to trace sequential pathways through any connected system. Initially designed for blood vessel pathways (e.g., "How would blood get from the heart to the right hand?"), but can be applied to any sequential process including clotting cascades, nerve pathways, metabolic processes, cardiac conduction, and more. The system validates the pathway using a connection tree and provides feedback on correctness.

## Design Philosophy: Flexibility

This feature is designed to be **pathway-agnostic**. The same validation logic and UI work for any sequential process:

### Initial Use Case: Blood Vessels
- "How would blood get from the heart to the right hand?"
- Connection tree: aorta → brachiocephalic trunk → right subclavian artery → ...

### Future Applications

**Clotting Cascade:**
- "Trace the intrinsic pathway of coagulation"
- Connection tree: Factor XII → Factor XI → Factor IX → Factor X → Thrombin → Fibrin

**Cardiac Conduction:**
- "Trace the electrical signal through the heart"
- Connection tree: SA node → AV node → Bundle of His → Purkinje fibers

**Blood Flow Through Heart:**
- "Trace blood flow from the right atrium through pulmonary circulation"
- Connection tree: Right atrium → Tricuspid valve → Right ventricle → Pulmonary valve → ...

**Digestive Process:**
- "Trace the path of food through the digestive system"
- Connection tree: Mouth → Esophagus → Stomach → Small intestine → ...


The only requirements to add a new pathway type are:
1. Define the question text
2. Specify valid start points
3. Specify valid end points
4. Create the connection tree for that system

## Use Case
The extra credit question on practice practical #3 will be to trace a venous or arterial route from/to an extremity to/from the heart. Students need a way to practice this recall and get feedback on whether their pathways are anatomically valid.

## Question Format

### Example Questions
- "How would blood get from the heart to the right hand?"
- "How would blood get from the left foot to the heart?"
- "How would blood get from the heart to the left foot?"
- "How would blood get from the right hand to the heart?"

### User Interface

**Input Method:**
1. Question displayed at top
2. Start with 3 empty input fields
3. Student types vessel name into field
4. "+ Add vessel" button creates a new input field below
5. "(-)" remove button on each field (minimum 1 field always present)
6. Student can add as many vessels as needed for their pathway
7. Can navigate to other questions or submit the practical when done

**Visual Design:**
```
Question: How would blood get from the heart to the right hand?

[Input field 1: Heart                  ] [×]
[Input field 2: Aorta                  ] [×]
[Input field 3: Brachiocephalic trunk  ] [×]
[Input field 4: Right subclavian artery] [×]
...

[+ Add vessel]
```

## Data Structure

### YAML Format

#### Question Definition
```yaml
- question: "How would blood get from the heart to the right hand?"
  type: "pathway"
  direction: "arterial"  # or "venous"
  startLocation: "heart"
  endLocation: "right hand"
  validStartVessels:
    - "left ventricle"
    - "ascending aorta"
  validEndVessels:
    - "right radial artery"
    - "right ulnar artery"
  points: 2  # or scale by pathway length?
```

#### Vessel Connection Tree

Rather than storing every possible valid path, store a connection graph showing which vessels connect to which:

```yaml
vesselConnections:
  arterial:
    # ... we get to skip past mentioning the ascending aorta or the aortic arch
    "heart": ["aorta"]
    "aorta": ["brachiocephalic trunk", "left common carotid artery", "left subclavian artery", "descending aorta"]
    "brachiocephalic trunk": ["right common carotid artery", "right subclavian artery"]
    "right subclavian artery": ["right vertebral artery", "right axillary artery"]
    "right axillary artery": ["right brachial artery"]
    "right brachial artery": ["right radial artery", "right ulnar artery"]
    # ... continue for all arterial connections

  venous:
    "right radial vein": ["right brachial vein"]
    "right ulnar vein": ["right brachial vein"]
    "right basilic vein": ["right axillary vein"]
    "right cephalic vein": ["right axillary vein"]
    "right brachial vein": ["right axillary vein"]
    "right axillary vein": ["right subclavian vein"]
    "right subclavian vein": ["right brachiocephalic vein"]
    "left subclavian vein": ["left brachiocephalic vein"]
    "right brachiocephalic vein": ["superior vena cava"]
    "left brachiocephalic vein": ["superior vena cava"]
    "superior vena cava": ["right atrium"]
    # ... continue for all venous connections
```

## Validation Logic

### Connection Validation Algorithm

```javascript
function validatePathway(studentPath, connectionTree, validStartVessels, validEndVessels) {
  const results = {
    isValid: false,
    validSteps: 0,
    totalSteps: studentPath.length,
    brokenAt: null,
    feedback: []
  };

  // Normalize vessel names (trim, lowercase, handle "right"/"R" variations)
  const normalizedPath = studentPath.map(vessel => normalizeVesselName(vessel));

  // Check start point
  if (!validStartVessels.includes(normalizedPath[0])) {
    results.feedback.push({
      step: 0,
      type: 'invalid-start',
      message: `Path should start with one of: ${validStartVessels.join(', ')}`
    });
    return results;
  }

  // Check each connection in sequence
  for (let i = 0; i < normalizedPath.length - 1; i++) {
    const currentVessel = normalizedPath[i];
    const nextVessel = normalizedPath[i + 1];

    // Check if connection exists in tree
    const validNextVessels = connectionTree[currentVessel] || [];

    if (validNextVessels.includes(nextVessel)) {
      results.validSteps++;
      results.feedback.push({
        step: i,
        type: 'valid',
        message: `✓ ${currentVessel} → ${nextVessel}`
      });
    } else {
      results.brokenAt = i;
      results.feedback.push({
        step: i,
        type: 'invalid',
        message: `✗ ${currentVessel} does not connect to ${nextVessel}`
      });
      // Stop validating after first break
      break;
    }
  }

  // Check end point (if we got there without breaking)
  if (results.brokenAt === null) {
    const lastVessel = normalizedPath[normalizedPath.length - 1];
    if (validEndVessels.includes(lastVessel)) {
      results.isValid = true;
      results.feedback.push({
        step: normalizedPath.length - 1,
        type: 'valid-end',
        message: `✓ Path correctly ends at ${lastVessel}`
      });
    } else {
      results.feedback.push({
        step: normalizedPath.length - 1,
        type: 'invalid-end',
        message: `Path should end at one of: ${validEndVessels.join(', ')}`
      });
    }
  }

  return results;
}
```

### Name Normalization

Handle variations in vessel names:
- Trim whitespace
- Lowercase comparison
- Handle "Right"/"R"/"right" variations
- Handle "Artery"/"artery" variations
- Use existing fuzzy matching logic from current practical grading
- Accept singular/plural variations where applicable

### Partial Credit & Scoring

**Actual Grading Rubric (from Professor):**
- **Total possible:** 2 points per pathway question
- **Missing artery:** 0 points (pathway is just wrong)
- **Misspelling/typo:** -0.5 points deduction
- **Incorrect connection:** 0 points (pathway breaks)

**Current Implementation:**
Uses per-connection scoring which approximates the rubric:
- Each valid connection earns points
- Fuzzy matching catches misspellings (currently awards partial credit)
- Invalid connections stop validation (awards 0 for remaining path)

**TODO: Align with Professor's Rubric**
- [ ] Implement strict 2-point max per question
- [ ] Track misspellings separately from invalid connections
- [ ] Deduct 0.5 points per misspelling (fuzzy match = misspelling)
- [ ] Missing vessel = 0 points total
- [ ] Perfect pathway = 2 points

**Alternative Scoring Options (not used):**

*Option 1: All-or-nothing*
- Full points only if complete valid pathway
- 0 points if any connection is invalid

*Option 2: Per-connection (current)*
- Each valid connection earns points
- Example: 7-vessel pathway = 6 connections = 6 possible points
- Student gets 4/6 if first 4 connections are valid, then breaks

*Option 3: Checkpoint scoring*
- Award points for reaching certain anatomical "checkpoints"
- Example pathway (heart → right hand): 5 points total
  - Start correctly: 1 point
  - Reach aortic arch: 1 point
  - Reach subclavian: 1 point
  - Reach brachial: 1 point
  - Reach hand vessels: 1 point

## Vessel Scope

Based on Unit2-Practical3-StudyGuide.pdf:

**Arteries (37 types):**
- Adrenal, Anterior Cerebral, Anterior Communicating Branches, Anterior Tibial, Ascending Aorta, Axillary, Basilar, Brachial, Brachiocephalic Trunk, Celiac Trunk, Circle of Willis, Common Carotid, Common Hepatic, Common Iliac, Descending Aorta, External Carotid, External Iliac, Femoral, Fibular, Gastric, Gonadal, Hepatic Artery Proper, Inferior Mesenteric, Internal Carotid, Internal Iliac, Middle Cerebral, Popliteal, Posterior Cerebral, Posterior Communicating Branches, Posterior Tibial, Radial, Renal, Splenic, Subclavian, Superior Mesenteric, Ulnar, Vertebral

**Veins (37 types):**
- Anterior Tibial, Axillary, Basilic, Brachial, Brachiocephalic, Cavernous Sinus, Cephalic, Common Iliac, External Iliac, External Jugular, Femoral, Fibular, Gastric, Gonadal, Great Saphenous, Hepatic Portal, Hepatic, Inferior Mesenteric, Inferior Vena Cava, Internal Jugular, Internal Iliac, Median Cubital, Petrosal Sinus, Popliteal, Posterior Tibial, Radial, Renal, Sigmoid Sinus, Small Saphenous, Splenic, Subclavian, Superior Mesenteric, Superior Sagittal Sinus, Superior Vena Cava, Transverse Sinus, Ulnar, Vertebral

## Valid Start/End Points

### Arterial Pathways (Heart → Extremity)

**Valid Start Vessels:**
- "aorta"
- "ascending aorta"
- "heart"
- "left ventricle"
- Accept any as valid starting point

**Note:** Start vessels are configurable per question in YAML. The above are typical defaults, but each question can specify its own valid start vessels.

**Valid End Vessels by Location:**
- **Right hand:** right radial artery, right ulnar artery
- **Left hand:** left radial artery, left ulnar artery
- **Right foot:** right anterior tibial artery, right posterior tibial artery, right fibular artery
- **Left foot:** left anterior tibial artery, left posterior tibial artery, left fibular artery

### Venous Pathways (Extremity → Heart)

**Valid Start Vessels by Location:**
- **Right hand:** right radial vein, right ulnar vein, right basilic vein, right cephalic vein
- **Left hand:** left radial vein, left ulnar vein, left basilic vein, left cephalic vein
- **Right foot:** right anterior tibial vein, right posterior tibial vein, right great saphenous vein, right small saphenous vein
- **Left foot:** left anterior tibial vein, left posterior tibial vein, left great saphenous vein, left small saphenous vein

**Valid End Vessels:**
- "right atrium" (typical default)

**Note:** End vessels are configurable per question in YAML. Each question specifies which vessels are acceptable endpoints.

## Open Questions

1. ~~**Arterial start point:**~~ ✓ RESOLVED: Accept "aorta" or "ascending aorta" as valid starts (configurable per question)
2. **Venous end point:** End strictly at "right atrium" or also accept "heart" as a simpler term? (configurable per question)
3. **Scoring method:** All-or-nothing, per-connection, or checkpoint-based?
4. **Extra credit vs regular:** Should this be marked as extra credit in the UI?
5. **How many questions:** Include 2-4 pathway questions per practical? One of each type (arterial/venous, upper/lower extremity)?
6. **Reference material:** After submission, show one example valid pathway for learning?
7. **Lateral symmetry:** Do we need separate entries for left/right sides in the connection tree, or can we handle that programmatically?

## TODO: Cleanup Tasks

- **Clean up vessel connection tree:** Remove vessels not needed for extremity pathways (brain/neck arteries like carotid, vertebral, Circle of Willis, etc.). Keep only vessels needed for:
  - Upper extremity: Aorta → Brachiocephalic → Subclavian → Axillary → Brachial → Radial/Ulnar
  - Lower extremity: Aorta → Descending aorta → Iliac → Femoral → Popliteal → Tibial/Fibular
  - Venous returns for both
  - May want to keep extra vessels if planning to add brain/organ pathway questions later

## Implementation Status

### ✅ Completed

**Core Infrastructure:**
- ✅ Created vessel connection tree (`data/vessel-connections.yml`)
  - Arterial and venous pathways
  - Includes anatomically valid shortcuts
  - Covers upper/lower extremities
- ✅ Built pathway validator (`js/pathway-validator.js`)
  - Validates connections using tree
  - Fuzzy name matching
  - Partial credit scoring
  - Detailed feedback
- ✅ Created dynamic pathway input UI
  - Add/remove vessel fields
  - Enter key navigation
  - Minimum 1 field, starts with 3
  - Matches practical styling
  - Full dark mode support

**Working Implementations:**
- ✅ **pathway-test.html** - Testing/development page
- ✅ **pathway-mini-quiz.html** - Single-question extra credit practice (READY FOR USE)
- ✅ **pathway-practical.html** - Multi-question demo
- ✅ Added pathway question to `unit2-part2-practical.yml` (id: 200)

**Design Decisions Made:**
- ✅ Arterial routes start with: "aorta", "ascending aorta", "heart", or "left ventricle"
- ✅ Venous routes end at: "right atrium" or "heart" (configurable)
- ✅ Shortcuts allow skipping descriptive terms (e.g., "aorta" → "brachiocephalic trunk")
- ✅ No shortcuts that skip actual anatomical structures
- ✅ Scoring: Partial credit per valid connection
- ✅ Question type: `type: "pathway"` in YAML

### 🔄 In Progress

**Fine-Tuning Needed:**
- UI polish and user experience refinements
- Validation edge cases
- Additional pathway question variations
- **Align scoring with professor's rubric:**
  - 2 points max per question
  - -0.5 per misspelling
  - 0 points if missing required artery

**Active Issue - Grading UX:**
- **Problem:** Results display needs to show feedback in less space
- **Goal:** Make input fields read-only and color-code them (green=correct, red=incorrect) instead of showing long vertical feedback list
- **Status:** Attempted fix to map feedback step indices to input indices, but still not working correctly
- **Challenge:** Mapping validation feedback (indexed by pathway position) to input fields (which may include empty fields)

### 📋 TODO

**Cleanup:**
- Remove non-extremity vessels from connection tree (brain/neck arteries not needed for current use case)
- May want to keep them if adding brain pathway questions later

**Integration:**
- Integrate pathway questions into main `unit2-part2-practical.html` as extra credit
- Add pathway support to question modal review system
- Test in full practical workflow

**Future Enhancements:**
- Additional pathway question types (clotting cascade, nerve pathways, etc.)
- Visual pathway diagram display (optional)
- Example valid pathway after submission (optional)

## Technical Considerations

### Vessel Connection Tree Storage
- Store in separate YAML file: `data/vessel-connections.yml`
- Keep arterial and venous separate
- Include comments for complex junctions (e.g., aortic arch branches)

### Code Architecture
- Reuse existing grading infrastructure from `unit2-part2-practical.html`
- New question type handler for `type: "pathway"`
- Extend modal system to show pathway-specific feedback
- Consider creating `js/vessel-pathway.js` module for validation logic

### Edge Cases to Handle
- Student enters vessels in reverse order
- Student skips intermediate vessels (e.g., goes straight from axillary to radial, skipping brachial)
- Student mixes left/right sides
- Typos and name variations
- Empty fields
- Single-vessel answers

## Success Criteria

- [ ] Students can practice vessel pathways matching exam format
- [ ] Validation correctly identifies valid/invalid pathways
- [ ] Partial credit awarded fairly for partially correct paths
- [ ] Clear feedback shows exactly where pathway breaks
- [ ] Works on mobile and desktop
- [ ] Integrates seamlessly with existing practical system
- [ ] Professor can easily add new pathway questions via YAML
