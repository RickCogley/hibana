# Hibana Lume Helpers

The `hibana` library provides a comprehensive collection of Lume helper plugins,
processors, filters, preprocessors, scripts, and utility functions designed to
enhance Lume static site generation projects.

| Hibana           | Specifications                                                                   |
| ---------------- | -------------------------------------------------------------------------------- |
| **Version**      | 1.3.0                                                                            |
| **Repository**   | [https://github.com/RickCogley/hibana](https://github.com/RickCogley/hibana)     |
| **API Docs**     | [https://hibana-docs.esolia.workers.dev](https://hibana-docs.esolia.workers.dev) |
| **Distribution** | [https://deno.land/x/hibana](https://deno.land/x/hibana)                         |
| **License**      | MIT                                                                              |
| **Author**       | Rick Cogley                                                                      |

## Installation

Add `hibana` to your Lume project's `deno.json` import map:

```json
{
  "imports": {
    "lume/": "https://deno.land/x/lume@v3.1.2/",
    "hibana/": "https://deno.land/x/hibana@v1.3.0/"
  }
}
```

Or import directly from GitHub:

```json
{
  "imports": {
    "hibana/": "https://raw.githubusercontent.com/RickCogley/hibana/v1.3.0/"
  }
}
```

## Features Overview

### Plugins

- **[cssBanner](#cssbanner)** - Add comment banners to CSS files
- **[shuffle](#shuffle)** - Array shuffle filter for templates

### Processors

- **[deferPagefind](#deferpagefind)** - Defer Pagefind CSS and JS loading
- **[externalLinksIcon](#externallinksicon)** - Add external link icons to
  `target="_blank"` links
- **[ventoHeadingAnchors](#ventoheadinganchors)** - Add anchor links to headings
  in Vento pages
- **[ventoTOC](#ventotoc)** - Generate table of contents from headings in Vento
  pages
- **[ventoTOCInject](#ventotocinject)** - Inject TOC HTML into rendered pages at
  marker position

### Filters

- **[temporalDate](#temporaldate)** - Modern date formatting using Temporal API
  with timezone support

### Preprocessors

- **[markdownMetadata](#markdownmetadata)** - Extract excerpts and calculate
  elapsed days from markdown
- **[breadcrumbSchema](#breadcrumbschema)** - Auto-generate Schema.org
  breadcrumbs from URLs
- **[languageAlternatesSchema](#languagealternatesschema)** - Link translated
  pages via Schema.org

### Scripts

- **[fixFontPaths](#fixfontpaths)** - Fix Google Fonts relative paths in CSS
  files
- **[injectDoctype](#injectdoctype)** - Inject DOCTYPE into HTML files (Lume 3
  workaround)

### Utilities

- **[DOM Utilities](#dom-utilities)** - Client-side helpers for script loading,
  focus trapping, accessibility, and platform detection

---

## API Documentation

### Plugins

#### `cssBanner`

A Lume plugin that prepends a CSS comment banner to all .css files.

This is useful for adding copyright information, build details, or other
metadata to the top of your generated CSS files.

**Parameters:**

- `options`: `CssBannerOptions` - Configuration object
  - `message`: `string` - The message to include in the banner

**Example:**

```ts
// In your Lume _config.ts:
import lume from "lume/mod.ts";
import { cssBanner } from "hibana/mod.ts";

const site = lume();

site.use(cssBanner({
  message: "===css jokes are always in style===",
}));

export default site;
```

---

#### `shuffle`

A Lume plugin to register the filter "shuffle" that shuffles an array.

This plugin adds a new filter named "shuffle" (by default) that can be used in
your Lume templates to randomly reorder elements in an array.

**Parameters:**

- `userOptions`: `Options` - Configuration object (optional)

**Example:**

```ts
// In your Lume _config.ts:
import lume from "lume/mod.ts";
import { shuffle } from "hibana/mod.ts";

const site = lume();
site.use(shuffle());

export default site;

// In your Vento templates:
{{ [1, 2, 3, 4, 5] | shuffle }}
// This will output a randomly shuffled array, e.g., [3, 1, 5, 2, 4].

{{ for testimonial of testimonials.list |> shuffle }}
// Use when building a list of testimonials in a for loop, shuffling their order.
```

---

### Processors

#### `deferPagefind`

Lume processor to defer the loading of Pagefind CSS and JS.

This processor modifies the Pagefind CSS link and JS script tags to ensure they
are loaded asynchronously, improving page load performance.

It sets `media="print"` and `onload="this.media='all'"` on the CSS link and adds
the `defer` attribute to the JS script.

**Example:**

```ts
// In your Lume _config.ts:
import lume from "lume/mod.ts";
import { deferPagefind } from "hibana/mod.ts";

const site = lume();

// == NEAR BOTTOM of your _config.ts, after other plugins:
site.process([".html"], deferPagefind());

export default site;
```

---

#### `externalLinksIcon`

Adds an external link icon to `<a>` anchor elements that point to external
sites. Skips links inside elements with the class `.no-external-icon`.

**Parameters:**

- `siteUrlInput`: `string` - Your site's base URL for determining which links
  are external

**Example:**

```ts
// In your Lume _config.ts:
import lume from "lume/mod.ts";
import { deferPagefind, externalLinksIcon } from "hibana/mod.ts";

const site = lume();

// == NEAR BOTTOM of your _config.ts, after other plugins:
// Specify the base URL
site.process([".html"], externalLinksIcon("https://esolia.co.jp"));
site.process([".html"], deferPagefind());

export default site;
```

---

#### `ventoHeadingAnchors`

Adds ID attributes and anchor links to heading elements in Vento-rendered pages.

This processor enables deep-linking to headings in pure Vento (.vto) pages,
matching the functionality that markdown-it plugins provide for markdown pages.
It automatically generates unique slugs for headings and adds clickable anchor
links.

**Important:** This processor should run **before** `ventoTOC` to ensure
headings have IDs before TOC generation.

**Features:**

- Adds unique `id` attributes to headings (H2-H6)
- Generates slugs from heading text with collision prevention
- Adds anchor links with configurable position and styling
- Matches markdown-it-toc-done-right behavior by default
- Supports `containerSelector` to limit scope to main content
- Only processes pure Vento pages (skips markdown pages)

**Parameters:**

- `userOptions`: `HeadingAnchorsOptions` (optional)
  - `level`: `number` - Minimum heading level to process (default: `2`)
  - `maxLevel`: `number` - Maximum heading level to process (default: `6`)
  - `tabIndex`: `number | false` - Tab index for headings (default: `-1`)
  - `anchorPosition`: `"inside" | "outside"` - Where to place anchor (default:
    `"inside"`)
  - `anchorClass`: `string` - CSS class for anchor element (default:
    `"header-anchor"`)
  - `anchorSymbol`: `string` - Visible anchor text (default: `""` - use CSS
    ::before)
  - `ariaLabel`: `string` - Aria label for anchor (default: `"Permalink"`)
  - `includeTemplateEngines`: `string[]` - Template engines to process (default:
    `["vto"]`)
  - `containerSelector`: `string` - CSS selector to limit extraction scope
    (optional)
  - `slugify`: `(text: string) => string` - Custom slug generator (optional)

**Example:**

```ts
// In your Lume _config.ts:
import lume from "lume/mod.ts";
import { ventoHeadingAnchors, ventoTOC, ventoTOCInject } from "hibana/mod.ts";

const site = lume();

// Add heading anchors (matches markdown-it style by default)
site.process(
  [".html"],
  ventoHeadingAnchors({
    level: 2, // Start at h2
    maxLevel: 4, // End at h4
    containerSelector: "article", // Only process headings in <article>
  }),
);

// Then generate TOC
site.process(
  [".html"],
  ventoTOC({
    level: 2,
    maxLevel: 4,
    containerSelector: "article",
  }),
);

// Finally inject TOC HTML
site.process([".html"], ventoTOCInject());

export default site;
```

**Output:**

```html
<!-- Input -->
<article>
  <h2>Introduction</h2>
  <h3>Getting Started</h3>
</article>

<!-- Output (default: anchorPosition "inside", no symbol) -->
<article>
  <h2 id="introduction" tabindex="-1">
    <a href="#introduction" class="header-anchor" aria-label="Permalink"
    >Introduction</a>
  </h2>
  <h3 id="getting-started" tabindex="-1">
    <a href="#getting-started" class="header-anchor" aria-label="Permalink"
    >Getting Started</a>
  </h3>
</article>

<!-- Styled with CSS ::before for link icon -->
```

**CSS Example:**

```css
.header-anchor::before {
  content: "#";
  position: absolute;
  left: -1em;
  opacity: 0;
  transition: opacity 0.2s;
}

h2:hover .header-anchor::before,
h3:hover .header-anchor::before {
  opacity: 1;
}
```

---

#### `ventoTOC`

Generates a hierarchical table of contents (TOC) data structure from headings in
Vento-rendered pages.

This processor extracts headings and builds a nested tree structure stored in
`page.data.toc`. It's designed to work alongside `ventoTOCInject` to provide TOC
functionality for pure Vento pages.

**Important:**

- Run this **after** `ventoHeadingAnchors` (headings need IDs first)
- Run this **before** `ventoTOCInject` (injection needs TOC data)
- Due to Lume's build order (processors run after layouts), use `ventoTOCInject`
  to actually display the TOC

**Features:**

- Builds hierarchical TOC tree from headings
- Stores data in `page.data.toc` for template access
- Generates full URLs with anchors for each heading
- Supports `containerSelector` to limit scope
- Only processes pure Vento pages (skips markdown pages)
- Respects `show_toc` frontmatter setting

**Parameters:**

- `userOptions`: `TOCGeneratorOptions` (optional)
  - `level`: `number` - Minimum heading level (default: `2`)
  - `maxLevel`: `number` - Maximum heading level (default: `6`)
  - `key`: `string` - Page data key for TOC (default: `"toc"`)
  - `includeTemplateEngines`: `string[]` - Engines to process (default:
    `["vto"]`)
  - `containerSelector`: `string` - CSS selector to limit extraction scope
    (optional)

**Example:**

```ts
// In your Lume _config.ts:
import lume from "lume/mod.ts";
import { ventoHeadingAnchors, ventoTOC, ventoTOCInject } from "hibana/mod.ts";

const site = lume();

// Process headings in order
site.process(
  [".html"],
  ventoHeadingAnchors({
    level: 2,
    maxLevel: 4,
    containerSelector: "article", // Only main content
  }),
);

site.process(
  [".html"],
  ventoTOC({
    level: 2,
    maxLevel: 4,
    key: "toc", // Stores in page.data.toc
    containerSelector: "article", // Match heading anchors scope
  }),
);

site.process([".html"], ventoTOCInject());

export default site;
```

**TOC Data Structure:**

```ts
interface TOCNode {
  level: number; // Heading level (2-6)
  text: string; // Heading text content
  slug: string; // URL-safe slug from id attribute
  url: string; // Full URL with anchor (#slug)
  children: TOCNode[]; // Nested child headings
}
```

**Example Output:**

```ts
// page.data.toc contains:
[
  {
    level: 2,
    text: "Introduction",
    slug: "introduction",
    url: "/page/#introduction",
    children: [
      {
        level: 3,
        text: "Getting Started",
        slug: "getting-started",
        url: "/page/#getting-started",
        children: [],
      },
    ],
  },
];
```

---

#### `ventoTOCInject`

Injects TOC HTML into rendered pages at a marker position, working around Lume's
build order limitation.

**The Problem:** Lume's build order is: Preprocessors → Template Rendering →
**Layout Rendering** → Processors. Since processors run **after** layouts
render, `page.data.toc` isn't available when the layout template executes.

**The Solution:** This processor finds a marker comment in the rendered HTML and
replaces it with generated TOC HTML. This allows TOCs to appear in layouts even
though the data is generated after layout rendering.

**Features:**

- Injects complete TOC HTML structure at marker position
- Respects `show_toc` frontmatter (skips if `false`)
- Matches styling from existing markdown TOCs
- Checks for punchlist/topic to add proper spacing
- Only processes pages with TOC data

**Parameters:**

None - automatically processes all pages with TOC data.

**Example:**

```ts
// In your Lume _config.ts:
import lume from "lume/mod.ts";
import { ventoHeadingAnchors, ventoTOC, ventoTOCInject } from "hibana/mod.ts";

const site = lume();

// Standard processor order
site.process(
  [".html"],
  ventoHeadingAnchors({
    level: 2,
    maxLevel: 4,
    containerSelector: "article",
  }),
);
site.process(
  [".html"],
  ventoTOC({
    level: 2,
    maxLevel: 4,
    containerSelector: "article",
  }),
);
site.process([".html"], ventoTOCInject());

export default site;
```

**Layout Template:**

```vto
<!-- In your layout (e.g., layouts/docs.vto) -->
<div class="sidebar">
  <!-- Other sidebar content -->

  <!-- VENTO-TOC-INJECTION-POINT: This comment will be replaced by processor -->

  <!-- Fallback TOC template for markdown pages -->
  {{ if toc && toc.length > 0 }}
    <nav aria-labelledby="toc-title">
      <!-- TOC markup -->
    </nav>
  {{ /if }}
</div>
```

**Frontmatter Control:**

```yaml
---
title: My Page
show_toc: true  # TOC will be injected
---

# Or disable TOC for specific pages:
---
title: Another Page
show_toc: false  # No TOC injection
---
```

**How It Works:**

1. `ventoTOC` generates TOC data and stores in `page.data.toc`
2. Layout renders with marker comment: `<!-- VENTO-TOC-INJECTION-POINT: -->`
3. `ventoTOCInject` finds the marker in rendered HTML
4. Marker is replaced with complete TOC HTML structure
5. Result: TOC appears in final output

**Generated HTML:**

```html
<nav aria-labelledby="on-this-page-title" class="w-56">
  <h2 id="on-this-page-title" class="font-display text-sm">
    On this page
  </h2>
  <ol role="list" class="mt-4 space-y-3 text-sm">
    <li>
      <h3>
        <a href="#introduction" class="toc-link" data-toc-id="introduction">
          Introduction
        </a>
      </h3>
      <ol role="list" class="mt-2 space-y-3 pl-5">
        <li>
          <a
            href="#getting-started"
            class="toc-link"
            data-toc-id="getting-started"
          >
            Getting Started
          </a>
        </li>
      </ol>
    </li>
  </ol>
</nav>
```

**Complete Workflow:**

```ts
// _config.ts - Complete setup
import lume from "lume/mod.ts";
import { ventoHeadingAnchors, ventoTOC, ventoTOCInject } from "hibana/mod.ts";

const site = lume();

// 1. Add IDs and anchors to headings
site.process(
  [".html"],
  ventoHeadingAnchors({
    level: 2,
    maxLevel: 4,
    containerSelector: "article", // Only <article> headings
  }),
);

// 2. Generate TOC data structure
site.process(
  [".html"],
  ventoTOC({
    level: 2,
    maxLevel: 4,
    key: "toc",
    containerSelector: "article", // Match heading scope
  }),
);

// 3. Inject TOC HTML at marker
site.process([".html"], ventoTOCInject());

export default site;
```

---

### Filters

#### `temporalDate`

A Lume filter for modern date formatting using the Temporal API with full
timezone support.

**Features:**

- Timezone-aware formatting (configurable default timezone)
- Multiple format styles: `full`, `long`, `medium`, `short`, `iso`
- Locale support for internationalization
- Handles Date objects and ISO date strings
- Type-safe with TypeScript

**Parameters:**

- `options`: `TemporalDateOptions` (optional)
  - `defaultTimezone`: `string` - IANA timezone (default: `"UTC"`)
  - `defaultLocale`: `string` - Locale code (default: `"en-US"`)

**Types:**

- `DateFormat`: `"full" | "long" | "medium" | "short" | "iso"`

**Example:**

```ts
// In your Lume _config.ts:
import lume from "lume/mod.ts";
import { temporalDate } from "hibana/mod.ts";

const site = lume();

site.filter(
  "tdate",
  temporalDate({
    defaultTimezone: "Asia/Tokyo",
    defaultLocale: "ja-JP",
  }),
);

export default site;

// In your templates:
{
  {
    date | tdate;
  }
} // Uses default format (full)
{
  {
    date | tdate("short");
  }
} // Short format
{
  {
    date | tdate("iso");
  }
} // ISO 8601 format
{
  {
    date | tdate("long", "fr-FR");
  }
} // French locale
```

---

### Preprocessors

#### `markdownMetadata`

Extracts excerpts and calculates elapsed days from markdown content.

**Features:**

- Extracts text before a configurable marker (default: `<!-- more -->`) as an
  excerpt
- Calculates elapsed days from publication date using Temporal API
- Optional feature toggling for each capability

**Parameters:**

- `options`: `MarkdownMetadataOptions` (optional)
  - `excerptMarker`: `string` - Marker to split content (default:
    `"<!-- more -->"`)
  - `calculateElapsed`: `boolean` - Calculate elapsed days (default: `true`)

**Example:**

```ts
// In your Lume _config.ts:
import lume from "lume/mod.ts";
import { markdownMetadata } from "hibana/mod.ts";

const site = lume();

site.preprocess([".md"], markdownMetadata({
  excerptMarker: "<!-- more -->",
  calculateElapsed: true,
}));

export default site;

// In your markdown files:
---
title: My Post
date: 2024-01-15
---

This is the excerpt text.

<!-- more -->

This is the full content that comes after the excerpt.

// Adds to page data:
// - excerpt: "This is the excerpt text."
// - elapsedDays: (calculated from date to now)
```

---

#### `breadcrumbSchema`

Auto-generates Schema.org breadcrumb structured data from URL paths.

**Features:**

- Parses URL paths to create breadcrumb hierarchy
- Multilingual support with configurable home page names
- Adds `breadcrumbSchema` to page data for use in templates
- Helper function `createBreadcrumbSchema` for manual breadcrumb creation

**Parameters:**

- `options`: `BreadcrumbSchemaOptions`
  - `baseUrl`: `string` - Your site's base URL
  - `homeNames`: `HomeNames` - Object mapping language codes to home page names
  - `languages`: `string[]` - Array of supported language codes

**Types:**

- `HomeNames`: `Record<string, string>` - e.g., `{ en: "Home", ja: "ホーム" }`

**Example:**

```ts
// In your Lume _config.ts:
import lume from "lume/mod.ts";
import { breadcrumbSchema, createBreadcrumbSchema } from "hibana/mod.ts";

const site = lume();

site.preprocess([".md"], breadcrumbSchema({
  baseUrl: "https://example.com",
  homeNames: { en: "Home", ja: "ホーム" },
  languages: ["en", "ja"],
}));

export default site;

// In your templates (e.g., _includes/layouts/base.vto):
<script type="application/ld+json">
{{ breadcrumbSchema |> JSON.stringify }}
</script>

// Manual breadcrumb creation:
const customBreadcrumbs = createBreadcrumbSchema([
  { name: "Home", url: "https://example.com" },
  { name: "Products", url: "https://example.com/products" },
  { name: "Widget", url: "https://example.com/products/widget" },
]);
```

---

#### `languageAlternatesSchema`

Links translated pages across languages using Schema.org `translationOfWork` and
`workTranslation` properties.

**Features:**

- Maps pages by ID across different languages
- Adds translation relationships to existing schema objects
- Supports multiple schema types per page
- Helper function `addLanguageAlternate` for manual linking

**Parameters:**

- `options`: `LanguageAlternatesSchemaOptions`
  - `baseUrl`: `string` - Your site's base URL
  - `languages`: `string[]` - Array of supported language codes
  - `schemaFields`: `string[]` - Array of schema field names to update (default:
    `["webPageSchema"]`)

**Example:**

```ts
// In your Lume _config.ts:
import lume from "lume/mod.ts";
import { languageAlternatesSchema, addLanguageAlternate } from "hibana/mod.ts";

const site = lume();

site.preprocess([".md"], languageAlternatesSchema({
  baseUrl: "https://example.com",
  languages: ["en", "ja"],
  schemaFields: ["webPageSchema", "serviceSchema"],
}));

export default site;

// In your markdown frontmatter:
---
id: about-us
title: About Us
schema:
  webPageSchema:
    "@type": "WebPage"
    name: "About Us"
---

// Corresponding Japanese page:
---
id: about-us
title: 私たちについて
schema:
  webPageSchema:
    "@type": "WebPage"
    name: "私たちについて"
---

// The preprocessor automatically links these pages via Schema.org properties

// Manual linking:
const schema = addLanguageAlternate(
  mySchema,
  "https://example.com/en/about",
  "https://example.com/ja/about"
);
```

---

### Scripts

#### `fixFontPaths`

Fixes Google Fonts relative paths in CSS files by converting them to absolute
paths.

**Features:**

- Platform-aware (macOS vs Linux sed syntax)
- Batch processing for multiple CSS files
- Individual command generation option via helper function
- Safe sed operations with proper escaping

**Parameters:**

- `options`: `FixFontPathsOptions`
  - `cssFiles`: `string[]` - Array of CSS file names (relative to `_site`)
  - `fontDirs`: `string[]` - Array of font directory names (relative to `_site`)
  - `verbose`: `boolean` - Enable verbose logging (default: `true`)

**Example:**

```ts
// In your Lume _config.ts:
import lume from "lume/mod.ts";
import { fixFontPaths, generateFontPathFixes } from "hibana/mod.ts";

const site = lume();

// Register as a script
site.script(
  "fixFonts",
  fixFontPaths({
    cssFiles: ["fonts-en.css", "fonts-ja.css"],
    fontDirs: ["fonts-en", "fonts-ja"],
  }),
);

// Run after build
site.addEventListener("afterBuild", "fixFonts");

export default site;

// Generate individual commands for debugging:
const commands = generateFontPathFixes({
  cssFiles: ["fonts-en.css"],
  fontDirs: ["fonts-en"],
});
console.log(commands);
```

---

#### `injectDoctype`

Injects `<!DOCTYPE html>` into HTML files (workaround for Lume 3.x DOCTYPE
handling).

**Features:**

- Platform-aware sed commands (macOS vs Linux)
- Removes duplicate DOCTYPEs before injecting
- Configurable verbosity
- Event listener or script registration options

**Parameters:**

- `options`: `InjectDoctypeOptions` (optional)
  - `verbose`: `boolean` - Enable verbose logging (default: `true`)

**Example:**

```ts
// In your Lume _config.ts:
import lume from "lume/mod.ts";
import { generateDoctypeCommand, injectDoctype } from "hibana/mod.ts";

const site = lume();

// Method 1: Event listener (recommended)
site.addEventListener("afterBuild", injectDoctype());

// Method 2: Named script
site.script("injectDoctype", injectDoctype({ verbose: false }));
site.addEventListener("afterBuild", "injectDoctype");

export default site;

// Generate command for debugging:
const command = generateDoctypeCommand({ verbose: true });
console.log(command);
```

---

### DOM Utilities

Client-side utility functions for DOM manipulation, accessibility, and platform
detection.

**Available Functions:**

#### `loadVendorScript`

Utility function to load an external vendor script dynamically.

**Parameters:**

- `src`: `string` - Script URL
- `callback`: `() => void` - Optional callback when loaded

**Example:**

```ts
import { loadVendorScript } from "hibana/utils/dom_utils.ts";

loadVendorScript("https://cdn.example.com/script.js", () => {
  console.log("Script loaded!");
});
```

---

#### `trapFocus`

Traps focus within a given container element. Useful for modal dialogs to
prevent users from tabbing outside the modal.

**Parameters:**

- `container`: `HTMLElement` - The container to trap focus within

**Example:**

```ts
import { trapFocus } from "hibana/utils/dom_utils.ts";

const modal = document.querySelector("#myModal");
trapFocus(modal);
```

---

#### `prefersReducedMotion`

Checks if the user prefers reduced motion (accessibility feature).

**Returns:** `boolean` - `true` if user prefers reduced motion

**Example:**

```ts
import { prefersReducedMotion } from "hibana/utils/dom_utils.ts";

if (!prefersReducedMotion()) {
  // Safe to use animations
  setupAnimations();
}
```

---

#### `detectOS`

Detects the user's operating system.

**Returns:** `OS` - One of
`"windows" | "macos" | "linux" | "ios" | "android" | "unknown"`

**Example:**

```ts
import { detectOS } from "hibana/utils/dom_utils.ts";

const os = detectOS();
console.log(`User is on: ${os}`);
```

---

#### `addOSClass`

Automatically detects the OS and adds a class to the document body.

**Example:**

```ts
import { addOSClass } from "hibana/utils/dom_utils.ts";

// Adds class like "os-macos", "os-windows", etc. to <body>
addOSClass();
```

---

## Requirements

- **Deno**: 1.40+ (for Temporal API support)
- **Lume**: 3.x (tested with 3.1.2)
- **Platform**: Unix/Linux/macOS for script utilities (sed required)

## Notes

- Temporal API is used for date operations; requires modern Deno runtime
- Script utilities (`fixFontPaths`, `injectDoctype`) require `sed` command
- Schema.org preprocessors assume specific frontmatter structure
- Not published on JSR due to Lume's https import requirements

## Migration from Custom Code

If you're migrating from custom implementations (like eSolia 2025), Hibana can
typically reduce your codebase by 400-500 lines. See
`docs/EXTRACTION_SUMMARY.md` for detailed migration examples.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Author

Rick Cogley - [https://github.com/RickCogley](https://github.com/RickCogley)

## Links

- **Repository**: https://github.com/RickCogley/hibana
- **Deno Registry**: https://deno.land/x/hibana
- **API Documentation**: See `docs/api/` directory
