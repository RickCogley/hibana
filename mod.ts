/**
 * The `hibana` library re-exports various Lume helper plugins and utility functions designed to enhance Lume static site generation projects.
 * 
 * | Hibana | Specifications |
 * | ------- | ------- |
 * | **Version** | 1.0.18 |
 * | **Repository** | {@link https://github.com/RickCogley/hibana} |
 * | **License** | MIT |
 * | **Author** | Rick Cogley |
 *
 * It provides:
 * - {@link cssBanner} - A plugin to add a comment banner to CSS files.
 * - {@link shuffle} - A plugin to add a shuffle filter for arrays.
 * - {@link deferPagefind} - A processor to defer Pagefind CSS and JS loading.
 * - {@link externalLinksIcon} - A processor to add external link icons to `target="_blank"` links.
 * - {@link loadVendorScript}, {@link trapFocus} - General DOM utility functions.
 * 
 * 
 * @see {@link http://github.com|GitHub}
 * @see {@link https://github.com/RickCogley/hibana} official Git repository for this project.
 * @tags lume, plugin, processor, utility, static-site-generator
 * @file This file is the main entry point for the 'hibana' Lume plugin, processor and utility library.
 * @module hibana
 * @author Rick Cogley
 * @license MIT
 *
 * 
 * @example Add `hibana` to your Lume project's `deno.json` import map:
 * ```ts
 * ...
 * "imports": {
 *   "lume/": "https://deno.land/x/lume@v3.0.3/",
 *   "lume/cms/": "https://cdn.jsdelivr.net/gh/lumeland/cms@0.12.0/",
 *   "lume/jsx-runtime": "https://deno.land/x/ssx@v0.1.10/jsx-runtime.ts",
 *   "hibana/": "https://deno.land/x/hibana/v1.0.18/"
 * },...
 * ```
 * @example Or you can import `hibana` directly from GitHub:
 * ```ts 
 * "hibana/": "https://raw.githubusercontent.com/RickCogley/hibana/v1.0.18/"
 * ```
 * 
 * @example Then import `hibana` into your Lume `_config.ts`:
 * ```ts
 * import { cssBanner, shuffle, deferPagefind, externalLinksIcon } from "hibana/mod.ts";
 * ```
 */

// Plugins
export { default as cssBanner } from "./plugins/css_banner.ts";
export { default as shuffle } from "./plugins/shuffle.ts"; 

// Processors
export { default as deferPagefind } from "./processors/defer_pagefind.ts"; 
export { default as externalLinksIcon } from "./processors/external_links_icon.ts";

// General DOM Utilities 
export { loadVendorScript, trapFocus } from "./utils/dom_utils.ts"; 

