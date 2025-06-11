// defer_pagefind.ts searches html pages for Pagefind CSS and JS links,
// and modifies them to load with `defer` and `media="print"` attributes, so they don't block rendering.

import type { Page } from "../types/lume.ts";

export default function deferPagefind() {
  return (pages: Page[]) => {
    console.log("Starting deferPagefind script...");
    for (const page of pages) {
      const content = page.content;
      if (typeof content !== "string") {
        console.log(`Skipping non-string content for: ${page.src?.path || "unknown page"}`);
        continue;
      }

      console.log(`Processing page: ${page.src?.path || "unknown page"}`);
      console.log(`Original content snippet (first 200 chars): ${content.substring(0, 200)}`);

      let updated = content;
      let modified = false;

      // Check for Pagefind CSS link BEFORE replacement
      const cssMatch = content.match(/<link\s+[^>]*href=["']\/pagefind\/pagefind-ui\.css["'][^>]*>/gi);
      if (cssMatch) {
        console.log(`Found Pagefind CSS link on ${page.src?.path}: ${cssMatch[0]}`);
      } else {
        console.log(`❌ Pagefind CSS link NOT found on ${page.src?.path}`);
      }

      updated = updated.replace(
        /<link\s+[^>]*href=["']\/pagefind\/pagefind-ui\.css["'][^>]*>/gi,
        `<link rel="stylesheet" href="/pagefind/pagefind-ui.css" media="print" onload="this.media='all'">`
      );

      // Check for Pagefind JS script BEFORE replacement
      const jsMatch = content.match(/<script\s+[^>]*src=["']\/pagefind\/pagefind-ui\.js["'][^>]*><\/script>/gi);
      if (jsMatch) {
        console.log(`Found Pagefind JS script on ${page.src?.path}: ${jsMatch[0]}`);
      } else {
        console.log(`❌ Pagefind JS script NOT found on ${page.src?.path}`);
      }

      updated = updated.replace(
        /<script\s+[^>]*src=["']\/pagefind\/pagefind-ui\.js["'][^>]*><\/script>/gi,
        `<script type="text/javascript" src="/pagefind/pagefind-ui.js" defer></script>`
      );

      if (updated !== content) {
        page.content = updated;
        console.log(`✅ Modified: ${page.src?.path || "unknown page"}`);
        console.log(`Updated content snippet (first 200 chars): ${page.content.substring(0, 200)}`);
      } else {
        console.log(`No changes made to: ${page.src?.path || "unknown page"}`);
      }
    }
    console.log("Finished deferPagefind script.");
  };
}
