import type { Page } from "../types/lume.ts";

export default function externalLinksIcon(siteUrl?: URL) {
  const fallbackUrl = new URL("https://blog.esolia.pro");
  const baseUrl = siteUrl instanceof URL ? siteUrl : fallbackUrl;

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
          const linkUrl = new URL(href, baseUrl);

          const isExternal =
            (linkUrl.protocol === "http:" || linkUrl.protocol === "https:") &&
            (linkUrl.protocol !== baseUrl.protocol ||
              linkUrl.hostname !== baseUrl.hostname ||
              linkUrl.port !== baseUrl.port);

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
