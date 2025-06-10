import type { Page } from "../types/lume.ts";

/**
 * Adds an external link icon to <a target="_blank"> elements that point to external sites.
 * Skips links inside elements with the class `.no-external-icon`.
 *
 * @param siteUrlInput - The base URL of the site, as a string or URL object.
 */
export default function externalLinksIcon(siteUrlInput?: string | URL) {
  const fallbackUrl = new URL("https://example.com");
  const siteUrl = siteUrlInput
    ? siteUrlInput instanceof URL
      ? siteUrlInput
      : new URL(siteUrlInput)
    : fallbackUrl;

  return (pages: Page[]) => {
    for (const page of pages) {
      const document = page.document;
      if (!document) continue;

      const links = document.querySelectorAll("a[target='_blank']");

      for (const link of links) {
        if (link.closest(".no-external-icon")) continue;

        const href = link.getAttribute("href");
        if (!href || href.startsWith("#")) continue;

        try {
          const linkUrl = new URL(href, siteUrl);

          const isExternal =
            (linkUrl.protocol === "http:" || linkUrl.protocol === "https:") &&
            (linkUrl.protocol !== siteUrl.protocol ||
              linkUrl.hostname !== siteUrl.hostname ||
              linkUrl.port !== siteUrl.port);

          if (isExternal) {
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
