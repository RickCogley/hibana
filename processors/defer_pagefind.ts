/**
 * @file This file contains a Lume processor for deferring Pagefind plugin CSS and JS loading.
 * @author Rick Cogley
 */


import { DOMParser } from "deno_dom";
import type { Page } from "../types/lume.ts";

/**
 * Lume plugin to defer the loading of Pagefind CSS and JS.
 *
 * This plugin modifies the Pagefind CSS link and JS script tags
 * to ensure they are loaded asynchronously, improving page load performance.
 *
 * It sets `media="print"` and `onload="this.media='all'"` on the CSS link
 * and adds the `defer` attribute to the JS script.
 *
 * @returns A Lume plugin function that processes pages.
 * 
 * @example
 * // In your Lume _config.ts:
 * import lume from "lume/mod.ts";
 * import { deferPagefind, externalLinksIcon } from "hibana/mod.ts";
 *
 * const site = lume();
 *
 * // == NEAR BOTTOM of your _config.ts, after other plugins:
 * // Specify the base URL
 * site.process([".html"], externalLinksIcon("https://esolia.co.jp"));
 * site.process([".html"], deferPagefind());
 *
 * export default site;
 */
export default function deferPagefind() {
  console.log("✅ deferPagefind plugin loaded");

  /**
   * The plugin function that processes each page.
   * @param pages An array of Lume Page objects.
   * @returns A promise that resolves when all pages have been processed.
   */
  return (pages: Page[]) => {
    for (const page of pages) {
      if (typeof page.content !== "string") continue;

      const doc = new DOMParser().parseFromString(page.content, "text/html");
      if (!doc) {
        console.warn(`⚠️ Could not parse HTML for: ${page.src?.path || "unknown page"}`);
        continue;
      }

      let modified = false;

      // Modify Pagefind CSS link
      const cssLink = doc.querySelector('link[href="/pagefind/pagefind-ui.css"]');
      if (cssLink) {
        cssLink.setAttribute("media", "print");
        cssLink.setAttribute("onload", "this.media='all'");
        modified = true;
        console.log(`🔧 Modified CSS link in: ${page.src?.path}`);
      }

      // Modify Pagefind JS script
      const jsScript = doc.querySelector('script[src="/pagefind/pagefind-ui.js"]');
      if (jsScript) {
        jsScript.setAttribute("defer", "");
        modified = true;
        console.log(`🔧 Modified JS script in: ${page.src?.path}`);
      }

      if (modified) {
        page.content = doc.documentElement?.outerHTML || page.content;
        console.log(`✅ Finalized modifications for: ${page.src?.path}`);
      }
    }
  };
}
