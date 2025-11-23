/**
 * @file Simple slug generation utility for headings.
 * @author Rick Cogley
 */

/**
 * Converts text to a URL-safe slug.
 *
 * This is a simplified slugifier that:
 * - Converts to lowercase
 * - Removes HTML tags
 * - Replaces non-alphanumeric characters with hyphens
 * - Removes leading/trailing hyphens
 * - Collapses multiple hyphens
 *
 * @param text - The text to slugify
 * @returns A URL-safe slug
 *
 * @example
 * ```ts
 * slugify("Hello World!"); // "hello-world"
 * slugify("Table of Contents"); // "table-of-contents"
 * slugify("What's New?"); // "whats-new"
 * ```
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    // Remove HTML tags
    .replace(/<[^>]+>/g, "")
    // Replace spaces and special chars with hyphens
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, "");
}

/**
 * Generates unique slugs by appending numbers when duplicates are found.
 *
 * @example
 * ```ts
 * const generator = new UniqueSlugGenerator();
 * generator.generate("intro"); // "intro"
 * generator.generate("intro"); // "intro-1"
 * generator.generate("intro"); // "intro-2"
 * ```
 */
export class UniqueSlugGenerator {
  private slugs = new Set<string>();

  /**
   * Generate a unique slug, appending a number if the slug already exists.
   *
   * @param text - The text to slugify
   * @returns A unique slug
   */
  generate(text: string): string {
    let slug = slugify(text);

    // If slug is empty, use a default
    if (!slug) {
      slug = "heading";
    }

    // Make it unique by appending numbers
    let uniqueSlug = slug;
    let counter = 1;

    while (this.slugs.has(uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    this.slugs.add(uniqueSlug);
    return uniqueSlug;
  }

  /**
   * Clear all generated slugs (useful for processing multiple pages).
   */
  clear(): void {
    this.slugs.clear();
  }
}
