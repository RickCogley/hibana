// processors/defer_pagefind.ts

import type { Page } from "../types/lume.ts";

/**
 * Modifies the content of a single Lume Page to defer Pagefind CSS and JS loading.
 * Intended to be used with site.afterRender().
 */
export function deferPagefindForPage(page: Page) {
  const content = page.content;

  // Crucially, this check should now usually pass for HTML pages in afterRender
  if (typeof content !== "string") {
    // This console.log should ideally be seen less or not at all for .html pages
    console.log(`Skipping non-string content for: ${page.src?.path || "unknown page"} (at afterRender stage)`);
    return; // Don't proceed if content isn't a string
  }

  let updated = content;
  let modified = false; // Flag to track if any changes were made

  // Regex to ensure we capture the attributes correctly for replacement
  const cssRegex = /(<link\s+[^>]*href=["']\/pagefind\/pagefind-ui\.css["'])(\s*[^>]*>)/gi;
  if (cssRegex.test(updated)) {
      // Replaces the existing tag by inserting the new attributes before the closing bracket
      updated = updated.replace(
          cssRegex,
          `$1 media="print" onload="this.media='all'"$2`
      );
      modified = true;
  }


  const jsRegex = /(<script\s+[^>]*src=["']\/pagefind\/pagefind-ui\.js["'])(\s*[^>]*><\/script>)/gi;
  if (jsRegex.test(updated)) {
      // Replaces the existing tag by inserting the 'defer' attribute
      updated = updated.replace(
          jsRegex,
          `$1 defer$2`
      );
      modified = true;
  }

  // Only update page.content and log if actual modifications occurred
  if (modified) {
    page.content = updated;
    console.log(`✅ Modified Pagefind attributes for: ${page.src?.path || "unknown page"}`);
    // You can uncomment this for very detailed debugging, but it can be noisy
    // console.log(`Updated content snippet (first 500 chars): ${page.content.substring(0, 500)}`);
  } else {
    // This log can be useful if you expect modifications but don't see them
    // console.log(`No Pagefind modifications needed for: ${page.src?.path || "unknown page"}`);
  }
}