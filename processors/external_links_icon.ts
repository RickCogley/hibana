/**
 * @file This file contains a Lume processor for adding an external link icon to external anchors, assuming Tailwind 4.
 * @author Rick Cogley
 */

import type { Page } from "../types/lume.ts";

/**
 * Adds an external link icon to `<a>` anchor elements that point to external sites.
 * Skips links inside elements with the class `.no-external-icon`.
 *
 * @param siteUrlInput - The base URL of the site. If not provided, defaults to `https://example.com`.
 * @returns A Lume plugin function that processes pages.
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
export default function externalLinksIcon(siteUrlInput?: string | URL) {
  const fallbackUrl = new URL("https://example.com");
  const siteUrl = siteUrlInput
    ? siteUrlInput instanceof URL
      ? siteUrlInput
      : new URL(siteUrlInput)
    : fallbackUrl;

  /**
   * The plugin function that processes each page.
   * @param pages An array of Lume Page objects.
   * @returns A promise that resolves when all pages have been processed.
   */
  return (pages: Page[]) => {
    for (const page of pages) {
      const document = page.document;
      if (!document) continue;

      // Select all links that open in a new tab
      const links = document.querySelectorAll("a[target='_blank']");

      for (const link of links) {
        // Skip links explicitly marked not to have an external icon
        if (link.closest(".no-external-icon")) continue;

        const href = link.getAttribute("href");
        // Skip empty hrefs or internal anchor links
        if (!href || href.startsWith("#")) continue;

        try {
          // Resolve the link URL relative to the current site URL
          const linkUrl = new URL(href, siteUrl);

          // Determine if the link is external (different protocol, hostname, or port)
          const isExternal =
            (linkUrl.protocol === "http:" || linkUrl.protocol === "https:") &&
            (linkUrl.protocol !== siteUrl.protocol ||
              linkUrl.hostname !== siteUrl.hostname ||
              linkUrl.port !== siteUrl.port);

          if (isExternal) {
            // Add a Tailwind CSS class to append an external link icon (↗)
            link.classList.add("after:content-['_↗']");
          }
        } catch (e) {
          console.error(
            `❌ Could not parse URL for link: ${href} on page ${page.src?.path ?? "unknown"}`,
            e,
          );
        }
      }

      console.log(`🔗 Processed external links on: ${page.src?.path ?? "unknown"}`);
    }
  };
}
