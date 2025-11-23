/**
 * @file Lume processor to inject TOC HTML into Vento pages at marker position.
 * @author Rick Cogley
 *
 * This works around the limitation that processors run after layout rendering,
 * so we can't pass TOC data to layouts. Instead, we inject HTML directly.
 */

import type { Page } from "../types/lume.ts";
import type { TOCNode } from "../types/vento_toc.ts";

const INJECTION_MARKER = "<!-- VENTO-TOC-INJECTION-POINT:";

/**
 * Generates TOC HTML from TOC data structure
 */
function generateTOCHTML(
  toc: TOCNode[],
  hasPunchlistOrTopic: boolean,
  i18nLabel: string = "On this page",
): string {
  if (!toc || toc.length === 0) return "";

  const borderClass = hasPunchlistOrTopic
    ? "mt-8 pt-8 border-t border-accent-200 dark:border-accent-700"
    : "";

  let html = `
<nav
  aria-labelledby="on-this-page-title"
  class="w-56 ${borderClass}"
>
  <h2
    id="on-this-page-title"
    class="font-display text-sm font-medium text-accent-900 dark:text-white"
  >
    ${i18nLabel}
  </h2>
  <ol role="list" class="mt-4 space-y-3 text-sm">`;

  for (const section of toc) {
    html += `
    <li>
      <h3>
        <a
          href="#${section.slug}"
          class="toc-link font-normal text-accent-500 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
          data-toc-id="${section.slug}"
        >
          ${section.text}
        </a>
      </h3>`;

    if (section.children && section.children.length > 0) {
      html += `
      <ol
        role="list"
        class="mt-2 space-y-3 pl-5 text-accent-500 dark:text-accent-400"
      >`;

      for (const child of section.children) {
        html += `
        <li>
          <a
            href="#${child.slug}"
            class="toc-link hover:text-accent-600 dark:hover:text-accent-300"
            data-toc-id="${child.slug}"
          >
            ${child.text}
          </a>
        </li>`;
      }

      html += `
      </ol>`;
    }

    html += `
    </li>`;
  }

  html += `
  </ol>
</nav>`;

  return html;
}

/**
 * Checks if page has punchlist or topic (affects TOC styling)
 */
function hasPunchlistOrTopic(page: Page): boolean {
  const hasPunchlist = page.data?.punchlist?.items?.length > 0;
  const hasTopic = !!page.data?.topic;
  return hasPunchlist || hasTopic;
}

/**
 * Injects TOC HTML into pages at the injection marker
 */
export default function ventoTOCInject(): (pages: Page[]) => void {
  let injectedCount = 0;

  return function ventoTOCInjectProcessor(pages: Page[]) {
    for (const page of pages) {
      // Only process pages with TOC data and show_toc not false
      if (!page.data?.toc || page.data?.show_toc === false) {
        continue;
      }

      // Get page content as string
      const content = typeof page.content === "string"
        ? page.content
        : new TextDecoder().decode(page.content);

      // Check if marker exists
      if (!content.includes(INJECTION_MARKER)) {
        continue;
      }

      // Get i18n label
      const i18nLabel = page.data?.i18n?.on_this_page || "On this page";

      // Generate TOC HTML
      const tocHTML = generateTOCHTML(
        page.data.toc as TOCNode[],
        hasPunchlistOrTopic(page),
        i18nLabel,
      );

      // Find the marker line and replace it with TOC HTML
      const markerRegex = /<!--\s*VENTO-TOC-INJECTION-POINT:.*?-->/;
      const newContent = content.replace(markerRegex, tocHTML);

      // Update page content
      page.content = newContent;
      injectedCount++;
    }

    if (injectedCount > 0) {
      console.log(
        `✅ ventoTOCInject: Injected TOC HTML into ${injectedCount} page(s)`,
      );
    }
  };
}
