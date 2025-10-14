# Blood Vessel Tree Data Storage and Visualization Research

**Date:** October 13, 2025
**Purpose:** Research how medical professionals and educators handle vessel tree data to validate our approach in `vessel-connections.yml`

## Research Questions

1. How do medical databases and anatomy software store blood vessel connection data?
2. What are common visualization approaches for vascular anatomy in medical education?
3. Are there standard ontologies or data models for representing vessel hierarchies?
4. What are best practices for representing branching vascular structures?
5. How are shortcuts/anastomoses typically handled in vessel tree data?

---

## Key Finding: Our Approach is Valid

**Our YAML adjacency list structure aligns with industry standards for vessel data representation.**

---

## 1. Data Storage Approaches in Medical/Educational Contexts

### A. HRA-VCCF: The Gold Standard

**Human Reference Atlas - Vasculature Common Coordinate Framework (HRA-VCCF)**

- **Source:** NIH Human BioMolecular Atlas Program (HuBMAP)
- **Scale:** 993 vessels with branching connections, 10 cell types, 10 biomarkers
- **Status:** First open, computer-readable, comprehensive database of adult human blood vasculature
- **Repository:** https://github.com/hubmapconsortium/hra-vccf
- **Publication:** Nature Scientific Data (2023)

**Data Structure:**
- Multiple CSV tables storing vessel relationships
- Tables include:
  - `Vessel.csv` - Core vessel data
  - `VesselOrganCrosswalk.csv` - Vessel-to-organ mappings
  - `VesselCTB.csv` - Vessel-cell type-biomarker relationships
  - `Geometry.csv` - Geometric properties

**Key Fields:**
- Vessel types and subtypes
- Branching sequence (parent-child relationships)
- Anastomoses (collateral connections)
- Portal systems
- Regions vessels supply/drain
- FMA (Foundational Model of Anatomy) IDs
- Links to 3D reference objects

**Comparison to Our Approach:**
- They use CSV tables, we use YAML
- Both represent vessel connections as adjacency lists
- Both are text-based and version-controllable
- **Conclusion:** Our approach is structurally equivalent

### B. Graph Databases (Neo4j)

**Used in medical/anatomical knowledge representation**

**Advantages:**
- Relationships between structures as important as structures themselves
- Natural representation of branching and anastomoses
- Flexible property graphs
- Used for Medical Subject Headings (MeSH) ontology

**When Appropriate:**
- Large-scale medical knowledge graphs
- Complex querying requirements
- Multiple interconnected systems

**Why We Don't Need This:**
- Our scale is manageable (< 100 vessels for student quizzes)
- Simple pathfinding sufficient for validation
- YAML is more transparent for educational purposes

### C. Adjacency Lists (Our Current Approach)

**Format:** YAML with vessel names as keys, arrays of connected vessels as values

**Advantages:**
- ✅ Human-readable and easy to edit
- ✅ Space-efficient for sparse graphs (trees are sparse)
- ✅ Comments supported for documentation
- ✅ Natural representation of parent-child relationships
- ✅ Works perfectly with git version control
- ✅ Transparent for students and educators

**Example from our file:**
```yaml
arterial:
  "aortic arch":
    - "brachiocephalic trunk"
    - "left common carotid artery"
    - "left subclavian artery"
    - "descending aorta"
```

**Computer Science Validation:**
- Standard graph representation technique
- Optimal for sparse graphs (O(V + E) space complexity)
- Efficient for tree traversal algorithms
- Used in countless graph algorithms and textbooks

### D. Centerline-Based Representation (VMTK)

**Vascular Modeling Toolkit (VMTK)** - For medical imaging research

**Approach:**
- Centerlines as weighted shortest paths on Voronoi diagrams
- Binary tree representations of vascular meshes
- VTP (VTK PolyData) format with radius arrays

**Use Case:** 3D reconstruction from medical imaging (CT, MRI)

**Why We Don't Need This:**
- Designed for imaging analysis, not education
- Requires 3D mesh data
- Overkill for pathway validation

---

## 2. Visualization Approaches in Medical Education

### Commercial 3D Anatomy Platforms

1. **Complete Anatomy (3D4Medical)** - https://3d4medical.com
   - Interactive 3D models with complete arterial/venous systems
   - Quiz functionality (Drag & Drop, Multiple Choice)
   - Mini anatomy models

2. **BioDigital Human** - https://www.biodigital.com
   - Interactive 3D visualization
   - Used by 5+ million students and clinicians

3. **Anatomage Table** - https://anatomage.com/table
   - Fully traced, functionally connected vessel systems
   - Real-human-based digitized cadavers

4. **Visible Body** - https://www.visiblebody.com
   - Interactive 3D anatomy content

5. **Kenhub** - https://www.kenhub.com
   - Blood vessel diagrams and quizzes
   - Basic/advanced identification practice
   - "Intelligent mix" question banks

### Common Visualization Methods

1. **Tree/Hierarchical Diagrams**
   - Show parent-child vessel relationships
   - Top-down flow from heart to extremities

2. **Network Graphs**
   - Nodes = vessels
   - Edges = connections
   - Can highlight pathways

3. **3D Anatomical Models**
   - Color-coded systems (red=arterial, blue=venous)
   - Spatial context and anatomical relationships

4. **Flowcharts**
   - Sequential pathway tracing
   - Good for blood flow circuits

5. **Schematic Vessel Maps**
   - 2D simplified representations
   - Focus on connections over anatomy

6. **Interactive Labeling Challenges**
   - Click-to-identify practice
   - Pathway tracing exercises

### Research Finding on Effectiveness

Virtual reality and 3D visualization is more effective than traditional methods because users understand:
- Size relationships
- Position in 3D space
- Spatial connections between vessels

---

## 3. Standards and Ontologies

### A. Foundational Model of Anatomy (FMA)

**Overview:**
- Reference ontology for biomedical informatics
- Documents structural organization of entire human body
- Maintained by University of Washington

**Vessel Coverage:**
- Over 17,594 vessels with arterial supply information
- Blood vessels classified as "Organ part"
- Hierarchical organization using four principles:
  - Constitutional part
  - Regional part
  - Direct Subclass
  - Direct Instance

**Format:** RDF/OWL (semantic web formats)

**Access:** NCBO BioPortal - https://bioportal.bioontology.org/ontologies/FMA

**Status:** No longer actively updated, but widely referenced in medical informatics

**Vessel ID Format:** "FMA:NNNNN" (e.g., "FMA:3734" for aorta)

**Comparison to UBERON:**
- FMA has more complete vessel list
- But limited microvasculature coverage
- UBERON focuses on cross-species anatomy

**Our Use Case:**
- FMA is research-grade, comprehensive
- Overkill for undergraduate pathway quizzes
- Could add FMA IDs as metadata if desired

### B. Graph Theory Classification

**Vascular structures are represented as:**

1. **Directed Acyclic Graphs (DAGs)**
   - Parent-child hierarchical relationships
   - No cycles in ideal trees
   - Used in Gene Ontology and biological hierarchies

2. **Actually: Directed Graphs (with cycles)**
   - Anastomoses create alternative pathways
   - Venous systems especially have redundancy
   - Circle of Willis is prime example

3. **Weighted Graphs**
   - Nodes = vessels or bifurcations
   - Edges = connections between vessels
   - Weights can represent diameter, length, flow resistance

---

## 4. Best Practices for Representing Branching Vascular Structures

### Key Principles from Research

1. **Tree Assumption**
   - Arterial systems generally follow tree topology
   - One inlet (heart), multiple outlets (capillary beds)
   - No loops in idealized model

2. **Venous Exception**
   - Venous systems often violate tree assumption
   - Anastomoses and redundant pathways common
   - Multiple drainage routes to heart

3. **Bifurcation/N-furcation Handling**
   - Each junction treated as a node
   - Multiple children allowed per parent
   - Reference points where vessels intersect/branch

4. **Endpoint Representation**
   - Terminal vessels should have clear endpoints
   - Empty connection lists indicate termination
   - Can include descriptive endpoints (e.g., "right hand", "right foot")

5. **Hierarchical Organization**
   - Start with major vessels (heart → aorta)
   - Progress distally through smaller branches
   - Maintain clear parent-child relationships

6. **Metadata Association**
   - Vessel type/subtype (elastic artery, muscular artery, vein)
   - Anatomical region
   - Functional role
   - Clinical significance

### Our Current Approach Analysis

**What We Do Well:**
- ✅ Clear hierarchical organization (heart → aorta → branches)
- ✅ Separated arterial and venous trees
- ✅ Empty arrays for terminal vessels
- ✅ Descriptive endpoints ("right hand", "right foot")
- ✅ Comments for documentation
- ✅ Bilateral symmetry (separate left/right sides)

**What Caused Problems:**
- ⚠️ Shortcuts mixed with direct connections
- ⚠️ Easy to create anatomically impossible paths
- ⚠️ No validation that shortcuts are legitimate

**Solution:**
- Remove shortcuts (simplest, most accurate)
- OR separate primary vs. accepted connections
- OR add validation testing for shortcuts

---

## 5. Handling Shortcuts and Anastomoses

### What Are Anastomoses?

**Definition:** Connections between vessels that create alternative pathways

**Function:**
- Backup routes in collateral circulation
- Allow blood flow if one pathway blocked/compromised
- Critical in disease states (stroke, peripheral artery disease)

**Common Locations:**
- Circle of Willis (cerebral circulation)
- Palmar arches (hand)
- Plantar arches (foot)
- Abdominal collaterals

### Circle of Willis: Key Teaching Case

**Structure:**
- Arterial polygon connecting anterior/posterior cerebral circulation
- Includes communicating arteries (anterior, posterior)

**Clinical Reality:**
- Only 20-25% of people have complete, functional circle
- Anatomically present ≠ functionally effective
- Variations extremely common

**Teaching Implication:**
- Students should know the "textbook" complete version
- But understand it's an idealization

**Our Implementation:**
- Includes anterior/posterior communicating branches
- Shows connections between cerebral arteries
- Allows validation of alternative pathways

### Representation Strategies

#### 1. Explicit Connections (Our Original Approach)

```yaml
"aorta":
  - "brachiocephalic trunk"  # shortcut (via aortic arch)
  - "left common carotid artery"  # shortcut (via aortic arch)
```

**Advantages:**
- Shows both direct and shortcut pathways
- Comments indicate these are shortcuts
- Flexible pathway validation

**Disadvantages:**
- Error-prone (easy to create impossible paths)
- Mixes two different types of connections
- Hard to validate correctness

#### 2. Separated Primary/Accepted Paths (Better)

```yaml
"aorta":
  primary:
    - "aortic arch"  # Expected student answer
  accepted:
    - "brachiocephalic trunk"  # Also valid (skips arch)
    - "left common carotid artery"
    - "descending aorta"
```

**Advantages:**
- Clear distinction between standard and shortcut paths
- Can score differently (primary = full credit, accepted = partial)
- Harder to accidentally create invalid paths

#### 3. No Shortcuts (Simplest - Our Current Direction)

```yaml
"aorta":
  - "aortic arch"

"aortic arch":
  - "brachiocephalic trunk"
  - "left common carotid artery"
  - "left subclavian artery"
  - "descending aorta"
```

**Advantages:**
- Anatomically accurate
- No room for error
- Forces students to know complete pathway

**Disadvantages:**
- Students must type more vessel names
- May penalize correct but simplified answers

### Educational Considerations

**Beginning Students:**
- Restrict to "canonical" pathways only
- Build solid foundation before introducing variations

**Advanced Students:**
- Should learn about anastomoses and collaterals
- Understand clinical significance of alternative pathways

**Clinical Context:**
- Shortcuts become critical in disease states
- Collateral circulation can be life-saving

**Our Implementation Choice:**
- Currently removing shortcuts for accuracy
- Can add back selectively with proper structure
- Prioritize correctness over flexibility

---

## 6. Tools, Libraries, and Formats

### 3D Visualization Libraries

1. **VTK (Visualization Toolkit)**
   - Open-source for 3D computer graphics
   - Used by medical imaging software

2. **VMTK (Vascular Modeling Toolkit)**
   - Collection of libraries for vessel image-based modeling
   - GitHub: https://github.com/vmtk/vmtk

3. **ITK (Insight Segmentation and Registration Toolkit)**
   - Image analysis for medical applications

### Data Formats

| Format | Use Case | Advantages | Disadvantages |
|--------|----------|------------|---------------|
| **CSV** | HRA-VCCF standard | Widely compatible, simple | Less readable for nested data |
| **JSON** | APIs, data interchange | JavaScript native | No comments, less readable |
| **YAML** | Configuration, education | Most readable, supports comments | Indentation-sensitive |
| **XML** | Legacy systems | Structured, validated | Verbose, harder to read |
| **RDF/OWL** | Ontologies (FMA) | Semantic web standard | Complex, overkill for education |
| **VTP/VTK** | 3D meshes | Visualization-ready | Imaging-specific |

**Our Choice: YAML**
- Best for human readability
- Supports comments for documentation
- Works great with git
- Perfect for educational transparency

### Graph Visualization Libraries (for future use)

- **Cytoscape.js** - JavaScript network visualization
- **Mermaid** - Markdown-based diagrams
- **D3.js** - Data-driven visualizations
- **vis.js** - Dynamic network graphs

### Graph Processing Tools

- **Neo4j** - Graph database (overkill for our scale)
- **NetworkX** (Python) - Graph analysis and algorithms
- **Cytoscape** - Network visualization for biological research

---

## 7. Recommendations for Our Use Case

### Context: Student Quiz Validation of Vessel Pathways

**Our Goals:**
1. Validate student-traced pathways are anatomically correct
2. Provide clear feedback on where pathways break
3. Award partial credit for partially correct paths
4. Educational transparency (students can review the data)
5. Easy for instructors to maintain and update

### Keep Current Structure

**Our YAML adjacency list approach is excellent for our use case.**

**Why:**
- ✅ Human-readable (non-programmers can edit)
- ✅ Version control friendly (git works perfectly)
- ✅ Comments supported (document decisions)
- ✅ Easy to validate correctness
- ✅ Transparent for students and educators
- ✅ No special tools required
- ✅ Matches industry standard approaches (HRA-VCCF uses equivalent structure)

### Minor Enhancements to Consider

#### Option A: Separate Primary/Accepted Paths (if shortcuts needed)

```yaml
arterial:
  "aorta":
    primary:  # Standard teaching pathway
      - "aortic arch"
    accepted:  # Also anatomically valid
      - "ascending aorta"  # More specific term
```

#### Option B: Add Metadata (optional)

```yaml
metadata:
  version: "1.0"
  date: "2025-10-13"
  source: "Gray's Anatomy, 42nd Edition"
  difficulty_level: "undergraduate"

vessel_metadata:
  "aorta":
    fma_id: "FMA:3734"
    region: "thorax"
    vessel_type: "elastic_artery"
    diameter_mm: "25-30"
```

#### Option C: Companion Files (if structure grows)

```
data/
  vessel-connections.yml        # Core connection tree (keep as-is)
  vessel-metadata.yml           # Additional properties (optional)
  vessel-pathways-quiz.yml      # Pre-defined quiz questions
  vessel-validation-rules.yml   # Special validation logic (optional)
```

### Validation Logic Recommendations

1. **Pathfinding Algorithm:** Use breadth-first search (BFS) or depth-first search (DFS)
2. **Multiple Solutions:** Accept any valid path from start to end
3. **Distance Scoring:** Shorter anatomically correct paths = better scores
4. **Partial Credit:** Award points for correct intermediate vessels
5. **Fuzzy Matching:** Handle typos and name variations (already implemented)

### Difficulty Levels (if desired)

- **Easy:** Must use only direct connections (no shortcuts)
- **Medium:** Can use documented shortcuts
- **Hard:** Must identify collateral pathways and anastomoses

### What We DON'T Need

- ❌ Graph database (Neo4j) - overkill for our scale
- ❌ 3D visualization - separate feature, not for validation
- ❌ FMA integration - research-grade, not needed for undergrad
- ❌ Centerline algorithms - that's for medical imaging
- ❌ Migration to JSON - YAML is better for education
- ❌ Complex ontology systems - too much overhead

### Visualization Recommendation

**Purpose:** Verify anatomical accuracy of vessel connections and provide study tool for students

#### Recommended Approach: Interactive Network Graph

**Best Tool: Cytoscape.js or vis.js**

**Why:**
- ✅ JavaScript-based (works in browser, no installation)
- ✅ Interactive (zoom, pan, click to explore)
- ✅ Hierarchical layout algorithms built-in
- ✅ Can load YAML/JSON directly
- ✅ Color-code by system (red=arterial, blue=venous)
- ✅ Filter by body region (upper limb, lower limb, etc.)
- ✅ Highlight pathways when testing

**Implementation:**
```html
<!-- Simple standalone HTML file -->
<script src="https://unpkg.com/cytoscape/dist/cytoscape.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js"></script>

<div id="cy"></div>

<script>
// Load vessel-connections.yml
// Convert to graph nodes/edges
// Render with hierarchical layout
// Add filters for arterial/venous
</script>
```

**Features to Include:**
1. **Dual View:** Side-by-side arterial and venous trees
2. **Region Filtering:** Show only upper limb, lower limb, head/neck, abdomen
3. **Pathway Highlighting:** Click two vessels, shows all valid paths between them
4. **Validation Mode:** Highlight any isolated nodes or broken connections
5. **Export:** Save as PNG/SVG for study materials

**Alternative: Mermaid Diagrams**

If interactive isn't needed, generate static flowcharts:

```yaml
# Convert vessel-connections.yml to Mermaid syntax
graph TD
  Heart[Heart] --> Aorta[Aorta]
  Aorta --> AorticArch[Aortic Arch]
  AorticArch --> Brachiocephalic[Brachiocephalic Trunk]
  AorticArch --> LeftCarotid[Left Common Carotid]
  AorticArch --> LeftSubclavian[Left Subclavian]
  AorticArch --> Descending[Descending Aorta]
```

**Advantages:**
- Simple text-based format
- Renders in GitHub/markdown viewers
- Good for documentation

**Disadvantages:**
- Not interactive
- Gets cluttered with many vessels
- Manual updates when YAML changes

**Recommended Implementation Plan:**

1. **Phase 1: Simple Viewer (2-3 hours)**
   - Load vessel-connections.yml via fetch()
   - Parse YAML to nodes/edges
   - Render with Cytoscape.js hierarchical layout
   - Add arterial (red) vs venous (blue) coloring

2. **Phase 2: Filters (1-2 hours)**
   - Toggle arterial/venous visibility
   - Filter by region (dropdown menu)
   - Search/highlight specific vessel

3. **Phase 3: Validation (2-3 hours)**
   - Check for isolated nodes (vessels with no connections)
   - Verify bilateral symmetry (left/right pairs)
   - Highlight any empty connection lists (terminal vessels)
   - Show vessel count statistics

4. **Phase 4: Study Tool (optional)**
   - Click two vessels → show all valid paths
   - Quiz mode: highlight random pathway, student names vessels
   - Export diagram as image

**Example Visualization Libraries:**

| Library | Complexity | Best For |
|---------|-----------|----------|
| **Cytoscape.js** | Medium | Full-featured network graphs |
| **vis.js** | Low | Quick interactive networks |
| **D3.js** | High | Custom visualizations |
| **Mermaid** | Very Low | Static diagrams in markdown |

**Recommended: Start with vis.js** (simpler than Cytoscape, good enough for validation)

**Sample Code Structure:**
```javascript
// Load YAML
const response = await fetch('data/vessel-connections.yml');
const yamlText = await response.text();
const data = jsyaml.load(yamlText);

// Convert to vis.js format
const nodes = [];
const edges = [];

// Process arterial connections
for (const [vessel, connections] of Object.entries(data.arterial)) {
  nodes.push({ id: vessel, label: vessel, color: '#ff6b6b' });
  for (const nextVessel of connections) {
    edges.push({ from: vessel, to: nextVessel, arrows: 'to' });
  }
}

// Process venous connections (blue)
for (const [vessel, connections] of Object.entries(data.venous)) {
  nodes.push({ id: vessel, label: vessel, color: '#4ecdc4' });
  for (const nextVessel of connections) {
    edges.push({ from: vessel, to: nextVessel, arrows: 'to' });
  }
}

// Render
const network = new vis.Network(container, { nodes, edges }, {
  layout: { hierarchical: { direction: 'UD', sortMethod: 'directed' } }
});
```

**Use Cases:**

1. **Data Verification:** Visually inspect connections for anatomical errors
2. **Student Study Tool:** Interactive exploration of vessel pathways
3. **Documentation:** Export diagrams for teaching materials
4. **Testing:** Validate that known correct pathways exist in the graph

**Would This Help?**

A visualization tool would let you:
- Quickly spot anatomical errors (like the descending aorta → femoral shortcut)
- Verify bilateral symmetry (left/right sides match)
- See the full scope of connections at a glance
- Identify isolated or disconnected vessels
- Generate study materials for students

**Next Step:** Create a simple vessel-visualizer.html file that loads and displays your vessel-connections.yml as an interactive network graph.

---

## 8. Lessons Learned

### The Shortcuts Problem

**What Happened:**
- Added shortcuts to allow students to skip intermediate vessels
- Mixed shortcuts with direct connections in same lists
- Created anatomically impossible paths (e.g., descending aorta → femoral artery)
- Error-prone structure

**Why It Happened:**
- Seemed helpful to allow flexibility
- Comments weren't enough to prevent errors
- No validation that shortcuts were legitimate

**Solution:**
- Remove shortcuts entirely (simplest, most accurate)
- Require students to name all intermediate vessels
- Prioritize anatomical accuracy over convenience

**Future Consideration:**
- If shortcuts needed, use separate primary/accepted structure
- Add validation tests for shortcuts
- Document clinical reasoning for each shortcut

### Anatomical Reality vs. Teaching Simplification

**Reality:**
- Anastomoses exist (Circle of Willis, palmar arches)
- Multiple valid pathways are anatomically correct
- Variations are common in real anatomy

**Teaching:**
- Need "canonical" pathway for beginners
- Advanced students should learn variations
- Balance accuracy with learning level

**Our Approach:**
- Start with canonical pathways only
- Can add variations later with proper structure
- Document reasoning for any shortcuts

### Data Structure Validation

**Need:**
- Automated tests to verify connections are anatomically valid
- Catch impossible shortcuts before they reach students
- Regression tests when updating vessel data

**Implementation Ideas:**
- Script to check all connections are bidirectionally valid
- Test that known correct pathways validate successfully
- Alert when shortcuts skip too many intermediate vessels

---

## 9. Conclusion

### Our Approach is Validated by Research

**Key Findings:**
1. ✅ YAML adjacency list is industry-standard approach
2. ✅ Matches how medical databases (HRA-VCCF) structure vessel data
3. ✅ Follows graph theory best practices
4. ✅ Appropriate for educational pathway validation
5. ✅ Human-readable and maintainable

### Current State

**Strengths:**
- Solid data structure foundation
- Anatomically organized (arterial/venous separate)
- Clear hierarchical relationships
- Well-documented with comments

**Recent Improvements:**
- Removed error-prone shortcuts from descending aorta
- Removed venous shortcuts to heart
- More anatomically accurate pathways

**Next Steps:**
- Consider adding vessel metadata (optional)
- Create visualization tool for verification
- Add automated validation tests
- Document any remaining shortcuts with clinical reasoning

### Bottom Line

**Keep the current YAML adjacency list approach.** It's well-designed for educational pathway validation, matches medical database standards, and prioritizes transparency and maintainability. The research validates that we're on the right track.

---

## 10. References and Resources

### Standards & Databases

- **HRA-VCCF Repository:** https://github.com/hubmapconsortium/hra-vccf
- **HRA-VCCF Data (Zenodo):** https://zenodo.org/records/7542316
- **FMA Ontology (BioPortal):** https://bioportal.bioontology.org/ontologies/FMA
- **Nature Publication:** Börner et al. (2023) "HRA-VCCF: A comprehensive database of the human vasculature" *Nature Scientific Data*

### Visualization Tools

- **VMTK:** https://github.com/vmtk/vmtk
- **BioDigital Human:** https://www.biodigital.com
- **Complete Anatomy:** https://3d4medical.com
- **Anatomage Table:** https://anatomage.com/table
- **Visible Body:** https://www.visiblebody.com
- **Kenhub:** https://www.kenhub.com

### Educational Resources

- **TeachMeAnatomy:** https://teachmeanatomy.info
- **SEER Training (NIH):** https://training.seer.cancer.gov

### Technical Documentation

- **Neo4j Healthcare:** https://neo4j.com/developer/life-sciences-and-healthcare
- **YAML Specification:** https://yaml.org
- **Graph Theory:** Introduction to Algorithms (CLRS)

### Search Terms Used

- "blood vessel tree data structure medical education"
- "vascular anatomy database format"
- "vessel connection graph representation"
- "medical ontology FMA vessels"
- "HRA vasculature database"
- "vessel pathway visualization education"
- "anastomoses data representation"
- "anatomical graph database"
- "VMTK vascular modeling"
- "vessel centerline representation"
