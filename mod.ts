/**
 * The `hibana` library re-exports various Lume helper plugins and utility functions designed to enhance Lume static site generation projects.
 *
 * | Hibana | Specifications |
 * | ------- | ------- |
 * | **Version** | 1.2.1 |
 * | **Repository** | {@link https://github.com/RickCogley/hibana} |
 * | **API Docs**   | [https://hibana.esolia.deno.net](https://hibana.esolia.deno.net) |
 * | **Distribution** | [https://deno.land/x/hibana](https://deno.land/x/hibana) |
 * | **License** | MIT |
 * | **Author** | Rick Cogley |
 *
 * It provides:
 * - {@link cssBanner} - A plugin to add a comment banner to CSS files.
 * - {@link shuffle} - A plugin to add a shuffle filter for arrays.
 * - {@link deferPagefind} - A processor to defer Pagefind CSS and JS loading.
 * - {@link externalLinksIcon} - A processor to add external link icons to `target="_blank"` links.
 * - {@link ventoHeadingAnchors} - A processor to add anchor links to headings in Vento pages.
 * - {@link ventoTOC} - A processor to generate table of contents from headings in Vento pages.
 * - {@link temporalDate} - A Temporal API-based date filter with timezone support.
 * - {@link markdownMetadata} - Extract excerpts and calculate elapsed days from markdown.
 * - {@link breadcrumbSchema} - Auto-generate Schema.org breadcrumbs from URLs.
 * - {@link languageAlternatesSchema} - Link translated pages via Schema.org.
 * - {@link fixFontPaths} - Fix Google Fonts paths in CSS files.
 * - {@link injectDoctype} - Inject DOCTYPE into HTML files (Lume 3 workaround).
 * - {@link loadVendorScript}, {@link trapFocus}, {@link prefersReducedMotion}, {@link detectOS}, {@link addOSClass} - General DOM utility functions.
 *
 * @see {@link http://github.com|GitHub}
 * @see {@link https://github.com/RickCogley/hibana} official Git repository for this project.
 * @tags lume, plugin, processor, utility, static-site-generator, temporal, seo, schema
 * @file This file is the main entry point for the 'hibana' Lume plugin, processor and utility library.
 * @module hibana
 * @author Rick Cogley
 * @license MIT
 *
 * @example Add `hibana` to your Lume project's `deno.json` import map:
 * ```ts
 * ...
 * "imports": {
 *   "lume/": "https://deno.land/x/lume@v3.0.3/",
 *   "lume/cms/": "https://cdn.jsdelivr.net/gh/lumeland/cms@0.12.0/",
 *   "lume/jsx-runtime": "https://deno.land/x/ssx@v0.1.10/jsx-runtime.ts",
 *   "hibana/": "https://deno.land/x/hibana@v1.2.1/"
 * },...
 * ```
 * @example Or you can import `hibana` directly from GitHub:
 * ```ts
 * "hibana/": "https://raw.githubusercontent.com/RickCogley/hibana/v1.2.1/"
 * ```
 *
 * @example Then import `hibana` into your Lume `_config.ts`:
 * ```ts
 * import {
 *   cssBanner,
 *   shuffle,
 *   deferPagefind,
 *   externalLinksIcon,
 *   ventoHeadingAnchors,
 *   ventoTOC,
 *   temporalDate,
 *   markdownMetadata,
 *   breadcrumbSchema,
 *   languageAlternatesSchema,
 *   fixFontPaths,
 *   injectDoctype,
 * } from "hibana/mod.ts";
 * ```
 */
1;
// Plugins
export { default as cssBanner } from "./plugins/css_banner.ts";
export { default as shuffle } from "./plugins/shuffle.ts";

// Processors
export { default as deferPagefind } from "./processors/defer_pagefind.ts";
export { default as externalLinksIcon } from "./processors/external_links_icon.ts";
export { default as ventoHeadingAnchors } from "./processors/vento_heading_anchors.ts";
export { default as ventoTOC } from "./processors/vento_toc.ts";
export type {
  HeadingAnchorsOptions,
  TOCGeneratorOptions,
  TOCNode,
} from "./types/vento_toc.ts";

// Filters
export { default as temporalDate } from "./filters/temporal_date.ts";
export type {
  DateFormat,
  TemporalDateOptions,
} from "./filters/temporal_date.ts";

// Preprocessors
export { default as markdownMetadata } from "./preprocessors/markdown_metadata.ts";
export type { MarkdownMetadataOptions } from "./preprocessors/markdown_metadata.ts";

export {
  createBreadcrumbSchema,
  default as breadcrumbSchema,
} from "./preprocessors/breadcrumb_schema.ts";
export type {
  BreadcrumbSchemaOptions,
  HomeNames,
} from "./preprocessors/breadcrumb_schema.ts";

export {
  addLanguageAlternate,
  default as languageAlternatesSchema,
} from "./preprocessors/language_alternates_schema.ts";
export type { LanguageAlternatesSchemaOptions } from "./preprocessors/language_alternates_schema.ts";

// Scripts
export {
  default as fixFontPaths,
  generateFontPathFixes,
} from "./scripts/fix_font_paths.ts";
export type { FixFontPathsOptions } from "./scripts/fix_font_paths.ts";

export {
  default as injectDoctype,
  generateDoctypeCommand,
} from "./scripts/inject_doctype.ts";
export type { InjectDoctypeOptions } from "./scripts/inject_doctype.ts";

// General DOM Utilities
export {
  addOSClass,
  detectOS,
  loadVendorScript,
  prefersReducedMotion,
  trapFocus,
} from "./utils/dom_utils.ts";
export type { OS } from "./utils/dom_utils.ts";
