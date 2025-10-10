# Testing & Validation

## Overview
This project uses automated YAML validation to ensure data integrity before deployment. The validation suite runs via GitHub Actions on every push to prevent broken content from reaching production.

## Running Tests Locally

### Run all validations
```bash
npm test
```

### Run specific validators
```bash
npm run validate-yaml    # Validate practical YAML files
npm run validate-exam     # Validate exam YAML files
npm run validate-images   # Check all image references exist
```

## What Gets Validated

### Practical Files (`unit2-practical.yml`, etc.)
- ✅ Valid YAML syntax
- ✅ Required fields present (`id`, `question`, `answer`)
- ✅ Point values are numbers
- ✅ Tags are arrays
- ⚠️ Warns about incomplete questions (empty fields)

### Exam Files (`unit2-exam.yml`, `unit2-exam-pdf.yml`)
- ✅ Valid YAML syntax
- ✅ Multiple choice questions have:
  - Question text
  - Options array (at least 2 options)
  - Valid `correct` index (within bounds)
- ✅ True/Make True questions have:
  - Statement text
  - `isTrue` boolean field
  - `correctWord` if `isTrue: false`
- ✅ Essay questions have:
  - Question text
  - Sample answer
  - Point value
- ✅ Table questions have:
  - Question text
  - Headers array
  - Answer array
  - Point value
- ✅ All referenced images exist in `/images` directory

### Image References
- Checks that every image path in YAML files exists on disk
- Handles both formats: `"images/path/to/image.jpg"` and `"path/to/image.jpg"`

## CI/CD Integration

### GitHub Actions Workflow
Location: `.github/workflows/validate-yaml.yml`

**Triggers:**
- Push to `main` branch with changes to `data/**/*.yml`
- Pull requests targeting `main`

**What happens:**
1. Checks out code
2. Installs Node.js dependencies
3. Runs all three validators
4. ❌ **Blocks deployment** if validation fails
5. ✅ Allows deployment if all validations pass

### Critical Files
These files MUST pass validation for deployment to succeed:
- `unit2-exam.yml`
- `unit2-exam-pdf.yml`

Work-in-progress files (like `exam1-practice-v2.yml`) can have issues without blocking deployment.

## Common Errors & Fixes

### YAML Syntax Errors

**Error:**
```
❌ YAML parsing error:
bad indentation of a mapping entry (15:41)
```

**Fix:** Check the line number indicated. Common issues:
- Missing quotes around values containing colons (`:`)
- Inconsistent indentation (mix of tabs and spaces)
- Unescaped special characters

**Example:**
```yaml
# ❌ Wrong (colon in value needs quotes)
info: The hormone: oxytocin

# ✅ Correct
info: "The hormone: oxytocin"
```

### Out of Bounds `correct` Index

**Error:**
```
❌ MC Q5: correct index 4 is out of bounds for 4 options
```

**Fix:** The `correct` field is 0-indexed. If you have 4 options (indices 0-3), the max value for `correct` is 3.

```yaml
options:
  - "Option A"  # index 0
  - "Option B"  # index 1
  - "Option C"  # index 2
  - "Option D"  # index 3
correct: 2      # ✅ Valid (0-3)
# correct: 4    # ❌ Out of bounds!
```

### Missing Image

**Error:**
```
❌ unit2-exam.yml Essay Q4: Image not found at images/exam-2/wiggers.jpg
```

**Fix:** Either:
1. Add the missing image to the `images/` directory
2. Remove or correct the `image:` field in the YAML

## Pre-Commit Hook

A pre-commit hook is installed that automatically runs validation when you commit changes to YAML files in the `data/` directory.

**How it works:**
```bash
git add data/unit2-exam.yml
git commit -m "Add new exam questions"
# → Automatically runs npm test
# → If validation fails, commit is blocked
# → If validation passes, commit succeeds
```

**What gets checked:**
- Only runs when `data/**/*.yml` or `data/**/*.yaml` files are staged
- Skips validation for non-YAML changes (faster commits)
- Shows clear error messages if validation fails

**Bypassing the hook (not recommended):**
```bash
git commit --no-verify -m "Skip validation"
```

## Best Practices

1. **Edit YAML → Commit → Push** (hook runs automatically)
   ```bash
   # Edit your YAML file
   vim data/unit2-exam.yml

   # Commit (validation runs automatically)
   git add data/unit2-exam.yml
   git commit -m "Add new exam questions"

   # Push if validation passed
   git push
   ```

2. **Manual testing (optional)**
   ```bash
   # You can still run tests manually before committing
   npm test
   ```

2. **Always quote values with special characters**
   - Colons (`:`)
   - Quotes (`"` or `'`)
   - Hash symbols (`#`)
   - Ampersands (`&`)

3. **Use consistent indentation**
   - 2 spaces (no tabs)
   - Enable "show whitespace" in your editor

4. **Test locally before pushing**
   - GitHub Actions will catch errors, but it's faster to catch them locally
   - Run `npm test` as part of your workflow

## Adding New Validators

To add a new validation check:

1. Update the appropriate validator script:
   - `scripts/validate-yaml.js` - For practical files
   - `scripts/validate-exam-yaml.js` - For exam files
   - `scripts/check-images.js` - For image references

2. Add any new script to `package.json`:
   ```json
   "scripts": {
     "validate-new-thing": "node scripts/validate-new-thing.js"
   }
   ```

3. Update `.github/workflows/validate-yaml.yml` to run the new validator

4. Update this documentation
