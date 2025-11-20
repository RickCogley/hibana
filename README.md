# Hibana Lume Helpers

The `hibana` library provides a comprehensive collection of Lume helper plugins,
processors, filters, preprocessors, scripts, and utility functions designed to
enhance Lume static site generation projects.

| Hibana         | Specifications                                                               |
| -------------- | ---------------------------------------------------------------------------- |
| **Version**    | 1.2.0                                                                        |
| **Repository** | [https://github.com/RickCogley/hibana](https://github.com/RickCogley/hibana) |
| **License**    | MIT                                                                          |
| **Author**     | Rick Cogley                                                                  |

## Installation

Add `hibana` to your Lume project's `deno.json` import map:

```json
{
  "imports": {
    "lume/": "https://deno.land/x/lume@v3.1.2/",
    "hibana/": "https://deno.land/x/hibana@v1.2.0/"
  }
}
```

Or import directly from GitHub:

```json
{
  "imports": {
    "hibana/": "https://raw.githubusercontent.com/RickCogley/hibana/v1.2.0/"
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
