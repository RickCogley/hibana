# Hibana Release Guide

This guide outlines the complete process for releasing a new version of Hibana
to deno.land/x.

## Overview

Hibana uses a webhook-based publishing workflow:

1. Create a GitHub release with a version tag
2. GitHub webhook automatically publishes to deno.land/x
3. Users can import via `https://deno.land/x/hibana@v{VERSION}/`

**Important**: Hibana cannot be published to JSR because Lume uses https
imports, which JSR does not support. This is intentional and should not be
changed.

## Pre-Release Checklist

### 1. Version Number Decision

Follow [Semantic Versioning](https://semver.org/):

- **Major (x.0.0)**: Breaking changes, incompatible API changes
- **Minor (1.x.0)**: New features, backward-compatible functionality
- **Patch (1.2.x)**: Bug fixes, backward-compatible fixes

### 2. Update Version References

Update the version number in these files:

#### `deno.json`

```json
{
  "name": "@rick/hibana",
  "version": "1.2.2",  // ← Update this
  ...
}
```

#### `mod.ts` (JSDoc header)

```typescript
/**
 * | Hibana | Specifications |
 * | ------- | ------- |
 * | **Version** | 1.2.2 |  // ← Update this
 * ...
 */
```

#### `README.md` (Installation section)

```markdown
{ "imports": { "hibana/": "https://deno.land/x/hibana@v1.2.2/" // ← Update this
} }
```

And:

```markdown
{ "imports": { "hibana/":
"https://raw.githubusercontent.com/RickCogley/hibana/v1.2.2/" // ← Update this }
}
```

### 3. Update CHANGELOG.md

Add a new section following [Keep a Changelog](https://keepachangelog.com/)
format:

```markdown
## [1.2.2] - 2025-11-23

### Added

- New feature descriptions

### Changed

- Modified functionality descriptions

### Fixed

- Bug fix descriptions

### Removed

- Deprecated feature removals
```

Update the comparison links at the bottom:

```markdown
[Unreleased]: https://github.com/RickCogley/hibana/compare/v1.2.2...HEAD
[1.2.2]: https://github.com/RickCogley/hibana/compare/v1.2.1...v1.2.2
```

### 4. Update README.md

- Add documentation for any new features
- Update examples if API changed
- Verify all code examples work with new version
- Check that feature list is complete

### 5. Run Preflight Checks

Execute all quality checks:

```bash
# Format code
deno fmt

# Type check all TypeScript files
deno check **/*.ts

# Lint code
deno lint

# Run test suite
deno test --allow-read --unstable-temporal

# Generate API documentation
deno task doc
# or manually:
deno doc --html --name=Hibana --output=docs/api mod.ts
```

**All checks must pass** before proceeding.

### 6. Review Generated API Documentation

Check the generated files in `docs/api/`:

```bash
ls docs/api/
```

Verify:

- All public APIs are documented
- JSDoc comments render correctly
- Type signatures are accurate
- Examples are present and clear

### 7. Test Installation Locally

Test that the module can be imported:

```bash
# Create a test file
cat > test_import.ts << 'EOF'
import { cssBanner, shuffle, ventoHeadingAnchors } from "./mod.ts";
console.log("Import successful!");
EOF

# Run it
deno run test_import.ts

# Clean up
rm test_import.ts
```

### 8. Security Review

- Review changes for OWASP Top 10 vulnerabilities
- Check for hardcoded secrets or tokens
- Verify input validation in new code
- Ensure no `eval()` or dangerous dynamic code execution
- Review dependency updates for vulnerabilities

## Release Process

### 1. Commit All Changes

```bash
# Stage all changes
git add .

# Commit with conventional commit format
git commit -m "chore: prepare release v1.2.2

- Update version in deno.json, mod.ts, README.md
- Update CHANGELOG.md with release notes
- Regenerate API documentation"
```

### 2. Push to GitHub

```bash
# Push to main branch
git push origin main
```

### 3. Create GitHub Release

#### Via GitHub Web UI:

1. Go to https://github.com/RickCogley/hibana/releases
2. Click "Draft a new release"
3. Click "Choose a tag"
4. Type new tag: `v1.2.2` (must start with 'v')
5. Click "Create new tag: v1.2.2 on publish"
6. Set release title: `v1.2.2`
7. Copy changelog content into description
8. Click "Publish release"

#### Via GitHub CLI (`gh`):

```bash
# Create release with tag
gh release create v1.2.2 \
  --title "v1.2.2" \
  --notes "$(sed -n '/## \[1.2.2\]/,/## \[/p' CHANGELOG.md | head -n -1)"
```

### 4. Verify Publication

Wait 1-2 minutes for the webhook to process, then verify:

```bash
# Check deno.land/x listing
curl https://cdn.deno.land/hibana/versions.json | jq '.versions[0]'

# Test import from deno.land/x
deno eval "import { shuffle } from 'https://deno.land/x/hibana@v1.2.2/mod.ts'; console.log('✓ Published successfully');"
```

Visit: https://deno.land/x/hibana@v1.2.2

### 5. Update Unreleased Section

After successful release, prepare for next development cycle:

```markdown
## [Unreleased]

(No changes yet)
```

Commit:

```bash
git add CHANGELOG.md
git commit -m "docs: reset unreleased section in changelog"
git push origin main
```

## Post-Release Verification

### Test Installation in Real Project

Create a test Lume project:

```bash
mkdir /tmp/test-hibana
cd /tmp/test-hibana

# Create deno.json
cat > deno.json << EOF
{
  "imports": {
    "lume/": "https://deno.land/x/lume@v3.1.2/",
    "hibana/": "https://deno.land/x/hibana@v1.2.2/"
  }
}
EOF

# Create _config.ts
cat > _config.ts << 'EOF'
import lume from "lume/mod.ts";
import { shuffle, cssBanner } from "hibana/mod.ts";

const site = lume();
site.use(shuffle());
site.use(cssBanner({ message: "Test banner" }));

export default site;
EOF

# Test import
deno run --allow-read _config.ts
```

### Check API Documentation Site

If you have a documentation site (e.g., https://hibana.esolia.deno.net), verify:

- Documentation reflects new version
- Examples work
- Links are not broken

## Rollback Procedure

If critical issues are discovered after release:

### Option 1: Quick Patch Release

1. Fix the issue
2. Increment patch version (e.g., 1.2.2 → 1.2.3)
3. Follow full release process above

### Option 2: Delete Release (Not Recommended)

GitHub releases can be deleted, but:

- Tag remains in git history
- deno.land/x may cache the version
- Users may have already imported it

**Better approach**: Release a fixed version immediately.

## Troubleshooting

### Webhook Not Triggering

**Symptom**: Release created but not appearing on deno.land/x

**Solutions**:

1. Check webhook status: https://github.com/RickCogley/hibana/settings/hooks
2. Verify tag format starts with 'v' (e.g., `v1.2.2`)
3. Wait 5-10 minutes (webhook can be slow)
4. Check deno.land/x webhook logs

### Import Errors After Release

**Symptom**: Users report import errors

**Checks**:

1. Verify tag exists: `git tag -l | grep v1.2.2`
2. Check file permissions in repository
3. Verify mod.ts exports are correct
4. Test fresh deno cache:
   `deno cache --reload https://deno.land/x/hibana@v1.2.2/mod.ts`

### Version Mismatch

**Symptom**: Different version numbers in different files

**Fix**:

```bash
# Search all version references
rg "1\.2\.1" --type md --type json --type ts

# Update all occurrences
# Then create a patch release with correct versions
```

## Release Cadence

Recommended release schedule:

- **Patch releases**: As needed for critical bugs
- **Minor releases**: When new features are stable and documented
- **Major releases**: When breaking changes are necessary (rare)

## Communication

After release, consider:

1. Updating dependent projects that use Hibana
2. Posting release notes on social media (if applicable)
3. Notifying users in issue tracker if release addresses specific issues

## Reference Links

- **Repository**: https://github.com/RickCogley/hibana
- **deno.land/x**: https://deno.land/x/hibana
- **Semantic Versioning**: https://semver.org/
- **Keep a Changelog**: https://keepachangelog.com/
- **Conventional Commits**: https://www.conventionalcommits.org/
