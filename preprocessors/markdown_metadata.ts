/**
 * Markdown metadata preprocessor for Lume
 *
 * Extracts excerpt from content (before `<!-- more -->` marker) and calculates
 * elapsed days since publication using the Temporal API.
 *
 * @module preprocessors/markdown_metadata
 * @author Rick Cogley
 * @license MIT
 *
 * @example
 * ```ts
 * // In _config.ts
 * import { markdownMetadata } from "hibana/preprocessors/markdown_metadata.ts";
 *
 * site.preprocess([".md"], markdownMetadata({
 *   excerptMarker: "<!-- more -->",
 *   calculateElapsed: true,
 * }));
 * ```
 *
 * @example
 * ```md
 * <!-- In markdown file -->
 * This is the excerpt that will be extracted.
 *
 * <!-- more -->
 *
 * This is the rest of the content.
 * ```
 *
 * @example
 * ```vto
 * <!-- In template -->
 * {{ excerpt }}
 * {{ if elapseddays < 30 }}
 *   <span>New!</span>
 * {{ /if }}
 * ```
 */

/**
 * Configuration options for markdown metadata extraction
 */
export interface MarkdownMetadataOptions {
  /**
   * The marker string that separates excerpt from full content
   * @default "<!-- more -->"
   */
  excerptMarker?: string;

  /**
   * Whether to calculate elapsed days since publication
   * @default true
   */
  calculateElapsed?: boolean;

  /**
   * Regular expression pattern for the excerpt marker
   * If provided, overrides excerptMarker
   */
  excerptPattern?: RegExp;
}

/**
 * Creates a markdown metadata preprocessor
 *
 * This preprocessor:
 * 1. Extracts the excerpt from content before the marker
 * 2. Calculates days elapsed since the page date (using Temporal API)
 * 3. Sets `page.data.excerpt` and `page.data.elapseddays`
 *
 * @param options - Configuration options
 * @returns Preprocessor function compatible with Lume's site.preprocess()
 *
 * @example
 * ```ts
 * const preprocessor = markdownMetadata({
 *   excerptMarker: "<!-- read more -->",
 *   calculateElapsed: true,
 * });
 * site.preprocess([".md"], preprocessor);
 * ```
 */
export default function markdownMetadata(
  options: MarkdownMetadataOptions = {},
  // deno-lint-ignore no-explicit-any
): (pages: any[]) => void {
  const {
    excerptMarker = "<!-- more -->",
    calculateElapsed = true,
    excerptPattern,
  } = options;

  // Create regex pattern for excerpt marker
  const pattern = excerptPattern ||
    new RegExp(
      `<!--\\s*${
        excerptMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace("<!--", "")
          .replace("-->", "").trim()
      }\\s*-->`,
      "i",
    );

  // deno-lint-ignore no-explicit-any
  return (pages: any[]): void => {
    const now = calculateElapsed ? Temporal.Now.instant() : null;

    for (const page of pages) {
      // Extract excerpt if not already set
      if (!page.data.excerpt && page.data.content) {
        const content = page.data.content as string;
        const parts = content.split(pattern);
        page.data.excerpt = parts[0];
      }

      // Calculate elapsed days if enabled and page has a date
      if (calculateElapsed && now && page.data.date) {
        try {
          const pageDate = Temporal.Instant.fromEpochMilliseconds(
            page.data.date.getTime(),
          );
          const duration = now.since(pageDate);
          page.data.elapseddays = duration.total({ unit: "days" });
        } catch (error) {
          console.warn(
            `Failed to calculate elapsed days for ${page.src.path}:`,
            error,
          );
          page.data.elapseddays = 0;
        }
      }
    }
  };
}
