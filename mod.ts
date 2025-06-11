// One place for all exports
export { default as cssBanner } from "./plugins/css_banner.ts";
export { default as shuffle } from "./plugins/shuffle.ts";
// Lume site.afterRender() expects a function that directly takes a single Page object as its argument, so this is a named export: 
export { deferPagefindForPage } from "./processors/defer_pagefind.ts"; 
export { default as externalLinksIcon } from "./processors/external_links_icon.ts";
