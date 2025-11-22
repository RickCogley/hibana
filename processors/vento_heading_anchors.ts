/**
 * @file Lume processor to add anchor links to headings in Vento-rendered pages.
 * @author Rick Cogley
 */

import type { Page } from "../types/lume.ts";
import type { HeadingAnchorsOptions } from "../types/vento_toc.ts";
import { extractHeadingElements, getHeadingText } from "../utils/headings.ts";
import { UniqueSlugGenerator } from "../utils/slugify.ts";

/** Default options for heading anchors processor
 *
 * Defaults match markdown-it-toc-done-right behavior:
 * - Anchor wraps heading text (anchorPosition: "inside")
 * - No visible symbol (anchorSymbol: "") - expects CSS ::before icon
 * - Uses "header-anchor" class for styling hook
 */
export const defaults: Required<
  Omit<HeadingAnchorsOptions, "slugify">
> & Pick<HeadingAnchorsOptions, "slugify"> = {
  level: 2,
  maxLevel: 6,
  tabIndex: -1,
  anchorPosition: "inside", // Match markdown-it: wrap heading text in anchor
  anchorClass: "header-anchor",
  anchorSymbol: "", // Empty by default - use CSS ::before for icon
  ariaLabel: "Permalink",
  includeTemplateEngines: ["vto"],
  slugify: undefined,
};

/**
 * Checks if a page should be processed based on its template engine.
 */
function shouldProcessPage(
  page: Page,
  includeTemplateEngines: string[],
): boolean {
  const engine = page.data?.templateEngine;

  if (!engine) {
    return false;
  }

  // Handle both string and array template engines
  if (typeof engine === "string") {
    return includeTemplateEngines.includes(engine);
  }

  if (Array.isArray(engine)) {
    return engine.some((e) => includeTemplateEngines.includes(e));
  }

  return false;
}

/**
 * Adds ID and anchor links to heading elements in Vento-rendered pages.
 *
 * This processor:
 * - Adds unique `id` attributes to headings
 * - Optionally adds `tabindex` attributes for keyboard navigation
 * - Inserts anchor links (# symbols) for deep linking
 * - Handles duplicate headings with numbered suffixes
 * - Only processes pages rendered with specified template engines (default: Vento)
 *
 * @param userOptions - Configuration options
 * @returns A Lume processor function
 *
 * @example
 * ```ts
 * // In your Lume _config.ts:
 * import { ventoHeadingAnchors } from "hibana/mod.ts";
 *
 * const site = lume();
 *
 * // Add heading anchors to Vento pages (matches markdown-it style by default)
 * site.process([".html"], ventoHeadingAnchors({
 *   level: 2,              // Start at h2
 *   maxLevel: 4,           // End at h4
 * }));
 *
 * // Or customize for different style (e.g., visible # symbol outside)
 * site.process([".html"], ventoHeadingAnchors({
 *   anchorPosition: "outside",  // Place anchor after heading text
 *   anchorSymbol: "#",          // Visible # symbol
 * }));
 * ```
 *
 * @example
 * ```html
 * <!-- Input -->
 * <h2>Introduction</h2>
 * <h3>Getting Started</h3>
 *
 * <!-- Output (default: anchorPosition "inside", no symbol) -->
 * <h2 id="introduction" tabindex="-1">
 *   <a href="#introduction" class="header-anchor" aria-label="Permalink">Introduction</a>
 * </h2>
 * <h3 id="getting-started" tabindex="-1">
 *   <a href="#getting-started" class="header-anchor" aria-label="Permalink">Getting Started</a>
 * </h3>
 *
 * <!-- Styled with CSS ::before for link icon (like markdown-it-toc-done-right) -->
 * ```
 */
export default function ventoHeadingAnchors(
  userOptions: HeadingAnchorsOptions = {},
) {
  // Merge user options with defaults
  const options: Required<Omit<HeadingAnchorsOptions, "slugify">> & {
    slugify?: (text: string) => string;
  } = {
    ...defaults,
    ...userOptions,
  };

  let processedPages = 0;
  let addedAnchors = 0;

  return function ventoHeadingAnchorsProcessor(pages: Page[]) {
    for (const page of pages) {
      // Skip pages that shouldn't be processed
      if (!shouldProcessPage(page, options.includeTemplateEngines)) {
        continue;
      }

      const document = page.document;
      if (!document) continue;

      // Skip if already processed (check for marker)
      if (page.data?.headingAnchorsAdded) {
        continue;
      }

      // Extract heading elements
      const headings = extractHeadingElements(
        document,
        options.level,
        options.maxLevel,
      );

      if (headings.length === 0) {
        continue;
      }

      // Generate unique slugs
      const slugGenerator = new UniqueSlugGenerator();

      for (const heading of headings) {
        const text = getHeadingText(heading);
        const slug = options.slugify
          ? slugGenerator.generate(text)
          : slugGenerator.generate(text);

        // Add id attribute
        heading.setAttribute("id", slug);

        // Add tabindex if specified
        if (options.tabIndex !== false) {
          heading.setAttribute("tabindex", String(options.tabIndex));
        }

        // Create anchor link
        const anchor = document.createElement("a");
        anchor.setAttribute("href", `#${slug}`);
        anchor.setAttribute("class", options.anchorClass);
        anchor.setAttribute("aria-label", options.ariaLabel);
        anchor.textContent = options.anchorSymbol;

        if (options.anchorPosition === "inside") {
          // Wrap heading content in anchor
          const originalContent = heading.innerHTML;
          heading.innerHTML = "";
          anchor.innerHTML = originalContent;
          heading.appendChild(anchor);
        } else {
          // Append anchor after heading content
          heading.appendChild(anchor);
        }

        addedAnchors++;
      }

      // Mark page as processed
      page.data.headingAnchorsAdded = true;
      processedPages++;
    }

    // Log summary
    if (processedPages > 0) {
      console.log(
        `🔗 ventoHeadingAnchors: Processed ${processedPages} page(s), added ${addedAnchors} anchor(s)`,
      );
    }
  };
}
