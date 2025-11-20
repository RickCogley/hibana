# Hibana v1.2.0 - Extraction Summary

**Date**: 2025-11-20
**Extracted from**: eSolia 2025 project
**Status**: Phase 1 Complete - Ready for Testing

---

## What Was Extracted

### 🟢 High Priority Modules (7 modules)

#### 1. **Temporal Date Filter** (`filters/temporal_date.ts`)
- **Lines**: 176
- **Extracted from**: `esolia-2025/_config.ts:719-808`
- **Purpose**: Modern date formatting using Temporal API
- **Features**:
  - Timezone-aware (configurable default)
  - Multiple formats: full, long, medium, short, iso
  - Locale support
  - Handles Date objects and ISO strings

#### 2. **Markdown Metadata Preprocessor** (`preprocessors/markdown_metadata.ts`)
- **Lines**: 107
- **Extracted from**: `esolia-2025/_config.ts:367-380`
- **Purpose**: Extract excerpts and calculate elapsed days
- **Features**:
  - Configurable excerpt marker (default: `<!-- more -->`)
  - Temporal API-based elapsed days calculation
  - Optional feature toggling

#### 3. **Breadcrumb Schema Generator** (`preprocessors/breadcrumb_schema.ts`)
- **Lines**: 229
- **Extracted from**: `esolia-2025/_config.ts:500-570`
- **Purpose**: Auto-generate Schema.org breadcrumbs
- **Features**:
  - URL path parsing
  - Multilingual support
  - Configurable home names
  - Manual breadcrumb creation helper

#### 4. **Language Alternates Schema Linker** (`preprocessors/language_alternates_schema.ts`)
- **Lines**: 224
- **Extracted from**: `esolia-2025/_config.ts:573-637`
- **Purpose**: Link translated pages via Schema.org
- **Features**:
  - Maps pages by ID across languages
  - Adds `translationOfWork` / `workTranslation` properties
  - Supports multiple schema types per page
  - Manual linking helper function

#### 5. **Font Path Fixer** (`scripts/fix_font_paths.ts`)
- **Lines**: 99
- **Extracted from**: `esolia-2025/_config.ts:690-712`
- **Purpose**: Fix Google Fonts relative paths
- **Features**:
  - Platform-aware (macOS vs Linux sed syntax)
  - Batch processing multiple CSS files
  - Individual command generation option

#### 6. **DOCTYPE Injector** (`scripts/inject_doctype.ts`)
- **Lines**: 116
- **Extracted from**: `esolia-2025/_config.ts:324-343`
- **Purpose**: Inject DOCTYPE into HTML files (Lume 3 workaround)
- **Features**:
  - Platform-aware sed commands
  - Removes duplicates before injecting
  - Event listener or script registration options
  - Configurable verbosity

#### 7. **DOM Utilities Additions** (`utils/dom_utils.ts`)
- **Lines**: 76 (additions)
- **Extracted from**: `esolia-2025/src/js/main.ts:3-24`
- **Purpose**: Accessibility and platform detection
- **Features**:
  - `prefersReducedMotion()` - Check user's motion preference
  - `detectOS()` - Detect operating system
  - `addOSClass()` - Auto-add OS class to body

**Total High Priority**: ~1,027 lines

---

## Module Structure

```
hibana/
├── filters/
│   └── temporal_date.ts          # New
├── preprocessors/
│   ├── breadcrumb_schema.ts      # New
│   ├── language_alternates_schema.ts  # New
│   └── markdown_metadata.ts      # New
├── scripts/
│   ├── fix_font_paths.ts         # New
│   └── inject_doctype.ts         # New
├── utils/
│   └── dom_utils.ts              # Updated (added 3 functions)
├── plugins/
│   ├── css_banner.ts             # Existing
│   └── shuffle.ts                # Existing
├── processors/
│   ├── defer_pagefind.ts         # Existing
│   └── external_links_icon.ts    # Existing
└── mod.ts                         # Updated with new exports
```

---

## Updated Exports in `mod.ts`

### New Exports Added:

**Filters**:
- `temporalDate` (function)
- `TemporalDateOptions` (type)
- `DateFormat` (type)

**Preprocessors**:
- `markdownMetadata` (function)
- `MarkdownMetadataOptions` (type)
- `breadcrumbSchema` (function)
- `createBreadcrumbSchema` (helper function)
- `BreadcrumbSchemaOptions` (type)
- `HomeNames` (type)
- `languageAlternatesSchema` (function)
- `addLanguageAlternate` (helper function)
- `LanguageAlternatesSchemaOptions` (type)

**Scripts**:
- `fixFontPaths` (function)
- `generateFontPathFixes` (helper function)
- `FixFontPathsOptions` (type)
- `injectDoctype` (function)
- `generateDoctypeCommand` (helper function)
- `InjectDoctypeOptions` (type)

**DOM Utils**:
- `prefersReducedMotion` (function)
- `detectOS` (function)
- `addOSClass` (function)
- `OS` (type)

---

## Testing Checklist

### Before Publishing:

- [ ] Run `deno fmt` on all new files
- [ ] Run `deno check` on all TypeScript files
- [ ] Create unit tests for each module
- [ ] Test integration with minimal Lume site
- [ ] Verify Schema.org compliance with Google Rich Results Test
- [ ] Test on both macOS and Linux (sed commands)
- [ ] Generate and review `deno doc` output
- [ ] Update CHANGELOG.md
- [ ] Update version in mod.ts and deno.json

### Testing Priorities:

1. **`temporal_date.ts`** - Test all formats, timezones, locales
2. **`breadcrumb_schema.ts`** - Verify Schema.org compliance
3. **`language_alternates_schema.ts`** - Test with 2+ languages
4. **Platform scripts** - Test on macOS and Linux

---

## Usage Examples

### Quick Start

```ts
// _config.ts
import {
  temporalDate,
  markdownMetadata,
  breadcrumbSchema,
  languageAlternatesSchema,
  fixFontPaths,
  injectDoctype,
} from "hibana/mod.ts";

// Temporal date filter
site.filter("tdate", temporalDate({
  defaultTimezone: "Asia/Tokyo",
}));

// Markdown metadata
site.preprocess([".md"], markdownMetadata({
  excerptMarker: "<!-- more -->",
  calculateElapsed: true,
}));

// SEO Schema
site.preprocess([".md"], breadcrumbSchema({
  baseUrl: "https://example.com",
  homeNames: { en: "Home", ja: "ホーム" },
  languages: ["en", "ja"],
}));

site.preprocess([".md"], languageAlternatesSchema({
  baseUrl: "https://example.com",
  languages: ["en", "ja"],
  schemaFields: ["webPageSchema", "serviceSchema"],
}));

// Build scripts
site.script("fixFonts", fixFontPaths({
  cssFiles: ["fonts-en.css"],
  fontDirs: ["fonts-en"],
}));
site.addEventListener("afterBuild", "fixFonts");

site.addEventListener("afterBuild", injectDoctype());
```

### Client-Side (main.ts)

```ts
import {
  prefersReducedMotion,
  addOSClass,
  loadVendorScript,
  trapFocus,
} from "hibana/utils/dom_utils.ts";

// Add OS class for platform-specific styling
addOSClass();

// Skip animations if user prefers reduced motion
if (!prefersReducedMotion()) {
  setupAnimations();
}

// Existing utilities still work
loadVendorScript("https://cdn.example.com/script.js");
trapFocus(modalElement);
```

---

## Migration Path for eSolia 2025

Once Hibana v1.2.0 is published and tested:

### Step 1: Update Import Map

```json
// deno.json
{
  "imports": {
    "hibana/": "https://deno.land/x/hibana@v1.2.0/"
  }
}
```

### Step 2: Replace Custom Code

#### Date Filter
**Remove** from `_config.ts:719-808`:
```ts
site.filter("tdate", (value, format, lang) => { /* 90 lines */ });
```

**Replace with**:
```ts
import { temporalDate } from "hibana/filters/temporal_date.ts";
site.filter("tdate", temporalDate({ defaultTimezone: "Asia/Tokyo" }));
```

#### Markdown Metadata
**Remove** from `_config.ts:367-380`:
```ts
site.preprocess([".md"], function markdownExcerptAndElapsedDays(pages) { /* ... */ });
```

**Replace with**:
```ts
import { markdownMetadata } from "hibana/preprocessors/markdown_metadata.ts";
site.preprocess([".md"], markdownMetadata());
```

#### And so on for all 7 modules...

**Estimated reduction**: ~400-500 lines from eSolia 2025 codebase

---

## Known Limitations & Notes

1. **Temporal API Requirement**: Requires Deno 1.40+ or Node 20+ with Temporal polyfill
2. **Platform-Specific**: `fixFontPaths` and `injectDoctype` require `sed` command (Unix/Linux/macOS)
3. **Lume Version**: Tested with Lume 3.x, may need adjustments for Lume 2.x
4. **Schema.org**: Assumes specific schema field names in frontmatter

---

## Next Steps

1. ✅ Code extraction complete
2. ⏳ Write unit tests
3. ⏳ Test with minimal Lume site
4. ⏳ Generate documentation
5. ⏳ Update README
6. ⏳ Update CHANGELOG
7. ⏳ Commit and tag v1.2.0
8. ⏳ Publish to deno.land/x
9. ⏳ Test integration in eSolia 2025
10. ⏳ Write blog post / announcement

---

## Files Created

- `filters/temporal_date.ts` (176 lines)
- `preprocessors/markdown_metadata.ts` (107 lines)
- `preprocessors/breadcrumb_schema.ts` (229 lines)
- `preprocessors/language_alternates_schema.ts` (224 lines)
- `scripts/fix_font_paths.ts` (99 lines)
- `scripts/inject_doctype.ts` (116 lines)
- `utils/dom_utils.ts` (76 lines added)
- `mod.ts` (updated with new exports)
- `EXTRACTION_SUMMARY.md` (this file)

**Total new code**: ~1,027 lines across 7 modules

---

**Status**: ✅ Extraction complete, ready for testing and documentation phase
