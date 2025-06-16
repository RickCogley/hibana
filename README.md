# Hibana Lume Helpers

The `hibana` library re-exports various Lume helper plugins and utility functions designed to enhance Lume static site generation projects.

| Hibana | Specifications |
| ------- | ------- |
| **Version** | 1.0.18 |
| **Repository** | [https://github.com/RickCogley/hibana](https://github.com/RickCogley/hibana) |
| **License** | MIT |
| **Author** | Rick Cogley |

It provides:
- [cssBanner](https://github.com/RickCogley/hibana/blob/main/./plugins/css_banner.ts#cssBanner) - A plugin to add a comment banner to CSS files.
- [shuffle](https://github.com/RickCogley/hibana/blob/main/./plugins/shuffle.ts#shuffle) - A plugin to add a shuffle filter for arrays.
- [deferPagefind](https://github.com/RickCogley/hibana/blob/main/./processors/defer_pagefind.ts#deferPagefind) - A processor to defer Pagefind CSS and JS loading.
- [externalLinksIcon](https://github.com/RickCogley/hibana/blob/main/./processors/external_links_icon.ts#externalLinksIcon) - A processor to add external link icons to `target="_blank"` links.
- [loadVendorScript](https://github.com/RickCogley/hibana/blob/main/./utils/dom_utils.ts#loadVendorScript), [trapFocus](https://github.com/RickCogley/hibana/blob/main/./utils/dom_utils.ts#trapFocus) - General DOM utility functions.



## API

### `cssBanner`

A Lume plugin that prepends a CSS comment banner to all .css files.

This is useful for adding copyright information, build details, or
other metadata to the top of your generated CSS files.


**Parameters:**

- `options` : `CssBannerOptions` - 

**Example:**
```ts
// In your Lume _config.ts:
import lume from "lume/mod.ts";
import { cssBanner, shuffle } from "hibana/mod.ts";

const site = lume();

site.use(cssBanner({
message: "===css jokes are always in style===",
}));

export default site;
```

### `shuffle`

A Lume plugin to register the filter "shuffle" that shuffles an array.

This plugin adds a new filter named "shuffle" (by default) that can be used
in your Lume templates to randomly reorder elements in an array.


**Parameters:**

- `userOptions` : `Options` - 

**Example:**
```ts
// In your Lume _config.ts:
import lume from "lume/mod.ts";
import { shuffle, cssBanner } from "hibana/mod.ts";

site.use(shuffle());

export default site;

// In your Vento templates:
{{ [1, 2, 3, 4, 5] | shuffle }}
// This will output a randomly shuffled array, e.g., [3, 1, 5, 2, 4].

{{ for testimonial of testimonials.list |> shuffle }}
// Use when building a list of testimonials in a for loop, shuffling their order.
```

### `deferPagefind`

Lume plugin to defer the loading of Pagefind CSS and JS.

This plugin modifies the Pagefind CSS link and JS script tags
to ensure they are loaded asynchronously, improving page load performance.

It sets `media="print"` and `onload="this.media='all'"` on the CSS link
and adds the `defer` attribute to the JS script.


**Parameters:**


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

### `externalLinksIcon`

Adds an external link icon to `<a>` anchor elements that point to external sites.
Skips links inside elements with the class `.no-external-icon`.


**Parameters:**

- `siteUrlInput` : `` - 

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

### `loadVendorScript`

Utility function to load an external vendor script.

**Parameters:**

- `src` : `string` - 
- `undefined`  - 
- `callback` : `` - 

### `trapFocus`

Traps focus within a given container element.
Useful for modal dialogs to prevent users from tabbing outside the modal.

**Parameters:**

- `container` : `HTMLElement` - 

