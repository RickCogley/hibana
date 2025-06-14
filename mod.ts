/**
 * @file This is the main entry point for the 'hibana' Lume plugin, processor and utility library.
 * @module hibana
 * @author Rick Cogley
 * @license MIT 
 * @link https://github.com/RickCogley/hibana - The official Git repository for this project.
 *
 * @description
 * This module re-exports various Lume plugins and utility functions
 * designed to enhance Lume static site generation projects.
 *
 * It provides:
 * - `cssBanner`: A plugin to add a comment banner to CSS files.
 * - `shuffle`: A plugin to add a shuffle filter for arrays.
 * - `deferPagefind`: A processor to defer Pagefind CSS and JS loading.
 * - `externalLinksIcon`: A processor to add external link icons to `target="_blank"` links.
 * - `loadVendorScript` and `trapFocus`: General DOM utility functions.
 * 
 * @example
 * // In Lume's deno.json, you can add it to your import map:
 * "imports": {
 *   "lume/": "https://deno.land/x/lume@v3.0.3/",
 *   "lume/cms/": "https://cdn.jsdelivr.net/gh/lumeland/cms@0.12.0/",
 *   "lume/jsx-runtime": "https://deno.land/x/ssx@v0.1.10/jsx-runtime.ts",
 *   "hibana/": "https://deno.land/x/hibana/v1.0.16/"
 * },...
 * 
 * // Github Direct: 
 * "hibana/": "https://raw.githubusercontent.com/RickCogley/hibana/v1.0.16/"
 * 
 * // Then import it in your Lume config:
 * import { cssBanner, shuffle, deferPagefind, externalLinksIcon } from "hibana/mod.ts";
 */

// Plugins
export { default as cssBanner } from "./plugins/css_banner.ts";
export { default as shuffle } from "./plugins/shuffle.ts"; 

// Processors
export { default as deferPagefind } from "./processors/defer_pagefind.ts"; 
export { default as externalLinksIcon } from "./processors/external_links_icon.ts";

// General DOM Utilities 
export { loadVendorScript, trapFocus } from "./utils/dom_utils.ts"; 

