/**
 * @file Lume processor to generate table of contents from headings in Vento-rendered pages.
 * @author Rick Cogley
 */

import type { Page } from "../types/lume.ts";
import type { TOCGeneratorOptions, TOCNode } from "../types/vento_toc.ts";
import {
  extractHeadingElements,
  getHeadingLevel,
  getHeadingText,
} from "../utils/headings.ts";

/** Default options for TOC generator processor */
export const defaults: Required<TOCGeneratorOptions> = {
  level: 2,
  maxLevel: 6,
  key: "toc",
  includeTemplateEngines: ["vto"],
};

/**
 * Checks if a page should be processed based on its template engine.
 *
 * IMPORTANT: Skips markdown pages even if they also use Vento, since
 * markdown-it plugins already handle TOC generation for those pages.
 */
function shouldProcessPage(
  page: Page,
  includeTemplateEngines: string[],
): boolean {
  const engine = page.data?.templateEngine;

  if (!engine) {
    return false;
  }

  // Skip markdown pages - they get TOC from markdown-it plugins
  if (typeof engine === "string") {
    if (engine === "md") return false;
    return includeTemplateEngines.includes(engine);
  }

  if (Array.isArray(engine)) {
    // Skip if markdown is in the chain (e.g., ["md", "vto"])
    if (engine.includes("md")) return false;
    return engine.some((e) => includeTemplateEngines.includes(e));
  }

  return false;
}

/**
 * Builds a hierarchical TOC tree from flat heading data.
 *
 * @param headings - Array of heading elements with IDs
 * @param pageUrl - URL of the current page
 * @returns Hierarchical array of TOC nodes
 */
function buildTOCTree(
  headings: Array<{ level: number; text: string; slug: string }>,
  pageUrl: string,
): TOCNode[] {
  const root: TOCNode = {
    level: 0,
    text: "",
    slug: "",
    url: "",
    children: [],
  };
  const stack: TOCNode[] = [root];

  for (const heading of headings) {
    const url = `${pageUrl}#${heading.slug}`;
    const node: TOCNode = {
      level: heading.level,
      text: heading.text,
      slug: heading.slug,
      url,
      children: [],
    };

    // Find the correct parent in the stack
    while (stack.length > 1 && stack[0].level >= node.level) {
      stack.shift();
    }

    // Add to parent's children
    stack[0].children.push(node);

    // Add to stack for potential children
    stack.unshift(node);
  }

  return root.children;
}

/**
 * Generates a table of contents (TOC) from headings in Vento-rendered pages.
 *
 * This processor:
 * - Extracts heading elements with IDs (assumes headings already have IDs from ventoHeadingAnchors)
 * - Builds a hierarchical tree structure
 * - Stores TOC in `page.data.toc` for use in templates
 * - Only processes pages rendered with specified template engines (default: Vento)
 *
 * **Important:** This processor should run AFTER `ventoHeadingAnchors` to ensure headings have IDs.
 *
 * @param userOptions - Configuration options
 * @returns A Lume processor function
 *
 * @example
 * ```ts
 * // In your Lume _config.ts:
 * import { ventoHeadingAnchors, ventoTOC } from "hibana/mod.ts";
 *
 * const site = lume();
 *
 * // IMPORTANT: Add anchors BEFORE generating TOC
 * site.process([".html"], ventoHeadingAnchors({
 *   level: 2,
 *   maxLevel: 4,
 * }));
 *
 * site.process([".html"], ventoTOC({
 *   level: 2,
 *   maxLevel: 4,
 *   key: "toc",  // Stores in page.data.toc
 * }));
 * ```
 *
 * @example
 * ```vto
 * <!-- In your layout template -->
 * {{ if toc && toc.length > 0 }}
 *   <nav class="toc">
 *     <h2>Table of Contents</h2>
 *     <ul>
 *       {{ for item of toc }}
 *         <li>
 *           <a href="{{ item.url }}">{{ item.text }}</a>
 *           {{ if item.children.length > 0 }}
 *             <ul>
 *               {{ for child of item.children }}
 *                 <li><a href="{{ child.url }}">{{ child.text }}</a></li>
 *               {{ /for }}
 *             </ul>
 *           {{ /if }}
 *         </li>
 *       {{ /for }}
 *     </ul>
 *   </nav>
 * {{ /if }}
 * ```
 */
export default function ventoTOC(
  userOptions: TOCGeneratorOptions = {},
) {
  // Merge user options with defaults
  const options: Required<TOCGeneratorOptions> = {
    ...defaults,
    ...userOptions,
  };

  let processedPages = 0;
  let generatedTOCs = 0;

  return function ventoTOCProcessor(pages: Page[]) {
    for (const page of pages) {
      // Skip pages that shouldn't be processed
      if (!shouldProcessPage(page, options.includeTemplateEngines)) {
        continue;
      }

      const document = page.document;
      if (!document) continue;

      // Skip if TOC already exists (from markdown-it or previous run)
      if (page.data?.[options.key]) {
        continue;
      }

      // Extract heading elements
      const headings = extractHeadingElements(
        document,
        options.level,
        options.maxLevel,
        options.containerSelector,
      );

      if (headings.length === 0) {
        continue;
      }

      // Extract heading data (text, level, slug from id attribute)
      const headingData = headings.map((element) => {
        const level = getHeadingLevel(element);
        const text = getHeadingText(element);
        const slug = element.getAttribute("id") || "";

        // Warn if heading doesn't have an ID
        if (!slug) {
          console.warn(
            `⚠️  ventoTOC: Heading "${text}" on page ${page.data?.url || "unknown"} has no ID attribute. ` +
              `Run ventoHeadingAnchors processor first.`,
          );
        }

        return { level, text, slug };
      }).filter((h) => h.slug !== ""); // Filter out headings without IDs

      if (headingData.length === 0) {
        continue;
      }

      // Build hierarchical TOC tree
      const pageUrl = page.data?.url || "";
      const toc = buildTOCTree(headingData, pageUrl);

      // Store TOC in page data
      page.data[options.key] = toc;

      generatedTOCs++;
      processedPages++;
    }

    // Log summary
    if (processedPages > 0) {
      console.log(
        `📑 ventoTOC: Processed ${processedPages} page(s), generated ${generatedTOCs} TOC(s)`,
      );
    }
  };
}
