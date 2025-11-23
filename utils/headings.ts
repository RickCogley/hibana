/**
 * @file Utilities for extracting and processing heading elements from HTML.
 * @author Rick Cogley
 */

import type { HeadingData } from "../types/vento_toc.ts";

/**
 * Extracts heading elements from a document or container.
 *
 * @param document - The DOM document to extract headings from
 * @param minLevel - Minimum heading level to include (default: 2)
 * @param maxLevel - Maximum heading level to include (default: 6)
 * @param containerSelector - Optional CSS selector to limit extraction scope (e.g., "article", "#main-content")
 * @returns Array of heading elements
 *
 * @example
 * ```ts
 * // Extract all h2-h4 from entire document
 * const headings = extractHeadingElements(page.document, 2, 4);
 *
 * // Extract only from main content area
 * const contentHeadings = extractHeadingElements(page.document, 2, 4, "article");
 * ```
 */
export function extractHeadingElements(
  document: Document,
  minLevel = 2,
  maxLevel = 6,
  containerSelector?: string,
): Element[] {
  // Generate selector for heading levels (e.g., "h2, h3, h4")
  const levels: string[] = [];
  for (let i = minLevel; i <= maxLevel; i++) {
    levels.push(`h${i}`);
  }
  const headingSelector = levels.join(", ");

  // If container selector provided, scope to that container
  if (containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) {
      console.warn(
        `⚠️  extractHeadingElements: Container "${containerSelector}" not found`,
      );
      return [];
    }
    return Array.from(container.querySelectorAll(headingSelector));
  }

  return Array.from(document.querySelectorAll(headingSelector));
}

/**
 * Extracts text content from a heading element, stripping HTML tags.
 *
 * @param element - The heading element
 * @returns Plain text content
 *
 * @example
 * ```ts
 * const heading = document.querySelector("h2");
 * const text = getHeadingText(heading);
 * // Returns plain text without HTML tags
 * ```
 */
export function getHeadingText(element: Element): string {
  // Get text content, which automatically strips HTML
  return element.textContent?.trim() || "";
}

/**
 * Gets the heading level from an element's tag name.
 *
 * @param element - The heading element
 * @returns Heading level (2-6)
 *
 * @example
 * ```ts
 * const h2 = document.querySelector("h2");
 * getHeadingLevel(h2); // 2
 * ```
 */
export function getHeadingLevel(element: Element): number {
  const tagName = element.tagName.toLowerCase();
  return parseInt(tagName.substring(1), 10);
}

/**
 * Extracts heading data from elements.
 *
 * @param elements - Array of heading elements
 * @param slugify - Function to generate slugs from text
 * @returns Array of heading data objects
 */
export function extractHeadingData(
  elements: Element[],
  slugify: (text: string) => string,
): HeadingData[] {
  return elements.map((element) => ({
    level: getHeadingLevel(element),
    text: getHeadingText(element),
    slug: "", // Will be filled in by slug generator
    element,
  })).map((heading, _index, allHeadings) => {
    // Generate slug from text
    heading.slug = slugify(heading.text);
    return heading;
  });
}
