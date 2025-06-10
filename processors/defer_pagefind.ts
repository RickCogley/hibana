// defer_pagefind.ts searches html pages for Pagefind CSS and JS links,
// and modifies them to load with `defer` and `media="print"` attributes, so they don't block rendering.

import type { Page } from "../types/lume.ts";

export default function deferPagefind() {
  return (pages: Page[]) => {
    for (const page of pages) {
      const content = page.content;
      if (typeof content !== "string") continue;

      let updated = content;
      let modified = false;

      // Replace Pagefind CSS link
      updated = updated.replace(
        /<link\s+[^>]*href=["']\/pagefind\/pagefind-ui\.css["'][^>]*>/gi,
        `<link rel="stylesheet" href="/pagefind/pagefind-ui.css" media="print" onload="this.media='all'">`
      );

      // Replace Pagefind JS script
      updated = updated.replace(
        /<script\s+[^>]*src=["']\/pagefind\/pagefind-ui\.js["'][^>]*><\/script>/gi,
        `<script type="text/javascript" src="/pagefind/pagefind-ui.js" defer></script>`
      );

      if (updated !== content) {
        page.content = updated;
        console.log(`✅ Modified: ${page.src?.path || "unknown page"}`);
      }
    }
  };
}

