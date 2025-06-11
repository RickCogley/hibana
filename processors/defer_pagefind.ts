import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import type { Page } from "../types/lume.ts";

export default function deferPagefind() {
  console.log("✅ deferPagefind plugin loaded");

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
